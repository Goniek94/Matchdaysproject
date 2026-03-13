"use client";

import { MessageCircle, Inbox, Archive, Trash2 } from "lucide-react";
import type { MessageFolder } from "@/types/features/messages.types";

interface EmptyStateProps {
  folder: MessageFolder;
  type?: "conversations" | "messages";
}

const folderConfig = {
  inbox: {
    icon: Inbox,
    title: "No messages yet",
    description: "When someone sends you a message, it will appear here.",
  },
  archived: {
    icon: Archive,
    title: "No archived conversations",
    description: "Conversations you archive will appear here.",
  },
  trash: {
    icon: Trash2,
    title: "Trash is empty",
    description: "Deleted conversations will appear here.",
  },
};

/**
 * Empty state component for conversations list and chat panel
 */
export default function EmptyState({
  folder,
  type = "conversations",
}: EmptyStateProps) {
  if (type === "messages") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageCircle size={28} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Select a conversation
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Choose a conversation from the list to start chatting.
        </p>
      </div>
    );
  }

  const config = folderConfig[folder];
  const Icon = config.icon;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{config.description}</p>
    </div>
  );
}
