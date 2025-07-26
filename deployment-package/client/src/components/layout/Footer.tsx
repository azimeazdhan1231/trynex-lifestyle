import { Link } from 'wouter';
import { Facebook, Phone, Mail, MapPin, Heart, Star } from 'lucide-react';
import { useLanguage } from '@/lib/translations';

export default function Footer() {
  const { language } = useLanguage();

  const footerLinks = {
    company: {
      title: language === 'bn' ? 'কোম্পানি' : 'Company',
      links: [
        { name: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us', href: '/about' },
        { name: language === 'bn' ? 'যোগাযোগ' : 'Contact', href: '/contact' },
        { name: language === 'bn' ? 'ক্যারিয়ার' : 'Careers', href: '/careers' },
        { name: language === 'bn' ? 'সংবাদ' : 'News', href: '/news' },
      ]
    },
    customer: {
      title: language === 'bn' ? 'গ্রাহক সেবা' : 'Customer Service',
      links: [
        { name: language === 'bn' ? 'সাহায্য কেন্দ্র' : 'Help Center', href: '/help' },
        { name: language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order', href: '/order-tracking' },
        { name: language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions', href: '/terms-conditions' },
        { name: language === 'bn' ? 'ফেরত নীতি' : 'Return Policy', href: '/return-policy' },
      ]
    },
    products: {
      title: language === 'bn' ? 'পণ্য' : 'Products',
      links: [
        { name: language === 'bn' ? 'কাস্টম মগ' : 'Custom Mugs', href: '/products?category=mugs' },
        { name: language === 'bn' ? 'টি-শার্ট' : 'T-Shirts', href: '/products?category=tshirts' },
        { name: language === 'bn' ? 'কাস্টম ডিজাইন' : 'Custom Design', href: '/custom-design' },
        { name: language === 'bn' ? 'গিফট আইটেম' : 'Gift Items', href: '/products?category=gifts' },
      ]
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info & Social Media */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">TryNex Lifestyle</h2>
                <p className="text-gray-400 text-sm">
                  {language === 'bn' ? 'স্বপ্নের নিদর্শন' : 'Crafting Dreams'}
                </p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {language === 'bn' 
                ? 'আমরা আপনার পছন্দের ডিজাইন দিয়ে কাস্টম পণ্য তৈরি করি। প্রিমিয়াম কোয়ালিটি এবং দ্রুত ডেলিভারি আমাদের বিশেষত্ব।'
                : 'We create custom products with your favorite designs. Premium quality and fast delivery are our specialties.'
              }
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">+880 1940-689487</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">info@trynex.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">
                  {language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}
                </span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                {language === 'bn' ? 'আমাদের ফলো করুন' : 'Follow Us'}
              </h3>
              <div className="space-y-3">
                {/* Business Facebook Page */}
                <a 
                  href="https://www.facebook.com/people/TryNex-Lifestyle/61576151563336/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
                >
                  <Facebook className="w-5 h-5 text-white" />
                  <div>
                    <span className="block text-white font-medium">TryNex Lifestyle</span>
                    <span className="block text-blue-100 text-sm">
                      {language === 'bn' ? 'অফিসিয়াল পেইজ' : 'Official Page'}
                    </span>
                  </div>
                </a>

                {/* CEO Facebook Profile */}
                <a 
                  href="https://www.facebook.com/ahmed.amit.333" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors group"
                >
                  <Facebook className="w-5 h-5 text-white" />
                  <div>
                    <span className="block text-white font-medium">Ahmed Amit</span>
                    <span className="block text-indigo-100 text-sm">
                      {language === 'bn' ? 'প্রতিষ্ঠাতা ও সিইও' : 'Founder & CEO'}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {footerLinks.company.title}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {footerLinks.customer.title}
            </h3>
            <ul className="space-y-2">
              {footerLinks.customer.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {footerLinks.products.title}
            </h3>
            <ul className="space-y-2">
              {footerLinks.products.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === 'bn' ? 'নিউজলেটার সাবস্ক্রাইব করুন' : 'Subscribe to Newsletter'}
              </h3>
              <p className="text-gray-400">
                {language === 'bn' 
                  ? 'সর্বশেষ অফার এবং আপডেট পেতে সাবস্ক্রাইব করুন'
                  : 'Subscribe to get latest offers and updates'
                }
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder={language === 'bn' ? 'আপনার ইমেইল' : 'Your email'}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                {language === 'bn' ? 'সাবস্ক্রাইব' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 TryNex Lifestyle. {language === 'bn' ? 'সকল অধিকার সংরক্ষিত।' : 'All rights reserved.'}
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">
                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </Link>
              <Link href="/terms-conditions" className="hover:text-purple-400 transition-colors">
                {language === 'bn' ? 'শর্তাবলী' : 'Terms'}
              </Link>
              <Link href="/sitemap" className="hover:text-purple-400 transition-colors">
                {language === 'bn' ? 'সাইটম্যাপ' : 'Sitemap'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Social Buttons for Mobile */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <div className="flex flex-col space-y-2">
          <a 
            href="https://www.facebook.com/people/TryNex-Lifestyle/61576151563336/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <Facebook className="w-6 h-6 text-white" />
          </a>
          <a 
            href="tel:+8801940689487" 
            className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <Phone className="w-6 h-6 text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
}