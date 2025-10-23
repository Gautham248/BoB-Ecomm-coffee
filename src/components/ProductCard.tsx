import React from 'react';

interface Product {
  id: string;
  name: string;
  title: string;
  price: string;
  heroImage: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  categoryLabel?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, categoryLabel }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.heroImage}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {categoryLabel || product.category}
        </p>
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {product.title}
        </h3>
        <p className="text-sm font-semibold text-gray-900">
          {product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;