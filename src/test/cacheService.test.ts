import { validateCache, readCache } from '../services/cacheService';

function setLocalStorage(data: unknown) {
  localStorage.setItem('bob-admin-cache', JSON.stringify(data));
}

function clearLocalStorage() {
  localStorage.removeItem('bob-admin-cache');
}

const validCache = {
  version: 5,
  lastSynced: '2026-06-30T00:00:00Z',
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

beforeEach(() => {
  clearLocalStorage();
});

describe('validateCache', () => {
  test('accepts valid cache object', () => {
    expect(() => validateCache(validCache)).not.toThrow();
  });

  test('rejects null', () => {
    expect(() => validateCache(null)).toThrow('Cache is not an object');
  });

  test('rejects undefined', () => {
    expect(() => validateCache(undefined)).toThrow('Cache is not an object');
  });

  test('rejects non-object', () => {
    expect(() => validateCache('string')).toThrow('Cache is not an object');
    expect(() => validateCache(42)).toThrow('Cache is not an object');
  });

  test('rejects missing version', () => {
    const bad = { ...validCache, version: 'not-a-number' };
    expect(() => validateCache(bad)).toThrow('Cache missing version');
  });

  test('rejects non-array collections', () => {
    const bad = { ...validCache, collections: 'not-array' };
    expect(() => validateCache(bad)).toThrow('Cache collections not an array');
  });

  test('rejects non-array featuredProducts', () => {
    const bad = { ...validCache, featuredProducts: null };
    expect(() => validateCache(bad)).toThrow('Cache featuredProducts not an array');
  });

  test('rejects non-array headerProducts', () => {
    const bad = { ...validCache, headerProducts: 123 };
    expect(() => validateCache(bad)).toThrow('Cache headerProducts not an array');
  });

  test('rejects non-array movementProducts', () => {
    const bad = { ...validCache, movementProducts: 'not-array' };
    expect(() => validateCache(bad)).toThrow('Cache movementProducts not an array');
  });

  test('rejects non-object productMetadata', () => {
    const bad = { ...validCache, productMetadata: 'not-object' };
    expect(() => validateCache(bad)).toThrow('Cache productMetadata invalid');
  });

  test('rejects non-object categoryLabels', () => {
    const bad = { ...validCache, categoryLabels: [] };
    expect(() => validateCache(bad)).toThrow('Cache categoryLabels invalid');
  });

  test('accepts null productMetadata', () => {
    const cache = { ...validCache, productMetadata: null };
    expect(() => validateCache(cache)).not.toThrow();
  });

  test('accepts null categoryLabels', () => {
    const cache = { ...validCache, categoryLabels: null };
    expect(() => validateCache(cache)).not.toThrow();
  });
});

describe('readCache', () => {
  test('returns default cache when localStorage empty', () => {
    const cache = readCache();
    expect(cache.version).toBe(5);
    expect(cache.collections).toEqual([]);
    expect(cache.productMetadata).toEqual({});
  });

  test('returns validated cache from localStorage', () => {
    setLocalStorage(validCache);
    const cache = readCache();
    expect(cache.version).toBe(5);
    expect(cache.collections).toEqual([]);
  });

  test('resets on version mismatch', () => {
    const oldVersion = { ...validCache, version: 1 };
    setLocalStorage(oldVersion);
    const cache = readCache();
    expect(cache.version).toBe(5);
    expect(localStorage.getItem('bob-admin-cache')).toBeNull();
  });

  test('resets on corrupted data', () => {
    setLocalStorage({ version: 5, collections: 'not-array' });
    expect(localStorage.getItem('bob-admin-cache')).not.toBeNull();
    const cache = readCache();
    expect(cache.version).toBe(5);
    expect(cache.collections).toEqual([]);
    expect(localStorage.getItem('bob-admin-cache')).toBeNull();
  });

  test('resets on invalid JSON', () => {
    localStorage.setItem('bob-admin-cache', 'not-json-{{{');
    const cache = readCache();
    expect(cache.version).toBe(5);
    expect(localStorage.getItem('bob-admin-cache')).toBeNull();
  });
});
