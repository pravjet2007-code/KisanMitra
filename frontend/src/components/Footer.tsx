import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('footer.platform'),
      links: [
        { label: t('nav.features'), path: '/features' },
        { label: t('nav.marketplace'), path: '/marketplace' },
        { label: t('nav.farmerDashboard'), path: '/farmer-dashboard' },
        { label: t('nav.buyerDashboard'), path: '/buyer-dashboard' },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.documentation'), path: '#' },
        { label: t('footer.apiReference'), path: '#' },
        { label: t('footer.helpCenter'), path: '#' },
        { label: t('footer.blog'), path: '#' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.aboutUs'), path: '#' },
        { label: t('footer.careers'), path: '#' },
        { label: t('footer.privacyPolicy'), path: '#' },
        { label: t('footer.termsOfService'), path: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-earth text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-terracotta via-amber to-sage" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold">
                KISAN<span className="text-terracotta-light">MITRA</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <Mail className="w-4 h-4 text-terracotta-light" />
                <span>hello@kisanmitra.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <Phone className="w-4 h-4 text-terracotta-light" />
                <span>1800-KISAN-00</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <MapPin className="w-4 h-4 text-terracotta-light" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading text-sm font-semibold text-white/80 uppercase tracking-wider mb-5">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/40 hover:text-terracotta-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} KISAN MITRA. {t('footer.builtFor')}.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>{t('footer.languages22')}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>{t('footer.voiceEnabled')}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>{t('footer.securePayments')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
