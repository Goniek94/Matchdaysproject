"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import type { Message } from "@/types/features/messages.types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onEdit?: (messageId: string, content: string) => Promise<void>;
  onDelete?: (messageId: string) => void;
}

/**
 * Single message bubble with edit/delete options
 */
export default function MessageBubble({
  message,
  isOwn,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = async () => {
    if (!onEdit || editContent.trim() === message.content) {
      setIsEditing(false);
      return;
    }
    try {
      await onEdit(message.id, editContent.trim());
      setIsEditing(false);
    } catch {
      // Error handled in hook
    }
  };

  const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[75%] group relative`}>
        {/* Message content */}
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? "bg-black text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          }`}
        >
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 bg-transparent border-b border-white/30 outline-none text-sm py-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEdit();
                  if (e.key === "Escape") setIsEditing(false);
                }}
              />
              <button onClick={handleEdit} className="p-1 hover:opacity-70">
                <Check size={14} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 hover:opacity-70"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}
        </div>

        {/* Time & status */}
        <div
          className={`flex items-center gap-1.5 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-[10px] text-gray-400">{time}</span>
          {message.edited && (
            <span className="text-[10px] text-gray-400 italic">edited</span>
          )}
          {isOwn && message.read && (
            <span className="text-[10px] text-blue-500">✓✓</span>
          )}
        </div>

        {/* Actions menu (own messages only) */}
        {isOwn && !isEditing && (
          <div className="absolute top-0 -left-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete?.(message.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
