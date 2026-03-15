import { TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

interface DashboardStatsGridProps {
  stats: StatCardProps[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/60 p-5 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white mb-4`}
      >
        {icon}
      </div>

      {/* Value */}
      <div className="text-2xl font-black text-gray-900 tracking-tight">
        {value}
      </div>

      {/* Label */}
      <div className="text-xs font-medium text-gray-400 mt-1">{label}</div>

      {/* Trend */}
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
