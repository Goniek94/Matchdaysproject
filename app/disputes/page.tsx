"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyDisputes, type Dispute, type DisputeStatus } from "@/lib/api/disputes";
import { AlertTriangle, ChevronRight, Plus, PackageX, MessageSquareWarning, Ban, HelpCircle, ShieldAlert, Clock } from "lucide-react";

const TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  item_not_received:     { label: "Item not received",       icon: <PackageX size={14}/> },
  item_not_as_described: { label: "Item not as described",   icon: <AlertTriangle size={14}/> },
  seller_unresponsive:   { label: "Seller unresponsive",     icon: <MessageSquareWarning size={14}/> },
  fraud:                 { label: "Fraud / Scam",            icon: <Ban size={14}/> },
  report_user:           { label: "Report user",             icon: <ShieldAlert size={14}/> },
  other:                 { label: "Other",                   icon: <HelpCircle size={14}/> },
};

const STATUS_STYLES: Record<DisputeStatus, string> = {
  open:             "bg-blue-50 text-blue-700 border-blue-200",
  awaiting_seller:  "bg-amber-50 text-amber-700 border-amber-200",
  awaiting_buyer:   "bg-amber-50 text-amber-700 border-amber-200",
  in_review:        "bg-purple-50 text-purple-700 border-purple-200",
  resolved:         "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed:           "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_LABELS: Record<DisputeStatus, string> = {
  open:             "Open",
  awaiting_seller:  "Awaiting seller",
  awaiting_buyer:   "Awaiting your reply",
  in_review:        "Under review",
  resolved:         "Resolved",
  closed:           "Closed",
};

function DisputeRow({ dispute }: { dispute: Dispute }) {
  const meta = TYPE_LABELS[dispute.type] ?? TYPE_LABELS.other;
  const statusStyle = STATUS_STYLES[dispute.status] ?? STATUS_STYLES.open;
  const statusLabel = STATUS_LABELS[dispute.status] ?? dispute.status;
  const lastMsg = dispute.messages[dispute.messages.length - 1];

  return (
    <Link href={`/disputes/${dispute.id}`}
      className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 group-hover:bg-gray-200 transition-colors">
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="font-bold text-gray-900 text-sm truncate">{dispute.subject}</p>
          <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border ${statusStyle}`}>
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          {meta.icon} {meta.label}
          {dispute.auction && <> · <span className="text-gray-500 truncate max-w-[160px]">{dispute.auction.title}</span></>}
        </p>
        {lastMsg && (
          <p className="text-xs text-gray-500 line-clamp-1">
            <span className="font-semibold">{lastMsg.sender.username}:</span> {lastMsg.content}
          </p>
        )}
        <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
          <Clock size={10}/> {new Date(dispute.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          · {dispute.messages.length} message{dispute.messages.length !== 1 ? "s" : ""}
        </p>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1 transition-colors" />
    </Link>
  );
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyDisputes()
      .then(res => { if (res.success && res.data) setDisputes(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const open   = disputes.filter(d => !["resolved", "closed"].includes(d.status));
  const closed = disputes.filter(d => ["resolved", "closed"].includes(d.status));

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Disputes & Reports</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your open cases and transaction issues</p>
          </div>
          <Link href="/disputes/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
            <Plus size={16}/> New dispute
          </Link>
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && disputes.length === 0 && (
          <div className="py-24 text-center bg-white rounded-3xl border border-gray-100">
            <p className="text-4xl mb-3">✅</p>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No disputes</h2>
            <p className="text-gray-400 text-sm mb-6">You have no open disputes or reports</p>
            <Link href="/disputes/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
              <Plus size={15}/> Open a dispute
            </Link>
          </div>
        )}

        {!loading && open.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Active ({open.length})</h2>
            <div className="space-y-2">
              {open.map(d => <DisputeRow key={d.id} dispute={d} />)}
            </div>
          </div>
        )}

        {!loading && closed.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Closed ({closed.length})</h2>
            <div className="space-y-2 opacity-70">
              {closed.map(d => <DisputeRow key={d.id} dispute={d} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
