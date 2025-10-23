// CartSidebar.tsx - Updated for Shopify SDK price structure
import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartSidebar: React.FC = () => {
  const { 
    isOpen, 
    toggleCart, 
    items, 
    itemCount, 
    subtotal, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    proceedToCheckout,
    error
  } = useCart();

  const formatPrice = (price: string | { amount: string; currencyCode: string }): string => {
    if (typeof price === 'object' && price.amount) {
      return `₹${parseFloat(price.amount).toFixed(2)}`;
    }
    if (typeof price === 'string') {
      return `₹${parseFloat(price).toFixed(2)}`;
    }
    return '₹0.00';
  };

  const handleQuantityChange = async (lineItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(lineItemId);
    } else {
      await updateCartItem(lineItemId, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={toggleCart}
      />
      
      {/* Cart Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {!loading && items.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some delicious coffee to get started!</p>
                <button
                  onClick={toggleCart}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {!loading && items.length > 0 && (
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.variant?.image?.src ? (
                        <img
                          src={item.variant.image.src}
                          alt={item.variant.image.altText || item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                          <span className="text-amber-600 text-xs font-medium">BOB</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.variant?.title}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.variant?.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={loading}
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={loading}
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      disabled={loading}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={proceedToCheckout}
                disabled={loading}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {/* Continue Shopping */}
              <button
                onClick={toggleCart}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>

              {/* Security Info */}
              <div className="text-center text-xs text-gray-500 pt-2">
                <p>🔒 Secure checkout powered by Shopify</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;