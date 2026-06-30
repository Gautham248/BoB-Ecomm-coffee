import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA28hADmQrb8QhZ1Pkz3AMFWP1t_brPk0U',
  authDomain: 'beansofbodhi-b45f9.firebaseapp.com',
  projectId: 'beansofbodhi-b45f9',
  storageBucket: 'beansofbodhi-b45f9.firebasestorage.app',
  messagingSenderId: '461193596822',
  appId: '1:461193596822:web:6b7651f7d6b503cc8917b7',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function migrate() {
  console.log('Authenticating anonymously...');
  await signInAnonymously(auth);
  console.log('Authenticated');

  console.log('Starting Firestore migration...');

  const { products, collections, categoryLabels, headerProducts } =
    await import('../src/data/collections');
  const { products: movementProducts } = await import('../src/data/movement');

  const cache = {
    version: 2,
    lastSynced: new Date().toISOString(),
    heroSettings: {
      slides: [
        { type: 'video', url: '/videos/Bob_Main_Hero__2-transcode.mp4', mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/title_video.mp4' },
        { type: 'video', url: 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362', mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/movement.mp4' },
      ],
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
    collections,
    productMetadata: Object.fromEntries(
      products.map((p) => {
        const { shopifyVariants, ...rest } = p;
        return [p.id, rest];
      })
    ),
    featuredProducts: products
      .filter((p) => p.featured)
      .map((p) => ({ productId: p.id })),
    headerProducts: headerProducts.map((p) => p.id),
    movementProducts: movementProducts,
    categoryLabels,
  };

  await setDoc(doc(db, 'settings', 'admin_cache'), cache);
  console.log('Settings doc written');

  {
    const colRef = collection(db, 'products');
    const batch = writeBatch(db);
    for (const p of products) {
      batch.set(doc(colRef, p.id), p);
    }
    await batch.commit();
    console.log(`Products written: ${products.length}`);
  }

  {
    const colRef = collection(db, 'collections');
    const batch = writeBatch(db);
    for (const c of collections) {
      batch.set(doc(colRef, c.id), c);
    }
    await batch.commit();
    console.log(`Collections written: ${collections.length}`);
  }

  {
    const colRef = collection(db, 'movement_products');
    const batch = writeBatch(db);
    for (const p of movementProducts) {
      batch.set(doc(colRef, p.id), p);
    }
    await batch.commit();
    console.log(`Movement products written: ${movementProducts.length}`);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
