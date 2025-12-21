// lib/mockData.ts

export interface Auction {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  bids: number;
  endTime: string;
  image: string;
  verified: boolean;
  rare: boolean;
  type: "auction" | "buy_now"; // Typ oferty (Licytacja / Kup Teraz)
  itemType: "shirt" | "shoes" | "pants" | "accessory"; // <--- NOWE TYPY PRODUKTÓW
  seller: {
    name: string;
    avatar?: string;
    rating: number;
    reviews: number;
  };
  country: {
    name: string;
    code: string;
  };
  images?: string[];
}

export const mockAuctions: Auction[] = [
  // --- KOSZULKI (Shirts) ---
  {
    id: "1",
    title: "Manchester United Home 2008",
    description:
      "Final Moscow 2008. Ronaldo #7. Match detail on chest. Mint condition.",
    price: 2450,
    currency: "zł",
    bids: 45,
    endTime: "2d 4h",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    seller: { name: "Jan Kowalski", rating: 5.0, reviews: 248 },
    country: { name: "UK", code: "GB" },
  },

  // --- BUTY (Shoes) ---
  {
    id: "2",
    title: "Adidas Predator Mania 2002",
    description:
      "Original 2002 World Cup edition. SG studs. Iconic boots worn by Beckham and Zidane.",
    price: 3500,
    currency: "zł",
    bids: 0,
    endTime: "1d 12h",
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "shoes", // <--- BUTY
    seller: { name: "BootsCollector", rating: 4.9, reviews: 150 },
    country: { name: "Germany", code: "DE" },
  },

  // --- DRESY (Pants/Tracksuits) ---
  {
    id: "3",
    title: "Brazil 2002 World Cup Tracksuit",
    description:
      "Full vintage tracksuit (Jacket + Pants). Nike authentic player issue used during travel.",
    price: 890,
    currency: "zł",
    bids: 67,
    endTime: "3d 1h",
    image:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "pants", // <--- DRESY
    seller: { name: "SelecaoStore", rating: 5.0, reviews: 890 },
    country: { name: "Brazil", code: "BR" },
  },

  // --- AKCESORIA (Accessories - Szaliki, Piłki) ---
  {
    id: "4",
    title: "Arsenal 'Double' Scarf 1998",
    description:
      "Commemorative scarf from the historic 1997/98 double winning season.",
    price: 150,
    currency: "zł",
    bids: 12,
    endTime: "45m 12s",
    image:
      "https://images.unsplash.com/photo-1577212017184-80cc0da11395?w=800&q=80",
    verified: true,
    rare: false,
    type: "auction",
    itemType: "accessory", // <--- SZALIK
    seller: { name: "Gunner_Fan", rating: 4.7, reviews: 42 },
    country: { name: "UK", code: "GB" },
  },

  // --- INNE KOSZULKI ---
  {
    id: "5",
    title: "Juventus 1997 Centenary",
    description: "Pink away shirt. Zidane era. Sony Minidisc sponsor.",
    price: 850,
    currency: "zł",
    bids: 0,
    endTime: "1h 20m",
    image:
      "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&q=80",
    verified: true,
    rare: false,
    type: "buy_now",
    itemType: "shirt",
    seller: { name: "TorinoVintage", rating: 4.8, reviews: 300 },
    country: { name: "Italy", code: "IT" },
  },
  {
    id: "6",
    title: "Ajax Amsterdam Away 1995",
    description:
      "Patrick Kluivert scored the winner in this kit. Umbro masterpiece.",
    price: 1450,
    currency: "zł",
    bids: 19,
    endTime: "2h 05m",
    image:
      "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    seller: { name: "DutchClassics", rating: 5.0, reviews: 56 },
    country: { name: "Netherlands", code: "NL" },
  },
  {
    id: "7",
    title: "Napoli 1989 Maradona",
    description: "Mars sponsor. Holy grail of Italian football.",
    price: 5600,
    currency: "zł",
    bids: 112,
    endTime: "5d",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    seller: { name: "DiegoFans", rating: 5.0, reviews: 1000 },
    country: { name: "Italy", code: "IT" },
  },
  {
    id: "8",
    title: "France 1998 Home",
    description: "Zidane scored two headers in this. Adidas made in France.",
    price: 2100,
    currency: "zł",
    bids: 0,
    endTime: "3d",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "shirt",
    seller: { name: "ParisVintage", rating: 4.9, reviews: 210 },
    country: { name: "France", code: "FR" },
  },
  {
    id: "9",
    title: "Boca Juniors 1981",
    description: "Maradona again. The stars instead of the crest.",
    price: 3400,
    currency: "zł",
    bids: 55,
    endTime: "6d",
    image:
      "https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    seller: { name: "Bombonera", rating: 4.8, reviews: 90 },
    country: { name: "Argentina", code: "AR" },
  },
];
