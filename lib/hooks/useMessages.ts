"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Message, MessageUser } from "@/types/features/messages.types";
import * as messagesApi from "@/lib/api/messages";
import { logger } from "@/lib/logger";

/** Extract a human-readable message from an unknown error */
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

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<MessageUser | null>(null);
  const [auctionId, setAuctionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(0);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await messagesApi.getConversationMessages(conversationId);
      setMessages(data.messages);
      setOtherUser(data.otherUser);
      setAuctionId(data.auctionId);
      setHasMore(data.hasMore);
      offsetRef.current = data.messages.length;
      await messagesApi.markConversationAsRead(conversationId);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Failed to load messages");
      setError(msg);
      logger.warn("fetchMessages failed", "useMessages", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
      setOtherUser(null);
      setAuctionId(null);
    }
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!otherUser) return;

      try {
        setSending(true);
        const newMessage = await messagesApi.sendMessage(otherUser.id, {
          content,
          auctionId: auctionId || undefined,
        });
        setMessages((prev) => [...prev, newMessage]);
      } catch (err: unknown) {
        const msg = extractErrorMessage(err, "Failed to send message");
        setError(msg);
        logger.error("sendMessage failed", "useMessages", err);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [otherUser, auctionId],
  );

  const loadMore = useCallback(async () => {
    if (!conversationId || !hasMore) return;

    try {
      const data = await messagesApi.getConversationMessages(
        conversationId,
        50,
        offsetRef.current,
      );
      setMessages((prev) => [...data.messages, ...prev]);
      setHasMore(data.hasMore);
      offsetRef.current += data.messages.length;
    } catch (err: unknown) {
      logger.warn("loadMore failed", "useMessages", err);
    }
  }, [conversationId, hasMore]);

  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    try {
      const updated = await messagesApi.editMessage(messageId, newContent);
      setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
    } catch (err: unknown) {
      logger.error("editMessage failed", "useMessages", err);
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messagesApi.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err: unknown) {
      logger.error("deleteMessage failed", "useMessages", err);
    }
  }, []);

  return {
    messages,
    otherUser,
    auctionId,
    loading,
    sending,
    hasMore,
    error,
    sendMessage,
    loadMore,
    editMessage,
    deleteMessage,
    refresh: fetchMessages,
  };
}
