# 📅 Przewodnik: Codzienne Zmieniające się Gry

## 🎯 Opcje Implementacji

### **Opcja 1: Prosty System (Bez Bazy Danych)** ⭐ POLECAM NA START

**Jak to działa:**

- Masz listę 30-50 zagadek w pliku `gamesData.ts`
- Każdego dnia wybierasz inną zagadkę na podstawie daty
- Używasz algorytmu: `dayOfYear % numberOfPuzzles`

**Zalety:**

- ✅ Bardzo proste
- ✅ Nie wymaga backendu
- ✅ Działa offline
- ✅ Szybkie

**Wady:**

- ❌ Ograniczona liczba zagadek
- ❌ Powtarzają się co X dni
- ❌ Trudno dodawać nowe bez deploy

**Implementacja:**

```typescript
// lib/gamesData.ts
export const getDailyMatch = (): MissingXIMatch => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const index = dayOfYear % MISSING_XI_MATCHES.length;
  return MISSING_XI_MATCHES[index];
};
```

**To już masz zaimplementowane!** 🎉

---

### **Opcja 2: API + Baza Danych** 🚀 NAJLEPSZE DŁUGOTERMINOWO

**Architektura:**

```
Frontend (Next.js) → API Route → Database (PostgreSQL/MongoDB)
```

**Struktura Bazy:**

```sql
CREATE TABLE daily_puzzles (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  game_type VARCHAR(50), -- 'missing-xi', 'tiki-taka-toe'
  puzzle_data JSONB,
  difficulty VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  puzzle_id INTEGER,
  completed BOOLEAN,
  score INTEGER,
  time_taken INTEGER,
  completed_at TIMESTAMP
);
```

**API Routes:**

```typescript
// app/api/daily-puzzle/route.ts
export async function GET(request: Request) {
  const today = new Date().toISOString().split("T")[0];

  // Sprawdź czy jest puzzle na dziś
  let puzzle = await db.query("SELECT * FROM daily_puzzles WHERE date = $1", [
    today,
  ]);

  // Jeśli nie ma, wygeneruj nowy
  if (!puzzle) {
    puzzle = await generateDailyPuzzle(today);
  }

  return Response.json(puzzle);
}
```

**Zalety:**

- ✅ Nieograniczona liczba zagadek
- ✅ Tracking użytkowników
- ✅ Rankingi globalne
- ✅ Statystyki
- ✅ Łatwe dodawanie nowych

**Wady:**

- ❌ Wymaga backendu
- ❌ Koszty hostingu
- ❌ Bardziej skomplikowane

---

### **Opcja 3: Hybrid (Supabase/Firebase)** 🔥 ZŁOTY ŚRODEK

**Używasz:**

- Supabase (darmowy tier) lub Firebase
- Gotowe API
- Realtime updates
- Authentication

**Setup Supabase:**

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Pobierz dzisiejszą zagadkę
export async function getTodaysPuzzle(gameType: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_puzzles")
    .select("*")
    .eq("date", today)
    .eq("game_type", gameType)
    .single();

  return data;
}

// Zapisz wynik użytkownika
export async function saveUserScore(
  userId: string,
  puzzleId: string,
  score: number,
) {
  const { data, error } = await supabase.from("user_scores").insert({
    user_id: userId,
    puzzle_id: puzzleId,
    score: score,
    completed_at: new Date().toISOString(),
  });

  return data;
}
```

**Zalety:**

- ✅ Łatwe w setup
- ✅ Darmowy tier wystarczający
- ✅ Gotowe API
- ✅ Authentication out-of-the-box
- ✅ Realtime

**Wady:**

- ❌ Vendor lock-in
- ❌ Limity na darmowym tierze

---

## 🎮 Rekomendowana Implementacja Krok po Kroku

### **Faza 1: Start (Już masz!)** ✅

- Używaj lokalnej listy zagadek
- Funkcja `getDailyMatch()` rotuje zagadki

### **Faza 2: Dodaj więcej zagadek** 📝

```typescript
// Dodaj 30-50 meczów do MISSING_XI_MATCHES
// Dodaj 30-50 układanek do TIKI_TAKA_TOE_PUZZLES
```

### **Faza 3: Tracking lokalny** 💾

```typescript
// Używaj localStorage do śledzenia czy user już grał dziś
export function hasPlayedToday(gameType: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  const lastPlayed = localStorage.getItem(`${gameType}_last_played`);
  return lastPlayed === today;
}

export function markAsPlayed(gameType: string) {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem(`${gameType}_last_played`, today);
}
```

### **Faza 4: Dodaj Supabase** 🚀

1. Załóż konto na supabase.com
2. Stwórz projekt
3. Stwórz tabele:

```sql
-- Tabela zagadek
create table daily_puzzles (
  id uuid default uuid_generate_v4() primary key,
  date date unique not null,
  game_type text not null,
  puzzle_data jsonb not null,
  difficulty text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela wyników
create table user_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  puzzle_id uuid references daily_puzzles,
  score integer,
  time_taken integer,
  completed_at timestamp with time zone default timezone('utc'::text, now())
);

-- Index dla szybszych zapytań
create index idx_daily_puzzles_date on daily_puzzles(date);
create index idx_user_scores_user on user_scores(user_id);
```

4. Dodaj zmienne środowiskowe:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Zainstaluj klienta:

```bash
npm install @supabase/supabase-js
```

### **Faza 5: API Routes** 🛣️

```typescript
// app/api/daily-puzzle/[gameType]/route.ts
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: Request,
  { params }: { params: { gameType: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_puzzles')
    .select('*')
    .eq('date', today)
    .eq('game_type', params.gameType)
    .single()

  if (error) {
    // Fallback do lokalnych danych
```
