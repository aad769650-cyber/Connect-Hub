import { useState, useEffect, useRef } from "react";
import {
  Search, X, Heart, MessageCircle, Bookmark, Share2,
  TrendingUp, Flame, Users, ChevronRight, UserPlus,
  Image as ImageIcon, MoreHorizontal, Verified, Sparkles,
  Globe, Gamepad2, Utensils, Plane, Laptop, Trophy,
  Eye, Plus
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DUMMY DATA — Replace each array/object with your API response shapes
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",        label: "All",         icon: Sparkles  },
  { id: "technology", label: "Technology",  icon: Laptop    },
  { id: "travel",     label: "Travel",      icon: Plane     },
  { id: "sports",     label: "Sports",      icon: Trophy    },
  { id: "gaming",     label: "Gaming",      icon: Gamepad2  },
  { id: "food",       label: "Food",        icon: Utensils  },
  { id: "lifestyle",  label: "Lifestyle",   icon: Globe     },
];

const TRENDING_HASHTAGS = [
  { tag: "WebDev2025",    posts: "142K" },
  { tag: "GoldenHour",   posts: "98K"  },
  { tag: "AIArt",        posts: "231K" },
  { tag: "StreetFood",   posts: "76K"  },
  { tag: "NightCity",    posts: "54K"  },
  { tag: "IndieGames",   posts: "33K"  },
  { tag: "CloudKitchen", posts: "21K"  },
  { tag: "PixelPerfect", posts: "18K"  },
];

const FEATURED_CREATORS = [
  { id: 1, name: "Ayesha Noor",    handle: "ayeshanoor",   avatar: "https://i.pravatar.cc/150?img=47", category: "Technology", followers: "128K", verified: true  },
  { id: 2, name: "Bilal Raza",     handle: "bilalcreates", avatar: "https://i.pravatar.cc/150?img=12", category: "Travel",     followers: "89K",  verified: true  },
  { id: 3, name: "Sana Tariq",     handle: "sanatariq",    avatar: "https://i.pravatar.cc/150?img=32", category: "Food",       followers: "204K", verified: false },
  { id: 4, name: "Zaid Mirza",     handle: "zaidm",        avatar: "https://i.pravatar.cc/150?img=59", category: "Gaming",     followers: "67K",  verified: true  },
  { id: 5, name: "Maria Khan",     handle: "mariakhan",    avatar: "https://i.pravatar.cc/150?img=44", category: "Lifestyle",  followers: "312K", verified: true  },
];

const SUGGESTED_USERS = [
  { id: 1, name: "Omar Sheikh",   handle: "omarsheikh",  avatar: "https://i.pravatar.cc/150?img=68", mutualFriends: 4  },
  { id: 2, name: "Hira Baig",    handle: "hira.baig",   avatar: "https://i.pravatar.cc/150?img=21", mutualFriends: 7  },
  { id: 3, name: "Faisal Qadir", handle: "faisalq",     avatar: "https://i.pravatar.cc/150?img=55", mutualFriends: 2  },
  { id: 4, name: "Nida Yousuf",  handle: "nidayousuf",  avatar: "https://i.pravatar.cc/150?img=36", mutualFriends: 11 },
];

const POSTS = [
  {
    id: 1, category: "technology",
    image: "https://picsum.photos/seed/tech1/600/800",
    avatar: "https://i.pravatar.cc/150?img=11",
    username: "devmahar", displayName: "Mahar Dev",
    caption: "Shipped my new side project 🚀 Full-stack with React + Node. The dashboard is giving me all the dopamine hits. #WebDev2025 #ReactJS",
    likes: 1284, comments: 87, bookmarks: 342, views: 9200,
    height: "tall", verified: false,
  },
  {
    id: 2, category: "travel",
    image: "https://picsum.photos/seed/travel2/600/500",
    avatar: "https://i.pravatar.cc/150?img=23",
    username: "bilalcreates", displayName: "Bilal Raza",
    caption: "Hunza Valley at sunrise hits different. No filter needed when nature does this. 🏔️ #GoldenHour #Pakistan",
    likes: 4521, comments: 213, bookmarks: 981, views: 32100,
    height: "medium", verified: true,
  },
  {
    id: 3, category: "food",
    image: "https://picsum.photos/seed/food3/600/700",
    avatar: "https://i.pravatar.cc/150?img=33",
    username: "sanatariq", displayName: "Sana Tariq",
    caption: "Homemade nihari after 8 hours of slow cooking. Worth every second. Recipe in bio 🍲 #StreetFood #CloudKitchen",
    likes: 3102, comments: 478, bookmarks: 1240, views: 21400,
    height: "tall", verified: false,
  },
  {
    id: 4, category: "gaming",
    image: "https://picsum.photos/seed/game4/600/400",
    avatar: "https://i.pravatar.cc/150?img=59",
    username: "zaidm", displayName: "Zaid Mirza",
    caption: "This indie game is PEAK. The pixel art alone deserves an award 🎮 #IndieGames #PixelPerfect",
    likes: 892, comments: 64, bookmarks: 210, views: 6700,
    height: "short", verified: true,
  },
  {
    id: 5, category: "lifestyle",
    image: "https://picsum.photos/seed/life5/600/900",
    avatar: "https://i.pravatar.cc/150?img=44",
    username: "mariakhan", displayName: "Maria Khan",
    caption: "Morning routine unlocked ✨ 5AM walks, cold water, journaling. Consistency > motivation every single time. #Lifestyle",
    likes: 7840, comments: 392, bookmarks: 2310, views: 58000,
    height: "tall", verified: true,
  },
  {
    id: 6, category: "technology",
    image: "https://picsum.photos/seed/ai6/600/600",
    avatar: "https://i.pravatar.cc/150?img=13",
    username: "aiartist_pk", displayName: "Arsh Digital",
    caption: "AI-generated concept art for a cyberpunk Lahore. The models are getting insane 🤖✨ #AIArt #PixelPerfect",
    likes: 5632, comments: 301, bookmarks: 1780, views: 41000,
    height: "medium", verified: false,
  },
  {
    id: 7, category: "sports",
    image: "https://picsum.photos/seed/sport7/600/500",
    avatar: "https://i.pravatar.cc/150?img=71",
    username: "coach_usman", displayName: "Usman Malik",
    caption: "Match day prep 💪 Focused, locked in, ready. Nothing beats that pre-game feeling. #Sports #Cricket",
    likes: 2103, comments: 145, bookmarks: 430, views: 17200,
    height: "medium", verified: false,
  },
  {
    id: 8, category: "food",
    image: "https://picsum.photos/seed/food8/600/700",
    avatar: "https://i.pravatar.cc/150?img=28",
    username: "lahore_eats", displayName: "Lahore Eats",
    caption: "Peri peri loaded fries from that spot on MM Alam that stays open till 3am. A whole lifestyle. 🍟🔥",
    likes: 6421, comments: 529, bookmarks: 1892, views: 49000,
    height: "tall", verified: true,
  },
  {
    id: 9, category: "travel",
    image: "https://picsum.photos/seed/travel9/600/450",
    avatar: "https://i.pravatar.cc/150?img=47",
    username: "ayeshanoor", displayName: "Ayesha Noor",
    caption: "Istanbul is absolutely unreal. Every alley is a painting 🕌🌊 #Travel #GoldenHour",
    likes: 3980, comments: 184, bookmarks: 760, views: 28900,
    height: "short", verified: true,
  },
  {
    id: 10, category: "gaming",
    image: "https://picsum.photos/seed/game10/600/800",
    avatar: "https://i.pravatar.cc/150?img=16",
    username: "lootbox_pk", displayName: "Lootbox PK",
    caption: "The new season drop has me cooked 👾 Grinding ranked until I hit Diamond. Who's with me? #IndieGames",
    likes: 1421, comments: 98, bookmarks: 312, views: 10800,
    height: "tall", verified: false,
  },
  {
    id: 11, category: "lifestyle",
    image: "https://picsum.photos/seed/life11/600/550",
    avatar: "https://i.pravatar.cc/150?img=42",
    username: "minimalspace", displayName: "Minimal Space",
    caption: "Decluttered the home office this weekend. Less stuff, more clarity. Your environment shapes your work. 🪴",
    likes: 4210, comments: 267, bookmarks: 1104, views: 34500,
    height: "medium", verified: false,
  },
  {
    id: 12, category: "technology",
    image: "https://picsum.photos/seed/tech12/600/650",
    avatar: "https://i.pravatar.cc/150?img=7",
    username: "codebyfaraz", displayName: "Faraz Ahmad",
    caption: "Spent the weekend building a real-time multiplayer game with WebSockets. The latency is sub-20ms 🔥 #WebDev2025",
    likes: 2847, comments: 193, bookmarks: 644, views: 22300,
    height: "medium", verified: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-RENDERERS (inline, not separate components)
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonPost({ tall }) {
  return (
    <div className={`rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse ${tall ? "row-span-2" : ""}`}>
      <div className={`w-full bg-gray-200 dark:bg-gray-800 ${tall ? "h-72" : "h-44"}`} />
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

function EmptyState({ query }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-5">
        <ImageIcon className="w-9 h-9 text-violet-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
        {query ? `No results for "${query}"` : "Nothing here yet"}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        {query
          ? "Try a different keyword or browse a category above."
          : "Posts in this category are on their way. Check back soon."}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Explore() {
  const [query, setQuery]             = useState("");
  const [activeCategory, setCategory] = useState("all");
  const [followedCreators, setFollowed] = useState(new Set());
  const [followedSuggested, setFollowedSuggested] = useState(new Set());
  const [likedPosts, setLikedPosts]   = useState(new Set());
  const [savedPosts, setSavedPosts]   = useState(new Set());
  const [loading, setLoading]         = useState(true);
  const [darkMode, setDarkMode]       = useState(true);
  const searchRef                     = useRef(null);

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  // Toggle dark class on root
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const filteredPosts = POSTS.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ = !q || p.caption.toLowerCase().includes(q) || p.username.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  // Split into 3 columns for masonry
  const columns = [[], [], []];
  filteredPosts.forEach((post, i) => columns[i % 3].push(post));

  const toggleFollow = (id, type) => {
    if (type === "creator") {
      setFollowed((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
    } else {
      setFollowedSuggested((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
    }
  };

  const toggleLike = (id) => setLikedPosts((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleSave = (id) => setSavedPosts((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d14] text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* ── STICKY TOP BAR ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0d0d14]/80 border-b border-gray-200/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          {/* Logo wordmark */}
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-500 to-indigo-400 bg-clip-text text-transparent shrink-0 hidden sm:block">
            loopin
          </span>

          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search posts, people, hashtags…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-white/8 border border-transparent focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); searchRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="shrink-0 w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Category Chips */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const active = activeCategory === id;
              return (
                <button
                  key={id}
                  onClick={() => setCategory(id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-md shadow-violet-500/30"
                      : "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/12"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
          <aside className="xl:w-72 shrink-0 space-y-5">

            {/* Trending Hashtags */}
            <div className="rounded-2xl bg-white dark:bg-gray-900/70 border border-gray-100 dark:border-white/6 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-violet-500" />
                  Trending
                </h2>
                <button className="text-xs text-violet-500 hover:text-violet-400 font-medium flex items-center gap-0.5">
                  See all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {TRENDING_HASHTAGS.map(({ tag, posts }, i) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/6 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-gray-400 w-4 text-center font-mono">{i + 1}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-violet-500 transition-colors">
                          #{tag}
                        </p>
                        <p className="text-xs text-gray-400">{posts} posts</p>
                      </div>
                    </div>
                    <Flame className="w-3.5 h-3.5 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="rounded-2xl bg-white dark:bg-gray-900/70 border border-gray-100 dark:border-white/6 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Suggested
                </h2>
              </div>
              <div className="space-y-3">
                {SUGGESTED_USERS.map((u) => {
                  const isFollowed = followedSuggested.has(u.id);
                  return (
                    <div key={u.id} className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate leading-tight">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {u.mutualFriends} mutual friend{u.mutualFriends !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFollow(u.id, "suggested")}
                        className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                          isFollowed
                            ? "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                            : "bg-violet-600 text-white hover:bg-violet-500 shadow-sm"
                        }`}
                      >
                        {isFollowed ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* ── CENTER — POSTS + FEATURED ─────────────────────────────────── */}
          <section className="flex-1 min-w-0 space-y-6">

            {/* Featured Creators Horizontal Scroll */}
            <div>
              <h2 className="text-sm font-bold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Featured Creators
              </h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
                {FEATURED_CREATORS.map((creator) => {
                  const isFollowed = followedCreators.has(creator.id);
                  return (
                    <div
                      key={creator.id}
                      className="shrink-0 w-36 rounded-2xl bg-white dark:bg-gray-900/70 border border-gray-100 dark:border-white/6 p-3.5 flex flex-col items-center text-center gap-2 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                    >
                      <div className="relative">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 ring-violet-500/60 dark:ring-offset-gray-900"
                        />
                        {creator.verified && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                            <Verified className="w-3 h-3 text-white" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight truncate w-full">{creator.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{creator.followers} followers</p>
                        <span className="inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/12 text-violet-500">
                          {creator.category}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFollow(creator.id, "creator")}
                        className={`w-full text-xs font-semibold py-1.5 rounded-lg transition-all ${
                          isFollowed
                            ? "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300"
                            : "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-md shadow-violet-500/25 hover:opacity-90"
                        }`}
                      >
                        {isFollowed ? "Following" : (
                          <span className="flex items-center justify-center gap-1">
                            <UserPlus className="w-3 h-3" /> Follow
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Posts Grid — Masonry via 3-column layout */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {activeCategory === "all" ? "All Posts" : CATEGORIES.find(c => c.id === activeCategory)?.label}
                  {!loading && (
                    <span className="ml-2 text-xs font-normal text-gray-400">({filteredPosts.length})</span>
                  )}
                </h2>
              </div>

              {loading ? (
                // Loading Skeletons
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <SkeletonPost key={i} tall={i % 3 === 0} />
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="grid grid-cols-1">
                  <EmptyState query={query} />
                </div>
              ) : (
                /* Pinterest-style masonry: 3 columns, each stacked vertically */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-start">
                  {columns.map((col, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-3">
                      {col.map((post) => {
                        const liked  = likedPosts.has(post.id);
                        const saved  = savedPosts.has(post.id);
                        const imgH = post.height === "tall" ? "h-72 sm:h-80"
                                   : post.height === "short" ? "h-36 sm:h-44"
                                   : "h-52 sm:h-60";
                        return (
                          <div
                            key={post.id}
                            className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/6 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer"
                          >
                            {/* Image */}
                            <div className={`relative ${imgH} overflow-hidden`}>
                              <img
                                src={post.image}
                                alt={post.caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
                                {/* Quick stats */}
                                <div className="flex items-center gap-3 text-white">
                                  <span className="flex items-center gap-1 text-xs font-semibold">
                                    <Heart className="w-3.5 h-3.5 fill-white" /> {formatCount(post.likes)}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs font-semibold">
                                    <MessageCircle className="w-3.5 h-3.5" /> {formatCount(post.comments)}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs font-semibold">
                                    <Eye className="w-3.5 h-3.5" /> {formatCount(post.views)}
                                  </span>
                                </div>
                              </div>

                              {/* Bookmark button — always visible */}
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleSave(post.id); }}
                                className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                                  saved
                                    ? "bg-violet-500 text-white shadow-lg"
                                    : "bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100"
                                }`}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-white" : ""}`} />
                              </button>
                            </div>

                            {/* Post Footer */}
                            <div className="p-3 space-y-2">
                              {/* User row */}
                              <div className="flex items-center gap-2">
                                <img
                                  src={post.avatar}
                                  alt={post.username}
                                  className="w-6 h-6 rounded-full object-cover ring-1 ring-violet-400/30"
                                />
                                <span className="text-xs font-semibold truncate text-gray-800 dark:text-gray-100">
                                  {post.displayName}
                                </span>
                                {post.verified && (
                                  <Verified className="w-3 h-3 text-violet-500 shrink-0" />
                                )}
                              </div>

                              {/* Caption */}
                              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                                {post.caption}
                              </p>

                              {/* Actions */}
                              <div className="flex items-center justify-between pt-0.5">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => toggleLike(post.id)}
                                    className="flex items-center gap-1 text-xs transition-colors"
                                  >
                                    <Heart
                                      className={`w-4 h-4 transition-transform active:scale-125 ${
                                        liked ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-400"
                                      }`}
                                    />
                                    <span className={`font-medium ${liked ? "text-rose-500" : "text-gray-400"}`}>
                                      {formatCount(post.likes + (liked ? 1 : 0))}
                                    </span>
                                  </button>
                                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-400 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="font-medium">{formatCount(post.comments)}</span>
                                  </button>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Load more */}
              {!loading && filteredPosts.length > 0 && (
                <div className="flex justify-center mt-8">
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/12 hover:border-violet-400/50 transition-all shadow-sm">
                    <Plus className="w-4 h-4" />
                    Load more
                  </button>
                </div>
              )}
            </div>

          </section>
        </div>
      </main>

      {/* ── MOBILE BOTTOM SEARCH HINT ─────────────────────────────────────── */}
      <div className="xl:hidden fixed bottom-6 right-4 z-30">
        <button
          onClick={() => searchRef.current?.focus()}
          className="w-13 h-13 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 shadow-xl shadow-violet-500/40 flex items-center justify-center text-white active:scale-95 transition-transform"
          style={{ width: 52, height: 52 }}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}