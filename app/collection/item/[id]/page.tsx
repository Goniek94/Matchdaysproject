"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";
import {
  getCollectionItem,
  getComments,
  addComment,
  deleteComment,
  type CollectionItemDto,
  type CommentDto,
} from "@/lib/api/collection";
import {
  ArrowLeft,
  Eye,
  Package,
  Star,
  Zap,
  Crown,
  Gavel,
  Pencil,
  Trash2,
  Send,
  Shield,
  Calendar,
  Tag,
  MessageCircle,
} from "lucide-react";

const RARITY = {
  common:    { label: "Common",    color: "text-gray-600",   bg: "bg-gray-100",   border: "border-gray-200",   icon: <Package size={13} /> },
  rare:      { label: "Rare",      color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   icon: <Star size={13} /> },
  epic:      { label: "Epic",      color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-200", icon: <Zap size={13} /> },
  legendary: { label: "Legendary", color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200",  icon: <Crown size={13} /> },
} as const;

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-gray-900 font-semibold text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  itemOwnerId,
  onDelete,
}: {
  comment: CommentDto;
  currentUserId?: string;
  itemOwnerId: string;
  onDelete: (id: string) => void;
}) {
  const canDelete = currentUserId === comment.authorId || currentUserId === itemOwnerId;
  const initials = comment.author.username[0].toUpperCase();

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden text-xs font-bold text-gray-600">
        {comment.author.avatar ? (
          <Image src={comment.author.avatar} alt="" width={32} height={32} className="object-cover" />
        ) : initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <Link
            href={`/profile/${comment.author.username}`}
            className="text-sm font-bold text-gray-900 hover:underline"
          >
            {comment.author.username}
          </Link>
          <span className="text-[10px] text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
      </div>
      {canDelete && (
        <button
          onClick={() => onDelete(comment.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 flex-shrink-0 mt-1"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export default function CollectionItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState<CollectionItemDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([getCollectionItem(id), getComments(id)])
      .then(([itemRes, commentsRes]) => {
        if (itemRes.success && itemRes.data) setItem(itemRes.data);
        if (commentsRes.success && commentsRes.data) setComments(commentsRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;
    setSending(true);
    const res = await addComment(id, commentText.trim());
    if (res.success && res.data) {
      setComments((prev) => [...prev, res.data!]);
      setCommentText("");
    }
    setSending(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const res = await deleteComment(commentId);
    if (res.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  const handleListOnAuction = () => {
    if (!item) return;
    const params = new URLSearchParams({
      title: item.title,
      description: item.description ?? "",
      team: item.team ?? "",
      season: item.season ?? "",
      category: item.category ?? "",
      itemType: item.itemType ?? "shirt",
      condition: item.condition ?? "",
      manufacturer: item.manufacturer ?? "",
      playerName: item.playerName ?? "",
      fromCollection: item.id,
    });
    router.push(`/add-listing?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-2xl font-light mb-2">Item not found</h2>
          <Link href="/collection/mine" className="text-black underline text-sm">
            Back to collection
          </Link>
        </div>
      </div>
    );
  }

  const r = RARITY[item.rarity as keyof typeof RARITY] ?? RARITY.common;
  const isOwner = user?.id === item.ownerId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20 sm:pb-8">
        {/* Back */}
        <Link
          href={isOwner ? "/collection/mine" : `/collection/${item.owner?.username ?? ""}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Images ── */}
          <div>
            <div className="relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3">
              {item.images?.[activeImage] ? (
                <Image
                  src={item.images[activeImage]}
                  alt={item.title}
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={48} className="text-gray-200" />
                </div>
              )}
              {/* Badges */}
              <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${r.color} ${r.bg} ${r.border}`}>
                {r.icon} {r.label}
              </span>
              {item.isVintage && (
                <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  Vintage
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {item.images && item.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {item.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? "border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                {item.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Link
                  href={`/profile/${item.owner?.username}`}
                  className="flex items-center gap-1.5 font-semibold text-gray-700 hover:underline"
                >
                  {item.owner?.avatar ? (
                    <Image src={item.owner.avatar} alt="" width={20} height={20} className="rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                      {item.owner?.username[0].toUpperCase()}
                    </div>
                  )}
                  {item.owner?.username}
                </Link>
                <span className="flex items-center gap-1">
                  <Eye size={13} /> {item.views} views
                </span>
              </div>
            </div>

            {/* Estimated value */}
            {item.estimatedValue && (
              <div className="bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Estimated Value</p>
                <p className="text-3xl font-black text-gray-900">
                  ~€{Number(item.estimatedValue).toLocaleString()}
                </p>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <DetailRow label="Team / Club"      value={item.team} />
              <DetailRow label="Season"           value={item.season} />
              <DetailRow label="Condition"        value={item.condition} />
              <DetailRow label="Manufacturer"     value={item.manufacturer} />
              <DetailRow label="Player"           value={item.playerName} />
              <DetailRow label="Number"           value={item.playerNumber} />
              <DetailRow label="Acquired year"    value={item.acquiredYear} />
              <DetailRow label="Acquired from"    value={item.acquiredFrom} />
              {item.isVintage && (
                <div className="flex items-center gap-1.5 pt-2 text-xs text-amber-700 font-semibold">
                  <Tag size={12} /> Vintage item
                </div>
              )}
              <div className="flex items-center gap-1.5 pt-2 text-xs text-gray-400">
                <Calendar size={12} />
                Added {new Date(item.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </div>
            </div>

            {/* Privacy badge */}
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              item.isPublic
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}>
              <Shield size={12} />
              {item.isPublic ? "Public" : "Private"}
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleListOnAuction}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 active:scale-95 transition-all"
                >
                  <Gavel size={15} /> List on Auction
                </button>
                <Link
                  href={`/collection/item/${item.id}/edit`}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-400 active:scale-95 transition-all"
                >
                  <Pencil size={15} /> Edit
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Comments ── */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={18} className="text-gray-700" />
            <h2 className="text-lg font-black text-gray-900">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment form */}
          {isAuthenticated ? (
            <form onSubmit={handleSendComment} className="mb-8">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
                  {user?.avatar ? (
                    <Image src={user.avatar} alt="" width={36} height={36} className="object-cover" />
                  ) : (user?.username?.[0]?.toUpperCase() ?? "?")}
                </div>
                <div className="flex-1 relative">
                  <textarea
                    ref={commentInputRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment…"
                    rows={2}
                    maxLength={1000}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendComment(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sending || !commentText.trim()}
                    className="absolute right-3 bottom-3 p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-8 text-center text-sm text-gray-500">
              <Link href="/login" className="text-black font-semibold hover:underline">
                Sign in
              </Link>{" "}
              to leave a comment
            </div>
          )}

          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No comments yet. Be the first!
            </div>
          ) : (
            <div className="space-y-5">
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  currentUserId={user?.id}
                  itemOwnerId={item.ownerId}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
