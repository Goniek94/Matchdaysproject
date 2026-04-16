"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, Plus, ArrowRight, CheckCircle } from "lucide-react";
import { getMyDisputes, type Dispute, type DisputeStatus } from "@/lib/api/disputes";

const STATUS_STYLE: Record<DisputeStatus, { label: string; color: string }> = {
  open:             { label: "Open",            color: "text-blue-700 bg-blue-50" },
  awaiting_seller:  { label: "Awaiting seller", color: "text-amber-700 bg-amber-50" },
  awaiting_buyer:   { label: "Your reply",      color: "text-red-700 bg-red-50" },
  in_review:        { label: "Under review",    color: "text-purple-700 bg-purple-50" },
  resolved:         { label: "Resolved",        color: "text-emerald-700 bg-emerald-50" },
  closed:           { label: "Closed",          color: "text-gray-500 bg-gray-100" },
};

export function DashboardDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyDisputes()
      .then(res => { if (res.success && res.data) setDisputes(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = disputes.filter(d => !["resolved", "closed"].includes(d.status));
  const closed = disputes.filter(d => ["resolved", "closed"].includes(d.status));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900">My Cases</h2>
          <p className="text-xs text-gray-400 mt-0.5">Disputes & reports</p>
        </div>
        <Link
          href="/disputes/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
        >
          <Plus size={14}/> Open Case
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse"/>)}
        </div>
      ) : disputes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3"/>
          <p className="font-bold text-gray-700">No open cases</p>
          <p className="text-sm text-gray-400 mt-1">All disputes are resolved. Good job!</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Active ({active.length})</p>
              {active.map(d => <DisputeRow key={d.id} dispute={d}/>)}
            </div>
          )}
          {closed.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Closed ({closed.length})</p>
              {closed.map(d => <DisputeRow key={d.id} dispute={d}/>)}
            </div>
          )}
        </>
      )}

      <div className="flex justify-end">
        <Link href="/disputes" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest group">
          View all cases <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform"/>
        </Link>
      </div>
    </div>
  );
}

function DisputeRow({ dispute }: { dispute: Dispute }) {
  const cfg = STATUS_STYLE[dispute.status] ?? STATUS_STYLE.open;
  return (
    <Link href={`/disputes/${dispute.id}`}
      className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:border-gray-300 hover:shadow-sm transition-all group">
      <AlertTriangle size={16} className="text-gray-400 flex-shrink-0"/>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{dispute.subject}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(dispute.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
        {cfg.label}
      </span>
    </Link>
  );
}
