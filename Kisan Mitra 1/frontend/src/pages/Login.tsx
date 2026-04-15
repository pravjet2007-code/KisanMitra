import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, KeyRound, ArrowRight, Loader2, Sprout } from 'lucide-react';

export default function Login() {
  const { loginOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    try {
      await loginOtp(phone);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(phone, otp);
      if (res.isComplete) {
        navigate('/farmer-dashboard');
      } else {
        // Still needs profile setup
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again. (Hint: 123456)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-terracotta rounded-2xl flex items-center justify-center shadow-lg">
            <Sprout className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-heading font-bold text-black mb-2">
          KisanMitra Login
        </h2>
        <p className="text-center text-muted text-sm mb-8">
          Secure, passwordless access for farmers.
        </p>

        <div className="bg-white py-10 px-8 shadow-xl rounded-3xl border border-border">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-dark mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-offwhite border border-border rounded-xl text-lg focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all outline-none"
                    placeholder="Enter 10-digit number"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-terracotta hover:bg-terracotta-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get OTP'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-dark mb-2">
                  Enter One-Time Password
                </label>
                <p className="text-xs text-muted mb-4">Secure code sent to +91 {phone}</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-terracotta" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-offwhite border border-border rounded-xl text-xl tracking-[0.5em] font-bold focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all text-center outline-none"
                    placeholder="------"
                    maxLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-terracotta hover:bg-terracotta-dark transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In Securely'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-sm font-medium text-terracotta hover:text-terracotta-dark mt-4"
              >
                Change mobile number
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-terracotta/5 rounded-full blur-3xl"></div>
         <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] bg-sage/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
