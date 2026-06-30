/**
 * sync-shopify-to-firebase.mjs
 *
 * Fetches all products from Shopify Storefront API, merges with rich local
 * metadata (tasting notes, gallery images, hero images, descriptions, reviews)
 * from collections.ts, then pushes the unified dataset to Firestore.
 *
 * Usage:
 *   node scripts/sync-shopify-to-firebase.mjs
 *
 * Reads from:
 *   - Shopify Storefront API (live prices, variants, availability)
 *   - src/data/collections.ts (rich metadata: images, tasting notes, etc.)
 *   - src/data/movement.ts (movement products)
 *
 * Writes to Firestore:
 *   - settings/admin_cache  — full AdminCache document
 *   - products/<id>         — individual product documents
 *   - collections/<id>      — collection config documents
 *   - movement_products/<id>— movement product documents
 */

import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// ─── Firebase (client SDK — same config as the browser app) ─────────────────
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, writeBatch } = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyA28hADmQrb8QhZ1Pkz3AMFWP1t_brPk0U',
  authDomain: 'beansofbodhi-b45f9.firebaseapp.com',
  projectId: 'beansofbodhi-b45f9',
  storageBucket: 'beansofbodhi-b45f9.firebasestorage.app',
  messagingSenderId: '461193596822',
  appId: '1:461193596822:web:6b7651f7d6b503cc8917b7',
};

// ─── Shopify ─────────────────────────────────────────────────────────────────
const SHOPIFY_DOMAIN = 'beansofbodhi.myshopify.com';
const SHOPIFY_TOKEN = 'b8f1f60c294032ca5816afa179b3636c';
const API_VERSION = '2023-10';

// ─── Hero slides (hardcoded — managed via admin panel) ───────────────────────
const defaultHeroSlides = [
  {
    type: 'video',
    url: '/videos/Bob_Main_Hero__2-transcode.mp4',
    mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/title_video.mp4',
  },
  {
    type: 'video',
    url: 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362',
    mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/movement.mp4',
  },
];

// ─── Fetch from Shopify ───────────────────────────────────────────────────────
async function fetchShopifyProducts() {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            tags
            images(first: 10) {
              edges {
                node { id src altText }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  console.log('  → Fetching products from Shopify...');
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables: { first: 250 } }),
  });

  const result = await res.json();
  if (result.errors) {
    console.error('  ✗ Shopify API errors:', result.errors);
    return [];
  }

  const edges = result.data.products.edges;
  console.log(`  ✓ Fetched ${edges.length} products from Shopify`);
  return edges.map(({ node }) => {
    const images = node.images.edges.map((e) => e.node);
    const variants = node.variants.edges.map((e) => ({
      id: e.node.id,
      title: e.node.title,
      price: `${e.node.price.amount} ${e.node.price.currencyCode}`,
      available: e.node.availableForSale,
    }));

    return {
      shopifyId: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description,
      shopifyPrice: variants.length > 0 ? parseFloat(variants[0].price) : 0,
      shopifyCurrency: variants.length > 0 ? variants[0].price.split(' ')[1] : 'INR',
      shopifyImage: images[0]?.src || '',
      shopifyVariants: variants,
    };
  });
}

// ─── Batch write helper ───────────────────────────────────────────────────────
async function writeBatchedDocs(db, collectionName, items) {
  const colRef = collection(db, collectionName);
  const BATCH_SIZE = 490;
  let written = 0;
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const chunk = items.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    for (const item of chunk) {
      batch.set(doc(colRef, item.id), item);
    }
    await batch.commit();
    written += chunk.length;
  }
  return written;
}

// ─── Main sync ────────────────────────────────────────────────────────────────
async function sync() {
  console.log('\n🚀 Beans of Bodhi — Shopify → Firestore Sync\n');
  console.log('Step 1/5  Initialising Firebase...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  await signInAnonymously(auth);
  console.log('  ✓ Authenticated (anonymous)\n');

  // ── Step 2: Fetch Shopify data ─────────────────────────────────────────────
  console.log('Step 2/5  Fetching live data from Shopify...');
  const shopifyProducts = await fetchShopifyProducts();
  // Build a lookup by handle for fast merging
  const shopifyByHandle = {};
  for (const sp of shopifyProducts) {
    shopifyByHandle[sp.handle] = sp;
  }
  console.log();

  // ── Step 3: Load local metadata ────────────────────────────────────────────
  console.log('Step 3/5  Loading local metadata from collections.ts...');

  // We can't import TypeScript directly in a plain .mjs script, so we read the
  // pre-compiled shopify_products.json to get the handle→shopifyId mapping, and
  // load collections.ts data by requiring the compiled JS via tsx/esbuild.
  // For simplicity, we embed the rich metadata inline here (synced from collections.ts).
  // When you update collections.ts, re-run this script to push changes.

  const localProductsRaw = readFileSync(
    path.resolve(__dirname, '../src/data/shopify_products.json'),
    'utf-8'
  );
  const shopifyJsonProducts = JSON.parse(localProductsRaw);

  // Build shopifyId → handle map from the JSON file
  const idToHandle = {};
  for (const p of shopifyJsonProducts) {
    idToHandle[p.id] = p.handle;
  }

  // ── Rich metadata from collections.ts (embedded for Node compatibility) ────
  const richMetadata = {
    'the-origin': {
      id: 'the-origin',
      shopifyId: 'gid://shopify/Product/9746812141850',
      name: 'THE ORIGIN',
      title: 'The Origin',
      description: 'A nutty sweet blend of 60% Arabica, 20% Robusta and 20% Peaberry. This bold, fullbodied coffee embodies the untamed spirit of its origins, offering a taste of adventure with every sip',
      price: 'INR 799.00',
      heroImage: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Inside-Hero-Image_The-Origin-p-1600.png?updatedAt=1761228745235',
      heroImageMobile: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/The_Origin_Mob-p-800.jpg?updatedAt=1761228745108',
      productCardImage: 'https://ik.imagekit.io/beansofbodhi/Product%20Cards/OR.webp?updatedAt=1761230707571',
      galleryImages: [
        'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR2.webp?updatedAt=1761227480507',
        'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR1.webp?updatedAt=1761227480389',
        'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR3.webp?updatedAt=1761227480407',
        'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/7-p-800.jpg?updatedAt=1761227510274',
      ],
      traceability: { source: 'Sholayur, Attapadi, Wayanad', tasteNotes: ['White Chocolate', 'Soft Nutty', 'Sweet'], process: 'Natural', elevation: '3280ft' },
      descriptionContent: { title: 'Rooted in Nature. Preserving its legacy.', content: "The Origin is more than a coffee-it's a pledge to preserve the untamed wilderness and vibrant landscapes of the Western Ghats.", image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/Origin_1-p-1080.png?updatedAt=1759660224565' },
      category: 'signature-blends', featured: true, upcoming: false,
      reviews: [{ customerName: 'Shahajahan S.', rating: 5, date: '5 February 2026', purchase: 'Filter Grind, 250g', title: 'Recommended Coffee', content: "This is my favourite coffee in India now. Has been 4 months using Bean Of Bodhi's coffee for pour over, and they became my favourite. Especially High Tide and Origin. Recommend buy." }],
    },
    'the-wild-fire-rush': {
      id: 'the-wild-fire-rush',
      shopifyId: 'gid://shopify/Product/9746812338458',
      name: 'THE WILD FIRE RUSH',
      title: 'The Wild Fire Rush',
      description: "A smoky dark blend of 70% Arabica and 30% Robusta, dark roasted to perfection. Smoky and robust, it's a coffee that sparks energy and fuels your fiercest pursuits.",
      price: 'INR 799.00',
      heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Inside-Hero-Image_Wild-Fire-p-1600.png?updatedAt=1759650893936',
      heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Wild_Fire_Mob-p-800.jpg?updatedAt=1759650461721',
      productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush-p-500.png?updatedAt=1759660123080',
      galleryImages: [
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_02-p-1600.jpg?updatedAt=1759660123198',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_03-p-1600.jpg?updatedAt=1759660123161',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush-p-500.png?updatedAt=1759660123080',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_05-p-800.jpg?updatedAt=1759660123078',
      ],
      traceability: { source: 'Wayanad, Anaikatti', tasteNotes: ['Ripe Fruit', 'Cashew'], process: 'Natural', elevation: '3650ft' },
      descriptionContent: { title: 'Ignite Your Energy, Unleash the Wild', content: "Wild Fire Rush is more than just a cup of coffee — it's a spark for change. Every sip contributes to reforestation initiatives.", image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush_1-p-1080.png?updatedAt=1759660123237' },
      category: 'signature-blends', featured: true, upcoming: false,
      reviews: [{ customerName: 'Hridai', rating: 5, date: '5 February 2026', purchase: 'Cold Brew Grind, 250g', title: 'Go try it', content: 'Tried the wild fire rush from beans of bodhi, and it was a love at first hit! ⚡️' }],
    },
    'the-eco-shock': {
      id: 'the-eco-shock',
      shopifyId: 'gid://shopify/Product/9746812076314',
      name: 'THE ECO SHOCK',
      title: 'The Eco Shock',
      description: 'Step into a world of vibrant energy with Echo Shock, a playful blend of light roasted 100% Peaberry designed to awaken your senses.',
      price: 'INR 849.00',
      heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Inside-Header-p-1080.png?updatedAt=1759647315410',
      heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Eco_Shock_Mob-p-800.jpg?updatedAt=1759651050240',
      productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/ECO-SHOCK-FD-p-1600.png?updatedAt=1759660383927',
      galleryImages: [
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/ECO-SHOCK-FD-p-1600.png?updatedAt=1759660383927',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/ES_04-p-1600.jpg?updatedAt=1759660383899',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/ES_03-p-1080.jpg?updatedAt=1759660383859',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/2-p-800.jpg?updatedAt=1759660383622',
      ],
      traceability: { source: 'Attapadi', tasteNotes: ['Spice', 'Chocolate', 'Jaggery'], process: 'Natural', elevation: '3500ft' },
      descriptionContent: { title: 'Shock your senses. Safeguard the Wild', content: "Echo Shock is more than just a coffee — it's a commitment to protecting the wildlife that inspires us.", image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/Eco-shock_2-p-1080.png?updatedAt=1759660383892' },
      category: 'western-ghats-selects', featured: true, upcoming: false,
      reviews: [
        { customerName: 'Sreemon Sreeraj Ponath', rating: 5, date: '1 April 2026', purchase: 'V60 Grind, 250g', title: 'Great Coffee', content: 'Really enjoyed this coffee—smooth, rich flavor, not too bitter.' },
        { customerName: 'Aashish Nambiar', rating: 5, date: '1 April 2026', purchase: 'V60 Grind, 250g', title: 'Must Try', content: 'Smooth, rich, and worth every sip, Strong aroma, perfect start to my day.' },
      ],
    },
    'the-high-tide': {
      id: 'the-high-tide',
      shopifyId: 'gid://shopify/Product/9725860413722',
      name: 'THE HIGH TIDE',
      title: 'The High Tide',
      description: 'A washed clean 100% Arabica. Hints of floral undertones meet a crisp, refreshing finish, crafted for adventurers seeking clarity.',
      price: 'INR 899.00',
      heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Inside-Header-1-p-1600.png?updatedAt=1759651342901',
      heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Mobile-p-800.jpg?updatedAt=1759650461664',
      productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/High-Tide_1-p-500.png?updatedAt=1759660511839',
      galleryImages: [
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/High-Tide_1-p-500.png?updatedAt=1759660511839',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/1-p-800.jpg?updatedAt=1759660511738',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/4-HighTide-p-800.jpg?updatedAt=1759660511826',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/HT_02-p-1080.jpg?updatedAt=1759660511603',
      ],
      traceability: { source: 'Sholayur', tasteNotes: ['Sweet', 'Citric'], process: 'Natural', elevation: '3610ft' },
      descriptionContent: { title: 'A crisp finish. A lasting impact on our waters.', content: 'Inspired by the untamed power of the sea, High Tide is a 100% Arabica blend with smooth chocolatey undertones.', image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/HighTide.png?updatedAt=1759660511916' },
      category: 'western-ghats-selects', featured: true, upcoming: false,
      reviews: [],
    },
    'the-thunder-fuse': {
      id: 'the-thunder-fuse',
      shopifyId: 'gid://shopify/Product/9746812469530',
      name: 'THE THUNDER FUSE',
      title: 'The Thunder Fuse',
      description: 'A creamy 100% Wayanadan Robusta, with peanut and hints of dark chocolate that hits like a storm. Packed with an intense caffeine punch.',
      price: 'INR 749.00',
      heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/thunder--p-1080.jpg?updatedAt=1759647315069',
      heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Thunder_Fuse_Mob-p-800.jpg?updatedAt=1759650461428',
      productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_2-p-500.png?updatedAt=1759660698358',
      galleryImages: [
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_2-p-500.png?updatedAt=1759660698358',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-front-p-1600.png?updatedAt=1759660698292',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/TF_05-p-1080.jpg?updatedAt=1759660698155',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/TF_03-p-1080.jpg?updatedAt=1759660698180',
      ],
      traceability: { source: 'Wayanad', tasteNotes: ['Chocolate', 'Nutty', 'Sweet', 'Spices'], process: 'Natural', elevation: '4593ft' },
      descriptionContent: { title: 'Feel the surge. Power the future.', content: "Thunder Fuse isn't just about charging your day—it's about lighting up lives.", image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_3-p-1080.png?updatedAt=1759660698222' },
      category: 'western-ghats-selects', featured: true, upcoming: false,
      reviews: [{ customerName: 'Jahan', rating: 5, date: '7 April 2026', purchase: 'Whole beans, 250g', title: 'Really Good Coffee', content: "Really enjoyed this coffee. It's strong but still smooth, not harsh." }],
    },
    'the-tornado-twist': {
      id: 'the-tornado-twist',
      shopifyId: 'gid://shopify/Product/9746812535066',
      name: 'THE TORNADO TWIST',
      title: 'The Tornado Twist',
      description: "Our twisted blend of microlots for you. 50% Robusta and 50% Arabica. Citrus bursts? Maybe. A hint of fermented funk? Possibly.",
      price: 'INR 779.00',
      heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Inside-Hero-Image_Tornado-Twist-p-1080.png?updatedAt=1759647315384',
      heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Tornado_Twist_Mob-p-800.jpg?updatedAt=1759651612432',
      productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornoda-Twist-p-500.png?updatedAt=1759661242679',
      galleryImages: [
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_03-p-1080.jpg?updatedAt=1759656359706',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_01-p-1080.jpg?updatedAt=1759656359593',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_02-p-1080.jpg?updatedAt=1759656358730',
        'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornoda-Twist-p-500.png?updatedAt=1759661242679',
      ],
      traceability: { source: 'Yercaud, Wayanad', tasteNotes: ['Cocoa', 'Spice', 'Fruit', 'Hints of Floral'], process: 'Natural', elevation: '3650ft' },
      descriptionContent: { title: 'Fuel the adventure. Rebuild the future.', content: "Tornado Twist is more than a bold brew — it's a catalyst for change. Every sip fuels efforts to rebuild communities hit by floods.", image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornado-twist_2-p-1080.png?updatedAt=1759660032208' },
      category: 'signature-blends', featured: true, upcoming: false,
      reviews: [],
    },
    'the-liberica-funk': {
      id: 'the-liberica-funk',
      shopifyId: 'gid://shopify/Product/10122236789018',
      name: 'THE LIBERICA FUNK',
      title: 'The Liberica Funk',
      description: 'A wild, exotic single-origin Liberica with heavy body, sweet jackfruit aroma, and a clean cup. Heavy, sweet, and complex, it is a rare coffee that stands apart from Arabica and Robusta.',
      price: 'INR 932.00',
      heroImage: 'https://cdn.shopify.com/s/files/1/0918/6941/3658/files/IMG-1298.png?v=1770882427',
      heroImageMobile: 'https://cdn.shopify.com/s/files/1/0918/6941/3658/files/IMG-1298.png?v=1770882427',
      productCardImage: 'https://cdn.shopify.com/s/files/1/0918/6941/3658/files/IMG-1298.png?v=1770882427',
      galleryImages: ['https://cdn.shopify.com/s/files/1/0918/6941/3658/files/IMG-1298.png?v=1770882427'],
      traceability: { source: 'Western Ghats, Wayanad', tasteNotes: ['Jackfruit', 'Ripe Banana', 'Sweet Spice', 'Heavy Bodied'], process: 'Natural', elevation: '3100ft' },
      descriptionContent: { title: 'A Rare Legacy of Sweet Spice', content: 'Liberica Funk is a rare celebration of biodiversity in the coffee forests. Sourced from single microlots where Liberica plants grow tall like trees.', image: 'https://cdn.shopify.com/s/files/1/0918/6941/3658/files/IMG-1298.png?v=1770882427' },
      category: 'western-ghats-selects', featured: true, upcoming: false,
      reviews: [],
    },
    'gadgets': {
      id: 'gadgets',
      shopifyId: 'gid://shopify/Product/9859123511578',
      name: 'Gadgets',
      title: 'Gadgets',
      description: 'Coming soon - Gadgets',
      price: 'INR 7,499.00',
      heroImage: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
      heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
      productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
      galleryImages: [],
      traceability: { source: 'N/A', tasteNotes: [], process: 'N/A', elevation: 'N/A' },
      descriptionContent: { title: 'Coming Soon', content: 'Premium brewing equipment coming soon.', image: '' },
      category: 'gadgets', featured: false, upcoming: false,
      reviews: [{ customerName: 'Navaf Sharafudheen', rating: 5, date: '30 April 2026', purchase: 'Movement', title: 'Game changer', content: "I have been using Moment for a while now, and it's very portable and easy to make an espresso, no matter where you are.." }],
    },
  };

  // Collections config
  const collectionsConfig = [
    {
      id: 'western-ghats-selects',
      name: 'Western Ghats Selects',
      title: 'Western Ghats Selects',
      description: 'Premium coffee blends sourced from the pristine Western Ghats region, featuring our signature HIGH TIDE, ECO SHOCK, THUNDER FUSE, and LIBERICA FUNK varieties.',
      price: 'From ₹749',
      image: 'https://ik.imagekit.io/nzkbravfr/Collections/Western%20Ghats%20Select.webp?updatedAt=1761390411685',
      products: ['the-high-tide', 'the-eco-shock', 'the-thunder-fuse', 'the-liberica-funk'],
      featured: true, upcoming: false,
    },
    {
      id: 'signature-blends',
      name: 'Signature Blends',
      title: 'Signature Blends',
      description: 'Bold and adventurous coffee blends including THE ORIGIN, WILD FIRE RUSH, and TORNADO TWIST.',
      price: 'From ₹779',
      image: 'https://ik.imagekit.io/nzkbravfr/Collections/Signature%20Blends.webp?updatedAt=1761390411670',
      products: ['the-wild-fire-rush', 'the-origin', 'the-tornado-twist'],
      featured: true, upcoming: false,
    },
    {
      id: 'gadgets',
      name: 'Gadgets',
      title: 'Gadgets',
      description: 'Premium coffee brewing equipment and accessories to enhance your coffee experience.',
      price: 'From ₹7499',
      image: 'https://ik.imagekit.io/nzkbravfr/Collections/Gadgets.webp?updatedAt=1761390411909',
      products: ['gadgets'],
      featured: false, upcoming: false,
    },
    {
      id: 'merchandise',
      name: 'Merchandise',
      title: 'Merchandise',
      description: 'Beans of Bodhi branded merchandise including apparel, mugs, and accessories.',
      price: 'Coming Soon',
      image: 'https://ik.imagekit.io/nzkbravfr/Collections/Merchandise.webp?updatedAt=1761390411855',
      products: ['merchandise'],
      featured: true, upcoming: true,
    },
  ];

  const categoryLabels = {
    'western-ghats-selects': 'Western Ghats Selects',
    'signature-blends': 'Signature Blends',
    'gadgets': 'Gadgets',
    'merchandise': 'Merchandise',
    'microlots': 'Microlots',
  };

  // Movement products
  const movementProducts = [
    {
      id: 'movement',
      shopifyId: 'gid://shopify/Product/9859123511578',
      name: 'MOVEMENT',
      title: 'Movement',
      description: 'The Movement — a portable espresso maker built for people who love coffee on the go.',
      price: 'INR 7,499.00',
      heroImage: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
      heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
      productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
      galleryImages: [],
      traceability: { source: 'N/A', tasteNotes: [], process: 'N/A', elevation: 'N/A' },
      descriptionContent: { title: 'Espresso Anywhere', content: 'The Movement is a portable espresso device designed to deliver barista-quality espresso wherever you are.', image: '' },
      category: 'gadgets', featured: false, upcoming: false,
      shopifyVariants: [
        { id: 'gid://shopify/ProductVariant/50617988055322', title: 'Default Title', price: '7499.0', available: true }
      ],
      reviews: [
        { customerName: 'Navaf Sharafudheen', rating: 5, date: '30 April 2026', purchase: 'Movement', title: 'Game changer', content: "I have been using Moment for a while now, and it's very portable and easy to make an espresso, no matter where you are.." }
      ],
    },
  ];


  const headerProductIds = ['the-origin', 'the-wild-fire-rush', 'the-eco-shock', 'the-high-tide', 'the-thunder-fuse'];
  const featuredProductIds = Object.values(richMetadata).filter(p => p.featured).map(p => ({ productId: p.id }));

  console.log(`  ✓ Loaded ${Object.keys(richMetadata).length} products from local metadata\n`);

  // ── Step 4: Merge Shopify live data with local metadata ────────────────────
  console.log('Step 4/5  Merging Shopify data with local metadata...');

  const handleToLocalId = {
    'origin': 'the-origin',
    'wild-fire-rush': 'the-wild-fire-rush',
    'eco-shock': 'the-eco-shock',
    'high-tide': 'the-high-tide',
    'thunder-fuse': 'the-thunder-fuse',
    'tornado-twist': 'the-tornado-twist',
    'liberica-funk': 'the-liberica-funk',
    'movement': 'gadgets',
  };

  // Shopify variant overrides keyed by local product id
  const shopifyVariantMap = {};
  for (const [handle, localId] of Object.entries(handleToLocalId)) {
    const shopifyData = shopifyByHandle[handle];
    if (shopifyData && richMetadata[localId]) {
      // Normalise variant prices to INR string
      shopifyVariantMap[localId] = shopifyData.shopifyVariants.map(v => ({
        id: v.id,
        title: v.title,
        price: v.price.split(' ')[0], // "932.38 INR" → "932.38"
        available: v.available,
      }));
      // Update live price from Shopify
      const livePrice = shopifyData.shopifyPrice;
      if (livePrice > 0) {
        richMetadata[localId].price = `INR ${Math.round(livePrice).toLocaleString('en-IN')}.00`;
      }
      console.log(`  ✓ Merged: ${localId} ← Shopify/${handle} (${shopifyData.shopifyVariants.length} variants, ₹${livePrice})`);
    } else if (richMetadata[localId]) {
      console.log(`  ⚠  No Shopify match for ${localId} (handle: ${handle}) — using local metadata only`);
    }
  }

  // Build final products array with Shopify variants merged in
  const allProducts = Object.values(richMetadata).map(meta => {
    const shopifyVariants = shopifyVariantMap[meta.id];
    return {
      ...meta,
      shopifyVariants: shopifyVariants || meta.shopifyVariants || [],
    };
  });

  console.log(`\n  ✓ ${allProducts.length} products ready to sync\n`);

  // ── Step 5: Push to Firestore ──────────────────────────────────────────────
  console.log('Step 5/5  Pushing to Firestore...');

  // 5a — settings/admin_cache
  const adminCache = {
    version: 5,
    lastSynced: new Date().toISOString(),
    heroSettings: {
      slides: defaultHeroSlides,
      imageDisplayDuration: 5000,
      showDots: true,
      showArrows: true,
      dotIndicatorBottom: { mobile: 10, desktop: 15 },
      dotIndicatorOpacity: 0.9,
      dotSize: { mobile: 6, desktop: 12 },
      dotActiveWidth: { mobile: 20, desktop: 32 },
      mobileAspectRatio: '1 / 1',
      desktopAspectRatio: '16 / 9',
      desktopHeight: '100vh',
      mobileObjectFit: 'cover',
      desktopObjectFit: 'cover',
    },
    collections: collectionsConfig,
    productMetadata: Object.fromEntries(
      allProducts.map(p => [p.id, p])
    ),

    featuredProducts: featuredProductIds,
    headerProducts: headerProductIds,
    movementProducts,
    categoryLabels,
  };

  await setDoc(doc(db, 'settings', 'admin_cache'), adminCache);
  console.log('  ✓ settings/admin_cache written');

  // 5b — products collection
  const written = await writeBatchedDocs(db, 'products', allProducts);
  console.log(`  ✓ products/${written} documents written`);

  // 5c — collections collection
  const colsWritten = await writeBatchedDocs(db, 'collections', collectionsConfig);
  console.log(`  ✓ collections/${colsWritten} documents written`);

  // 5d — movement_products collection
  const mvWritten = await writeBatchedDocs(db, 'movement_products', movementProducts);
  console.log(`  ✓ movement_products/${mvWritten} documents written`);

  console.log('\n✅ Sync complete! All data pushed to Firestore.');
  console.log('   Products synced:');
  for (const p of allProducts) {
    const shopifyMatch = shopifyVariantMap[p.id] ? '✓ live Shopify data' : '⚠ local only';
    console.log(`     - ${p.id.padEnd(22)} ${p.price.padEnd(16)} [${shopifyMatch}]`);
  }
  process.exit(0);
}

sync().catch(err => {
  console.error('\n✗ Sync failed:', err.message || err);
  process.exit(1);
});
