// Game types and interfaces
export interface Player {
  id: number;
  position: string;
  number: number;
  name: string;
  x: number;
  y: number;
}

export interface MissingXIMatch {
  id: string;
  title: string;
  match: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  score: string;
  formation: string;
  timeLimit: number;
  hints: number;
  difficulty: "easy" | "medium" | "hard";
  positions: Player[];
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

// Historic matches database for Missing XI game
export const MISSING_XI_MATCHES: MissingXIMatch[] = [
  {
    id: "fa-cup-2023",
    title: "Missing XI",
    match: "FA Cup 2022/23",
    homeTeam: "Derby",
    awayTeam: "West Ham's XI",
    date: "30.01.2023",
    score: "0 - 2",
    formation: "4-4-2",
    timeLimit: 180,
    hints: 3,
    difficulty: "medium",
    positions: [
      { id: 1, position: "GK", number: 13, name: "AREOLA", x: 50, y: 85 },
      { id: 2, position: "LB", number: 21, name: "OGBONNA", x: 20, y: 65 },
      { id: 3, position: "CB", number: 27, name: "AGUERD", x: 40, y: 70 },
      { id: 4, position: "CB", number: 24, name: "KEHRER", x: 60, y: 70 },
      { id: 5, position: "RB", number: 2, name: "JOHNSON", x: 80, y: 65 },
      { id: 6, position: "LM", number: 33, name: "EMERSON", x: 20, y: 40 },
      { id: 7, position: "CM", number: 28, name: "SOUCEK", x: 40, y: 45 },
      { id: 8, position: "CM", number: 20, name: "BOWEN", x: 60, y: 40 },
      { id: 9, position: "RM", number: 8, name: "FORNALS", x: 80, y: 45 },
      { id: 10, position: "ST", number: 12, name: "DOWNES", x: 40, y: 20 },
      { id: 11, position: "ST", number: 9, name: "ANTONIO", x: 60, y: 15 },
    ],
  },
  {
    id: "ucl-final-2005",
    title: "Missing XI",
    match: "UEFA Champions League Final 2005",
    homeTeam: "AC Milan",
    awayTeam: "Liverpool",
    date: "25.05.2005",
    score: "3 - 3 (2-3 pen)",
    formation: "4-2-3-1",
    timeLimit: 240,
    hints: 2,
    difficulty: "hard",
    positions: [
      { id: 1, position: "GK", number: 23, name: "DUDEK", x: 50, y: 85 },
      { id: 2, position: "LB", number: 3, name: "TRAORE", x: 20, y: 65 },
      { id: 3, position: "CB", number: 23, name: "CARRAGHER", x: 40, y: 70 },
      { id: 4, position: "CB", number: 4, name: "HYYPIA", x: 60, y: 70 },
      { id: 5, position: "RB", number: 2, name: "FINNAN", x: 80, y: 65 },
      { id: 6, position: "CM", number: 14, name: "ALONSO", x: 40, y: 50 },
      { id: 7, position: "CM", number: 8, name: "GERRARD", x: 60, y: 50 },
      { id: 8, position: "LW", number: 10, name: "KEWELL", x: 20, y: 30 },
      { id: 9, position: "CAM", number: 19, name: "GARCIA", x: 50, y: 35 },
      { id: 10, position: "RW", number: 7, name: "RIISE", x: 80, y: 30 },
      { id: 11, position: "ST", number: 9, name: "BAROS", x: 50, y: 15 },
    ],
  },
  {
    id: "world-cup-2018-final",
    title: "Missing XI",
    match: "FIFA World Cup Final 2018",
    homeTeam: "France",
    awayTeam: "Croatia",
    date: "15.07.2018",
    score: "4 - 2",
    formation: "4-2-3-1",
    timeLimit: 180,
    hints: 3,
    difficulty: "easy",
    positions: [
      { id: 1, position: "GK", number: 1, name: "LLORIS", x: 50, y: 85 },
      { id: 2, position: "LB", number: 21, name: "HERNANDEZ", x: 20, y: 65 },
      { id: 3, position: "CB", number: 4, name: "VARANE", x: 40, y: 70 },
      { id: 4, position: "CB", number: 5, name: "UMTITI", x: 60, y: 70 },
      { id: 5, position: "RB", number: 2, name: "PAVARD", x: 80, y: 65 },
      { id: 6, position: "CDM", number: 6, name: "POGBA", x: 40, y: 50 },
      { id: 7, position: "CDM", number: 13, name: "KANTE", x: 60, y: 50 },
      { id: 8, position: "LW", number: 10, name: "MBAPPE", x: 20, y: 30 },
      { id: 9, position: "CAM", number: 7, name: "GRIEZMANN", x: 50, y: 35 },
      { id: 10, position: "RW", number: 14, name: "MATUIDI", x: 80, y: 30 },
      { id: 11, position: "ST", number: 9, name: "GIROUD", x: 50, y: 15 },
    ],
  },
  {
    id: "premier-league-invincibles",
    title: "Missing XI",
    match: "Arsenal Invincibles 2003/04",
    homeTeam: "Arsenal",
    awayTeam: "Leicester",
    date: "15.05.2004",
    score: "2 - 1",
    formation: "4-4-2",
    timeLimit: 240,
    hints: 2,
    difficulty: "hard",
    positions: [
      { id: 1, position: "GK", number: 1, name: "LEHMANN", x: 50, y: 85 },
      { id: 2, position: "LB", number: 3, name: "COLE", x: 20, y: 65 },
      { id: 3, position: "CB", number: 23, name: "CAMPBELL", x: 40, y: 70 },
      { id: 4, position: "CB", number: 28, name: "TOURE", x: 60, y: 70 },
      { id: 5, position: "RB", number: 12, name: "LAUREN", x: 80, y: 65 },
      { id: 6, position: "LM", number: 8, name: "PIRES", x: 20, y: 40 },
      { id: 7, position: "CM", number: 4, name: "VIEIRA", x: 40, y: 45 },
      { id: 8, position: "CM", number: 19, name: "GILBERTO", x: 60, y: 45 },
      { id: 9, position: "RM", number: 7, name: "LJUNGBERG", x: 80, y: 40 },
      { id: 10, position: "ST", number: 10, name: "BERGKAMP", x: 40, y: 20 },
      { id: 11, position: "ST", number: 14, name: "HENRY", x: 60, y: 15 },
    ],
  },
];

// Get random match for daily challenge
export const getDailyMatch = (): MissingXIMatch => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24,
  );
  const index = dayOfYear % MISSING_XI_MATCHES.length;
  return MISSING_XI_MATCHES[index];
};

// Get match by ID
export const getMatchById = (id: string): MissingXIMatch | undefined => {
  return MISSING_XI_MATCHES.find((match) => match.id === id);
};

// Get matches by difficulty
export const getMatchesByDifficulty = (
  difficulty: "easy" | "medium" | "hard",
): MissingXIMatch[] => {
  return MISSING_XI_MATCHES.filter((match) => match.difficulty === difficulty);
};

// Calculate score based on performance
export const calculateMissingXIScore = (
  timeLeft: number,
  totalTime: number,
  correctGuesses: number,
  totalPlayers: number,
  wrongGuesses: number,
  hintsUsed: number,
): number => {
  const timeBonus = Math.floor((timeLeft / totalTime) * 500);
  const accuracyBonus = Math.floor(
    (correctGuesses / (correctGuesses + wrongGuesses)) * 1000,
  );
  const completionBonus = correctGuesses === totalPlayers ? 500 : 0;
  const hintPenalty = hintsUsed * 50;

  return Math.max(0, timeBonus + accuracyBonus + completionBonus - hintPenalty);
};

// Football Bingo Events
export interface BingoEvent {
  id: string;
  name: string;
  icon: string;
  rarity: "common" | "rare" | "legendary";
  points: number;
}

export const BINGO_EVENTS: BingoEvent[] = [
  { id: "goal", name: "Goal", icon: "⚽", rarity: "common", points: 10 },
  {
    id: "yellow-card",
    name: "Yellow Card",
    icon: "🟨",
    rarity: "common",
    points: 5,
  },
  { id: "red-card", name: "Red Card", icon: "🟥", rarity: "rare", points: 25 },
  { id: "penalty", name: "Penalty", icon: "🎯", rarity: "rare", points: 20 },
  { id: "own-goal", name: "Own Goal", icon: "🤦", rarity: "rare", points: 30 },
  {
    id: "hat-trick",
    name: "Hat-trick",
    icon: "🎩",
    rarity: "legendary",
    points: 50,
  },
  {
    id: "bicycle-kick",
    name: "Bicycle Kick",
    icon: "🚴",
    rarity: "legendary",
    points: 100,
  },
  { id: "var", name: "VAR Check", icon: "📺", rarity: "common", points: 15 },
  {
    id: "substitution",
    name: "Substitution",
    icon: "🔄",
    rarity: "common",
    points: 5,
  },
  {
    id: "corner",
    name: "Corner Kick",
    icon: "🚩",
    rarity: "common",
    points: 3,
  },
  { id: "offside", name: "Offside", icon: "🚫", rarity: "common", points: 5 },
  {
    id: "free-kick-goal",
    name: "Free Kick Goal",
    icon: "🎯",
    rarity: "rare",
    points: 40,
  },
];

// The Typer - Match predictions
export interface TyperMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export const TYPER_WEEKLY_MATCHES: TyperMatch[] = [
  {
    id: "match-1",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    league: "Premier League",
    date: "2026-02-01T15:00:00Z",
  },
  {
    id: "match-2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    league: "La Liga",
    date: "2026-02-01T20:00:00Z",
  },
  {
    id: "match-3",
    homeTeam: "Bayern Munich",
    awayTeam: "Borussia Dortmund",
    league: "Bundesliga",
    date: "2026-02-02T17:30:00Z",
  },
  {
    id: "match-4",
    homeTeam: "PSG",
    awayTeam: "Marseille",
    league: "Ligue 1",
    date: "2026-02-02T20:45:00Z",
  },
  {
    id: "match-5",
    homeTeam: "Inter Milan",
    awayTeam: "AC Milan",
    league: "Serie A",
    date: "2026-02-03T19:00:00Z",
  },
];

// National Leagues
export interface League {
  id: string;
  name: string;
  country: string;
  flag: string;
  participants: number;
  prize: string;
}

export const NATIONAL_LEAGUES: League[] = [
  {
    id: "premier-league",
    name: "Premier League Experts",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    participants: 1247,
    prize: "Exclusive EPL Badge",
  },
  {
    id: "la-liga",
    name: "La Liga Masters",
    country: "Spain",
    flag: "🇪🇸",
    participants: 892,
    prize: "Golden Boot Trophy",
  },
  {
    id: "bundesliga",
    name: "Bundesliga Fanatics",
    country: "Germany",
    flag: "🇩🇪",
    participants: 654,
    prize: "Bundesliga Jersey",
  },
  {
    id: "serie-a",
    name: "Serie A Tifosi",
    country: "Italy",
    flag: "🇮🇹",
    participants: 743,
    prize: "Vintage Scarf",
  },
  {
    id: "ligue-1",
    name: "Ligue 1 Connoisseurs",
    country: "France",
    flag: "🇫🇷",
    participants: 521,
    prize: "PSG VIP Ticket",
  },
];
