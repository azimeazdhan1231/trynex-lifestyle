import { createContext, useContext, useState, ReactNode, createElement } from 'react';

interface Translations {
  home: string;
  products: string;
  customDesign: string;
  contact: string;
  cart: string;
  search: string;
  searchPlaceholder: string;
  mugs: string;
  tshirts: string;
  keychains: string;
  waterBottles: string;
  giftForHim: string;
  giftForHer: string;
  giftForParents: string;
  giftsForBabies: string;
  forCouple: string;
  premiumLuxuryGiftHampers: string;
  chocolatesFlowers: string;
  loveMug: string;
  magicMug: string;
  bestSeller: string;
  romantic: string;
  premium: string;
  perPiece: string;
  specialDiscount: string;
  allCustomDesigns: string;
  premiumCeramic: string;
  durablePrint: string;
  heartShape: string;
  romanticTheme: string;
  coupleGiftSet: string;
  colorChanging: string;
  hotWaterReveal: string;
  surpriseEffect: string;
  paymentMethods: string;
  paymentInstructions: string;
  personalNumber: string;
  trackOrder: string;
  trackingId: string;
  trackingPlaceholder: string;
  track: string;
  companyName: string;
  companyTagline: string;
  quickLinks: string;
  ourProducts: string;
  contactUs: string;
  allRightsReserved: string;
  checkout: string;
  customerInfo: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  thana: string;
  address: string;
  selectDistrict: string;
  selectThana: string;
  orderSummary: string;
  total: string;
  placeOrder: string;
  pending: string;
  confirmed: string;
  processing: string;
  ready: string;
  shipped: string;
  delivered: string;
}

const translations: Record<'bn' | 'en', Translations> = {
  bn: {
    home: "হোম",
    products: "প্রোডাক্ট",
    customDesign: "কাস্টম ডিজাইন",
    contact: "যোগাযোগ",
    cart: "কার্ট",
    search: "খুঁজুন",
    searchPlaceholder: "প্রোডাক্ট খুঁজুন...",
    mugs: "প্রিমিয়াম সিরামিক মগ",
    tshirts: "আরামদায়ক টি-শার্ট",
    keychains: "স্টাইলিশ চাবির চেইন",
    waterBottles: "ইকো-ফ্রেন্ডলি বোতল",
    giftForHim: "🎁 স্পেশাল",
    giftForHer: "💝 এক্সক্লুসিভ",
    giftForParents: "❤️ ভালোবাসা",
    giftsForBabies: "🍼 সেফ",
    forCouple: "💑 রোমান্টিক",
    premiumLuxuryGiftHampers: "🎁 লাক্সারি",
    chocolatesFlowers: "🍫🌹 রোমান্টিক",
    loveMug: "লাভ মগ",
    magicMug: "ম্যাজিক মগ",
    bestSeller: "বেস্ট সেলার",
    romantic: "রোমান্টিক",
    premium: "প্রিমিয়াম",
    perPiece: "প্রতি পিস",
    specialDiscount: "বিশেষ ছাড়!",
    allCustomDesigns: "সব ধরনের কাস্টম ডিজাইন",
    premiumCeramic: "উন্নত মানের সিরামিক",
    durablePrint: "দীর্ঘস্থায়ী প্রিন্ট কোয়ালিটি",
    heartShape: "হার্ট শেইপ ডিজাইন",
    romanticTheme: "রোমান্টিক থিম",
    coupleGiftSet: "কাপল গিফট সেট",
    colorChanging: "রঙ পরিবর্তনশীল",
    hotWaterReveal: "গরম পানিতে ছবি দেখায়",
    surpriseEffect: "সারপ্রাইজ ইফেক্ট",
    paymentMethods: "পেমেন্ট পদ্ধতি",
    paymentInstructions: "পেমেন্ট নির্দেশনা",
    personalNumber: "পার্সোনাল নাম্বার",
    trackOrder: "অর্ডার ট্র্যাক করুন",
    trackingId: "ট্র্যাকিং আইডি",
    trackingPlaceholder: "যেমন: #TRX123456",
    track: "ট্র্যাক করুন",
    companyName: "Trynex Lifestyle",
    companyTagline: "কাস্টম মগ ও গিফট শপ",
    quickLinks: "দ্রুত লিংক",
    ourProducts: "আমাদের প্রোডাক্ট",
    contactUs: "যোগাযোগ",
    allRightsReserved: "সকল অধিকার সংরক্ষিত।",
    checkout: "চেকআউট",
    customerInfo: "কাস্টমার তথ্য",
    name: "নাম",
    phone: "ফোন নাম্বার",
    email: "ইমেইল (ঐচ্ছিক)",
    district: "জেলা",
    thana: "থানা",
    address: "ঠিকানা",
    selectDistrict: "জেলা নির্বাচন করুন",
    selectThana: "থানা নির্বাচন করুন",
    orderSummary: "অর্ডার সারাংশ",
    total: "মোট",
    placeOrder: "অর্ডার করুন",
    pending: "অপেক্ষমাণ",
    confirmed: "কনফার্ম",
    processing: "প্রক্রিয়াধীন",
    ready: "প্রস্তুত",
    shipped: "পাঠানো হয়েছে",
    delivered: "ডেলিভার হয়েছে",
  },
  en: {
    home: "Home",
    products: "Products",
    customDesign: "Custom Design",
    contact: "Contact",
    cart: "Cart",
    search: "Search",
    searchPlaceholder: "Search products...",
    mugs: "Premium Ceramic Mugs",
    tshirts: "Comfortable T-Shirts",
    keychains: "Stylish Keychains",
    waterBottles: "Eco-Friendly Bottles",
    giftForHim: "🎁 Special",
    giftForHer: "💝 Exclusive",
    giftForParents: "❤️ Love",
    giftsForBabies: "🍼 Safe",
    forCouple: "💑 Romantic",
    premiumLuxuryGiftHampers: "🎁 Luxury",
    chocolatesFlowers: "🍫🌹 Romantic",
    loveMug: "Love Mug",
    magicMug: "Magic Mug",
    bestSeller: "Best Seller",
    romantic: "Romantic",
    premium: "Premium",
    perPiece: "per piece",
    specialDiscount: "Special Discount!",
    allCustomDesigns: "All Custom Designs",
    premiumCeramic: "Premium Ceramic Quality",
    durablePrint: "Durable Print Quality",
    heartShape: "Heart Shape Design",
    romanticTheme: "Romantic Theme",
    coupleGiftSet: "Couple Gift Set",
    colorChanging: "Color Changing",
    hotWaterReveal: "Reveals with Hot Water",
    surpriseEffect: "Surprise Effect",
    paymentMethods: "Payment Methods",
    paymentInstructions: "Payment Instructions",
    personalNumber: "Personal Number",
    trackOrder: "Track Order",
    trackingId: "Tracking ID",
    trackingPlaceholder: "e.g., #TRX123456",
    track: "Track",
    companyName: "Trynex Lifestyle",
    companyTagline: "Custom Mug & Gift Shop",
    quickLinks: "Quick Links",
    ourProducts: "Our Products",
    contactUs: "Contact Us",
    allRightsReserved: "All rights reserved.",
    checkout: "Checkout",
    customerInfo: "Customer Information",
    name: "Name",
    phone: "Phone Number",
    email: "Email (Optional)",
    district: "District",
    thana: "Thana",
    address: "Address",
    selectDistrict: "Select District",
    selectThana: "Select Thana",
    orderSummary: "Order Summary",
    total: "Total",
    placeOrder: "Place Order",
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    ready: "Ready",
    shipped: "Shipped",
    delivered: "Delivered",
  },
};

interface LanguageContextType {
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  const contextValue = {
    language,
    setLanguage,
    t: translations[language],
  };

  return createElement(LanguageContext.Provider, { value: contextValue }, children);
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}