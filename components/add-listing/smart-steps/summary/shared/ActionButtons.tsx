import { ArrowLeft, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onPublish: () => void;
  onBack: () => void;
  isPublishing: boolean;
}

/** Publish / Go Back buttons with disclaimer */
const ActionButtons = ({
  onPublish,
  onBack,
  isPublishing,
}: ActionButtonsProps) => (
  <>
    <div className="space-y-3">
      <Button
        className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20"
        onClick={onPublish}
        disabled={isPublishing}
      >
        {isPublishing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            Publish Listing <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      <Button
        variant="outline"
        className="w-full h-12 font-bold border-gray-200 rounded-xl hover:bg-gray-50"
        onClick={onBack}
        disabled={isPublishing}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back & Edit
      </Button>
    </div>

    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex gap-2">
      <AlertCircle size={14} className="text-gray-400 shrink-0 mt-0.5" />
      <p className="text-[10px] text-gray-500 leading-snug">
        By publishing, you agree to our terms. Your item will be visible to
        thousands of collectors instantly.
      </p>
    </div>
  </>
);

export default ActionButtons;
