"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form-components";
import { ListingFormData } from "./types";
import { DollarSign, Clock, Package, MapPin } from "lucide-react";

interface PricingSectionProps {
  formData: ListingFormData;
  onUpdate: (updates: Partial<ListingFormData>) => void;
}

export default function PricingSection({
  formData,
  onUpdate,
}: PricingSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cena i Wysyłka
        </h2>
        <p className="text-gray-600">Ustaw cenę i warunki sprzedaży</p>
      </div>

      {/* Listing Type */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Typ Sprzedaży
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onUpdate({ listingType: "auction" })}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              formData.listingType === "auction"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Aukcja</h4>
            </div>
            <p className="text-sm text-gray-600">
              Licytacja z ceną wywoławczą i opcjonalną ceną "Kup Teraz"
            </p>
          </button>

          <button
            onClick={() => onUpdate({ listingType: "buy_now" })}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              formData.listingType === "buy_now"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-gray-900">Kup Teraz</h4>
            </div>
            <p className="text-sm text-gray-600">
              Sprzedaż za stałą cenę bez licytacji
            </p>
          </button>
        </div>
      </Card>

      {/* Pricing Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Szczegóły Cenowe
        </h3>
        <div className="space-y-4">
          {formData.listingType === "auction" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Cena wywoławcza"
                  value={formData.startingBid || ""}
                  onChange={(e) =>
                    onUpdate({ startingBid: Number(e.target.value) })
                  }
                  placeholder="100"
                  required
                />
                <Input
                  type="number"
                  label="Minimalne przebicie"
                  value={formData.bidIncrement || ""}
                  onChange={(e) =>
                    onUpdate({ bidIncrement: Number(e.target.value) })
                  }
                  placeholder="50"
                  required
                />
              </div>
              <Input
                type="number"
                label="Cena Kup Teraz (opcjonalne)"
                value={formData.buyNowPrice || ""}
                onChange={(e) =>
                  onUpdate({ buyNowPrice: Number(e.target.value) })
                }
                placeholder="500"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Czas trwania aukcji
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[3, 5, 7, 10].map((days) => (
                    <button
                      key={days}
                      onClick={() => onUpdate({ duration: days })}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        formData.duration === days
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {days} dni
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {formData.listingType === "buy_now" && (
            <Input
              type="number"
              label="Cena"
              value={formData.buyNowPrice || ""}
              onChange={(e) =>
                onUpdate({ buyNowPrice: Number(e.target.value) })
              }
              placeholder="500"
              required
            />
          )}
        </div>
      </Card>

      {/* Shipping */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Wysyłka
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Koszt wysyłki"
              value={formData.shippingCost || ""}
              onChange={(e) =>
                onUpdate({ shippingCost: Number(e.target.value) })
              }
              placeholder="20"
              required
            />
            <Input
              label="Czas wysyłki"
              value={formData.shippingTime}
              onChange={(e) => onUpdate({ shippingTime: e.target.value })}
              placeholder="3-5 dni roboczych"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <Input
              label="Wysyłka z"
              value={formData.shippingFrom}
              onChange={(e) => onUpdate({ shippingFrom: e.target.value })}
              placeholder="Polska"
              required
            />
          </div>
        </div>
      </Card>

      {/* Summary */}
      {((formData.listingType === "auction" && formData.startingBid) ||
        (formData.listingType === "buy_now" && formData.buyNowPrice)) && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Podsumowanie Finansowe
          </h3>
          <div className="space-y-2 text-sm">
            {formData.listingType === "auction" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cena wywoławcza:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.startingBid} PLN
                  </span>
                </div>
                {formData.buyNowPrice && formData.buyNowPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kup Teraz:</span>
                    <span className="font-semibold text-green-600">
                      {formData.buyNowPrice} PLN
                    </span>
                  </div>
                )}
              </>
            )}
            {formData.listingType === "buy_now" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cena:</span>
                <span className="font-semibold text-gray-900">
                  {formData.buyNowPrice} PLN
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Koszt wysyłki:</span>
              <span className="font-semibold text-gray-900">
                {formData.shippingCost} PLN
              </span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">
                  Łączny koszt dla kupującego:
                </span>
                <span className="font-bold text-lg text-blue-600">
                  {(formData.listingType === "auction"
                    ? formData.startingBid || 0
                    : formData.buyNowPrice || 0) +
                    (formData.shippingCost || 0)}{" "}
                  PLN
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
