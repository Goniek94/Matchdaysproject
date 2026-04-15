"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, AlertTriangle } from "lucide-react";
import { createDispute, type DisputeType } from "@/lib/api/disputes";

const TYPES: { value: DisputeType; label: string; desc: string }[] = [
  { value: "item_not_received",     label: "Item not received",       desc: "You paid but never received the item" },
  { value: "item_not_as_described", label: "Item not as described",   desc: "The item is different from what was advertised" },
  { value: "seller_unresponsive",   label: "Seller unresponsive",     desc: "The seller is not responding to messages" },
  { value: "fraud",                 label: "Fraud / Scam",            desc: "You believe this is a fraudulent listing or user" },
  { value: "report_user",           label: "Report a user",           desc: "Report inappropriate behaviour or policy violations" },
  { value: "other",                 label: "Other issue",             desc: "Something else not covered above" },
];

function NewDisputeForm() {
  const router = useRouter();
  const params = useSearchParams();

  const prefillAuctionId = params.get("auctionId") ?? undefined;
  const prefillRespondentId = params.get("respondentId") ?? undefined;
  const prefillType = (params.get("type") as DisputeType) ?? undefined;

  const [type, setType]               = useState<DisputeType>(prefillType ?? "item_not_received");
  const [subject, setSubject]         = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError("Please fill in all fields."); return;
    }
    try {
      setSubmitting(true);
      setError("");
      const res = await createDispute({
        type,
        subject: subject.trim(),
        description: description.trim(),
        auctionId: prefillAuctionId,
        respondentId: prefillRespondentId,
      });
      if (res.success && res.data) {
        router.push(`/disputes/${res.data.id}`);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to open dispute. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">

        <Link href="/disputes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors font-medium">
          <ArrowLeft size={16}/> Back to disputes
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Open a dispute</h1>
        <p className="text-gray-500 text-sm mb-8">Our team will review your case and help resolve it within 48 hours.</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Type */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 mb-4">What is this about?</h2>
            <div className="space-y-2">
              {TYPES.map(t => (
                <label key={t.value}
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    type === t.value ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"
                  }`}>
                  <input type="radio" name="type" value={t.value} checked={type === t.value}
                    onChange={() => setType(t.value)} className="sr-only" />
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    type === t.value ? "border-white" : "border-gray-400"
                  }`}>
                    {type === t.value && <div className="w-2 h-2 rounded-full bg-white"/>}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${type === t.value ? "text-white" : "text-gray-900"}`}>{t.label}</p>
                    <p className={`text-xs mt-0.5 ${type === t.value ? "text-white/70" : "text-gray-500"}`}>{t.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700">Details</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject <span className="text-red-500">*</span></label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                maxLength={200}
                placeholder="Brief summary of the issue…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300"
              />
              <p className="text-[11px] text-gray-400 mt-1 text-right">{subject.length}/200</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={2000}
                rows={6}
                placeholder="Explain the issue in detail — include dates, order references, and any relevant context…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300"
              />
              <p className="text-[11px] text-gray-400 mt-1 text-right">{description.length}/2000</p>
            </div>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-700">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5"/>
            <p>Filing a false dispute may result in a warning or account suspension. Only open disputes for genuine issues.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Send size={16}/>
            {submitting ? "Submitting…" : "Submit dispute"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewDisputePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent"/></div>}>
      <NewDisputeForm />
    </Suspense>
  );
}
