"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shirt,
  Search,
  ArrowRight,
  ArrowLeft,
  Wand2,
  History,
  PenLine,
  ScanSearch,
  Plus,
  Trash2,
  Image as ImageIcon,
  Barcode,
  Sparkles,
  Gavel,
  Tag,
  CalendarClock,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Percent,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPY DANYCH ---
type TagStatus = "modern" | "vintage" | "washed" | "cut" | null;
type VerificationStatus = "verified" | "pending_expert" | "high_risk" | null;
type ListingType = "auction" | "buy_now";

interface MandatoryPhotos {
  front: string | null;
  back: string | null;
  crest: string | null;
  tags: string | null;
}

interface FormData {
  flowType: "manual" | "ai_assist" | null;
  title: string;
  brand: string;
  team: string;
  year: string;
  size: string;
  condition: string;
  description: string;

  // Photos
  tagStatus: TagStatus;
  mandatoryPhotos: MandatoryPhotos;
  extraPhotos: string[];

  // Pricing & Strategy
  listingType: ListingType;
  price: string; // Buy Now Price or Starting Bid
  auctionDuration: string; // Days
  acceptOffers: boolean; // Negotiation
}

const INITIAL_DATA: FormData = {
  flowType: null,
  title: "",
  brand: "",
  team: "",
  year: "",
  size: "",
  condition: "excellent",
  description: "",
  tagStatus: null,
  mandatoryPhotos: { front: null, back: null, crest: null, tags: null },
  extraPhotos: [],

  // Defaults
  listingType: "auction",
  price: "",
  auctionDuration: "7",
  acceptOffers: true,
};

export default function AddListingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Description States
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  const [verificationResult, setVerificationResult] =
    useState<VerificationStatus>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const updateData = (field: keyof FormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // --- LOGIKA ZDJĘĆ ---
  const handleMandatoryUpload = (slot: keyof MandatoryPhotos) => {
    const mockUrl = `mandatory-${slot}-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      mandatoryPhotos: {
        ...prev.mandatoryPhotos,
        [slot]: mockUrl,
      },
    }));
  };

  const handleExtraUpload = () => {
    if (data.extraPhotos.length >= 20) return;
    const mockUrl = `extra-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      extraPhotos: [...prev.extraPhotos, mockUrl],
    }));
  };

  const removeExtraPhoto = (index: number) => {
    setData((prev) => ({
      ...prev,
      extraPhotos: prev.extraPhotos.filter((_, i) => i !== index),
    }));
  };

  // --- LOGIKA AI OPISU ---
  const generateDescription = () => {
    if (!aiPrompt) return;
    setIsGeneratingDesc(true);
    setTimeout(() => {
      const desc = `Authentic ${data.team || "football"} shirt by ${
        data.brand || "brand"
      }. \n\nDetails:\n- Condition: ${data.condition}\n- Size: ${
        data.size
      }\n\nAdditional info: ${aiPrompt}\n\nIncludes all original tags shown in photos. Perfect for collectors.`;
      updateData("description", desc);
      setIsGeneratingDesc(false);
      setShowAiInput(false);
    }, 1500);
  };

  // --- WALIDACJA ---
  const mandatoryFilled = Object.values(data.mandatoryPhotos).every(
    (val) => val !== null
  );
  const totalPhotosCount =
    (data.mandatoryPhotos.front ? 1 : 0) +
    (data.mandatoryPhotos.back ? 1 : 0) +
    (data.mandatoryPhotos.crest ? 1 : 0) +
    (data.mandatoryPhotos.tags ? 1 : 0) +
    data.extraPhotos.length;

  const isStep3Valid =
    mandatoryFilled &&
    totalPhotosCount >= 5 &&
    data.description.trim().length > 10;

  const isStep4Valid = data.price.length > 0 && !isNaN(Number(data.price));

  // --- SYMULACJA WERYFIKACJI ---
  const runSafetyValve = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Prosta logika symulacyjna
      if (data.tagStatus === "modern" && data.mandatoryPhotos.tags) {
        setVerificationResult("verified");
      } else if (["vintage", "washed", "cut"].includes(data.tagStatus || "")) {
        setVerificationResult("pending_expert");
      } else {
        setVerificationResult("high_risk");
      }
      setStep(6); // Move to Result Step
    }, 3000);
  };

  // --- KALKULACJA PROWIZJI (Fee Calculation) ---
  const calculateEarnings = (price: string) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return 0;
    const fee = numPrice * 0.08; // 8% fee assumption
    return (numPrice - fee).toFixed(2);
  };

  // --- RENDERERS ---

  // STEP 1: METHOD
  const renderStep1 = () => (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-16 space-y-4">
        <span className="inline-block py-1 px-3 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          Start Selling
        </span>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">
          How do you want to sell?
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <button
          onClick={() => {
            updateData("flowType", "manual");
            setStep(2);
          }}
          className="group relative flex flex-col items-start text-left bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all"
        >
          <PenLine
            size={32}
            className="mb-6 text-gray-400 group-hover:text-black"
          />
          <h3 className="text-2xl font-bold mb-2">Manual Entry</h3>
          <p className="text-gray-500">I know all the details and specs.</p>
        </button>

        <button
          onClick={() => {
            updateData("flowType", "ai_assist");
            setStep(2);
          }}
          className="group relative flex flex-col items-start text-left bg-gradient-to-br from-white to-blue-50/30 p-10 rounded-3xl border border-blue-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all"
        >
          <div className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
            AI Scan
          </div>
          <ScanSearch size={32} className="mb-6 text-blue-600" />
          <h3 className="text-2xl font-bold mb-2">AI Assist</h3>
          <p className="text-gray-500">Auto-detect from photos.</p>
        </button>
      </div>
    </div>
  );

  // STEP 2: BASIC INFO
  const renderStep2 = () => (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-black mb-8">Basic Info</h2>
      <div className="grid gap-6">
        <div>
          <label className="text-xs font-bold uppercase text-gray-500">
            Title
          </label>
          <input
            value={data.title}
            onChange={(e) => updateData("title", e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-xl border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g. 2008 Manchester United Home Shirt"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            value={data.brand}
            onChange={(e) => updateData("brand", e.target.value)}
            placeholder="Brand (e.g. Nike)"
            className="p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            value={data.team}
            onChange={(e) => updateData("team", e.target.value)}
            placeholder="Team"
            className="p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            value={data.year}
            onChange={(e) => updateData("year", e.target.value)}
            placeholder="Year/Season"
            className="p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            value={data.size}
            onChange={(e) => updateData("size", e.target.value)}
            placeholder="Size (e.g. L)"
            className="p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>
    </div>
  );

  // STEP 3: PHOTOS & DESC
  const renderStep3 = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* SEKCJA 1: WYMAGANE ZDJĘCIA */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <ScanSearch size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">
              1. Verification Photos (Mandatory)
            </h3>
            <p className="text-sm text-gray-500">
              We need these exact angles to run the authenticity check.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(data.mandatoryPhotos).map((slot) => (
            <div
              key={slot}
              onClick={() =>
                handleMandatoryUpload(slot as keyof MandatoryPhotos)
              }
              className={`aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                data.mandatoryPhotos[slot as keyof MandatoryPhotos]
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {data.mandatoryPhotos[slot as keyof MandatoryPhotos] ? (
                <div className="text-green-600 flex flex-col items-center">
                  <CheckCircle2 className="mb-2" />
                  <span className="text-xs font-bold capitalize">
                    {slot} Added
                  </span>
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center text-center p-2">
                  <span className="mb-2">📷</span>
                  <span className="text-xs font-bold uppercase">{slot}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <label className="text-xs font-bold uppercase text-gray-500 block mb-3">
            Item Tag Status
          </label>
          <div className="flex flex-wrap gap-2">
            {["modern", "vintage", "cut", "washed"].map((status) => (
              <button
                key={status}
                onClick={() => updateData("tagStatus", status)}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                  data.tagStatus === status
                    ? "bg-black text-white border-black"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {status === "modern"
                  ? "Modern (Codes)"
                  : status === "vintage"
                  ? "Vintage"
                  : status === "cut"
                  ? "Tags Cut"
                  : "Washed Out"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEKCJA 2: GALERIA */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">2. Gallery</h3>
              <p className="text-sm text-gray-500">
                Show off details (min 1 extra photo).
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              totalPhotosCount >= 5
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            Total: {totalPhotosCount} / 20 (Min 5)
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {data.extraPhotos.map((photo, idx) => (
            <div
              key={idx}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-mono text-xs">
                IMG {idx + 1}
              </div>
              <button
                onClick={() => removeExtraPhoto(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {totalPhotosCount < 20 && (
            <button
              onClick={handleExtraUpload}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all"
            >
              <Plus size={24} className="mb-1" />
              <span className="text-[10px] font-bold uppercase">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* SEKCJA 3: OPIS */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900">3. Description</h3>
          <button
            onClick={() => setShowAiInput(!showAiInput)}
            className="flex items-center text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full hover:shadow-lg transition-all"
          >
            <Sparkles size={12} className="mr-1.5" /> AI Generator
          </button>
        </div>

        <AnimatePresence>
          {showAiInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-blue-50 p-4 rounded-xl"
            >
              <div className="flex gap-2">
                <input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Mint condition, worn by Messi..."
                  className="flex-1 p-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={generateDescription}
                  disabled={isGeneratingDesc}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isGeneratingDesc ? "Writing..." : "Generate"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          value={data.description}
          onChange={(e) => updateData("description", e.target.value)}
          placeholder="Describe flaws, history, fit..."
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none focus:outline-none focus:bg-white focus:border-black transition-all"
        ></textarea>
      </div>
    </div>
  );

  // STEP 4: PRICING & STRATEGY (NOWE!)
  const renderStep4 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900">Pricing Strategy</h2>
        <p className="text-gray-500">Choose how you want to sell your item.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* AUCTION OPTION */}
        <div
          onClick={() => updateData("listingType", "auction")}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
            data.listingType === "auction"
              ? "border-black bg-gray-900 text-white shadow-xl scale-[1.02]"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-xl ${
                data.listingType === "auction" ? "bg-white/10" : "bg-gray-100"
              }`}
            >
              <Gavel
                size={24}
                className={
                  data.listingType === "auction"
                    ? "text-yellow-400"
                    : "text-gray-600"
                }
              />
            </div>
            {data.listingType === "auction" && (
              <div className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                Selected
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">Auction</h3>
          <p className="text-sm opacity-80">
            Best for rare items. Let the community fight for it and drive the
            price up.
          </p>
        </div>

        {/* BUY NOW OPTION */}
        <div
          onClick={() => updateData("listingType", "buy_now")}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
            data.listingType === "buy_now"
              ? "border-blue-600 bg-blue-600 text-white shadow-xl scale-[1.02]"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-xl ${
                data.listingType === "buy_now" ? "bg-white/10" : "bg-gray-100"
              }`}
            >
              <Tag
                size={24}
                className={
                  data.listingType === "buy_now"
                    ? "text-white"
                    : "text-gray-600"
                }
              />
            </div>
            {data.listingType === "buy_now" && (
              <div className="bg-white text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                Selected
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">Buy Now</h3>
          <p className="text-sm opacity-80">
            Set a fixed price. Ideal for standard items or if you want a quick
            sale.
          </p>
        </div>
      </div>

      {/* INPUTS SECTION */}
      <motion.div
        key={data.listingType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
      >
        {data.listingType === "auction" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-3">
                  <Coins size={14} /> Starting Price (€)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                    €
                  </span>
                  <input
                    type="number"
                    value={data.price}
                    onChange={(e) => updateData("price", e.target.value)}
                    className="w-full pl-10 pr-4 py-4 text-2xl font-black bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Minimum bid increment will be auto-set.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-3">
                  <CalendarClock size={14} /> Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["3", "5", "7", "10"].map((day) => (
                    <button
                      key={day}
                      onClick={() => updateData("auctionDuration", day)}
                      className={`py-4 rounded-xl font-bold border transition-all ${
                        data.auctionDuration === day
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {day} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-3">
                <Tag size={14} /> Buy Now Price (€)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                  €
                </span>
                <input
                  type="number"
                  value={data.price}
                  onChange={(e) => updateData("price", e.target.value)}
                  className="w-full pl-10 pr-4 py-4 text-4xl font-black bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                  <Percent size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Allow Negotiations
                  </h4>
                  <p className="text-xs text-gray-500">
                    Buyers can send offers lower than your price.
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateData("acceptOffers", !data.acceptOffers)}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${
                  data.acceptOffers ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                    data.acceptOffers ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* FEE CALCULATOR */}
        {data.price && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">Estimated Fee (8%)</div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">
                You will receive approx.
              </div>
              <div className="text-2xl font-black text-green-600">
                €{calculateEarnings(data.price)}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <Wand2 className="w-16 h-16 text-blue-600 animate-pulse mb-6" />
      <h2 className="text-3xl font-black">Analyzing Authenticity...</h2>
      <p className="text-gray-500 mt-2">
        Checking tags, fabric, and stitching against our database.
      </p>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-xl text-center">
      {verificationResult === "verified" ? (
        <>
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Verified Authentic!</h2>
          <p className="text-gray-500 mb-6">
            Your listing for <strong>{data.title}</strong> is ready to go live.
          </p>

          <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Listing Type</span>
              <span className="font-bold capitalize">
                {data.listingType.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Price</span>
              <span className="font-bold">€{data.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fees</span>
              <span className="font-bold text-red-500">8%</span>
            </div>
          </div>

          <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
            Publish Listing Now
          </button>
        </>
      ) : (
        <>
          <History className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Expert Review Needed</h2>
          <p className="text-gray-500 mb-6">
            Because of the vintage status/missing tags, a human needs to double
            check.
          </p>
          <button className="w-full bg-black text-white py-4 rounded-xl font-bold">
            Submit to Experts
          </button>
        </>
      )}
    </div>
  );

  return (
    <main className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 container-max w-full px-4 md:px-8 py-24 md:py-32">
        {!isAnalyzing && verificationResult === null && (
          <div className="max-w-xl mx-auto h-1 bg-gray-200 rounded-full mb-12 overflow-hidden">
            {/* Step 1..4 maps to 20%..80% progress roughly */}
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${step * 20}%` }}
            ></div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {isAnalyzing ? (
              renderAnalyzing()
            ) : (
              <>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 6 && renderResult()}{" "}
                {/* Step 5 is analysis loading state */}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {!isAnalyzing && verificationResult === null && step > 1 && (
          <div className="max-w-4xl mx-auto flex justify-between mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center font-bold text-gray-500 hover:text-black"
            >
              <ArrowLeft className="mr-2" size={20} /> Back
            </button>

            <button
              onClick={() => {
                if (step === 4) runSafetyValve();
                else setStep((s) => s + 1);
              }}
              disabled={
                (step === 3 && !isStep3Valid) || (step === 4 && !isStep4Valid)
              }
              className={`flex items-center px-8 py-3 rounded-xl font-bold text-white transition-all ${
                (step === 3 && !isStep3Valid) || (step === 4 && !isStep4Valid)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black hover:scale-105"
              }`}
            >
              {step === 4 ? "Verify & Publish" : "Next Step"}{" "}
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
