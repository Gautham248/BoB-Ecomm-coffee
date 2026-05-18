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
  traceability: {
    source: string;
    tasteNotes: string[];
    process: string;
    elevation: string;
  };
  heroImage: string;
  heroImageMobile: string;
  productCardImage: string; // NEW: Image for product cards/listings
  galleryImages: string[];
  descriptionContent: {
    title: string;
    content: string;
    image: string;
  };
  category: string;
  featured?: boolean;
  upcoming?: boolean;
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
  upcoming?: boolean;
}

// Individual Products with Traceability
export const products: Product[] = [
  {
    id: 'the-origin',
    shopifyId: 'gid://shopify/Product/9746812141850',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618107527450', title: 'Whole Beans', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199334682', title: 'Coarse (French Press / Cold Brew)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199367450', title: 'Medium Coarse (Chemex)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199400218', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199432986', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199465754', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199498522', title: 'Extra Fine (Turkish)', price: '799.0', available: true }
    ],
    name: 'THE ORIGIN',
    title: 'The Origin',
    description: 'A nutty sweet blend of 60% Arabica, 20% Robusta and 20% Peaberry. This bold, fullbodied coffee embodies the untamed spirit of its origins, offering a taste of adventure with every sip',
    price: 'INR 799.00',
    traceability: {
      source: 'Sholayur, Attapadi, Wayanad',
      tasteNotes: ['White Chocolate', 'Soft Nutty', 'Sweet'],
      process: 'Natural',
      elevation: '3280ft'
    },
    heroImage: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Inside-Hero-Image_The-Origin-p-1600.png?updatedAt=1761228745235',
    heroImageMobile: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/The_Origin_Mob-p-800.jpg?updatedAt=1761228745108',
    productCardImage: 'https://ik.imagekit.io/beansofbodhi/Product%20Cards/OR.webp?updatedAt=1761230707571',
    galleryImages: [
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR2.webp?updatedAt=1761227480507',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR1.webp?updatedAt=1761227480389',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR3.webp?updatedAt=1761227480407',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/7-p-800.jpg?updatedAt=1761227510274',
    ],

    descriptionContent: {
      title: 'Rooted in Nature. Preserving its legacy.',
      content: 'The Origin is more than a coffee-it\'s a pledge to preserve the untamed wilderness and vibrant landscapes of the Western Ghats. Every cup supports initiatives aimed at protecting these vital eco systems and the forest communities who call them home.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/Origin_1-p-1080.png?updatedAt=1759660224565'
    },
    category: 'signature-blends',
    featured: true
  },
  {
    id: 'the-wild-fire-rush',
    shopifyId: 'gid://shopify/Product/9746812338458',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618098647322', title: 'Whole Beans', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207493914', title: 'Coarse (French Press / Cold Brew)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207526682', title: 'Medium Coarse (Chemex)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207559450', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207592218', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207624986', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207657754', title: 'Extra Fine (Turkish)', price: '799.0', available: true }
    ],
    name: 'THE WILD FIRE RUSH',
    title: 'The Wild Fire Rush',
    description: 'A smoky dark blend of 70% Arabica and 30% Robusta, dark roasted to perfection. Smoky and robust, it\'s a coffee that sparks energy and fuels your fiercest pursuits, crafted for those who thrive on intensity and boldness.',
    price: 'INR 799.00',
    traceability: {
      source: 'Wayanad, Anaikatti',
      tasteNotes: ['Ripe Fruit', 'Cashew'],
      process: 'Natural',
      elevation: '3650ft'
    },
    heroImage: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Inside-Hero-Image_Wild-Fire-p-1600.png?updatedAt=1761228744797',
    heroImageMobile: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Wild_Fire_Mob-p-800.jpg?updatedAt=1761228745051',
    productCardImage: 'https://ik.imagekit.io/beansofbodhi/Product%20Cards/WFR.webp?updatedAt=1761230707642',
    galleryImages: [
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Wild%20Fire%20Rush/WFR3.webp?updatedAt=1761227965224',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Wild%20Fire%20Rush/WFR1.webp?updatedAt=1761227964860',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Wild%20Fire%20Rush/WFR2.webp?updatedAt=1761227964794',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Wild%20Fire%20Rush/Wild-Fire-Rush-p-500.png?updatedAt=1761227964915',
    ],
    descriptionContent: {
      title: 'Ignite Your Energy, Unleash the Wild',
      content: 'Wild Fire Rush is more than just a cup of coffee—it\'s a spark for change. Every sip contributes to reforestation initiatives, helping to restore ecosystems impacted by deforestation and land degradation. These efforts ensure that forests, the lungs of our planet, continue to thrive, supporting biodiversity and combating climate change.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush_1-p-1080.png?updatedAt=1759660123237'
    },
    category: 'signature-blends',
    featured: true
  },
  {
    id: 'the-eco-shock',
    shopifyId: 'gid://shopify/Product/9746812076314',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618113720602', title: 'Whole Beans', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191634202', title: 'Coarse (French Press / Cold Brew)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191666970', title: 'Medium Coarse (Chemex)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191699738', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191732506', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191765274', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191798042', title: 'Extra Fine (Turkish)', price: '849.0', available: true }
    ],
    name: 'THE ECO SHOCK',
    title: 'The Eco Shock',
    description: 'Step into a world of vibrant energy with Echo Shock,a playful blend of light roasted 100% Peaberry designed to awaken your senses. Bright, lively flavors meet a smooth, balanced finish, crafted for those who thrive on curiosity and boundless enthusiasm.',
    price: 'INR 849.00',
    traceability: {
      source: 'Attapadi',
      tasteNotes: ['Spice', 'Chocolate', 'Jaggery'],
      process: 'Natural',
      elevation: '3500ft'
    },
    heroImage: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/High-Tide---Inside-Header-p-1080.png?updatedAt=1761228745143',
    heroImageMobile: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Eco_Shock_Mob-p-800.jpg?updatedAt=1761228745115',
    productCardImage: 'https://ik.imagekit.io/beansofbodhi/Product%20Cards/ES.webp?updatedAt=1761230707557',
    galleryImages: [
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Eco%20Shock/ES2.webp?updatedAt=1761227210296',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Eco%20Shock/ES1.webp?updatedAt=1761227197288',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Eco%20Shock/ES3.webp?updatedAt=1761227190235',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Eco%20Shock/2-p-800.jpg?updatedAt=1761227627190'
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
    shopifyId: 'gid://shopify/Product/9725860413722',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618122273050', title: 'Whole Beans', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173284122', title: 'Coarse (French Press / Cold Brew)', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173316890', title: 'Medium Coarse (Chemex)', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173349658', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173382426', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173415194', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173447962', title: 'Extra Fine (Turkish)', price: '899.0', available: true }
    ],
    name: 'THE HIGH TIDE',
    title: 'The High Tide',
    description: 'A washed clean 100% Arabica. Hints of floral undertones meet a crisp, refreshing finish, crafted for adventurers seeking clarity in their chaos and balance in every bold moment.',
    price: 'INR 899.00',
    traceability: {
      source: 'Sholayur',
      tasteNotes: ['Sweet', 'Citric'],
      process: 'Natural',
      elevation: '3610ft'
    },
    heroImage: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/High-Tide---Inside-Header-1-p-1600.png?updatedAt=1761228745150',
    heroImageMobile: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/High-Tide---Mobile-p-800.jpg?updatedAt=1761228745116',
    productCardImage: 'https://ik.imagekit.io/beansofbodhi/Product%20Cards/HT.webp?updatedAt=1761230707514',
    galleryImages: [
      'https://ik.imagekit.io/beansofbodhi/Products/The%20High%20Tide/HT1.webp?updatedAt=1761227341978',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20High%20Tide/HT3.webp?updatedAt=1761227342007',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20High%20Tide/HT2.webp?updatedAt=1761227342043',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20High%20Tide/4-HighTide-p-800.jpg?updatedAt=1761227595118'
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
    shopifyId: 'gid://shopify/Product/9746812469530',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618096648474', title: 'Whole Beans', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213293850', title: 'Coarse (French Press / Cold Brew)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213326618', title: 'Medium Coarse (Chemex)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213359386', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213392154', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213424922', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213457690', title: 'Extra Fine (Turkish)', price: '749.0', available: true }
    ],
    name: 'THE THUNDER FUSE',
    title: 'The Thunder Fuse',
    description: 'A creamy 100% Wayanadan Robusta, with  peanut and hints of dark chocolate that hits like a storm. Packed with an intense caffeine punch, this Robusta will surprise you. To fuel those who live for power, energy, and unstoppable momentum.',
    price: 'INR 749.00',
    traceability: {
      source: 'Wayanad',
      tasteNotes: ['Chocolate', 'Nutty', 'Sweet', 'Spices'],
      process: 'Natural',
      elevation: '4593ft'
    },
    heroImage: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/thunder--p-1080.jpg?updatedAt=1761228745097',
    heroImageMobile: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Thunder_Fuse_Mob-p-800.jpg?updatedAt=1761228745070',
    productCardImage: 'https://ik.imagekit.io/beansofbodhi/Product%20Cards/TF.webp?updatedAt=1761230707623',
    galleryImages: [
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Thunder%20Fuse/TF3.webp?updatedAt=1761227694657',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Thunder%20Fuse/TF1.webp?updatedAt=1761227694626',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Thunder%20Fuse/TF2.webp?updatedAt=1761227694370',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Thunder%20Fuse/Thunder-Fuse_2-p-500.png?updatedAt=1761227749007',
    ],
    descriptionContent: {
      title: 'Feel the surge. Power the future.',
      content: 'Thunder Fuse isn\'t just about charging your day—it\'s about lighting up lives. With every bold sip, you\'re contributing to the electrification of remote communities, ensuring they have access to the power they need to thrive.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_3-p-1080.png?updatedAt=1759660698222'
    },
    category: 'western-ghats-selects',
    featured: true
  },
  {
    id: 'the-tornado-twist',
    shopifyId: 'gid://shopify/Product/9746812535066',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50617990119706', title: 'Whole Beans', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218241818', title: 'Coarse (French Press / Cold Brew)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218274586', title: 'Medium Coarse (Chemex)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218307354', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218340122', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218372890', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218405658', title: 'Extra Fine (Turkish)', price: '779.0', available: true }
    ],
    name: 'THE TORNADO TWIST',
    title: 'The Tornado Twist',
    description: 'Our twisted blend of microlots for you. 50% Robusta and 50% Arabica. Citrus burts? Maybe. A hint of fermented funk? Possibly. Barrel-aged complexity? Could be. We experiment, we evolve, and we let nature and you do the talking. With dynamic flavors, this coffee is designed for those who thrive on adventure and embrace life\'s twists and turns.',
    price: 'INR 779.00',
    traceability: {
      source: 'Yercaud, Wayanad',
      tasteNotes: ['Cocoa', 'Spice', 'Fruit', 'Hints of Floral'],
      process: 'Natural',
      elevation: '3650ft'
    },
    heroImage: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Inside-Hero-Image_Tornado-Twist-p-1080.png?updatedAt=1761228745088',
    heroImageMobile: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Tornado_Twist_Mob-p-800.jpg?updatedAt=1761228745098',
    productCardImage: 'https://ik.imagekit.io/beansofbodhi/Product%20Cards/TT.webp?updatedAt=1761230707488',
    galleryImages: [
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Tornado%20Twist/TT1.webp?updatedAt=1761227832209',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Tornado%20Twist/TT2.webp?updatedAt=1761227831959',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Tornado%20Twist/TT_03-p-800.jpg?updatedAt=1761227847940',
      'https://ik.imagekit.io/beansofbodhi/Products/The%20Tornado%20Twist/TT_01-p-800.jpg?updatedAt=1761227860426',
    ],

    descriptionContent: {
      title: 'Fuel the adventure. Rebuild the future.',
      content: 'Tornado Twist is more than a bold brew - it\'s a catalyst for change. Every sip fuels efforts to rebuild communities hit by floods, helping them rise stronger after the storm.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornado-twist_2-p-1080.png?updatedAt=1759660032208'
    },
    category: 'signature-blends',
    featured: true
  },
  {
    id: 'gadgets',
    shopifyId: 'gid://shopify/Product/9859123511578',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50617988055322', title: 'Default Title', price: '7499.0', available: true }
    ],
        name: 'Gadgets',
    title: 'Movement',
    description: 'Coming soon - Gadgets',
    price: 'INR 7,499.00',
    traceability: {
      source: 'N/A',
      tasteNotes: [],
      process: 'N/A',
      elevation: 'N/A'
    },
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
    productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Categories/Gadget.webp?updatedAt=1761221187018',
    galleryImages: [],
    descriptionContent: {
      title: 'Coming Soon',
      content: 'Premium brewing equipment coming soon.',
      image: ''
    },
    category: 'gadgets',
    upcoming: false
  },
  {
    id: 'merchandise',
    name: 'Merchandise',
    title: 'Merchandise',
    description: 'Coming soon - Premium cotton t-shirt',
    price: 'INR 799.00',
    traceability: {
      source: 'N/A',
      tasteNotes: [],
      process: 'N/A',
      elevation: 'N/A'
    },
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Categories/Merchandise.webp?updatedAt=1761221187036',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Categories/Merchandise.webp?updatedAt=1761221187036',
    productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Categories/Merchandise.webp?updatedAt=1761221187036',
    galleryImages: [],
    descriptionContent: {
      title: 'Coming Soon',
      content: 'Branded merchandise coming soon.',
      image: ''
    },
    category: 'merchandise',
    upcoming: true
  }

  // {
  //   id: 'the-liberica-funk',
  //   shopifyId: 'gid://shopify/Product/10122236789018',
  //   shopifyVariants: [
  //     { id: 'gid://shopify/ProductVariant/52151152738586', title: 'Whole Beans', price: '979.0', available: true },
  //     { id: 'gid://shopify/ProductVariant/52151152771354', title: 'Coarse (French Press / Cold Brew)', price: '979.0', available: true },
  //     { id: 'gid://shopify/ProductVariant/52151152804122', title: 'Medium Coarse (Chemex)', price: '979.0', available: true },
  //     { id: 'gid://shopify/ProductVariant/52151152836890', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '979.0', available: true },
  //     { id: 'gid://shopify/ProductVariant/52151152869658', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '979.0', available: true },
  //     { id: 'gid://shopify/ProductVariant/52151152902426', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '979.0', available: true },
  //     { id: 'gid://shopify/ProductVariant/52151152935194', title: 'Extra Fine (Turkish)', price: '979.0', available: true }
  //   ],
  //   name: 'THE LIBERICA FUNK',
  //   title: 'The Liberica Funk',
  //   description: 'A wild, exotic single-origin Liberica with heavy body, sweet jackfruit aroma, and a clean cup. Heavy, sweet, and complex, it is a rare coffee that stands apart from Arabica and Robusta, designed for those seeking the ultimate sensory adventure.',
  //   price: 'INR 979.00',
  //   traceability: {
  //     source: 'Western Ghats, Wayanad',
  //     tasteNotes: ['Jackfruit', 'Ripe Banana', 'Sweet Spice', 'Heavy Bodied'],
  //     process: 'Natural',
  //     elevation: '3100ft'
  //   },
  //   heroImage: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/Inside-Hero-Image_The-Origin-p-1600.png?updatedAt=1761228745235',
  //   heroImageMobile: 'https://ik.imagekit.io/beansofbodhi/Products/Hero%20Images/The_Origin_Mob-p-800.jpg?updatedAt=1761228745108',
  //   productCardImage: 'https://ik.imagekit.io/beansofbodhi/Product%20Cards/OR.webp?updatedAt=1761230707571',
  //   galleryImages: [
  //     'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR2.webp?updatedAt=1761227480507',
  //     'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR1.webp?updatedAt=1761227480389',
  //     'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/OR3.webp?updatedAt=1761227480407',
  //     'https://ik.imagekit.io/beansofbodhi/Products/The%20Origin/7-p-800.jpg?updatedAt=1761227510274'
  //   ],
  //   descriptionContent: {
  //     title: 'A Rare Legacy of Sweet Spice',
  //     content: 'Liberica Funk is a rare celebration of standard-setting biodiversity in the coffee forests. Sourced from single microlots where Liberica plants grow tall like trees, this exotic cup contributes to habitat preservation projects for native birds and woodland fauna.',
  //     image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/Origin_1-p-1080.png?updatedAt=1759660224565'
  //   },
  //   category: 'western-ghats-selects',
  //   featured: true
  // },
];

// Header Products
export const headerProducts: Product[] = [
  {
    id: 'the-origin',
    shopifyId: 'gid://shopify/Product/9746812141850',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618107527450', title: 'Whole Beans', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199334682', title: 'Coarse (French Press / Cold Brew)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199367450', title: 'Medium Coarse (Chemex)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199400218', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199432986', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199465754', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151199498522', title: 'Extra Fine (Turkish)', price: '799.0', available: true }
    ],
    name: 'THE ORIGIN',
    title: 'The Origin',
    description: 'A nutty sweet blend of 60% Arabica, 20% Robusta and 20% Peaberry. This bold, fullbodied coffee embodies the untamed spirit of its origins, offering a taste of adventure with every sip',
    price: 'INR 799.00',
    traceability: {
      source: 'Sholayur, Attapadi, Wayanad',
      tasteNotes: ['White Chocolate', 'Soft Nutty', 'Sweet'],
      process: 'Natural',
      elevation: '3280ft'
    },
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Inside-Hero-Image_The-Origin-p-1600.png?updatedAt=1759647760949',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/The_Origin_Mob-p-800.jpg?updatedAt=1759650427307',
    productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/ORGIN_FD_V002-p-1600.png?updatedAt=1759660224678',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/7-p-800.jpg?updatedAt=1759660224525',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/OR_03-p-1080.jpg?updatedAt=1759660766150',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/OR_05-p-1080.jpg?updatedAt=1759660224460',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/ORGIN_FD_V002-p-1600.png?updatedAt=1759660224678',
    ],
    descriptionContent: {
      title: 'Rooted in Nature. Preserving its legacy.',
      content: 'The Origin is more than a coffee-it\'s a pledge to preserve the untamed wilderness and vibrant landscapes of the Western Ghats. Every cup supports initiatives aimed at protecting these vital eco systems and the forest communities who call them home.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Origin/Origin_1-p-1080.png?updatedAt=1759660224565'
    },
    category: 'signature-blends',
    featured: true
  },
  {
    id: 'the-wild-fire-rush',
    shopifyId: 'gid://shopify/Product/9746812338458',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618098647322', title: 'Whole Beans', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207493914', title: 'Coarse (French Press / Cold Brew)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207526682', title: 'Medium Coarse (Chemex)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207559450', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207592218', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207624986', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '799.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151207657754', title: 'Extra Fine (Turkish)', price: '799.0', available: true }
    ],
    name: 'THE WILD FIRE RUSH',
    title: 'The Wild Fire Rush',
    description: 'A smoky dark blend of 70% Arabica and 30% Robusta, dark roasted to perfection. Smoky and robust, it\'s a coffee that sparks energy and fuels your fiercest pursuits, crafted for those who thrive on intensity and boldness.',
    price: 'INR 799.00',
    traceability: {
      source: 'Wayanad, Anaikatti',
      tasteNotes: ['Ripe Fruit', 'Cashew'],
      process: 'Natural',
      elevation: '3650ft'
    },
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Inside-Hero-Image_Wild-Fire-p-1600.png?updatedAt=1759650893936',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Wild_Fire_Mob-p-800.jpg?updatedAt=1759650461721',
    productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush-p-500.png?updatedAt=1759660123080',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_02-p-1600.jpg?updatedAt=1759660123198',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_03-p-1600.jpg?updatedAt=1759660123161',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush-p-500.png?updatedAt=1759660123080',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/WF_05-p-800.jpg?updatedAt=1759660123078'
    ],
    descriptionContent: {
      title: 'Ignite Your Energy, Unleash the Wild',
      content: 'Wild Fire Rush is more than just a cup of coffee—it\'s a spark for change. Every sip contributes to reforestation initiatives, helping to restore ecosystems impacted by deforestation and land degradation. These efforts ensure that forests, the lungs of our planet, continue to thrive, supporting biodiversity and combating climate change.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Wild%20Fire%20Rush/Wild-Fire-Rush_1-p-1080.png?updatedAt=1759660123237'
    },
    category: 'signature-blends',
    featured: true
  },
  {
    id: 'the-eco-shock',
    shopifyId: 'gid://shopify/Product/9746812076314',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618113720602', title: 'Whole Beans', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191634202', title: 'Coarse (French Press / Cold Brew)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191666970', title: 'Medium Coarse (Chemex)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191699738', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191732506', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191765274', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '849.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151191798042', title: 'Extra Fine (Turkish)', price: '849.0', available: true }
    ],
    name: 'THE ECO SHOCK',
    title: 'The Eco Shock',
    description: 'Step into a world of vibrant energy with Echo Shock,a playful blend of light roasted 100% Peaberry designed to awaken your senses. Bright, lively flavors meet a smooth, balanced finish, crafted for those who thrive on curiosity and boundless enthusiasm.',
    price: 'INR 849.00',
    traceability: {
      source: 'Attapadi',
      tasteNotes: ['Spice', 'Chocolate', 'Jaggery'],
      process: 'Natural',
      elevation: '3500ft'
    },
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Inside-Header-p-1080.png?updatedAt=1759647315410',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Eco_Shock_Mob-p-800.jpg?updatedAt=1759651050240',
    productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Eco%20Shock/ECO-SHOCK-FD-p-1600.png?updatedAt=1759660383927',
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
    shopifyId: 'gid://shopify/Product/9725860413722',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618122273050', title: 'Whole Beans', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173284122', title: 'Coarse (French Press / Cold Brew)', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173316890', title: 'Medium Coarse (Chemex)', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173349658', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173382426', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173415194', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress', price: '899.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151173447962', title: 'Extra Fine (Turkish)', price: '899.0', available: true }
    ],
    name: 'THE HIGH TIDE',
    title: 'The High Tide',
    description: 'A washed clean 100% Arabica. Hints of floral undertones meet a crisp, refreshing finish, crafted for adventurers seeking clarity in their chaos and balance in every bold moment.',
    price: 'INR 899.00',
    traceability: {
      source: 'Sholayur',
      tasteNotes: ['Sweet', 'Citric'],
      process: 'Natural',
      elevation: '3610ft'
    },
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Inside-Header-1-p-1600.png?updatedAt=1759651342901',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/High-Tide---Mobile-p-800.jpg?updatedAt=1759650461664',
    productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/High%20Tide/High-Tide_1-p-500.png?updatedAt=1759660511839',
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
    shopifyId: 'gid://shopify/Product/9746812469530',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50618096648474', title: 'Whole Beans', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213293850', title: 'Coarse (French Press / Cold Brew)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213326618', title: 'Medium Coarse (Chemex)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213359386', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213392154', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213424922', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '749.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151213457690', title: 'Extra Fine (Turkish)', price: '749.0', available: true }
    ],
    name: 'THE THUNDER FUSE',
    title: 'The Thunder Fuse',
    description: 'A creamy 100% Wayanadan Robusta, with  peanut and hints of dark chocolate that hits like a storm. Packed with an intense caffeine punch, this Robusta will surprise you. To fuel those who live for power, energy, and unstoppable momentum.',
    price: 'INR 749.00',
    traceability: {
      source: 'Wayanad',
      tasteNotes: ['Chocolate', 'Nutty', 'Sweet', 'Spices'],
      process: 'Natural',
      elevation: '4593ft'
    },
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/thunder--p-1080.jpg?updatedAt=1759647315069',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Thunder_Fuse_Mob-p-800.jpg?updatedAt=1759650461428',
    productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_2-p-500.png?updatedAt=1759660698358',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_2-p-500.png?updatedAt=1759660698358',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-front-p-1600.png?updatedAt=1759660698292',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/TF_05-p-1080.jpg?updatedAt=1759660698155',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/TF_03-p-1080.jpg?updatedAt=1759660698180'
    ],
    descriptionContent: {
      title: 'Feel the surge. Power the future.',
      content: 'Thunder Fuse isn\'t just about charging your day—it\'s about lighting up lives. With every bold sip, you\'re contributing to the electrification of remote communities, ensuring they have access to the power they need to thrive.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Thunder%20Fuse/Thunder-Fuse_3-p-1080.png?updatedAt=1759660698222'
    },
    category: 'western-ghats-selects',
    featured: true
  },
  {
    id: 'the-tornado-twist',
    shopifyId: 'gid://shopify/Product/9746812535066',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50617990119706', title: 'Whole Beans', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218241818', title: 'Coarse (French Press / Cold Brew)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218274586', title: 'Medium Coarse (Chemex)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218307354', title: 'Medium (Drip Coffee Maker / South Indian Filter)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218340122', title: 'Medium Fine (V60 / Pour Over / Syphon)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218372890', title: 'Fine (Espresso / Movement / Moka Pot / Aeropress)', price: '779.0', available: true },
      { id: 'gid://shopify/ProductVariant/52151218405658', title: 'Extra Fine (Turkish)', price: '779.0', available: true }
    ],
    name: 'THE TORNADO TWIST',
    title: 'The Tornado Twist',
    description: 'Our twisted blend of microlots for you. 50% Robusta and 50% Arabica. Citrus burts? Maybe. A hint of fermented funk? Possibly. Barrel-aged complexity? Could be. We experiment, we evolve, and we let nature and you do the talking. With dynamic flavors, this coffee is designed for those who thrive on adventure and embrace life\'s twists and turns.',
    price: 'INR 779.00',
    traceability: {
      source: 'Yercaud, Wayanad',
      tasteNotes: ['Cocoa', 'Spice', 'Fruit', 'Hints of Floral'],
      process: 'Natural',
      elevation: '3650ft'
    },
    heroImage: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Inside-Hero-Image_Tornado-Twist-p-1080.png?updatedAt=1759647315384',
    heroImageMobile: 'https://ik.imagekit.io/7ujz6ljli/Hero%20Images/Tornado_Twist_Mob-p-800.jpg?updatedAt=1759651612432',
    productCardImage: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornoda-Twist-p-500.png?updatedAt=1759661242679',
    galleryImages: [
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_03-p-1080.jpg?updatedAt=1759656359706',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_01-p-1080.jpg?updatedAt=1759656359593',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/TT_02-p-1080.jpg?updatedAt=1759656358730',
      'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornoda-Twist-p-500.png?updatedAt=1759661242679',
    ],
    descriptionContent: {
      title: 'Fuel the adventure. Rebuild the future.',
      content: 'Tornado Twist is more than a bold brew - it\'s a catalyst for change. Every sip fuels efforts to rebuild communities hit by floods, helping them rise stronger after the storm.',
      image: 'https://ik.imagekit.io/7ujz6ljli/Product%20Description%20and%20Gallery/Tornado%20Twist/Tornado-twist_2-p-1080.png?updatedAt=1759660032208'
    },
    category: 'signature-blends',
    featured: true
  },

];
// Collections/Categories
export const collections: Collection[] = [
  {
    id: 'western-ghats-selects',
    name: 'Western Ghats Selects',
    title: 'Western Ghats Selects',
    description: 'Premium coffee blends sourced from the pristine Western Ghats region, featuring our signature HIGH TIDE, ECO SHOCK, and THUNDER FUSE varieties.',
    price: 'From ₹749',
    image: 'https://ik.imagekit.io/nzkbravfr/Collections/Western%20Ghats%20Select.webp?updatedAt=1761390411685',
    products: ['the-high-tide', 'the-eco-shock', 'the-thunder-fuse'],
    featured: true,
    upcoming: false
  },
  {
    id: 'signature-blends',
    name: 'Signature Blends',
    title: 'Signature Blends',
    description: 'Bold and adventurous coffee blends including THE ORIGIN, WILD FIRE RUSH, and TORNADO TWIST. Perfect for those seeking intense flavors and unique experiences.',
    price: 'From ₹779',
    image: 'https://ik.imagekit.io/nzkbravfr/Collections/Signature%20Blends.webp?updatedAt=1761390411670',
    products: ['the-wild-fire-rush', 'the-origin', 'the-tornado-twist'],
    featured: true,
    upcoming: false
  },
  {
    id: 'gadgets',
    shopifyId: 'gid://shopify/Product/9859123511578',
    shopifyVariants: [
      { id: 'gid://shopify/ProductVariant/50617988055322', title: 'Default Title', price: '7499.0', available: true }
    ],
        name: 'Gadgets',
    title: 'Gadgets',
    description: 'Premium coffee brewing equipment and accessories to enhance your coffee experience. From precision grinders to elegant brewing vessels.',
    price: 'From ₹7499',
    image: 'https://ik.imagekit.io/nzkbravfr/Collections/Gadgets.webp?updatedAt=1761390411909',
    products: ['gadgets'],
    featured: true,
    upcoming: false
  },
  {
    id: 'merchandise',
    name: 'Merchandise',
    title: 'Merchandise',
    description: 'Beans of Bodhi branded merchandise including apparel, mugs, and accessories for the true coffee enthusiast.',
    price: 'Coming Soon',
    image: 'https://ik.imagekit.io/nzkbravfr/Collections/Merchandise.webp?updatedAt=1761390411855',
    products: ['merchandise'],
    featured: true,
    upcoming: true
  },
  // {
  //   id: 'microlots',
  //   name: 'Microlots',
  //   title: 'Microlots',
  //   description: 'Exclusive small-batch coffees from single estates, offering unique and extraordinary flavor profiles for the discerning coffee connoisseur.',
  //   price: 'Coming Soon',
  //   image: 'src/assets/images/categories/Western Ghats Select.webp',
  //   products: [],
  //   featured: true,
  //   upcoming: true
  // }
];

// Category labels mapping for display
export const categoryLabels: Record<string, string> = {
  'western-ghats-selects': 'Western Ghats Selects',
  'signature-blends': 'Signature Blends',
  'gadgets': 'Gadgets',
  'merchandise': 'Merchandise',
  'microlots': 'Microlots'
};

// Helper functions
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

// Get all available categories for filtering
export const getAvailableCategories = () => {
  return collections.map(collection => ({
    id: collection.id,
    label: collection.name,
    upcoming: collection.upcoming || false
  }));
};