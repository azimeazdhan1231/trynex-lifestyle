import { useLanguage } from './language-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PaymentMethods() {
  const { t } = useLanguage();

  const paymentMethods = [
    {
      name: 'bKash',
      icon: 'fas fa-mobile-alt',
      color: 'pink',
      description: 'সবচেয়ে জনপ্রিয় মোবাইল ব্যাংকিং',
      number: '০১৭৪৭২৯২২৭৭',
    },
    {
      name: 'Nagad',
      icon: 'fas fa-money-bill-wave',
      color: 'orange',
      description: 'দ্রুত ও নিরাপদ পেমেন্ট',
      number: '০১৭৪৭২৯২২৭৭',
    },
    {
      name: 'Upay',
      icon: 'fas fa-credit-card',
      color: 'blue',
      description: 'সহজ ডিজিটাল পেমেন্ট',
      number: '০১৭৪৭২৯২২৭৭',
    },
  ];

  const paymentSteps = [
    'উপরের যেকোন নাম্বারে Send Money করুন',
    'পেমেন্ট স্ক্রিনশট নিন',
    'আমাদের WhatsApp এ পাঠান',
    'অর্ডার কনফার্ম হবে ১ ঘন্টার মধ্যে',
  ];

  const paymentFeatures = [
    '১০০% এডভান্স পেমেন্ট',
    '২৪ ঘন্টা পেমেন্ট সাপোর্ট',
    'নিরাপদ ও দ্রুত লেনদেন',
    'কোন লুকানো চার্জ নেই',
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">{t('paymentMethods')}</h2>
            <p className="text-lg text-gray-600">সহজ ও নিরাপদ পেমেন্ট করুন</p>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {paymentMethods.map((method) => (
              <Card key={method.name} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-${method.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${method.icon} text-2xl text-${method.color}-600`}></i>
                  </div>
                  <CardTitle className="text-xl font-bold text-neutral mb-3">
                    {method.name}
                  </CardTitle>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <div className={`bg-${method.color}-50 p-4 rounded-lg`}>
                    <p className="font-semibold text-neutral">{method.number}</p>
                    <p className="text-sm text-gray-600">{t('personalNumber')}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Instructions */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral mb-6 text-center">
                {t('paymentInstructions')}
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-neutral mb-4">পেমেন্ট করার নিয়ম:</h4>
                  <ol className="space-y-3">
                    {paymentSteps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral mb-4">গুরুত্বপূর্ণ তথ্য:</h4>
                  <ul className="space-y-3">
                    {paymentFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <i className="fas fa-check-circle text-accent mr-3"></i>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
