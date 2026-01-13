# Matchdays - Przewodnik Testowania Licytacji

**Data:** 7 stycznia 2026  
**Status:** ✅ Gotowe do testowania

---

## 🎯 Co Zostało Zaimplementowane

### ✅ Funkcjonalności Licytacji

1. **Wyświetlanie Aukcji**

   - Pobieranie danych aukcji z API
   - Wyświetlanie aktualnej ceny i liczby ofert
   - Odliczanie czasu do końca aukcji
   - Status aukcji (active, ended, upcoming)

2. **Składanie Ofert**

   - Panel do składania ofert z walidacją
   - Przyciski szybkich ofert (+50, +100, +250 zł)
   - Sprawdzanie minimalnej kwoty oferty
   - Wymaganie logowania przed licytacją
   - Blokowanie przycisków podczas składania oferty

3. **Historia Ofert**
   - Wyświetlanie wszystkich ofert dla aukcji
   - Oznaczanie wygrywającej oferty
   - Automatyczne odświeżanie po złożeniu oferty
   - Wyświetlanie nazwy użytkownika i czasu oferty

---

## 🚀 Jak Przetestować

### Krok 1: Uruchom Backend

```bash
cd C:\Users\Mateu\Desktop\Matchdays-Backend
npm run start:dev
```

✅ Backend powinien działać na: **http://localhost:5000**

### Krok 2: Uruchom Frontend

```bash
cd "C:\Users\Mateu\Desktop\Programowanie i projekty\Matchdaysproject-new"
npm run dev
```

✅ Frontend powinien działać na: **http://localhost:3001**

### Krok 3: Utwórz Testowego Użytkownika

1. Otwórz **http://localhost:3001**
2. Kliknij "Register" lub otwórz modal logowania
3. Zarejestruj się z danymi:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
   - Inne wymagane pola

### Krok 4: Utwórz Testową Aukcję

**Opcja A: Przez API (Swagger)**

1. Otwórz **http://localhost:5000/api/docs**
2. Zaloguj się (użyj endpointu `/auth/login`)
3. Skopiuj token z odpowiedzi
4. Kliknij "Authorize" i wklej token
5. Użyj endpointu `POST /auctions` z danymi:

```json
{
  "title": "Manchester United Home Shirt 2007/08",
  "description": "Authentic shirt from the Champions League winning season",
  "category": "Premier League",
  "itemType": "shirt",
  "listingType": "auction",
  "team": "Manchester United",
  "season": "2007/08",
  "size": "L",
  "condition": "Excellent",
  "manufacturer": "Nike",
  "images": [
    "https://via.placeholder.com/800x600/FF0000/FFFFFF?text=Man+Utd+Shirt"
  ],
  "startingBid": 500,
  "bidIncrement": 50,
  "buyNowPrice": 1500,
  "startTime": "2026-01-07T22:00:00Z",
  "endTime": "2026-01-14T22:00:00Z",
  "shippingCost": 20,
  "shippingTime": "3-5 business days",
  "shippingFrom": "Poland"
}
```

**Opcja B: Przez Frontend**

1. Zaloguj się na **http://localhost:3001**
2. Przejdź do `/add-listing`
3. Wypełnij formularz i utwórz aukcję

### Krok 5: Przetestuj Licytację

1. **Przejdź do aukcji:**

   - Otwórz **http://localhost:3001/auction/[ID_AUKCJI]**
   - Zastąp `[ID_AUKCJI]` prawdziwym ID z kroku 4

2. **Sprawdź wyświetlanie:**

   - ✅ Tytuł i opis aukcji
   - ✅ Aktualna cena (starting bid)
   - ✅ Liczba ofert (0)
   - ✅ Odliczanie czasu
   - ✅ Panel do licytacji

3. **Złóż pierwszą ofertę:**

   - Kliknij przycisk "+50 zł" (lub wpisz kwotę ręcznie)
   - Kliknij "Place Bid"
   - ✅ Powinieneś zobaczyć alert "Bid placed successfully! 🎉"
   - ✅ Strona powinna się odświeżyć
   - ✅ Aktualna cena powinna wzrosnąć
   - ✅ Liczba ofert powinna wynosić 1
   - ✅ Twoja oferta powinna pojawić się w historii z oznaczeniem "Winning"

4. **Złóż kolejną ofertę:**
   - Zaloguj się na innym koncie (lub użyj tego samego do testu)
   - Złóż wyższą ofertę
   - ✅ Poprzednia oferta nie powinna być już oznaczona jako "Winning"
   - ✅ Nowa oferta powinna być na górze listy

---

## 🧪 Scenariusze Testowe

### Test 1: Walidacja Minimalnej Kwoty

1. Wpisz kwotę niższą niż minimalna
2. Kliknij "Place Bid"
3. ✅ Powinieneś zobaczyć alert z informacją o minimalnej kwocie

### Test 2: Licytacja Bez Logowania

1. Wyloguj się
2. Spróbuj złożyć ofertę
3. ✅ Powinieneś zobaczyć alert "Please log in to place a bid"

### Test 3: Licytacja Na Zakończonej Aukcji

1. Zmień `endTime` aukcji na przeszłość (przez Swagger lub bazę danych)
2. Odśwież stronę aukcji
3. ✅ Przyciski licytacji powinny być zablokowane
4. ✅ Status powinien pokazywać "ended"

### Test 4: Szybkie Przyciski Licytacji

1. Kliknij przycisk "+50 zł"
2. ✅ Pole input powinno wypełnić się kwotą (aktualna cena + 50)
3. Kliknij przycisk "+100 zł"
4. ✅ Pole input powinno zaktualizować się do (aktualna cena + 100)

### Test 5: Historia Ofert

1. Złóż kilka ofert (z różnych kont jeśli możliwe)
2. ✅ Wszystkie oferty powinny być widoczne w historii
3. ✅ Najwyższa oferta powinna być na górze
4. ✅ Najwyższa oferta powinna mieć oznaczenie "Winning"
5. ✅ Każda oferta powinna pokazywać: username, kwotę, czas

---

## 🐛 Możliwe Problemy i Rozwiązania

### Problem: "Failed to load auction"

**Przyczyna:** Backend nie działa lub aukcja nie istnieje

**Rozwiązanie:**

```bash
# Sprawdź czy backend działa
curl http://localhost:5000/api/v1/auctions

# Sprawdź logi backendu
# Upewnij się, że aukcja o danym ID istnieje
```

### Problem: "Please log in to place a bid"

**Przyczyna:** Użytkownik nie jest zalogowany lub token wygasł

**Rozwiązanie:**

1. Zaloguj się ponownie
2. Sprawdź czy cookies są ustawione (DevTools → Application → Cookies)
3. Sprawdź czy `localStorage` zawiera dane użytkownika

### Problem: Oferta nie pojawia się w historii

**Przyczyna:** Błąd w transformacji danych lub problem z API

**Rozwiązanie:**

1. Otwórz DevTools → Console
2. Sprawdź czy są błędy
3. Sprawdź Network tab - czy request do `/bids/auction/:id` zwraca dane
4. Sprawdź format danych w odpowiedzi API

### Problem: CORS Error

**Przyczyna:** Backend nie akceptuje requestów z frontendu

**Rozwiązanie:**

1. Sprawdź `src/main.ts` w backendzie
2. Upewnij się, że CORS jest skonfigurowany:

```typescript
app.enableCors({
  origin: "http://localhost:3001",
  credentials: true,
});
```

3. Sprawdź `.env` - czy `FRONTEND_URL=http://localhost:3001`

---

## 📊 Oczekiwane Zachowanie

### Po Złożeniu Oferty:

1. ✅ Alert sukcesu
2. ✅ Strona się odświeża
3. ✅ Aktualna cena wzrasta
4. ✅ Liczba ofert wzrasta o 1
5. ✅ Nowa oferta pojawia się w historii
6. ✅ Nowa oferta jest oznaczona jako "Winning"
7. ✅ Poprzednia wygrywająca oferta traci oznaczenie "Winning"

### Podczas Składania Oferty:

1. ✅ Przycisk pokazuje "Bidding..."
2. ✅ Wszystkie przyciski są zablokowane
3. ✅ Nie można złożyć kolejnej oferty do zakończenia poprzedniej

---

## 🎉 Sukces!

Jeśli wszystkie powyższe testy przechodzą pomyślnie, licytacja działa poprawnie!

**Następne kroki:**

- Dodaj więcej aukcji testowych
- Przetestuj z wieloma użytkownikami
- Sprawdź responsywność na mobile
- Przetestuj edge cases (bardzo długie nazwy, duże kwoty, etc.)

---

**Autor:** Cline AI  
**Data:** 7 stycznia 2026  
**Wersja:** 1.0.0
