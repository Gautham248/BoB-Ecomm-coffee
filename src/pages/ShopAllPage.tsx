import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/collections';

// Category configuration
const categories = [
  { id: 'nitro-blends', label: 'Nitro Blends' },
  { id: 'western-ghats-selects', label: 'Western Ghats Selects' }
];

// Category labels mapping
const categoryLabels: Record<string, string> = {
  'nitro-blends': 'Nitro Blends',
  'western-ghats-selects': 'Western Ghats Selects'
};

// Filter Pills Component
const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onToggleCategory,
  onClearAll 
}: { 
  categories: Array<{ id: string; label: string }>;
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onClearAll: () => void;
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={onClearAll}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          selectedCategories.length === 0
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Products
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onToggleCategory(category.id)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategories.includes(category.id)
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

// Main Shop All Page Component
const ShopAllPage = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return products;
    }
    return products.filter(product => 
      selectedCategories.includes(product.category)
    );
  }, [selectedCategories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          All Products
        </h1>

        {/* Category Filters */}
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          onClearAll={handleClearAll}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onClick={() => handleProductClick(product.id)}
              categoryLabel={categoryLabels[product.category]}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No products found in the selected categories.
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
};

export default ShopAllPage;