import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CompletionMode } from "@/types/features/listing.types";

interface TitleCardProps {
  title: string;
  completionMode: CompletionMode;
}

/** Card displaying the listing title with optional AI badge */
const TitleCard = ({ title, completionMode }: TitleCardProps) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between items-center mb-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Title
      </span>
      {completionMode === "AI" && (
        <Badge
          variant="outline"
          className="text-[10px] bg-primary/5 border-primary/20 text-primary"
        >
          <Sparkles size={10} className="mr-1" />
          AI ENHANCED
        </Badge>
      )}
    </div>
    <h3 className="text-lg font-bold text-gray-900 leading-snug">
      {title || "Untitled Listing"}
    </h3>
  </div>
);

export default TitleCard;
