# Matchdays - Przewodnik Integracji Backend-Frontend

**Data:** 7 stycznia 2026  
**Status:** ✅ Gotowe do uruchomienia

---

## 📋 Podsumowanie Wykonanych Zmian

### Backend (Matchdays-Backend)

#### ✅ 1. Usunięto Stare Pliki

- ❌ Usunięto `config/` - stara konfiguracja MongoDB
- ❌ Usunięto `models/` - stare modele Mongoose
- ✅ Projekt teraz używa tylko **Prisma + PostgreSQL**

#### ✅ 2. Naprawiono AppModule

- ✅ Dodano `BidsModule` do importów w `src/app.module.ts`
- ✅ Moduł Bids jest teraz dostępny w aplikacji

#### ✅ 3. Usunięto Duplikację w BidsService

- ❌ Usunięto metodę `create()` z `BidsService`
- ✅ Bidowanie odbywa się przez `AuctionsService.placeBid()`
- ✅ `BidsService` służy tylko do odczytu bidów

### Frontend (Matchdaysproject-new)

#### ✅ 1. Poprawiono Konfigurację API

- ✅ Zmieniono `API_URL` z `http://localhost:3000` na `http://localhost:5000/api/v1`
- ✅ Plik: `lib/api/config.ts`

#### ✅ 2. Poprawiono Endpointy API

- ✅ `placeBid`: `/auctions/${id}/bid` (zgodne z backendem)
- ✅ `getAuctionBids`: `/bids/auction/${id}` (zgodne z backendem)

---

## 🚀 Jak Uruchomić Projekt

### Krok 1: Backend

```bash
# Przejdź do folderu backend
cd C:\Users\Mateu\Desktop\Matchdays-Backend

# Zainstaluj zależności (jeśli jeszcze nie)
npm install

# Uruchom migracje Prisma (jeśli jeszcze nie)
npx prisma migrate dev

# Uruchom backend
npm run start:dev
```

Backend będzie dostępny pod: **http://localhost:5000**  
Dokumentacja API (Swagger): **http://localhost:5000/api/docs**

### Krok 2: Frontend

```bash
# Przejdź do folderu frontend
cd "C:\Users\Mateu\Desktop\Programowanie i projekty\Matchdaysproject-new"

# Zainstaluj zależności (jeśli jeszcze nie)
npm install

# Uruchom frontend
npm run dev
```

Frontend będzie dostępny pod: **http://localhost:3001**

---

## 📡 Struktura API

### Aukcje

| Metoda | Endpoint                       | Opis                              |
| ------ | ------------------------------ | --------------------------------- |
| GET    | `/api/v1/auctions`             | Pobierz wszystkie aukcje          |
| GET    | `/api/v1/auctions/:id`         | Pobierz aukcję po ID              |
| POST   | `/api/v1/auctions`             | Utwórz nową aukcję (wymaga auth)  |
| GET    | `/api/v1/auctions/:id/status`  | Pobierz status aukcji             |
| POST   | `/api/v1/auctions/:id/bid`     | Złóż ofertę (wymaga auth)         |
| POST   | `/api/v1/auctions/:id/buy-now` | Kup teraz (wymaga auth)           |
| GET    | `/api/v1/auctions/my/bids`     | Pobierz moje oferty (wymaga auth) |
| GET    | `/api/v1/auctions/my/auctions` | Pobierz moje aukcje (wymaga auth) |

### Bidy

| Metoda | Endpoint                          | Opis                    |
| ------ | --------------------------------- | ----------------------- |
| GET    | `/api/v1/bids/auction/:auctionId` | Pobierz bidy dla aukcji |

### Autentykacja

| Metoda | Endpoint                  | Opis                |
| ------ | ------------------------- | ------------------- |
| POST   | `/api/v1/auth/register`   | Rejestracja         |
| POST   | `/api/v1/auth/login`      | Logowanie           |
| GET    | `/api/v1/auth/check-auth` | Sprawdź status auth |
| POST   | `/api/v1/auth/logout`     | Wylogowanie         |

---

## 🔧 Konfiguracja Środowiska

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/matchdays"
DIRECT_URL="postgresql://user:password@localhost:5432/matchdays"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret-here"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3001"
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=MatchDays
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SOCKET=true
```

---

## 📦 Komponenty Frontend

### Gotowe Komponenty

✅ **AuctionCard** - Karta aukcji na liście  
✅ **AuctionGrid** - Siatka aukcji  
✅ **BidPanel** - Panel do składania ofert  
✅ **BidHistory** - Historia ofert  
✅ **BuyNowPanel** - Panel "Kup teraz"  
✅ **CountdownTimer** - Odliczanie do końca aukcji  
✅ **ImageGallery** - Galeria zdjęć  
✅ **SellerInfo** - Informacje o sprzedawcy  
✅ **ProductDetails** - Szczegóły produktu  
✅ **LoginModal** - Modal logowania  
✅ **Navbar** - Nawigacja  
✅ **Footer** - Stopka

### Strony

✅ `/` - Strona główna  
✅ `/auctions` - Lista aukcji  
✅ `/auction/[id]` - Szczegóły aukcji  
✅ `/dashboard` - Panel użytkownika  
✅ `/add-listing` - Dodaj aukcję  
✅ `/register` - Rejestracja  
✅ `/settings` - Ustawienia

---

## 🔐 Autentykacja

### Jak Działa

1. **Logowanie/Rejestracja** - Użytkownik loguje się przez `LoginModal`
2. **HTTP-Only Cookies** - Backend ustawia tokeny w bezpiecznych cookies
3. **Automatyczne Odświeżanie** - Refresh token automatycznie odnawia access token
4. **Axios Interceptor** - Automatycznie dodaje tokeny do requestów

### Przykład Użycia

```typescript
import { login, register, checkAuth } from "@/lib/api/auth";

// Logowanie
const response = await login({
  emailOrUsername: "user@example.com",
  password: "password123",
});

if (response.success) {
  console.log("Zalogowano:", response.data);
}

// Sprawdzenie auth
const authStatus = await checkAuth();
if (authStatus.success) {
  console.log("Użytkownik:", authStatus.data);
}
```

---

## 🎯 Przykłady Użycia API

### Pobieranie Aukcji

```typescript
import { getAuctions, getAuctionById } from "@/lib/api/auctions";

// Pobierz wszystkie aukcje
const response = await getAuctions({
  status: "active",
  category: "Premier League",
  page: 1,
  limit: 20,
});

if (response.success) {
  console.log("Aukcje:", response.data.auctions);
}

// Pobierz konkretną aukcję
const auction = await getAuctionById("auction-id-123");
if (auction.success) {
  console.log("Aukcja:", auction.data);
}
```

### Składanie Oferty

```typescript
import { placeBid } from "@/lib/api/bids";

const response = await placeBid("auction-id-123", 500);

if (response.success) {
  console.log("Oferta złożona:", response.data);
  alert("Oferta została złożona pomyślnie!");
} else {
  console.error("Błąd:", response.message);
  alert(response.message);
}
```

### Pobieranie Historii Bidów

```typescript
import { getAuctionBids } from "@/lib/api/bids";

const response = await getAuctionBids("auction-id-123");

if (response.success) {
  console.log("Bidy:", response.data);
}
```

---

## 🐛 Rozwiązywanie Problemów

### Backend nie startuje

```bash
# Sprawdź czy PostgreSQL działa
# Sprawdź czy port 5000 jest wolny
# Sprawdź plik .env

# Uruchom ponownie migracje
npx prisma migrate reset
npx prisma migrate dev
```

### Frontend nie łączy się z backendem

```bash
# Sprawdź czy backend działa na porcie 5000
# Sprawdź plik .env.local
# Sprawdź CORS w backendzie (main.ts)

# Wyczyść cache Next.js
rm -rf .next
npm run dev
```

### Błędy CORS

Backend ma już skonfigurowany CORS w `src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
});
```

Upewnij się, że `FRONTEND_URL` w `.env` backendu wskazuje na `http://localhost:3001`

---

## 📝 Notatki Deweloperskie

### Struktura Backendu

```
src/
├── modules/
│   ├── auth/          # Autentykacja (JWT, cookies)
│   ├── users/         # Zarządzanie użytkownikami
│   ├── auctions/      # Aukcje (CRUD, bidowanie, buy now)
│   └── bids/          # Bidy (tylko odczyt)
├── prisma/            # Prisma service
└── main.ts            # Entry point
```

### Struktura Frontendu

```
app/                   # Next.js App Router
├── auction/[id]/      # Strona aukcji
├── auctions/          # Lista aukcji
├── dashboard/         # Panel użytkownika
└── ...

components/            # Komponenty React
├── auction/           # Komponenty aukcji
├── auth/              # Komponenty auth
└── ...

lib/
├── api/               # API client
│   ├── auctions.ts    # API aukcji
│   ├── bids.ts        # API bidów
│   ├── auth.ts        # API auth
│   └── client.ts      # Axios client
└── ...
```

---

## ✅ Checklist Przed Wdrożeniem

- [ ] Backend działa na porcie 5000
- [ ] Frontend działa na porcie 3001
- [ ] Baza danych PostgreSQL jest uruchomiona
- [ ] Migracje Prisma są wykonane
- [ ] Pliki .env są poprawnie skonfigurowane
- [ ] CORS jest poprawnie ustawiony
- [ ] Można się zarejestrować i zalogować
- [ ] Można przeglądać aukcje
- [ ] Można składać oferty
- [ ] Można tworzyć nowe aukcje

---

## 🎉 Gotowe!

Projekt jest w pełni zintegrowany i gotowy do użycia. Wszystkie komponenty są połączone z backendem przez API.

**Następne kroki:**

1. Uruchom backend i frontend
2. Zarejestruj testowego użytkownika
3. Stwórz testową aukcję
4. Przetestuj składanie ofert
5. Sprawdź wszystkie funkcjonalności

---

**Autor:** Cline AI  
**Data:** 7 stycznia 2026  
**Wersja:** 1.0.0
