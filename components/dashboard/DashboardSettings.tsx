import Link from "next/link";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SETTINGS_SECTIONS: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    icon: User,
    title: "Profile",
    description: "Update your name, username and avatar",
    href: "/settings/profile",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Manage email and push notification preferences",
    href: "/settings/notifications",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Password, two-factor authentication",
    href: "/settings/security",
  },
  {
    icon: CreditCard,
    title: "Billing",
    description: "Payment methods and transaction history",
    href: "/settings/billing",
  },
  {
    icon: Globe,
    title: "Preferences",
    description: "Language, currency and display settings",
    href: "/settings/preferences",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardSettings() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-gray-900">Settings</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your account preferences
        </p>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-2xl border border-gray-200/60 divide-y divide-gray-100 overflow-hidden">
        {SETTINGS_SECTIONS.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
              <Icon size={18} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            </div>
            <ChevronRight
              size={16}
              className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
            />
          </Link>
        ))}
      </div>

      {/* Full settings link */}
      <p className="text-xs text-gray-400 text-center">
        For more options, visit the{" "}
        <Link
          href="/settings"
          className="font-bold text-gray-600 hover:text-gray-900 underline"
        >
          full settings page
        </Link>
      </p>
    </div>
  );
}
