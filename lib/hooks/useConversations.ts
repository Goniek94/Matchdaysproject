"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Conversation,
  MessageFolder,
} from "@/types/features/messages.types";
import * as messagesApi from "@/lib/api/messages";

/**
 * Hook for managing conversations list
 */
export function useConversations(initialFolder: MessageFolder = "inbox") {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [folder, setFolder] = useState<MessageFolder>(initialFolder);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagesApi.getConversations(folder);
      setConversations(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const toggleStar = useCallback(async (conversationId: string) => {
    try {
      await messagesApi.toggleConversationStar(conversationId);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, isStarred: !c.isStarred } : c,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle star:", err);
    }
  }, []);

  const moveToFolder = useCallback(
    async (conversationId: string, targetFolder: MessageFolder) => {
      try {
        await messagesApi.moveConversation(conversationId, targetFolder);
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      } catch (err) {
        console.error("Failed to move conversation:", err);
      }
    },
    [],
  );

  return {
    conversations,
    folder,
    setFolder,
    loading,
    error,
    refresh: fetchConversations,
    toggleStar,
    moveToFolder,
  };
}
