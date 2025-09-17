// shopify.ts - Updated with proper API version and types
import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'beansofbodhi.myshopify.com',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "b8f1f60c294032ca5816afa179b3636c",
  apiVersion: '2023-10'
});

export default client;

// Updated Types to match Shopify Buy SDK response structure
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  images: Array<{
    id: string;
    src: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    available: boolean;
  }>;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface CartItem {
  id: string;
  title: string;
  variant: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      src: string;
      altText?: string;
    };
  };
  quantity: number;
}

export interface ShopifyCheckout {
  id: string;
  webUrl: string;
  lineItems: CartItem[];
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  currencyCode: string;
}