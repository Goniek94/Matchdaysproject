"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  sending?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Message input field with send button
 */
export default function MessageInput({
  onSend,
  sending = false,
  disabled = false,
  placeholder = "Type a message...",
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || sending || disabled) return;

    try {
      await onSend(trimmed);
      setContent("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    } catch {
      // Error handled in hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || sending}
          rows={1}
          className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || sending || disabled}
          className="flex-shrink-0 w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {sending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
