/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: API endpoints for managing shopping carts
 */

import express from 'express';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartItem';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { OrderDetail } from '../models/orderDetail';
import { carts as seedCarts, cartItems as seedCartItems, products as seedProducts, orders as seedOrders, orderDetails as seedOrderDetails } from '../seedData';

const router = express.Router();

let carts: Cart[] = [...seedCarts];
let cartItems: CartItem[] = [...seedCartItems];
let products: Product[] = [...seedProducts];
let orders: Order[] = [...seedOrders];
let orderDetails: OrderDetail[] = [...seedOrderDetails];

// Create a new cart
router.post('/', (req, res) => {
  const { userId } = req.body;
  const newCart: Cart = {
    cartId: Math.max(0, ...carts.map(c => c.cartId)) + 1,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    totalAmount: 0
  };
  carts.push(newCart);
  res.status(201).json(newCart);
});

// Get all carts
router.get('/', (req, res) => {
  res.json(carts);
});

// Helper function to update cart total
function updateCartTotal(cartId: number) {
  const cart = carts.find(c => c.cartId === cartId);
  if (!cart) return;
  
  const items = cartItems.filter(item => item.cartId === cartId);
  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  cart.totalAmount = total;
  cart.updatedAt = new Date().toISOString();
}

export default router;