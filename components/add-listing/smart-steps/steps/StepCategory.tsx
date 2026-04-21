"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
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
  // Phase: "sport" → pick sport first, "item" → pick item type within sport
  const [phase, setPhase] = useState<"sport" | "item">(
    data.sport ? "item" : "sport",
  );

  const selectedSport = SPORTS.find((s) => s.id === data.sport);
  const availableItems = data.sport
    ? getItemCategoriesForSport(data.sport as SportId)
    : ITEM_CATEGORIES;

  const handleSportSelect = (id: string) => {
    update("sport", id);
    update("category", id); // keep legacy field in sync
    update("itemCategory", ""); // reset item when sport changes
    setPhase("item");
  };

  const handleItemSelect = (id: string) => {
    const item = ITEM_CATEGORIES.find((c) => c.id === id);
    update("itemCategory", id);
    update("categorySlug", item?.label || id); // keep legacy field in sync
    if (onNext) onNext();
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">

        {/* Header */}
        <div className="mb-6">
          {phase === "item" && (
            <button
              onClick={() => setPhase("sport")}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 font-semibold mb-4 transition-colors"
            >
              <ChevronLeft size={16} />
              Back to sports
            </button>
          )}

          {phase === "sport" ? (
            <>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
                What sport is this?
              </h2>
              <p className="text-base text-gray-500 font-medium">
                Choose the sport — AI will confirm from your photos
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-1">
                {selectedSport && (
                  <span className={cn("text-2xl", selectedSport.color)}>
                    <selectedSport.icon size={24} strokeWidth={2} />
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
                  {selectedSport?.label}
                </h2>
              </div>
              <p className="text-base text-gray-500 font-medium">
                What type of item are you selling?
              </p>
            </>
          )}
        </div>

        {/* Sport Grid */}
        {phase === "sport" && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SPORTS.map((sport) => {
              const isSelected = data.sport === sport.id;
              return (
                <button
                  key={sport.id}
                  onClick={() => handleSportSelect(sport.id)}
                  className={cn(
                    "group relative flex flex-col items-center justify-center p-4 h-28 w-full text-center transition-all duration-200 rounded-2xl border-2 outline-none",
                    isSelected
                      ? "border-black bg-gray-50 shadow-xl scale-[1.02]"
                      : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5",
                  )}
                >
                  <div
                    className={cn(
                      "p-2.5 rounded-xl mb-2 transition-colors",
                      isSelected
                        ? "bg-black text-white"
                        : cn("bg-gray-50", sport.color, "group-hover:bg-gray-100"),
                    )}
                  >
                    <sport.icon size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-xs md:text-sm font-bold tracking-tight text-gray-900">
                    {sport.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Item Category Grid */}
        {phase === "item" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableItems.map((item) => {
              const isSelected = data.itemCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemSelect(item.id)}
                  className={cn(
                    "group relative flex flex-col items-center justify-center p-4 h-32 w-full text-center transition-all duration-200 rounded-2xl border-2 outline-none",
                    isSelected
                      ? "border-black bg-gray-50 shadow-xl scale-[1.02]"
                      : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5",
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-xl mb-2 transition-colors",
                      isSelected
                        ? "bg-black text-white"
                        : "bg-gray-50 text-gray-700 group-hover:bg-gray-100",
                    )}
                  >
                    <item.icon size={26} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold tracking-tight text-gray-900">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Breadcrumb pill — shows current selection */}
        {data.sport && (
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">
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
