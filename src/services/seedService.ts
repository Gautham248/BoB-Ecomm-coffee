import { readCache, writeCache, hasLocalData, restoreFromFirestore } from './cacheService';
import { collections, categoryLabels, headerProducts } from '../data/collections';
import type { AdminCache } from '../types/admin';
import type { Product, Collection } from '../types/product';

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

async function buildFullCache(): Promise<AdminCache> {
  const cache = readCache();
  const { products } = await import('../data/collections');
  const { products: movementProducts } = await import('../data/movement');

  const featuredProductIds = products
    .filter((p) => p.featured)
    .map((p) => ({ productId: p.id }));

  const productMetadata: Record<string, Partial<Product>> = {};
  for (const p of products) {
    const rest = { ...p };
    delete (rest as Record<string, unknown>).shopifyVariants;
    productMetadata[p.id] = rest;
  }

  return {
    ...cache,
    heroSettings: {
      ...cache.heroSettings,
      slides: cache.heroSettings.slides.length > 0 ? cache.heroSettings.slides : defaultHeroSlides,
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
      traceability: (p as Record<string, unknown>).traceability || { source: '', tasteNotes: [], process: '', elevation: '' },
      descriptionContent: (p as Record<string, unknown>).descriptionContent || { title: '', content: '', image: '' },
      category: (p as Record<string, unknown>).category as string || '',
    })),
    categoryLabels:
      Object.keys(cache.categoryLabels).length > 0 ? cache.categoryLabels : categoryLabels,
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

    await writeFirestoreCache(cache);

    const allProducts: Product[] = products.map((p) => {
      const { shopifyVariants, ...rest } = p;
      return { ...rest, id: p.id, shopifyVariants };
    });
    await writeCollection('products', allProducts);

    await writeCollection('collections', collections as Collection[]);

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
      traceability: (p as Record<string, unknown>).traceability || { source: '', tasteNotes: [], process: '', elevation: '' },
      descriptionContent: (p as Record<string, unknown>).descriptionContent || { title: '', content: '', image: '' },
      category: (p as Record<string, unknown>).category as string || '',
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
