import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, createCart, getCart, addItemToCart, updateCartItem, removeCartItem } from '../api/cart';

interface CartContextType {
  cart: Cart | null;
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearError: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize cart
  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have a cart ID in localStorage
      const savedCartId = localStorage.getItem('cartId');
      
      if (savedCartId) {
        // Try to load existing cart
        try {
          const cartData = await getCart(parseInt(savedCartId));
          setCart(cartData.cart);
          setCartItems(cartData.items);
        } catch (err) {
          // If cart doesn't exist, create a new one
          console.log('Saved cart not found, creating new cart');
          await createNewCart();
        }
      } else {
        // Create new cart
        await createNewCart();
      }
    } catch (err) {
      console.error('Error initializing cart:', err);
      setError('Failed to initialize cart');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewCart = async () => {
    const userId = 'user1'; // For demo purposes, using a fixed user ID
    const newCart = await createCart(userId);
    setCart(newCart);
    setCartItems([]);
    localStorage.setItem('cartId', newCart.cartId.toString());
  };

  const refreshCart = async () => {
    if (!cart) return;
    
    try {
      const cartData = await getCart(cart.cartId);
      setCart(cartData.cart);
      setCartItems(cartData.items);
    } catch (err) {
      console.error('Error refreshing cart:', err);
      setError('Failed to refresh cart');
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!cart) {
      setError('Cart not initialized');
      return;
    }

    try {
      setIsLoading(true);
      await addItemToCart(cart.cartId, productId, quantity);
      await refreshCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      if (quantity <= 0) {
        await removeCartItem(cart.cartId, itemId);
      } else {
        await updateCartItem(cart.cartId, itemId, quantity);
      }
      await refreshCart();
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update cart item');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      await removeCartItem(cart.cartId, itemId);
      await refreshCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Calculate cart count and total
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const value: CartContextType = {
    cart,
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    error,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearError,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}