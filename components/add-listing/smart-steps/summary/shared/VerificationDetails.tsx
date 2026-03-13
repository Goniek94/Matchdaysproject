import { Shield, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SmartFormData } from "@/types/features/listing.types";
import { VERIFICATION_BADGE, TAG_CONDITION_LABELS } from "../summary.constants";

interface VerificationDetailsProps {
  data: SmartFormData;
}

/** Simplified verification table showing confirmed item checks */
const VerificationDetails = ({ data }: VerificationDetailsProps) => {
  const verificationBadge =
    VERIFICATION_BADGE[data.verificationStatus] ??
    VERIFICATION_BADGE.NOT_AI_VERIFIED;

  // Build verification rows from available data
  const verificationRows: {
    label: string;
    value: string;
    confirmed: boolean;
  }[] = [];

  // Tag condition
  const tagCondition =
    TAG_CONDITION_LABELS[data.verification.tagCondition] ??
    data.verification.tagCondition;
  if (tagCondition) {
    verificationRows.push({
      label: "Tag Condition",
      value: tagCondition,
      confirmed: true,
    });
  }

  // Serial code from AI
  if (data.aiData?.serialCode) {
    verificationRows.push({
      label: "Serial Code",
      value: data.aiData.serialCode,
      confirmed: true,
    });
  }

  // Autograph
  verificationRows.push({
    label: "Autograph",
    value: data.verification.hasAutograph
      ? data.verification.autographDetails || "Yes"
      : "No",
    confirmed: true,
  });

  // Vintage
  verificationRows.push({
    label: "Vintage",
    value: data.verification.isVintage
      ? data.verification.vintageYear
        ? `Yes (${data.verification.vintageYear})`
        : "Yes"
      : "No",
    confirmed: true,
  });

  // Player print
  verificationRows.push({
    label: "Player Print",
    value: data.verification.noPlayerPrint ? "None" : "Present",
    confirmed: true,
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <Shield size={16} className="text-primary" />
        <span className="text-sm font-bold text-gray-900">
          Verification Details
        </span>
        <Badge
          variant="outline"
          className={`text-[10px] font-bold ml-auto ${verificationBadge.className}`}
        >
          {verificationBadge.label}
        </Badge>
      </div>

      {/* Verification table */}
      <div className="divide-y divide-gray-50">
        {verificationRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-xs font-medium text-gray-500">
              {row.label}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900">
                {row.value}
              </span>
              {row.confirmed && (
                <CheckCircle2 size={13} className="text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationDetails;
