import React from 'react';

interface Product {
  id: string;
  name: string;
  title: string;
  price: string;
  productCardImage: string;
  category: string;
  upcoming?: boolean;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  categoryLabel?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, categoryLabel }) => {
  const isUpcoming = product.upcoming || false;

  return (
    <div 
      onClick={isUpcoming ? undefined : onClick}
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
        isUpcoming ? 'cursor-default opacity-75' : 'cursor-pointer'
      }`}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img
          src={product.productCardImage}
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isUpcoming ? 'grayscale' : 'hover:scale-105'
          }`}
        />
        {isUpcoming && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white/90 px-4 py-2 rounded-full">
              <p className="text-sm font-semibold text-gray-900">Coming Soon</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {categoryLabel || product.category}
        </p>
        <h3 className={`text-sm font-medium mb-2 ${
          isUpcoming ? 'text-gray-500' : 'text-gray-900'
        }`}>
          {product.title}
        </h3>
        <p className={`text-sm font-semibold ${
          isUpcoming ? 'text-gray-400' : 'text-gray-900'
        }`}>
          {isUpcoming ? 'Stay Tuned' : product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;