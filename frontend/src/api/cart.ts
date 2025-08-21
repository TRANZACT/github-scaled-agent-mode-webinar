import axios from 'axios';
import { api } from './config';

export interface Cart {
  cartId: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'checkout' | 'completed' | 'abandoned';
  totalAmount: number;
}

export interface CartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  addedAt: string;
  notes?: string;
}

export interface CartWithItems {
  cart: Cart;
  items: CartItem[];
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

// Create a new cart
export const createCart = async (userId: string): Promise<Cart> => {
  const { data } = await axios.post(`${api.baseURL}${api.endpoints.carts}`, { userId });
  return data;
};

// Get cart by ID
export const getCart = async (cartId: number): Promise<CartWithItems> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.carts}/${cartId}`);
  return data;
};

// Add item to cart
export const addItemToCart = async (cartId: number, productId: number, quantity: number, notes?: string): Promise<CartItem> => {
  const { data } = await axios.post(`${api.baseURL}${api.endpoints.carts}/${cartId}/items`, {
    productId,
    quantity,
    notes
  });
  return data;
};

// Update cart item quantity
export const updateCartItem = async (cartId: number, itemId: number, quantity: number): Promise<CartItem> => {
  const { data } = await axios.put(`${api.baseURL}${api.endpoints.carts}/${cartId}/items/${itemId}`, {
    quantity
  });
  return data;
};

// Remove item from cart
export const removeCartItem = async (cartId: number, itemId: number): Promise<void> => {
  await axios.delete(`${api.baseURL}${api.endpoints.carts}/${cartId}/items/${itemId}`);
};

// Checkout cart
export const checkoutCart = async (cartId: number, branchId: number, notes?: string): Promise<any> => {
  const { data } = await axios.post(`${api.baseURL}${api.endpoints.carts}/${cartId}/checkout`, {
    branchId,
    notes
  });
  return data;
};

// Get all products
export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};