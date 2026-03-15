import Link from "next/link";
import {
  ScanLine,
  BarChart3,
  Sparkles,
  Search,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const AI_TOOLS = [
  {
    id: "verify",
    title: "Legit Check",
    description: "Detect fakes with AI trained on 5M+ shirts",
    icon: ScanLine,
    href: "/aitools",
    gradient: "from-blue-500 to-cyan-500",
    badge: "Popular",
  },
  {
    id: "valuation",
    title: "Price Oracle",
    description: "Get fair market price from real sales data",
    icon: BarChart3,
    href: "/aitools",
    gradient: "from-emerald-500 to-teal-500",
    badge: "New",
  },
  {
    id: "description",
    title: "Smart Listing",
    description: "Auto-generate listing descriptions from a photo",
    icon: Sparkles,
    href: "/aitools",
    gradient: "from-purple-500 to-pink-500",
    badge: "Beta",
  },
  {
    id: "finder",
    title: "Visual Finder",
    description: "Find any kit by uploading a screenshot",
    icon: Search,
    href: "/aitools",
    gradient: "from-orange-500 to-amber-500",
    badge: "Soon",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardAiTools() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900">AI Tools</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Powered by MatchDays Intelligence
          </p>
        </div>
        <Link
          href="/aitools"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          Open full page
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AI_TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            {/* Icon */}
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
            >
              <tool.icon size={20} className="text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-black text-gray-900">
                  {tool.title}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {tool.badge}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight
              size={15}
              className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5"
            />
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/aitools"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors"
      >
        <Sparkles size={16} />
        Explore All AI Tools
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
