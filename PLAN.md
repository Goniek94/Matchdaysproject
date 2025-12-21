# Matchdays Auction Marketplace - Plan Implementacji

## ✅ ETAP 1: Podstawowa Infrastruktura (UKOŃCZONE)

- [x] Konfiguracja Next.js 14 + TypeScript + Tailwind CSS
- [x] Typy TypeScript (types/index.ts)
- [x] Mock data (lib/mockData.ts)
- [x] Globalne style (app/globals.css)
- [x] Layout aplikacji (app/layout.tsx)

## ✅ ETAP 2: Komponenty Główne (UKOŃCZONE)

- [x] Navbar.tsx - nawigacja z search barem
- [x] Hero.tsx - sekcja hero strony głównej
- [x] AuctionCard.tsx - karta aukcji z badgami
- [x] AuctionGrid.tsx - grid aukcji (responsywny)
- [x] MyActiveBidsSection.tsx - sekcja moich aktywnych licytacji
- [x] Footer.tsx - stopka
- [x] CountdownTimer.tsx - timer z trybem urgentnym (red mode <10s)

## 📋 ETAP 3: Komponenty Aukcji - NASTĘPNY

### 3.1 Komponenty do zrobienia:

- [ ] BidPanel.tsx - panel do licytacji (czarne tło, przycisk Place Bid)
- [ ] BidHistory.tsx - historia licytacji z ZŁOTĄ zwycięską licytacją
- [ ] ImageGallery.tsx - galeria z 1 głównym + 4 thumbnails (sticky)
- [ ] SellerInfo.tsx - informacja o sprzedawcy z statystykami
- [ ] ProductDetails.tsx - szczegóły produktu

### 3.2 Routing:

- [ ] app/page.tsx - Strona główna (HOME)
- [ ] app/auction/[id]/page.tsx - Strona szczegółów aukcji

## 🎯 Fazy do Ukończenia

### FAZA A: Strona główna (HOME PAGE)

1. Przygotowaj page.tsx
2. Import wszystkich komponentów
3. Layout: Navbar → Hero → MyActiveBids → AuctionGrid → CTA → Footer

### FAZA B: Strona aukcji (AUCTION DETAIL)

1. ImageGallery - sticky po lewej stronie
2. Prawa strona:
   - CountdownTimer
   - BidPanel (czarny)
   - SellerInfo
   - BidHistory (z ZŁOTĄ pierwszą licytacją)
   - ProductDetails
   - Info Cards (shipping, authenticity, etc.)

### FAZA C: Responsywność i Animacje

- Testy na mobile/tablet
- Hover efekty
- Animacje dla timera (urgent pulse)
- Animacje dla licytacji

### FAZA D: Interakcje (opcjonalnie)

- Realne wrzucanie licytacji
- Aktualizacja timera
- Socket.io dla live updates

## Struktura Plików - Stan Aktualny

```
matchdays/
├── app/
│   ├── page.tsx (TODO)
│   ├── auction/
│   │   └── [id]/
│   │       └── page.tsx (TODO)
│   ├── layout.tsx ✅
│   └── globals.css ✅
├── components/
│   ├── Navbar.tsx ✅
│   ├── Hero.tsx ✅
│   ├── AuctionCard.tsx ✅
│   ├── AuctionGrid.tsx ✅
│   ├── MyActiveBidsSection.tsx ✅
│   ├── Footer.tsx ✅
│   └── auction/
│       ├── CountdownTimer.tsx ✅
│       ├── BidPanel.tsx (TODO)
│       ├── BidHistory.tsx (TODO)
│       ├── ImageGallery.tsx (TODO)
│       ├── SellerInfo.tsx (TODO)
│       └── ProductDetails.tsx (TODO)
├── lib/
│   └── mockData.ts ✅
├── types/
│   └── index.ts ✅
├── next.config.js ✅
├── tailwind.config.js ✅
├── postcss.config.js ✅
└── package.json ✅
```

## Uwagi do Kodowania

- Kolory: Czarny, szary, ZŁOTY (#FFD700, #D4AF37) tylko dla zwycięskiej licytacji
- Font: Inter 300/400/500/600
- Border radius: 2px
- Animacje: 300ms ease
- Brak gradientów poza złotymi dla licytacji
- Responsive: 1 col → 2 col → 3 col

## Kolejność do Zrobienia

1. ✅ Infrastruktura
2. ✅ Komponenty główne
3. → BidPanel.tsx
4. → BidHistory.tsx
5. → ImageGallery.tsx
6. → SellerInfo.tsx
7. → ProductDetails.tsx
8. → app/page.tsx (HOME)
9. → app/auction/[id]/page.tsx (DETAIL)
10. → Testing
