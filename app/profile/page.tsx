"use client";

/**
 * My Profile — editorial monochrome.
 *
 * Design rules (do not deviate without a reason):
 *   • One column of content, one column of "metadata" — no tabs, the user
 *     should see everything they own in one scroll.
 *   • Strictly monochrome: black / white / 5 shades of gray. The only colour
 *     ever permitted is the live-status dot (emerald) — and only because
 *     an absence of colour there would be ambiguous.
 *   • No gradients, no decorative blobs, no glassmorphism. Reference: the
 *     dashboards at linear.app / stripe.com / vercel.com.
 *   • Numbers are tabular (`tabular-nums`) and never coloured. Hierarchy
 *     comes from size + weight, not hue.
 *   • Section headings: tiny, uppercase, gray-400, wide tracking. Body:
 *     `text-gray-900`. Helper copy: `text-gray-500`. That's the full palette.
 *
 * Sections, top to bottom:
 *   1. Identity card — avatar, username, real name, location, joined date,
 *      verification / role badges, one Edit toggle.
 *   2. Headline stats — sales · rating · positive · level, inline + dividers.
 *   3. Activity — quick-link rows with counts (listings / won / favourites).
 *   4. Personal information — email / username / phone / country / address;
 *      Edit toggle reveals inline inputs.
 *   5. Account activity — last login / last activity / created / status.
 *   6. Account actions — sign out / danger zone, no decoration.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Edit3,
  ExternalLink,
  Heart,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShieldCheck,
  Trophy,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { updateProfile } from "@/lib/api/auth";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatJoined(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "long",
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
  // Backend rule: every 500 pts → +1 level, max 100.
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

  // Redirect guests after auth check completes.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-gray-50 rounded-2xl h-40 animate-pulse mb-6" />
          <div className="bg-gray-50 rounded-2xl h-24 animate-pulse mb-6" />
          <div className="bg-gray-50 rounded-2xl h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
          <Lock size={28} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Sign in required
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Log in to view your profile.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Go to homepage
        </Link>
      </div>
    );
  }

  const initials =
    user.username?.[0]?.toUpperCase() ??
    user.name?.[0]?.toUpperCase() ??
    "?";
  const level = user.level ?? 1;
  const points = user.totalPoints ?? 0;
  const lvl = levelProgress(points, level);

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-16">
        {/* ─────────────────────────────────────────────────────────────
             1. IDENTITY
            ───────────────────────────────────────────────────────────── */}
        <IdentityCard
          user={user}
          initials={initials}
          onRefresh={refreshUser}
        />

        {/* ─────────────────────────────────────────────────────────────
             2. HEADLINE STATS — inline with vertical dividers
            ───────────────────────────────────────────────────────────── */}
        <HeadlineStats user={user} level={level} />

        {/* ─────────────────────────────────────────────────────────────
             3. ACTIVITY — quick links to dependent screens
            ───────────────────────────────────────────────────────────── */}
        <Section
          eyebrow="Activity"
          title="Your marketplace"
          subtitle="What you have on the platform right now."
        >
          <ActivityList user={user} />
        </Section>

        {/* ─────────────────────────────────────────────────────────────
             4. LEVEL — small monochrome block, no fanfare
            ───────────────────────────────────────────────────────────── */}
        <Section
          eyebrow="Progression"
          title={`Level ${level}`}
          subtitle="Earn points by listing, bidding and selling."
        >
          <LevelBlock points={points} lvl={lvl} />
        </Section>

        {/* ─────────────────────────────────────────────────────────────
             5. PERSONAL INFORMATION — inline editor
            ───────────────────────────────────────────────────────────── */}
        <Section
          eyebrow="Personal information"
          title="Account details"
          subtitle="Visible only to you. Address lives in settings."
        >
          <PersonalInfo user={user} onSaved={refreshUser} />
        </Section>

        {/* ─────────────────────────────────────────────────────────────
             6. ACTIVITY LOG — read-only timestamps
            ───────────────────────────────────────────────────────────── */}
        <Section eyebrow="Account activity" title="Recent events">
          <ActivityLog user={user} />
        </Section>

        {/* ─────────────────────────────────────────────────────────────
             7. ACCOUNT ACTIONS — sign out, danger
            ───────────────────────────────────────────────────────────── */}
        <Section eyebrow="Account" title="Manage">
          <AccountActions onLogout={logout} />
        </Section>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// IDENTITY CARD
// ═══════════════════════════════════════════════════════════════════════════════

function IdentityCard({
  user,
  initials,
  onRefresh,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
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

  const fullName = [user.name, user.lastName].filter(Boolean).join(" ");

  return (
    <header className="flex items-start gap-6">
      {/* Avatar — flat, solid, no gradient. Initials in a subtle box. */}
      <div className="relative shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-900 text-white flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {initials}
            </span>
          )}
        </div>
        {/* The single permitted dot of colour — online indicator. */}
        <span
          aria-label="Online"
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
        />
      </div>

      {/* Identity text */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            {user.username}
          </h1>
          {user.isVerified && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-gray-200 text-gray-700 text-[10px] font-semibold uppercase tracking-wider">
              <ShieldCheck size={10} />
              Verified
            </span>
          )}
          {user.role === "admin" && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-gray-900 bg-gray-900 text-white text-[10px] font-semibold uppercase tracking-wider">
              Admin
            </span>
          )}
        </div>

        {fullName && (
          <p className="text-sm text-gray-900 font-medium">{fullName}</p>
        )}

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
          {user.country && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} />
              {user.country}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            Joined {formatJoined(user.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions — secondary icon-only buttons; no shouting */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title="Refresh"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
        </button>
        <Link
          href={`/profile/${user.username}`}
          title="Public view"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ExternalLink size={15} />
        </Link>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEADLINE STATS
// ═══════════════════════════════════════════════════════════════════════════════

function HeadlineStats({
  user,
  level,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  level: number;
}) {
  const items = [
    { label: "Sales", value: (user.sales ?? 0).toLocaleString() },
    {
      label: "Rating",
      value: (user.rating ?? 0).toFixed(1),
      sub: `${user.reviews ?? 0} reviews`,
    },
    { label: "Positive", value: `${Math.round(user.positivePercentage ?? 100)}%` },
    { label: "Level", value: String(level) },
  ];

  return (
    <div className="border-y border-gray-200 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 sm:divide-x sm:divide-gray-100">
        {items.map((s) => (
          <div key={s.label} className="sm:px-6 first:sm:pl-0 last:sm:pr-0">
            <div className="text-2xl sm:text-[28px] font-semibold text-gray-900 tabular-nums tracking-tight leading-none">
              {s.value}
            </div>
            <div className="mt-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              {s.label}
            </div>
            {s.sub && (
              <div className="text-[11px] text-gray-400 mt-0.5">{s.sub}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — shared shell for everything below the hero
// ═══════════════════════════════════════════════════════════════════════════════

function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          {eyebrow}
        </p>
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight mt-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY — quick-link rows
// ═══════════════════════════════════════════════════════════════════════════════

function ActivityList({
  user,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}) {
  const rows = [
    {
      href: "/my-listings",
      icon: Package,
      label: "My listings",
      hint: "Manage active auctions and buy-nows",
    },
    {
      href: "/auctions/my/won",
      icon: Trophy,
      label: "Won auctions",
      hint: "Items you won and still need to pay for",
    },
    {
      href: "/favorites",
      icon: Heart,
      label: "Favorites",
      hint: "Listings you're watching",
    },
    {
      href: "/dashboard",
      icon: Activity,
      label: "Dashboard",
      hint: "Bids, listings and analytics",
    },
  ];
  // Suppress unused-prop warning — the hooks above don't use user yet,
  // but the prop is forwarded so future counts (e.g. unread bids) drop in.
  void user;

  return (
    <ul className="border-t border-gray-100">
      {rows.map(({ href, icon: Icon, label, hint }) => (
        <li key={href} className="border-b border-gray-100">
          <Link
            href={href}
            className="flex items-center gap-4 py-4 group hover:bg-gray-50/60 -mx-2 px-2 rounded-md transition-colors"
          >
            <Icon
              size={16}
              strokeWidth={1.75}
              className="text-gray-400 group-hover:text-gray-900 transition-colors"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{hint}</div>
            </div>
            <ArrowUpRight
              size={14}
              className="text-gray-300 group-hover:text-gray-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL BLOCK — quiet progress bar, no gamification noise
// ═══════════════════════════════════════════════════════════════════════════════

function LevelBlock({
  points,
  lvl,
}: {
  points: number;
  lvl: ReturnType<typeof levelProgress>;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Progress to level {lvl.nextLevel}
          </p>
          <p className="text-sm font-medium text-gray-900 mt-1 tabular-nums">
            {lvl.current.toLocaleString()} /{" "}
            <span className="text-gray-400">{lvl.needed.toLocaleString()} XP</span>
          </p>
        </div>
        <p className="text-xs text-gray-400 tabular-nums">
          {points.toLocaleString()} total
        </p>
      </div>

      {/* Mono progress bar — black on light gray */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-500"
          style={{ width: `${lvl.pct}%` }}
        />
      </div>

      <Link
        href="/rewards"
        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 mt-4 transition-colors"
      >
        Earn more points
        <ChevronRight size={12} />
      </Link>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONAL INFORMATION — inline editor
// ═══════════════════════════════════════════════════════════════════════════════

function PersonalInfo({
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
    <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5">
        <p className="text-xs text-gray-500">
          {editing
            ? "Edit your details, then save."
            : "Tap edit to change name, phone or country."}
        </p>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            <Edit3 size={12} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-md text-xs font-semibold hover:bg-black transition-colors disabled:opacity-50"
            >
              <Check size={12} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 px-5 py-3 text-xs ${
            feedback.kind === "success"
              ? "text-emerald-700 bg-emerald-50/60"
              : "text-red-700 bg-red-50/60"
          }`}
        >
          {feedback.kind === "success" ? (
            <Check size={13} />
          ) : (
            <AlertCircle size={13} />
          )}
          {feedback.msg}
        </div>
      )}

      {/* Rows — definition-list style: 1/3 label, 2/3 value */}
      <DLRow label="First name">
        <FieldValue
          editing={editing}
          value={form.name}
          onChange={(v) => set("name", v)}
          placeholder="Mateusz"
        />
      </DLRow>
      <DLRow label="Last name">
        <FieldValue
          editing={editing}
          value={form.lastName}
          onChange={(v) => set("lastName", v)}
          placeholder="Goszczycki"
        />
      </DLRow>
      <DLRow label="Username" locked>
        <FieldValue
          locked
          value={user.username}
          tip="Username can't be changed."
        />
      </DLRow>
      <DLRow label="Email" locked>
        <FieldValue
          locked
          value={user.email}
          icon={Mail}
          tip="Contact support to change your email."
        />
      </DLRow>
      <DLRow label="Phone">
        <FieldValue
          editing={editing}
          value={form.phone}
          onChange={(v) => set("phone", v)}
          icon={Phone}
          placeholder="+48 XXX XXX XXX"
        />
      </DLRow>
      <DLRow label="Country">
        <FieldValue
          editing={editing}
          value={form.country}
          onChange={(v) => set("country", v)}
          icon={MapPin}
          placeholder="Poland"
        />
      </DLRow>
      <DLRow label="Delivery address">
        <Link
          href="/settings#address"
          className="inline-flex items-center gap-1 text-sm text-gray-900 hover:text-gray-600 transition-colors"
        >
          Manage in settings
          <ChevronRight size={12} />
        </Link>
      </DLRow>
      <DLRow label="Birth date" locked>
        <FieldValue
          locked
          value={user.birthDate ? formatDate(user.birthDate) : ""}
        />
      </DLRow>
      <DLRow label="Member since" locked>
        <FieldValue locked value={formatDate(user.createdAt)} />
      </DLRow>
    </div>
  );
}

function DLRow({
  label,
  locked,
  children,
}: {
  label: string;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-5 py-3.5 items-center">
      <dt className="text-xs text-gray-500 inline-flex items-center gap-1">
        {label}
        {locked && <Lock size={10} className="text-gray-300" />}
      </dt>
      <dd className="sm:col-span-2 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

function FieldValue({
  editing,
  locked,
  value,
  onChange,
  placeholder,
  icon: Icon,
  tip,
}: {
  editing?: boolean;
  locked?: boolean;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  icon?: typeof Mail;
  tip?: string;
}) {
  if (editing && !locked) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors"
      />
    );
  }
  return (
    <div>
      <span
        className={`inline-flex items-center gap-1.5 ${
          value ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {Icon && <Icon size={12} className="text-gray-400" />}
        {value || "Not set"}
      </span>
      {tip && !value && (
        <p className="text-[11px] text-gray-400 mt-0.5">{tip}</p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY LOG — last login / last activity / created / status
// ═══════════════════════════════════════════════════════════════════════════════

function ActivityLog({
  user,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}) {
  const rows = [
    { label: "Last sign-in", value: relativeTime(user.lastLogin) },
    { label: "Last activity", value: relativeTime(user.lastActivity) },
    { label: "Account created", value: formatDate(user.createdAt) },
    {
      label: "Account status",
      value:
        (user.status ?? "active").charAt(0).toUpperCase() +
        (user.status ?? "active").slice(1),
    },
  ];

  return (
    <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
      {rows.map((r) => (
        <div
          key={r.label}
          className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-5 py-3.5 items-center"
        >
          <dt className="text-xs text-gray-500">{r.label}</dt>
          <dd className="sm:col-span-2 text-sm text-gray-900 tabular-nums">
            {r.value}
          </dd>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNT ACTIONS — sign out + danger zone
// ═══════════════════════════════════════════════════════════════════════════════

function AccountActions({ onLogout }: { onLogout: () => Promise<void> }) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await onLogout();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="w-full flex items-center justify-between px-5 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-900 disabled:opacity-50"
      >
        <span className="inline-flex items-center gap-2">
          <LogOut size={14} className="text-gray-400" />
          {signingOut ? "Signing out…" : "Sign out"}
        </span>
        <ChevronRight size={14} className="text-gray-300" />
      </button>

      <Link
        href="/settings#address"
        className="w-full flex items-center justify-between px-5 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-900"
      >
        <span className="inline-flex items-center gap-2">
          <UserIcon size={14} className="text-gray-400" />
          All settings
        </span>
        <ChevronRight size={14} className="text-gray-300" />
      </Link>
    </div>
  );
}
