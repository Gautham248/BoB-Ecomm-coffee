// AddToCartSection.tsx - Fixed version with better state handling
import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../data/collections';

interface AddToCartSectionProps {
  product: Product;
}

const AddToCartSection: React.FC<AddToCartSectionProps> = ({ product }) => {
  const { addToCart, loading, toggleCart, error, initialized } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.shopifyVariants?.[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setSelectedVariant(product.shopifyVariants?.[0]?.id || '');
    setQuantity(1);
    setIsDropdownOpen(false);
    setLocalLoading(false);
  }, [product.id]); // Reset when product ID changes

  const selectedVariantData = product.shopifyVariants?.find(v => v.id === selectedVariant);

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariantData?.available) {
      console.error('No variant selected or variant not available');
      return;
    }
    
    // Prevent double-clicking
    if (localLoading || loading) {
      return;
    }
    
    setLocalLoading(true);
    
    console.log('Adding to cart - Variant ID:', selectedVariant, 'Quantity:', quantity);
    
    try {
      await addToCart(selectedVariant, quantity);
      // Optionally open cart after adding
      setTimeout(() => {
        toggleCart();
      }, 500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const formatPrice = (price: string | { amount: string; currencyCode: string }) => {
    if (typeof price === 'object' && price.amount) {
      return `₹${parseFloat(price.amount).toFixed(2)}`;
    }
    if (typeof price === 'string') {
      return `₹${parseFloat(price).toFixed(2)}`;
    }
    return price;
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  // Check if the add to cart button should be disabled
  const isAddToCartDisabled = () => {
    return (
      !initialized || // Cart not initialized
      localLoading || // Local loading state
      loading || // Global loading state
      !selectedVariantData?.available || // Variant not available
      !selectedVariant // No variant selected
    );
  };

  if (!product.shopifyVariants || product.shopifyVariants.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center text-gray-500">
          Product variants not available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Price Display */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {selectedVariantData ? formatPrice(selectedVariantData.price) : product.price}
        </div>
        <div className="text-sm text-gray-500">
          Free shipping on orders over ₹1,000
        </div>
      </div>

      {/* Variant Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Grind Type
        </label>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
            disabled={isAddToCartDisabled()}
          >
            <span className="text-gray-900">
              {selectedVariantData?.title || 'Select size'}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {product.shopifyVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedVariant === variant.id ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                  }`}
                  disabled={!variant.available}
                >
                  <div className="flex items-center justify-between">
                    <span>{variant.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{formatPrice(variant.price)}</span>
                      {!variant.available && (
                        <span className="text-xs text-red-500">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={decrementQuantity}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 1 || isAddToCartDisabled()}
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          
          <span className="w-12 text-center text-lg font-medium">
            {quantity}
          </span>
          
          <button
            onClick={incrementQuantity}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAddToCartDisabled()}
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAddToCartDisabled()}
        className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {(localLoading || loading) ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Adding to Cart...</span>
          </>
        ) : !initialized ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Initializing Cart...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>

      {/* Product Info */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>✓ Premium quality beans from Western Ghats</p>
        <p>✓ Freshly roasted to order</p>
        <p>✓ Sustainable and ethically sourced</p>
      </div>
    </div>
  );
};

export default AddToCartSection;