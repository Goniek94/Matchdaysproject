"use client";

/**
 * My Profile — full-screen account page.
 *
 * Reads the live user from AuthContext (no mock data) and renders an editorial
 * hero with the seller's identity, level, subscription tier and stats.
 * Below the hero, a sticky tab bar switches between four sections:
 *   - Overview     — quick links to listings/won/bids + level progress
 *   - Personal     — name / phone / country / address (editable)
 *   - Activity     — recent login history (placeholder when empty)
 *   - Settings     — preferences + account actions
 *
 * Responsive:
 *   - Desktop (lg+) : 2-col grid (sticky sidebar nav + content)
 *   - Mobile        : stacked, horizontally-scrolling tabs, bottom nav
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings as SettingsIcon,
  Activity,
  Crown,
  Star,
  TrendingUp,
  Gavel,
  Trophy,
  Heart,
  Package,
  ShieldCheck,
  Edit3,
  LogOut,
  Camera,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Award,
  Coins,
  Zap,
  Clock,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { updateProfile } from "@/lib/api/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "overview" | "personal" | "activity" | "settings";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "personal", label: "Personal", icon: User },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

// ─── Subscription tier presentation ──────────────────────────────────────────

const TIER_THEME: Record<
  string,
  { label: string; gradient: string; ring: string; icon: typeof Crown }
> = {
  free: {
    label: "Free",
    gradient: "from-gray-500 to-gray-700",
    ring: "ring-gray-400/30",
    icon: User,
  },
  basic: {
    label: "Basic",
    gradient: "from-blue-500 to-blue-700",
    ring: "ring-blue-400/40",
    icon: Star,
  },
  premium: {
    label: "Premium",
    gradient: "from-rose-500 to-rose-700",
    ring: "ring-rose-400/50",
    icon: Crown,
  },
  vip: {
    label: "VIP",
    gradient: "from-amber-400 via-amber-500 to-yellow-600",
    ring: "ring-amber-400/60",
    icon: Sparkles,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function relativeTime(iso?: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function levelProgress(totalPoints: number, level: number) {
  // Backend rule: every 500 pts → +1 level, max 100
  const pointsForCurrent = (level - 1) * 500;
  const pointsForNext = level * 500;
  const intoLevel = totalPoints - pointsForCurrent;
  const span = pointsForNext - pointsForCurrent;
  return {
    current: Math.max(0, intoLevel),
    needed: span,
    pct: Math.min(100, Math.max(0, (intoLevel / span) * 100)),
    nextLevel: Math.min(100, level + 1),
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refreshUser, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  // Redirect guests after auth check completes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/");
  }, [isLoading, isAuthenticated, router]);

  // Loading skeleton while we figure out who's here
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl h-64 animate-pulse mb-6" />
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white rounded-3xl h-96 animate-pulse" />
            <div className="lg:col-span-8 bg-white rounded-3xl h-96 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <Lock size={36} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Sign in required</h2>
        <p className="text-gray-500 mb-6">Log in to view your profile.</p>
        <Link
          href="/"
          className="px-7 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  const tier = (user.subscriptionTier ?? "free").toLowerCase();
  const theme = TIER_THEME[tier] ?? TIER_THEME.free;
  const TierIcon = theme.icon;

  const initials =
    user.username?.[0]?.toUpperCase() ??
    user.name?.[0]?.toUpperCase() ??
    "?";

  const level = user.level ?? 1;
  const points = user.totalPoints ?? 0;
  const lvl = levelProgress(points, level);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-20 pb-32 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ═══════════════════════════════════════════════════════════════════
             HERO — full-width, premium, with subscription gradient accent
           ═══════════════════════════════════════════════════════════════════ */}
        <ProfileHero
          user={user}
          theme={theme}
          TierIcon={TierIcon}
          initials={initials}
          onRefresh={refreshUser}
        />

        {/* Stats strip — 4 columns on desktop, 2x2 on mobile */}
        <ProfileStats user={user} />

        {/* Tabs — sticky-ish, horizontal scroll on mobile */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto scrollbar-hide bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  active
                    ? "bg-black text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
             TAB CONTENT
           ═══════════════════════════════════════════════════════════════════ */}
        {tab === "overview" && <OverviewTab user={user} lvl={lvl} />}
        {tab === "personal" && (
          <PersonalTab user={user} onSaved={refreshUser} />
        )}
        {tab === "activity" && <ActivityTab user={user} />}
        {tab === "settings" && <SettingsTab onLogout={logout} />}
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 lg:hidden z-40 backdrop-blur-md bg-white/95">
        <div className="grid grid-cols-4 h-[72px]">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-black" : "text-gray-400"
                }`}
              >
                {active && (
                  <span className="absolute top-0 w-8 h-0.5 bg-rose-500 rounded-b-full" />
                )}
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span
                  className={`text-[10px] uppercase tracking-wider ${active ? "font-black" : "font-bold"}`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════════

function ProfileHero({
  user,
  theme,
  TierIcon,
  initials,
  onRefresh,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  theme: (typeof TIER_THEME)[string];
  TierIcon: typeof Crown;
  initials: string;
  onRefresh: () => Promise<unknown>;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden shadow-xl mb-6">
      {/* Tier-coloured glow */}
      <div
        className={`absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl bg-gradient-to-br ${theme.gradient}`}
      />
      <div
        className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20 blur-3xl bg-gradient-to-tr ${theme.gradient}`}
      />

      {/* Subtle grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="gridProfile"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridProfile)" />
      </svg>

      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent`}
      />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${theme.gradient} p-[3px] shadow-2xl`}
            >
              <div className="w-full h-full rounded-[20px] bg-gray-900 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {initials}
                  </span>
                )}
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-[3px] border-black rounded-full shadow-lg" />
              {/* Avatar edit hint */}
              <button
                className="absolute -bottom-1 -left-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Change avatar (coming soon)"
              >
                <Camera size={12} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white text-[10px] font-black tracking-widest uppercase shadow-lg`}
              >
                <TierIcon size={11} />
                {theme.label}
              </span>
              {user.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={11} />
                  Verified
                </span>
              )}
              {user.role === "admin" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-2">
              {user.username}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
              {(user.name || user.lastName) && (
                <span className="flex items-center gap-1.5">
                  <User size={13} />
                  {[user.name, user.lastName].filter(Boolean).join(" ")}
                </span>
              )}
              {user.country && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {user.country}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Joined{" "}
                {new Date(user.createdAt ?? Date.now()).toLocaleDateString(
                  "en-GB",
                  { month: "long", year: "numeric" },
                )}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
            <Link
              href={`/profile/${user.username}`}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white text-sm font-bold transition-all"
            >
              <ExternalLink size={14} />
              Public View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATS STRIP
// ═══════════════════════════════════════════════════════════════════════════════

function ProfileStats({
  user,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}) {
  const stats = [
    {
      icon: Gavel,
      label: "Sales",
      value: user.sales ?? 0,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      icon: Star,
      label: "Rating",
      value: (user.rating ?? 0).toFixed(1),
      sub: `${user.reviews ?? 0} reviews`,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: TrendingUp,
      label: "Positive",
      value: `${Math.round(user.positivePercentage ?? 100)}%`,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      icon: Coins,
      label: "Points",
      value: (user.totalPoints ?? 0).toLocaleString(),
      sub: `Level ${user.level ?? 1}`,
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group"
          >
            <div
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} mb-3 group-hover:scale-110 transition-transform`}
            >
              <Icon size={16} className={s.color} strokeWidth={2.5} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 leading-none mb-1 tracking-tight">
              {s.value}
            </div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {s.label}
            </div>
            {s.sub && (
              <div className="text-[11px] text-gray-400 mt-0.5 font-medium">
                {s.sub}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════

function OverviewTab({
  user,
  lvl,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  lvl: ReturnType<typeof levelProgress>;
}) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      {/* Quick links */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
          Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLink
            href="/my-listings"
            icon={Package}
            title="My Listings"
            subtitle="Manage your active auctions"
            accent="rose"
          />
          <QuickLink
            href="/auctions/my/won"
            icon={Trophy}
            title="Won Auctions"
            subtitle="Items you've won and need to pay"
            accent="amber"
          />
          <QuickLink
            href="/dashboard"
            icon={Activity}
            title="Dashboard"
            subtitle="Bids, listings & analytics"
            accent="emerald"
          />
          <QuickLink
            href="/favorites"
            icon={Heart}
            title="Favorites"
            subtitle="Items you're watching"
            accent="violet"
          />
        </div>
      </div>

      {/* Level progress */}
      <div className="lg:col-span-5">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white relative overflow-hidden h-full">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Level Progress
              </span>
              <Award size={14} className="text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black tracking-tighter">
                {user.level ?? 1}
              </span>
              <span className="text-sm text-gray-500 font-bold">
                / 100
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">
                  Next: Level {lvl.nextLevel}
                </span>
                <span className="text-rose-400 font-black tabular-nums">
                  {lvl.current} / {lvl.needed} XP
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-700"
                  style={{ width: `${lvl.pct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
              <div>
                <div className="text-2xl font-black tabular-nums">
                  {(user.totalPoints ?? 0).toLocaleString()}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                  Total XP
                </div>
              </div>
              <div>
                <div className="text-2xl font-black tabular-nums">
                  {user.experience ?? 0}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                  Experience
                </div>
              </div>
            </div>

            <Link
              href="/rewards"
              className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Zap size={12} />
              Earn more points
              <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  subtitle,
  accent,
}: {
  href: string;
  icon: typeof User;
  title: string;
  subtitle: string;
  accent: "rose" | "amber" | "emerald" | "violet";
}) {
  const colors: Record<string, { bg: string; text: string; ring: string }> = {
    rose: {
      bg: "bg-rose-50 group-hover:bg-rose-100",
      text: "text-rose-500",
      ring: "group-hover:ring-rose-100",
    },
    amber: {
      bg: "bg-amber-50 group-hover:bg-amber-100",
      text: "text-amber-500",
      ring: "group-hover:ring-amber-100",
    },
    emerald: {
      bg: "bg-emerald-50 group-hover:bg-emerald-100",
      text: "text-emerald-500",
      ring: "group-hover:ring-emerald-100",
    },
    violet: {
      bg: "bg-violet-50 group-hover:bg-violet-100",
      text: "text-violet-500",
      ring: "group-hover:ring-violet-100",
    },
  };
  const c = colors[accent];

  return (
    <Link
      href={href}
      className={`group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-md hover:ring-4 ${c.ring} transition-all flex items-start gap-4`}
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center transition-colors`}
      >
        <Icon size={20} className={c.text} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-black text-gray-900 mb-0.5 flex items-center gap-1.5">
          {title}
          <ChevronRight
            size={14}
            className="text-gray-300 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all"
          />
        </div>
        <div className="text-xs text-gray-500 leading-snug">{subtitle}</div>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: PERSONAL — editable
// ═══════════════════════════════════════════════════════════════════════════════

function PersonalTab({
  user,
  onSaved,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  onSaved: () => Promise<unknown>;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    msg: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: user.name ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
    country: user.country ?? "",
  });

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateProfile({
        firstName: form.name,
        lastName: form.lastName,
        phone: form.phone,
        country: form.country,
      });
      if (res.success) {
        setFeedback({ kind: "success", msg: "Profile updated" });
        setEditing(false);
        await onSaved();
      } else {
        setFeedback({
          kind: "error",
          msg: res.message ?? "Update failed",
        });
      }
    } catch (err) {
      setFeedback({
        kind: "error",
        msg: err instanceof Error ? err.message : "Update failed",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      country: user.country ?? "",
    });
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-black text-gray-900">
            Personal Information
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            How others see you on Matchdays
          </p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-bold text-gray-700 transition-colors"
          >
            <Edit3 size={13} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Check size={13} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`mx-6 mt-5 flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold ${
            feedback.kind === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedback.kind === "success" ? (
            <Check size={15} />
          ) : (
            <AlertCircle size={15} />
          )}
          {feedback.msg}
        </div>
      )}

      <div className="p-6 grid sm:grid-cols-2 gap-5">
        <Field
          label="First Name"
          value={form.name}
          editing={editing}
          onChange={(v) => set("name", v)}
          icon={User}
          placeholder="Mateusz"
        />
        <Field
          label="Last Name"
          value={form.lastName}
          editing={editing}
          onChange={(v) => set("lastName", v)}
          icon={User}
          placeholder="Goszczycki"
        />
        <Field
          label="Email"
          value={user.email}
          icon={Mail}
          locked
          tip="Contact support to change your email"
        />
        <Field
          label="Username"
          value={user.username}
          icon={User}
          locked
          tip="Username can't be changed"
        />
        <Field
          label="Phone"
          value={form.phone}
          editing={editing}
          onChange={(v) => set("phone", v)}
          icon={Phone}
          placeholder="+48 XXX XXX XXX"
        />
        <Field
          label="Country"
          value={form.country}
          editing={editing}
          onChange={(v) => set("country", v)}
          icon={MapPin}
          placeholder="PL"
        />
        <div className="sm:col-span-2 grid sm:grid-cols-2 gap-5 pt-5 border-t border-gray-100">
          <Field
            label="Birth Date"
            value={user.birthDate ? formatDate(user.birthDate) : "—"}
            icon={Calendar}
            locked
          />
          <Field
            label="Member Since"
            value={
              user.createdAt
                ? formatDate(user.createdAt)
                : "—"
            }
            icon={Calendar}
            locked
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  icon: Icon,
  placeholder,
  locked,
  tip,
}: {
  label: string;
  value: string;
  editing?: boolean;
  onChange?: (v: string) => void;
  icon: typeof User;
  placeholder?: string;
  locked?: boolean;
  tip?: string;
}) {
  const showInput = editing && !locked;
  return (
    <div>
      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
        />
        {showInput ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
          />
        ) : (
          <div
            className={`pl-10 pr-4 py-3 rounded-xl text-sm font-medium ${
              locked
                ? "bg-gray-50 border border-gray-100 text-gray-500"
                : "bg-gray-50 border border-gray-100 text-gray-900"
            }`}
          >
            {value || <span className="text-gray-300">Not set</span>}
            {locked && (
              <Lock
                size={11}
                className="inline-block ml-1.5 text-gray-300 align-text-top"
              />
            )}
          </div>
        )}
      </div>
      {tip && <p className="text-[11px] text-gray-400 mt-1.5">{tip}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: ACTIVITY
// ═══════════════════════════════════════════════════════════════════════════════

function ActivityTab({
  user,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}) {
  const items: {
    icon: typeof User;
    label: string;
    value: string;
    accent: string;
  }[] = [
    {
      icon: Clock,
      label: "Last Login",
      value: relativeTime(user.lastLogin),
      accent: "text-blue-500 bg-blue-50",
    },
    {
      icon: Activity,
      label: "Last Activity",
      value: relativeTime(user.lastActivity),
      accent: "text-emerald-500 bg-emerald-50",
    },
    {
      icon: Calendar,
      label: "Account Created",
      value: formatDate(user.createdAt),
      accent: "text-violet-500 bg-violet-50",
    },
    {
      icon: ShieldCheck,
      label: "Account Status",
      value:
        (user.status ?? "active").charAt(0).toUpperCase() +
        (user.status ?? "active").slice(1),
      accent:
        user.status === "suspended" || user.status === "banned"
          ? "text-red-500 bg-red-50"
          : "text-emerald-500 bg-emerald-50",
    },
  ];

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">
              Recent Activity
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Your account events at a glance
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.accent}`}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900">
                      {item.label}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-500 tabular-nums">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200 rounded-3xl p-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-2">
            Account Security
          </h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Your account is{" "}
            {user.isVerified ? (
              <span className="font-bold text-emerald-600">verified</span>
            ) : (
              <span className="font-bold text-amber-600">unverified</span>
            )}
            . We'll alert you about any unusual sign-ins.
          </p>
          <Link
            href="/settings/security"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-bold hover:shadow-md transition-shadow"
          >
            Security Settings
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

function SettingsTab({ onLogout }: { onLogout: () => Promise<void> }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-3">
        <SettingRow
          icon={Mail}
          title="Email Notifications"
          subtitle="Get notified about bids, wins and listings via email"
          action="Coming soon"
        />
        <SettingRow
          icon={Phone}
          title="SMS Alerts"
          subtitle="Critical alerts via text message"
          action="Coming soon"
        />
        <SettingRow
          icon={ShieldCheck}
          title="Two-Factor Authentication"
          subtitle="Add an extra layer of security to your account"
          action="Coming soon"
        />
        <SettingRow
          icon={Lock}
          title="Change Password"
          subtitle="Update your account password"
          action="Coming soon"
        />
      </div>

      <div className="lg:col-span-5">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">
              Account
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <span className="flex items-center gap-3 text-sm font-bold text-gray-900">
                <LogOut size={15} />
                Sign Out
              </span>
              <ChevronRight
                size={14}
                className="text-gray-400 group-hover:translate-x-0.5 transition-transform"
              />
            </button>
            <button
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors group"
              title="Coming soon"
            >
              <span className="flex items-center gap-3 text-sm font-bold text-red-600">
                <X size={15} />
                Delete Account
              </span>
              <ChevronRight
                size={14}
                className="text-red-300 group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof User;
  title: string;
  subtitle: string;
  action: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon size={17} className="text-gray-700" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black text-gray-900">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full whitespace-nowrap">
        {action}
      </span>
    </div>
  );
}
