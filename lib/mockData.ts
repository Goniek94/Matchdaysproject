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
  type: "auction" | "buy_now";
  itemType: "shirt" | "shoes" | "pants" | "accessory";
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
    description: "Final Moscow 2008. Ronaldo #7. Match detail on chest. Mint condition.",
    price: 550, // Zmienione na realną cenę w EUR
    currency: "€",
    bids: 45,
    endTime: "2d 4h",
    image: "Matchdaysproject\public\images\shirts\ManUnited2008.jpg",
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
    title: "Nike Total 90 Shoes",
    description: "Original Total 90,  World Cup edition. SG studs. Iconic boots worn by Beckham and Zidane.",
    price: 850,
    currency: "€",
    bids: 0,
    endTime: "1d 12h",
    image: "Matchdaysproject\public\images\shirts\total90.webp",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "shoes",
    seller: { name: "BootsCollector", rating: 4.9, reviews: 150 },
    country: { name: "Germany", code: "DE" },
  },

  // --- DRESY (Pants/Tracksuits) ---
  {
    id: "3",
    title: "Brazil 2002 World Cup Tracksuit",
    description: "Full vintage tracksuit (Jacket + Pants). Nike authentic player issue used during travel.",
    price: 220,
    currency: "€",
    bids: 67,
    endTime: "3d 1h",
    image: "Matchdaysproject\public\images\shirts\Braziltrakcsuit.webp",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "pants",
    seller: { name: "SelecaoStore", rating: 5.0, reviews: 890 },
    country: { name: "Brazil", code: "BR" },
  },

  // --- AKCESORIA (Accessories) ---
  {
    id: "4",
    title: "Arsenal 'Double' Scarf 1998",
    description: "Commemorative scarf from the historic 1997/98 double winning season.",
    price: 45,
    currency: "€",
    bids: 12,
    endTime: "45m 12s",
    image: "https://images.unsplash.com/photo-1577212017184-80cc0da11395?w=800&q=80",
    verified: true,
    rare: false,
    type: "auction",
    itemType: "accessory",
    seller: { name: "Gunner_Fan", rating: 4.7, reviews: 42 },
    country: { name: "UK", code: "GB" },
  },

  // --- INNE KOSZULKI ---
  {
    id: "5",
    title: "Juventus 1997 Centenary",
    description: "Pink away shirt. Zidane era. Sony Minidisc sponsor.",
    price: 350,
    currency: "€",
    bids: 0,
    endTime: "1h 20m",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&q=80",
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
    description: "Patrick Kluivert scored the winner in this kit. Umbro masterpiece.",
    price: 420,
    currency: "€",
    bids: 19,
    endTime: "2h 05m",
    image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80",
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
    price: 1500,
    currency: "€",
    bids: 112,
    endTime: "5d",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
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
    price: 600,
    currency: "€",
    bids: 0,
    endTime: "3d",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
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
    price: 890,
    currency: "€",
    bids: 55,
    endTime: "6d",
    image: "https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    seller: { name: "Bombonera", rating: 4.8, reviews: 90 },
    country: { name: "Argentina", code: "AR" },
  },
];

// Mock bid history data
export const mockBidHistory = [
  {
    id: "1",
    username: "collector_uk",
    amount: 550,
    time: "2 minutes ago",
    isWinning: true,
  },
  {
    id: "2",
    username: "vintage_fan",
    amount: 520,
    time: "15 minutes ago",
    isWinning: false,
  },
  {
    id: "3",
    username: "jersey_hunter",
    amount: 500,
    time: "1 hour ago",
    isWinning: false,
  },
  {
    id: "4",
    username: "football_memorabilia",
    amount: 480,
    time: "3 hours ago",
    isWinning: false,
  },
  {
    id: "5",
    username: "red_devil_77",
    amount: 450,
    time: "5 hours ago",
    isWinning: false,
  },
];