// collections.ts - Updated with grind-type variants from Shopify
export interface Product {
  id: string;
  shopifyId?: string;
  shopifyVariants?: Array<{
    id: string;
    title: string;
    price: string;
    available: boolean;
  }>;
  name: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  composition: string[];
  heroImage: string;
  heroImageMobile: string;
  galleryImages: string[];
  descriptionContent: {
    title: string;
    content: string;
    image: string;
  };
  category: string;
  featured?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  products: string[];
  featured?: boolean;
}

// Individual Products with Grind Type Variants
export const products: Product[] = [
  {
    id: 'the-origin',
    shopifyId: 'gid://shopify/Product/9746812141850', // Origin
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618107527450', title: 'Whole Beans', price: '689.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618107560218', title: 'Espresso Grind', price: '689.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618107592986', title: 'Filter Grind', price: '689.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618107625754', title: 'Cold Brew Grind', price: '689.0', available: true }
    ],
    name: 'THE ORIGIN',
    title: 'The Origin',
    description: 'A nutty sweet blend of 60% Arabica, 20% Robusta and 20% Peaberry. This bold, fullbodied coffee embodies the untamed spirit of its origins, offering a taste of adventure with every sip',
    price: 'INR 689.00',
    composition: [
      '60% Arabica',
      '20% Robusta', 
      '20% Peaberry'
    ],
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Inside-Hero-Image_The-Origin-p-1600.png?updatedAt=1759647760949',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/The_Origin_Mob-p-800.jpg?updatedAt=1759650427307',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/ORGIN_FD_V002-p-1600.png?updatedAt=1759660224678',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/7-p-800.jpg?updatedAt=1759660224525',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/OR_03-p-1080.jpg?updatedAt=1759660766150',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/OR_05-p-1080.jpg?updatedAt=1759660224460'
    ],
    descriptionContent: {
      title: 'Rooted in Nature. Preserving its legacy.',
      content: 'The Origin is more than a coffee-it\'s a pledge to preserve the untamed wilderness and vibrant landscapes of the Western Ghats. Every cup supports initiatives aimed at protecting these vital eco systems and the forest communities who call them home.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/Origin_1-p-1080.png?updatedAt=1759660224565'
    },
    category: 'nitro-blends',
    featured: true
  },
  {
    id: 'the-wild-fire-rush',
    shopifyId: 'gid://shopify/Product/9746812338458', // Wild Fire Rush
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618098647322', title: 'Whole Beans', price: '689.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618098680090', title: 'Espresso Grind', price: '689.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618098712858', title: 'Filter Grind', price: '689.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618098745626', title: 'Cold Brew Grind', price: '689.0', available: true }
    ],
    name: 'THE WILD FIRE RUSH',
    title: 'The Wild Fire Rush',
    description: 'A smoky dark blend of 70% Arabica and 30% Robusta, dark roasted to perfection. Smoky and robust, it’s a coffee that sparks energy and fuels your fiercest pursuits, crafted for those who thrive on intensity and boldness.',
    price: 'INR 689.00',
    composition: [
      '70% Arabica',
      '30% Robusta'
    ],
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Inside-Hero-Image_Wild-Fire-p-1600.png?updatedAt=1759650893936',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Wild_Fire_Mob-p-800.jpg?updatedAt=1759650461721',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_02-p-1600.jpg?updatedAt=1759660123198',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_03-p-1600.jpg?updatedAt=1759660123161',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush-p-500.png?updatedAt=1759660123080',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_05-p-800.jpg?updatedAt=1759660123078'
    ],
    descriptionContent: {
      title: 'Ignite Your Energy, Unleash the Wild',
      content: 'Wild Fire Rush is more than just a cup of coffee—it’s a spark for change. Every sip contributes to reforestation initiatives, helping to restore ecosystems impacted by deforestation and land degradation. These efforts ensure that forests, the lungs of our planet, continue to thrive, supporting biodiversity and combating climate change.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush_1-p-1080.png?updatedAt=1759660123237'
    },
    category: 'nitro-blends',
    featured: true
  },
  {
    id: 'the-eco-shock',
    shopifyId: 'gid://shopify/Product/9746812076314', // Eco Shock
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618113720602', title: 'Whole Beans', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618113753370', title: 'Espresso Grind', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618113786138', title: 'Filter Grind', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618113818906', title: 'Cold Brew Grind', price: '749.0', available: true }
    ],
    name: 'THE ECO SHOCK',
    title: 'The Eco Shock',
    description: 'Step into a world of vibrant energy with Echo Shock,a playful blend of light roasted 100% Peaberry designed to awaken your senses. Bright, lively flavors meet a smooth, balanced finish, crafted for those who thrive on curiosity and boundless enthusiasm.',
    price: 'INR 749.00',
    composition: [
      '100% Peaberry'
    ],
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Inside-Header-p-1080.png?updatedAt=1759647315410',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Eco_Shock_Mob-p-800.jpg?updatedAt=1759651050240',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/ECO-SHOCK-FD-p-1600.png?updatedAt=1759660383927',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/ES_04-p-1600.jpg?updatedAt=1759660383899',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/ES_03-p-1080.jpg?updatedAt=1759660383859',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/2-p-800.jpg?updatedAt=1759660383622'
    ],
    descriptionContent: {
      title: 'Shock your senses. Safegaurd the Wild',
      content: 'Echo Shock is more than just a coffee-it\'s a commitment to protecting the wildlife that inspires us. With every sip, you\'re supporting vital wildlife conservation efforts, helping to preserve the habitats of the world\'s most vibrant and endangered species.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/Eco-shock_2-p-1080.png?updatedAt=1759660383892'
    },
    category: 'western-ghats-selects',
    featured: true
  },
  {
    id: 'the-high-tide',
    shopifyId: 'gid://shopify/Product/9725860413722', // High Tide
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618122273050', title: 'Whole Beans', price: '789.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618122305818', title: 'Espresso Grind', price: '789.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618122338586', title: 'Filter Grind', price: '789.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618122371354', title: 'Cold Brew Grind', price: '789.0', available: true }
    ],
    name: 'THE HIGH TIDE',
    title: 'The High Tide',
    description: 'A washed clean 100% Arabica. Hints of floral undertones meet a crisp, refreshing finish, crafted for adventurers seeking clarity in their chaos and balance in every bold moment.',
    price: 'INR 789.00',
    composition: [
      '100% Arabica'
    ],
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Inside-Header-1-p-1600.png?updatedAt=1759651342901',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Mobile-p-800.jpg?updatedAt=1759650461664',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/High-Tide_1-p-500.png?updatedAt=1759660511839',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/1-p-800.jpg?updatedAt=1759660511738',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/4-HighTide-p-800.jpg?updatedAt=1759660511826',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/HT_02-p-1080.jpg?updatedAt=1759660511603'
    ],
    descriptionContent: {
      title: 'A crisp finish. A lasting impact on our waters.',
      content: 'Inspired by the untamed power of the sea, High Tide is a 100% Arabica blend with smooth chocolatey undertones and a crisp finish, crafted for those who seek clarity in chaos.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/HighTide.png?updatedAt=1759660511916'
    },
    category: 'western-ghats-selects',
    featured: true
  },
  {
    id: 'the-thunder-fuse',
    shopifyId: 'gid://shopify/Product/9746812469530', // Thunder Fuse
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618096648474', title: 'Whole Beans', price: '599.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618096681242', title: 'Espresso Grind', price: '599.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618096714010', title: 'Filter Grind', price: '599.0', available: true },
      { id: 'gid://shopify/ProductVariant/50618096746778', title: 'Cold Brew Grind', price: '599.0', available: true }
    ],
    name: 'THE THUNDER FUSE',
    title: 'The Thunder Fuse',
    description: 'A creamy 100% Wayanadan Robusta, with  peanut and hints of dark chocolate that hits like a storm. Packed with an intense caffeine punch, this Robusta will surprise you. To fuel those who live for power, energy, and unstoppable momentum.',
    price: 'INR 599.00',
    composition: [
      '100% Robusta'
    ],
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/thunder--p-1080.jpg?updatedAt=1759647315069',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Thunder_Fuse_Mob-p-800.jpg?updatedAt=1759650461428',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_2-p-500.png?updatedAt=1759660698358',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-front-p-1600.png?updatedAt=1759660698292',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/TF_05-p-1080.jpg?updatedAt=1759660698155',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/TF_03-p-1080.jpg?updatedAt=1759660698180'
    ],
    descriptionContent: {
      title: 'Feel the surge. Power the future.',
      content: 'Thunder Fuse isn’t just about charging your day—it’s about lighting up lives. With every bold sip, you’re contributing to the electrification of remote communities, ensuring they have access to the power they need to thrive.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_3-p-1080.png?updatedAt=1759660698222'
    },
    category: 'western-ghats-selects',
    featured: true
  },
  {
    id: 'the-tornado-twist',
    shopifyId: 'gid://shopify/Product/9746812535066', // Tornado Twist
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50617990119706', title: 'Whole Beans', price: '669.0', available: true },
      { id: 'gid://shopify/ProductVariant/50617990152474', title: 'Espresso Grind', price: '669.0', available: true },
      { id: 'gid://shopify/ProductVariant/50617990185242', title: 'Filter Grind', price: '669.0', available: true },
      { id: 'gid://shopify/ProductVariant/50617990218010', title: 'Cold Brew Grind', price: '669.0', available: true }
    ],
    name: 'THE TORNADO TWIST',
    title: 'The Tornado Twist',
    description: 'Our twisted blend of microlots for you. 50% Robusta and 50% Arabica. Citrus burts? Maybe. A hint of fermented funk? Possibly. Barrel-aged complexity? Could be. We experiment, we evolve, and we let nature and you do the talking. With dynamic flavors, this coffee is designed for those who thrive on adventure and embrace life\'s twists and turns.',
    price: 'INR 669.00',
    composition: [
      '50% Arabica',
      '50% Robusta'
    ],
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Inside-Hero-Image_Tornado-Twist-p-1080.png?updatedAt=1759647315384',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Tornado_Twist_Mob-p-800.jpg?updatedAt=1759651612432',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornoda-Twist-p-500.png?updatedAt=1759661242679',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_03-p-1080.jpg?updatedAt=1759656359706',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_01-p-1080.jpg?updatedAt=1759656359593',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_02-p-1080.jpg?updatedAt=1759656358730'
    ],
    descriptionContent: {
      title: 'Fuel the adventure. Rebuild the future.',
      content: 'Tornado Twist is more than a bold brew - it\'s a catalyst for change. Every sip fuels efforts to rebuild communities hit by floods, helping them rise stronger after the storm.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornado-twist_2-p-1080.png?updatedAt=1759660032208'
    },
    category: 'nitro-blends',
    featured: true
  }
];

// Collections/Categories (updated pricing)
export const collections: Collection[] = [
  {
    id: 'western-ghats-selects',
    name: 'Western Ghats Selects',
    title: 'Western Ghats Selects',
    description: 'Premium coffee blends sourced from the pristine Western Ghats region, featuring our signature HIGH TIDE, ECO SHOCK, and THUNDER FUSE varieties.',
    price: 'From ₹599',
    originalPrice: 'From ₹750',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    products: ['the-high-tide', 'the-eco-shock', 'the-thunder-fuse'],
    featured: true
  },
  {
    id: 'gadget-galaxy',
    name: 'Gadget Galaxy',
    title: 'Gadget Galaxy',
    description: 'Premium coffee brewing equipment and accessories to enhance your coffee experience. From precision grinders to elegant brewing vessels.',
    price: 'From ₹6899',
    image: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    products: [],
    featured: true
  },
  {
    id: 'nitro-blends',
    name: 'Nitro Blends',
    title: 'Nitro Blends',
    description: 'Bold and adventurous coffee blends including THE ORIGIN, WILD FIRE RUSH, and TORNADO TWIST. Perfect for those seeking intense flavors and unique experiences.',
    price: 'From ₹669',
    image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    products: ['the-origin', 'the-wild-fire-rush', 'the-tornado-twist'],
    featured: true
  },
  {
    id: 'merchandise',
    name: 'Merchandise',
    title: 'Merchandise',
    description: 'Beans of Bodhi branded merchandise including apparel, mugs, and accessories for the true coffee enthusiast.',
    price: 'From ₹299',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    products: [],
    featured: false
  }
];

// Helper functions (unchanged)
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getCollectionById = (id: string): Collection | undefined => {
  return collections.find(collection => collection.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getFeaturedCollections = (): Collection[] => {
  return collections.filter(collection => collection.featured);
};

export const getProductsInCollection = (collectionId: string): Product[] => {
  const collection = getCollectionById(collectionId);
  if (!collection) return [];
  
  return collection.products.map(productId => getProductById(productId)).filter(Boolean) as Product[];
};