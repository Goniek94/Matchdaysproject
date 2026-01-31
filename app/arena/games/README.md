# MatchDays Arena - Games Documentation

## 📋 Overview

MatchDays Arena to sekcja aplikacji zawierająca interaktywne gry piłkarskie. Każda gra oferuje unikalne wyzwania i nagrody dla graczy.

## 🎮 Dostępne Gry

### 1. Missing XI ⚽

**Status:** ✅ Zaimplementowana

Gra polegająca na odgadnięciu składu drużyny z historycznego meczu.

**Funkcjonalności:**

- Timer odliczający czas (180-240 sekund w zależności od trudności)
- System podpowiedzi (hints)
- Wizualizacja boiska z pozycjami graczy
- System punktacji oparty na:
  - Pozostałym czasie
  - Dokładności odpowiedzi
  - Użytych podpowiedziach
- Różne poziomy trudności (easy, medium, hard)
- Codzienne wyzwanie (daily challenge)

**Lokalizacja:**

- Strona: `/arena/games/missing-xi`
- Komponent: `app/arena/games/missing-xi/page.tsx`
- Dane: `lib/gamesData.ts`

**Jak grać:**

1. Kliknij "Start Game"
2. Wpisz nazwiska graczy (tylko nazwisko, np. "HENRY")
3. Użyj podpowiedzi jeśli potrzebujesz
4. Zgadnij wszystkich 11 graczy przed końcem czasu

**Dostępne mecze:**

- FA Cup 2022/23: Derby vs West Ham (Medium)
- UEFA Champions League Final 2005: AC Milan vs Liverpool (Hard)
- FIFA World Cup Final 2018: France vs Croatia (Easy)
- Arsenal Invincibles 2003/04 (Hard)

---

### 2. Football Bingo 🎲

**Status:** 🚧 Planowana

Gra typu bingo podczas oglądania meczu na żywo.

**Planowane funkcjonalności:**

- Karta bingo z wydarzeniami meczowymi
- Oznaczanie wydarzeń w czasie rzeczywistym
- System rzadkości wydarzeń (common, rare, legendary)
- Nagrody za ukończone linie/pełną kartę

**Wydarzenia:**

- Gol ⚽
- Żółta kartka 🟨
- Czerwona kartka 🟥
- Rzut karny 🎯
- Samobój 🤦
- Hat-trick 🎩
- Przewrotka 🚴
- VAR 📺
- Zmiana 🔄
- Rzut rożny 🚩
- Spalony 🚫
- Gol z rzutu wolnego 🎯

---

### 3. The Typer 🎯

**Status:** 🚧 Planowana

Typowanie wyników meczów z europejskich lig.

**Planowane funkcjonalności:**

- 5 meczów tygodniowo
- Typowanie dokładnego wyniku
- Jackpot za 5/5 trafień
- Ranking typerów
- Punkty za częściowe trafienia

**Mecze:**

- Premier League
- La Liga
- Bundesliga
- Ligue 1
- Serie A

---

### 4. National Leagues 🏆

**Status:** 🚧 Planowana

Rywalizacja w ligach narodowych.

**Planowane funkcjonalności:**

- Rankingi dla każdej ligi
- Ekskluzywne odznaki
- Lokalna rywalizacja
- Sezonowe nagrody

**Dostępne ligi:**

- Premier League Experts 🏴󠁧󠁢󠁥󠁮󠁧󠁿
- La Liga Masters 🇪🇸
- Bundesliga Fanatics 🇩🇪
- Serie A Tifosi 🇮🇹
- Ligue 1 Connoisseurs 🇫🇷

---

## 🏗️ Architektura

### Struktura plików:

```
app/arena/
├── page.tsx                    # Główna strona Arena
└── games/
    ├── README.md              # Ta dokumentacja
    ├── missing-xi/
    │   └── page.tsx           # Gra Missing XI
    ├── football-bingo/        # (Planowane)
    ├── the-typer/             # (Planowane)
    └── national-leagues/      # (Planowane)

lib/
└── gamesData.ts               # Dane gier, typy, funkcje pomocnicze

components/arena/              # (Planowane) Reużywalne komponenty
```

### Typy danych:

```typescript
// Missing XI
interface MissingXIMatch {
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
}

interface Player {
  id: number;
  position: string;
  number: number;
  name: string;
  x: number; // Pozycja X na boisku (0-100%)
  y: number; // Pozycja Y na boisku (0-100%)
}
```

### Funkcje pomocnicze:

```typescript
// Pobierz dzienne wyzwanie
getDailyMatch(): MissingXIMatch

// Pobierz mecz po ID
getMatchById(id: string): MissingXIMatch | undefined

// Pobierz mecze według trudności
getMatchesByDifficulty(difficulty: "easy" | "medium" | "hard"): MissingXIMatch[]

// Oblicz wynik
calculateMissingXIScore(
  timeLeft: number,
  totalTime: number,
  correctGuesses: number,
  totalPlayers: number,
  wrongGuesses: number,
  hintsUsed: number
): number
```

---

## 🎨 Design System

### Kolory:

- **Background:** `#050505`
- **Primary:** Red gradient (`from-red-500 to-orange-600`)
- **Success:** Green (`green-500`)
- **Warning:** Yellow (`yellow-500`)
- **Error:** Red (`red-500`)
- **Info:** Blue (`blue-500`)

### Komponenty:

- Framer Motion dla animacji
- Lucide React dla ikon
- Tailwind CSS dla stylizacji
- Gradient backgrounds z blur effects

---

## 🚀 Dodawanie nowych gier

### Krok 1: Stwórz strukturę danych

Dodaj typy i dane w `lib/gamesData.ts`:

```typescript
export interface NowaGra {
  id: string;
  // ... inne pola
}

export const NOWA_GRA_DATA: NowaGra[] = [
  // ... dane
];
```

### Krok 2: Stwórz komponent gry

Utwórz folder i plik: `app/arena/games/nowa-gra/page.tsx`

### Krok 3: Dodaj link w Arena

Zaktualizuj `app/arena/page.tsx`:

```typescript
const games = [
  // ...
  {
    id: 5,
    title: "Nowa Gra",
    subtitle: "Opis",
    description: "Szczegółowy opis gry",
    prize: "Nagroda",
    icon: IconComponent,
    color: "text-color-400",
    border: "border-color-500/30",
    gradient: "from-color-500/20 to-transparent",
    action: "Akcja",
    link: "/arena/games/nowa-gra",
  },
];
```

---

## 📊 System punktacji

### Missing XI:

- **Time Bonus:** `(timeLeft / totalTime) * 500`
- **Accuracy Bonus:** `(correctGuesses / totalGuesses) * 1000`
- **Completion Bonus:** `500` (za ukończenie)
- **Hint Penalty:** `hintsUsed * 50`

**Wzór:** `max(0, timeBonus + accuracyBonus + completionBonus - hintPenalty)`

---

## 🔮 Przyszłe rozszerzenia

1. **Multiplayer Mode** - Rywalizacja w czasie rzeczywistym
2. **Leaderboards** - Globalne rankingi
3. **Achievements** - System osiągnięć
4. **Daily Streaks** - Nagrody za codzienne granie
5. **Custom Matches** - Tworzenie własnych wyzwań
6. **Social Features** - Udostępnianie wyników
7. **Mobile App** - Dedykowana aplikacja mobilna
8. **API Integration** - Połączenie z backendem dla zapisywania wyników

---

## 🐛 Znane problemy

Brak znanych problemów.

---

## 📝 Changelog

### v1.0.0 (2026-01-31)

- ✅ Zaimplementowano Missing XI
- ✅ System danych gier
- ✅ Routing i nawigacja
- ✅ Dokumentacja

---

## 👥 Autorzy

Projekt stworzony jako część MatchDays Platform.

---

## 📄 Licencja

Proprietary - All rights reserved.
