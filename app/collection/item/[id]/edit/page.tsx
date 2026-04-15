"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";
import {
  getCollectionItem,
  updateCollectionItem,
  type CollectionRarity,
} from "@/lib/api/collection";
import { ArrowLeft, Upload, X, AlertCircle, CheckCircle } from "lucide-react";

const RARITIES: { value: CollectionRarity; label: string; color: string }[] = [
  { value: "common",    label: "Common",    color: "border-gray-300 bg-white" },
  { value: "rare",      label: "Rare",      color: "border-blue-300 bg-blue-50" },
  { value: "epic",      label: "Epic",      color: "border-purple-300 bg-purple-50" },
  { value: "legendary", label: "Legendary", color: "border-amber-300 bg-amber-50" },
];

export default function EditCollectionItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    team: "",
    season: "",
    condition: "",
    manufacturer: "",
    playerName: "",
    playerNumber: "",
    rarity: "common" as CollectionRarity,
    acquiredYear: "",
    acquiredFrom: "",
    estimatedValue: "",
    isVintage: false,
    isPublic: true,
    images: [] as string[],
  });

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (!id) return;
    getCollectionItem(id).then((res) => {
      if (res.success && res.data) {
        const item = res.data;
        // Redirect if not owner
        if (user && item.ownerId !== user.id) {
          router.push(`/collection/item/${id}`);
          return;
        }
        setForm({
          title: item.title,
          description: item.description ?? "",
          team: item.team ?? "",
          season: item.season ?? "",
          condition: item.condition ?? "",
          manufacturer: item.manufacturer ?? "",
          playerName: item.playerName ?? "",
          playerNumber: item.playerNumber ?? "",
          rarity: item.rarity,
          acquiredYear: item.acquiredYear ?? "",
          acquiredFrom: item.acquiredFrom ?? "",
          estimatedValue: item.estimatedValue ? String(item.estimatedValue) : "",
          isVintage: item.isVintage,
          isPublic: item.isPublic,
          images: item.images ?? [],
        });
      } else {
        router.push("/collection/mine");
      }
    }).finally(() => setLoading(false));
  }, [id, user, router]);

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
    setImageUrl("");
  };

  const removeImage = (idx: number) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!id) return;

    setSubmitting(true);
    setError("");
    const res = await updateCollectionItem(id, {
      ...form,
      estimatedValue: form.estimatedValue ? parseFloat(form.estimatedValue) : undefined,
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push(`/collection/item/${id}`), 1200);
    } else {
      setError(res.message ?? "Failed to update item");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border">
          <CheckCircle size={52} className="mx-auto text-emerald-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Changes saved!</h2>
          <p className="text-gray-500 text-sm">Redirecting…</p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-20 sm:pb-8">
        <Link
          href={`/collection/item/${id}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to item
        </Link>

        <h1 className="text-3xl font-light mb-1">Edit Item</h1>
        <p className="text-gray-500 text-sm mb-8">Update the details of your collection item.</p>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Basic Info</h2>
            <div>
              <label className={labelClass}>Title *</label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputClass + " resize-none"} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Team / Club</label>
                <input type="text" value={form.team} onChange={(e) => set("team", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Season</label>
                <input type="text" value={form.season} onChange={(e) => set("season", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Manufacturer</label>
                <input type="text" value={form.manufacturer} onChange={(e) => set("manufacturer", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Player</label>
                <input type="text" value={form.playerName} onChange={(e) => set("playerName", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Condition</label>
                <select value={form.condition} onChange={(e) => set("condition", e.target.value)} className={inputClass}>
                  <option value="">Select…</option>
                  <option value="mint">Mint</option>
                  <option value="excellent">Excellent</option>
                  <option value="very_good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="match_worn">Match Worn</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Estimated value (€)</label>
                <input type="number" min="0" step="0.01" value={form.estimatedValue} onChange={(e) => set("estimatedValue", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Acquired year</label>
                <input type="text" value={form.acquiredYear} onChange={(e) => set("acquiredYear", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Acquired from</label>
                <input type="text" value={form.acquiredFrom} onChange={(e) => set("acquiredFrom", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set("isVintage", !form.isVintage)}
                className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${form.isVintage ? "bg-black" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.isVintage ? "translate-x-4" : "translate-x-0"}`} />
              </button>
              <span className="text-sm font-medium text-gray-700">Vintage item</span>
            </div>
          </div>

          {/* Rarity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Rarity</h2>
            <div className="grid grid-cols-2 gap-3">
              {RARITIES.map((r) => (
                <button key={r.value} type="button" onClick={() => set("rarity", r.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.rarity === r.value ? r.color + " border-current shadow-sm" : "border-gray-100 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="font-bold text-sm">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Images</h2>
            <div className="flex gap-2 mb-3">
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                placeholder="Paste image URL…" className={inputClass + " flex-1"} />
              <button type="button" onClick={addImageUrl}
                className="px-4 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-1">
                <Upload size={14} /> Add
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group">
                    <Image src={url} alt="" width={80} height={80} className="w-20 h-20 object-cover rounded-xl border" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Visibility</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: true,  label: "Public",  desc: "Anyone can view" },
                { value: false, label: "Private", desc: "Only you can see" },
              ].map((opt) => (
                <button key={String(opt.value)} type="button" onClick={() => set("isPublic", opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.isPublic === opt.value ? "border-black bg-black/5" : "border-gray-100 bg-white hover:border-gray-300"
                  }`}>
                  <div className="font-bold text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm">
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
