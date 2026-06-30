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
const CURRENT_VERSION = 3;

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

export function readCache(): AdminCache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { ...DEFAULT_CACHE };
    const parsed = validateCache(JSON.parse(raw));
    if (parsed.version !== CURRENT_VERSION) {
      localStorage.removeItem(CACHE_KEY);
      return { ...DEFAULT_CACHE };
    }
    return { ...DEFAULT_CACHE, ...parsed };
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return { ...DEFAULT_CACHE };
  }
}

export function writeCache(cache: AdminCache): void {
  cache.lastSynced = new Date().toISOString();
  cache.version = CURRENT_VERSION;
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
