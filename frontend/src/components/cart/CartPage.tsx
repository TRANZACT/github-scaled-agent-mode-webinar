import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { fetchProducts, Product } from '../../api/cart';

export default function CartPage() {
  const { 
    cartItems, 
    cartTotal, 
    cartCount,
    updateItemQuantity, 
    removeFromCart, 
    isLoading, 
    error,
    clearError 
  } = useCart();
  const { darkMode } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getProductDetails = (productId: number) => {
    return products.find(p => p.productId === productId);
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    await updateItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  if (loadingProducts) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
            Shopping Cart
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={clearError}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg 
                className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9H19"
                />
              </svg>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Your cart is empty
              </h2>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-4`}>
                Add some products to get started!
              </p>
              <a
                href="/products"
                className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors inline-block"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const product = getProductDetails(item.productId);
                  if (!product) return null;

                  return (
                    <div 
                      key={item.cartItemId} 
                      className={`flex items-center space-x-4 p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={`/${product.imgName}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-product.png';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {product.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                          SKU: {product.sku}
                        </p>
                        <p className={`font-medium ${darkMode ? 'text-primary' : 'text-primary'}`}>
                          ${item.unitPrice.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                          disabled={isLoading}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300 disabled:opacity-50`}
                        >
                          −
                        </button>
                        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                          disabled={isLoading}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300 disabled:opacity-50`}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.cartItemId)}
                        disabled={isLoading}
                        className={`text-red-500 hover:text-red-700 transition-colors disabled:opacity-50`}
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-6`}>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    Total ({cartCount} items):
                  </span>
                  <span className={`text-2xl font-bold ${darkMode ? 'text-primary' : 'text-primary'}`}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex space-x-4">
                  <a
                    href="/products"
                    className={`flex-1 px-6 py-3 rounded-lg text-center border ${darkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-gray-400'} transition-colors`}
                  >
                    Continue Shopping
                  </a>
                  <button
                    disabled={isLoading || cartItems.length === 0}
                    className="flex-1 bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}