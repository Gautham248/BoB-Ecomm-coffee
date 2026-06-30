import { describe, test, expect } from 'vitest';
import { validateProduct } from '../services/productValidation';

const validProduct = {
  id: 'the-origin',
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
};

describe('validateProduct', () => {
  test('accepts a valid product', () => {
    expect(() => validateProduct(validProduct)).not.toThrow();
  });

  test('rejects null', () => {
    expect(() => validateProduct(null)).toThrow('Product: not an object');
  });

  test('rejects undefined', () => {
    expect(() => validateProduct(undefined)).toThrow('Product: not an object');
  });

  test('rejects missing id (empty string)', () => {
    const bad = { ...validProduct, id: '' };
    expect(() => validateProduct(bad)).toThrow('Product: missing id');
  });

  test('rejects non-string id', () => {
    const bad = { ...validProduct, id: 123 };
    expect(() => validateProduct(bad)).toThrow('Product: missing id');
  });

  test('rejects missing name', () => {
    const bad = { ...validProduct, name: '' };
    expect(() => validateProduct(bad)).toThrow('Product: missing name');
  });

  test('rejects missing title', () => {
    const bad = { ...validProduct, title: '' };
    expect(() => validateProduct(bad)).toThrow('Product: missing title');
  });

  test('rejects non-string category', () => {
    const bad = { ...validProduct, category: 42 };
    expect(() => validateProduct(bad)).toThrow('Product: invalid category');
  });
});
