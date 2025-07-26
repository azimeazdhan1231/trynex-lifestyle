import { FileText, Scale, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/translations';

export default function TermsConditionsPage() {
  const { language } = useLanguage();

  const termsData = {
    en: {
      title: "Terms & Conditions",
      subtitle: "Please read these terms carefully before using our services",
      lastUpdated: "Last updated: January 2024",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By accessing and using TryNex Lifestyle services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        },
        {
          title: "2. Product Information",
          content: "We strive to provide accurate product information including descriptions, prices, and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. Colors and designs may vary slightly from images due to monitor settings and printing processes."
        },
        {
          title: "3. Orders and Payment",
          content: "All orders are subject to availability and confirmation of the order price. Payment must be made in full before processing begins. We accept mobile banking, bank transfers, and cash on delivery (where available). Order cancellation is possible within 1 hour of placing the order."
        },
        {
          title: "4. Custom Design Policy",
          content: "Custom designs require customer approval before printing. Once approved and production begins, custom orders cannot be cancelled or returned unless there is a manufacturing defect. Design revisions are limited to 3 rounds of changes."
        },
        {
          title: "5. Delivery and Shipping",
          content: "We deliver nationwide across Bangladesh. Delivery time is typically 2-5 working days for Dhaka and 3-7 working days for outside Dhaka. Shipping costs may apply for orders under ৳500. Customers are responsible for providing accurate delivery addresses."
        },
        {
          title: "6. Return and Refund Policy",
          content: "Items can be returned within 7 days of delivery if they are defective or not as described. Custom printed items cannot be returned unless there is a manufacturing defect. Refunds will be processed within 7-10 working days after receiving the returned item."
        },
        {
          title: "7. Intellectual Property",
          content: "Customers must ensure they have the right to use any images, text, or designs they provide for custom printing. TryNex Lifestyle is not responsible for any copyright infringement claims related to customer-provided content."
        },
        {
          title: "8. Limitation of Liability",
          content: "TryNex Lifestyle shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
        },
        {
          title: "9. Privacy Policy",
          content: "We collect and use personal information to process orders and improve our services. Customer information is kept confidential and not shared with third parties except as necessary to fulfill orders."
        },
        {
          title: "10. Modifications",
          content: "TryNex Lifestyle reserves the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after changes constitutes acceptance of the new terms."
        }
      ]
    },
    bn: {
      title: "শর্তাবলী",
      subtitle: "আমাদের সেবা ব্যবহারের আগে এই শর্তাবলী সাবধানে পড়ুন",
      lastUpdated: "সর্বশেষ আপডেট: জানুয়ারি ২০২৪",
      sections: [
        {
          title: "১. শর্তাবলী গ্রহণ",
          content: "ট্রাইনেক্স লাইফস্টাইল সেবা ব্যবহার করে আপনি এই চুক্তির শর্তাবলী মেনে নিতে সম্মত হন। যদি আপনি উপরোক্ত শর্তাবলী মানতে সম্মত না হন, তাহলে এই সেবা ব্যবহার করবেন না।"
        },
        {
          title: "২. পণ্যের তথ্য",
          content: "আমরা বিবরণ, দাম এবং ছবি সহ সঠিক পণ্যের তথ্য প্রদান করার চেষ্টা করি। তবে আমরা পণ্যের বিবরণ বা অন্যান্য বিষয়বস্তু সঠিক, সম্পূর্ণ, নির্ভরযোগ্য বা ত্রুটিমুক্ত হওয়ার গ্যারান্টি দিই না। মনিটর সেটিংস এবং প্রিন্টিং প্রক্রিয়ার কারণে রং এবং ডিজাইন ছবি থেকে সামান্য ভিন্ন হতে পারে।"
        },
        {
          title: "৩. অর্ডার এবং পেমেন্ট",
          content: "সকল অর্ডার প্রাপ্যতা এবং অর্ডার মূল্য নিশ্চিতকরণ সাপেক্ষে। প্রক্রিয়াকরণ শুরুর আগে সম্পূর্ণ পেমেন্ট করতে হবে। আমরা মোবাইল ব্যাংকিং, ব্যাংক ট্রান্সফার এবং ক্যাশ অন ডেলিভারি গ্রহণ করি। অর্ডার করার ১ ঘন্টার মধ্যে বাতিল করা সম্ভব।"
        },
        {
          title: "৪. কাস্টম ডিজাইন নীতি",
          content: "কাস্টম ডিজাইনের জন্য প্রিন্টিংয়ের আগে গ্রাহকের অনুমোদন প্রয়োজন। একবার অনুমোদিত হয়ে উৎপাদন শুরু হলে, কাস্টম অর্ডার বাতিল বা ফেরত দেওয়া যাবে না যদি না উৎপাদনগত ত্রুটি থাকে। ডিজাইন সংশোধন সর্বোচ্চ ৩ রাউন্ড পর্যন্ত সীমিত।"
        },
        {
          title: "৫. ডেলিভারি এবং শিপিং",
          content: "আমরা সারা বাংলাদেশে ডেলিভারি করি। ডেলিভারির সময় সাধারণত ঢাকার জন্য ২-৫ কার্যদিবস এবং ঢাকার বাইরে ৩-৭ কার্যদিবস। ৫০০ টাকার কম অর্ডারের জন্য শিপিং খরচ প্রযোজ্য হতে পারে। সঠিক ডেলিভারি ঠিকানা প্রদানের দায়িত্ব গ্রাহকের।"
        },
        {
          title: "৬. ফেরত এবং রিফান্ড নীতি",
          content: "ডেলিভারির ৭ দিনের মধ্যে ত্রুটিপূর্ণ বা বর্ণনা অনুযায়ী না হলে পণ্য ফেরত দেওয়া যাবে। কাস্টম প্রিন্টেড পণ্য ফেরত দেওয়া যাবে না যদি না উৎপাদনগত ত্রুটি থাকে। ফেরত পণ্য পাওয়ার ৭-১০ কার্যদিবসের মধ্যে রিফান্ড প্রক্রিয়া করা হবে।"
        },
        {
          title: "৭. বুদ্ধিবৃত্তিক সম্পত্তি",
          content: "কাস্টম প্রিন্টিংয়ের জন্য গ্রাহকদের প্রদত্ত যেকোনো ছবি, টেক্সট বা ডিজাইন ব্যবহারের অধিকার রয়েছে তা নিশ্চিত করতে হবে। গ্রাহক-প্রদত্ত বিষয়বস্তু সম্পর্কিত কপিরাইট লঙ্ঘনের দাবির জন্য ট্রাইনেক্স লাইফস্টাইল দায়ী নয়।"
        },
        {
          title: "৮. দায়বদ্ধতার সীমাবদ্ধতা",
          content: "ট্রাইনেক্স লাইফস্টাইল কোনো পরোক্ষ, আনুষঙ্গিক, বিশেষ, ফলস্বরূপ বা শাস্তিমূলক ক্ষতির জন্য দায়ী থাকবে না, যার মধ্যে লাভ, ডেটা, ব্যবহার বা অন্যান্য অদৃশ্য ক্ষতি অন্তর্ভুক্ত।"
        },
        {
          title: "৯. গোপনীয়তা নীতি",
          content: "অর্ডার প্রক্রিয়াকরণ এবং আমাদের সেবার উন্নতির জন্য আমরা ব্যক্তিগত তথ্য সংগ্রহ ও ব্যবহার করি। গ্রাহকের তথ্য গোপনীয় রাখা হয় এবং অর্ডার পূরণের জন্য প্রয়োজনীয় ছাড়া তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।"
        },
        {
          title: "১০. পরিবর্তন",
          content: "ট্রাইনেক্স লাইফস্টাইল যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখে। পরিবর্তনগুলি আমাদের ওয়েবসাইটে পোস্ট করার সাথে সাথেই কার্যকর হবে। পরিবর্তনের পর আমাদের সেবা ব্যবহার করা নতুন শর্তাবলী গ্রহণ করার সমতুল্য।"
        }
      ]
    }
  };

  const currentTerms = termsData[language as keyof typeof termsData];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentTerms.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            {currentTerms.subtitle}
          </p>
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            {currentTerms.lastUpdated}
          </Badge>
        </div>

        {/* Important Notice */}
        <Card className="bg-amber-50 border-amber-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">
                  {language === 'bn' ? 'গুরুত্বপূর্ণ বিজ্ঞপ্তি' : 'Important Notice'}
                </h3>
                <p className="text-amber-700">
                  {language === 'bn' 
                    ? 'এই শর্তাবলী আইনগতভাবে বাধ্যতামূলক। আমাদের সেবা ব্যবহার করে আপনি এই সকল শর্ত মেনে নিতে সম্মত হন।'
                    : 'These terms are legally binding. By using our services, you agree to comply with all these terms and conditions.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          {currentTerms.sections.map((section, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'bn' ? 'প্রশ্ন থাকলে যোগাযোগ করুন' : 'Have Questions? Contact Us'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {language === 'bn' 
                ? 'এই শর্তাবলী সম্পর্কে কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।'
                : 'If you have any questions about these terms and conditions, please contact us.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
              </a>
              <a 
                href="mailto:info@trynex.com" 
                className="inline-flex items-center border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {language === 'bn' ? 'ইমেইল পাঠান' : 'Send Email'}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Acknowledgment */}
        <div className="text-center mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'bn' 
              ? 'এই শর্তাবলী ট্রাইনেক্স লাইফস্টাইল এর আইনি নথি। সকল অধিকার সংরক্ষিত।'
              : 'These terms and conditions constitute the legal agreement for TryNex Lifestyle. All rights reserved.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}