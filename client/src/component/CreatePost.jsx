import React, { useState, useEffect, useRef, useMemo, useCallback, useId } from "react";
import {
  Image as ImageIcon,
  X,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Repeat2,
  Bookmark,
  Trash2,
  BadgeCheck,
  Rss,
  Link2,
  Check,
  MoreHorizontal,
  Pin,
  Copy,
  Flag,
  EyeOff,
  Archive,
  Star,
  Edit3,
  RotateCcw,
  Smile,
  Film,
  BarChart2,
  MapPin,
  Globe,
  Users,
  Lock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Loader2,
  Flame,
  Eye,
} from "lucide-react";

/* ============================================================================
 * STORAGE LAYER  (unchanged architecture — `social_posts` is still the only
 * source of truth for posts; a second lightweight key handles drafts)
 * ----------------------------------------------------------------------------
 * NOTE ON THIS SANDBOX: browser storage APIs are not available inside
 * Claude.ai's artifact preview, so reads/writes are routed through an
 * in-memory adapter mirroring the localStorage API. Swap the marked lines
 * for real `localStorage.getItem` / `setItem` calls in a real app — nothing
 * else about the component changes.
 * ==========================================================================*/
const STORAGE_KEY = "social_posts";
const DRAFT_KEY = "social_post_draft";
let memoryDB = null;
let draftDB = null;

function getStoredPosts() {
  try {
    if (memoryDB === null) {
      // Production: const raw = localStorage.getItem(STORAGE_KEY);
      const raw = null;
      memoryDB = raw ? JSON.parse(raw) : [];
    }
    return memoryDB;
  } catch {
    return [];
  }
}

function setStoredPosts(posts) {
  memoryDB = posts;
  try {
    // Production: localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* Storage full or unavailable — fail silently, state is still in memory */
  }
}

function getDraft() {
  try {
    if (draftDB === null) {
      // Production: const raw = localStorage.getItem(DRAFT_KEY);
      const raw = null;
      draftDB = raw ? JSON.parse(raw) : null;
    }
    return draftDB;
  } catch {
    return null;
  }
}

function setDraft(draft) {
  draftDB = draft;
  try {
    // Production: draft ? localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) : localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* no-op */
  }
}

/* ============================================================================
 * CONSTANTS & HELPERS
 * ==========================================================================*/
const MAX_CHARS = 500;
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const DELETE_UNDO_MS = 5000;
const POP_ANIM_MS = 600;
const TEXT_TRUNCATE_AT = 260;
const URL_REGEX = /(https?:\/\/[^\s]+)/;

const CURRENT_USER = {
  username: "alex.rivera",
  name: "Alex Rivera",
  avatar: "https://i.pravatar.cc/150?img=68",
  verified: true,
};

const REACTIONS = [
  { key: "like", emoji: "👍", label: "Like" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "haha", emoji: "😂", label: "Haha" },
  { key: "wow", emoji: "😮", label: "Wow" },
  { key: "sad", emoji: "😢", label: "Sad" },
  { key: "angry", emoji: "😡", label: "Angry" },
];

const EMOJI_OPTIONS = [
  "😀", "😂", "😍", "🥳", "😎", "🤔", "😢", "😡", "👍", "👏",
  "🙌", "🔥", "💯", "🎉", "❤️", "✨", "🚀", "👀", "😅", "🙏",
];

const AUDIENCES = [
  { key: "public", label: "Public", icon: Globe },
  { key: "friends", label: "Friends", icon: Users },
  { key: "private", label: "Only me", icon: Lock },
];

function generateId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyReactions() {
  return Object.fromEntries(REACTIONS.map((r) => [r.key, 0]));
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

/** Relative time ("2m", "3h", "5d"), falling back to a formatted date past a week. */
function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return formatTimestamp(timestamp);
}

/** Ensures posts written by an older version of this component still render correctly. */
function normalizePost(p) {
  return {
    images: p.images && p.images.length ? p.images : p.image ? [p.image] : [],
    reactions: p.reactions || emptyReactions(),
    userReaction: p.userReaction || (p.liked ? "like" : null),
    views: p.views || 0,
    reposts: p.reposts || 0,
    pinned: p.pinned || false,
    hidden: p.hidden || false,
    archived: p.archived || false,
    favorited: p.favorited || false,
    edited: p.edited || false,
    editedAt: p.editedAt || null,
    audience: p.audience || "public",
    commentsList: p.commentsList || [],
    linkPreview: p.linkPreview || null,
    isRepost: p.isRepost || false,
    repostOf: p.repostOf || null,
    bookmarked: p.bookmarked || false,
    bookmarks: p.bookmarks || 0,
    shares: p.shares || 0,
    comments: p.comments || 0,
    ...p,
    likes: p.reactions ? Object.values(p.reactions).reduce((a, b) => a + b, 0) : p.likes || 0,
  };
}

function countComments(list = []) {
  return list.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Downscales + re-encodes an image so large photos don't bloat localStorage. */
function compressImage(dataUrl, maxWidth = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/** Renders #hashtags, @mentions, and bare URLs as styled inline elements. */
function renderContent(text) {
  return text.split(/(\s+)/).map((part, i) => {
    if (part.startsWith("#") && part.length > 1) {
      return (
        <span key={i} className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    if (part.startsWith("@") && part.length > 1) {
      return (
        <span key={i} className="text-blue-600 dark:text-blue-300 font-medium hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    if (URL_REGEX.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-400 underline decoration-blue-500/40 hover:decoration-blue-500"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

/* ============================================================================
 * SUBCOMPONENT: Toast
 * ==========================================================================*/
function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 pl-4 pr-2 py-2 shadow-2xl animate-fade-in"
    >
      <span className="text-sm font-medium">{toast.message}</span>
      {toast.actionLabel && (
        <button
          onClick={() => {
            toast.onAction?.();
            onDismiss();
          }}
          className="flex items-center gap-1 text-sm font-semibold text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-700 px-2 py-1 rounded-full transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {toast.actionLabel}
        </button>
      )}
      <button onClick={onDismiss} className="p-1.5 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENT: EmojiPicker
 * ==========================================================================*/
function EmojiPicker({ onSelect, onClose }) {
  return (
    <div
      role="dialog"
      aria-label="Emoji picker"
      className="absolute z-20 bottom-full mb-2 left-0 w-64 rounded-2xl border shadow-2xl p-3 bg-white dark:bg-[#12121e] border-gray-200 dark:border-white/10 animate-pop-in"
    >
      <div className="grid grid-cols-6 gap-1.5">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-xl p-1.5 rounded-lg hover:bg-blue-500/10 hover:scale-125 transition-all"
            aria-label={`Insert ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENT: ImageCarousel (composer preview & post display)
 * ==========================================================================*/
function ImageCarousel({ images, onRemove, onOpen, rounded = "rounded-xl" }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const safeIndex = Math.min(index, images.length - 1);
  if (!images.length) return null;

  return (
    <div className={`relative mt-3 overflow-hidden border border-gray-200/70 dark:border-white/10 ${rounded} group`}>
      {!loaded && <div className="absolute inset-0 animate-shimmer" />}
      <img
        src={images[safeIndex]}
        alt={`Attachment ${safeIndex + 1} of ${images.length}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onDoubleClick={() => onOpen?.(safeIndex)}
        onClick={() => onOpen?.(safeIndex)}
        className={`w-full max-h-[420px] object-cover transition-transform duration-500 ease-out cursor-pointer ${
          onOpen ? "group-hover:scale-[1.02]" : ""
        }`}
      />

      {onOpen && (
        <button
          onClick={() => onOpen(safeIndex)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          aria-label="View fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}

      {onRemove && (
        <button
          onClick={() => onRemove(safeIndex)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === safeIndex ? "bg-white w-4" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENT: Lightbox (fullscreen image viewer)
 * ==========================================================================*/
function Lightbox({ state, onClose }) {
  const [index, setIndex] = useState(state?.index || 0);

  useEffect(() => setIndex(state?.index || 0), [state]);

  useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % state.images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + state.images.length) % state.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, onClose]);

  if (!state) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Close viewer">
        <X className="w-5 h-5" />
      </button>

      {state.images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + state.images.length) % state.images.length);
            }}
            className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % state.images.length);
            }}
            className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <img
        src={state.images[index]}
        alt={`Fullscreen attachment ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg animate-pop-in"
      />
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENT: ConfirmModal
 * ==========================================================================*/
function ConfirmModal({ open, title, description, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border shadow-2xl p-5 bg-white dark:bg-[#12121e] border-gray-200 dark:border-white/10 animate-pop-in"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENT: CommentsSection
 * ==========================================================================*/
function CommentThread({ comment, onLike, onDelete, canDelete }) {
  return (
    <div className="flex gap-2">
      <img src={comment.avatar} alt={comment.author} className="w-7 h-7 rounded-full object-cover shrink-0" loading="lazy" />
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl px-3 py-2 bg-gray-100 dark:bg-white/[0.06] inline-block max-w-full">
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">@{comment.author}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{comment.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 pl-3">
          <button
            onClick={onLike}
            className={`text-xs font-medium transition-colors ${comment.liked ? "text-blue-500" : "text-gray-400 hover:text-blue-500"}`}
          >
            Like{comment.likes > 0 ? ` · ${comment.likes}` : ""}
          </button>
          {canDelete && (
            <button onClick={onDelete} className="text-xs font-medium text-gray-400 hover:text-rose-500 transition-colors">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentsSection({ post, onAddComment, onDeleteComment, onLikeComment }) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const total = countComments(post.commentsList);

  const submit = () => {
    if (!text.trim()) return;
    onAddComment(text, replyTo);
    setText("");
    setReplyTo(null);
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-200/70 dark:border-white/10 animate-fade-in">
      <button onClick={() => setCollapsed((c) => !c)} className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
        {collapsed ? `Show ${total} comment${total !== 1 ? "s" : ""}` : `Hide comments`}
      </button>

      {!collapsed && (
        <div className="mt-3 space-y-3">
          {post.commentsList.map((c) => (
            <div key={c.id} className="space-y-2">
              <CommentThread comment={c} onLike={() => onLikeComment(c.id)} onDelete={() => onDeleteComment(c.id)} canDelete />
              {c.replies?.length > 0 && (
                <div className="pl-9 space-y-2">
                  {c.replies.map((r) => (
                    <CommentThread
                      key={r.id}
                      comment={r}
                      onLike={() => onLikeComment(r.id, c.id)}
                      onDelete={() => onDeleteComment(r.id, c.id)}
                      canDelete
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                className="text-xs font-medium text-gray-400 hover:text-blue-500 pl-9 transition-colors"
              >
                {replyTo === c.id ? "Cancel reply" : "Reply"}
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <img src={CURRENT_USER.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={replyTo ? "Write a reply…" : "Write a comment…"}
              className="flex-1 rounded-full border px-3.5 py-2 text-sm bg-gray-100 dark:bg-white/5 border-transparent focus:border-blue-400 dark:focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-colors"
            />
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="p-2 rounded-full bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600 transition-colors"
              aria-label="Send comment"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENT: EmptyState
 * ==========================================================================*/
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center animate-fade-in">
      <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/15 dark:to-indigo-500/15 border-2 border-dashed border-blue-300/50 dark:border-blue-500/30">
        <Rss className="w-8 h-8 text-blue-400" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-base font-semibold text-gray-800 dark:text-gray-100">No posts yet.</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">Create your first post.</p>
      </div>
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENT: PostSkeleton
 * ==========================================================================*/
function PostSkeleton() {
  return (
    <div className="rounded-3xl border p-5 bg-white/70 dark:bg-white/[0.04] border-gray-200/70 dark:border-white/10">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden relative bg-gray-200 dark:bg-white/5">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded-full overflow-hidden relative bg-gray-200 dark:bg-white/5">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-3 w-full rounded-full overflow-hidden relative bg-gray-200 dark:bg-white/5">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-3 w-2/3 rounded-full overflow-hidden relative bg-gray-200 dark:bg-white/5">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENT: PostCard
 * Memoized so unrelated posts don't re-render when a sibling's reaction /
 * bookmark / comment state changes — all mutations go through immutable
 * `.map` calls in the parent, so untouched post objects keep the same
 * reference between renders and React.memo can bail out for them.
 * ==========================================================================*/
const PostCard = React.memo(function PostCard({
  post,
  isRemoving,
  isNew,
  onReact,
  onBookmark,
  onShare,
  onDeleteRequest,
  onEdit,
  onPin,
  onHide,
  onArchive,
  onFavorite,
  onDuplicate,
  onRepost,
  onCopyText,
  onReport,
  onView,
  onOpenLightbox,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  copiedId,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [burst, setBurst] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(post.content);
  const hoverTimer = useRef(null);
  const viewedRef = useRef(false);
  const cardRef = useRef(null);

  /* --- Fire a view event once, the first time this card enters the viewport --- */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewedRef.current) {
          viewedRef.current = true;
          onView(post.id);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onView, post.id]);

  const topReactions = useMemo(
    () =>
      REACTIONS.filter((r) => post.reactions[r.key] > 0)
        .sort((a, b) => post.reactions[b.key] - post.reactions[a.key])
        .slice(0, 2),
    [post.reactions]
  );

  const trendingScore = post.likes * 1 + countComments(post.commentsList) * 2 + post.shares * 1.5 + post.reposts * 2;
  const isLong = post.content.length > TEXT_TRUNCATE_AT;
  const displayText = isLong && !expanded ? `${post.content.slice(0, TEXT_TRUNCATE_AT)}…` : post.content;
  const AudienceIcon = AUDIENCES.find((a) => a.key === post.audience)?.icon || Globe;

  const quickReact = () => {
    onReact(post.id, "like");
    if (post.userReaction !== "like") {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 700);
    }
  };

  const handleDoubleClickImage = () => {
    onReact(post.id, "like");
    setBurst(true);
    window.setTimeout(() => setBurst(false), 700);
  };

  const saveEdit = () => {
    if (!editDraft.trim()) return;
    onEdit(post.id, editDraft.trim());
    setEditing(false);
  };

  return (
    <article
      ref={cardRef}
      className={`relative rounded-3xl border backdrop-blur-xl p-5 shadow-lg shadow-gray-200/40 dark:shadow-black/30
        bg-white/70 dark:bg-white/[0.04] border-gray-200/70 dark:border-white/10
        transition-all duration-300 ease-out
        hover:-translate-y-0.5 hover:shadow-xl hover:border-blue-300/50 dark:hover:border-blue-500/30
        ${isRemoving ? "opacity-0 scale-95 -translate-x-2" : "opacity-100 scale-100"}
        ${isNew ? "animate-pop-in" : "animate-fade-in"}`}
    >
      {post.pinned && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-500 mb-2">
          <Pin className="w-3.5 h-3.5 fill-blue-500" /> Pinned post
        </div>
      )}

      {post.isRepost && post.repostOf && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          <Repeat2 className="w-3.5 h-3.5" /> {CURRENT_USER.name} reposted from @{post.repostOf.username}
        </div>
      )}

      <div className="flex gap-3">
        <img
          src={post.avatar}
          alt={post.name}
          loading="lazy"
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-gray-200 dark:ring-white/10"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{post.name}</span>
              {post.verified && (
                <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0 transition-transform hover:scale-125" />
              )}
              <span className="text-sm text-gray-500 dark:text-gray-500 truncate">@{post.username}</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-sm text-gray-500 dark:text-gray-500 shrink-0" title={formatTimestamp(post.timestamp)}>
                {timeAgo(post.timestamp)}
              </span>
              <AudienceIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" aria-label={post.audience} />
              {post.edited && <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">· edited</span>}
              {trendingScore > 25 && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-orange-500 shrink-0">
                  <Flame className="w-3.5 h-3.5" /> Trending
                </span>
              )}
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                aria-label="More options"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1 w-52 rounded-xl border shadow-2xl p-1.5 z-10 bg-white dark:bg-[#12121e] border-gray-200 dark:border-white/10 animate-pop-in"
                >
                  <button onClick={() => { onPin(post.id); setMenuOpen(false); }} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5">
                    <Pin className="w-3.5 h-3.5" /> {post.pinned ? "Unpin post" : "Pin post"}
                  </button>
                  <button onClick={() => { setEditing(true); setMenuOpen(false); }} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5">
                    <Edit3 className="w-3.5 h-3.5" /> Edit post
                  </button>
                  <button onClick={() => { onCopyText(post.content); setMenuOpen(false); }} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5">
                    <Copy className="w-3.5 h-3.5" /> Copy text
                  </button>
                  <button onClick={() => { onDuplicate(post.id); setMenuOpen(false); }} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5">
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  <button onClick={() => { onFavorite(post.id); setMenuOpen(false); }} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5">
                    <Star className={`w-3.5 h-3.5 ${post.favorited ? "fill-amber-400 text-amber-400" : ""}`} /> {post.favorited ? "Remove favorite" : "Save to favorites"}
                  </button>
                  <button onClick={() => { onArchive(post.id); setMenuOpen(false); }} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5">
                    <Archive className="w-3.5 h-3.5" /> Archive
                  </button>
                  <button onClick={() => { onHide(post.id); setMenuOpen(false); }} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5">
                    <EyeOff className="w-3.5 h-3.5" /> Hide from feed
                  </button>
                  <button onClick={() => { onReport(post.id); setMenuOpen(false); }} role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5">
                    <Flag className="w-3.5 h-3.5" /> Report
                  </button>
                  <div className="my-1 border-t border-gray-200 dark:border-white/10" />
                  <button
                    onClick={() => { onDeleteRequest(post.id); setMenuOpen(false); }}
                    role="menuitem"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete post
                  </button>
                </div>
              )}
            </div>
          </div>

          {editing ? (
            <div className="mt-2 space-y-2 animate-fade-in">
              <textarea
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value.slice(0, MAX_CHARS))}
                rows={3}
                autoFocus
                className="w-full resize-none rounded-xl border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30 p-2.5 text-sm text-gray-800 dark:text-gray-200"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setEditing(false); setEditDraft(post.content); }} className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">
                  Cancel
                </button>
                <button onClick={saveEdit} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                  Save
                </button>
              </div>
            </div>
          ) : (
            post.content && (
              <p className="mt-1.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                {renderContent(displayText)}
                {isLong && (
                  <button onClick={() => setExpanded((v) => !v)} className="ml-1 text-blue-500 text-sm font-medium hover:underline">
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            )
          )}

          {post.linkPreview && (
            <a
              href={post.linkPreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200/70 dark:border-white/10 p-3 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Link2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{post.linkPreview.domain}</p>
                <p className="text-xs text-gray-500 truncate">{post.linkPreview.url}</p>
              </div>
            </a>
          )}

          {post.images.length > 0 && (
            <div className="relative" onDoubleClick={handleDoubleClickImage}>
              <ImageCarousel images={post.images} onOpen={(i) => onOpenLightbox(post.images, i)} />
              {burst && (
                <Heart className="pointer-events-none absolute inset-0 m-auto w-16 h-16 text-rose-500 fill-rose-500 animate-heart-burst" />
              )}
            </div>
          )}

          {/* Engagement stats */}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views} views</span>
            {post.reposts > 0 && <span>{post.reposts} reposts</span>}
          </div>

          {/* Action row */}
          <div className="mt-3 flex items-center justify-between max-w-md relative">
            <div
              className="relative"
              onMouseEnter={() => {
                hoverTimer.current = window.setTimeout(() => setReactionPickerOpen(true), 400);
              }}
              onMouseLeave={() => {
                window.clearTimeout(hoverTimer.current);
                setReactionPickerOpen(false);
              }}
            >
              {reactionPickerOpen && (
                <div className="absolute bottom-full mb-2 left-0 flex gap-1 rounded-full border shadow-2xl px-2 py-1.5 bg-white dark:bg-[#12121e] border-gray-200 dark:border-white/10 animate-pop-in z-10">
                  {REACTIONS.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => {
                        onReact(post.id, r.key);
                        setReactionPickerOpen(false);
                      }}
                      className="text-xl hover:scale-150 transition-transform"
                      aria-label={r.label}
                      title={r.label}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={quickReact}
                className={`flex items-center gap-1.5 text-sm transition-colors group ${
                  post.userReaction ? "text-rose-500" : "text-gray-500 dark:text-gray-500 hover:text-rose-500"
                }`}
                aria-pressed={!!post.userReaction}
                aria-label={post.userReaction ? "Remove reaction" : "Like"}
              >
                {topReactions.length > 0 ? (
                  <span className="flex -space-x-1 text-sm">
                    {topReactions.map((r) => (
                      <span key={r.key}>{r.emoji}</span>
                    ))}
                  </span>
                ) : (
                  <Heart className="w-[18px] h-[18px] transition-transform group-active:scale-90" />
                )}
                {post.likes}
              </button>
            </div>

            <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500 hover:text-blue-500 transition-colors" aria-label="Comment">
              <MessageCircle className="w-[18px] h-[18px]" />
              {countComments(post.commentsList)}
            </button>

            <button
              onClick={() => onRepost(post.id)}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500 hover:text-emerald-500 transition-colors"
              aria-label="Repost"
            >
              <Repeat2 className="w-[18px] h-[18px]" />
              {post.reposts}
            </button>

            <button
              onClick={() => onShare(post.id)}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500 hover:text-sky-500 transition-colors"
              aria-label="Share"
            >
              {copiedId === post.id ? <Check className="w-[18px] h-[18px] text-emerald-500" /> : <Share2 className="w-[18px] h-[18px]" />}
              {post.shares}
            </button>

            <button
              onClick={() => onBookmark(post.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors group ${
                post.bookmarked ? "text-amber-500" : "text-gray-500 dark:text-gray-500 hover:text-amber-500"
              }`}
              aria-pressed={post.bookmarked}
              aria-label={post.bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark className={`w-[18px] h-[18px] transition-transform group-active:scale-125 ${post.bookmarked ? "fill-amber-500" : ""}`} />
              {post.bookmarks}
            </button>
          </div>

          <CommentsSection
            post={post}
            onAddComment={(text, parentId) => onAddComment(post.id, text, parentId)}
            onDeleteComment={(commentId, parentId) => onDeleteComment(post.id, commentId, parentId)}
            onLikeComment={(commentId, parentId) => onLikeComment(post.id, commentId, parentId)}
          />
        </div>
      </div>
    </article>
  );
});

/* ============================================================================
 * MAIN COMPONENT: CreatePost
 * ==========================================================================*/
export default function CreatePost() {
  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // [{ id, dataUrl }]
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [error, setError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  const [audience, setAudience] = useState("public");
  const [linkPreviewDismissed, setLinkPreviewDismissed] = useState(false);
  const [draftBanner, setDraftBanner] = useState(false);

  const [removingId, setRemovingId] = useState(null);
  const [newPostId, setNewPostId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [toast, setToast] = useState(null);
  const [, forceTick] = useState(0);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const isFirstRender = useRef(true);
  const toastTimerRef = useRef(null);
  const pendingDeleteRef = useRef(null);
  const viewedIds = useRef(new Set());
  const textareaId = useId();
  const fileInputId = useId();

  /* --- Fetch posts once on mount (with a brief skeleton for a "fetched" feel) */
  useEffect(() => {
    const stored = getStoredPosts().map(normalizePost);
    const timer = window.setTimeout(() => {
      setPosts(stored.sort((a, b) => b.timestamp - a.timestamp));
      setFeedLoading(false);
    }, 450);

    const savedDraft = getDraft();
    if (savedDraft?.content) {
      setContent(savedDraft.content);
      setAudience(savedDraft.audience || "public");
      setDraftBanner(true);
    }
    return () => window.clearTimeout(timer);
  }, []);

  /* --- Persist to localStorage whenever `posts` changes ----------------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStoredPosts(posts);
  }, [posts]);

  /* --- Debounced draft autosave ------------------------------------------ */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDraft(content.trim() ? { content, audience } : null);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [content, audience]);

  /* --- Auto-resize the composer textarea --------------------------------- */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  /* --- Keep relative timestamps fresh ------------------------------------ */
  useEffect(() => {
    const interval = window.setInterval(() => forceTick((t) => t + 1), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const showToast = useCallback((message, opts = {}) => {
    window.clearTimeout(toastTimerRef.current);
    setToast({ message, actionLabel: opts.actionLabel, onAction: opts.onAction });
    toastTimerRef.current = window.setTimeout(() => setToast(null), opts.duration ?? 3000);
  }, []);

  const visiblePosts = useMemo(
    () =>
      [...posts]
        .filter((p) => !p.hidden && !p.archived)
        .sort((a, b) => (b.pinned === a.pinned ? b.timestamp - a.timestamp : b.pinned ? 1 : -1)),
    [posts]
  );

  const charsLeft = MAX_CHARS - content.length;
  const canPost = content.trim().length > 0 && !isProcessingImages;
  const detectedUrl = useMemo(() => content.match(URL_REGEX)?.[0] || null, [content]);
  const detectedDomain = useMemo(() => {
    if (!detectedUrl) return null;
    try {
      return new URL(detectedUrl).hostname.replace("www.", "");
    } catch {
      return null;
    }
  }, [detectedUrl]);

  /* --- Image handling (multi-file, drag & drop, paste, compression) ------ */
  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (!files.length) {
        showToast("Please select image files.");
        return;
      }
      if (images.length + files.length > MAX_IMAGES) {
        showToast(`You can attach up to ${MAX_IMAGES} images.`);
        return;
      }
      setIsProcessingImages(true);
      const processed = [];
      for (const file of files) {
        if (file.size > MAX_IMAGE_BYTES) {
          showToast(`${file.name} is over 5MB — skipped.`);
          continue;
        }
        try {
          const raw = await fileToBase64(file);
          const compressed = await compressImage(raw);
          processed.push({ id: generateId(), dataUrl: compressed });
        } catch {
          showToast(`Couldn't process ${file.name}.`);
        }
      }
      setImages((prev) => [...prev, ...processed]);
      setIsProcessingImages(false);
      setError("");
    },
    [images.length, showToast]
  );

  const handleImageInput = useCallback((e) => handleFiles(e.target.files), [handleFiles]);

  const handlePaste = useCallback(
    (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files = Array.from(items)
        .filter((it) => it.type.startsWith("image/"))
        .map((it) => it.getAsFile())
        .filter(Boolean);
      if (files.length) handleFiles(files);
    },
    [handleFiles]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
      if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const insertEmoji = useCallback((emoji) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => (c + emoji).slice(0, MAX_CHARS));
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    setContent((c) => (c.slice(0, start) + emoji + c.slice(end)).slice(0, MAX_CHARS));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + emoji.length;
    });
  }, [content.length]);

  /* --- Create post ---------------------------------------------------------- */
  const handlePost = useCallback(() => {
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Write something before you post.");
      return;
    }

    const now = Date.now();
    const newPost = normalizePost({
      id: generateId(),
      username: CURRENT_USER.username,
      name: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      verified: CURRENT_USER.verified,
      timestamp: now,
      createdAt: formatTimestamp(now),
      content: trimmed,
      images: images.map((img) => img.dataUrl),
      audience,
      linkPreview: detectedUrl && !linkPreviewDismissed ? { url: detectedUrl, domain: detectedDomain } : null,
    });

    setPosts((prev) => [newPost, ...prev]);
    setNewPostId(newPost.id);
    window.setTimeout(() => setNewPostId((id) => (id === newPost.id ? null : id)), POP_ANIM_MS);

    // Reset composer + clear draft
    setContent("");
    setImages([]);
    setError("");
    setLinkPreviewDismissed(false);
    setDraft(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("Post published");
  }, [content, images, audience, detectedUrl, detectedDomain, linkPreviewDismissed, showToast]);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handlePost();
    },
    [handlePost]
  );

  /* --- Reactions, bookmark, share, view ----------------------------------- */
  const handleReact = useCallback((postId, key) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const reactions = { ...p.reactions };
        let userReaction = p.userReaction;
        if (userReaction === key) {
          reactions[key] = Math.max(0, reactions[key] - 1);
          userReaction = null;
        } else {
          if (userReaction) reactions[userReaction] = Math.max(0, reactions[userReaction] - 1);
          reactions[key] = (reactions[key] || 0) + 1;
          userReaction = key;
        }
        const likes = Object.values(reactions).reduce((a, b) => a + b, 0);
        return { ...p, reactions, userReaction, likes };
      })
    );
  }, []);

  const handleBookmark = useCallback((id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked, bookmarks: p.bookmarked ? p.bookmarks - 1 : p.bookmarks + 1 } : p))
    );
  }, []);

  const handleShare = useCallback(
    (id) => {
      const shareUrl = `https://loopin.app/post/${id}`;
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(shareUrl).catch(() => {});
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, shares: p.shares + 1 } : p)));
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
      showToast("Link copied to clipboard");
    },
    [showToast]
  );

  const handleView = useCallback((id) => {
    if (viewedIds.current.has(id)) return;
    viewedIds.current.add(id);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)));
  }, []);

  /* --- Delete with confirm + 5s undo -------------------------------------- */
  const requestDelete = useCallback((id) => setConfirmDeleteId(id), []);

  const confirmDelete = useCallback(() => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setPosts((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      window.clearTimeout(pendingDeleteRef.current?.timeoutId);
      pendingDeleteRef.current = { post: prev[index], index };
      pendingDeleteRef.current.timeoutId = window.setTimeout(() => {
        pendingDeleteRef.current = null;
      }, DELETE_UNDO_MS);
      return prev.filter((p) => p.id !== id);
    });
    showToast("Post deleted", { actionLabel: "Undo", duration: DELETE_UNDO_MS, onAction: undoDelete });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmDeleteId, showToast]);

  const undoDelete = useCallback(() => {
    const pending = pendingDeleteRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timeoutId);
    setPosts((prev) => {
      const copy = [...prev];
      copy.splice(pending.index, 0, pending.post);
      return copy;
    });
    pendingDeleteRef.current = null;
  }, []);

  /* --- Edit, pin, hide, archive, favorite, duplicate, repost -------------- */
  const handleEdit = useCallback((id, newContent) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, content: newContent, edited: true, editedAt: Date.now() } : p)));
    showToast("Post updated");
  }, [showToast]);

  const handlePin = useCallback((id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)));
  }, []);

  const handleHide = useCallback(
    (id) => {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, hidden: true } : p)));
      showToast("Post hidden from your feed");
    },
    [showToast]
  );

  const handleArchive = useCallback(
    (id) => {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p)));
      showToast("Post archived");
    },
    [showToast]
  );

  const handleFavorite = useCallback((id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, favorited: !p.favorited } : p)));
  }, []);

  const handleDuplicate = useCallback(
    (id) => {
      setPosts((prev) => {
        const src = prev.find((p) => p.id === id);
        if (!src) return prev;
        const now = Date.now();
        const clone = normalizePost({
          ...src,
          id: generateId(),
          timestamp: now,
          createdAt: formatTimestamp(now),
          pinned: false,
          commentsList: [],
          reactions: emptyReactions(),
          userReaction: null,
          views: 0,
          shares: 0,
          bookmarks: 0,
          bookmarked: false,
          edited: false,
          editedAt: null,
        });
        return [clone, ...prev];
      });
      showToast("Post duplicated");
    },
    [showToast]
  );

  const handleRepost = useCallback(
    (id) => {
      setPosts((prev) => {
        const src = prev.find((p) => p.id === id);
        if (!src) return prev;
        const now = Date.now();
        const repost = normalizePost({
          ...src,
          id: generateId(),
          timestamp: now,
          createdAt: formatTimestamp(now),
          isRepost: true,
          repostOf: { name: src.name, username: src.username },
          commentsList: [],
          reactions: emptyReactions(),
          userReaction: null,
          views: 0,
          shares: 0,
          bookmarks: 0,
          bookmarked: false,
        });
        return [repost, ...prev.map((p) => (p.id === id ? { ...p, reposts: p.reposts + 1 } : p))];
      });
      showToast("Reposted to your profile");
    },
    [showToast]
  );

  const handleCopyText = useCallback(
    (text) => {
      navigator.clipboard?.writeText(text).catch(() => {});
      showToast("Post text copied");
    },
    [showToast]
  );

  const handleReport = useCallback(
    () => showToast("Thanks — we've received your report"),
    [showToast]
  );

  /* --- Comments ------------------------------------------------------------ */
  const addComment = useCallback((postId, text, parentId) => {
    if (!text.trim()) return;
    const comment = {
      id: generateId(),
      author: CURRENT_USER.username,
      avatar: CURRENT_USER.avatar,
      content: text.trim(),
      timestamp: Date.now(),
      likes: 0,
      liked: false,
      replies: [],
    };
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (!parentId) return { ...p, commentsList: [...p.commentsList, comment] };
        return {
          ...p,
          commentsList: p.commentsList.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies || []), comment] } : c)),
        };
      })
    );
  }, []);

  const deleteComment = useCallback((postId, commentId, parentId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (!parentId) return { ...p, commentsList: p.commentsList.filter((c) => c.id !== commentId) };
        return {
          ...p,
          commentsList: p.commentsList.map((c) =>
            c.id === parentId ? { ...c, replies: c.replies.filter((r) => r.id !== commentId) } : c
          ),
        };
      })
    );
  }, []);

  const likeComment = useCallback((postId, commentId, parentId) => {
    const toggle = (c) => (c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (!parentId) return { ...p, commentsList: p.commentsList.map(toggle) };
        return { ...p, commentsList: p.commentsList.map((c) => (c.id === parentId ? { ...c, replies: c.replies.map(toggle) } : c)) };
      })
    );
  }, []);

  const openLightbox = useCallback((imgs, index) => setLightbox({ images: imgs, index }), []);

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-[#0a0a14] transition-colors duration-300 px-4 py-10"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.94) translateY(-6px); } 60% { opacity: 1; transform: scale(1.01); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes heartBurst { 0% { transform: scale(0.3); opacity: 0.9; } 50% { transform: scale(1.3); } 100% { transform: scale(1.7); opacity: 0; } }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .animate-fade-in { animation: fadeIn 0.35s ease both; }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .animate-heart-burst { animation: heartBurst 0.7s ease-out forwards; }
        .animate-shimmer { background: linear-gradient(90deg, rgba(148,163,184,0.15) 25%, rgba(148,163,184,0.3) 37%, rgba(148,163,184,0.15) 63%); background-size: 800px 100%; animation: shimmer 1.6s linear infinite; }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* ================= COMPOSER (sticky while scrolling) ================= */}
        <div className="sticky top-4 z-20">
          <div
            className={`rounded-3xl border backdrop-blur-xl shadow-xl shadow-gray-200/50 dark:shadow-black/40 p-5 transition-colors
              bg-white/80 dark:bg-white/[0.05] border-gray-200/70 dark:border-white/10
              ${isDraggingOver ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-[#0a0a14]" : ""}`}
          >
            {draftBanner && (
              <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-blue-500/10 text-xs text-blue-600 dark:text-blue-400 animate-fade-in">
                <span>Draft restored from your last visit.</span>
                <button
                  onClick={() => {
                    setContent("");
                    setDraft(null);
                    setDraftBanner(false);
                  }}
                  className="font-semibold hover:underline"
                >
                  Discard
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-10 h-10 rounded-full object-cover shrink-0" />

              <div className="flex-1 min-w-0">
                <label htmlFor={textareaId} className="sr-only">
                  Post content
                </label>
                <textarea
                  id={textareaId}
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) setContent(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder="What's happening?"
                  rows={2}
                  maxLength={MAX_CHARS}
                  className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none max-h-72"
                />

                {isProcessingImages && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 animate-fade-in">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Optimizing image…
                  </div>
                )}

                {images.length > 0 && (
                  <ImageCarousel images={images.map((i) => i.dataUrl)} onRemove={removeImage} rounded="rounded-xl" />
                )}

                {detectedUrl && !linkPreviewDismissed && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200/70 dark:border-white/10 p-3 animate-fade-in">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Link2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{detectedDomain}</p>
                      <p className="text-xs text-gray-500 truncate">Link preview will attach to your post</p>
                    </div>
                    <button onClick={() => setLinkPreviewDismissed(true)} className="text-gray-400 hover:text-rose-500 shrink-0" aria-label="Remove link preview">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {error && <p className="mt-2 text-xs text-rose-500 animate-fade-in">{error}</p>}

                {/* Toolbar */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-200/70 dark:border-white/10 pt-3">
                  <div className="flex items-center gap-0.5 relative flex-wrap">
                    <label
                      htmlFor={fileInputId}
                      className="flex items-center justify-center p-2 rounded-full cursor-pointer text-gray-500 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      aria-label="Add photo"
                      title="Photo"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </label>
                    <input id={fileInputId} ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageInput} className="hidden" />

                    <button
                      onClick={() => setShowEmojiPicker((v) => !v)}
                      className="relative p-2 rounded-full text-gray-500 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      aria-label="Add emoji"
                      title="Emoji"
                    >
                      <Smile className="w-4 h-4" />
                      {showEmojiPicker && <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmojiPicker(false)} />}
                    </button>

                    <button
                      onClick={() => showToast("GIF picker coming soon")}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      aria-label="Add GIF"
                      title="GIF"
                    >
                      <Film className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => showToast("Poll builder coming soon")}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      aria-label="Add poll"
                      title="Poll"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => showToast("Feeling & activity picker coming soon")}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      aria-label="Add feeling or activity"
                      title="Feeling / activity"
                    >
                      <Smile className="w-4 h-4 opacity-60" />
                    </button>

                    <button
                      onClick={() => showToast("Location tagging coming soon")}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      aria-label="Add location"
                      title="Location"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowAudienceMenu((v) => !v)}
                        className="flex items-center gap-1 p-2 rounded-full text-gray-500 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors text-xs font-medium"
                        aria-haspopup="menu"
                        aria-expanded={showAudienceMenu}
                        title="Audience"
                      >
                        {React.createElement(AUDIENCES.find((a) => a.key === audience).icon, { className: "w-4 h-4" })}
                      </button>
                      {showAudienceMenu && (
                        <div role="menu" className="absolute z-20 bottom-full mb-2 left-0 w-40 rounded-xl border shadow-2xl p-1.5 bg-white dark:bg-[#12121e] border-gray-200 dark:border-white/10 animate-pop-in">
                          {AUDIENCES.map((a) => (
                            <button
                              key={a.key}
                              onClick={() => {
                                setAudience(a.key);
                                setShowAudienceMenu(false);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                audience === a.key ? "text-blue-500 bg-blue-500/10" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                              }`}
                            >
                              <a.icon className="w-3.5 h-3.5" /> {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-7 h-7 shrink-0" aria-hidden="true">
                      <svg viewBox="0 0 36 36" className="w-7 h-7 -rotate-90">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-white/10" />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={2 * Math.PI * 15.5}
                          strokeDashoffset={2 * Math.PI * 15.5 * (1 - Math.min(content.length / MAX_CHARS, 1))}
                          strokeLinecap="round"
                          className={charsLeft <= 20 ? "text-rose-500" : "text-blue-500"}
                        />
                      </svg>
                      {charsLeft <= 40 && (
                        <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-semibold ${charsLeft <= 20 ? "text-rose-500" : "text-gray-500"}`}>
                          {charsLeft}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handlePost}
                      disabled={!canPost}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-500 disabled:active:scale-100"
                    >
                      Post
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FEED ================= */}
        <div className="space-y-4">
          {feedLoading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : visiblePosts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
              <EmptyState />
            </div>
          ) : (
            visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isRemoving={removingId === post.id}
                isNew={newPostId === post.id}
                onReact={handleReact}
                onBookmark={handleBookmark}
                onShare={handleShare}
                onDeleteRequest={requestDelete}
                onEdit={handleEdit}
                onPin={handlePin}
                onHide={handleHide}
                onArchive={handleArchive}
                onFavorite={handleFavorite}
                onDuplicate={handleDuplicate}
                onRepost={handleRepost}
                onCopyText={handleCopyText}
                onReport={handleReport}
                onView={handleView}
                onOpenLightbox={openLightbox}
                onAddComment={addComment}
                onDeleteComment={deleteComment}
                onLikeComment={likeComment}
                copiedId={copiedId}
              />
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete this post?"
        description="This can be undone for a few seconds after deleting."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}