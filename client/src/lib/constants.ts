export const WHATSAPP_NUMBER = "+8801940689487";
export const COMPANY_NAME = "Trynex Lifestyle";
export const COMPANY_TAGLINE = "কাস্টম গিফট স্টোর";

export const DISTRICTS = [
  "ঢাকা",
  "চট্টগ্রাম", 
  "সিলেট",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "রংপুর",
  "ময়মনসিংহ"
];

export const PRODUCT_CATEGORIES = [
  { id: "all", name: "সব পণ্য", icon: "🛍️" },

  // Apparel Category
  { id: "apparel", name: "🎽 পোশাক-পরিচ্ছদ", icon: "🎽", isParent: true },
  { id: "t-shirts-men", name: "টি-শার্ট (পুরুষ)", parent: "apparel" },
  { id: "t-shirts-women", name: "টি-শার্ট (মহিলা)", parent: "apparel" },
  { id: "t-shirts-kids", name: "টি-শার্ট (শিশু)", parent: "apparel" },
  { id: "couple-tshirts", name: "কাপল টি-শার্ট", parent: "apparel" },
  { id: "hoodie-longsleeve", name: "হুডি ও লম্বা হাতা", parent: "apparel" },
  { id: "baby-wear", name: "শিশুর পোশাক", parent: "apparel" },
  { id: "custom-name-tees", name: "কাস্টম নাম টি", parent: "apparel" },

  // Drinkware Category
  { id: "drinkware", name: "☕ পানীয়ের সামগ্রী", icon: "☕", isParent: true },
  { id: "classic-mugs", name: "ক্লাসিক মগ", parent: "drinkware" },
  { id: "magic-mugs", name: "ম্যাজিক মগ", parent: "drinkware" },
  { id: "couple-mugs", name: "কাপল মগ", parent: "drinkware" },
  { id: "tumblers-bottles", name: "টাম্বলার ও বোতল", parent: "drinkware" },
  { id: "photo-print-mugs", name: "ফটো প্রিন্ট মগ", parent: "drinkware" },
  { id: "name-quote-mugs", name: "নাম/উক্তি মগ", parent: "drinkware" },

  // Occasion-Based Gifts
  { id: "occasion-gifts", name: "🎁 উপলক্ষ্য ভিত্তিক গিফট", icon: "🎁", isParent: true },
  { id: "birthday-gifts", name: "জন্মদিনের গিফট", parent: "occasion-gifts" },
  { id: "anniversary-gifts", name: "বার্ষিকীর গিফট", parent: "occasion-gifts" },
  { id: "valentine-gifts", name: "ভালোবাসা দিবসের গিফট", parent: "occasion-gifts" },
  { id: "wedding-gifts", name: "বিবাহের গিফট", parent: "occasion-gifts" },
  { id: "engagement-gifts", name: "বাগদানের গিফট", parent: "occasion-gifts" },
  { id: "new-baby-gifts", name: "নবজাতকের গিফট", parent: "occasion-gifts" },
  { id: "graduation-gifts", name: "স্নাতকের গিফট", parent: "occasion-gifts" },
  { id: "mothers-fathers-day", name: "মা/বাবা দিবস", parent: "occasion-gifts" },
  { id: "religious-gifts", name: "ঈদ/ক্রিসমাস/নববর্ষ", parent: "occasion-gifts" },

  // Recipient-Based
  { id: "recipient-gifts", name: "👩‍❤‍👨 ব্যক্তি ভিত্তিক", icon: "👨‍👩‍👧‍👦", isParent: true },
  { id: "gift-for-him", name: "তার জন্য গিফট", parent: "recipient-gifts" },
  { id: "gift-for-her", name: "তার জন্য গিফট", parent: "recipient-gifts" },
  { id: "gift-for-couple", name: "কাপলের জন্য গিফট", parent: "recipient-gifts" },
  { id: "gift-for-parents", name: "মা/বাবার জন্য গিফট", parent: "recipient-gifts" },
  { id: "gift-for-kids", name: "শিশুদের জন্য গিফট", parent: "recipient-gifts" },
  { id: "gift-for-friends", name: "বন্ধুদের জন্য গিফট", parent: "recipient-gifts" },
  { id: "gift-for-coworker", name: "সহকর্মীর জন্য গিফট", parent: "recipient-gifts" },

  // Theme & Surprise Gifts
  { id: "theme-gifts", name: "🎉 থিম ও সারপ্রাইজ গিফট", icon: "🎉", isParent: true },
  { id: "surprise-box", name: "সারপ্রাইজ বক্স", parent: "theme-gifts" },
  { id: "mystery-box", name: "মিস্ট্রি বক্স", parent: "theme-gifts" },
  { id: "romantic-gifts", name: "রোমান্টিক গিফট", parent: "theme-gifts" },
  { id: "funny-meme-gifts", name: "মজার/মিম গিফট", parent: "theme-gifts" },
  { id: "customized-gifts", name: "কাস্টমাইজড গিফট", parent: "theme-gifts" },
  { id: "magic-reveal-gifts", name: "ম্যাজিক রিভিল গিফট", parent: "theme-gifts" },
  { id: "3d-led-gifts", name: "3D/LED নাম গিফট", parent: "theme-gifts" },
];

export const ORDER_STATUSES = [
  { id: "pending", name: "অপেক্ষমান", color: "text-yellow-600" },
  { id: "processing", name: "প্রসেসিং", color: "text-blue-600" },
  { id: "shipped", name: "পাঠানো হয়েছে", color: "text-purple-600" },
  { id: "delivered", name: "ডেলিভার হয়েছে", color: "text-green-600" },
  { id: "cancelled", name: "বাতিল", color: "text-red-600" }
];

export const formatPrice = (price: number | string): string => {
  return `${price} ৳`;
};

export const createWhatsAppUrl = (message: string): string => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const calculateDeliveryFee = (district: string): number => {
  const dhakaDistricts = ["ঢাকা"];
  return dhakaDistricts.includes(district) ? 80 : 120;
};

export const THANAS_BY_DISTRICT: Record<string, string[]> = {
  "ঢাকা": [
    "ধানমন্ডি", "গুলশান", "বনানী", "উত্তরা", "মিরপুর", "রামনা", "তেজগাঁও", "ওয়ারী", 
    "সূত্রাপুর", "কোতোয়ালী", "শাহবাগ", "নিউমার্কেট", "হাজারীবাগ", "লালবাগ", "চকবাজার"
  ],
  "চট্টগ্রাম": [
    "কোতোয়ালী", "পাঁচলাইশ", "ডবলমুরিং", "চান্দগাঁও", "বায়েজিদ", "হালিশহর", "আগ্রাবাদ", 
    "সীতাকুণ্ড", "মীরসরাই", "সন্দ্বীপ", "বোয়ালখালী", "আনোয়ারা", "চন্দনাইশ", "সাতকানিয়া"
  ],
  "সিলেট": [
    "সিলেট সদর", "জৈন্তাপুর", "কানাইঘাট", "বিশ্বনাথ", "বালাগঞ্জ", "বেলাইছড়ি", 
    "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "গোয়াইনঘাট", "হবিগঞ্জ", "লাখাই", "নবীগঞ্জ"
  ],
  "রাজশাহী": [
    "রাজশাহী সদর", "বাগমারা", "চারঘাট", "দুর্গাপুর", "গোদাগাড়ী", "মোহনপুর", 
    "পুঠিয়া", "তানোর", "নাটোর", "সিংড়া", "বড়াইগ্রাম", "গুরুদাসপুর"
  ],
  "খুলনা": [
    "খুলনা সদর", "সোনাডাঙ্গা", "খান জাহান আলী", "কয়রা", "পাইকগাছা", "রূপসা", 
    "তেরখাদা", "বটিয়াঘাটা", "দাকোপ", "ডুমুরিয়া", "ফকিরহাট", "মোল্লাহাট"
  ],
  "বরিশাল": [
    "বরিশাল সদর", "আগৈলঝাড়া", "বাবুগঞ্জ", "বাকেরগঞ্জ", "বানারীপাড়া", "গৌরনদী", 
    "হিজলা", "মেহেন্দিগঞ্জ", "মুলাদী", "উজিরপুর", "ভোলা", "চরফ্যাশন"
  ],
  "রংপুর": [
    "রংপুর সদর", "বদরগঞ্জ", "গঙ্গাচড়া", "কাউনিয়া", "মিঠাপুকুর", "পীরগঞ্জ", 
    "পীরগাছা", "তারাগঞ্জ", "কুড়িগ্রাম", "ভুরুঙ্গামারী", "চিলমারী", "রাজারহাট"
  ],
  "ময়মনসিংহ": [
    "ময়মনসিংহ সদর", "ভালুকা", "ত্রিশাল", "মুক্তাগাছা", "নান্দাইল", "তারাকান্দা", 
    "গৌরীপুর", "গফরগাঁও", "ঈশ্বরগঞ্জ", "হালুয়াঘাট", "ফুলবাড়ীয়া", "ধোবাউড়া"
  ]
};
export const PHONE_NUMBER = "+8801940689487";
export const BKASH_NUMBER = "01747292277";
export const NAGAD_NUMBER = "01747292277";
export const FACEBOOK_PAGE = "https://www.facebook.com/profile.php?id=61576151563336";