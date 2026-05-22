import React, { useState } from 'react';
import { capturePayment } from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface PaymentProcessorProps {
  orderId: number;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  orderId,
  amount,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using UPI apps',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: '👛',
      description: 'Paytm, PhonePe, Google Pay',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive',
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      // Simulate payment gateway processing
      await simulatePaymentGateway(selectedMethod);

      // Capture payment on backend
      const response = await capturePayment({
        order_id: orderId,
        transaction_id: transactionId,
        payment_method: selectedMethod,
      });

      console.log('Payment captured successfully:', response);

      // Show success message
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to order tracking page
      setTimeout(() => {
        navigate(`/orders/${orderId}`, {
          state: { paymentSuccess: true, transactionId },
        });
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Payment failed. Please try again.';
      console.error('Payment error:', error);
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const simulatePaymentGateway = async (method: string): Promise<void> => {
    // Simulate payment processing delay
    const delay = method === 'cod' ? 500 : 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Simulate random failure for testing (10% chance)
    if (Math.random() < 0.1 && method !== 'cod') {
      throw new Error('Payment gateway timeout. Please try again.');
    }
  };

  return (
    <div className="payment-processor bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
        <p className="text-gray-600">Order ID: #{orderId}</p>
      </div>

      {/* Amount Display */}
      <div className="amount-display mb-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200">
        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
        <p className="text-4xl font-bold text-green-700">₹{amount.toFixed(2)}</p>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setSelectedMethod(method.id);
                setError('');
              }}
              disabled={loading}
              className={`p-4 border-2 rounded-lg flex items-start gap-3 transition-all text-left ${
                selectedMethod === method.id
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-300 hover:border-green-300 hover:shadow-sm'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-3xl">{method.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{method.name}</p>
                <p className="text-xs text-gray-500 mt-1">{method.description}</p>
              </div>
              {selectedMethod === method.id && (
                <span className="text-green-600 text-xl">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading || !selectedMethod}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all ${
          loading || !selectedMethod
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 active:scale-95'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          `Pay ₹${amount.toFixed(2)}`
        )}
      </button>

      {/* Security Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="text-green-600">🔒</span>
          <p>Secure payment gateway • 256-bit encryption</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;