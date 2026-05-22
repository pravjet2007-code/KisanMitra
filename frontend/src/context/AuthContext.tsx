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
  /** Step 2 of login: verify OTP. Returns isNewUser and actualRole. */
  verifyOtp: (phone: string, otp: string, role: UserRole) => Promise<{ isNewUser: boolean; actualRole: UserRole }>;
  /** Update profile (name, location, crop_type, etc.) */
  updateProfile: (data: Partial<User>) => Promise<void>;
  /** Re-fetch the full profile from the API and sync context state */
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          if (res.ok) {
            const data = await res.json();
            if (data && data.role) {
              const rawRole = data.role.toLowerCase();
              data.role = rawRole === 'vendor' ? 'seller' : (rawRole as UserRole);
            }
            setUser(data);
          } else if (res.status === 401) {
            // Token is truly expired/invalid — clear it
            _clearToken();
          } else {
            // Transient server error (404, 500, etc.) — keep token, build minimal user
            // so the user stays logged in. Profile will be re-fetched on next nav.
            const cached = localStorage.getItem('km_user');
            if (cached) {
              try { setUser(JSON.parse(cached)); } catch { _clearToken(); }
            } else {
              // No cached user — can't stay logged in, clear token
              _clearToken();
            }
          }
        }
      } catch {
        // Network error — keep token, use cached user if available
        const cached = localStorage.getItem('km_user');
        if (cached) {
          try { setUser(JSON.parse(cached)); } catch { _clearToken(); }
        } else {
          _clearToken();
        }
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

  const _saveUser = (u: User) => {
    setUser(u);
    localStorage.setItem('km_user', JSON.stringify(u));
  };

  const _clearToken = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('km_token');
    localStorage.removeItem('km_user');
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
  ): Promise<{ isNewUser: boolean; actualRole: UserRole }> => {
    if (IS_MOCK) {
      const { token: t, isNewUser, user: u } = mockVerifyOtp(phone, otp, role);
      _saveToken(t);
      _saveUser(u);
      return { isNewUser, actualRole: u.role };
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

    // Determine actual role from OTP response (backend may return user_role)
    let actualRole: UserRole = role;
    if (data.role) {
      const raw = (data.role as string).toLowerCase();
      actualRole = (raw === 'vendor' ? 'seller' : raw) as UserRole;
    } else if (data.user_role) {
      const raw = (data.user_role as string).toLowerCase();
      actualRole = (raw === 'vendor' ? 'seller' : raw) as UserRole;
    }

    // Build a minimal user so isAuthenticated = true immediately
    // This prevents ProtectedRoute from bouncing back to /auth while
    // the profile fetch is still in-flight or if it fails transiently.
    const minimalUser: User = {
      user_id: typeof data.user_id === 'number' ? data.user_id : 0,
      full_name: data.full_name ?? '',
      phone_number: phone,
      role: actualRole,
      is_verified: true,
      created_at: new Date().toISOString(),
    };
    _saveUser(minimalUser);

    // Try to enrich with full profile — non-blocking, best-effort
    try {
      const profileRes = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData && profileData.role) {
          const rawRole = (profileData.role as string).toLowerCase();
          profileData.role = (rawRole === 'vendor' ? 'seller' : rawRole) as UserRole;
          actualRole = profileData.role;
        }
        _saveUser(profileData);
      }
      // If profile fetch fails (404, 500, network), keep the minimal user — still logged in
    } catch {
      // Silently ignore — minimal user already set above
    }

    return { isNewUser: data.is_new_user ?? false, actualRole };
  };

  // ── updateProfile ────────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!token) throw new Error('Not authenticated');

    if (IS_MOCK) {
      const updated = mockUpdateProfile(token, data);
      _saveUser(updated);
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
    
    const updatedUser = await res.json();
    if (updatedUser && updatedUser.role) {
      const rawRole = (updatedUser.role as string).toLowerCase();
      updatedUser.role = (rawRole === 'vendor' ? 'seller' : rawRole) as UserRole;
    }
    _saveUser(updatedUser);
  };


  // ── refreshProfile ───────────────────────────────────────────────────────
  const refreshProfile = async (): Promise<void> => {
    const currentToken = localStorage.getItem('km_token');
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.role) {
          const rawRole = (data.role as string).toLowerCase();
          data.role = (rawRole === 'vendor' ? 'seller' : rawRole) as UserRole;
        }
        _saveUser(data);
      }
    } catch {
      // Silently ignore — caller handles stale data gracefully
    }
  };

  // ── logout ────────────────────────────────────────────────────────────────
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
        refreshProfile,
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
