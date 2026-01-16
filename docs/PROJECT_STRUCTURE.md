# 📁 Matchdays Frontend - Struktura Projektu

## 🎯 Cel reorganizacji

Uporządkowanie projektu w logiczne foldery tematyczne dla lepszej czytelności i łatwiejszego zarządzania kodem.

---

## 📂 Nowa Struktura

```
Matchdaysproject/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout z Navbar i Footer
│   ├── page.tsx                 # Strona główna
│   ├── about/                   # Strona About Us
│   ├── add-listing/             # Dodawanie ogłoszeń
│   ├── aitools/                 # Narzędzia AI
│   ├── arena/                   # Matchdays Arena (gry/typowanie)
│   ├── auction/[id]/            # Szczegóły aukcji
│   ├── auctions/                # Lista aukcji
│   ├── dashboards/              # Dashboard użytkownika
│   └── register/                # Rejestracja
│
├── components/                   # Komponenty React
│   ├── layout/                  # ✅ Komponenty layoutu
│   │   ├── Navbar.tsx          # Nawigacja główna
│   │   └── Footer.tsx          # Stopka
│   │
│   ├── auth/                    # ✅ Komponenty autoryzacji
│   │   └── LoginModal.tsx      # Modal logowania
│   │
│   ├── home/                    # 🏠 Komponenty strony głównej
│   │   ├── Hero.tsx            # ✅ Hero slider
│   │   ├── HotOffers.tsx       # Gorące oferty
│   │   ├── EndingSoon.tsx      # Kończące się aukcje
│   │   ├── PricingSection.tsx  # Sekcja cenowa
│   │   └── AIToolsSection.tsx  # Sekcja AI Tools
│   │
│   ├── auctions/                # 🏆 Komponenty aukcji
│   │   ├── AuctionCard.tsx     # Karta aukcji
│   │   ├── AuctionGrid.tsx     # Siatka aukcji
│   │   ├── BidHistory.tsx      # Historia licytacji
│   │   ├── BidPanel.tsx        # Panel licytacji
│   │   ├── CountdownTimer.tsx  # Timer odliczający
│   │   ├── ImageGallery.tsx    # Galeria zdjęć
│   │   ├── InfoCards.tsx       # Karty informacyjne
│   │   ├── ProductDetails.tsx  # Szczegóły produktu
│   │   └── SellerInfo.tsx      # Info o sprzedawcy
│   │
│   ├── about/                   # ℹ️ Komponenty About Us
│   │   ├── AboutUsCards.tsx    # Karty About Us
│   │   └── AboutUsSection.tsx  # Sekcja About Us
│   │
│   ├── dashboard/               # 📊 Komponenty dashboardu
│   │   ├── MyActiveBidsSection.tsx  # Aktywne licytacje
│   │   └── (więcej komponentów...)
│   │
│   └── add-listing/             # ➕ Komponenty dodawania ogłoszeń
│       ├── SmartListingForm.tsx
│       ├── manual-steps/
│       │   ├── ManualForm.tsx
│       │   ├── StepBasicInfo.tsx
│       │   ├── StepPhotos.tsx
│       │   └── StepPricing.tsx
│       └── smart-steps/
│           ├── FlowSelection.tsx
│           ├── SmartForm.tsx
│           ├── SmartFormSteps.tsx
│           ├── SmartFormSummary.tsx
│           ├── SmartFormUI.tsx
│           ├── StepAuthenticity.tsx
│           ├── StepBack.tsx
│           ├── StepCategory.tsx
│           ├── StepCondition.tsx
│           ├── StepDetails.tsx
│           ├── StepFront.tsx
│           ├── StepGallery.tsx
│           ├── StepNotes.tsx
│           ├── StepSalesStrategy.tsx
│           ├── SuccessView.tsx
│           └── types.ts
│
├── lib/                         # Biblioteki i utilities
│   ├── api/                     # ✅ API clients
│   │   ├── client.ts           # Axios client
│   │   ├── config.ts           # Konfiguracja API
│   │   ├── auth.ts             # Auth endpoints
│   │   ├── auctions.ts         # Auctions endpoints
│   │   ├── bids.ts             # Bids endpoints
│   │   ├── users.ts            # Users endpoints
│   │   └── index.ts            # Export wszystkich API
│   │
│   ├── hooks/                   # 🎣 Custom React hooks
│   │   └── (do utworzenia)
│   │
│   ├── constants/               # 📌 Stałe aplikacji
│   │   └── (do utworzenia)
│   │
│   ├── utils.ts                 # Funkcje pomocnicze
│   └── mockData.ts              # Mock data dla developmentu
│
├── types/                       # 📝 TypeScript types
│   └── index.ts                # Typy globalne
│
├── public/                      # Pliki statyczne
│   └── images/
│       └── hero-stadium.jpg
│
└── ...config files              # Pliki konfiguracyjne

```

---

## ✅ Zmiany wykonane

### 1. **Layout Components** (`components/layout/`)

- ✅ `Navbar.tsx` - Przeniesiony z `components/`
- ✅ `Footer.tsx` - Przeniesiony z `components/`
- ✅ Zaktualizowany `app/layout.tsx` z nowymi importami

### 2. **Auth Components** (`components/auth/`)

- ✅ `LoginModal.tsx` - Przeniesiony z `components/`

### 3. **Home Components** (`components/home/`)

- ✅ `Hero.tsx` - Przeniesiony z `components/`
- ⏳ `HotOffers.tsx` - Do przeniesienia
- ⏳ `EndingSoon.tsx` - Do przeniesienia
- ⏳ `PricingSection.tsx` - Do przeniesienia
- ⏳ `AIToolsSection.tsx` - Do przeniesienia

### 4. **Auction Components** (`components/auctions/`)

- ⏳ Wszystkie komponenty z `components/auction/` - Do przeniesienia
- ⏳ `AuctionCard.tsx` - Do przeniesienia
- ⏳ `AuctionGrid.tsx` - Do przeniesienia

### 5. **About Components** (`components/about/`)

- ⏳ `AboutUsCards.tsx` - Do przeniesienia
- ⏳ `AboutUsSection.tsx` - Do przeniesienia

---

## 🎯 Zasady organizacji

### 1. **Komponenty Layout**

- Globalne komponenty używane na każdej stronie
- Navbar, Footer, Sidebar itp.

### 2. **Komponenty funkcjonalne**

- Grupowane według funkcjonalności (auth, auctions, home, etc.)
- Każdy folder zawiera komponenty związane z daną funkcją

### 3. **Komponenty strony**

- Komponenty specyficzne dla konkretnej strony
- Trzymane w podfolderach odpowiadających strukturze `app/`

### 4. **Shared Components**

- Komponenty wielokrotnego użytku
- Buttons, Cards, Modals - w `components/shared/` (do utworzenia)

---

## 📋 Konwencje nazewnictwa

### Pliki komponentów

- **PascalCase**: `MyComponent.tsx`
- **Opisowe nazwy**: `UserProfileCard.tsx` zamiast `Card.tsx`

### Foldery

- **kebab-case**: `add-listing/`, `smart-steps/`
- **Opisowe nazwy**: `auction-details/` zamiast `details/`

### Importy

```typescript
// ✅ Dobre - używaj aliasów
import Navbar from "@/components/layout/Navbar";
import { authApi } from "@/lib/api";

// ❌ Złe - relatywne ścieżki
import Navbar from "../../components/layout/Navbar";
```

---

## 🔄 Następne kroki

1. ⏳ Przenieść pozostałe komponenty home
2. ⏳ Przenieść komponenty aukcji
3. ⏳ Przenieść komponenty about
4. ⏳ Utworzyć folder `components/shared/` dla komponentów wielokrotnego użytku
5. ⏳ Utworzyć folder `lib/hooks/` dla custom hooks
6. ⏳ Utworzyć folder `lib/constants/` dla stałych
7. ⏳ Zaktualizować wszystkie importy w plikach stron
8. ⏳ Usunąć stare pliki po weryfikacji

---

## 📚 Dodatkowe zasoby

### Struktura API (`lib/api/`)

- `client.ts` - Skonfigurowany axios z interceptorami
- `config.ts` - URL API, typy, helpers
- `auth.ts` - Login, register, logout, checkAuth
- `auctions.ts` - CRUD aukcji
- `bids.ts` - Licytacje
- `users.ts` - Zarządzanie użytkownikami

### Typy (`types/`)

- Globalne interfejsy TypeScript
- Typy dla API responses
- Typy dla komponentów

---

## 🎨 Style

- **Tailwind CSS** - główny framework stylów
- **Framer Motion** - animacje
- **Lucide React** - ikony

---

## 🚀 Uruchomienie projektu

```bash
# Instalacja zależności
npm install

# Development
npm run dev

# Build
npm run build

# Start production
npm start
```

---

**Ostatnia aktualizacja:** 30.12.2025
**Status:** 🔄 W trakcie reorganizacji
