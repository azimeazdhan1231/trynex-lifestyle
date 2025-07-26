import { useLanguage } from './language-provider';

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '#home', label: t('home') },
    { href: '#products', label: t('products') },
    { href: '#track', label: t('track') },
    { href: '#about', label: t('about') },
    { href: '#contact', label: t('contact') },
  ];

  const products = [
    'জেনারেল মগ',
    'লাভ মগ',
    'ম্যাজিক মগ',
    'কাস্টম ডিজাইন',
    'গিফট প্যাকেজ',
  ];

  const socialLinks = [
    { icon: 'fab fa-facebook-f', href: '#' },
    { icon: 'fab fa-instagram', href: '#' },
    { icon: 'fab fa-whatsapp', href: 'https://wa.me/8801940689487' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-neutral text-white py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <i className="fas fa-mug-hot text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('companyName')}</h3>
                <p className="text-sm text-gray-400">{t('companyTagline')}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              প্রিয়জনকে চমকে দিন আমাদের স্পেশাল কাস্টম মগ দিয়ে। ১০০% কাস্টমাইজেবল, দ্রুত ডেলিভারি।
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => {
                      const sectionId = link.href.replace('#', '');
                      if (sectionId === 'home') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        scrollToSection(sectionId);
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('ourProducts')}</h4>
            <ul className="space-y-3">
              {products.map((product) => (
                <li key={product}>
                  <button
                    onClick={() => scrollToSection('products')}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {product}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('contactUs')}</h4>
            <ul className="space-y-4">
              <li className="flex items-center">
                <i className="fas fa-phone text-primary mr-3"></i>
                <span className="text-gray-400">+880 1940689487</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-primary mr-3"></i>
                <span className="text-gray-400">trynex-lifestyle@gmail.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-credit-card text-primary mr-3 mt-1"></i>
                <div>
                  <p className="text-gray-400">পেমেন্ট:</p>
                  <p className="text-gray-400">01747292277</p>
                  <p className="text-sm text-gray-500">bKash/Nagad/Upay</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © ২০২৫ {t('companyName')}. {t('allRightsReserved')}
            </p>
            <div className="flex space-x-6">
              <button className="text-gray-400 hover:text-white transition-colors">
                প্রাইভেসি পলিসি
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                টার্মস অ্যান্ড কন্ডিশন
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                রিটার্ন পলিসি
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
