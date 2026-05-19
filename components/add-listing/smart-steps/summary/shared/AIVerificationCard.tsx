import { CheckCircle2, Shield, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SmartFormData } from "@/types/features/listing.types";
import AuthenticityNotesList from "./AuthenticityNotesList";

interface AIVerificationCardProps {
  data: SmartFormData;
}

/** Card displaying AI verification score, progress bar and authenticity notes only.
 *  Item detail rows are shown separately in ProductDetails to avoid duplication. */
const AIVerificationCard = ({ data }: AIVerificationCardProps) => {
  const score = data.aiData?.authenticityScore ?? 0;
  const authenticityNotes =
    data.aiData?.authenticityNotes ??
    "No AI analysis data available for this listing.";

  const scoreColor = {
    text:
      score >= 80
        ? "text-green-700"
        : score >= 50
          ? "text-yellow-700"
          : score > 0
            ? "text-red-700"
            : "text-gray-500",
    number:
      score >= 80
        ? "text-green-600"
        : score >= 50
          ? "text-yellow-600"
          : score > 0
            ? "text-red-600"
            : "text-gray-400",
    bar:
      score >= 80
        ? "bg-green-500"
        : score >= 50
          ? "bg-yellow-500"
          : "bg-red-500",
    bg:
      score >= 80
        ? "bg-green-50 border-green-200"
        : score >= 50
          ? "bg-yellow-50 border-yellow-200"
          : score > 0
            ? "bg-red-50 border-red-200"
            : "bg-white border-gray-100",
    header:
      score >= 80
        ? "border-green-100 bg-green-100/50"
        : score >= 50
          ? "border-yellow-100 bg-yellow-100/50"
          : score > 0
            ? "border-red-100 bg-red-100/50"
            : "border-gray-50",
  };

  // AI gives a probabilistic score from photo analysis — it never confirms
  // authenticity. "Verified" is reserved for moderator approval (gold badge
  // on the listing page). Low score ≠ counterfeit: match-worn jerseys often
  // lack tags, vintage items predate hologram codes. Phrase the label as a
  // neutral observation so we don't insinuate fake.
  const scoreLabel =
    score >= 80
      ? `AI Score: ${score}% — High confidence`
      : score >= 50
        ? `AI Score: ${score}% — Moderator review recommended`
        : score > 0
          ? `AI Score: ${score}% — Manual verification needed`
          : "Not yet analyzed";

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm border-2 ${scoreColor.bg}`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${scoreColor.header}`}>
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
              AI High
            </Badge>
          )}
          {score >= 50 && score < 80 && (
            <Badge
              variant="outline"
              className="text-[10px] font-bold bg-yellow-100 text-yellow-700 border-yellow-300 ml-auto"
            >
              Review recommended
            </Badge>
          )}
          {score > 0 && score < 50 && (
            <Badge
              variant="outline"
              className="text-[10px] font-bold bg-red-100 text-red-700 border-red-300 ml-auto"
            >
              Manual verification
            </Badge>
          )}
        </div>
      </div>

      {/* Score & Progress */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-semibold ${scoreColor.text}`}>
            {scoreLabel}
          </span>
          <span className={`text-3xl font-black ${scoreColor.number}`}>
            {score}%
          </span>
        </div>
        <Progress
          value={score}
          className="h-2 bg-white/60"
          indicatorClassName={scoreColor.bar}
        />
        <AuthenticityNotesList notes={authenticityNotes} />
      </div>
    </div>
  );
};

export default AIVerificationCard;
