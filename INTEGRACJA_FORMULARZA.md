# Integracja Formularza z Backendem - Matchdays

## ✅ Co zostało zrobione

### 1. **Frontend API (listings.api.ts)**

Zaktualizowano plik `lib/api/listings.api.ts`:

- ✅ Dodano funkcję `mapFormDataToAuctionDto()` - mapuje dane z formularza SmartForm na format backendu
- ✅ Zmieniono endpoint z `/sports-listings` na `/auctions` (zgodnie z backendem NestJS)
- ✅ Zaktualizowano wszystkie funkcje API:
  - `createSportsListing()` - tworzy aukcję
  - `getSportsListings()` - pobiera listę aukcji
  - `getSportsListingById()` - pobiera pojedynczą aukcję
  - `updateSportsListing()` - aktualizuje aukcję
  - `deleteSportsListing()` - usuwa aukcję
  - `placeBid()` - składa ofertę

### 2. **Mapowanie Danych**

#### Z Frontendu (SmartFormData):

```typescript
{
  category: "Shirts",
  categorySlug: "shirt",
  title: "Manchester United Home Jersey",
  description: "Authentic jersey...",
  brand: "Adidas",
  model: "Home Kit",
  club: "Manchester United",
  season: "2023/24",
  size: "L",
  condition: "excellent",
  photos: [{id: "1", url: "https://...", typeHint: "front_far"}],
  listingType: "auction",
  startPrice: "100",
  bidStep: "5",
  duration: "7d"
}
```

#### Do Backendu (CreateAuctionDto):

```typescript
{
  title: "Manchester United Home Jersey",
  description: "Authentic jersey...",
  category: "Shirts",
  itemType: "shirt",
  listingType: "auction",
  team: "Manchester United",
  season: "2023/24",
  size: "L",
  condition: "excellent",
  manufacturer: "Adidas",
  images: ["https://..."],
  startingBid: 100,
  bidIncrement: 5,
  buyNowPrice: undefined,
  startTime: "2026-01-16T12:00:00.000Z",
  endTime: "2026-01-23T12:00:00.000Z",
  shippingCost: 0,
  shippingTime: "3-5 business days",
  shippingFrom: "Poland",
  verified: false,
  rare: false,
  featured: false
}
```

### 3. **Backend (już istniejący)**

Backend Matchdays już ma:

- ✅ `AuctionsController` - odbiera requesty na `/auctions`
- ✅ `AuctionsService` - zapisuje do bazy Prisma
- ✅ `CreateAuctionDto` - walidacja danych
- ✅ Prisma Schema - model Auction w bazie danych

## 🧪 Jak Przetestować

### Krok 1: Uruchom Backend

```bash
cd C:\Users\Mateu\Desktop\Matchdays-Backend
npm run start:dev
```

Backend powinien działać na `http://localhost:5000`

### Krok 2: Uruchom Frontend

```bash
cd C:\Users\Mateu\Desktop\Programowanie i projekty\Matchdaysproject-new
npm run dev
```

Frontend powinien działać na `http://localhost:3000`

### Krok 3: Wypełnij Formularz

1. Przejdź do `http://localhost:3000/add-listing`
2. Wybierz kategorię (np. "Shirts")
3. Wybierz tryb wypełniania (AI lub Manual)
4. Dodaj zdjęcia (minimum 1)
5. Wypełnij szczegóły produktu:
   - Title: "Test Jersey"
   - Brand: "Adidas"
   - Club: "Manchester United"
   - Season: "2023/24"
   - Size: "L"
   - Condition: "excellent"
6. Ustaw cenę:
   - Listing Type: "auction"
   - Start Price: "100"
   - Bid Step: "5"
   - Duration: "7d"
7. Kliknij "Publish Listing"

### Krok 4: Sprawdź Konsole

**W konsoli przeglądarki (F12) powinieneś zobaczyć:**

```
Creating sports listing with data: {...}
Mapped to auction DTO: {...}
```

**W konsoli backendu powinieneś zobaczyć:**

```
POST /auctions 201
Auction created successfully
```

### Krok 5: Sprawdź Bazę Danych

Możesz sprawdzić czy aukcja została dodana:

```bash
cd C:\Users\Mateu\Desktop\Matchdays-Backend
npx prisma studio
```

Otwórz tabelę `Auction` i sprawdź czy jest nowy rekord.

## 🔍 Debugowanie

### Problem: "401 Unauthorized"

**Przyczyna:** Brak tokenu autoryzacji

**Rozwiązanie:**

1. Zaloguj się w aplikacji
2. Token powinien być zapisany w `localStorage` jako `authToken`
3. Sprawdź w konsoli: `localStorage.getItem('authToken')`

### Problem: "Failed to create listing"

**Przyczyna:** Błąd walidacji lub brak wymaganych pól

**Rozwiązanie:**

1. Sprawdź konsole backendu - pokaże szczegóły błędu
2. Upewnij się że wszystkie wymagane pola są wypełnione
3. Sprawdź czy zdjęcia mają poprawne URL-e

### Problem: "Network Error"

**Przyczyna:** Backend nie działa lub zły URL

**Rozwiązanie:**

1. Sprawdź czy backend działa: `http://localhost:5000/api/v1/health`
2. Sprawdź `NEXT_PUBLIC_API_URL` w `.env.local` frontendu
3. Domyślnie powinno być: `http://localhost:5000/api/v1`

## 📊 Przepływ Danych

```
┌─────────────────┐
│  SmartForm.tsx  │ Użytkownik wypełnia formularz
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ listings.api.ts     │ mapFormDataToAuctionDto()
│ createSportsListing │ Mapuje SmartFormData -> CreateAuctionDto
└────────┬────────────┘
         │
         ▼ POST /auctions
┌──────────────────────┐
│ auctions.controller  │ @Post() create()
│ (NestJS)             │ Waliduje CreateAuctionDto
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ auctions.service     │ create(dto, sellerId)
│ (NestJS)             │ Logika biznesowa
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Prisma Client        │ prisma.auction.create()
│                      │ Zapisuje do PostgreSQL
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ PostgreSQL Database  │ Tabela: auctions
│ (Supabase)           │ Nowy rekord zapisany
└──────────────────────┘
```

## 🎯 Następne Kroki

1. **Testowanie** - Wypełnij formularz i sprawdź czy dane trafiają do bazy
2. **Wyświetlanie** - Zaimplementuj pobieranie i wyświetlanie aukcji na stronie głównej
3. **Upload zdjęć** - Zintegruj upload zdjęć do Supabase Storage
4. **Licytacja** - Przetestuj składanie ofert (bid)
5. **Buy Now** - Przetestuj natychmiastowy zakup

## 📝 Notatki

- Backend wymaga autoryzacji (JWT token) do tworzenia aukcji
- Zdjęcia muszą być już uploadowane do Supabase przed wysłaniem formularza
- Duration jest parsowany (np. "7d" = 7 dni, "24h" = 24 godziny)
- Domyślne wartości są ustawione dla brakujących pól
- Backend automatycznie ustawia status "active" lub "upcoming" w zależności od startTime
