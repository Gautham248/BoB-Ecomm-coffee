import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, getAvailableCategories, categoryLabels } from '../data/collections';
import ShopAllBanner from '../components/ShopAllBanner';

// Filter Pills Component
const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onToggleCategory,
  onClearAll 
}: { 
  categories: Array<{ id: string; label: string; upcoming: boolean }>;
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onClearAll: () => void;
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
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
          {category.upcoming && (
            <span className="ml-2 text-xs opacity-75">(Coming Soon)</span>
          )}
        </button>
      ))}
    </div>
  );
};

// Upcoming Product Card Component
const UpcomingProductCard: React.FC<{ categoryLabel: string }> = ({ categoryLabel }) => {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border-2 border-dashed border-gray-300">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600">Coming Soon</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {categoryLabel}
        </p>
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          New Products Coming Soon
        </h3>
        <p className="text-sm font-semibold text-gray-500">
          Stay Tuned
        </p>
      </div>
    </div>
  );
};

// Main Shop All Page Component
const ShopAllPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const availableCategories = getAvailableCategories();

  // Initialize selected categories from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  const handleToggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    
    // Update URL
    if (newCategories.length === 0) {
      setSearchParams({});
    } else if (newCategories.length === 1) {
      setSearchParams({ category: newCategories[0] });
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSearchParams({});
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

  // Check if selected categories include upcoming ones
  const hasUpcomingCategories = useMemo(() => {
    return selectedCategories.some(catId => {
      const category = availableCategories.find(c => c.id === catId);
      return category?.upcoming;
    });
  }, [selectedCategories, availableCategories]);

  // Get upcoming category labels for display
  const upcomingCategoryLabels = useMemo(() => {
    return selectedCategories
      .filter(catId => {
        const category = availableCategories.find(c => c.id === catId);
        return category?.upcoming;
      })
      .map(catId => categoryLabels[catId]);
  }, [selectedCategories, availableCategories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          All Products
        </h1>
        <ShopAllBanner 
        images={[
          'https://ik.imagekit.io/nzkbravfr/Banner/origin.png?updatedAt=1761489002944',
          'https://ik.imagekit.io/nzkbravfr/Banner/tornado%20twist.png?updatedAt=1761489002921',
          'https://ik.imagekit.io/nzkbravfr/Banner/High%20tide.png?updatedAt=1761489002900',
          'https://ik.imagekit.io/nzkbravfr/Banner/wild%20fire%20rush.png?updatedAt=1761489002944',
          'https://ik.imagekit.io/nzkbravfr/Banner/eco2.png?updatedAt=1761489002895',
          'https://ik.imagekit.io/nzkbravfr/Banner/thunder%20fuse.png?updatedAt=1761489002932',

        ]}
      />
        {/* Category Filters */}
        <CategoryFilter
          categories={availableCategories}
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
          
          {/* Show upcoming cards if upcoming categories are selected */}
          {/* {hasUpcomingCategories && upcomingCategoryLabels.map((label, index) => (
            <UpcomingProductCard 
              key={`upcoming-${index}`}
              categoryLabel={label}
            />
          ))} */}
          {/* {selectedCategories.length === 0 
            ? availableCategories
                .filter(cat => cat.upcoming)
                .map((category, index) => (
                    <UpcomingProductCard 
                    key={`upcoming-${index}`}
                    categoryLabel={category.label}
                    />
                ))
            : 
            hasUpcomingCategories && upcomingCategoryLabels.map((label, index) => (
                <UpcomingProductCard 
                    key={`upcoming-${index}`}
                    categoryLabel={label}
                />
                ))
            } */}
        </div>

        {/* Empty State - only show if no products AND no upcoming categories */}
        {filteredProducts.length === 0 && !hasUpcomingCategories && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No products found in the selected categories.
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-8 text-center text-sm text-gray-600">
          {filteredProducts.length > 0 && (
            <>Showing {filteredProducts.length} of {products.length} products</>
          )}
          {hasUpcomingCategories && filteredProducts.length === 0 && (
            <>New products coming soon in {upcomingCategoryLabels.join(', ')}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopAllPage;