// shopify.ts - Updated with proper API version and types
import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'beansofbodhi.myshopify.com',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "b8f1f60c294032ca5816afa179b3636c",
  apiVersion: '2023-10'
});

export default client;

export const fetchAllProductsAndDownload = async () => {
  try {
    const products = await client.product.fetchAll();

    // Create a blob and download link
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "shopify_products.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Products downloaded successfully");
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};


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