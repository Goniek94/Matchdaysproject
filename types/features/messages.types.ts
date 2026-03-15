
/**
 * Messages Types
 * TypeScript type definitions for messaging features
 */

// ============================================
// USER IN MESSAGES
// ============================================

export interface MessageUser {
  id: string;
  username: string;
  avatar: string | null;
}

// ============================================
// MESSAGE
// ============================================

export interface Message {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  read: boolean;
  readAt: string | null;
  edited: boolean;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sender: MessageUser;
}

// ============================================
// CONVERSATION
// ============================================

export interface LastMessage {
  id: string;
  content: string;
  isFromMe: boolean;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  otherUser: MessageUser;
  auctionId: string | null;
  lastMessage: LastMessage | null;
  isStarred: boolean;
  unreadCount: number;
  lastMessageAt: string | null;
  createdAt: string;
}

// ============================================
// CONVERSATION MESSAGES RESPONSE
// ============================================

export interface ConversationMessagesResponse {
  messages: Message[];
  otherUser: MessageUser;
  auctionId: string | null;
  totalMessages: number;
  hasMore: boolean;
}

// ============================================
// FOLDER TYPES
// ============================================

export type MessageFolder = "inbox" | "archived" | "trash";

// ============================================
// SEND MESSAGE PAYLOADS
// ============================================

export interface SendMessagePayload {
  content: string;
  auctionId?: string;
}

export interface SendToAuctionPayload {
  content: string;
}

// ============================================
// UNREAD COUNT
// ============================================

export interface UnreadCountResponse {
  unreadCount: number;
}
