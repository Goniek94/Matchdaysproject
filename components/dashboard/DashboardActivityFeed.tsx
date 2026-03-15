import { Clock } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ACTIVITY_ITEMS = [
  {
    text: "New bid on your listing",
    time: "2 min ago",
    dot: "bg-blue-500",
    highlight: true,
  },
  {
    text: "Listing viewed 15 times",
    time: "1 hour ago",
    dot: "bg-gray-300",
    highlight: false,
  },
  {
    text: "Prediction correct! +15 pts",
    time: "3 hours ago",
    dot: "bg-emerald-500",
    highlight: false,
  },
  {
    text: "New follower: jersey_collector",
    time: "5 hours ago",
    dot: "bg-purple-400",
    highlight: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardActivityFeed() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Activity
        </h3>
        <Clock size={13} className="text-gray-300" />
      </div>

      <div className="space-y-0.5">
        {ACTIVITY_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              item.highlight ? "bg-blue-50/50" : "hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 flex-shrink-0 ring-2 ring-white`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 leading-snug">
                {item.text}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
