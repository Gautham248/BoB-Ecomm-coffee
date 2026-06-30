import type { Product, ShopifyVariant } from '../types/product';

const SHOPIFY_DOMAIN = 'beansofbodhi.myshopify.com';
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || 'b8f1f60c294032ca5816afa179b3636c';
const API_VERSION = '2023-10';

interface ShopifyImage {
  id: string;
  src: string;
  altText?: string;
}

interface ShopifyProductResponse {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  tags: string[];
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        availableForSale: boolean;
      };
    }>;
  };
}

async function shopifyQuery(query: string, variables: Record<string, unknown> = {}): Promise<{ data: unknown; errors?: Array<{ message: string }> }> {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json() as Promise<{ data: unknown; errors?: Array<{ message: string }> }>;
}

export async function fetchAllProducts(): Promise<Product[]> {
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

  const result = await shopifyQuery(query, { first: 250 });
  if (result.errors) {
    console.error('Shopify API errors:', result.errors);
    return [];
  }

  const data = result.data as {
    products: { edges: Array<{ node: ShopifyProductResponse }> };
  };

  return data.products.edges.map(({ node }) => {
    const images = node.images.edges.map((e) => e.node);
    const variants: ShopifyVariant[] = node.variants.edges.map((e) => ({
      id: e.node.id,
      title: e.node.title,
      price: `${e.node.price.amount} ${e.node.price.currencyCode}`,
      available: e.node.availableForSale,
    }));

    const handle = node.handle;
    const heroImage = images[0]?.src || '';

    return {
      id: handle,
      shopifyId: node.id,
      name: node.title.toUpperCase(),
      title: node.title,
      description: node.description,
      price: variants.length > 0 ? `${variants[0].price}` : 'N/A',
      heroImage,
      heroImageMobile: heroImage,
      productCardImage: heroImage,
      galleryImages: images.slice(0, 4).map((i) => i.src),
      traceability: {
        source: '',
        tasteNotes: [],
        process: '',
        elevation: '',
      },
      descriptionContent: {
        title: node.title,
        content: node.description,
        image: heroImage,
      },
      category: (node.productType || '').toLowerCase().replace(/\s+/g, '-'),
      featured: false,
      upcoming: false,
      shopifyVariants: variants,
    };
  });
}

export async function getCheapestPrice(collectionProducts: string[]): Promise<string> {
  if (collectionProducts.length === 0) return 'N/A';
  const allProducts = await fetchAllProducts();
  let cheapest = Infinity;
  for (const shopifyId of collectionProducts) {
    const product = allProducts.find((p) => p.shopifyId === shopifyId);
    if (!product?.shopifyVariants) continue;
    for (const v of product.shopifyVariants) {
      const price = parseFloat(v.price.replace(/[^0-9.]/g, ''));
      if (!isNaN(price) && price < cheapest) cheapest = price;
    }
  }
  return cheapest === Infinity ? 'N/A' : `From ₹${cheapest.toLocaleString('en-IN')}`;
}
