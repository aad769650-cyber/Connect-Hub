import React from "react";
import {
  MessageCircle,
  Images,
  Users,
  Radio,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

/**
 * FeaturesSection
 * Dark glassmorphism SaaS-style feature grid, designed to sit directly
 * beneath a matching dark-theme hero (same background mesh + glass card
 * language). Each feature carries its own gradient identity so the six
 * cards read as distinct capabilities rather than six copies of one accent.
 */

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Real-Time Messaging",
    description:
      "Chat instantly with friends, groups, or communities. Messages deliver in milliseconds, with typing indicators and read receipts built in.",
    gradient: "from-cyan-400 to-blue-600",
    glow: "bg-blue-500/30",
  },
  {
    icon: Images,
    title: "Content Sharing",
    description:
      "Post photos, videos, and stories in seconds. Smart compression keeps quality high without slowing down your feed.",
    gradient: "from-fuchsia-400 to-pink-600",
    glow: "bg-pink-500/30",
  },
  {
    icon: Users,
    title: "Communities",
    description:
      "Join spaces built around your interests, or start your own. Built-in moderation tools help it stay welcoming as it grows.",
    gradient: "from-amber-400 to-orange-600",
    glow: "bg-orange-500/30",
  },
  {
    icon: Radio,
    title: "Live Streaming",
    description:
      "Go live in one tap and reach your followers in real time, with low-latency video and an interactive chat overlay.",
    gradient: "from-rose-400 to-red-600",
    glow: "bg-red-500/30",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description:
      "Discover content and people you'll actually like. The recommendation engine learns your taste, not just your clicks.",
    gradient: "from-emerald-400 to-teal-600",
    glow: "bg-teal-500/30",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Controls",
    description:
      "Decide exactly who sees what. Granular controls let you manage visibility down to the individual post.",
    gradient: "from-indigo-400 to-violet-600",
    glow: "bg-violet-500/30",
  },
];

function FeatureCard({ icon: Icon, title, description, gradient, glow }) {
  return (
    <div
      className="group relative rounded-2xl border border-white/10 bg-white/[0.04]
                 backdrop-blur-xl p-7 transition-all duration-300 ease-out
                 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.06]
                 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
    >
      {/* gradient ring on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0
                   group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%)",
        }}
      />

      {/* icon */}
      <div className="relative mb-6 inline-flex">
        <div
          className={`absolute -inset-2 rounded-2xl ${glow} blur-xl opacity-60
                      group-hover:opacity-90 transition-opacity duration-300`}
        />
        <div
          className={`relative flex h-12 w-12 items-center justify-center rounded-xl
                      bg-gradient-to-br ${gradient} shadow-lg
                      transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
        >
          <Icon className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a14] py-24 sm:py-32">
      {/* ambient background mesh, matches hero */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span
            className="inline-flex items-center rounded-full border border-white/10
                       bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide
                       text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300
                       backdrop-blur-sm mb-5"
          >
            FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Everything you need to connect, share, and grow
          </h2>
          <p className="text-base text-slate-400">
            One platform for messaging, content, and community, built to feel
            fast, personal, and entirely yours.
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}