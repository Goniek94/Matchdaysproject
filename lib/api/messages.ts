/**
 * Messages API Service
 * Handles all messaging-related API calls
 */

import apiClient from "./client";
import type {
  Conversation,
  ConversationMessagesResponse,
  Message,
  MessageFolder,
  SendMessagePayload,
  SendToAuctionPayload,
  UnreadCountResponse,
} from "@/types/features/messages.types";

// ==================== CONVERSATIONS ====================

/**
 * Get user conversations for a specific folder
 */
export const getConversations = async (
  folder: MessageFolder = "inbox",
): Promise<Conversation[]> => {
  const response = await apiClient.get("/messages/conversations", {
    params: { folder },
  });
  return response.data;
};

/**
 * Get messages in a conversation
 */
export const getConversationMessages = async (
  conversationId: string,
  limit: number = 50,
  offset: number = 0,
): Promise<ConversationMessagesResponse> => {
  const response = await apiClient.get(
    `/messages/conversations/${conversationId}/messages`,
    { params: { limit, offset } },
  );
  return response.data;
};

/**
 * Mark conversation as read
 */
export const markConversationAsRead = async (
  conversationId: string,
): Promise<void> => {
  await apiClient.patch(`/messages/conversations/${conversationId}/read`);
};

/**
 * Toggle star on a conversation
 */
export const toggleConversationStar = async (
  conversationId: string,
): Promise<void> => {
  await apiClient.patch(`/messages/conversations/${conversationId}/star`);
};

/**
 * Move conversation to a folder
 */
export const moveConversation = async (
  conversationId: string,
  folder: MessageFolder,
): Promise<void> => {
  await apiClient.patch(`/messages/conversations/${conversationId}/move`, {
    folder,
  });
};

// ==================== MESSAGES ====================

/**
 * Send a message to a user
 */
export const sendMessage = async (
  recipientId: string,
  payload: SendMessagePayload,
): Promise<Message> => {
  const response = await apiClient.post(
    `/messages/send/${recipientId}`,
    payload,
  );
  return response.data;
};

/**
 * Send a message to an auction owner
 */
export const sendMessageToAuction = async (
  auctionId: string,
  payload: SendToAuctionPayload,
): Promise<Message> => {
  const response = await apiClient.post(
    `/messages/send-to-auction/${auctionId}`,
    payload,
  );
  return response.data;
};

/**
 * Edit a message
 */
export const editMessage = async (
  messageId: string,
  content: string,
): Promise<Message> => {
  const response = await apiClient.patch(`/messages/${messageId}/edit`, {
    content,
  });
  return response.data;
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId: string): Promise<void> => {
  await apiClient.delete(`/messages/${messageId}`);
};

// ==================== STATS ====================

/**
 * Get unread message count
 */
export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await apiClient.get("/messages/unread-count");
  return response.data;
};
