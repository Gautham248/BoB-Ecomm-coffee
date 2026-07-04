import { readCache, writeCache, hasLocalData, restoreFromFirestore } from './cacheService';
import { collections, categoryLabels, headerProducts } from '../data/collections';
import type { AdminCache } from '../types/admin';
import type { Product, Collection, Review } from '../types/product';

const defaultHeroSlides = [
  {
    type: 'video' as const,
    url: '/videos/Bob_Main_Hero__2-transcode.mp4',
    mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/title_video.mp4',
  },
  {
    type: 'video' as const,
    url: 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362',
    mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/movement.mp4',
  },
];

const defaultShopBannerImages = [
  'https://ik.imagekit.io/nzkbravfr/Banner/origin.png?updatedAt=1761489002944',
  'https://ik.imagekit.io/nzkbravfr/Banner/tornado%20twist.png?updatedAt=1761489002921',
  'https://ik.imagekit.io/nzkbravfr/Banner/High%20tide.png?updatedAt=1761489002900',
  'https://ik.imagekit.io/nzkbravfr/Banner/wild%20fire%20rush.png?updatedAt=1761489002944',
  'https://ik.imagekit.io/nzkbravfr/Banner/eco2.png?updatedAt=1761489002895',
  'https://ik.imagekit.io/nzkbravfr/Banner/thunder%20fuse.png?updatedAt=1761489002932',
];

async function buildFullCache(): Promise<AdminCache> {
  const cache = readCache();
  const { products } = await import('../data/collections');
  const { products: movementProducts } = await import('../data/movement');

  const featuredProductIds = products
    .filter((p) => p.featured)
    .map((p) => ({ productId: p.id, displayTitle: p.title, displayImage: p.heroImage }));

  const productMetadata: Record<string, Partial<Product>> = {};
  const productReviews: Record<string, Review[]> = {};

  for (const p of products) {
    const { reviews, ...rest } = p as Product & { reviews?: Review[] };
    productMetadata[p.id] = { ...rest } as Partial<Product>;
    if (reviews && reviews.length > 0) {
      productReviews[p.id] = reviews;
    }
  }

  for (const p of movementProducts) {
    const mv = p as unknown as Product;
    if (mv.reviews && mv.reviews.length > 0) {
      productReviews[mv.id] = mv.reviews;
    }
  }

  return {
    ...cache,
    heroSettings: {
      ...cache.heroSettings,
      slides: cache.heroSettings.slides.length > 0 ? cache.heroSettings.slides : defaultHeroSlides,
      shopBannerImages: cache.heroSettings.shopBannerImages?.length > 0 ? cache.heroSettings.shopBannerImages : defaultShopBannerImages,
    },
    collections: cache.collections.length > 0 ? cache.collections : collections,
    productMetadata:
      Object.keys(cache.productMetadata).length > 0 ? cache.productMetadata : productMetadata,
    featuredProducts:
      cache.featuredProducts.length > 0 ? cache.featuredProducts : featuredProductIds,
    headerProducts: cache.headerProducts.length > 0 ? cache.headerProducts : headerProducts.map((p) => p.id),
    movementProducts: cache.movementProducts.length > 0 ? cache.movementProducts : movementProducts.map((p) => ({
      id: (p as Record<string, unknown>).id as string || '',
      shopifyId: (p as Record<string, unknown>).shopifyId as string || '',
      name: (p as Record<string, unknown>).name as string || '',
      title: (p as Record<string, unknown>).title as string || '',
      description: (p as Record<string, unknown>).description as string || '',
      price: (p as Record<string, unknown>).price as string || '',
      heroImage: (p as Record<string, unknown>).heroImage as string || '',
      heroImageMobile: (p as Record<string, unknown>).heroImageMobile as string || '',
      productCardImage: (p as Record<string, unknown>).productCardImage as string || '',
      galleryImages: ((p as Record<string, unknown>).galleryImages as string[]) || [],
      traceability: (p as Record<string, unknown>).traceability || { source: [], tasteNotes: [], process: [], elevation: '' },
      descriptionContent: (p as Record<string, unknown>).descriptionContent || { title: '', content: '', image: '' },
      category: (p as Record<string, unknown>).category as string || '',
      shopifyVariants: ((p as Record<string, unknown>).shopifyVariants as Product['shopifyVariants']) || [],
      reviews: ((p as Record<string, unknown>).reviews as Product['reviews']) || [],
    })),
    categoryLabels:
      Object.keys(cache.categoryLabels).length > 0 ? cache.categoryLabels : categoryLabels,
    productReviews:
      Object.keys(cache.productReviews || {}).length > 0 ? (cache.productReviews || {}) : productReviews,
  };
}

async function pushToFirestore(cache: AdminCache): Promise<void> {
  try {
    const {
      writeFirestoreCache,
      writeCollection,
    } = await import('./firestoreService');
    const { products } = await import('../data/collections');
    const { products: movementProducts } = await import('../data/movement');

    // Write admin_cache — productMetadata in cache now includes shopifyVariants
    await writeFirestoreCache(cache);

    // Write individual product documents (full, with variants)
    await writeCollection('products', products as Product[]);

    await writeCollection('collections', cache.collections.length > 0 ? cache.collections : (collections as Collection[]));

    const mvProducts: Product[] = movementProducts.map((p) => ({
      ...p,
      id: (p as Record<string, unknown>).id as string || '',
      shopifyId: (p as Record<string, unknown>).shopifyId as string || '',
      name: (p as Record<string, unknown>).name as string || '',
      title: (p as Record<string, unknown>).title as string || '',
      description: (p as Record<string, unknown>).description as string || '',
      price: (p as Record<string, unknown>).price as string || '',
      heroImage: (p as Record<string, unknown>).heroImage as string || '',
      heroImageMobile: (p as Record<string, unknown>).heroImageMobile as string || '',
      productCardImage: (p as Record<string, unknown>).productCardImage as string || '',
      galleryImages: ((p as Record<string, unknown>).galleryImages as string[]) || [],
      traceability: (p as Record<string, unknown>).traceability || { source: [], tasteNotes: [], process: [], elevation: '' },
      descriptionContent: (p as Record<string, unknown>).descriptionContent || { title: '', content: '', image: '' },
      category: (p as Record<string, unknown>).category as string || '',
      shopifyVariants: ((p as Record<string, unknown>).shopifyVariants as Product['shopifyVariants']) || [],
      reviews: ((p as Record<string, unknown>).reviews as Product['reviews']) || [],
    }));
    await writeCollection('movement_products', mvProducts);

    console.log('Firestore: all data pushed successfully');
  } catch (err) {
    console.error('Firestore push failed:', err);
  }
}

export async function seedCacheIfEmpty(): Promise<void> {
  if (hasLocalData()) {
    pushToFirestore(readCache()).catch(() => {});
    return;
  }

  try {
    const { readFirestoreCache } = await import('./firestoreService');
    const remote = await readFirestoreCache();
    if (remote && remote.collections.length > 0) {
      restoreFromFirestore(remote);
      console.log('Cache restored from Firestore');
      return;
    }
  } catch {
    console.log('Firestore unavailable, using local cache');
  }

  const cache = await buildFullCache();
  writeCache(cache);
  pushToFirestore(cache).catch(() => {});
  console.log('Cache seeded from local data, pushing to Firestore');
}

export { pushToFirestore };
