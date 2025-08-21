import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartIcon() {
  const { cartCount } = useCart();
  const { darkMode } = useTheme();

  return (
    <Link 
      to="/cart" 
      className={`relative inline-flex items-center p-2 rounded-full ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      {/* Shopping Cart Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth={2}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9H19m-7-9V9a2 2 0 11-4 0v4m0-4a2 2 0 11-4 0v0m4 0V6a2 2 0 114 0v3" 
        />
      </svg>
      
      {/* Cart Count Badge */}
      {cartCount > 0 && (
        <span 
          className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]"
          aria-label={`${cartCount} items in cart`}
        >
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  );
}