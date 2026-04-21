import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sprout, Wheat, ShoppingCart, Store, ArrowLeft, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { MOCK_OTP } from '../utils/mockAuth';

const IS_MOCK = import.meta.env.VITE_MOCK_AUTH !== 'false';

type Step = 'role' | 'phone' | 'otp' | 'onboard';

const ROLES: { role: UserRole; icon: React.ElementType; label: string; desc: string; color: string; bg: string }[] = [
  {
    role: 'farmer',
    icon: Wheat,
    label: 'Farmer',
    desc: 'I grow crops & want to sell produce',
    color: 'text-sage-dark',
    bg: 'bg-sage/10 border-sage/30 hover:border-sage',
  },
  {
    role: 'buyer',
    icon: ShoppingCart,
    label: 'Buyer',
    desc: 'I purchase crops for business / personal use',
    color: 'text-info',
    bg: 'bg-info/10 border-info/30 hover:border-info',
  },
  {
    role: 'seller',
    icon: Store,
    label: 'Seller / FPO',
    desc: 'I am a trader, FPO, or wholesale seller',
    color: 'text-amber',
    bg: 'bg-amber/10 border-amber/30 hover:border-amber',
  },
];

const STATES = [
  'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal', 'Uttarakhand', 'Odisha',
];

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Sugarcane', 'Mustard', 'Chickpea', 'Groundnut', 'Tomato', 'Onion', 'Potato', 'Other'];
const BIZ_TYPES = ['Miller', 'Trader', 'Exporter', 'Cooperative', 'Retailer', 'Processor', 'FPO', 'Other'];

export default function AuthPage() {
  const { sendOtp, verifyOtp, updateProfile, isAuthenticated, role: existingRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Onboard fields
  const [fullName, setFullName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [cropType, setCropType] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');

  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated && existingRole) {
      const dashboardMap: Record<UserRole, string> = {
        farmer: '/dashboard/farmer',
        buyer: '/dashboard/buyer',
        seller: '/dashboard/seller',
      };
      navigate(dashboardMap[existingRole], { replace: true });
    }
  }, [isAuthenticated, existingRole, navigate]);

  // OTP resend timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('phone');
  };

  const handleSendOtp = async () => {
    if (phone.length < 10) { setError('Enter a valid 10-digit number'); return; }
    setError('');
    setIsLoading(true);
    try {
      await sendOtp(phone);
      setStep('otp');
      setTimer(30);
      setTimeout(() => otpInputs.current[0]?.focus(), 100);
    } catch (e: any) {
      setError(e.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit OTP'); return; }
    if (!selectedRole) return;
    setError('');
    setIsLoading(true);
    try {
      const { isNewUser } = await verifyOtp(phone, code, selectedRole);
      if (isNewUser) {
        setStep('onboard');
      } else {
        navigateToDashboard(selectedRole);
      }
    } catch (e: any) {
      setError(e.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboard = async () => {
    if (!fullName.trim()) { setError('Please enter your name'); return; }
    setError('');
    setIsLoading(true);
    try {
      const profileData: Record<string, string> = {
        full_name: fullName.trim(),
        location: `${city}, ${state}`.trim().replace(/^,\s*|,\s*$/, ''),
        preferred_language: 'en',
      };
      if (selectedRole === 'farmer') {
        profileData.crop_type = cropType;
        profileData.farm_size = farmSize;
      } else {
        profileData.business_name = businessName;
        profileData.business_type = businessType;
      }
      await updateProfile(profileData);
      navigateToDashboard(selectedRole!);
    } catch (e: any) {
      setError(e.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDashboard = (role: UserRole) => {
    const map: Record<UserRole, string> = {
      farmer: '/dashboard/farmer',
      buyer: '/dashboard/buyer',
      seller: '/dashboard/seller',
    };
    navigate(redirectTo !== '/dashboard' ? redirectTo : map[role], { replace: true });
  };

  const roleInfo = ROLES.find((r) => r.role === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwhite via-white to-sage/5 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-terracotta rounded-xl flex items-center justify-center shadow-md">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading text-lg font-bold text-black">
            KISAN<span className="text-terracotta">MITRA</span>
          </span>
        </Link>
        {step !== 'role' && (
          <button
            onClick={() => {
              setError('');
              if (step === 'phone') setStep('role');
              else if (step === 'otp') setStep('phone');
              else if (step === 'onboard') setStep('otp');
            }}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {(['role', 'phone', 'otp', 'onboard'] as Step[]).map((s, i) => {
          const stepIndex = ['role', 'phone', 'otp', 'onboard'].indexOf(step);
          return (
            <div
              key={s}
              className={`rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? 'w-8 h-2 bg-terracotta'
                  : i < stepIndex
                  ? 'w-2 h-2 bg-terracotta/40'
                  : 'w-2 h-2 bg-border'
              }`}
            />
          );
        })}
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* ── STEP 1: Role Selection ── */}
          {step === 'role' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-black mb-2">
                  Who are you?
                </h1>
                <p className="text-muted text-sm">
                  Choose your role to get a tailored experience
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {ROLES.map(({ role, icon: Icon, label, desc, color, bg }) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left group ${bg}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color.replace('text-', 'bg-').replace('-dark', '')}/20`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-heading font-bold text-base ${color}`}>{label}</p>
                      <p className="text-sm text-muted mt-0.5">{desc}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-muted">
                By continuing, you agree to our{' '}
                <a href="#" className="text-terracotta hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-terracotta hover:underline">Privacy Policy</a>
              </p>
            </div>
          )}

          {/* ── STEP 2: Phone ── */}
          {step === 'phone' && (
            <div className="animate-fade-in">
              {roleInfo && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${roleInfo.color} ${roleInfo.bg} border`}>
                  <roleInfo.icon className="w-3.5 h-3.5" />
                  Joining as {roleInfo.label}
                </div>
              )}
              <h1 className="font-heading text-2xl font-bold text-black mb-2">
                Enter your mobile number
              </h1>
              <p className="text-muted text-sm mb-8">
                We'll send a one-time password to verify your identity
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-4">
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Mobile Number
                </label>
                <div className="flex gap-3">
                  <div className="flex items-center px-4 py-3.5 bg-offwhite border border-border rounded-xl text-sm font-semibold text-dark shrink-0">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendOtp(); }}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-3.5 bg-offwhite border border-border rounded-xl text-sm font-medium tracking-widest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-all"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-xs text-danger mt-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" /> {error}
                  </p>
                )}
              </div>

              {IS_MOCK && (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber/10 border border-amber/20 rounded-xl mb-4 text-xs text-amber-800">
                  <Shield className="w-4 h-4 text-amber shrink-0" />
                  <span><strong>Dev mode:</strong> Any phone works. OTP will be <strong>{MOCK_OTP}</strong></span>
                </div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={isLoading || phone.length < 10}
                className="w-full py-4 bg-terracotta text-white font-heading font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send OTP <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 3: OTP ── */}
          {step === 'otp' && (
            <div className="animate-fade-in">
              <h1 className="font-heading text-2xl font-bold text-black mb-2">
                Verify your number
              </h1>
              <p className="text-muted text-sm mb-8">
                Enter the 6-digit OTP sent to <strong className="text-black">+91 {phone}</strong>
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-4">
                <div className="flex gap-2.5 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all ${
                        digit
                          ? 'border-terracotta bg-terracotta/5 text-terracotta'
                          : 'border-border bg-offwhite text-black focus:border-terracotta focus:bg-white'
                      }`}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-xs text-danger text-center mb-4 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" /> {error}
                  </p>
                )}

                <div className="text-center text-sm text-muted">
                  {timer > 0 ? (
                    <span>Resend OTP in <strong className="text-black">{timer}s</strong></span>
                  ) : (
                    <button
                      onClick={() => { setTimer(30); sendOtp(phone); }}
                      className="text-terracotta font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {IS_MOCK && (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber/10 border border-amber/20 rounded-xl mb-4 text-xs text-amber-800">
                  <Shield className="w-4 h-4 text-amber shrink-0" />
                  <span>Dev mode — enter <strong>{MOCK_OTP}</strong> to continue</span>
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.join('').length < 6}
                className="w-full py-4 bg-terracotta text-white font-heading font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify & Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 4: Onboard ── */}
          {step === 'onboard' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-sage" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-black">Quick setup</h1>
                  <p className="text-muted text-xs">Takes about 30 seconds</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    autoFocus
                    className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm outline-none focus:border-terracotta appearance-none"
                    >
                      <option value="">Select state</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      City / District
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Ludhiana"
                      className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-all"
                    />
                  </div>
                </div>

                {/* Farmer-specific fields */}
                {selectedRole === 'farmer' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        Primary Crop
                      </label>
                      <select
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                        className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm outline-none focus:border-terracotta appearance-none"
                      >
                        <option value="">Select crop</option>
                        {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        Farm Size (Acres)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={farmSize}
                        onChange={(e) => setFarmSize(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-all"
                      />
                    </div>
                  </>
                )}

                {/* Buyer/Seller fields */}
                {(selectedRole === 'buyer' || selectedRole === 'seller') && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Sharma Grain Traders"
                        className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        Business Type
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm outline-none focus:border-terracotta appearance-none"
                      >
                        <option value="">Select type</option>
                        {BIZ_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {error && (
                  <p className="text-xs text-danger flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" /> {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleOnboard}
                disabled={isLoading || !fullName.trim()}
                className="w-full py-4 bg-terracotta text-white font-heading font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Let's Go <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <button
                onClick={() => navigateToDashboard(selectedRole!)}
                className="w-full py-3 text-sm text-muted hover:text-dark transition-colors mt-2"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
