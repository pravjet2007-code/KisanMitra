import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { cartApi, CartItem, AddToCartPayload } from '../utils/api';
import { useAuth } from './AuthContext';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  adding: number | null;       // product_id currently being added
  removing: number | null;     // cart_item_id currently being removed
  addItem: (product_id: number, quantity?: number) => Promise<void>;
  removeItem: (cart_item_id: number) => Promise<void>;
  refetch: () => Promise<void>;
  isInCart: (product_id: number) => boolean;
  getCartItem: (product_id: number) => CartItem | undefined;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, role } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  // Only buyers have a cart
  const buyerId: number | null =
    isAuthenticated && role === 'buyer' && user?.user_id ? user.user_id : null;

  const fetchCart = useCallback(async () => {
    if (!buyerId) { setItems([]); return; }
    setLoading(true);
    try {
      const data = await cartApi.getCart(buyerId);
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [buyerId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (product_id: number, quantity = 1) => {
    if (!buyerId) throw new Error('You must be logged in as a buyer to add items to cart.');
    setAdding(product_id);
    try {
      const payload: AddToCartPayload = { product_id, quantity, buyer_id: buyerId };
      const newItem = await cartApi.addItem(payload);
      // If item already exists for this product, replace it; otherwise append
      setItems((prev) => {
        const exists = prev.findIndex((i) => i.product_id === product_id);
        if (exists >= 0) {
          const updated = [...prev];
          updated[exists] = newItem;
          return updated;
        }
        return [...prev, newItem];
      });
    } finally {
      setAdding(null);
    }
  };

  const removeItem = async (cart_item_id: number) => {
    setRemoving(cart_item_id);
    try {
      await cartApi.removeItem(cart_item_id);
      setItems((prev) => prev.filter((i) => i.cart_item_id !== cart_item_id));
    } finally {
      setRemoving(null);
    }
  };

  const isInCart = (product_id: number) =>
    items.some((i) => i.product_id === product_id);

  const getCartItem = (product_id: number) =>
    items.find((i) => i.product_id === product_id);

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.length;

  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price_per_unit) || 0;
    const qty   = parseFloat(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        loading,
        adding,
        removing,
        addItem,
        removeItem,
        refetch: fetchCart,
        isInCart,
        getCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
