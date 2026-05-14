import { CheckCircle2 } from "lucide-react";

/** Header section - left-aligned, editorial style */
const SummaryHeader = () => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 shrink-0">
        <CheckCircle2 size={18} />
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
        Final Review
      </h2>
    </div>
    <p className="text-sm text-muted-foreground pl-10">
      Check your listing before publishing — you can still go back and edit
      anything.
    </p>
  </div>
);

export default SummaryHeader;
