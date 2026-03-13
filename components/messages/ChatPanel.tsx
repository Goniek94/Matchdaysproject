"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ChevronUp } from "lucide-react";
import type { Message, MessageUser } from "@/types/features/messages.types";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import EmptyState from "./EmptyState";

interface ChatPanelProps {
  messages: Message[];
  otherUser: MessageUser | null;
  currentUserId: string;
  loading: boolean;
  sending: boolean;
  hasMore: boolean;
  onSend: (content: string) => Promise<void>;
  onLoadMore: () => void;
  onEdit: (messageId: string, content: string) => Promise<void>;
  onDelete: (messageId: string) => void;
  onBack?: () => void;
}

/**
 * Modern chat panel with auto-scroll and load more
 */
export default function ChatPanel({
  messages,
  otherUser,
  currentUserId,
  loading,
  sending,
  hasMore,
  onSend,
  onLoadMore,
  onEdit,
  onDelete,
  onBack,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // No conversation selected
  if (!otherUser) {
    return <EmptyState folder="inbox" type="messages" />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        {/* Back button (mobile) */}
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* User info */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-sm font-black uppercase">
          {otherUser.username?.charAt(0) || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate">
            {otherUser.username}
          </h3>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
            {messages.length} messages
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
          </div>
        ) : (
          <>
            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={onLoadMore}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors uppercase tracking-wider"
                >
                  <ChevronUp size={14} />
                  Load earlier messages
                </button>
              </div>
            )}

            {/* Date separator for first message */}
            {messages.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {new Date(messages[0].createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => {
              // Show date separator between different days
              const showDateSep =
                index > 0 &&
                new Date(msg.createdAt).toDateString() !==
                  new Date(messages[index - 1].createdAt).toDateString();

              return (
                <div key={msg.id}>
                  {showDateSep && (
                    <div className="flex items-center gap-3 my-6">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    isOwn={msg.senderId === currentUserId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSend={onSend} sending={sending} />
    </div>
  );
}
