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
        if (notification.link) window.location.href = notification.link;
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
    } catch {
      // Silently fail
    }
  }, [isAuthenticated]);

  // Initial fetch
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  // Socket.io connection
  useEffect(() => {
    if (!isAuthenticated) return;

    // Strip /api/v1 from the API URL to get the base WebSocket URL
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(`${apiUrl}/notifications`, {
      withCredentials: true,         // sends HttpOnly cookie automatically
      transports: ["websocket", "polling"], // polling as fallback if WS fails
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Notifications] Socket connected, transport:", socket.io.engine.transport.name);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Notifications] Connection error:", err.message);
    });

    socket.on("notification", (notification: IncomingNotification) => {
      showNotificationToast(notification);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Notifications] Socket disconnected:", reason);
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
