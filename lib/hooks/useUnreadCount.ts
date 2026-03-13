"use client";

import { useState, useEffect, useCallback } from "react";
import * as messagesApi from "@/lib/api/messages";

/**
 * Hook for tracking unread message count (used in Navbar)
 */
export function useUnreadCount(pollInterval: number = 30000) {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const data = await messagesApi.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch {
      // Silently fail - user might not be logged in
    }
  }, []);

  useEffect(() => {
    fetchCount();

    // Poll for new messages
    const interval = setInterval(fetchCount, pollInterval);
    return () => clearInterval(interval);
  }, [fetchCount, pollInterval]);

  return { unreadCount, refresh: fetchCount };
}
