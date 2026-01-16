# 🏗️ PLAN REFAKTORYZACJI PROJEKTU - SENIOR LEVEL

## 📋 Obecna struktura (problemy)

```
components/
├── add-listing/
│   └── smart-steps/          ❌ Zbyt głęboka hierarchia
├── auction/                  ❌ Brak spójnej organizacji
├── auth/
├── dashboard/
├── home/
├── layout/
├── settings/
├── ui/
└── [pojedyncze komponenty]   ❌ Brak kategoryzacji
```

## 🎯 Docelowa struktura (best practices)

```
src/
├── app/                      # Next.js App Router (bez zmian)
│
├── components/               # Komponenty UI
│   ├── features/            # Feature-based components
│   │   ├── listing/         # Wszystko związane z ogłoszeniami
│   │   │   ├── create/      # Tworzenie ogłoszeń
│   │   │   │   ├── steps/   # Kroki formularza
│   │   │   │   ├── forms/   # Formularze
│   │   │   │   └── index.ts # Barrel export
│   │   │   ├── view/        # Wyświetlanie ogłoszeń
│   │   │   └── index.ts
│   │   ├── auction/         # Aukcje
│   │   ├── arena/           # Arena/gry
│   │   ├── dashboard/       # Dashboard
│   │   └── auth/            # Autentykacja
│   │
│   ├── ui/                  # Reusable UI components
│   │   ├── button/
│   │   ├── card/
│   │   ├── form/
│   │   └── index.ts
│   │
│   └── layout/              # Layout components
│       ├── Navbar/
│       ├── Footer/
│       ├── Sidebar/
│       └── index.ts
│
├── lib/                     # Utilities & helpers
│   ├── hooks/              # Custom React hooks
│   │   ├── useForm.ts
│   │   ├── useAuth.ts
│   │   └── index.ts
│   ├── utils/              # Helper functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── index.ts
│   ├── api/                # API clients
│   │   ├── listings.ts
│   │   ├── auth.ts
│   │   └── index.ts
│   └── constants/          # Constants
│       ├── categories.ts
│       ├── routes.ts
│       └── index.ts
│
├── types/                   # TypeScript types
│   ├── listing.types.ts
│   ├── user.types.ts
│   ├── api.types.ts
│   └── index.ts
│
├── styles/                  # Global styles
│   ├── globals.css
│   └── themes/
│
└── config/                  # Configuration
    ├── site.config.ts
    └── env.config.ts
```

## 🔄 Plan migracji

### Faza 1: Przygotowanie struktury

1. Utworzyć nowe foldery
2. Utworzyć pliki index.ts (barrel exports)
3. Przygotować nowe pliki types

### Faza 2: Migracja komponentów

1. Przenieść komponenty listing do `features/listing/`
2. Wydzielić reusable UI do `ui/`
3. Uporządkować layout components

### Faza 3: Refaktoryzacja logiki

1. Wydzielić custom hooks
2. Utworzyć utility functions
3. Wydzielić constants

### Faza 4: TypeScript

1. Scentralizować typy
2. Dodać strict typing
3. Usunąć duplikacje typów

### Faza 5: Dokumentacja

1. Dodać README do każdego feature
2. Dodać JSDoc comments
3. Zaktualizować główny README

## 📝 Konwencje nazewnictwa

### Komponenty

- PascalCase: `ListingForm.tsx`
- Folder per component: `ListingForm/ListingForm.tsx`
- Index export: `ListingForm/index.ts`

### Hooks

- camelCase z prefixem "use": `useListingForm.ts`

### Utils

- camelCase: `formatPrice.ts`

### Types

- PascalCase z sufixem: `ListingFormData.types.ts`

### Constants

- UPPER_SNAKE_CASE: `export const MAX_PHOTOS = 15`

## 🎨 Zasady organizacji

### 1. Feature-First Organization

Grupuj według funkcjonalności, nie typu pliku:

```
✅ features/listing/create/
✅ features/listing/view/
❌ components/forms/
❌ components/cards/
```

### 2. Barrel Exports

Każdy folder ma `index.ts`:

```typescript
// features/listing/index.ts
export * from "./create";
export * from "./view";
export * from "./types";
```

### 3. Single Responsibility

Jeden komponent = jedna odpowiedzialność:

```typescript
// ✅ Dobrze
<ListingForm />
<ListingFormStep />
<ListingFormValidation />

// ❌ Źle
<ListingFormWithEverything />
```

### 4. Composition over Inheritance

```typescript
// ✅ Dobrze
<Form>
  <FormField />
  <FormButton />
</Form>;

// ❌ Źle
class ExtendedForm extends BaseForm {}
```

## 🔧 Narzędzia do użycia

1. **Path Aliases** (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/components/*": ["./components/*"],
      "@/features/*": ["./components/features/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

2. **ESLint Rules**

- import/order
- no-restricted-imports
- consistent-type-imports

3. **Prettier**

- Consistent formatting
- Import sorting

## 📊 Metryki sukcesu

- [ ] Wszystkie komponenty w odpowiednich folderach
- [ ] Wszystkie typy w `types/`
- [ ] Wszystkie utils w `lib/utils/`
- [ ] Wszystkie hooks w `lib/hooks/`
- [ ] Wszystkie constants w `lib/constants/`
- [ ] Barrel exports wszędzie
- [ ] Zero duplikacji kodu
- [ ] 100% TypeScript coverage
- [ ] Dokumentacja dla każdego feature

## 🚀 Kolejność implementacji

1. ✅ Czyszczenie (DONE)
2. 🔄 Struktura folderów (NEXT)
3. 🔄 Migracja types
4. 🔄 Migracja constants
5. 🔄 Migracja utils
6. 🔄 Migracja hooks
7. 🔄 Migracja komponentów
8. 🔄 Barrel exports
9. 🔄 Path aliases
10. 🔄 Dokumentacja

---

**Czas realizacji:** ~2-3 godziny
**Poziom trudności:** Senior
**Impact:** 🔥🔥🔥 Bardzo wysoki
