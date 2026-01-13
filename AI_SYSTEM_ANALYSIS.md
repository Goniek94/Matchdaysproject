# Matchdays - Analiza Systemu AI dla Formularzy

**Data:** 8 stycznia 2026  
**Autor:** Cline AI

---

## 📊 OBECNY STAN FORMULARZY

### ✅ Co Już Istnieje

#### 1. **Smart Form (AI-Assisted)**

- **Lokalizacja:** `components/add-listing/smart-steps/`
- **Kroki:** 10 kroków (1-8 zbieranie danych, 9-10 podsumowanie)
- **Funkcje:**
  - Wybór kategorii (Shirts, Jackets, Hoodies, Footwear)
  - Upload zdjęć (przód, tył, metki, logo, sponsor, etc.)
  - Kod produktu
  - Stan przedmiotu
  - Notatki użytkownika
  - **Symulacja AI** (obecnie hardcoded)

#### 2. **Manual Form**

- **Lokalizacja:** `components/add-listing/manual-steps/`
- **Funkcje:** Ręczne wypełnianie wszystkich pól

#### 3. **Typy Kategorii**

```typescript
- Shirts & Jerseys (6 zdjęć: front, back, neckTag, washTags, logo, sponsor)
- Jackets & Outerwear (5 zdjęć: front, back, neckTag, washTags, logo)
- Hoodies & Sweatshirts (5 zdjęć: front, back, neckTag, washTags, logo)
- Footwear (5 zdjęć: front, side, sole, insole, box)
```

---

## 🎯 WYMAGANIA SYSTEMU AI

### Zgodnie z Twoją Specyfikacją:

```
1. Upload: Zdjęcia przód/tył/metki
2. AI Scan: Rozpoznanie przedmiotu (Klub, Sezon, Gracz)
3. Weryfikacja Wstępna (Confidence Score):
   - >98%: Automat (Oznaczenie "AI Verified")
   - <98%: Kolejka do ręcznej moderacji
4. GenAI: Generowanie zdjęcia koszulki na wirtualnym modelu 3D
```

---

## 🏗️ ARCHITEKTURA SYSTEMU AI

### Warstwa 1: Image Recognition (Computer Vision)

**Technologie:**

- **OpenAI Vision API** (GPT-4 Vision)
- **Google Cloud Vision API**
- **Custom ML Model** (TensorFlow/PyTorch)

**Co Rozpoznaje:**

1. **Klub/Drużyna**

   - Logo klubu
   - Kolory
   - Wzory
   - Sponsor

2. **Sezon**

   - Styl koszulki
   - Logo producenta (Nike, Adidas, Puma)
   - Sponsor
   - Wzór

3. **Gracz** (jeśli jest)

   - Numer
   - Nazwisko
   - Font

4. **Stan/Autentyczność**
   - Metki
   - Kod produktu
   - Jakość wykonania
   - Znaki zużycia

**Output:**

```json
{
  "team": "Manchester United",
  "league": "Premier League",
  "season": "2007/08",
  "manufacturer": "Nike",
  "type": "Home",
  "player": {
    "name": "Ronaldo",
    "number": "7"
  },
  "condition": "Excellent",
  "authenticity": {
    "isAuthentic": true,
    "confidence": 0.98,
    "indicators": ["Official tags", "Correct stitching", "Valid product code"]
  },
  "confidence": 0.98
}
```

### Warstwa 2: Text Generation (LLM)

**Technologie:**

- **OpenAI GPT-4**
- **Claude 3**
- **Custom Fine-tuned Model**

**Co Generuje:**

1. **Tytuł**

   - Format: "[Team] [Season] [Type] Shirt - [Player] #[Number]"
   - Przykład: "Manchester United 2007/08 Home Shirt - Ronaldo #7"

2. **Opis**

   - Historia sezonu
   - Znaczenie koszulki
   - Stan techniczny
   - Szczegóły autentyczności

3. **Wycena**
   - Analiza rynku
   - Porównanie z podobnymi aukcjami
   - Rzadkość
   - Stan

**Output:**

```json
{
  "title": "Manchester United 2007/08 Home Shirt - Ronaldo #7",
  "description": "Authentic Manchester United home shirt from the historic 2007/08 season when the Red Devils won both the Premier League and UEFA Champions League. This iconic Nike jersey features Cristiano Ronaldo's #7 with official Premier League printing. The shirt is in excellent condition with minimal signs of wear...",
  "estimatedValue": {
    "min": 450,
    "max": 650,
    "currency": "PLN",
    "reasoning": "Based on similar auctions, player popularity, and condition"
  },
  "tags": [
    "Manchester United",
    "Ronaldo",
    "Champions League",
    "2007/08",
    "Nike",
    "Rare"
  ],
  "confidence": 0.95
}
```

### Warstwa 3: 3D Model Generation (GenAI)

**Technologie:**

- **Stable Diffusion** (ControlNet)
- **Midjourney API**
- **Custom 3D Pipeline**

**Proces:**

1. Wejście: Zdjęcie koszulki (flat lay)
2. AI generuje: Koszulka na modelu 3D/manekinie
3. Output: Profesjonalne zdjęcie produktowe

**Przykład:**

```
Input: flat_shirt.jpg (koszulka na płasko)
Output: model_wearing_shirt.jpg (koszulka na modelu)
```

---

## 🔄 PRZEPŁYW DANYCH (FLOW)

### Krok 1: Upload Zdjęć

```
User uploads:
├── Front photo (required)
├── Back photo (required)
├── Neck tag (required)
├── Wash tags (optional)
├── Logo close-up (optional)
└── Sponsor close-up (optional)
```

### Krok 2: AI Analysis

```
Backend receives images →
  ├── Image Recognition API
  │   ├── Detect team/club
  │   ├── Detect season
  │   ├── Detect player
  │   ├── Verify authenticity
  │   └── Calculate confidence score
  │
  ├── Text Generation API
  │   ├── Generate title
  │   ├── Generate description
  │   ├── Estimate value
  │   └── Generate tags
  │
  └── 3D Model Generation API
      ├── Generate model photo
      └── Return URL
```

### Krok 3: Confidence Check

```
if (confidence >= 0.98):
    status = "AI_VERIFIED"
    auto_publish = true
else if (confidence >= 0.85):
    status = "PENDING_REVIEW"
    queue_for_moderation = true
else:
    status = "MANUAL_REVIEW_REQUIRED"
    notify_moderator = true
```

### Krok 4: User Review

```
User sees:
├── AI-generated title (editable)
├── AI-generated description (editable)
├── AI-detected details (editable)
├── AI-generated 3D photo
├── Confidence score badge
└── Estimated value range
```

---

## 💻 IMPLEMENTACJA TECHNICZNA

### Backend API Endpoints

#### 1. **POST /api/v1/ai/analyze-images**

```typescript
Request:
{
  "images": {
    "front": "base64_or_url",
    "back": "base64_or_url",
    "neckTag": "base64_or_url",
    "washTags": "base64_or_url"
  },
  "category": "shirts",
  "productCode": "optional_code"
}

Response:
{
  "success": true,
  "data": {
    "recognition": {
      "team": "Manchester United",
      "season": "2007/08",
      "manufacturer": "Nike",
      "player": { "name": "Ronaldo", "number": "7" },
      "confidence": 0.98
    },
    "generated": {
      "title": "...",
      "description": "...",
      "estimatedValue": { "min": 450, "max": 650 }
    },
    "model3d": {
      "url": "https://cdn.matchdays.com/3d/abc123.jpg",
      "status": "generated"
    },
    "verificationStatus": "AI_VERIFIED",
    "needsModeration": false
  }
}
```

#### 2. **POST /api/v1/ai/generate-3d-model**

```typescript
Request:
{
  "imageUrl": "https://...",
  "category": "shirts"
}

Response:
{
  "success": true,
  "data": {
    "modelUrl": "https://cdn.matchdays.com/3d/abc123.jpg",
    "processingTime": 2.5,
    "status": "completed"
  }
}
```

#### 3. **GET /api/v1/ai/confidence-threshold**

```typescript
Response:
{
  "autoVerify": 0.98,
  "pendingReview": 0.85,
  "manualReview": 0.85
}
```

### Frontend Integration

#### SmartForm Updates

**Nowy plik:** `lib/api/ai.ts`

```typescript
export const analyzeImages = async (images: ImageData) => {
  const response = await apiClient.post("/ai/analyze-images", images);
  return response.data;
};

export const generate3DModel = async (imageUrl: string) => {
  const response = await apiClient.post("/ai/generate-3d-model", { imageUrl });
  return response.data;
};
```

**Update:** `SmartForm.tsx`

```typescript
const handleAiGeneration = async () => {
  setIsAiProcessing(true);

  try {
    // Call real AI API
    const result = await analyzeImages({
      images: data.photos,
      category: data.category,
      productCode: data.productCode,
    });

    // Update state with AI results
    setData((prev) => ({
      ...prev,
      aiGenerated: result.generated,
      confidence: result.recognition.confidence,
      verificationStatus: result.verificationStatus,
      model3dUrl: result.model3d.url,
    }));

    setStep(9);
  } catch (error) {
    console.error("AI analysis failed:", error);
    // Fallback to manual entry
  } finally {
    setIsAiProcessing(false);
  }
};
```

---

## 🎨 UI/UX IMPROVEMENTS

### 1. **Confidence Score Badge**

```tsx
{
  confidence >= 0.98 && (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
      <CheckCircle size={16} />
      <span className="font-bold">
        AI Verified {(confidence * 100).toFixed(0)}%
      </span>
    </div>
  );
}

{
  confidence < 0.98 && confidence >= 0.85 && (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
      <AlertCircle size={16} />
      <span className="font-bold">
        Pending Review {(confidence * 100).toFixed(0)}%
      </span>
    </div>
  );
}
```

### 2. **3D Model Preview**

```tsx
<div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
  {model3dUrl ? (
    <img
      src={model3dUrl}
      alt="3D Model"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin" />
      <span>Generating 3D model...</span>
    </div>
  )}
</div>
```

### 3. **AI Insights Panel**

```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
  <h3 className="font-bold text-lg mb-4">AI Insights</h3>
  <div className="space-y-3">
    <div>
      <span className="text-sm text-gray-600">Detected Team:</span>
      <span className="ml-2 font-bold">{aiData.team}</span>
    </div>
    <div>
      <span className="text-sm text-gray-600">Season:</span>
      <span className="ml-2 font-bold">{aiData.season}</span>
    </div>
    <div>
      <span className="text-sm text-gray-600">Estimated Value:</span>
      <span className="ml-2 font-bold">{aiData.estimatedValue}</span>
    </div>
  </div>
</div>
```

---

## 🔐 BEZPIECZEŃSTWO I MODERACJA

### System Moderacji

**Kolejka Moderacji:**

```typescript
interface ModerationQueue {
  id: string;
  listingId: string;
  userId: string;
  images: string[];
  aiAnalysis: AIAnalysisResult;
  confidence: number;
  status: "pending" | "approved" | "rejected";
  moderatorNotes?: string;
  createdAt: Date;
}
```

**Dashboard Moderatora:**

- Lista aukcji oczekujących na weryfikację
- Porównanie AI vs rzeczywistość
- Możliwość edycji danych AI
- Approve/Reject z notatkami

---

## 📈 METRYKI I MONITORING

### KPIs do Śledzenia:

1. **Accuracy Rate**

   - % poprawnie rozpoznanych przedmiotów
   - Porównanie AI vs moderator

2. **Confidence Distribution**

   - Ile aukcji ma >98% confidence
   - Ile wymaga moderacji

3. **Processing Time**

   - Średni czas analizy AI
   - Średni czas generowania 3D

4. **User Satisfaction**
   - % użytkowników akceptujących sugestie AI
   - % edycji danych AI

---

## 🚀 PLAN WDROŻENIA

### Faza 1: MVP (2-3 tygodnie)

- [ ] Integracja OpenAI Vision API
- [ ] Podstawowe rozpoznawanie (team, season)
- [ ] Generowanie tytułu i opisu
- [ ] Confidence score
- [ ] UI dla wyników AI

### Faza 2: Enhanced (3-4 tygodnie)

- [ ] Generowanie 3D modeli
- [ ] System moderacji
- [ ] Dashboard moderatora
- [ ] Metryki i analytics

### Faza 3: Advanced (4-6 tygodni)

- [ ] Custom ML model (fine-tuned)
- [ ] Rozpoznawanie graczy
- [ ] Wycena rynkowa (ML)
- [ ] Automatyczna publikacja (>98%)

---

## 💰 KOSZTY (Szacunkowe)

### API Costs (miesięcznie przy 1000 aukcji):

**OpenAI Vision API:**

- $0.01 per image
- 4 images per listing = $0.04
- 1000 listings = **$40/month**

**OpenAI GPT-4 (text generation):**

- $0.03 per 1K tokens
- ~500 tokens per listing = $0.015
- 1000 listings = **$15/month**

**3D Model Generation (Stable Diffusion):**

- Self-hosted: **$50-100/month** (GPU server)
- API: **$0.05 per image** = $50/month

**Total:** ~**$105-155/month** dla 1000 aukcji

---

## 🎯 REKOMENDACJE

### Co Zrobić Najpierw:

1. ✅ **Zachować obecną strukturę formularzy** - są dobrze zaprojektowane
2. ✅ **Dodać prawdziwe API AI** - zamienić symulację na prawdziwe wywołania
3. ✅ **Zaimplementować confidence score** - system weryfikacji
4. ✅ **Dodać system moderacji** - dla aukcji <98%
5. ⏳ **3D models** - można dodać później (nice to have)

### Priorytet:

1. **Image Recognition** (najważniejsze)
2. **Text Generation** (ważne)
3. **Confidence System** (ważne)
4. **Moderation Queue** (ważne)
5. **3D Models** (opcjonalne)

---

**Następny krok:** Czy chcesz, żebym zaimplementował prawdziwe API AI dla formularza?
