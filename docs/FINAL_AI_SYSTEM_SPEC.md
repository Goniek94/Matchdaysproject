# Matchdays - Finalna Specyfikacja Systemu AI

**Data:** 8 stycznia 2026  
**Wersja:** 2.0 - FINAL

---

## 🎯 GŁÓWNA KONCEPCJA

### System Dwutorowy:

1. **Inteligentny Formularz (AI-Assisted)** - wymaga kredytów AI
2. **Ręczny Formularz (Manual)** - darmowy, bez AI

---

## 💳 SYSTEM KREDYTÓW AI

### Plany Subskrypcji:

| Plan        | Cena/miesiąc | Kredyty AI  | Inne benefity                 |
| ----------- | ------------ | ----------- | ----------------------------- |
| **Free**    | 0 zł         | 0           | Tylko ręczne dodawanie        |
| **Premium** | 29 zł        | 10 kredytów | AI + priorytet w wynikach     |
| **Pro**     | 59 zł        | 25 kredytów | AI + badge "Pro Seller"       |
| **Elite**   | 99 zł        | 50 kredytów | AI + badge "Elite" + featured |

### Koszt Kredytów:

- **1 kredyt = 1 analiza AI** (pełna: rozpoznanie + generowanie + weryfikacja)
- **Dodatkowe pakiety:**
  - 5 kredytów = 15 zł
  - 10 kredytów = 25 zł
  - 25 kredytów = 50 zł

### Co Zużywa Kredyt:

✅ **TAK (1 kredyt):**

- Pełna analiza AI zdjęć
- Generowanie tytułu i opisu
- Weryfikacja autentyczności
- Wycena przedmiotu
- (Opcjonalnie) Generowanie 3D modelu

❌ **NIE (darmowe):**

- Ręczne dodawanie ogłoszenia
- Edycja wyników AI
- Ponowna publikacja
- Zmiana ceny/czasu aukcji

---

## 📦 KATEGORIE PRZEDMIOTÓW

### Główne Kategorie:

```typescript
export const CATEGORIES = [
  {
    id: "shirts",
    name: "Koszulki i Jerseys",
    subcategories: ["Meczowe", "Treningowe", "Retro", "Repliki"],
    requiredPhotos: ["front", "back", "neckTag", "washTags", "logo", "sponsor"],
    aiFields: ["team", "season", "player", "manufacturer", "size"],
  },
  {
    id: "footwear",
    name: "Obuwie Sportowe",
    subcategories: ["Korki", "Halówki", "Buty do biegania", "Sneakersy"],
    requiredPhotos: ["front", "side", "sole", "insole", "box", "tags"],
    aiFields: ["brand", "model", "size", "condition", "colorway"],
  },
  {
    id: "pants",
    name: "Spodnie i Szorty",
    subcategories: ["Spodnie treningowe", "Spodenki meczowe", "Dresy"],
    requiredPhotos: ["front", "back", "waistTag", "logo"],
    aiFields: ["team", "season", "manufacturer", "size", "type"],
  },
  {
    id: "jackets",
    name: "Kurtki i Bluzy",
    subcategories: ["Kurtki treningowe", "Bluzy z kapturem", "Wiatrówki"],
    requiredPhotos: ["front", "back", "neckTag", "logo"],
    aiFields: ["team", "season", "manufacturer", "size", "type"],
  },
  {
    id: "accessories",
    name: "Akcesoria",
    subcategories: ["Szaliki", "Czapki", "Rękawiczki", "Torby"],
    requiredPhotos: ["front", "back", "tags"],
    aiFields: ["team", "type", "manufacturer"],
  },
  {
    id: "equipment",
    name: "Sprzęt Sportowy",
    subcategories: ["Piłki", "Ochraniacze", "Rękawice bramkarskie"],
    requiredPhotos: ["front", "details", "tags"],
    aiFields: ["brand", "model", "size", "condition"],
  },
];
```

---

## 🔄 PRZEPŁYW UŻYTKOWNIKA

### Scenariusz 1: Użytkownik MA Kredyty AI

```
1. Kliknij "Dodaj Ogłoszenie"
   ↓
2. Wybierz tryb: "Inteligentny (AI)" lub "Ręczny"
   ↓
3. [INTELIGENTNY] Wybierz kategorię przedmiotu
   ↓
4. Upload wymaganych zdjęć (zależnie od kategorii)
   ↓
5. AI analizuje zdjęcia (2-5 sekund)
   ├── Rozpoznaje: team/brand, model, sezon, rozmiar
   ├── Generuje: tytuł, opis, tagi
   ├── Weryfikuje: autentyczność (0-100%)
   └── Wycenia: zakres cenowy
   ↓
6. Użytkownik widzi wyniki AI (EDYTOWALNE)
   ├── Tytuł (można edytować)
   ├── Opis (można edytować)
   ├── Szczegóły (można edytować)
   ├── Confidence score (90%, 70%, 30%)
   └── Sugerowana cena
   ↓
7. Wybór typu sprzedaży:
   ├── Aukcja (ustaw: czas, bid początkowy, increment)
   └── Kup Teraz (ustaw: cenę)
   ↓
8. Weryfikacja autentyczności:
   ├── 90-100%: ✅ "Zweryfikowane AI" - publikuj od razu
   ├── 50-89%: ⚠️ "Potencjalny autentyk" - wymaga moderacji
   └── 0-49%: ❌ "Potencjalna podróbka" - wymaga moderacji
   ↓
9. Publikacja / Kolejka moderacji
```

### Scenariusz 2: Użytkownik NIE MA Kredytów AI

```
1. Kliknij "Dodaj Ogłoszenie"
   ↓
2. System sprawdza kredyty → BRAK
   ↓
3. Wyświetl komunikat:
   "Nie masz kredytów AI. Wybierz opcję:"
   ├── [A] Dodaj ręcznie (darmowe)
   ├── [B] Kup pakiet kredytów
   └── [C] Upgrade subskrypcji
   ↓
4. [OPCJA A] Ręczny formularz:
   ├── Wybierz kategorię
   ├── Upload zdjęć (bez analizy AI)
   ├── Wpisz tytuł (ręcznie)
   ├── Wpisz opis (ręcznie)
   ├── Wypełnij szczegóły:
   │   ├── Marka/Team
   │   ├── Model/Sezon
   │   ├── Rozmiar
   │   ├── Kolor
   │   ├── Stan
   │   └── Cena
   ├── Wybierz typ sprzedaży (Aukcja/Kup Teraz)
   └── Publikuj (bez weryfikacji AI)
   ↓
5. Ogłoszenie trafia do moderacji (brak AI verification)
```

---

## 🤖 SZCZEGÓŁY ANALIZY AI

### Co AI Rozpoznaje dla Każdej Kategorii:

#### 1. **Koszulki/Jerseys**

```json
{
  "recognition": {
    "team": "Real Madrid",
    "league": "La Liga",
    "season": "2022/23",
    "type": "Home",
    "manufacturer": "Adidas",
    "player": {
      "name": "Benzema",
      "number": "9"
    },
    "size": "L",
    "condition": "Excellent",
    "authenticity": {
      "score": 95,
      "indicators": [
        "Official Adidas tags",
        "Correct stitching pattern",
        "Valid product code",
        "Authentic La Liga patches"
      ]
    }
  },
  "generated": {
    "title": "Real Madrid 2022/23 Home Shirt - Benzema #9",
    "description": "Authentic Real Madrid home jersey from the 2022/23 season...",
    "estimatedValue": { "min": 350, "max": 500, "currency": "PLN" }
  }
}
```

#### 2. **Obuwie (Korki/Halówki)**

```json
{
  "recognition": {
    "brand": "Nike",
    "model": "Mercurial Vapor 15",
    "colorway": "Bright Crimson/White",
    "size": "42 EU / 8.5 US",
    "condition": "Good",
    "authenticity": {
      "score": 88,
      "indicators": [
        "Nike swoosh authentic",
        "Correct box and tags",
        "Valid SKU code"
      ]
    }
  },
  "generated": {
    "title": "Nike Mercurial Vapor 15 - Bright Crimson (42 EU)",
    "description": "Nike Mercurial Vapor 15 football boots in excellent condition...",
    "estimatedValue": { "min": 400, "max": 600, "currency": "PLN" }
  }
}
```

#### 3. **Spodnie/Dresy**

```json
{
  "recognition": {
    "team": "FC Barcelona",
    "type": "Training Pants",
    "season": "2023/24",
    "manufacturer": "Nike",
    "size": "M",
    "condition": "Excellent",
    "authenticity": {
      "score": 92,
      "indicators": ["Official Nike tags", "Correct FCB logo"]
    }
  },
  "generated": {
    "title": "FC Barcelona 2023/24 Training Pants - Nike (M)",
    "description": "Official FC Barcelona training pants...",
    "estimatedValue": { "min": 150, "max": 250, "currency": "PLN" }
  }
}
```

---

## 🎨 UI/UX - PRZEPŁYW EKRANÓW

### Ekran 1: Wybór Trybu

```tsx
<div className="grid grid-cols-2 gap-6">
  {/* Inteligentny (AI) */}
  <div className="border-2 border-blue-500 rounded-lg p-8">
    <Wand2 className="w-12 h-12 text-blue-500 mb-4" />
    <h3 className="text-2xl font-bold mb-2">Inteligentny (AI)</h3>
    <p className="text-gray-600 mb-4">
      AI automatycznie rozpozna przedmiot i wygeneruje ogłoszenie
    </p>

    {/* Kredyty */}
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <span className="font-bold">Twoje kredyty:</span>
        <span className="text-2xl font-bold text-blue-600">
          {userCredits} / {maxCredits}
        </span>
      </div>
      <div className="text-sm text-gray-600 mt-2">Koszt: 1 kredyt</div>
    </div>

    {userCredits > 0 ? (
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
        Użyj AI (1 kredyt)
      </button>
    ) : (
      <div>
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg mb-2"
        >
          Brak kredytów
        </button>
        <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg">
          Kup kredyty
        </button>
      </div>
    )}
  </div>

  {/* Ręczny */}
  <div className="border-2 border-gray-300 rounded-lg p-8">
    <Edit className="w-12 h-12 text-gray-600 mb-4" />
    <h3 className="text-2xl font-bold mb-2">Ręczny</h3>
    <p className="text-gray-600 mb-4">Wypełnij wszystkie pola samodzielnie</p>

    <div className="bg-green-50 p-4 rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <Check className="text-green-600" />
        <span className="font-bold">Darmowe</span>
      </div>
      <div className="text-sm text-gray-600 mt-2">Bez limitu ogłoszeń</div>
    </div>

    <button className="w-full bg-gray-800 text-white py-3 rounded-lg">
      Dodaj ręcznie
    </button>
  </div>
</div>
```

### Ekran 2: Wybór Kategorii

```tsx
<div className="grid grid-cols-3 gap-4">
  {CATEGORIES.map((category) => (
    <button
      key={category.id}
      onClick={() => selectCategory(category.id)}
      className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition"
    >
      <category.icon className="w-12 h-12 mx-auto mb-3" />
      <h4 className="font-bold text-lg">{category.name}</h4>
      <p className="text-sm text-gray-600 mt-2">
        {category.subcategories.length} podkategorii
      </p>
    </button>
  ))}
</div>
```

### Ekran 3: Wyniki AI (Edytowalne)

```tsx
<div className="space-y-6">
  {/* Confidence Score */}
  <div
    className={`p-6 rounded-lg ${
      confidence >= 90
        ? "bg-green-50 border-2 border-green-500"
        : confidence >= 50
        ? "bg-yellow-50 border-2 border-yellow-500"
        : "bg-red-50 border-2 border-red-500"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg">Weryfikacja AI</h3>
        <p className="text-sm text-gray-600">
          {confidence >= 90
            ? "✅ Zweryfikowane - możesz opublikować"
            : confidence >= 50
            ? "⚠️ Wymaga moderacji"
            : "❌ Potencjalna podróbka - wymaga moderacji"}
        </p>
      </div>
      <div className="text-4xl font-bold">{confidence}%</div>
    </div>
  </div>

  {/* Tytuł (Edytowalny) */}
  <div>
    <label className="block font-bold mb-2">
      Tytuł ogłoszenia
      <span className="text-sm text-gray-500 ml-2">
        (wygenerowany przez AI, możesz edytować)
      </span>
    </label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full border-2 border-gray-300 rounded-lg p-3"
    />
  </div>

  {/* Opis (Edytowalny) */}
  <div>
    <label className="block font-bold mb-2">
      Opis
      <span className="text-sm text-gray-500 ml-2">
        (wygenerowany przez AI, możesz edytować)
      </span>
    </label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={6}
      className="w-full border-2 border-gray-300 rounded-lg p-3"
    />
  </div>

  {/* Szczegóły (Edytowalne) */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block font-bold mb-2">Team/Marka</label>
      <input
        type="text"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        className="w-full border-2 border-gray-300 rounded-lg p-3"
      />
    </div>
    <div>
      <label className="block font-bold mb-2">Sezon/Model</label>
      <input
        type="text"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        className="w-full border-2 border-gray-300 rounded-lg p-3"
      />
    </div>
    <div>
      <label className="block font-bold mb-2">Rozmiar</label>
      <input
        type="text"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="w-full border-2 border-gray-300 rounded-lg p-3"
      />
    </div>
    <div>
      <label className="block font-bold mb-2">Kolor</label>
      <input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full border-2 border-gray-300 rounded-lg p-3"
      />
    </div>
  </div>

  {/* Sugerowana cena */}
  <div className="bg-blue-50 p-6 rounded-lg">
    <h4 className="font-bold mb-2">Sugerowana cena (AI)</h4>
    <div className="text-2xl font-bold text-blue-600">
      {estimatedValue.min} - {estimatedValue.max} PLN
    </div>
    <p className="text-sm text-gray-600 mt-2">
      Na podstawie podobnych aukcji i stanu przedmiotu
    </p>
  </div>
</div>
```

---

## 🔐 BACKEND - SYSTEM KREDYTÓW

### Model Użytkownika (Prisma Schema)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique

  // Subscription & Credits
  subscriptionTier    String  @default("free") // free, premium, pro, elite
  subscriptionExpiry  DateTime?
  aiCredits           Int     @default(0)
  aiCreditsUsed       Int     @default(0)

  // Relations
  listings  Listing[]
  creditHistory CreditHistory[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model CreditHistory {
  id        String   @id @default(uuid())

  user      User     @relation(fields: [userId], references: [id])
  userId    String

  type      String   // "purchase", "subscription", "used", "refund"
  amount    Int      // +10, -1, etc.
  balance   Int      // Balance after transaction
  reason    String?  // "AI analysis for listing XYZ"

  listingId String?  // If used for listing

  createdAt DateTime @default(now())

  @@index([userId])
  @@map("credit_history")
}
```

### API Endpoints

#### 1. **GET /api/v1/users/credits**

```typescript
// Get user's current credits
Response: {
  success: true,
  data: {
    aiCredits: 15,
    subscriptionTier: "premium",
    subscriptionExpiry: "2026-02-08T00:00:00Z"
  }
}
```

#### 2. **POST /api/v1/ai/analyze** (Zużywa 1 kredyt)

```typescript
Request: {
  images: [...],
  category: "shirts",
  productCode: "ABC123"
}

// Check credits first
if (user.aiCredits <= 0) {
  return {
    success: false,
    error: "NO_CREDITS",
    message: "Nie masz kredytów AI. Kup pakiet lub użyj ręcznego formularza."
  }
}

// Deduct credit
user.aiCredits -= 1;

// Log usage
CreditHistory.create({
  userId: user.id,
  type: "used",
  amount: -1,
  balance: user.aiCredits,
  reason: "AI analysis for new listing"
});

// Perform AI analysis...
Response: {
  success: true,
  data: { ...aiResults },
  creditsRemaining: user.aiCredits
}
```

#### 3. **POST /api/v1/credits/purchase**

```typescript
Request: {
  package: "10_credits" // 5_credits, 10_credits, 25_credits
}

Response: {
  success: true,
  data: {
    paymentUrl: "https://payment.com/...",
    amount: 25.00,
    credits: 10
  }
}
```

---

## ✅ PODSUMOWANIE - CO MUSIMY ZROBIĆ

### Priorytet 1: MUST HAVE

- [x] System kredytów AI w bazie danych
- [x] Sprawdzanie kredytów przed analizą AI
- [x] Fallback do ręcznego formularza
- [x] Rozszerzone kategorie (6 głównych)
- [x] Edycja wyników AI przez użytkownika
- [x] System weryfikacji (90%+, 50-89%, 0-49%)
- [x] Historia użycia kredytów

### Priorytet 2: SHOULD HAVE

- [ ] Zakup pakietów kredytów
- [ ] System subskrypcji (Premium/Pro/Elite)
- [ ] Dashboard moderatora
- [ ] Automatyczna publikacja (90%+)
- [ ] Kolejka moderacji (50-89%, 0-49%)

### Priorytet 3: NICE TO HAVE

- [ ] Generowanie 3D modeli
- [ ] Powiadomienia o niskim stanie kredytów
- [ ] Statystyki użycia AI
- [ ] Rabaty na pakiety kredytów

---

**Następny krok:** Czy mam zaimplementować system kredytów w backendzie i zaktualizować formularz?
