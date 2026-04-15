import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'Marketplace', path: '/marketplace' },
  {
    label: 'Dashboards',
    children: [
      { label: 'Farmer Dashboard', path: '/farmer-dashboard' },
      { label: 'Buyer Dashboard', path: '/buyer-dashboard' },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (y > 100) {
        setVisible(y < lastY || y < 200);
      } else {
        setVisible(true);
      }
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const textColor = scrolled || !isHome ? 'text-black' : 'text-white';
  const hoverColor = 'hover:text-terracotta';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled || !isHome
            ? 'bg-white/90 nav-blur border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[72px] md:h-[80px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                scrolled || !isHome ? 'bg-terracotta' : 'bg-white/15'
              }`}>
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className={`font-heading text-xl font-bold tracking-tight ${
                  scrolled || !isHome ? 'text-black' : 'text-white'
                }`}>
                  KISAN<span className="text-terracotta">MITRA</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center gap-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${textColor} ${hoverColor}`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-border p-2 min-w-[200px] animate-scale-in">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                              location.pathname === child.path
                                ? 'bg-terracotta/10 text-terracotta'
                                : 'text-dark hover:bg-light hover:text-terracotta'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
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
                )
              )}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-3">
              <Link
                to="/farmer-dashboard"
                className="hidden md:inline-flex items-center px-5 py-2.5 bg-terracotta text-white text-sm font-semibold rounded-xl hover:bg-terracotta-dark transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
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
        <div className="fixed inset-0 z-40 bg-white animate-fade-in lg:hidden">
          <div className="pt-24 px-6 pb-8 h-full overflow-y-auto">
            <div className="space-y-2">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                          location.pathname === child.path
                            ? 'bg-terracotta/10 text-terracotta'
                            : 'text-dark hover:bg-light'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
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
                )
              )}
            </div>
            <div className="mt-8">
              <Link
                to="/farmer-dashboard"
                className="block w-full py-4 bg-terracotta text-white text-center font-semibold rounded-xl hover:bg-terracotta-dark transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
