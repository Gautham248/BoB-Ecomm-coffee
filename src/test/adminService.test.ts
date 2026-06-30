import { getAllProducts, getProductById } from '../services/adminService';
import { writeCache } from '../services/cacheService';

function clearLocalStorage() {
  localStorage.removeItem('bob-admin-cache');
}

const validCache = {
  version: 3,
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

function seedCache(metadata: Record<string, unknown>) {
  const cache = { ...validCache, productMetadata: metadata };
  writeCache(cache);
}

beforeEach(() => {
  clearLocalStorage();
});

describe('getAllProducts', () => {
  test('returns empty array when no product metadata', () => {
    seedCache({});
    const products = getAllProducts();
    expect(products).toEqual([]);
  });

  test('returns products from productMetadata with defaults applied', () => {
    seedCache({
      'the-origin': {
        name: 'THE ORIGIN',
        title: 'The Origin',
        description: 'A nutty blend',
        price: 'INR 799.00',
        heroImage: 'https://example.com/img.png',
        heroImageMobile: 'https://example.com/img-mob.png',
        productCardImage: 'https://example.com/card.png',
        galleryImages: [],
        traceability: { source: 'Wayanad', tasteNotes: ['Sweet'], process: 'Natural', elevation: '3200ft' },
        descriptionContent: { title: 'Rooted', content: 'Content', image: 'https://example.com/desc.png' },
        category: 'signature-blends',
      },
    });

    const products = getAllProducts();
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: 'the-origin',
      name: 'THE ORIGIN',
      title: 'The Origin',
      category: 'signature-blends',
      featured: false,
      upcoming: false,
    });
  });

  test('skips movement-prefixed product IDs from productMetadata', () => {
    seedCache({
      'movement-device': { name: 'Device' },
      'the-origin': {
        name: 'THE ORIGIN', title: 'The Origin', description: '', price: '',
        heroImage: '', heroImageMobile: '', productCardImage: '', galleryImages: [],
        traceability: { source: '', tasteNotes: [], process: '', elevation: '' },
        descriptionContent: { title: '', content: '', image: '' },
        category: '',
      },
    });

    const products = getAllProducts();
    expect(products).toHaveLength(1);
    expect(products[0].id).toBe('the-origin');
  });
});

describe('getProductById', () => {
  test('returns undefined for missing product', () => {
    seedCache({});
    expect(getProductById('nonexistent')).toBeUndefined();
  });

  test('finds product by ID', () => {
    seedCache({
      'the-origin': {
        name: 'THE ORIGIN', title: 'The Origin', description: '', price: '',
        heroImage: '', heroImageMobile: '', productCardImage: '', galleryImages: [],
        traceability: { source: '', tasteNotes: [], process: '', elevation: '' },
        descriptionContent: { title: '', content: '', image: '' },
        category: '',
      },
    });
    const product = getProductById('the-origin');
    expect(product).toBeDefined();
    expect(product!.name).toBe('THE ORIGIN');
  });
});
