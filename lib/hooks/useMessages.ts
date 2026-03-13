"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Message, MessageUser } from "@/types/features/messages.types";
import * as messagesApi from "@/lib/api/messages";

/**
 * Hook for managing messages within a conversation
 */
export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<MessageUser | null>(null);
  const [auctionId, setAuctionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(0);

  // Fetch messages for the conversation
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

      // Mark as read
      await messagesApi.markConversationAsRead(conversationId);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load messages");
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

  // Send a message
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
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to send message");
        throw err;
      } finally {
        setSending(false);
      }
    },
    [otherUser, auctionId],
  );

  // Load more (older) messages
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
    } catch (err) {
      console.error("Failed to load more messages:", err);
    }
  }, [conversationId, hasMore]);

  // Edit a message
  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      try {
        const updated = await messagesApi.editMessage(messageId, newContent);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? updated : m)),
        );
      } catch (err) {
        console.error("Failed to edit message:", err);
        throw err;
      }
    },
    [],
  );

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messagesApi.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error("Failed to delete message:", err);
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
