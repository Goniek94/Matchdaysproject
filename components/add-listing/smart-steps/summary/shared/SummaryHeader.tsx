import { CheckCircle2 } from "lucide-react";

/** Header section with success icon and title */
const SummaryHeader = () => (
  <div className="text-center space-y-2">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
      <CheckCircle2 size={28} />
    </div>
    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
      Final Review
    </h2>
    <p className="text-sm text-muted-foreground max-w-lg mx-auto">
      Review your listing before publishing. Everything looks great!
    </p>
  </div>
);

export default SummaryHeader;
