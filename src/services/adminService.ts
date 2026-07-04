import type { Product, Collection, CategoryInfo, Review } from '../types/product';
import type { HeroSettings, FeaturedProductEntry, MediaSlide } from '../types/admin';
import { readCache } from './cacheService';
import { validateProduct } from './productValidation';

export function getHeroSettings(): HeroSettings {
  return readCache().heroSettings;
}

export function getHeroSlides(): MediaSlide[] {
  return readCache().heroSettings.slides;
}

export function getCollections(): Collection[] {
  return readCache().collections;
}

export function getFeaturedCollections(): Collection[] {
  return readCache().collections.filter((c) => c.featured);
}

export function getCollectionById(id: string): Collection | undefined {
  return readCache().collections.find((c) => c.id === id);
}

export function getProductsInCollection(collectionId: string): Product[] {
  const cache = readCache();
  const collection = cache.collections.find((c) => c.id === collectionId);
  if (!collection) return [];
  const allProducts = getAllProducts();
  return collection.products
    .map((pid) => allProducts.find((p) => p.id === pid))
    .filter(Boolean) as Product[];
}

export function getProductById(id: string): Product | undefined {
  const all = getAllProducts();
  return all.find((p) => p.id === id) || 
         all.find((p) => p.id === `the-${id}`) || 
         all.find((p) => p.id === id.replace(/^the-/, ''));
}

export function getProductsByCategory(category: string): Product[] {
  const collection = getCollections().find((c) => c.id === category);
  const all = getAllProducts();
  return all.filter((p) => {
    if (p.category === category) return true;
    if (!collection) return false;
    const stripped = p.id.replace(/^the-/, '');
    const prefixed = p.id.startsWith('the-') ? p.id : `the-${p.id}`;
    return collection.products.some(id => id === p.id || id === stripped || id === prefixed);
  });
}

export function getFeaturedProducts(): Product[] {
  const cache = readCache();
  if (cache.featuredProducts.length > 0) {
    const all = getAllProducts();
    return cache.featuredProducts
      .map((e) => all.find((p) => p.id === e.productId))
      .filter(Boolean) as Product[];
  }
  return getAllProducts().filter((p) => p.featured);
}

export function getFeaturedProductEntries(): FeaturedProductEntry[] {
  return readCache().featuredProducts;
}

export function getHeaderProducts(): Product[] {
  const cache = readCache();
  return cache.headerProducts
    .map((id) => getAllProducts().find((p) => p.id === id))
    .filter(Boolean) as Product[];
}

export function getMovementProducts(): Product[] {
  return readCache().movementProducts;
}

export function getProductReviews(productId: string): Review[] {
  const cache = readCache();
  const base = productId.replace(/^the-/, '');
  return cache.productReviews?.[productId]
    || cache.productReviews?.[`the-${base}`]
    || cache.productReviews?.[base]
    || [];
}

export function getCategoryLabels(): Record<string, string> {
  return readCache().categoryLabels;
}

export function getAvailableCategories(): CategoryInfo[] {
  return readCache().collections.map((c) => ({
    id: c.id,
    label: c.name,
    upcoming: c.upcoming || false,
  }));
}

export function getAllProducts(): Product[] {
  const cache = readCache();
  const products: Product[] = [];
  const seenHandles = new Set<string>();
  const seenShopifyIds = new Set<string>();

  const entries = Object.entries(cache.productMetadata).sort(([idA, metaA], [idB, metaB]) => {
    const prefixedA = idA.startsWith('the-') ? 1 : 0;
    const prefixedB = idB.startsWith('the-') ? 1 : 0;
    if (prefixedA !== prefixedB) return prefixedB - prefixedA;
    const hasImgA = (metaA && typeof metaA === 'object' && 'heroImage' in (metaA as Record<string, unknown>) && !!(metaA as Record<string, unknown>).heroImage) ? 1 : 0;
    const hasImgB = (metaB && typeof metaB === 'object' && 'heroImage' in (metaB as Record<string, unknown>) && !!(metaB as Record<string, unknown>).heroImage) ? 1 : 0;
    return hasImgB - hasImgA;
  });

  // IDs that belong exclusively to the movement/gadgets system and must never
  // appear as regular store products.
  const MOVEMENT_EXACT_IDS = new Set(['movement', 'the-movement']);

  for (const [id, meta] of entries) {
    if (id.startsWith('movement-')) continue;
    if (MOVEMENT_EXACT_IDS.has(id)) continue;
    const baseHandle = id.replace(/^the-/, '');
    if (seenHandles.has(baseHandle)) continue;
    seenHandles.add(baseHandle);

    try {
      const product = {
        id,
        shopifyId: '',
        name: '',
        title: '',
        description: '',
        price: '',
        heroImage: '',
        heroImageMobile: '',
        productCardImage: '',
        galleryImages: [],
        traceability: { source: [], tasteNotes: [], process: [], elevation: '' },
        descriptionContent: { title: '', content: '', image: '' },
        category: '',
        featured: false,
        upcoming: false,
        shopifyVariants: [] as Product['shopifyVariants'],
        ...meta,
      } as Product;
      if (!product.name) product.name = product.title || id.toUpperCase();
      if (!product.title) product.title = product.name || id;
      if (typeof product.category !== 'string') product.category = '';
      validateProduct(product);
      if (product.shopifyId) seenShopifyIds.add(product.shopifyId);
      products.push(product);
    } catch {
      console.warn('getAllProducts: skipping invalid product', id);
    }
  }

  for (const p of cache.movementProducts) {
    try {
      if (p.shopifyId && seenShopifyIds.has(p.shopifyId)) continue;
      const product = {
        ...p,
        ...(cache.productMetadata[p.id] || {}),
      } as Product;
      if (!product.name) product.name = product.title || p.id.toUpperCase();
      if (!product.title) product.title = product.name || p.id;
      if (typeof product.category !== 'string') product.category = '';
      validateProduct(product);
      products.push(product);
    } catch {
      console.warn('getAllProducts: skipping invalid movement product', p.id);
    }
  }

  return products;
}

export function getProductMetadata(productId: string): Partial<Product> {
  return readCache().productMetadata[productId] || {};
}
