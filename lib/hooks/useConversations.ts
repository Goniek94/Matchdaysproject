"use client";

import { useState, useEffect, useCallback } from "react";
import type { Conversation, MessageFolder } from "@/types/features/messages.types";
import * as messagesApi from "@/lib/api/messages";
import { logger } from "@/lib/logger";

function extractErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data &&
    typeof (err.response.data as Record<string, unknown>).message === "string"
  ) {
    return (err.response.data as { message: string }).message;
  }
  return fallback;
}

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
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Failed to load conversations");
      setError(msg);
      logger.warn("fetchConversations failed", "useConversations", err);
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
        prev.map((c) => (c.id === conversationId ? { ...c, isStarred: !c.isStarred } : c)),
      );
    } catch (err: unknown) {
      logger.error("toggleStar failed", "useConversations", err);
    }
  }, []);

  const moveToFolder = useCallback(
    async (conversationId: string, targetFolder: MessageFolder) => {
      try {
        await messagesApi.moveConversation(conversationId, targetFolder);
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      } catch (err: unknown) {
        logger.error("moveToFolder failed", "useConversations", err);
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
