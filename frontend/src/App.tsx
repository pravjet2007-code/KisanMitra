import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import KisanBot from './components/KisanBot';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import AuthPage from './pages/AuthPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Marketplace from './pages/Marketplace';
import ListingDetail from './pages/ListingDetail';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import PaymentPage from './pages/PaymentPage';
import SellerDashboard from './pages/SellerDashboard';
import type { UserRole } from './types';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/** Smart redirect: /dashboard → role-specific dashboard */
function RoleDashboardRedirect() {
  const { role, isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  const map: Record<UserRole, string> = {
    farmer: '/dashboard/farmer',
    buyer: '/dashboard/buyer',
    seller: '/dashboard/seller',
  };
  return <Navigate to={map[role!]} replace />;
}

/** Layout wrapper — Navbar + Footer + KisanBot */
function PublicLayout({ children, showBot = false }: { children: React.ReactNode; showBot?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {showBot && <KisanBot />}
    </div>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <KisanBot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/" element={
              <PublicLayout showBot>
                <HomePage />
              </PublicLayout>
            } />

            <Route path="/features" element={
              <PublicLayout>
                <FeaturesPage />
              </PublicLayout>
            } />

            <Route path="/marketplace" element={
              <PublicLayout>
                <Marketplace />
              </PublicLayout>
            } />

            <Route path="/listing/:id" element={
              <PublicLayout>
                <ListingDetail />
              </PublicLayout>
            } />

            {/* Auth page — full screen, no Navbar/Footer */}
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/cart" element={
              <ProtectedRoute>
                <PublicLayout>
                  <CartPage />
                </PublicLayout>
              </ProtectedRoute>
            } />

            <Route path="/orders" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <OrdersPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <OrderTrackingPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/payment/:orderId" element={
              <ProtectedRoute>
                <PublicLayout>
                  <PaymentPage />
                </PublicLayout>
              </ProtectedRoute>
            } />

            {/* ── Smart Dashboard Redirect ── */}
            <Route path="/dashboard" element={<RoleDashboardRedirect />} />

            {/* ── Protected Dashboard Routes ── */}
            <Route path="/dashboard/farmer" element={
              <ProtectedRoute role="farmer">
                <DashboardLayout>
                  <FarmerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/buyer" element={
              <ProtectedRoute role="buyer">
                <DashboardLayout>
                  <BuyerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/seller" element={
              <ProtectedRoute role="seller">
                <DashboardLayout>
                  <SellerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* ── Legacy URL redirects (keep old links working) ── */}
            <Route path="/farmer-dashboard" element={<Navigate to="/dashboard/farmer" replace />} />
            <Route path="/buyer-dashboard" element={<Navigate to="/dashboard/buyer" replace />} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;