import Link from "next/link";
import {
  PlusCircle,
  List,
  MessageCircle,
  Heart,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_ACTIONS: {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  accent?: string;
}[] = [
  {
    href: "/add-listing",
    icon: PlusCircle,
    label: "Create Listing",
    description: "Sell a new item",
    accent: "bg-gray-900 text-white hover:bg-black",
  },
  {
    href: "/my-listings",
    icon: List,
    label: "My Listings",
    description: "Manage your items",
  },
  {
    href: "/messages",
    icon: MessageCircle,
    label: "Messages",
    description: "View conversations",
  },
  {
    href: "/favorites",
    icon: Heart,
    label: "Favorites",
    description: "Saved items",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardQuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        Quick Actions
      </h3>

      <div className="space-y-1.5">
        {QUICK_ACTIONS.map(
          ({ href, icon: Icon, label, description, accent }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl transition-all group text-sm ${
                accent ?? "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  accent
                    ? "bg-white/15"
                    : "bg-white border border-gray-200 text-gray-500 group-hover:text-gray-900"
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold block leading-tight">{label}</span>
                <span
                  className={`text-[11px] ${
                    accent ? "text-white/60" : "text-gray-400"
                  }`}
                >
                  {description}
                </span>
              </div>
              <ChevronRight
                size={14}
                className={`flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  accent ? "text-white/40" : "text-gray-300"
                }`}
              />
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
