// lib/mockData.ts

export type SportType =
  | "football"
  | "basketball"
  | "hockey"
  | "f1"
  | "tennis"
  | "esports";

export type CategoryType =
  | "clubs"
  | "national"
  | "collaboration"
  | "player"
  | "team"
  | "driver";

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
  sport: SportType;
  category: CategoryType;
  team?: string;
  country?: {
    name: string;
    code: string;
  };
  seller: {
    name: string;
    avatar?: string;
    rating: number;
    reviews: number;
  };
  images?: string[];
}

export const mockAuctions: Auction[] = [
  // --- FOOTBALL: CLUBS ---
  {
    id: "1",
    title: "Manchester United Home 2008",
    description:
      "Final Moscow 2008. Ronaldo #7. Match detail on chest. Mint condition.",
    price: 550,
    currency: "€",
    bids: 45,
    endTime: "2d 4h",
    image: "/images/shirts/ManUnited2008.jpg",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "football",
    category: "clubs",
    team: "Manchester United",
    country: { name: "England", code: "GB" },
    seller: { name: "Jan Kowalski", rating: 5.0, reviews: 248 },
  },
  {
    id: "5",
    title: "Juventus Home 2003",
    description:
      "Legendary Juventus home jersey from 2003. Nike authentic. Del Piero era.",
    price: 380,
    currency: "€",
    bids: 23,
    endTime: "1h 20m",
    image: "/images/shirts/s-l1600.webp",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "football",
    category: "clubs",
    team: "Juventus",
    country: { name: "Italy", code: "IT" },
    seller: { name: "TorinoVintage", rating: 4.8, reviews: 300 },
  },
  {
    id: "6",
    title: "Ajax Amsterdam Away 1995",
    description:
      "Patrick Kluivert scored the winner in this kit. Champions League winning season.",
    price: 420,
    currency: "€",
    bids: 19,
    endTime: "2h 05m",
    image: "/images/shirts/Ajax.webp",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "football",
    category: "clubs",
    team: "Ajax",
    country: { name: "Netherlands", code: "NL" },
    seller: { name: "DutchClassics", rating: 5.0, reviews: 56 },
  },
  {
    id: "7",
    title: "Barcelona Home 2010/11 Messi #10",
    description:
      "Messi scored 53 goals in this kit. Nike authentic with Champions League patches.",
    price: 890,
    currency: "€",
    bids: 156,
    endTime: "3h 15m",
    image: "/images/shirts/messi.webp",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "football",
    category: "clubs",
    team: "Barcelona",
    country: { name: "Spain", code: "ES" },
    seller: { name: "CampNouLegends", rating: 5.0, reviews: 450 },
  },
  {
    id: "10",
    title: "Real Madrid Home 2009/10 Cristiano Ronaldo",
    description:
      "Rare Home Real Madrid Jersey from the historic 2009/2010 season.",
    price: 750,
    currency: "€",
    bids: 88,
    endTime: "45m 12s",
    image: "/images/shirts/Ronaldo.webp",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "football",
    category: "clubs",
    team: "Real Madrid",
    country: { name: "Spain", code: "ES" },
    seller: { name: "Gunner_Fan", rating: 4.7, reviews: 42 },
  },
  {
    id: "11",
    title: "Napoli 1989 Maradona",
    description: "Mars sponsor. Holy grail of Italian football.",
    price: 1500,
    currency: "€",
    bids: 112,
    endTime: "1h 45m",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "football",
    category: "clubs",
    team: "Napoli",
    country: { name: "Italy", code: "IT" },
    seller: { name: "DiegoFans", rating: 5.0, reviews: 1000 },
  },

  // --- FOOTBALL: NATIONAL ---
  {
    id: "8",
    title: "France 1998 Home",
    description: "Zidane scored two headers in this. Adidas made in France.",
    price: 600,
    currency: "€",
    bids: 88,
    endTime: "25m",
    image: "/images/shirts/France.webp",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "football",
    category: "national",
    team: "France",
    country: { name: "France", code: "FR" },
    seller: { name: "ParisVintage", rating: 4.9, reviews: 210 },
  },
  {
    id: "12",
    title: "Brazil 2002 World Cup Tracksuit",
    description:
      "Full vintage tracksuit. Nike authentic player issue used during travel.",
    price: 220,
    currency: "€",
    bids: 67,
    endTime: "3d 1h",
    image: "/images/shirts/Braziltrakcsuit.webp",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "pants",
    sport: "football",
    category: "national",
    team: "Brazil",
    country: { name: "Brazil", code: "BR" },
    seller: { name: "SelecaoStore", rating: 5.0, reviews: 890 },
  },

  // --- FOOTBALL: PLAYER ---
  {
    id: "13",
    title: "Nike Total 90 Shoes – Beckham Edition",
    description:
      "Original Total 90, World Cup edition. SG studs. Worn by Beckham and Zidane.",
    price: 850,
    currency: "€",
    bids: 0,
    endTime: "1d 12h",
    image: "/images/shirts/total90.webp",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "shoes",
    sport: "football",
    category: "player",
    team: "David Beckham",
    country: { name: "England", code: "GB" },
    seller: { name: "BootsCollector", rating: 4.9, reviews: 150 },
  },

  // --- FOOTBALL: COLLABORATION ---
  {
    id: "14",
    title: "PSG x Jordan Collab Home 2019/20",
    description:
      "The iconic Jordan Brand x PSG collaboration. Limited edition.",
    price: 320,
    currency: "€",
    bids: 31,
    endTime: "6h 30m",
    image:
      "https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "football",
    category: "collaboration",
    team: "PSG",
    country: { name: "France", code: "FR" },
    seller: { name: "Bombonera", rating: 4.8, reviews: 90 },
  },

  // --- BASKETBALL: TEAM ---
  {
    id: "15",
    title: "Chicago Bulls Home Jersey 1996",
    description:
      "Champion authentic. 72-10 season. The greatest team ever assembled.",
    price: 480,
    currency: "€",
    bids: 42,
    endTime: "4h 10m",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "basketball",
    category: "team",
    team: "Chicago Bulls",
    country: { name: "USA", code: "US" },
    seller: { name: "WindyCityVintage", rating: 4.9, reviews: 180 },
  },

  // --- BASKETBALL: PLAYER ---
  {
    id: "16",
    title: "Air Jordan 11 Retro 'Bred' 2019",
    description:
      "Michael Jordan signature. Black/Red colourway. Size 10. VNDS.",
    price: 650,
    currency: "€",
    bids: 0,
    endTime: "2d 8h",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "shoes",
    sport: "basketball",
    category: "player",
    team: "Michael Jordan",
    country: { name: "USA", code: "US" },
    seller: { name: "SneakerVault", rating: 5.0, reviews: 620 },
  },

  // --- BASKETBALL: COLLABORATION ---
  {
    id: "17",
    title: "Lakers x Staple Pigeon Collab Tee",
    description:
      "Jeff Staple x Los Angeles Lakers limited collaboration. Numbered.",
    price: 180,
    currency: "€",
    bids: 9,
    endTime: "1d 3h",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    verified: true,
    rare: false,
    type: "auction",
    itemType: "shirt",
    sport: "basketball",
    category: "collaboration",
    team: "Los Angeles Lakers",
    country: { name: "USA", code: "US" },
    seller: { name: "HoopCulture", rating: 4.6, reviews: 75 },
  },

  // --- HOCKEY: CLUBS ---
  {
    id: "18",
    title: "Detroit Red Wings Home Jersey 2002",
    description: "Stanley Cup winning season. Yzerman era. CCM authentic.",
    price: 390,
    currency: "€",
    bids: 28,
    endTime: "5h 20m",
    image:
      "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "hockey",
    category: "clubs",
    team: "Detroit Red Wings",
    country: { name: "USA", code: "US" },
    seller: { name: "HockeyVault", rating: 4.8, reviews: 140 },
  },

  // --- HOCKEY: NATIONAL ---
  {
    id: "19",
    title: "Canada 2010 Olympics Gold Medal Jersey",
    description: "Crosby scored the OT winner. Team Canada authentic Reebok.",
    price: 720,
    currency: "€",
    bids: 55,
    endTime: "8h 45m",
    image:
      "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "hockey",
    category: "national",
    team: "Canada",
    country: { name: "Canada", code: "CA" },
    seller: { name: "IceCollector", rating: 5.0, reviews: 200 },
  },

  // --- HOCKEY: PLAYER ---
  {
    id: "20",
    title: "Wayne Gretzky Signed Oilers Puck",
    description: "Authenticated signature on official NHL puck. COA included.",
    price: 950,
    currency: "€",
    bids: 0,
    endTime: "3d 6h",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "accessory",
    sport: "hockey",
    category: "player",
    team: "Wayne Gretzky",
    country: { name: "Canada", code: "CA" },
    seller: { name: "GreatOneStore", rating: 5.0, reviews: 310 },
  },

  // --- F1: TEAM ---
  {
    id: "21",
    title: "Ferrari F1 Team Polo 2004",
    description:
      "Schumacher era. Official team polo. XL. Marlboro branding intact.",
    price: 290,
    currency: "€",
    bids: 17,
    endTime: "2h 55m",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "f1",
    category: "team",
    team: "Ferrari",
    country: { name: "Italy", code: "IT" },
    seller: { name: "ScuderiaFan", rating: 4.7, reviews: 88 },
  },

  // --- F1: DRIVER ---
  {
    id: "22",
    title: "Ayrton Senna Helmet Replica – Signed Print",
    description: "Limited edition signed lithograph. 1/500. McLaren Honda era.",
    price: 1200,
    currency: "€",
    bids: 0,
    endTime: "5d 0h",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "accessory",
    sport: "f1",
    category: "driver",
    team: "Ayrton Senna",
    country: { name: "Brazil", code: "BR" },
    seller: { name: "F1Legends", rating: 5.0, reviews: 420 },
  },

  // --- F1: COLLABORATION ---
  {
    id: "23",
    title: "Mercedes AMG x Tommy Hilfiger Jacket 2021",
    description:
      "Official collaboration between Mercedes F1 and Tommy Hilfiger. L size.",
    price: 340,
    currency: "€",
    bids: 12,
    endTime: "1d 7h",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    verified: true,
    rare: false,
    type: "auction",
    itemType: "pants",
    sport: "f1",
    category: "collaboration",
    team: "Mercedes AMG",
    country: { name: "Germany", code: "DE" },
    seller: { name: "PitLaneStyle", rating: 4.5, reviews: 55 },
  },

  // --- TENNIS: PLAYER ---
  {
    id: "24",
    title: "Roger Federer Wimbledon 2017 Nike Polo",
    description:
      "The exact polo worn by Federer during his 8th Wimbledon title. Authenticated.",
    price: 880,
    currency: "€",
    bids: 63,
    endTime: "6h 00m",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "tennis",
    category: "player",
    team: "Roger Federer",
    country: { name: "Switzerland", code: "CH" },
    seller: { name: "GrandSlamVault", rating: 5.0, reviews: 275 },
  },

  // --- TENNIS: COLLABORATION ---
  {
    id: "25",
    title: "Nike x Serena Williams 'Queen' Collection Dress",
    description: "Limited Nike x Serena collab. US Open 2018. Never worn.",
    price: 450,
    currency: "€",
    bids: 22,
    endTime: "3h 40m",
    image:
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "tennis",
    category: "collaboration",
    team: "Serena Williams",
    country: { name: "USA", code: "US" },
    seller: { name: "CourtStyle", rating: 4.8, reviews: 95 },
  },

  // --- ESPORTS: TEAM ---
  {
    id: "26",
    title: "Fnatic League of Legends Worlds 2015 Jersey",
    description:
      "Official Fnatic jersey from Worlds 2015. Player issued. Signed by team.",
    price: 260,
    currency: "€",
    bids: 34,
    endTime: "4h 15m",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    verified: true,
    rare: true,
    type: "auction",
    itemType: "shirt",
    sport: "esports",
    category: "team",
    team: "Fnatic",
    country: { name: "Sweden", code: "SE" },
    seller: { name: "EsportsVault", rating: 4.6, reviews: 60 },
  },

  // --- ESPORTS: PLAYER ---
  {
    id: "27",
    title: "s1mple Signed Mouse – NaVi Edition",
    description:
      "Logitech G Pro X Superlight signed by Oleksandr 's1mple' Kostyliev. COA.",
    price: 380,
    currency: "€",
    bids: 0,
    endTime: "2d 2h",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "accessory",
    sport: "esports",
    category: "player",
    team: "s1mple",
    country: { name: "Ukraine", code: "UA" },
    seller: { name: "FragVault", rating: 4.9, reviews: 130 },
  },

  // --- ESPORTS: COLLABORATION ---
  {
    id: "28",
    title: "Louis Vuitton x League of Legends Trophy Case",
    description:
      "The iconic LV x LoL Worlds trophy travel case. Limited print run.",
    price: 1800,
    currency: "€",
    bids: 5,
    endTime: "7d 0h",
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80",
    verified: true,
    rare: true,
    type: "buy_now",
    itemType: "accessory",
    sport: "esports",
    category: "collaboration",
    team: "Riot Games",
    country: { name: "USA", code: "US" },
    seller: { name: "LuxuryGG", rating: 5.0, reviews: 45 },
  },
];

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
