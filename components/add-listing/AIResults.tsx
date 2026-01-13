"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/form-components";
import { Textarea } from "@/components/ui/form-components";
import { Sparkles, Edit2, Check, TrendingUp } from "lucide-react";

interface AIResultsProps {
  aiData: {
    title: string;
    description: string;
    confidence: number;
    detectedFields: Record<string, string>;
    estimatedValue: { min: number; max: number };
  };
  onEdit: (field: string, value: string) => void;
}

export default function AIResults({ aiData, onEdit }: AIResultsProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = (field: string) => {
    onEdit(field, tempValue);
    setEditingField(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600 bg-green-100";
    if (confidence >= 0.7) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Wyniki Analizy AI
              </h3>
              <p className="text-sm text-gray-600">
                AI przeanalizowało zdjęcia i wypełniło formularz
              </p>
            </div>
          </div>
          <Badge className={getConfidenceColor(aiData.confidence)}>
            {Math.round(aiData.confidence * 100)}% pewności
          </Badge>
        </div>

        {/* Estimated Value */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Szacowana wartość</p>
            <p className="text-lg font-bold text-gray-900">
              {aiData.estimatedValue.min} - {aiData.estimatedValue.max} PLN
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Tytuł</label>
            {editingField !== "title" && (
              <button
                onClick={() => startEdit("title", aiData.title)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edytuj
              </button>
            )}
          </div>
          {editingField === "title" ? (
            <div className="flex gap-2">
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => saveEdit("title")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-gray-900 font-medium">{aiData.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Opis</label>
            {editingField !== "description" && (
              <button
                onClick={() => startEdit("description", aiData.description)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edytuj
              </button>
            )}
          </div>
          {editingField === "description" ? (
            <div className="space-y-2">
              <Textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                rows={4}
                className="w-full"
              />
              <button
                onClick={() => saveEdit("description")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Zapisz
              </button>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {aiData.description}
            </p>
          )}
        </div>

        {/* Detected Fields */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Wykryte szczegóły
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(aiData.detectedFields).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                {editingField === key ? (
                  <div className="flex gap-1">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-32 text-sm"
                    />
                    <button
                      onClick={() => saveEdit(key)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {value}
                    </span>
                    <button
                      onClick={() => startEdit(key, value)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-600">
          <p>
            💡 Możesz edytować wszystkie pola wykryte przez AI. Kliknij "Edytuj"
            przy dowolnym polu.
          </p>
        </div>
      </div>
    </Card>
  );
}
