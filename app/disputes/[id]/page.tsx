"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getDispute, addDisputeMessage, type Dispute, type DisputeStatus } from "@/lib/api/disputes";
import { useAuth } from "@/lib/context/AuthContext";
import { ArrowLeft, Send, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

const STATUS_CONFIG: Record<DisputeStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  open:             { label: "Open",              color: "#3B82F6", bg: "#EFF6FF", icon: <Clock size={14}/> },
  awaiting_seller:  { label: "Awaiting seller",   color: "#F59E0B", bg: "#FFFBEB", icon: <Clock size={14}/> },
  awaiting_buyer:   { label: "Your reply needed", color: "#EF4444", bg: "#FEF2F2", icon: <AlertTriangle size={14}/> },
  in_review:        { label: "Under review",      color: "#8B5CF6", bg: "#F5F3FF", icon: <Clock size={14}/> },
  resolved:         { label: "Resolved",          color: "#10B981", bg: "#ECFDF5", icon: <CheckCircle size={14}/> },
  closed:           { label: "Closed",            color: "#6B7280", bg: "#F9FAFB", icon: <XCircle size={14}/> },
};

function Avatar({ username, avatar, size = 8 }: { username: string; avatar?: string; size?: number }) {
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0`}>
      {avatar
        ? <Image src={avatar} alt={username} width={32} height={32} className="object-cover w-full h-full"/>
        : username[0]?.toUpperCase()}
    </div>
  );
}

export default function DisputeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const isClosed = dispute && ["resolved", "closed"].includes(dispute.status);

  useEffect(() => {
    if (!id) return;
    getDispute(id)
      .then(res => { if (res.success && res.data) setDispute(res.data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dispute?.messages]);

  const handleSend = async () => {
    if (!reply.trim() || !id) return;
    try {
      setSending(true); setSendError("");
      const res = await addDisputeMessage(id, reply.trim());
      if (res.success && res.data) {
        setDispute(prev => prev ? { ...prev, messages: [...prev.messages, res.data!] } : prev);
        setReply("");
      }
    } catch (err: any) {
      setSendError(err?.message || "Failed to send message");
    } finally { setSending(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent"/>
    </div>
  );

  if (notFound || !dispute) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🔍</p>
        <h2 className="text-xl font-bold mb-2">Dispute not found</h2>
        <Link href="/disputes" className="text-sm underline text-gray-500">Back to disputes</Link>
      </div>
    </div>
  );

  const statusCfg = STATUS_CONFIG[dispute.status] ?? STATUS_CONFIG.open;

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">

        <Link href="/disputes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6 transition-colors font-medium">
          <ArrowLeft size={16}/> All disputes
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl font-black text-gray-900">{dispute.subject}</h1>
            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border"
              style={{ color: statusCfg.color, backgroundColor: statusCfg.bg, borderColor: statusCfg.color + "33" }}>
              {statusCfg.icon} {statusCfg.label}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">{dispute.description}</p>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-4 border-t border-gray-100">
            <span>Opened by <strong className="text-gray-700">{dispute.reporter.username}</strong></span>
            {dispute.respondent && <span>vs <strong className="text-gray-700">{dispute.respondent.username}</strong></span>}
            {dispute.auction && (
              <Link href={`/auction/${dispute.auction.id}`} className="hover:text-black underline">
                Re: {dispute.auction.title}
              </Link>
            )}
            <span className="flex items-center gap-1"><Clock size={10}/> {new Date(dispute.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>

          {/* Resolution */}
          {dispute.resolution && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="text-xs font-bold text-emerald-700 mb-1 uppercase tracking-wider">Resolution</p>
              <p className="text-sm text-emerald-800">{dispute.resolution}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Messages ({dispute.messages.length})</h2>
          </div>

          <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
            {dispute.messages.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No messages yet. Add a message below.</p>
            )}

            {dispute.messages.map(msg => {
              const isMe = msg.sender.id === (user as any)?.id;
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                  <Avatar username={msg.sender.username} avatar={msg.sender.avatar} size={8}/>
                  <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600">{msg.sender.username}</span>
                      {msg.isAdmin && <span className="text-[10px] font-black px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full">ADMIN</span>}
                      <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-black text-white rounded-tr-sm"
                        : msg.isAdmin
                          ? "bg-purple-50 text-purple-900 border border-purple-200 rounded-tl-sm"
                          : "bg-gray-100 text-gray-900 rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Reply box */}
          {!isClosed && (
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
              {sendError && <p className="text-xs text-red-600 mb-2">{sendError}</p>}
              <div className="flex gap-3">
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend(); }}
                  placeholder="Add a message… (Ctrl+Enter to send)"
                  rows={3}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300"
                />
                <button onClick={handleSend} disabled={!reply.trim() || sending}
                  className="self-end px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-bold text-sm">
                  {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send size={15}/>}
                </button>
              </div>
            </div>
          )}

          {isClosed && (
            <div className="px-6 pb-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-400">
              This dispute is {dispute.status}. No further messages can be added.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
