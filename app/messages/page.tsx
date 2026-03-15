"use client";

import { useState } from "react";
import { Inbox, Archive, Trash2, MessageCircle, Search } from "lucide-react";
import { useConversations } from "@/lib/hooks/useConversations";
import { useMessages } from "@/lib/hooks/useMessages";
import { useAuth } from "@/lib/context/AuthContext";
import ConversationsList from "@/components/messages/ConversationsList";
import ChatPanel from "@/components/messages/ChatPanel";
import type { MessageFolder } from "@/types/features/messages.types";

const FOLDER_TABS: { id: MessageFolder; label: string; icon: any }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "archived", label: "Archived", icon: Archive },
  { id: "trash", label: "Trash", icon: Trash2 },
];

/**
 * Messages page - full-screen messaging experience
 * Split layout: conversations sidebar + chat panel
 */
export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [showChat, setShowChat] = useState(false); // Mobile: toggle between list and chat
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

  // Filter conversations by search
  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        c.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  // Handle conversation selection
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setShowChat(true); // Mobile: show chat
  };

  // Handle back (mobile)
  const handleBack = () => {
    setShowChat(false);
    setActiveConversationId(null);
    refreshConversations();
  };

  // Handle folder change
  const handleFolderChange = (newFolder: MessageFolder) => {
    setFolder(newFolder);
    setActiveConversationId(null);
    setShowChat(false);
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={36} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-black mb-3 text-gray-900 uppercase">
            Sign in to view messages
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to access your messages.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-bold uppercase tracking-wider"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 max-w-7xl py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Messages
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your conversations and inbox
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-220px)] min-h-[500px]">
          <div className="flex h-full">
            {/* Left Sidebar - Conversations */}
            <div
              className={`w-full lg:w-[380px] flex-shrink-0 border-r border-gray-100 flex flex-col ${
                showChat ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Folder Tabs */}
              <div className="flex border-b border-gray-100">
                {FOLDER_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleFolderChange(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
                        folder === tab.id
                          ? "text-black border-b-2 border-black bg-gray-50/50"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/30"
                      }`}
                    >
                      <Icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="p-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Conversations List */}
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

            {/* Right Panel - Chat */}
            <div
              className={`flex-1 flex flex-col ${
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
      </div>
    </div>
  );
}
