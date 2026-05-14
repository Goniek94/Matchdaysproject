import { Sparkles } from "lucide-react";

interface DetailRowProps {
  label: string;
  value: string;
  /** Show green AI badge next to the value */
  aiDetected?: boolean;
}

/** Horizontal detail row for the specs table */
const DetailRow = ({ label, value, aiDetected }: DetailRowProps) => (
  <div className="flex items-center justify-between gap-3 px-4 py-2.5">
    <span className="text-xs font-medium text-gray-500 shrink-0">{label}</span>
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-xs font-bold text-gray-900 text-right capitalize break-words">
        {value}
      </span>
      {aiDetected && (
        <span
          title="Detected by AI"
          className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5 shrink-0"
        >
          <Sparkles size={8} />
          AI
        </span>
      )}
    </div>
  </div>
);

export default DetailRow;
