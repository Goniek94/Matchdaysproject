import { Seller } from "@/types";

interface SellerInfoProps {
  seller: Seller;
}

export default function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <div className="border border-gray-200 rounded-[2px] p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-200 rounded-full flex-shrink-0"></div>
        <div>
          <h3 className="text-lg font-medium text-black">{seller.name}</h3>
          <div className="text-sm text-gray-600">
            ★★★★★ ({seller.reviews} reviews)
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xl font-medium text-black mb-1">
            {seller.sales}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wider">
            Sales
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-medium text-black mb-1">
            {seller.positivePercentage}%
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wider">
            Positive
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-medium text-black mb-1">
            {seller.avgShippingTime}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wider">
            Avg Ship
          </div>
        </div>
      </div>
    </div>
  );
}
