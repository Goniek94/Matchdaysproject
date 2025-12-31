import Link from "next/link";
import {
  PlusCircle,
  Package,
  Gavel,
  Heart,
  Bell,
  Trophy,
  Activity,
} from "lucide-react";

export { default as DashboardHeader } from "./DashboardHeader";
export { default as RankingSection } from "./RankingSection";
export { default as StatsSection } from "./StatsSection";
export { default as RecentMatchesSection } from "./RecentMatchesSection";
export { default as UpcomingEventsSection } from "./UpcomingEventsSection";

// Quick Actions - Main CTAs
export const QuickActionsSection = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-lg font-bold mb-4 text-gray-900">Quick Actions</h2>
    <div className="space-y-3">
      <Link
        href="/add-listing"
        className="flex items-center gap-3 w-full px-4 py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all font-semibold shadow-lg group"
      >
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <PlusCircle size={20} />
        </div>
        <span>Create New Listing</span>
      </Link>
      <Link
        href="/my-listings"
        className="flex items-center gap-3 w-full px-4 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-semibold text-gray-700"
      >
        <Package size={20} />
        <span>My Listings</span>
      </Link>
      <Link
        href="/my-bids"
        className="flex items-center gap-3 w-full px-4 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-semibold text-gray-700"
      >
        <Gavel size={20} />
        <span>My Bids</span>
      </Link>
      <Link
        href="/favorites"
        className="flex items-center gap-3 w-full px-4 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-semibold text-gray-700"
      >
        <Heart size={20} />
        <span>Favorites</span>
      </Link>
    </div>
  </div>
);

// My Auctions/Listings
export const AuctionsSection = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
      <Link
        href="/my-listings"
        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View All →
      </Link>
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Vintage Jersey #{i}</h3>
            <p className="text-sm text-gray-600">3 bids • Ends in 2 days</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">$120</div>
            <div className="text-xs text-green-600">Active</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Activity Feed
export const ActivitySection = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center gap-2 mb-4">
      <Activity size={20} className="text-gray-700" />
      <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
    </div>
    <div className="space-y-3">
      {[
        "New bid on your listing",
        "Your bid was outbid",
        "Listing approved",
      ].map((activity, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">{activity}</p>
            <p className="text-xs text-gray-500">{i + 1} hours ago</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Leagues/Competitions - Link to Arena
export const LeaguesSection = () => (
  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
    <div className="flex items-center gap-2 mb-3">
      <Trophy size={24} className="text-yellow-300" />
      <h2 className="text-xl font-bold">Matchdays Arena</h2>
    </div>
    <p className="text-white/90 mb-4 text-sm">
      Compete with other players, predict match results, and win amazing prizes!
    </p>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="text-2xl font-black">156</div>
        <div className="text-xs text-white/80">Predictions</div>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="text-2xl font-black">#23</div>
        <div className="text-xs text-white/80">Your Rank</div>
      </div>
    </div>
    <Link
      href="/arena"
      className="block w-full px-4 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-bold text-center shadow-lg"
    >
      Enter Arena →
    </Link>
  </div>
);

// Achievements (placeholder)
export const AchievementsSection = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-lg font-bold mb-4 text-gray-900">Achievements</h2>
    <div className="grid grid-cols-3 gap-3">
      {[
        { emoji: "🏆", name: "First Win", unlocked: true },
        { emoji: "🔥", name: "Hot Streak", unlocked: true },
        { emoji: "⭐", name: "Rising Star", unlocked: false },
        { emoji: "💎", name: "Diamond", unlocked: false },
        { emoji: "👑", name: "Champion", unlocked: false },
        { emoji: "🎯", name: "Sharpshooter", unlocked: true },
      ].map((achievement, i) => (
        <div
          key={i}
          className={`p-3 rounded-xl border-2 text-center transition-all ${
            achievement.unlocked
              ? "border-yellow-300 bg-yellow-50 hover:shadow-md"
              : "border-gray-200 bg-gray-50 opacity-50"
          }`}
        >
          <div className="text-3xl mb-1">{achievement.emoji}</div>
          <div className="text-xs font-semibold text-gray-700">
            {achievement.name}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Notifications
export const NotificationsSection = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center gap-2 mb-4">
      <Bell size={20} className="text-gray-700" />
      <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
    </div>
    <div className="space-y-2">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-900">
          New message received
        </p>
        <p className="text-xs text-blue-600">2 minutes ago</p>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          Your listing was viewed 15 times
        </p>
        <p className="text-xs text-gray-500">1 hour ago</p>
      </div>
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm font-medium text-green-900">
          Prediction was correct! +15 pts
        </p>
        <p className="text-xs text-green-600">3 hours ago</p>
      </div>
    </div>
  </div>
);
