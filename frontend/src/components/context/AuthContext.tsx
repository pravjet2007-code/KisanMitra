import { createContext, useContext, useState, ReactNode } from 'react';

export type User = {
  id: string;
  is_profile_complete: boolean;
  name?: string;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Using a mock logged-in state by default so you can access the protected routes during dev
  const [user, setUser] = useState<User | null>({ id: '1', is_profile_complete: true, name: 'Mock Farmer' });
  const [token, setToken] = useState<string | null>('mock-jwt-token');

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
