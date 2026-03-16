import { Package } from "lucide-react";
import type { SmartFormData } from "@/types/features/listing.types";
import { getCategoryDetailRows } from "../summary.helpers";
import { getConditionLabel } from "../summary.helpers";
import DetailRow from "./DetailRow";

interface ProductDetailsProps {
  data: SmartFormData;
}

/** Card displaying product specification details (brand, size, country, etc.) */
const ProductDetails = ({ data }: ProductDetailsProps) => {
  const isAuction = data.listingType === "auction";

  // Get category-specific detail rows, filtered to only show non-empty values
  const detailRows = getCategoryDetailRows(data.categorySlug).filter((row) => {
    const val = row.getValue(data);
    return val !== undefined && val !== null && val !== "";
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <Package size={16} className="text-primary" />
        <span className="text-sm font-bold text-gray-900">Product Details</span>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-gray-50">
        {/* Listing type */}
        <DetailRow
          label="Listing Type"
          value={isAuction ? "Auction" : "Buy Now"}
        />

        {/* Condition */}
        {data.condition && (
          <DetailRow
            label="Condition"
            value={getConditionLabel(data.condition)}
          />
        )}

        {/* Dynamic category-specific rows */}
        {detailRows.map((row) => (
          <DetailRow
            key={row.key}
            label={row.label}
            value={row.getValue(data) || ""}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
