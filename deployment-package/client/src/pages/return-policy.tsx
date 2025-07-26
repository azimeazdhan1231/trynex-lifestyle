import { RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/translations';

export default function ReturnPolicyPage() {
  const { language } = useLanguage();

  const policyData = {
    en: {
      title: "Return & Refund Policy",
      subtitle: "Your satisfaction is our priority. Here's our hassle-free return policy.",
      lastUpdated: "Last updated: January 2024",
      sections: {
        eligibility: {
          title: "Return Eligibility",
          items: [
            "Items must be returned within 7 days of delivery",
            "Products must be in original condition and packaging",
            "Return reason must be product defect or significant difference from description",
            "Custom printed items cannot be returned unless defective",
            "Proof of purchase (order ID) is required"
          ]
        },
        process: {
          title: "Return Process",
          steps: [
            "Contact our customer service within 7 days",
            "Provide order ID and reason for return",
            "Get return approval and instructions",
            "Pack the item securely with original packaging",
            "Ship to our return address (shipping cost covered by us for defective items)",
            "Receive refund within 7-10 working days after inspection"
          ]
        },
        nonReturnable: {
          title: "Non-Returnable Items",
          items: [
            "Custom designed and personalized products (unless defective)",
            "Items damaged by customer misuse",
            "Products returned after 7 days deadline",
            "Items without original packaging or tags",
            "Digital products and gift vouchers"
          ]
        },
        refundPolicy: {
          title: "Refund Policy",
          items: [
            "Full refund for defective or wrong products",
            "Refund to original payment method within 7-10 working days",
            "Shipping costs refunded only for our errors",
            "Custom orders: 50% refund if cancelled before production",
            "No refund for customer change of mind on custom products"
          ]
        }
      }
    },
    bn: {
      title: "ফেরত ও রিফান্ড নীতি",
      subtitle: "আপনার সন্তুষ্টিই আমাদের অগ্রাধিকার। এখানে আমাদের সহজ ফেরত নীতি।",
      lastUpdated: "সর্বশেষ আপডেট: জানুয়ারি ২০২৪",
      sections: {
        eligibility: {
          title: "ফেরত যোগ্যতা",
          items: [
            "ডেলিভারির ৭ দিনের মধ্যে পণ্য ফেরত দিতে হবে",
            "পণ্য অবশ্যই মূল অবস্থা এবং প্যাকেজিং-এ থাকতে হবে",
            "ফেরতের কারণ অবশ্যই পণ্যের ত্রুটি বা বর্ণনার সাথে উল্লেখযোগ্য পার্থক্য হতে হবে",
            "কাস্টম প্রিন্টেড পণ্য ত্রুটিপূর্ণ না হলে ফেরত দেওয়া যাবে না",
            "ক্রয়ের প্রমাণ (অর্ডার আইডি) প্রয়োজন"
          ]
        },
        process: {
          title: "ফেরত প্রক্রিয়া",
          steps: [
            "৭ দিনের মধ্যে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন",
            "অর্ডার আইডি এবং ফেরতের কারণ প্রদান করুন",
            "ফেরত অনুমোদন এবং নির্দেশনা পান",
            "মূল প্যাকেজিং সহ পণ্যটি নিরাপদে প্যাক করুন",
            "আমাদের ফেরত ঠিকানায় পাঠান (ত্রুটিপূর্ণ পণ্যের জন্য শিপিং খরচ আমাদের)",
            "পরীক্ষার পর ৭-১০ কার্যদিবসের মধ্যে রিফান্ড পান"
          ]
        },
        nonReturnable: {
          title: "অ-ফেরতযোগ্য পণ্য",
          items: [
            "কাস্টম ডিজাইন এবং ব্যক্তিগতকৃত পণ্য (ত্রুটিপূর্ণ না হলে)",
            "গ্রাহকের ভুল ব্যবহারে ক্ষতিগ্রস্ত পণ্য",
            "৭ দিনের সময়সীমার পর ফেরত দেওয়া পণ্য",
            "মূল প্যাকেজিং বা ট্যাগ ছাড়া পণ্য",
            "ডিজিটাল পণ্য এবং গিফট ভাউচার"
          ]
        },
        refundPolicy: {
          title: "রিফান্ড নীতি",
          items: [
            "ত্রুটিপূর্ণ বা ভুল পণ্যের জন্য সম্পূর্ণ রিফান্ড",
            "৭-১০ কার্যদিবসের মধ্যে মূল পেমেন্ট পদ্ধতিতে রিফান্ড",
            "শুধুমাত্র আমাদের ত্রুটির জন্য শিপিং খরচ ফেরত",
            "কাস্টম অর্ডার: উৎপাদনের আগে বাতিল করলে ৫০% রিফান্ড",
            "কাস্টম পণ্যে গ্রাহকের মন পরিবর্তনের জন্য কোন রিফান্ড নেই"
          ]
        }
      }
    }
  };

  const currentPolicy = policyData[language as keyof typeof policyData];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <RotateCcw className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentPolicy.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            {currentPolicy.subtitle}
          </p>
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            {currentPolicy.lastUpdated}
          </Badge>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">
                {language === 'bn' ? '৭ দিনের গ্যারান্টি' : '7 Days Return'}
              </h3>
              <p className="text-green-700 text-sm">
                {language === 'bn' 
                  ? 'ডেলিভারির ৭ দিনের মধ্যে ফেরত দিন'
                  : 'Return within 7 days of delivery'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-800 mb-2">
                {language === 'bn' ? 'সম্পূর্ণ রিফান্ড' : 'Full Refund'}
              </h3>
              <p className="text-blue-700 text-sm">
                {language === 'bn' 
                  ? 'ত্রুটিপূর্ণ পণ্যের জন্য ১০০% রিফান্ড'
                  : '100% refund for defective products'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-800 mb-2">
                {language === 'bn' ? 'সহজ প্রক্রিয়া' : 'Easy Process'}
              </h3>
              <p className="text-purple-700 text-sm">
                {language === 'bn' 
                  ? 'ফোন করুন এবং দ্রুত সমাধান পান'
                  : 'Call us and get quick solution'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Return Eligibility */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              {currentPolicy.sections.eligibility.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {currentPolicy.sections.eligibility.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <RotateCcw className="w-5 h-5 mr-2 text-blue-600" />
              {currentPolicy.sections.process.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentPolicy.sections.process.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Non-Returnable Items */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <XCircle className="w-5 h-5 mr-2" />
                {currentPolicy.sections.nonReturnable.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentPolicy.sections.nonReturnable.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Refund Policy */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                {currentPolicy.sections.refundPolicy.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentPolicy.sections.refundPolicy.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="mt-8 bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">
                  {language === 'bn' ? 'গুরুত্বপূর্ণ তথ্য' : 'Important Information'}
                </h3>
                <p className="text-amber-700">
                  {language === 'bn' 
                    ? 'কাস্টম পণ্যের ক্ষেত্রে ফেরত নীতি ভিন্ন। অর্ডার করার আগে নিশ্চিত হয়ে নিন। যেকোনো সমস্যার জন্য আমাদের সাথে যোগাযোগ করুন।'
                    : 'Return policy differs for custom products. Please confirm before ordering. Contact us for any issues or clarifications.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Returns */}
        <Card className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'bn' ? 'ফেরত বা রিফান্ডের জন্য যোগাযোগ' : 'Contact for Returns & Refunds'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {language === 'bn' 
                ? 'আমাদের কাস্টমার সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত।'
                : 'Our customer support team is ready to help you with returns and refunds.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+8801940689487" 
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                {language === 'bn' ? 'কল করুন: ০১৯৪০-৬৮৯৪৮৭' : 'Call: 01940-689487'}
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {language === 'bn' ? 'যোগাযোগ ফর্ম' : 'Contact Form'}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Legal Note */}
        <div className="text-center mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'bn' 
              ? 'এই নীতি ট্রাইনেক্স লাইফস্টাইল এর সকল বিক্রয়ের ক্ষেত্রে প্রযোজ্য। সকল অধিকার সংরক্ষিত।'
              : 'This policy applies to all sales by TryNex Lifestyle. All rights reserved.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}