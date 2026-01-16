# Setup Instructions - Sports Listings Integration

## Przegląd

System dodawania ogłoszeń sportowych składa się z dwóch części:

- **Frontend**: Matchdaysproject-new (Next.js + TypeScript)
- **Backend**: Marketplace-Backend (Node.js + Express + MongoDB)

## Wymagania

- Node.js 18+
- MongoDB (lokalnie lub Atlas)
- npm lub yarn

## Krok 1: Uruchomienie Backendu

```bash
# Przejdź do folderu backendu
cd C:\Users\Mateu\Desktop\Marketplace-Backend

# Zainstaluj zależności (jeśli jeszcze nie zainstalowane)
npm install

# Upewnij się, że MongoDB działa
# Jeśli używasz lokalnego MongoDB:
# mongod --dbpath C:\data\db

# Uruchom backend
npm start
```

Backend powinien uruchomić się na porcie **5000**.

## Krok 2: Uruchomienie Frontendu

```bash
# Przejdź do folderu frontendu
cd "C:\Users\Mateu\Desktop\Programowanie i projekty\Matchdaysproject-new"

# Zainstaluj zależności (jeśli jeszcze nie zainstalowane)
npm install

# Uruchom frontend w trybie deweloperskim
npm run dev
```

Frontend powinien uruchomić się na porcie **3001**.

## Krok 3: Testowanie

1. Otwórz przeglądarkę i przejdź do: `http://localhost:3001/add-listing`
2. Wypełnij formularz:
   - Wybierz kategorię (np. Jerseys)
   - Dodaj zdjęcia
   - Wypełnij szczegóły produktu
   - Ustaw cenę
3. Kliknij "Publish Listing"
4. Sprawdź konsole przeglądarki i terminala backendu

## Struktura Plików

### Backend (Marketplace-Backend)

```
models/listings/
  └── sportsListing.js          # Model MongoDB

controllers/listings/
  └── sportsListingController.js # Logika biznesowa

routes/listings/
  └── sportsListingRoutes.js     # Endpointy API

routes/
  └── index.js                   # Rejestracja routes (ZMODYFIKOWANY)
```

### Frontend (Matchdaysproject-new)

```
lib/api/
  └── listings.api.ts            # Funkcje API (NOWY PLIK)

components/add-listing/smart-steps/
  └── SmartForm.tsx              # Główny formularz (ZMODYFIKOWANY)

types/features/
  └── listing.types.ts           # Typy TypeScript

docs/
  └── API_INTEGRATION.md         # Dokumentacja (NOWY PLIK)
```

## Konfiguracja

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=MatchDays
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Backend (.env.server)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## API Endpoints

Wszystkie endpointy są dostępne pod:

- `http://localhost:5000/api/v1/sports-listings`
- `http://localhost:5000/api/sports-listings` (backward compatibility)

### Dostępne endpointy:

| Metoda | Endpoint                   | Opis              | Auth |
| ------ | -------------------------- | ----------------- | ---- |
| POST   | `/sports-listings`         | Utwórz ogłoszenie | ✅   |
| GET    | `/sports-listings`         | Pobierz wszystkie | ❌   |
| GET    | `/sports-listings/:id`     | Pobierz jedno     | ❌   |
| PUT    | `/sports-listings/:id`     | Aktualizuj        | ✅   |
| DELETE | `/sports-listings/:id`     | Usuń              | ✅   |
| POST   | `/sports-listings/:id/bid` | Licytuj           | ✅   |

## Testowanie API (Postman/cURL)

### Utworzenie ogłoszenia

```bash
curl -X POST http://localhost:5000/api/v1/sports-listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category": "jerseys",
    "categorySlug": "jerseys",
    "title": "Manchester United Home Jersey 2023/24",
    "description": "Brand new, never worn",
    "brand": "Adidas",
    "club": "Manchester United",
    "season": "2023/24",
    "size": "L",
    "condition": "excellent",
    "listingType": "buy_now",
    "price": 89.99,
    "photos": [
      {
        "id": "photo1",
        "url": "https://example.com/photo1.jpg",
        "typeHint": "front_far"
      }
    ]
  }'
```

### Pobranie wszystkich ogłoszeń

```bash
curl http://localhost:5000/api/v1/sports-listings
```

## Rozwiązywanie Problemów

### Backend nie startuje

- Sprawdź czy MongoDB działa
- Sprawdź czy port 5000 jest wolny
- Sprawdź logi w terminalu

### Frontend nie łączy się z backendem

- Sprawdź czy backend działa na porcie 5000
- Sprawdź `NEXT_PUBLIC_API_URL` w `.env.local`
- Sprawdź konsole przeglądarki (F12)

### Błędy CORS

- Backend powinien mieć skonfigurowany CORS dla `http://localhost:3001`
- Sprawdź plik `app.js` w backendzie

### Błędy autentykacji

- Upewnij się, że token JWT jest zapisany w localStorage jako `authToken`
- Sprawdź format tokenu: `Bearer <token>`

## Następne Kroki

1. ✅ **Zaimplementowano**: Podstawowe dodawanie ogłoszeń
2. 🔄 **Do zrobienia**:
   - Upload zdjęć do Supabase
   - System płatności
   - Integracja AI
   - System licytacji w czasie rzeczywistym
   - Powiadomienia email/push

## Dokumentacja

Szczegółowa dokumentacja znajduje się w:

- `docs/API_INTEGRATION.md` - Pełna dokumentacja integracji
- `types/features/listing.types.ts` - Typy TypeScript
- `models/listings/sportsListing.js` - Schema MongoDB

## Wsparcie

W razie problemów:

1. Sprawdź logi w konsoli przeglądarki (F12)
2. Sprawdź logi backendu w terminalu
3. Przeczytaj dokumentację w `docs/API_INTEGRATION.md`
4. Sprawdź czy wszystkie zależności są zainstalowane

## Status Implementacji

✅ **Ukończone**:

- Model bazy danych (SportsListing)
- Controller z pełnym CRUD
- API routes i rejestracja
- Frontend API client
- Integracja formularza z API
- Dokumentacja

🔄 **W trakcie**:

- Testowanie end-to-end
- Obsługa błędów
- Walidacja danych

📋 **Planowane**:

- Upload zdjęć
- System płatności
- AI analysis
- Real-time auctions
