export interface Review {
  customerName: string;
  rating: number;
  date: string;
  purchase: string;
  title: string;
  content: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
}

export interface Product {
  id: string;
  shopifyId?: string;
  reviews?: Review[];
  shopifyVariants?: ShopifyVariant[];
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
  productCardImage: string;
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

export interface CategoryInfo {
  id: string;
  label: string;
  upcoming: boolean;
}
