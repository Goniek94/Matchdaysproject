"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Trophy,
  Gavel,
  Tag,
  Heart,
  CreditCard,
  Megaphone,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  type Notification,
} from "@/lib/api/notifications";

// ─── Notification type config ─────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  auction_won: {
    icon: <Trophy size={18} />,
    color: "text-yellow-500 bg-yellow-50",
    label: "Auction Won",
  },
  auction_ended: {
    icon: <Gavel size={18} />,
    color: "text-gray-500 bg-gray-100",
    label: "Auction Ended",
  },
  bid_placed: {
    icon: <Gavel size={18} />,
    color: "text-blue-500 bg-blue-50",
    label: "New Bid",
  },
  bid_outbid: {
    icon: <Gavel size={18} />,
    color: "text-red-500 bg-red-50",
    label: "Outbid",
  },
  listing_published: {
    icon: <Tag size={18} />,
    color: "text-green-500 bg-green-50",
    label: "Listing Published",
  },
  listing_favorited: {
    icon: <Heart size={18} />,
    color: "text-pink-500 bg-pink-50",
    label: "Favorited",
  },
  payment_completed: {
    icon: <CreditCard size={18} />,
    color: "text-emerald-500 bg-emerald-50",
    label: "Payment",
  },
  payment_received: {
    icon: <CreditCard size={18} />,
    color: "text-emerald-500 bg-emerald-50",
    label: "Payment Received",
  },
  system: {
    icon: <Megaphone size={18} />,
    color: "text-purple-500 bg-purple-50",
    label: "System",
  },
};

function getTypeConfig(type: string) {
  return (
    TYPE_CONFIG[type] ?? {
      icon: <Bell size={18} />,
      color: "text-gray-500 bg-gray-100",
      label: "Notification",
    }
  );
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  let relative: string;
  if (minutes < 1) relative = "Just now";
  else if (minutes < 60) relative = `${minutes}m ago`;
  else if (hours < 24) relative = `${hours}h ago`;
  else if (days < 7) relative = `${days}d ago`;
  else relative = "";

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { relative, full: `${datePart}, ${timePart}` };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      // API returns array directly or wrapped — handle both
      const data = Array.isArray(res) ? res : (res as any)?.data ?? [];
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteAll = async () => {
    await deleteAllNotifications();
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-base text-gray-500 mt-1">
                {unreadCount} unread
              </p>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors px-4 py-2 rounded-xl hover:bg-gray-100"
                >
                  <CheckCheck size={17} />
                  Mark all read
                </button>
              )}
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
              >
                <Trash2 size={17} />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 animate-pulse flex gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100">
            <Bell size={56} className="mx-auto text-gray-300 mb-5" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No notifications yet
            </h2>
            <p className="text-gray-400">
              We&apos;ll notify you about bids, auctions, and activity.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const config = getTypeConfig(notification.type);
              const time = formatTime(notification.createdAt);
              // Only treat as a link if it's a safe relative path
              const isSafeLink = (link: string | null | undefined): link is string => {
                if (!link) return false;
                if (link.startsWith("/")) return true;
                try { return new URL(link).origin === window.location.origin; } catch { return false; }
              };
              const hasLink = isSafeLink(notification.link);

              const cardContent = (
                <div className="flex items-start gap-5 p-5">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}
                  >
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-base font-semibold leading-snug ${
                            notification.read ? "text-gray-700" : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        {hasLink && (
                          <p className="text-xs text-blue-500 mt-1.5 font-medium">
                            Click to view →
                          </p>
                        )}
                      </div>
                      {/* Time */}
                      <div className="text-right flex-shrink-0">
                        {time.relative && (
                          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">
                            {time.relative}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                          {time.full}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions — stop propagation so delete/read don't also navigate */}
                  <div
                    className="flex items-center gap-1.5 flex-shrink-0 pt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {hasLink && (
                      <ChevronRight size={18} className="text-gray-300" />
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );

              return hasLink ? (
                <Link
                  key={notification.id}
                  href={notification.link as string}
                  onClick={() =>
                    !notification.read && handleMarkAsRead(notification.id)
                  }
                  className={`block rounded-2xl border transition-all ${
                    notification.read
                      ? "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300"
                      : "bg-blue-50/60 border-l-4 border-l-black border-blue-100 shadow-md hover:shadow-lg"
                  } cursor-pointer`}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={notification.id}
                  className={`rounded-2xl border transition-all ${
                    notification.read
                      ? "bg-white border-gray-100 shadow-sm"
                      : "bg-blue-50/60 border-l-4 border-l-black border-blue-100 shadow-md"
                  }`}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
