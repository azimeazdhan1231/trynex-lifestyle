export const COMPANY_NAME = "Trynex Lifestyle";
export const COMPANY_TAGLINE = "আপনার স্বপ্নের লাইফস্টাইল";

export const PRODUCT_CATEGORIES = [
  { id: "all", name: "সব পণ্য", icon: "🛍️" },
  { id: "gifts", name: "গিফট", icon: "🎁" },
  { id: "lifestyle", name: "লাইফস্টাইল", icon: "🌟" },
  { id: "accessories", name: "অ্যাক্সেসরিজ", icon: "👜" },
  { id: "custom", name: "কাস্টম", icon: "🎨" },
  { id: "electronics", name: "ইলেক্ট্রনিক্স", icon: "📱" },
  { id: "fashion", name: "ফ্যাশন", icon: "👗" },
  { id: "home-decor", name: "হোম ডেকোর", icon: "🏡" },
  { id: "books", name: "বই", icon: "📚" },
  { id: "sports", name: "খেলাধুলা", icon: "⚽" },
  { id: "health", name: "স্বাস্থ্য", icon: "💊" },
  { id: "beauty", name: "সৌন্দর্য", icon: "💄" },
  { id: "kids", name: "শিশুদের", icon: "🧸" },
  { id: "pets", name: "পোষা প্রাণী", icon: "🐾" },
  { id: "automotive", name: "অটোমোটিভ", icon: "🚗" }
];

export const ORDER_STATUSES = [
  { id: "pending", name: "অপেক্ষমান", color: "bg-yellow-100 text-yellow-800" },
  { id: "confirmed", name: "নিশ্চিত", color: "bg-blue-100 text-blue-800" },
  { id: "processing", name: "প্রক্রিয়াকরণ", color: "bg-purple-100 text-purple-800" },
  { id: "shipped", name: "পাঠানো হয়েছে", color: "bg-indigo-100 text-indigo-800" },
  { id: "delivered", name: "ডেলিভার হয়েছে", color: "bg-green-100 text-green-800" },
  { id: "cancelled", name: "বাতিল", color: "bg-red-100 text-red-800" }
];

export const DELIVERY_FEES = {
  dhaka: 80,
  outside: 120
};

export const DISTRICTS = [
  "ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল", 
  "রংপুর", "ময়মনসিংহ", "কুমিল্লা", "নারায়ণগঞ্জ", "গাজীপুর",
  "কক্সবাজার", "যশোর", "নোয়াখালী", "পাবনা", "দিনাজপুর",
  "বগুড়া", "ফরিদপুর", "কিশোরগঞ্জ", "নেত্রকোনা", "টাঙ্গাইল"
];

export const THANAS: Record<string, string[]> = {
  "ঢাকা": [
    "ধানমন্ডি", "গুলশান", "বনানী", "উত্তরা", "মিরপুর", "দ্বিপ পার্ক",
    "ওয়ারী", "পুরান ঢাকা", "তেজগাঁও", "মতিঝিল", "রমনা", "শাহবাগ",
    "নিউ মার্কেট", "হাতিরঝিল", "বসুন্ধরা", "বাড্ডা", "কানতাবাড়ী"
  ],
  "চট্টগ্রাম": [
    "পতেঙ্গা", "নাসিরাবাদ", "হালিশহর", "বায়েজিদ", "আগ্রাবাদ",
    "পাঁচলাইশ", "চকবাজার", "কোতোয়ালী", "ডবলমুরিং", "খুলশী"
  ],
  "সিলেট": [
    "জিন্দাবাজার", "আম্বরখানা", "দক্ষিণ সুরমা", "বন্দর বাজার",
    "কোতোয়ালী", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ"
  ],
  "রাজশাহী": [
    "বোয়ালিয়া", "রাজপাড়া", "মতিহার", "শাহমখদুম", "চাঁদনীমহল",
    "তানোর", "গোদাগাড়ী", "দুর্গাপুর", "পবা"
  ],
  "খুলনা": [
    "খালিশপুর", "দৌলতপুর", "কোতোয়ালী", "সোনাডাঙ্গা", "হামিদপুর",
    "রুপসা", "ফুলতলা", "ভাটিয়াপাড়া", "ডুমুরিয়া"
  ],
  "বরিশাল": [
    "কোতোয়ালী", "বন্দর", "চরকানাই", "কালিয়া", "বাকেরগঞ্জ",
    "মেহেন্দিগঞ্জ", "মুলাদী", "আগৈলঝাড়া", "গৌরনদী"
  ],
  "রংপুর": [
    "কোতোয়ালী", "মিঠাপুকুর", "তারাগঞ্জ", "বদরগঞ্জ", "গঙ্গাচড়া",
    "পীরগঞ্জ", "কাউনিয়া", "পীরগাছা", "তেতুলিয়া"
  ],
  "ময়মনসিংহ": [
    "কোতোয়ালী", "মুক্তাগাছা", "ফুলবাড়িয়া", "হালুয়াঘাট", "গৌরীপুর",
    "ভালুকা", "ত্রিশাল", "ধোবাউড়া", "ঈশ্বরগঞ্জ"
  ]
};

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `৳${numPrice.toFixed(0)}`;
};

export const WHATSAPP_NUMBER = "8801609916966";

export const createWhatsAppUrl = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const PAYMENT_METHODS = [
  { id: "cod", name: "ক্যাশ অন ডেলিভারি", icon: "💵" },
  { id: "bkash", name: "বিকাশ", icon: "📱" },
  { id: "nagad", name: "নগদ", icon: "💳" },
  { id: "rocket", name: "রকেট", icon: "🚀" }
];