import { CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CURRENCY } from "@/lib/constants/listing.constants";
import { BOOST_OPTIONS } from "../summary.constants";

interface BoostOptionsProps {
  selectedBoosts: string[];
  onToggleBoost: (id: string) => void;
}

/** Optional boost options card for promoting the listing */
const BoostOptions = ({ selectedBoosts, onToggleBoost }: BoostOptionsProps) => (
  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl overflow-hidden shadow-sm">
    <div className="p-4 border-b border-purple-100">
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-purple-600" />
        <span className="text-sm font-bold text-gray-900">
          Boost Your Listing
        </span>
        <Badge
          variant="outline"
          className="text-[10px] bg-purple-100 text-purple-700 border-purple-200 ml-auto"
        >
          OPTIONAL
        </Badge>
      </div>
    </div>
    <div className="p-3 space-y-2">
      {BOOST_OPTIONS.map((boost) => {
        const Icon = boost.icon;
        const isSelected = selectedBoosts.includes(boost.id);
        return (
          <button
            key={boost.id}
            onClick={() => onToggleBoost(boost.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
              isSelected
                ? "border-purple-400 bg-white shadow-sm"
                : "border-transparent bg-white/60 hover:bg-white hover:border-gray-200"
            }`}
          >
            <div
              className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                isSelected ? "bg-purple-100" : "bg-gray-100"
              }`}
            >
              <Icon
                size={18}
                className={isSelected ? "text-purple-600" : boost.color}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900">{boost.label}</p>
              <p className="text-[10px] text-gray-500 truncate">{boost.desc}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-black text-gray-900">
                {CURRENCY.SYMBOL}
                {boost.price}
              </p>
            </div>
            {isSelected && (
              <CheckCircle2 size={16} className="shrink-0 text-purple-600" />
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default BoostOptions;
