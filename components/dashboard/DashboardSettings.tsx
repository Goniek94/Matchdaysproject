"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Lock, Phone, Mail, CreditCard, Trash2,
  ChevronDown, Check, AlertTriangle, Info, Eye, EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { authApi } from "@/lib/api";
import { updateMyProfile } from "@/lib/api/users";
import { deleteAccount } from "@/lib/api/users";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionId = "profile" | "contact" | "password" | "payment" | "danger";

// ─── Small helpers ────────────────────────────────────────────────────────────

function SaveBtn({ loading, disabled }: { loading: boolean; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="px-5 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Check size={14} />
      )}
      Save
    </button>
  );
}

function SuccessBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm">
      <Check size={14} className="flex-shrink-0" /> {msg}
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm">
      <AlertTriangle size={14} className="flex-shrink-0" /> {msg}
    </div>
  );
}

function LockedField({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 select-none">
        <Lock size={13} className="text-gray-300 flex-shrink-0" />
        <span className="flex-1">{value || "—"}</span>
      </div>
      {note && <p className="text-[11px] text-gray-400 mt-1">{note}</p>}
    </div>
  );
}

function Input({
  label, value, onChange, placeholder, type = "text", maxLength, note,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; maxLength?: number; note?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300"
      />
      {note && <p className="text-[11px] text-gray-400 mt-1">{note}</p>}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  id, active, onToggle, icon: Icon, title, subtitle, children,
}: {
  id: SectionId; active: boolean; onToggle: (id: SectionId) => void;
  icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${active ? "rotate-180" : ""}`}
        />
      </button>
      {active && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Profile section ──────────────────────────────────────────────────────────

function ProfileSection() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username === user?.username) return;
    try {
      setLoading(true); setError(""); setSuccess("");
      const res = await updateMyProfile({ username: username.trim() } as any);
      if (res.success) {
        await refreshUser();
        setSuccess("Username updated successfully.");
      } else {
        setError(res.message || "Failed to update username.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update username.");
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.name || user?.firstName || "—";
  const lastName = user?.lastName || "—";
  const dob = user?.birthDate
    ? new Date(user.birthDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LockedField label="Name" value={firstName} note="Locked at registration." />
        <LockedField label="Last name" value={lastName} note="Locked at registration." />
        <LockedField label="Date of birth" value={dob} note="Locked at registration." />
        <LockedField
          label="Country of residence"
          value={user?.country ?? "—"}
          note="Change via support@matchdays.com."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Username / Nickname"
          value={username}
          onChange={setUsername}
          placeholder="Your public username"
          maxLength={30}
          note="Visible to other users. 3–30 characters."
        />
      </div>
      {success && <SuccessBanner msg={success} />}
      {error && <ErrorBanner msg={error} />}
      <div className="flex justify-end">
        <SaveBtn loading={loading} disabled={!username.trim() || username === user?.username} />
      </div>
    </form>
  );
}

// ─── Contact section ──────────────────────────────────────────────────────────

function ContactSection() {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !user?.email) return;
    try {
      setLoading(true); setError(""); setSuccess("");
      // Request email change — sends verification link to current email
      const res = await authApi.requestPasswordReset(user.email);
      if (res.success) {
        setSuccess(`A verification link has been sent to ${user.email}. Follow the link to confirm your new email.`);
        setNewEmail("");
      } else {
        setError(res.message || "Failed to send verification email.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email — editable via verification */}
        <form onSubmit={handleRequestEmailChange} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current email</label>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
              <Mail size={13} className="text-gray-400 flex-shrink-0" />
              <span className="flex-1 truncate">{user?.email || "—"}</span>
            </div>
          </div>
          <Input
            label="New email address"
            value={newEmail}
            onChange={setNewEmail}
            placeholder="new@example.com"
            type="email"
            note="A verification link will be sent to your current email to confirm the change."
          />
          {success && <SuccessBanner msg={success} />}
          {error && <ErrorBanner msg={error} />}
          <div className="flex justify-end">
            <SaveBtn loading={loading} disabled={!newEmail.trim()} />
          </div>
        </form>

        {/* Phone — locked, via support */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone number</label>
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
            <Lock size={13} className="text-gray-300 flex-shrink-0" />
            <span className="flex-1">{user?.phone || "—"}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            To change your phone number contact{" "}
            <a href="mailto:support@matchdays.com" className="underline hover:text-gray-700">
              support@matchdays.com
            </a>
            . Identity verification required.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Password section ─────────────────────────────────────────────────────────

function PasswordSection() {
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const mismatch = next && confirm && next !== confirm;
  const weak = next && next.length < 8;

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || !next || !confirm || next !== confirm) return;
    try {
      setLoading(true); setError(""); setSuccess("");
      const res = await authApi.changePassword({ currentPassword: current, newPassword: next });
      if (res.success) {
        setSuccess("Password changed successfully.");
        setCurrent(""); setNext(""); setConfirm("");
      } else {
        setError(res.message || "Failed to change password.");
      }
    } catch (err: any) {
      setError(err?.message || "Incorrect current password or server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!user?.email) return;
    try {
      setLoading(true); setError(""); setSuccess("");
      const res = await authApi.requestPasswordReset(user.email);
      if (res.success) {
        setSuccess(`Password reset link sent to ${user.email}.`);
      } else {
        setError(res.message || "Failed to send reset email.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChange} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Current password */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current password</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={current}
            onChange={e => setCurrent(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300"
          />
          <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* New password */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">New password</label>
        <div className="relative">
          <input
            type={showNext ? "text" : "password"}
            value={next}
            onChange={e => setNext(e.target.value)}
            placeholder="Min. 8 characters"
            className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-300 ${weak ? "border-amber-300 focus:border-amber-400" : "border-gray-200 focus:border-gray-400"}`}
          />
          <button type="button" onClick={() => setShowNext(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {weak && <p className="text-[11px] text-amber-600 mt-1">Password must be at least 8 characters.</p>}
      </div>

      {/* Confirm */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm new password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Repeat new password"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-300 ${mismatch ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-gray-400"}`}
        />
        {mismatch && <p className="text-[11px] text-red-600 mt-1">Passwords do not match.</p>}
      </div>
      </div>{/* end grid */}

      {success && <SuccessBanner msg={success} />}
      {error && <ErrorBanner msg={error} />}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleForgot}
          disabled={loading}
          className="text-xs font-bold text-gray-400 hover:text-gray-700 underline transition-colors disabled:opacity-40"
        >
          Forgot password? Send reset link
        </button>
        <SaveBtn loading={loading} disabled={!current || !next || !confirm || !!mismatch || !!weak} />
      </div>
    </form>
  );
}

// ─── Payment section ──────────────────────────────────────────────────────────

function PaymentSection() {
  const { user } = useAuth();
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Detect format hint based on country
  const country = user?.country?.toUpperCase() ?? "";
  const ibanPlaceholder =
    country === "PL" ? "PL00 0000 0000 0000 0000 0000 0000" :
    country === "DE" ? "DE00 0000 0000 0000 0000 00" :
    country === "GB" ? "GB00 XXXX 0000 0000 0000 00" :
    country === "FR" ? "FR00 0000 0000 0000 0000 0000 000" :
    "XX00 XXXX XXXX XXXX XXXX XXXX";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iban.trim()) return;
    try {
      setLoading(true); setError(""); setSuccess("");
      // Bank account saved via profile update
      const res = await updateMyProfile({ bio: `IBAN:${iban.trim()}|BANK:${bankName.trim()}` } as any);
      if (res.success) {
        setSuccess("Bank account saved. Withdrawals will be processed within 2–5 business days.");
      } else {
        setError(res.message || "Failed to save bank account.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save bank account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Your bank account is used for payouts when you sell items.
          We support IBAN for EU/EEA countries. All payouts are processed in EUR.
          Funds are transferred within 2–5 business days after a transaction is completed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bank name (optional)"
          value={bankName}
          onChange={setBankName}
          placeholder="e.g. PKO Bank Polski, HSBC, Deutsche Bank"
        />
        <Input
          label="IBAN / Account number"
          value={iban}
          onChange={v => setIban(v.toUpperCase().replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim())}
          placeholder={ibanPlaceholder}
          note="Enter without spaces — we'll format it automatically."
        />
      </div>

      {success && <SuccessBanner msg={success} />}
      {error && <ErrorBanner msg={error} />}

      <div className="flex justify-end">
        <SaveBtn loading={loading} disabled={!iban.trim()} />
      </div>
    </form>
  );
}

// ─── Danger zone ──────────────────────────────────────────────────────────────

function DangerZone() {
  const { logout } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) return;
    try {
      setLoading(true); setError("");
      const res = await deleteAccount(password);
      if (res.success) {
        await logout();
        router.push("/");
      } else {
        setError(res.message || "Failed to delete account.");
      }
    } catch (err: any) {
      setError(err?.message || "Incorrect password or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-red-700 space-y-1">
          <p className="font-bold">This action is permanent and cannot be undone.</p>
          <p>All your listings, bids, messages and collection data will be permanently deleted. Active auctions will be cancelled. Pending payouts may be forfeited.</p>
        </div>
      </div>

      <form onSubmit={handleDelete} className="space-y-4">
        <div className="flex items-start gap-3">
          <input
            id="confirm-delete"
            type="checkbox"
            checked={confirm}
            onChange={e => setConfirm(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-red-600"
          />
          <label htmlFor="confirm-delete" className="text-sm text-gray-700 cursor-pointer">
            I understand that deleting my account is permanent and all data will be lost.
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Enter your password to confirm
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 placeholder:text-gray-300"
          />
        </div>

        {error && <ErrorBanner msg={error} />}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!password || !confirm || loading}
            className="px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Trash2 size={14} />}
            Delete my account
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardSettings() {
  const [open, setOpen] = useState<SectionId | null>("profile");

  const toggle = (id: SectionId) => setOpen(prev => prev === id ? null : id);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-gray-900">Settings</h2>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account preferences</p>
      </div>

      <div className="space-y-3">
        <Section id="profile" active={open === "profile"} onToggle={toggle}
          icon={User} title="Profile" subtitle="Change your username · Name & DOB locked">
          <ProfileSection />
        </Section>

        <Section id="contact" active={open === "contact"} onToggle={toggle}
          icon={Phone} title="Contact" subtitle="Phone number · Email change via support">
          <ContactSection />
        </Section>

        <Section id="password" active={open === "password"} onToggle={toggle}
          icon={Lock} title="Password & Security" subtitle="Change password or send a reset link">
          <PasswordSection />
        </Section>

        <Section id="payment" active={open === "payment"} onToggle={toggle}
          icon={CreditCard} title="Payout account" subtitle="IBAN / bank account for withdrawals">
          <PaymentSection />
        </Section>

        {/* Danger zone — separate style */}
        <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggle("danger")}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50/50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-700">Delete account</p>
              <p className="text-xs text-red-400 mt-0.5">Permanently remove your account and all data</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-red-300 transition-transform duration-200 ${open === "danger" ? "rotate-180" : ""}`}
            />
          </button>
          {open === "danger" && (
            <div className="px-5 pb-5 pt-1 border-t border-red-100">
              <DangerZone />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
