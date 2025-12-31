import Link from "next/link";
import { User, Crown, Settings, Mail, Calendar, Shield } from "lucide-react";

interface DashboardHeaderProps {
  userData: any;
}

export default function DashboardHeader({ userData }: DashboardHeaderProps) {
  const userStats = {
    subscriptionTier: userData?.subscriptionTier || "free",
    memberSince: userData?.createdAt || "2024-01-15",
    totalListings: userData?.totalListings || 12,
    activeBids: userData?.activeBids || 3,
  };

  const getSubscriptionConfig = (tier: string) => {
    const configs = {
      free: {
        label: "Free Plan",
        color: "from-gray-400 to-gray-500",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        icon: null,
        features: ["5 listings/month", "Basic support"],
      },
      basic: {
        label: "Basic Plan",
        color: "from-blue-400 to-blue-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        icon: <Shield size={16} />,
        features: ["20 listings/month", "Priority support", "Analytics"],
      },
      premium: {
        label: "Premium Plan",
        color: "from-purple-400 to-purple-600",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
        icon: <Crown size={16} />,
        features: [
          "Unlimited listings",
          "VIP support",
          "Advanced analytics",
          "Featured listings",
        ],
      },
      vip: {
        label: "VIP Plan",
        color: "from-yellow-400 to-orange-500",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        icon: <Crown size={16} className="text-yellow-600" />,
        features: [
          "Everything in Premium",
          "Personal account manager",
          "Custom branding",
        ],
      },
    };
    return configs[tier as keyof typeof configs] || configs.free;
  };

  const subscription = getSubscriptionConfig(userStats.subscriptionTier);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Gradient Header */}
      <div className={`h-24 bg-gradient-to-r ${subscription.color} relative`}>
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${subscription.color} flex items-center justify-center`}
              >
                <User size={40} className="text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-16 px-6 pb-6">
        {/* Name & Email */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {userData?.username || "User"}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Mail size={14} />
            <span>{userData?.email || "user@example.com"}</span>
          </div>
        </div>

        {/* Subscription Badge */}
        <div className={`${subscription.bgColor} rounded-xl p-4 mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {subscription.icon}
              <span className={`font-bold ${subscription.textColor}`}>
                {subscription.label}
              </span>
            </div>
            {userStats.subscriptionTier === "free" && (
              <Link
                href="/pricing"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Upgrade →
              </Link>
            )}
          </div>
          <ul className="space-y-1">
            {subscription.features.map((feature, index) => (
              <li
                key={index}
                className="text-xs text-gray-600 flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-black text-gray-900">
              {userStats.totalListings}
            </div>
            <div className="text-xs text-gray-600 font-medium">
              Total Listings
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-black text-gray-900">
              {userStats.activeBids}
            </div>
            <div className="text-xs text-gray-600 font-medium">Active Bids</div>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar size={14} />
          <span>
            Member since{" "}
            {new Date(userStats.memberSince).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            href="/settings"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            <Settings size={18} />
            Account Settings
          </Link>
          {userStats.subscriptionTier === "free" && (
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg"
            >
              <Crown size={18} />
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
