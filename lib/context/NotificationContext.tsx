"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { getUnreadCount } from "@/lib/api/notifications";
import { logger } from "@/lib/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IncomingNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshUnreadCount: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

// ─── URL safety ───────────────────────────────────────────────────────────────

/**
 * Only allow safe relative paths (starting with /) or explicitly trusted origins.
 * Blocks javascript:, data:, vbscript: and any external URLs we don't control.
 */
function isSafeLink(link: string | null | undefined): link is string {
  if (!link) return false;
  // Relative path — safe
  if (link.startsWith("/")) return true;
  // Absolute URL on the same origin — safe
  try {
    const url = new URL(link);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

// ─── Toast per notification type ─────────────────────────────────────────────

const TOAST_ICONS: Record<string, string> = {
  auction_won: "🏆",
  auction_ended: "🔨",
  bid_placed: "🔨",
  bid_outbid: "⚡",
  listing_published: "🏷️",
  listing_favorited: "❤️",
  payment_completed: "💳",
  payment_received: "💳",
  system: "📢",
};

function showNotificationToast(notification: IncomingNotification) {
  const icon = TOAST_ICONS[notification.type] ?? "🔔";

  toast(
    <div
      className="cursor-pointer"
      onClick={() => {
        if (isSafeLink(notification.link)) window.location.href = notification.link;
      }}
    >
      <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
    </div>,
    {
      icon,
      duration: 5000,
      style: {
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      },
    }
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.count ?? 0);
    } catch (err) {
      logger.warn("Failed to fetch unread count", "NotificationContext", err);
    }
  }, [isAuthenticated]);

  // Initial fetch
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  // Socket.io connection
  useEffect(() => {
    if (!isAuthenticated) return;

    // Derive WebSocket base URL with the same env hierarchy as the
    // REST client and useAuctionRealtime — BACKEND_URL is the new
    // canonical name; API_URL is kept as legacy fallback so we don't
    // silently break sockets when only one of the env vars is set.
    const rawBackendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL;
    if (!rawBackendUrl) {
      logger.error(
        "Neither NEXT_PUBLIC_BACKEND_URL nor NEXT_PUBLIC_API_URL is set — notification socket will not connect.",
        "NotificationContext",
      );
      return;
    }
    const apiUrl = rawBackendUrl.replace(/\/api\/v1\/?$/, "");

    const socket = io(`${apiUrl}/notifications`, {
      withCredentials: true,         // sends HttpOnly cookie automatically
      transports: ["websocket", "polling"], // polling as fallback if WS fails
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      logger.info(
        `Socket connected (${socket.io.engine.transport.name})`,
        "NotificationContext",
      );
    });

    socket.on("connect_error", (err) => {
      logger.warn("Socket connection error", "NotificationContext", err);
    });

    socket.on("notification", (notification: IncomingNotification) => {
      showNotificationToast(notification);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("disconnect", (reason) => {
      logger.info(`Socket disconnected: ${reason}`, "NotificationContext");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  // Disconnect on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      socketRef.current?.disconnect();
      socketRef.current = null;
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}
