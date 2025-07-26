import { useLanguage } from './language-provider';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { t } = useLanguage();

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/8801940689487', '_blank');
  };

  return (
    <section className="relative bg-gradient-to-r from-primary via-purple-500 to-secondary py-20 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('heroTitle')}
              <span className="block text-secondary">{t('heroSubtitle')}</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {t('heroDescription')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 transition-colors shadow-lg"
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                {t('orderNow')}
              </Button>
              <Button
                onClick={openWhatsApp}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                {t('whatsappContact')}
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"
              alt="Custom mugs display"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />

            {/* Floating Offer Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">৪০০৳</div>
                <div className="text-sm text-gray-600">{t('perPiece')} থেকে শুরু</div>
                <div className="bg-accent text-white px-3 py-1 rounded-full text-xs mt-2">
                  {t('specialDiscount')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
