import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import {
  mockSendOtp,
  mockVerifyOtp,
  mockGetProfile,
  mockUpdateProfile,
} from '../utils/mockAuth';

// ─── Toggle: set VITE_MOCK_AUTH=false in .env to use real FastAPI backend ───
const IS_MOCK = import.meta.env.VITE_MOCK_AUTH !== 'false';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  /** Step 1 of login: send OTP to phone */
  sendOtp: (phone: string) => Promise<void>;
  /** Step 2 of login: verify OTP. Returns isNewUser flag. */
  verifyOtp: (phone: string, otp: string, role: UserRole) => Promise<{ isNewUser: boolean }>;
  /** Update profile (name, location, crop_type, etc.) */
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('km_token'));
  const [loading, setLoading] = useState(true);

  // ── Rehydrate user from token on mount ──────────────────────────────────
  useEffect(() => {
    const rehydrate = async () => {
      if (!token) { setLoading(false); return; }

      try {
        if (IS_MOCK) {
          const u = mockGetProfile(token);
          if (u) setUser(u); else _clearToken();
        } else {
          const res = await fetch(`${API_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) setUser(await res.json()); else _clearToken();
        }
      } catch {
        _clearToken();
      } finally {
        setLoading(false);
      }
    };
    rehydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const _saveToken = (t: string) => {
    setToken(t);
    localStorage.setItem('km_token', t);
  };

  const _clearToken = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('km_token');
  };

  // ── sendOtp ──────────────────────────────────────────────────────────────
  const sendOtp = async (phone: string): Promise<void> => {
    if (IS_MOCK) {
      mockSendOtp(phone);
      return;
    }
    await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
  };

  // ── verifyOtp ────────────────────────────────────────────────────────────
  const verifyOtp = async (
    phone: string,
    otp: string,
    role: UserRole
  ): Promise<{ isNewUser: boolean }> => {
    if (IS_MOCK) {
      const { token: t, isNewUser, user: u } = mockVerifyOtp(phone, otp, role);
      _saveToken(t);
      setUser(u);
      return { isNewUser };
    }

    // Real backend — role passed as part of registration metadata
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, role }),
    });
    if (!res.ok) throw new Error('Invalid OTP');

    const data = await res.json();
    _saveToken(data.access_token);

    const profileRes = await fetch(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    if (profileRes.ok) setUser(await profileRes.json());

    return { isNewUser: !data.is_profile_complete };
  };

  // ── updateProfile ────────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!token) throw new Error('Not authenticated');

    if (IS_MOCK) {
      const updated = mockUpdateProfile(token, data);
      setUser(updated);
      return;
    }

    const res = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Profile update failed');
    setUser(await res.json());
  };

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = () => _clearToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role ?? null,
        loading,
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
