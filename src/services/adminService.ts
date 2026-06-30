import type { Product, Collection, CategoryInfo } from '../types/product';
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
  return getAllProducts().find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter((p) => p.category === category);
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

  for (const [id, meta] of Object.entries(cache.productMetadata)) {
    if (id.startsWith('movement-')) continue;
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
        traceability: { source: '', tasteNotes: [], process: '', elevation: '' },
        descriptionContent: { title: '', content: '', image: '' },
        category: '',
        featured: false,
        upcoming: false,
        ...meta,
      } satisfies Product;
      validateProduct(product);
      products.push(product);
    } catch {
      console.warn('getAllProducts: skipping invalid product', id);
    }
  }

  for (const p of cache.movementProducts) {
    try {
      const product = {
        ...p,
        ...(cache.productMetadata[p.id] || {}),
      };
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
