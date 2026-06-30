// CartContext.tsx - Fixed version with better state management
/* eslint-disable @typescript-eslint/no-explicit-any -- Shopify SDK types are not fully typed */
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import client from '../utils/shopify';

interface CartState {
  isOpen: boolean;
  items: any[];
  checkout: any | null; // Using any for Shopify SDK types
  loading: boolean;
  error: string | null;
  itemCount: number;
  subtotal: string;
  initialized: boolean; // Add initialization flag
}

type CartAction =
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CHECKOUT'; payload: any }
  | { type: 'ADD_TO_CART_SUCCESS'; payload: { item: any; checkout: any } }
  | { type: 'UPDATE_CART_SUCCESS'; payload: any }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_INITIALIZED'; payload: boolean };

const initialState: CartState = {
  isOpen: false,
  items: [],
  checkout: null,
  loading: false,
  error: null,
  itemCount: 0,
  subtotal: '0.00',
  initialized: false
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null }; // Clear error when setting loading
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    
    case 'SET_CHECKOUT': {
      const checkout = action.payload;
      return {
        ...state,
        checkout: checkout,
        items: checkout?.lineItems || [],
        itemCount: checkout?.lineItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
        subtotal: checkout?.subtotalPrice?.amount || '0.00',
        loading: false,
        error: null,
        initialized: true
      };
    }
    
    case 'ADD_TO_CART_SUCCESS': {
      const updatedCheckout = action.payload.checkout;
      return {
        ...state,
        checkout: updatedCheckout,
        items: updatedCheckout.lineItems || [],
        itemCount: updatedCheckout.lineItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
        subtotal: updatedCheckout.subtotalPrice?.amount || '0.00',
        loading: false,
        error: null
      };
    }
    
    case 'UPDATE_CART_SUCCESS': {
      const updatedCart = action.payload;
      return {
        ...state,
        checkout: updatedCart,
        items: updatedCart.lineItems || [],
        itemCount: updatedCart.lineItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
        subtotal: updatedCart.subtotalPrice?.amount || '0.00',
        loading: false
      };
    }
    
    case 'CLEAR_CART':
      return { ...initialState, initialized: true };
    
    default:
      return state;
  }
};

interface CartContextType extends CartState {
  toggleCart: () => void;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateCartItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  proceedToCheckout: () => void;
  initializeCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// useCart depends on module-private CartContext; must live in same file
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize cart on mount
  useEffect(() => {
    if (!state.initialized) {
      initializeCart();
    }
  }, [state.initialized]);

  // Save checkout ID to cookies whenever checkout changes
  useEffect(() => {
    if (state.checkout?.id) {
      Cookies.set('shopify_checkout_id', state.checkout.id, { expires: 7 });
    }
  }, [state.checkout?.id]);

  const initializeCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const checkoutId = Cookies.get('shopify_checkout_id');
      // console.log('Existing checkout ID from cookies:', checkoutId);
      
      if (checkoutId) {
        try {
          // console.log('Fetching existing checkout...');
          const checkout = await client.checkout.fetch(checkoutId);
          // console.log('Fetched checkout:', checkout);
          
          if (checkout && !checkout.completedAt) {
            dispatch({ type: 'SET_CHECKOUT', payload: checkout });
            // console.log('Using existing checkout');
            return;
          } else {
            // console.log('Checkout is completed or invalid, creating new one');
            Cookies.remove('shopify_checkout_id');
          }
        } catch {
          // console.log('Error fetching existing checkout, creating new one:', error);
          Cookies.remove('shopify_checkout_id');
        }
      }
      
      // Create new checkout
      // console.log('Creating new checkout...');
      const checkout = await client.checkout.create();
      // console.log('Created new checkout:', checkout);
      dispatch({ type: 'SET_CHECKOUT', payload: checkout });
      
    } catch (error) {
      console.error('Failed to initialize cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize cart. Please refresh the page.' });
      dispatch({ type: 'SET_INITIALIZED', payload: true }); // Mark as initialized even on error
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const addToCart = async (variantId: string, quantity: number) => {
    try {
      // console.log('Adding to cart:', { variantId, quantity });
      
      // Ensure we have an initialized cart
      if (!state.initialized) {
        // console.log('Cart not initialized, initializing...');
        await initializeCart();
      }

      // Wait for initialization to complete if still in progress
      let attempts = 0;
      while (!state.checkout?.id && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        if (!state.checkout?.id && attempts >= 10) {
          throw new Error('Failed to initialize checkout session');
        }
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Validate variant ID format
      if (!variantId || !variantId.includes('gid://shopify/ProductVariant/')) {
        throw new Error('Invalid product variant ID');
      }
      
      const lineItemsToAdd = [{
        variantId: variantId,
        quantity: quantity
      }];

      // console.log('Adding line items:', lineItemsToAdd);
      // console.log('To checkout:', state.checkout.id);

      const checkout = await client.checkout.addLineItems(state.checkout.id, lineItemsToAdd);
      // console.log('Updated checkout:', checkout);
      
      dispatch({ 
        type: 'ADD_TO_CART_SUCCESS', 
        payload: { 
          item: checkout.lineItems[checkout.lineItems.length - 1],
          checkout: checkout 
        }
      });

      showNotification('Added to cart successfully!', 'success');
      
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      
      let errorMessage = 'Failed to add item to cart';
      if (error?.message?.includes('Invalid') || error?.message?.includes('not found')) {
        errorMessage = 'Product variant not found';
      } else if (error?.message?.includes('not available') || error?.message?.includes('out of stock')) {
        errorMessage = 'Product is out of stock';
      } else if (error?.message?.includes('checkout')) {
        errorMessage = 'Checkout session error. Please refresh the page.';
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showNotification(errorMessage, 'error');
      
      // Reset loading state on error
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCartItem = async (lineItemId: string, quantity: number) => {
    if (!state.checkout?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const lineItemsToUpdate = [{
        id: lineItemId,
        quantity: quantity
      }];

      // console.log('Updating cart item:', lineItemsToUpdate);
      const checkout = await client.checkout.updateLineItems(state.checkout.id, lineItemsToUpdate);
      dispatch({ type: 'UPDATE_CART_SUCCESS', payload: checkout });
      
    } catch (error) {
      console.error('Failed to update cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
      showNotification('Failed to update cart item', 'error');
    }
  };

  const removeFromCart = async (lineItemId: string) => {
    if (!state.checkout?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // console.log('Removing item from cart:', lineItemId);
      const checkout = await client.checkout.removeLineItems(state.checkout.id, [lineItemId]);
      dispatch({ type: 'UPDATE_CART_SUCCESS', payload: checkout });
      
      showNotification('Item removed from cart', 'success');
      
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
      showNotification('Failed to remove item', 'error');
    }
  };

  const proceedToCheckout = () => {
    if (state.checkout?.webUrl) {
      // console.log('Proceeding to checkout:', state.checkout.webUrl);
      window.location.href = state.checkout.webUrl;
    } else {
      showNotification('Checkout URL not available', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform translate-x-full opacity-0 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  const value: CartContextType = {
    ...state,
    toggleCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    proceedToCheckout,
    initializeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};