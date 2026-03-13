import { CheckCircle2, Shield, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SmartFormData } from "@/types/features/listing.types";
import { getCategoryDetailRows } from "../summary.helpers";
import AuthenticityNotesList from "./AuthenticityNotesList";
import DetailRow from "./DetailRow";

interface AIVerificationCardProps {
  data: SmartFormData;
}

/** Card displaying AI verification score, progress bar, notes, and category detail rows */
const AIVerificationCard = ({ data }: AIVerificationCardProps) => {
  const score = data.aiData?.authenticityScore ?? 0;
  const authenticityNotes =
    data.aiData?.authenticityNotes ??
    "No AI analysis data available for this listing.";
  const isAuction = data.listingType === "auction";

  // Get category-specific detail rows, filtered to only show non-empty values
  const detailRows = getCategoryDetailRows(data.categorySlug).filter((row) => {
    const val = row.getValue(data);
    return val !== undefined && val !== null && val !== "";
  });

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm border-2 ${
        score >= 80
          ? "bg-green-50 border-green-200"
          : score >= 50
            ? "bg-yellow-50 border-yellow-200"
            : score > 0
              ? "bg-red-50 border-red-200"
              : "bg-white border-gray-100"
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b ${
          score >= 80
            ? "border-green-100 bg-green-100/50"
            : score >= 50
              ? "border-yellow-100 bg-yellow-100/50"
              : score > 0
                ? "border-red-100 bg-red-100/50"
                : "border-gray-50"
        }`}
      >
        <div className="flex items-center gap-2">
          {score >= 80 ? (
            <CheckCircle2 size={18} className="text-green-600" />
          ) : score >= 50 ? (
            <Shield size={18} className="text-yellow-600" />
          ) : score > 0 ? (
            <AlertCircle size={18} className="text-red-600" />
          ) : (
            <Shield size={18} className="text-gray-400" />
          )}
          <span className="text-sm font-bold text-gray-900">
            AI Verification
          </span>
          {score >= 80 && (
            <Badge
              variant="outline"
              className="text-[10px] font-bold bg-green-100 text-green-700 border-green-300 ml-auto"
            >
              ✓ Verified
            </Badge>
          )}
          {score >= 50 && score < 80 && (
            <Badge
              variant="outline"
              className="text-[10px] font-bold bg-yellow-100 text-yellow-700 border-yellow-300 ml-auto"
            >
              Needs Review
            </Badge>
          )}
          {score > 0 && score < 50 && (
            <Badge
              variant="outline"
              className="text-[10px] font-bold bg-red-100 text-red-700 border-red-300 ml-auto"
            >
              Flagged
            </Badge>
          )}
        </div>
      </div>

      {/* Score & Progress */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-sm font-semibold ${
              score >= 80
                ? "text-green-700"
                : score >= 50
                  ? "text-yellow-700"
                  : score > 0
                    ? "text-red-700"
                    : "text-gray-500"
            }`}
          >
            {score >= 80
              ? "Authenticity Confirmed"
              : score >= 50
                ? "Review Recommended"
                : score > 0
                  ? "Potential Issues Found"
                  : "Not Yet Verified"}
          </span>
          <span
            className={`text-3xl font-black ${
              score >= 80
                ? "text-green-600"
                : score >= 50
                  ? "text-yellow-600"
                  : score > 0
                    ? "text-red-600"
                    : "text-gray-400"
            }`}
          >
            {score}%
          </span>
        </div>
        <Progress
          value={score}
          className="h-2 bg-white/60"
          indicatorClassName={
            score >= 80
              ? "bg-green-500"
              : score >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
          }
        />
        <AuthenticityNotesList notes={authenticityNotes} />
      </div>

      {/* Detail Rows */}
      <div>
        {/* Listing type row */}
        <DetailRow
          label="Listing Type"
          value={isAuction ? "Auction" : "Buy Now"}
        />

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

export default AIVerificationCard;
