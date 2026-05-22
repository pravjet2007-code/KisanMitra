import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentProcessor from '../components/Payment';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../utils/api';

interface OrderDetails {
  id: number;
  total_amount: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  created_at: string;
  farmer_name?: string;
  delivery_address?: string;
}

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!orderId) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    fetchOrderDetails();
  }, [orderId, user]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.get(parseInt(orderId || ''));
      
      const mappedDetails: OrderDetails = {
        id: data.order_id,
        total_amount: parseFloat(data.total_amount as any) || 0,
        status: data.current_status,
        created_at: data.created_at,
        items: data.items.map((item) => ({
          id: item.order_item_id,
          name: item.product.name,
          quantity: parseFloat(item.quantity as any) || 0,
          price: parseFloat(item.price_at_purchase as any) || 0,
        })),
        farmer_name: undefined, // optional fallback or check
      };
      setOrderDetails(mappedDetails);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load order details';
      setError(errorMessage);
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    // Show success notification
    const notification = document.createElement('div');
    notification.className =
      'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">✓</span>
        <div>
          <p class="font-semibold">Payment Successful!</p>
          <p class="text-sm">Your order has been placed.</p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <span className="text-6xl mb-4 block">❌</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Invalid order'}</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Go to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-green-600 hover:text-green-700 flex items-center gap-2 font-medium transition-colors"
        >
          <span className="text-xl">←</span>
          Back
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Summary - Left Column */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">#{orderId}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold">
                    {orderDetails?.items?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                    {orderDetails?.status || 'Pending'}
                  </span>
                </div>

                {orderDetails?.farmer_name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Farmer:</span>
                    <span className="font-semibold">{orderDetails.farmer_name}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              {orderDetails?.items && orderDetails.items.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Items:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {orderDetails.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{orderDetails?.total_amount?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Processor - Right Column */}
          <div className="md:col-span-2">
            {orderDetails && (
              <PaymentProcessor
                orderId={parseInt(orderId)}
                amount={orderDetails.total_amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;