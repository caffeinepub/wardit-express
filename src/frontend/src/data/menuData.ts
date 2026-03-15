export interface MenuItemLocal {
  id: string;
  name: string;
  category: string;
  price: number;
  isVeg: boolean;
  rating: number;
  prepTime: number;
  description: string;
  image: string;
}

export interface VendorLocal {
  id: string;
  name: string;
  platformNumber: string;
  gateEntry: string;
  isActive: boolean;
}

export const MOCK_VENDORS: VendorLocal[] = [
  {
    id: "v1",
    name: "Ahmedabad Junction Canteen",
    platformNumber: "1",
    gateEntry: "Gate A",
    isActive: true,
  },
  {
    id: "v2",
    name: "Rajwadi Kitchen",
    platformNumber: "2",
    gateEntry: "Gate B",
    isActive: true,
  },
  {
    id: "v3",
    name: "Dragon Noodles Stall",
    platformNumber: "3",
    gateEntry: "Gate C",
    isActive: true,
  },
  {
    id: "v4",
    name: "Platform Emergency Store",
    platformNumber: "4",
    gateEntry: "Gate D",
    isActive: true,
  },
];

export const MOCK_MENU: MenuItemLocal[] = [
  // Local Specials
  {
    id: "m1",
    name: "Gota Combo",
    category: "Local Specials",
    price: 40,
    isVeg: true,
    rating: 4.5,
    prepTime: 12,
    description: "Crispy Gujarati gota fritters with green chutney",
    image: "/assets/generated/ahmedabad-specials.dim_400x300.jpg",
  },
  {
    id: "m2",
    name: "Maskabun",
    category: "Local Specials",
    price: 30,
    isVeg: true,
    rating: 4.3,
    prepTime: 5,
    description: "Buttery bun with fresh cream — Ahmedabad classic",
    image: "/assets/generated/ahmedabad-specials.dim_400x300.jpg",
  },
  {
    id: "m3",
    name: "Fafda-Jalebi",
    category: "Local Specials",
    price: 50,
    isVeg: true,
    rating: 4.7,
    prepTime: 10,
    description: "Crunchy fafda with sweet jalebis — perfect combo",
    image: "/assets/generated/ahmedabad-specials.dim_400x300.jpg",
  },
  {
    id: "m4",
    name: "Dhokla Plate",
    category: "Local Specials",
    price: 35,
    isVeg: true,
    rating: 4.4,
    prepTime: 8,
    description: "Steamed spongy dhokla with tadka and chutney",
    image: "/assets/generated/ahmedabad-specials.dim_400x300.jpg",
  },
  // Meal Thalis
  {
    id: "m5",
    name: "Veg Thali",
    category: "Meal Thalis",
    price: 120,
    isVeg: true,
    rating: 4.6,
    prepTime: 20,
    description: "Dal, sabzi, roti, rice, papad & dessert",
    image: "/assets/generated/meal-thali.dim_400x300.jpg",
  },
  {
    id: "m6",
    name: "Non-Veg Thali",
    category: "Meal Thalis",
    price: 160,
    isVeg: false,
    rating: 4.5,
    prepTime: 25,
    description: "Chicken curry, roti, rice, salad & dessert",
    image: "/assets/generated/meal-thali.dim_400x300.jpg",
  },
  {
    id: "m7",
    name: "Jain Thali",
    category: "Meal Thalis",
    price: 130,
    isVeg: true,
    rating: 4.4,
    prepTime: 20,
    description: "Pure Jain thali — no root vegetables",
    image: "/assets/generated/meal-thali.dim_400x300.jpg",
  },
  {
    id: "m8",
    name: "Special Rajwadi Thali",
    category: "Meal Thalis",
    price: 180,
    isVeg: true,
    rating: 4.8,
    prepTime: 22,
    description: "Royal 12-item Rajasthani-style feast",
    image: "/assets/generated/meal-thali.dim_400x300.jpg",
  },
  // Chinese Stalls
  {
    id: "m9",
    name: "Veg Noodles",
    category: "Chinese Stalls",
    price: 80,
    isVeg: true,
    rating: 4.2,
    prepTime: 15,
    description: "Stir-fried noodles with fresh vegetables",
    image: "/assets/generated/chinese-food.dim_400x300.jpg",
  },
  {
    id: "m10",
    name: "Chicken Fried Rice",
    category: "Chinese Stalls",
    price: 110,
    isVeg: false,
    rating: 4.3,
    prepTime: 18,
    description: "Smoky wok-tossed rice with tender chicken",
    image: "/assets/generated/chinese-food.dim_400x300.jpg",
  },
  {
    id: "m11",
    name: "Veg Manchurian",
    category: "Chinese Stalls",
    price: 90,
    isVeg: true,
    rating: 4.1,
    prepTime: 15,
    description: "Crispy vegetable balls in spicy manchurian gravy",
    image: "/assets/generated/chinese-food.dim_400x300.jpg",
  },
  {
    id: "m12",
    name: "Spring Rolls (4 pcs)",
    category: "Chinese Stalls",
    price: 70,
    isVeg: true,
    rating: 4.0,
    prepTime: 12,
    description: "Golden crispy rolls stuffed with spiced veggies",
    image: "/assets/generated/chinese-food.dim_400x300.jpg",
  },
  // Emergency Supplies
  {
    id: "m13",
    name: "Phone Charger (Type-C)",
    category: "Emergency Supplies",
    price: 199,
    isVeg: true,
    rating: 4.5,
    prepTime: 2,
    description: "Fast charging Type-C cable, 1m",
    image: "/assets/generated/emergency-supplies.dim_400x300.jpg",
  },
  {
    id: "m14",
    name: "Earphones (Wired)",
    category: "Emergency Supplies",
    price: 149,
    isVeg: true,
    rating: 3.9,
    prepTime: 2,
    description: "Wired earphones with mic, 3.5mm jack",
    image: "/assets/generated/emergency-supplies.dim_400x300.jpg",
  },
  {
    id: "m15",
    name: "Paracetamol Strip",
    category: "Emergency Supplies",
    price: 25,
    isVeg: true,
    rating: 4.8,
    prepTime: 2,
    description: "10-tablet strip, 500mg each",
    image: "/assets/generated/emergency-supplies.dim_400x300.jpg",
  },
  {
    id: "m16",
    name: "Hand Sanitizer (50ml)",
    category: "Emergency Supplies",
    price: 30,
    isVeg: true,
    rating: 4.6,
    prepTime: 2,
    description: "70% alcohol gel sanitizer, pocket size",
    image: "/assets/generated/emergency-supplies.dim_400x300.jpg",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Items", emoji: "🍽️" },
  { id: "Local Specials", label: "Local Specials", emoji: "🌟" },
  { id: "Meal Thalis", label: "Meal Thalis", emoji: "🥗" },
  { id: "Chinese Stalls", label: "Chinese Stalls", emoji: "🍜" },
  { id: "Emergency Supplies", label: "Emergency", emoji: "🆘" },
];

export const MOCK_TRAIN = {
  trainNumber: "12009",
  trainName: "Shatabdi Express",
  from: "Mumbai Central",
  to: "Ahmedabad Junction",
  currentStation: "Vadodara Jn",
  etaADI: "2:45 PM",
  platform: "4",
  delay: "On Time",
  coachesTotal: 20,
};

export function saveMenuToLocalStorage() {
  try {
    localStorage.setItem("wardit_menu", JSON.stringify(MOCK_MENU));
    localStorage.setItem("wardit_menu_ts", Date.now().toString());
  } catch (_) {
    /* ignore */
  }
}

export function getMenuFromLocalStorage(): MenuItemLocal[] | null {
  try {
    const ts = localStorage.getItem("wardit_menu_ts");
    if (!ts) return null;
    const age = Date.now() - Number.parseInt(ts);
    if (age > 24 * 60 * 60 * 1000) return null;
    const data = localStorage.getItem("wardit_menu");
    if (!data) return null;
    return JSON.parse(data);
  } catch (_) {
    return null;
  }
}

export function savePNRHistory(pnr: string) {
  try {
    const raw = localStorage.getItem("wardit_pnr_history");
    const history: { pnr: string; ts: number }[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const filtered = history.filter(
      (h) => now - h.ts < 24 * 60 * 60 * 1000 && h.pnr !== pnr,
    );
    filtered.unshift({ pnr, ts: now });
    localStorage.setItem(
      "wardit_pnr_history",
      JSON.stringify(filtered.slice(0, 5)),
    );
  } catch (_) {
    /* ignore */
  }
}

export function getPNRHistory(): string[] {
  try {
    const raw = localStorage.getItem("wardit_pnr_history");
    if (!raw) return [];
    const history: { pnr: string; ts: number }[] = JSON.parse(raw);
    const now = Date.now();
    return history
      .filter((h) => now - h.ts < 24 * 60 * 60 * 1000)
      .map((h) => h.pnr);
  } catch (_) {
    return [];
  }
}
