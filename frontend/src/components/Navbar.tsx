import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sprout, ChevronDown, Globe, Wheat, ShoppingCart, Store, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
];

const ROLE_META = {
  farmer: { label: 'Farmer', icon: Wheat, color: 'text-sage-dark bg-sage/10 border-sage/20' },
  buyer:  { label: 'Buyer',  icon: ShoppingCart, color: 'text-info bg-info/10 border-info/20' },
  seller: { label: 'Seller', icon: Store,        color: 'text-amber bg-amber/10 border-amber/20' },
};

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [visible, setVisible]       = useState(true);
  const [lastY, setLastY]           = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const location  = useLocation();
  const navigate  = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, role, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';

  // Hide on scroll-down
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setVisible(y < 100 || y < lastY || y < 200);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Click-outside close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const textColor  = scrolled || !isHome ? 'text-black' : 'text-white';
  const hoverColor = 'hover:text-terracotta';

  const dashboardPath =
    role === 'farmer' ? '/dashboard/farmer' :
    role === 'buyer'  ? '/dashboard/buyer'  :
    role === 'seller' ? '/dashboard/seller' : '/auth';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // User initials for avatar
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const roleMeta = role ? ROLE_META[role] : null;

  const publicNavLinks = [
    { label: t('nav.home', 'Home'), path: '/' },
    { label: t('nav.features', 'Features'), path: '/features' },
    { label: t('nav.marketplace', 'Marketplace'), path: '/marketplace' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled || !isHome
            ? 'bg-white/90 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[72px] md:h-[80px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                scrolled || !isHome ? 'bg-terracotta' : 'bg-white/15'
              }`}>
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className={`font-heading text-xl font-bold tracking-tight ${
                scrolled || !isHome ? 'text-black' : 'text-white'
              }`}>
                KISAN<span className="text-terracotta">MITRA</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'text-terracotta'
                      : `${textColor} ${hoverColor}`
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to={dashboardPath}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname.startsWith('/dashboard')
                      ? 'text-terracotta'
                      : `${textColor} ${hoverColor}`
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setLangMenuOpen((o) => !o)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled || !isHome ? 'text-black hover:bg-black/5' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{(i18n.language || 'en').split('-')[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-border p-2 animate-scale-in z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); setLangMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          i18n.language?.startsWith(lang.code)
                            ? 'bg-terracotta/10 text-terracotta'
                            : 'text-dark hover:bg-light hover:text-terracotta'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth: logged-in state */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/5 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className={`text-sm font-semibold leading-tight ${scrolled || !isHome ? 'text-black' : 'text-white'}`}>
                        {user.full_name || 'Setup Profile'}
                      </p>
                      {roleMeta && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${roleMeta.color}`}>
                          {roleMeta.label}
                        </span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform hidden md:block ${
                      scrolled || !isHome ? 'text-dark' : 'text-white/70'
                    } ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-border p-2 animate-scale-in z-50">
                      <div className="px-3 py-2 mb-1 border-b border-border">
                        <p className="text-xs font-semibold text-black truncate">{user.full_name || 'New User'}</p>
                        <p className="text-[11px] text-muted truncate">{user.phone_number}</p>
                      </div>
                      <Link
                        to={dashboardPath}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg text-dark hover:bg-light hover:text-terracotta transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> My Dashboard
                      </Link>
                      <Link
                        to={`${dashboardPath}?tab=profile`}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg text-dark hover:bg-light hover:text-terracotta transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile Settings
                      </Link>
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg text-danger hover:bg-danger/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth: logged-out state */
                <Link
                  to="/auth"
                  className="hidden md:inline-flex items-center px-5 py-2.5 bg-terracotta text-white text-sm font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                  scrolled || !isHome ? 'hover:bg-light' : 'hover:bg-white/10'
                }`}
              >
                {mobileOpen ? (
                  <X className={`w-6 h-6 ${scrolled || !isHome ? 'text-black' : 'text-white'}`} />
                ) : (
                  <Menu className={`w-6 h-6 ${scrolled || !isHome ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white animate-fade-in lg:hidden overflow-y-auto">
          <div className="pt-24 px-6 pb-8">
            <div className="space-y-1 mb-6">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                    location.pathname === link.path
                      ? 'bg-terracotta/10 text-terracotta'
                      : 'text-dark hover:bg-light'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to={dashboardPath}
                  className={`flex items-center gap-2 px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                    location.pathname.startsWith('/dashboard')
                      ? 'bg-terracotta/10 text-terracotta'
                      : 'text-dark hover:bg-light'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
              )}
            </div>

            {/* Language */}
            <div className="border-t border-border pt-4 mb-4">
              <p className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">Language</p>
              <div className="grid grid-cols-2 gap-2 px-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { i18n.changeLanguage(lang.code); setMobileOpen(false); }}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      i18n.language?.startsWith(lang.code)
                        ? 'bg-terracotta/10 text-terracotta'
                        : 'bg-light text-dark hover:bg-terracotta/5'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth CTA */}
            {isAuthenticated ? (
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-offwhite rounded-xl">
                  <div className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{user?.full_name || 'New User'}</p>
                    {roleMeta && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${roleMeta.color}`}>
                        {roleMeta.label}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 flex items-center justify-center gap-2 text-danger font-semibold text-sm border border-danger/20 rounded-xl hover:bg-danger/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block w-full py-4 bg-terracotta text-white text-center font-semibold rounded-xl hover:bg-terracotta-dark transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
