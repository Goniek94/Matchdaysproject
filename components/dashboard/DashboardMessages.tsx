"use client";

import { useState } from "react";
import { Inbox, Archive, Trash2, Search } from "lucide-react";
import { useConversations } from "@/lib/hooks/useConversations";
import { useMessages } from "@/lib/hooks/useMessages";
import { useAuth } from "@/lib/context/AuthContext";
import ConversationsList from "@/components/messages/ConversationsList";
import ChatPanel from "@/components/messages/ChatPanel";
import type { MessageFolder } from "@/types/features/messages.types";

// ─── Folder tabs ──────────────────────────────────────────────────────────────

const FOLDER_TABS: { id: MessageFolder; label: string; icon: any }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "archived", label: "Archived", icon: Archive },
  { id: "trash", label: "Trash", icon: Trash2 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardMessages() {
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();
  const currentUserId = user?.id || "";

  const {
    conversations,
    folder,
    setFolder,
    loading: conversationsLoading,
    toggleStar,
    moveToFolder,
    refresh: refreshConversations,
  } = useConversations();

  const {
    messages,
    otherUser,
    loading: messagesLoading,
    sending,
    hasMore,
    sendMessage,
    loadMore,
    editMessage,
    deleteMessage,
  } = useMessages(activeConversationId);

  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        c.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
    setActiveConversationId(null);
    refreshConversations();
  };

  const handleFolderChange = (newFolder: MessageFolder) => {
    setFolder(newFolder);
    setActiveConversationId(null);
    setShowChat(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden h-[calc(100vh-200px)] min-h-[500px] flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-base font-black text-gray-900">Messages</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Your conversations and inbox
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Conversations */}
        <div
          className={`w-full lg:w-[380px] flex-shrink-0 border-r border-gray-100 flex flex-col ${
            showChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Folder tabs */}
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {FOLDER_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFolderChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    folder === tab.id
                      ? "text-black border-b-2 border-black"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="p-3 flex-shrink-0">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationsList
              conversations={filteredConversations}
              activeId={activeConversationId}
              folder={folder}
              loading={conversationsLoading}
              onSelect={handleSelectConversation}
              onToggleStar={toggleStar}
              onMoveToFolder={moveToFolder}
            />
          </div>
        </div>

        {/* Right: Chat */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            !showChat ? "hidden lg:flex" : "flex"
          }`}
        >
          <ChatPanel
            messages={messages}
            otherUser={otherUser}
            currentUserId={currentUserId}
            loading={messagesLoading}
            sending={sending}
            hasMore={hasMore}
            onSend={sendMessage}
            onLoadMore={loadMore}
            onEdit={editMessage}
            onDelete={deleteMessage}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}
