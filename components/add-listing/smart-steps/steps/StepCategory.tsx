"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import {
  SPORTS,
  ITEM_CATEGORIES,
  getItemCategoriesForSport,
  type SportId,
} from "@/lib/constants/listing/taxonomy.constants";
import { SmartFormData } from "../types";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
}

export default function StepCategory({ data, update, onNext }: StepProps) {
  const [phase, setPhase] = useState<"sport" | "item">(
    data.sport ? "item" : "sport",
  );

  const selectedSport = SPORTS.find((s) => s.id === data.sport);
  const availableItems = data.sport
    ? getItemCategoriesForSport(data.sport as SportId)
    : ITEM_CATEGORIES;

  const handleSportSelect = (id: string) => {
    update("sport", id);
    update("category", id);
    update("itemCategory", "");
    setPhase("item");
  };

  const handleItemSelect = (id: string) => {
    const item = ITEM_CATEGORIES.find((c) => c.id === id);
    update("itemCategory", id);
    update("categorySlug", item?.label || id);
    if (onNext) onNext();
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="px-6 md:px-10 pt-8 pb-6 border-b border-gray-100">
          {phase === "item" && (
            <button
              onClick={() => setPhase("sport")}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-800 font-semibold mb-5 transition-colors"
            >
              <ChevronLeft size={16} />
              Back to sports
            </button>
          )}

          {phase === "sport" ? (
            <>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-1.5">
                What sport is this?
              </h2>
              <p className="text-base text-gray-400 font-medium">
                Choose the sport — AI will confirm from your photos
              </p>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {selectedSport && (
                <div className={cn("p-3 rounded-2xl", selectedSport.color, "bg-gray-100")}>
                  <selectedSport.icon size={28} strokeWidth={1.5} />
                </div>
              )}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
                  {selectedSport?.label}
                </h2>
                <p className="text-base text-gray-400 font-medium mt-0.5">
                  What type of item are you selling?
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sport Grid */}
        {phase === "sport" && (
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {SPORTS.map((sport) => {
                const isSelected = data.sport === sport.id;
                return (
                  <button
                    key={sport.id}
                    onClick={() => handleSportSelect(sport.id)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center gap-4 py-8 px-4 w-full text-center transition-all duration-200 rounded-2xl border-2 outline-none",
                      isSelected
                        ? "border-black bg-black shadow-xl scale-[1.03]"
                        : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white hover:shadow-lg hover:-translate-y-1",
                    )}
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-white/15"
                          : cn("bg-white shadow-sm", sport.color, "group-hover:shadow-md group-hover:scale-110"),
                      )}
                    >
                      <sport.icon size={34} strokeWidth={1.5} className={isSelected ? "text-white" : ""} />
                    </div>
                    <span className={cn("text-sm font-bold tracking-tight leading-tight", isSelected ? "text-white" : "text-gray-800")}>
                      {sport.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={18} className="absolute top-3 right-3 text-white/70" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Item Category Grid */}
        {phase === "item" && (
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableItems.map((item) => {
                const isSelected = data.itemCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item.id)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center gap-4 py-8 px-4 w-full text-center transition-all duration-200 rounded-2xl border-2 outline-none",
                      isSelected
                        ? "border-black bg-black shadow-xl scale-[1.02]"
                        : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white hover:shadow-lg hover:-translate-y-1",
                    )}
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-white/15"
                          : "bg-white shadow-sm text-gray-600 group-hover:shadow-md group-hover:scale-110",
                      )}
                    >
                      <item.icon size={34} strokeWidth={1.5} className={isSelected ? "text-white" : ""} />
                    </div>
                    <span className={cn("text-sm font-bold tracking-tight leading-tight", isSelected ? "text-white" : "text-gray-800")}>
                      {item.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={18} className="absolute top-3 right-3 text-white/70" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Breadcrumb — shows current selection */}
        {data.sport && (
          <div className="px-6 md:px-10 pb-6 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-gray-400 uppercase font-bold tracking-widest">
              Selected:
            </span>
            <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
              {selectedSport?.label}
              {data.itemCategory && (
                <>
                  {" / "}
                  {ITEM_CATEGORIES.find((c) => c.id === data.itemCategory)?.label}
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
