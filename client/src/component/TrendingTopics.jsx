import React from "react";
import { TrendingUp, TrendingDown, Flame, Hash, ArrowUpRight } from "lucide-react";

/**
 * TrendingTopicsSection
 * Same dark glassmorphism language as the hero / FeaturesSection
 * (bg-[#0a0a14], glass cards, gradient accents). Layout is a bento
 * grid rather than a uniform grid, since "trending" content benefits
 * from visual hierarchy: the #1 topic gets a larger, featured card.
 */

const TRENDS = [
  {
    rank: 1,
    hashtag: "AIRevolution",
    category: "Technology",
    posts: "847K",
    growth: 340,
    gradient: "from-violet-400 to-indigo-600",
    glow: "bg-violet-500/30",
    text: "text-violet-300",
    featured: true,
    description:
      "Builders and researchers are sharing what they're shipping this week, from new model releases to tools.",
    spark: [30, 45, 40, 60, 55, 80, 95],
  },
  {
    rank: 2,
    hashtag: "WorldCupFinal",
    category: "Sports",
    posts: "612K",
    growth: 128,
    gradient: "from-emerald-400 to-teal-600",
    glow: "bg-emerald-500/30",
    text: "text-emerald-300",
    spark: [50, 55, 45, 70, 65, 85, 90],
  },
  {
    rank: 3,
    hashtag: "MentalHealthMatters",
    category: "Wellness",
    posts: "398K",
    growth: 64,
    gradient: "from-pink-400 to-rose-600",
    glow: "bg-pink-500/30",
    text: "text-pink-300",
    spark: [40, 42, 50, 48, 60, 58, 70],
  },
  {
    rank: 4,
    hashtag: "CryptoSurge",
    category: "Finance",
    posts: "276K",
    growth: 92,
    gradient: "from-amber-400 to-orange-600",
    glow: "bg-amber-500/30",
    text: "text-amber-300",
    spark: [60, 50, 65, 55, 75, 70, 88],
  },
  {
    rank: 5,
    hashtag: "SpaceExploration",
    category: "Science",
    posts: "204K",
    growth: 37,
    gradient: "from-cyan-400 to-blue-600",
    glow: "bg-cyan-500/30",
    text: "text-cyan-300",
    spark: [35, 40, 38, 45, 50, 48, 58],
  },
  {
    rank: 6,
    hashtag: "IndieMusicFest",
    category: "Entertainment",
    posts: "156K",
    growth: -8,
    gradient: "from-slate-400 to-slate-600",
    glow: "bg-slate-500/20",
    text: "text-slate-300",
    spark: [55, 52, 48, 50, 44, 40, 38],
  },
];

function GrowthBadge({ growth }) {
  const positive = growth >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold
                  ${
                    positive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
    >
      {positive ? (
        <TrendingUp className="h-3.5 w-3.5 animate-bounce-slow" strokeWidth={2.5} />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />
      )}
      {positive ? "+" : ""}
      {growth}%
    </span>
  );
}

function Sparkline({ values, colorClass }) {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full ${colorClass} origin-bottom animate-bar-grow`}
          style={{
            height: `${v}%`,
            animationDelay: `${i * 90}ms`,
          }}
        />
      ))}
    </div>
  );
}

function TrendCard({ trend }) {
  const isFeatured = trend.featured;

  return (
    <div
      className={`group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl
                  p-6 transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]
                  hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]
                  ${isFeatured ? "sm:col-span-2 sm:row-span-2 p-8" : ""}`}
    >
      {/* rank + hot badge */}
      <div className="flex items-center justify-between mb-5">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${trend.gradient}
                      text-xs font-bold text-white shadow-md`}
        >
          {trend.rank}
        </div>
        {trend.growth >= 100 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-[11px] font-medium text-orange-300">
            <Flame className="h-3 w-3 animate-pulse" />
            Hot
          </span>
        )}
      </div>

      {/* icon glow */}
      <div className="relative inline-flex mb-4">
        <div
          className={`absolute -inset-2 rounded-full ${trend.glow} blur-lg opacity-50
                      group-hover:opacity-80 transition-opacity duration-300`}
        />
        <div
          className={`relative flex ${isFeatured ? "h-12 w-12" : "h-10 w-10"} items-center justify-center
                      rounded-xl bg-gradient-to-br ${trend.gradient} shadow-lg`}
        >
          <Hash className={isFeatured ? "h-6 w-6 text-white" : "h-5 w-5 text-white"} strokeWidth={2.5} />
        </div>
      </div>

      <h3
        className={`font-bold text-white tracking-tight mb-1 ${
          isFeatured ? "text-2xl" : "text-lg"
        }`}
      >
        {trend.hashtag}
      </h3>
      <p className={`text-xs font-medium mb-4 ${trend.text}`}>{trend.category}</p>

      {isFeatured && trend.description && (
        <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-md">
          {trend.description}
        </p>
      )}

      {/* metrics row */}
      <div className="flex items-end justify-between mt-auto pt-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Posts</p>
          <p className={`font-semibold text-white ${isFeatured ? "text-xl" : "text-base"}`}>
            {trend.posts}
          </p>
        </div>
        <GrowthBadge growth={trend.growth} />
      </div>

      <div className="mt-4">
        <Sparkline values={trend.spark} colorClass={`bg-gradient-to-t ${trend.gradient}`} />
      </div>

      {/* hover arrow */}
      <ArrowUpRight
        className="absolute top-6 right-6 h-4 w-4 text-slate-500 opacity-0 -translate-x-1 translate-y-1
                   group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0
                   transition-all duration-300"
      />
    </div>
  );
}

export default function TrendingTopicsSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a14] py-24 sm:py-32">
      <style>{`
        @keyframes bar-grow {
          0% { transform: scaleY(0.15); opacity: 0.4; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        .animate-bar-grow {
          animation: bar-grow 1.4s ease-in-out infinite alternate;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* ambient background mesh, matches hero / features */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-emerald-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5
                         px-4 py-1.5 text-xs font-medium tracking-wide text-transparent bg-clip-text
                         bg-gradient-to-r from-violet-300 to-pink-300 backdrop-blur-sm mb-5"
            >
              TRENDING NOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              What everyone's talking about
            </h2>
            <p className="text-base text-slate-400 max-w-xl">
              Real-time topics ranked by post volume and growth across the
              platform, refreshed every few minutes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </div>
        </div>

        {/* bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {TRENDS.map((trend) => (
            <TrendCard key={trend.rank} trend={trend} />
          ))}
        </div>
      </div>
    </section>
  );
}