import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  phone: string;
  role: string;
  name?: string;
  location?: string;
  farm_size?: string;
  crop_type?: string;
  preferred_language?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<{isComplete: boolean}>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("kisan_token"));
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8000/api";

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUser(await res.json());
      } else {
        logout();
      }
    } catch (e) {
      console.error(e);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginOtp = async (phone: string) => {
    await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
  };

  const verifyOtp = async (phone: string, otp: string) => {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp })
    });
    if (!res.ok) throw new Error("Invalid OTP");
    
    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem("kisan_token", data.access_token);
    await fetchProfile(); // refresh the user state immediately
    return { isComplete: data.is_profile_complete };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("kisan_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginOtp, verifyOtp, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
