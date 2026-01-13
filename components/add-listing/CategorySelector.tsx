"use client";

import { CATEGORIES } from "./types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Category
        </h2>
        <p className="text-gray-600">
          Choose the category of the product you want to sell
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <Card
              key={category.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? "ring-2 ring-blue-600 bg-blue-50"
                  : "hover:border-blue-300"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={`p-4 rounded-full ${
                    isSelected ? "bg-blue-600" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      isSelected ? "text-white" : "text-gray-700"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.description}
                  </p>
                </div>
                {isSelected && <Badge className="bg-blue-600">Selected</Badge>}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected Summary */}
      {selectedCategory && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Selected:{" "}
            {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
          </p>
        </div>
      )}
    </div>
  );
}
