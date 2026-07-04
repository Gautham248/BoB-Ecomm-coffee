import type { AdminCache } from '../types/admin';

let _writeFirestoreCache: ((cache: AdminCache) => Promise<void>) | null = null;

async function getFirestoreWriter() {
  if (!_writeFirestoreCache) {
    const mod = await import('./firestoreService');
    _writeFirestoreCache = mod.writeFirestoreCache;
  }
  return _writeFirestoreCache;
}

const CACHE_KEY = 'bob-admin-cache';
const CURRENT_VERSION = 5;

export function validateCache(data: unknown): AdminCache {
  if (!data || typeof data !== 'object') throw new Error('Cache is not an object');
  const obj = data as Record<string, unknown>;
  if (typeof obj.version !== 'number') throw new Error('Cache missing version');
  if (!Array.isArray(obj.collections)) throw new Error('Cache collections not an array');
  if (obj.productMetadata !== null && (typeof obj.productMetadata !== 'object' || Array.isArray(obj.productMetadata))) throw new Error('Cache productMetadata invalid');
  if (!Array.isArray(obj.featuredProducts)) throw new Error('Cache featuredProducts not an array');
  if (!Array.isArray(obj.headerProducts)) throw new Error('Cache headerProducts not an array');
  if (!Array.isArray(obj.movementProducts)) throw new Error('Cache movementProducts not an array');
  if (obj.categoryLabels !== null && (typeof obj.categoryLabels !== 'object' || Array.isArray(obj.categoryLabels))) throw new Error('Cache categoryLabels invalid');
  return data as AdminCache;
}

const DEFAULT_CACHE: AdminCache = {
  version: CURRENT_VERSION,
  lastSynced: '',
  heroSettings: {
    slides: [],
    shopBannerImages: [],
    imageDisplayDuration: 5000,
    showDots: true,
    showArrows: true,
    dotIndicatorBottom: { mobile: 10, desktop: 15 },
    dotIndicatorOpacity: 0.9,
    dotSize: { mobile: 6, desktop: 12 },
    dotActiveWidth: { mobile: 20, desktop: 32 },
    mobileAspectRatio: '1 / 1',
    desktopAspectRatio: '16 / 9',
    desktopHeight: '100vh',
    mobileObjectFit: 'cover',
    desktopObjectFit: 'cover',
  },
  collections: [],
  productMetadata: {},
  featuredProducts: [],
  headerProducts: [],
  movementProducts: [],
  categoryLabels: {},
};

function cleanDuplicateMetadata<T extends Record<string, unknown>>(metadata: T): T {
  const cleaned = { ...metadata } as T;
  for (const key of Object.keys(cleaned)) {
    if (!key.startsWith('the-') && !key.startsWith('movement-')) {
      if (cleaned[`the-${key}`]) {
        delete cleaned[key];
      }
    }
  }
  return cleaned;
}

const STALE_PRODUCT_IDS = new Set(['gadgets', 'merchandise']);
// Handles that must never live in productMetadata — they belong to movementProducts.
const MOVEMENT_SHOPIFY_HANDLES = new Set(['gadget', 'the-gadget', 'movement', 'the-movement']);

const DEFAULT_SHOP_BANNER_IMAGES = [
  'https://ik.imagekit.io/nzkbravfr/Banner/origin.png?updatedAt=1761489002944',
  'https://ik.imagekit.io/nzkbravfr/Banner/tornado%20twist.png?updatedAt=1761489002921',
  'https://ik.imagekit.io/nzkbravfr/Banner/High%20tide.png?updatedAt=1761489002900',
  'https://ik.imagekit.io/nzkbravfr/Banner/wild%20fire%20rush.png?updatedAt=1761489002944',
  'https://ik.imagekit.io/nzkbravfr/Banner/eco2.png?updatedAt=1761489002895',
  'https://ik.imagekit.io/nzkbravfr/Banner/thunder%20fuse.png?updatedAt=1761489002932',
];

function migrateStaleEntries(cache: AdminCache): AdminCache {
  let modified = false;

  const movementShopifyIds = new Set(
    cache.movementProducts.map((p) => p.shopifyId).filter(Boolean)
  );

  const cleanedMetadata: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(cache.productMetadata)) {
    const baseHandle = key.replace(/^the-/, '');
    if (STALE_PRODUCT_IDS.has(key) || STALE_PRODUCT_IDS.has(baseHandle)) {
      modified = true;
      continue;
    }
    if (MOVEMENT_SHOPIFY_HANDLES.has(key) || MOVEMENT_SHOPIFY_HANDLES.has(baseHandle)) {
      modified = true;
      continue;
    }
    const meta = val as Record<string, unknown> | null;
    if (meta?.shopifyId && movementShopifyIds.has(String(meta.shopifyId))) {
      modified = true;
      continue;
    }
    cleanedMetadata[key] = val;
  }
  if (modified) cache.productMetadata = cleanedMetadata as typeof cache.productMetadata;

  cache.movementProducts = cache.movementProducts.map((mp) => {
    if (mp.category !== 'gadgets') {
      modified = true;
      return { ...mp, category: 'gadgets' };
    }
    return mp;
  });

  const cleanedCollections = cache.collections.map((col) => {
    const origLen = col.products.length;
    col.products = col.products.filter((pid) => !STALE_PRODUCT_IDS.has(pid) && !STALE_PRODUCT_IDS.has(pid.replace(/^the-/, '')));
    if (col.id === 'gadgets' && !col.products.includes('movement')) {
      col.products = ['movement'];
      modified = true;
    } else if (col.products.length !== origLen) {
      modified = true;
    }
    return col;
  });
  cache.collections = cleanedCollections;

  const cleanedHeader = cache.headerProducts.filter((id) => {
    const stripped = id.replace(/^the-/, '');
    return !STALE_PRODUCT_IDS.has(id) && !STALE_PRODUCT_IDS.has(stripped)
      && !MOVEMENT_SHOPIFY_HANDLES.has(id) && !MOVEMENT_SHOPIFY_HANDLES.has(stripped);
  });
  if (cleanedHeader.length !== cache.headerProducts.length) {
    modified = true;
    cache.headerProducts = cleanedHeader;
  }

  if (!cache.heroSettings.shopBannerImages || cache.heroSettings.shopBannerImages.length === 0) {
    cache.heroSettings.shopBannerImages = DEFAULT_SHOP_BANNER_IMAGES;
    modified = true;
  }

  // Convert legacy traceability string fields to arrays
  for (const meta of Object.values(cache.productMetadata)) {
    const m = meta as Record<string, unknown>;
    if (!m.traceability || typeof m.traceability !== 'object') continue;
    const t = m.traceability as Record<string, unknown>;
    if (typeof t.source === 'string') { t.source = t.source ? [t.source] : []; modified = true; }
    if (typeof t.process === 'string') { t.process = t.process ? [t.process] : []; modified = true; }
  }

  if (modified) {
    writeCache(cache);
  }

  return cache;
}

export function readCache(): AdminCache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { ...DEFAULT_CACHE };
    const parsed = validateCache(JSON.parse(raw));
    if (parsed.version !== CURRENT_VERSION) {
      localStorage.removeItem(CACHE_KEY);
      return { ...DEFAULT_CACHE };
    }
    const cache = { ...DEFAULT_CACHE, ...parsed };
    cache.productMetadata = cleanDuplicateMetadata(cache.productMetadata as Record<string, unknown>) as typeof cache.productMetadata;
    return migrateStaleEntries(cache);
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return { ...DEFAULT_CACHE };
  }
}

export function writeCache(cache: AdminCache): void {
  cache.lastSynced = new Date().toISOString();
  cache.version = CURRENT_VERSION;
  cache.productMetadata = cleanDuplicateMetadata(cache.productMetadata as Record<string, unknown>) as typeof cache.productMetadata;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  getFirestoreWriter().then((fn) =>
    fn(cache).catch((err) => console.warn('Firestore write deferred:', err))
  );
}

export function updateCacheField<K extends keyof AdminCache>(key: K, value: AdminCache[K]): void {
  const cache = readCache();
  cache[key] = value;
  writeCache(cache);
}

export function hasLocalData(): boolean {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    validateCache(parsed);
    return parsed.collections?.length > 0 || parsed.movementProducts?.length > 0;
  } catch {
    return false;
  }
}

export function restoreFromFirestore(cache: AdminCache): void {
  validateCache(cache);
  cache.lastSynced = cache.lastSynced || new Date().toISOString();
  cache.version = CURRENT_VERSION;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}
