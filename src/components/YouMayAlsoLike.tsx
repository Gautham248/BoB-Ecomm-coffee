import React from 'react';
import { Product, products, getProductsByCategory } from '../data/collections';
import ProductCard from './ProductCard';

interface YouMayAlsoLikeProps {
  currentProductId: string;
  onProductClick: (productId: string) => void;
  maxProducts?: number;
}

const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({ 
  currentProductId, 
  onProductClick,
  maxProducts = 4 
}) => {
  // Get the current product
  const currentProduct = products.find(p => p.id === currentProductId);
  
  if (!currentProduct) return null;

  // Get related products from the same category, excluding the current product
  const categoryProducts = getProductsByCategory(currentProduct.category)
    .filter(p => p.id !== currentProductId);

  // If not enough products in the same category, add products from other categories
  let relatedProducts = [...categoryProducts];
  
  if (relatedProducts.length < maxProducts) {
    const otherProducts = products.filter(
      p => p.id !== currentProductId && p.category !== currentProduct.category
    );
    relatedProducts = [...relatedProducts, ...otherProducts];
  }

  // Limit to maxProducts
  relatedProducts = relatedProducts.slice(0, maxProducts);

  if (relatedProducts.length === 0) return null;

  // Category labels mapping
  const categoryLabels: Record<string, string> = {
    'nitro-blends': 'Nitro Blends',
    'western-ghats-selects': 'Western Ghats Selects'
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-pangaia font-bold text-gray-900 mb-3">
            You May Also Like
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Discover more exceptional coffee from our collection
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product.id)}
              categoryLabel={categoryLabels[product.category]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;