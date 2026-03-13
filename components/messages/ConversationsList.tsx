"use client";

import { Star, Archive, Trash2, MoreVertical } from "lucide-react";
import type {
  Conversation,
  MessageFolder,
} from "@/types/features/messages.types";
import EmptyState from "./EmptyState";
import { useState } from "react";

interface ConversationsListProps {
  conversations: Conversation[];
  activeId: string | null;
  folder: MessageFolder;
  loading: boolean;
  onSelect: (id: string) => void;
  onToggleStar: (id: string) => void;
  onMoveToFolder: (id: string, folder: MessageFolder) => void;
}

/**
 * Modern conversations sidebar with glassmorphism cards
 */
export default function ConversationsList({
  conversations,
  activeId,
  folder,
  loading,
  onSelect,
  onToggleStar,
  onMoveToFolder,
}: ConversationsListProps) {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-3 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-pulse flex items-center gap-3 p-4 rounded-2xl bg-gray-50"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return <EmptyState folder={folder} type="conversations" />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 space-y-1">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeId}
            folder={folder}
            onSelect={() => onSelect(conv.id)}
            onToggleStar={() => onToggleStar(conv.id)}
            onMoveToFolder={(f) => onMoveToFolder(conv.id, f)}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== CONVERSATION ITEM ====================

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  folder: MessageFolder;
  onSelect: () => void;
  onToggleStar: () => void;
  onMoveToFolder: (folder: MessageFolder) => void;
}

function ConversationItem({
  conversation,
  isActive,
  folder,
  onSelect,
  onToggleStar,
  onMoveToFolder,
}: ConversationItemProps) {
  const [showActions, setShowActions] = useState(false);
  const { otherUser, lastMessage, unreadCount, isStarred } = conversation;

  // Format relative time
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-black text-white shadow-lg shadow-black/20 scale-[1.02]"
          : "hover:bg-gray-50 text-gray-900"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-black uppercase ${
            isActive
              ? "bg-white text-black"
              : "bg-gradient-to-br from-gray-800 to-gray-600 text-white"
          }`}
        >
          {otherUser.username?.charAt(0) || "?"}
        </div>
        {/* Unread indicator dot */}
        {unreadCount > 0 && !isActive && (
          <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-sm font-bold truncate ${
              isActive
                ? "text-white"
                : unreadCount > 0
                  ? "text-black"
                  : "text-gray-900"
            }`}
          >
            {otherUser.username}
          </span>
          <span
            className={`text-[10px] flex-shrink-0 ml-2 ${
              isActive ? "text-white/60" : "text-gray-400"
            }`}
          >
            {formatTime(lastMessage?.createdAt || conversation.lastMessageAt)}
          </span>
        </div>
        {lastMessage && (
          <p
            className={`text-xs truncate leading-relaxed ${
              isActive
                ? "text-white/70"
                : unreadCount > 0
                  ? "text-gray-700 font-medium"
                  : "text-gray-500"
            }`}
          >
            {lastMessage.isFromMe && (
              <span className={isActive ? "text-white/50" : "text-gray-400"}>
                You:{" "}
              </span>
            )}
            {lastMessage.content}
          </p>
        )}
      </div>

      {/* Star & Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {isStarred && (
          <Star
            size={14}
            className={`fill-current ${isActive ? "text-yellow-300" : "text-yellow-500"}`}
          />
        )}

        {/* Context menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
              isActive ? "hover:bg-white/10" : "hover:bg-gray-200"
            }`}
          >
            <MoreVertical size={14} />
          </button>

          {showActions && (
            <div
              className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 min-w-[160px] z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onToggleStar();
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Star
                  size={13}
                  className={isStarred ? "fill-yellow-500 text-yellow-500" : ""}
                />
                {isStarred ? "Unstar" : "Star"}
              </button>
              {folder === "inbox" && (
                <button
                  onClick={() => {
                    onMoveToFolder("archived");
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Archive size={13} />
                  Archive
                </button>
              )}
              {folder !== "trash" && (
                <button
                  onClick={() => {
                    onMoveToFolder("trash");
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              )}
              {folder !== "inbox" && (
                <button
                  onClick={() => {
                    onMoveToFolder("inbox");
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Move to Inbox
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
