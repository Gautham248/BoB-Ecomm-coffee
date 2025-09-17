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
    description: 'Rooted in the rich soils of the Western Ghats, The Origin is a harmonious blend that embodies the untamed spirit of its origins. This earthy, robust brew connects you to the ancient roots of coffee, offering a taste of adventure with every sip.',
    price: 'INR 689.00',
    composition: [
      '60% Arabica',
      '20% Robusta', 
      '20% Peaberry'
    ],
    heroImage: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop'
    ],
    descriptionContent: {
      title: 'Rooted in Nature. Preserving its legacy.',
      content: 'The Origin is more than a coffee-it\'s a pledge to preserve the untamed wilderness and vibrant landscapes of the Western Ghats. Every cup supports initiatives aimed at protecting these vital eco systems and the forest communities who call them home.',
      image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
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
    description: 'An intense blend that ignites your senses with bold flavors and fiery passion. This smoky, fierce brew fuels your inner fire and pushes boundaries, delivering a rush of excitement with every cup.',
    price: 'INR 689.00',
    composition: [
      '70% Arabica',
      '30% Robusta'
    ],
    heroImage: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop'
    ],
    descriptionContent: {
      title: 'Igniting Passion. Fueling Adventure.',
      content: 'The Wild Fire Rush embodies the spirit of those who dare to venture beyond the ordinary. Each bean is carefully selected to deliver an intense, memorable experience that fuels your next great adventure.',
      image: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
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
    description: 'A sustainable blend that delivers an electrifying taste while supporting environmental conservation. This bright, colorful coffee is full of youthful energy and surprises with vibrant flavors.',
    price: 'INR 749.00',
    composition: [
      '100% Peaberry'
    ],
    heroImage: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop'
    ],
    descriptionContent: {
      title: 'Sustainable Shock. Environmental Impact.',
      content: 'The Eco Shock represents our commitment to environmental stewardship. Every purchase directly supports reforestation efforts and sustainable farming practices in the Western Ghats region.',
      image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
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
    description: 'Ride the wave of exceptional flavor with this smooth, balanced blend. Smooth as the ocean with a wave of clarity and balance, this rich, clean brew offers perfect harmony of strength and subtlety.',
    price: 'INR 789.00',
    composition: [
      '100% Arabica'
    ],
    heroImage: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop'
    ],
    descriptionContent: {
      title: 'Riding the Wave. Embracing the Journey.',
      content: 'The High Tide captures the essence of coastal adventures and mountain expeditions. This carefully crafted blend delivers consistent excellence, making every moment an opportunity for discovery.',
      image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
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
    description: 'An explosive blend that awakens your senses with powerful, electrifying flavors. This brew is lightning in a cup—bright, intense, and full of adrenaline that energizes your spirit.',
    price: 'INR 599.00',
    composition: [
      '100% Robusta'
    ],
    heroImage: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop'
    ],
    descriptionContent: {
      title: 'Explosive Flavor. Electrifying Experience.',
      content: 'The Thunder Fuse is designed for coffee lovers who crave intensity and power. This bold blend delivers an unforgettable experience that energizes your spirit and fuels your adventures.',
      image: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
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
    description: 'A whirlwind of complex flavors that creates a unique and memorable coffee experience. This daring brew hits hard with bold kick, perfect for those who love an adventurous twist.',
    price: 'INR 669.00',
    composition: [
      '50% Arabica',
      '50% Robusta'
    ],
    heroImage: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop'
    ],
    descriptionContent: {
      title: 'Whirlwind of Flavors. Endless Discovery.',
      content: 'The Tornado Twist represents the perfect storm of coffee craftsmanship. Each cup delivers a complex symphony of flavors that evolves with every sip, creating an unforgettable journey of taste.',
      image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
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