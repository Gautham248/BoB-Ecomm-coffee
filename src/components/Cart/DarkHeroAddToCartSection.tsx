// DarkHeroAddToCartSection.tsx - Styled for dark hero background
import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../data/collections';
// import { fetchAllProductsAndDownload } from '../../utils/shopify';

interface DarkHeroAddToCartSectionProps {
  product: Product;
}

const DarkHeroAddToCartSection: React.FC<DarkHeroAddToCartSectionProps> = ({ product }) => {
  const { addToCart, loading, toggleCart, error, initialized } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.shopifyVariants?.[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    setSelectedVariant(product.shopifyVariants?.[0]?.id || '');
    setQuantity(1);
    setIsDropdownOpen(false);
    setLocalLoading(false);
  }, [product.id]);

  const selectedVariantData = product.shopifyVariants?.find(v => v.id === selectedVariant);

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariantData?.available) {
      return;
    }

    if (localLoading || loading) {
      return;
    }

    setLocalLoading(true);

    try {
      await addToCart(selectedVariant, quantity);

      // Trigger product download for debugging
      // fetchAllProductsAndDownload();

      setTimeout(() => {
        toggleCart();
      }, 500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const formatPrice = (price: string | { amount: string; currencyCode: string }): string => {
    if (typeof price === 'object' && price.amount) {
      return `₹${parseFloat(price.amount).toFixed(2)}`;
    }
    if (typeof price === 'string') {
      return `₹${parseFloat(price).toFixed(2)}`;
    }
    return '₹0.00';
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const isAddToCartDisabled = () => {
    return (
      !initialized ||
      localLoading ||
      loading ||
      !selectedVariantData?.available ||
      !selectedVariant
    );
  };

  if (!product.shopifyVariants || product.shopifyVariants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 mt-1">

      {/* Price Display */}

      <div className="text-white">
        <div className="text-3xl font-pangaia font-medium mb-1">
          {selectedVariantData ? formatPrice(selectedVariantData.price) : formatPrice(product.price)}
        </div>
      </div>


      {/* Variant Selector - Dark Style */}
      {product.shopifyVariants.length > 1 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            Capacity
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-5 py-2.5 border border-white/30 rounded-lg bg-white/5 text-white hover:border-white/50 transition-colors text-sm flex items-center justify-between"
              disabled={isAddToCartDisabled()}
            >
              <span>{selectedVariantData?.title || '400ml'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-white/20 rounded-lg shadow-xl z-10 w-full">
                {product.shopifyVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedVariant === variant.id ? 'bg-white/10 text-white' : 'text-white/80'
                      }`}
                    disabled={!variant.available}
                  >
                    <div className="flex items-center justify-between">
                      <span>{variant.title}</span>
                      {!variant.available && (
                        <span className="text-xs text-red-400">Out of Stock</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


      {/* Quantity and Add to Cart Row */}
      <div className="flex items-center space-x-4">
        {/* Quantity Selector */}
        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <button
            onClick={decrementQuantity}
            className="p-3 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
            disabled={quantity <= 1 || isAddToCartDisabled()}
          >
            <Minus className="w-4 h-4 text-white" />
          </button>

          <span className="w-12 text-center text-lg font-medium text-white">
            {quantity}
          </span>

          <button
            onClick={incrementQuantity}
            className="p-3 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
            disabled={isAddToCartDisabled()}
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled()}
          className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
        >
          {(localLoading || loading) ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Adding...</span>
            </div>
          ) : !initialized ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading...</span>
            </div>
          ) : (
            'Add to cart'
          )}
        </button>
      </div>

      {/* Buy Now Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAddToCartDisabled()}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {(localLoading || loading) ? 'Processing...' : 'Buy now'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DarkHeroAddToCartSection;