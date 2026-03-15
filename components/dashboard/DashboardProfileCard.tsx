import Link from "next/link";
import {
  CheckCircle2,
  Crown,
  ChevronRight,
  MessageCircle,
  Settings,
} from "lucide-react";

interface DashboardProfileCardProps {
  username: string | undefined;
  email: string | undefined;
  role: string | undefined;
  initials: string;
  totalListings: number;
  soldListings: number;
  loading: boolean;
}

export function DashboardProfileCard({
  username,
  email,
  role,
  initials,
  totalListings,
  soldListings,
  loading,
}: DashboardProfileCardProps) {
  const successRate =
    totalListings > 0 ? Math.round((soldListings / totalListings) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
      {/* Minimal gradient banner */}
      <div className="h-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDJjLTQuNDE4IDAtOC0zLjU4Mi04LThzMy41ODItOCA4LTggOCAzLjU4MiA4IDgtMy41ODIgOC04IDh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      </div>

      <div className="px-5 pb-5">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl font-black ring-4 ring-white shadow-lg">
            {initials}
          </div>
          {role === "admin" && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <Crown size={13} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-700">Admin</span>
            </span>
          )}
        </div>

        {/* Name & email */}
        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          {username}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">{email}</p>

        {/* Verified badge */}
        <div className="flex items-center gap-2 mt-3 mb-5">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-600">
            Verified Account
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center py-3 bg-gray-50 rounded-xl">
            <div className="text-xl font-black text-gray-900">
              {loading ? "–" : totalListings}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              Listings
            </div>
          </div>
          <div className="text-center py-3 bg-gray-50 rounded-xl">
            <div className="text-xl font-black text-gray-900">
              {loading ? "–" : soldListings}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              Sold
            </div>
          </div>
          <div className="text-center py-3 bg-gray-50 rounded-xl">
            <div className="text-xl font-black text-gray-900">
              {loading ? "–" : `${successRate}%`}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              Rate
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-1">
          <Link
            href="/messages"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <MessageCircle size={16} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
              Messages
            </span>
            <ChevronRight
              size={14}
              className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors"
            />
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <Settings size={16} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
              Account Settings
            </span>
            <ChevronRight
              size={14}
              className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
