import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, ArrowLeft, Package,
  Loader2, ChevronRight, CreditCard, Truck, Shield,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../utils/api';

export default function CartPage() {
  const { items, itemCount, totalAmount, loading, removing, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Shipping: flat ₹50 per item for display purposes
  const shippingEstimate = items.length * 50;
  const grandTotal = totalAmount + shippingEstimate;

  const handleCheckout = async () => {
    setCheckoutError('');

    // If the user has no saved address, redirect to profile / address page
    const addressId = user?.addresses?.find((a) => a.is_default)?.address_id ?? user?.addresses?.[0]?.address_id ?? null;
    if (!addressId) {
      setCheckoutError('Please add a shipping address in your profile before checking out.');
      return;
    }

    setCheckingOut(true);
    try {
      const order = await ordersApi.checkout(addressId);
      navigate(`/payment/${order.order_id}`);
    } catch (err: any) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite pt-24 flex items-center justify-center gap-3 text-muted">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading your cart…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/marketplace"
            className="flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <ChevronRight className="w-4 h-4 text-muted" />
          <h1 className="font-heading text-2xl font-bold text-black flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-terracotta" />
            Your Cart
            {itemCount > 0 && (
              <span className="text-base font-normal text-muted">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
            )}
          </h1>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-10 h-10 text-terracotta" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-black mb-2">Your cart is empty</h2>
            <p className="text-muted mb-8">Browse the marketplace and add products to get started.</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white font-semibold rounded-xl hover:bg-terracotta-dark transition-colors shadow-md"
            >
              <Package className="w-5 h-5" /> Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => {
                const price = parseFloat(item.product.price_per_unit) || 0;
                const qty   = parseFloat(item.quantity) || 0;
                const subtotal = price * qty;
                const isRemoving = removing === item.cart_item_id;

                const imgSrc = item.product.image_url
                  ? item.product.image_url.startsWith('data:') || item.product.image_url.startsWith('http')
                    ? item.product.image_url
                    : `data:image/jpeg;base64,${item.product.image_url}`
                  : `https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80`;

                return (
                  <div
                    key={item.cart_item_id}
                    className={`bg-white rounded-2xl border border-border shadow-xs overflow-hidden flex gap-4 p-4 md:p-5 transition-opacity ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {/* Product image */}
                    <Link to={`/listing/${item.product_id}`} className="shrink-0">
                      <img
                        src={imgSrc}
                        alt={item.product.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/listing/${item.product_id}`}
                            className="font-heading text-base md:text-lg font-bold text-black hover:text-terracotta transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-muted mt-0.5 capitalize">
                            {item.product.type.replace('_', ' ')} · {item.product.unit_of_measure}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.cart_item_id)}
                          disabled={isRemoving}
                          className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors shrink-0"
                          title="Remove from cart"
                        >
                          {isRemoving
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted">Qty:</span>
                          <span className="text-sm font-semibold text-black bg-offwhite border border-border rounded-lg px-3 py-1">
                            {qty} {item.product.unit_of_measure}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-muted">
                            ₹{price.toLocaleString('en-IN')} × {qty}
                          </p>
                          <p className="font-heading text-lg font-bold text-black">
                            ₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-4">
                {/* Summary card */}
                <div className="bg-white rounded-2xl border border-border shadow-xs p-6">
                  <h3 className="font-heading text-lg font-bold text-black mb-5">Order Summary</h3>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Subtotal ({itemCount} items)</span>
                      <span className="font-semibold text-black">
                        ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Est. Shipping</span>
                      <span className="font-semibold text-black">
                        ₹{shippingEstimate.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-semibold text-black">Grand Total</span>
                      <span className="font-heading text-xl font-bold text-sage">
                        ₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                      ⚠️ {checkoutError}
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full py-4 bg-terracotta text-white font-heading font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                  >
                    {checkingOut ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                    ) : (
                      <><CreditCard className="w-5 h-5" /> Proceed to Checkout</>
                    )}
                  </button>
                </div>

                {/* Trust badges */}
                <div className="bg-white rounded-2xl border border-border shadow-xs p-5 space-y-3">
                  {[
                    { icon: Shield, text: 'Escrow-protected payment', desc: 'Funds held until delivery' },
                    { icon: Truck, text: 'Logistics support', desc: 'Pickup & tracking included' },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <badge.icon className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black">{badge.text}</p>
                        <p className="text-xs text-muted">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}