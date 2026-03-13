"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Seller } from "@/types";
import { MessageCircle, Flag, Send, X } from "lucide-react";
import * as messagesApi from "@/lib/api/messages";
import { getUserData } from "@/lib/api/config";

interface SellerInfoProps {
  seller: Seller;
  auctionId?: string;
}

/**
 * Seller info panel with avatar, stats, and action buttons (Send Message, Report).
 * Send Message opens an inline compose form that sends via API.
 */
export default function SellerInfo({ seller, auctionId }: SellerInfoProps) {
  const router = useRouter();
  const [showCompose, setShowCompose] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendMessage = async () => {
    const userData = getUserData();

    if (!userData) {
      alert("Please log in to send messages");
      return;
    }

    if (!messageContent.trim()) return;

    try {
      setSending(true);

      if (auctionId) {
        await messagesApi.sendMessageToAuction(auctionId, {
          content: messageContent.trim(),
        });
      } else {
        // Fallback: redirect to messages page
        router.push("/messages");
        return;
      }

      setSent(true);
      setMessageContent("");
      setTimeout(() => {
        setSent(false);
        setShowCompose(false);
      }, 2000);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report seller:", seller.name);
    alert(`Report feature coming soon! Seller: ${seller.name}`);
  };

  return (
    <div className="space-y-4">
      {/* Seller Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-black text-white uppercase">
          {seller.name?.charAt(0) || "?"}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate">
            {seller.name}
          </h3>
          <div className="text-xs text-gray-500">
            ★★★★★ ({seller.reviews} reviews)
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {seller.sales ?? "—"}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
            Sales
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {seller.positivePercentage ? `${seller.positivePercentage}%` : "—"}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
            Positive
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {seller.avgShippingTime ?? "—"}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
            Avg Ship
          </div>
        </div>
      </div>

      {/* Inline Compose Form */}
      {showCompose && (
        <div className="pt-3 border-t border-gray-100 space-y-3">
          {sent ? (
            <div className="flex items-center justify-center gap-2 py-4 bg-green-50 rounded-xl">
              <span className="text-green-600 text-sm font-bold">
                ✓ Message sent!
              </span>
            </div>
          ) : (
            <>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder={`Message to ${seller.name}...`}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 placeholder:text-gray-400"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim() || sending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  {sending ? "Sending..." : "Send"}
                </button>
                <button
                  onClick={() => {
                    setShowCompose(false);
                    setMessageContent("");
                  }}
                  className="px-3 py-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!showCompose && (
        <div className="space-y-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
          >
            <MessageCircle size={14} />
            Send Message
          </button>
          <button
            onClick={handleReport}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Flag size={14} />
            Report
          </button>
        </div>
      )}
    </div>
  );
}
