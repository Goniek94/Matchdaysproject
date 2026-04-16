"use client";

import { useState } from "react";
import { Mail, MessageCircle, HelpCircle, Shield, ChevronDown, Send, CheckCircle } from "lucide-react";

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How do I list an item for auction?",
    a: "Click 'Sell Item' in the navigation bar, fill in your item details, upload photos and set your starting price. Your listing goes live immediately after submission.",
  },
  {
    q: "How does buyer protection work?",
    a: "Every purchase is covered by our Buyer Protection policy. If an item arrives not as described or doesn't arrive at all, we'll issue a full refund — no questions asked.",
  },
  {
    q: "How long does shipping take?",
    a: "Sellers set their own shipping times, typically 2–7 business days within the EU. Tracked shipping is required on all orders over £50.",
  },
  {
    q: "How do I report a fraudulent listing?",
    a: "Use the 'Report' button on any listing page, or open a dispute from your Dashboard → My Cases. Our team reviews all reports within 24 hours.",
  },
  {
    q: "When do I receive my payout as a seller?",
    a: "Funds are released 48 hours after the buyer confirms delivery, or 7 days after the tracking shows delivered — whichever comes first.",
  },
  {
    q: "How do loyalty points work?",
    a: "Earn points by selling, buying and spinning the Daily Spin wheel in your Dashboard. Points will be redeemable for discounts and perks — exchange feature coming soon.",
  },
];

// ─── Contact channels ─────────────────────────────────────────────────────────

const CHANNELS = [
  {
    icon: Mail,
    title: "Email Support",
    description: "For account, billing and complex issues",
    action: "support@matchdays.com",
    href: "mailto:support@matchdays.com",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Mon–Fri, 9:00–18:00 CET",
    action: "Start chat",
    href: "#chat",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Shield,
    title: "Disputes & Reports",
    description: "Open a case directly from your Dashboard",
    action: "Go to My Cases",
    href: "/dashboard",
    color: "bg-amber-100 text-amber-600",
  },
];

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    // Simulated send — replace with real API call
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">Message sent!</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          We&apos;ll get back to you within 24 hours at <strong>{email}</strong>.
        </p>
        <button
          onClick={() => { setSent(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
          className="mt-6 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors bg-white"
        >
          <option value="">Select a topic…</option>
          <option value="order">Order / Shipping</option>
          <option value="account">Account & Billing</option>
          <option value="dispute">Dispute / Report</option>
          <option value="selling">Selling on Matchdays</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Describe your issue or question in detail…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors resize-none"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !name || !email || !message}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={14} />
          )}
          {loading ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(236,72,153,0.1),transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
            <HelpCircle size={26} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            How can we help?
          </h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto">
            Browse the FAQ below or send us a message — we typically respond within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Contact channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CHANNELS.map((ch) => (
            <a
              key={ch.title}
              href={ch.href}
              className="bg-white rounded-2xl border border-gray-200/60 p-5 hover:shadow-md transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-xl ${ch.color} flex items-center justify-center mb-3`}>
                <ch.icon size={18} />
              </div>
              <p className="text-sm font-black text-gray-900 mb-1">{ch.title}</p>
              <p className="text-xs text-gray-400 mb-3">{ch.description}</p>
              <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900 transition-colors underline underline-offset-2">
                {ch.action}
              </span>
            </a>
          ))}
        </div>

        {/* Main grid: form + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact form — 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/60 p-6">
            <h2 className="text-base font-black text-gray-900 mb-1">Send a message</h2>
            <p className="text-xs text-gray-400 mb-5">
              We&apos;ll reply to your email within 24 hours.
            </p>
            <ContactForm />
          </div>

          {/* FAQ — 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4">
              Frequently asked
            </h2>
            <div>
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
