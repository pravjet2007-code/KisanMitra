import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If specified, only this role can access the route. Others are redirected to their own dashboard. */
  role?: UserRole;
}

/**
 * ProtectedRoute — auth + role guard.
 *
 * Behaviour matrix:
 *   Not logged in           → /auth?redirect=<current path>
 *   Logged in, correct role → render children
 *   Logged in, wrong role   → redirect to their correct dashboard
 */
export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, role: userRole, loading } = useAuth();
  const location = useLocation();

  // Don't flash redirect while rehydrating from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (role && userRole && userRole !== role) {
    // Redirect to the user's correct dashboard
    const dashboardMap: Record<UserRole, string> = {
      farmer: '/dashboard/farmer',
      buyer: '/dashboard/buyer',
      seller: '/dashboard/seller',
    };
    return <Navigate to={dashboardMap[userRole]} replace />;
  }

  return <>{children}</>;
}
