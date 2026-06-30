import type { Product } from '../types/product';

export function validateProduct(product: unknown): asserts product is Product {
  if (!product || typeof product !== 'object') {
    throw new Error('Product: not an object');
  }
  const p = product as Record<string, unknown>;

  if (typeof p.id !== 'string' || !p.id) {
    throw new Error('Product: missing id');
  }
  if (typeof p.name !== 'string' || !p.name) {
    throw new Error('Product: missing name');
  }
  if (typeof p.title !== 'string' || !p.title) {
    throw new Error('Product: missing title');
  }
  if (typeof p.category !== 'string') {
    throw new Error('Product: invalid category');
  }
}
