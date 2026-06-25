import React, { useState } from "react";
import { Check, X, Zap, Crown, Sparkles } from "lucide-react";

/**
 * PricingSection
 * Same dark glassmorphism language as the hero / FeaturesSection /
 * TrendingTopicsSection (bg-[#0a0a14], glass cards, gradient accents).
 * All three plans share one FEATURES list so rows line up across cards
 * like a real comparison table, with Pro raised and ringed as the
 * recommended plan.
 */

const FEATURES = [
  { label: "Communities joined", free: "Up to 3", pro: "Unlimited", creator: "Unlimited" },
  { label: "Video quality", free: "720p", pro: "1080p", creator: "4K" },
  { label: "Live streaming", free: false, pro: true, creator: true },
  { label: "AI recommendations", free: "Basic", pro: "Advanced", creator: "Advanced" },
  { label: "Media storage", free: "5GB", pro: "100GB", creator: "1TB" },
  { label: "Analytics dashboard", free: false, pro: "Basic", creator: "Advanced" },
  { label: "Monetization & tipping", free: false, pro: false, creator: true },
  { label: "Verified creator badge", free: false, pro: false, creator: true },
  { label: "Support", free: "Standard", pro: "Priority", creator: "Dedicated manager" },
];

const PLANS = [
  {
    key: "free",
    name: "Free",
    description: "Get started and explore the platform.",
    monthly: 0,
    icon: Sparkles,
    gradient: "from-slate-400 to-slate-600",
    glow: "bg-slate-500/10",
    cta: "Get started free",
    ctaStyle:
      "bg-white/5 border border-white/10 text-white hover:bg-white/10",
  },
  {
    key: "pro",
    name: "Pro",
    description: "For people who post often and want more reach.",
    monthly: 12,
    icon: Zap,
    gradient: "from-violet-400 to-pink-500",
    glow: "bg-violet-500/30",
    cta: "Start Pro trial",
    ctaStyle:
      "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/25 hover:opacity-90 hover:scale-[1.02]",
    highlighted: true,
  },
  {
    key: "creator",
    name: "Creator",
    description: "For full-time creators building a business.",
    monthly: 29,
    icon: Crown,
    gradient: "from-amber-400 to-orange-500",
    glow: "bg-amber-500/20",
    cta: "Go Creator",
    ctaStyle:
      "bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20",
  },
];

function FeatureValue({ value }) {
  if (value === true) {
    return <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={2.5} />;
  }
  if (value === false) {
    return <X className="h-4 w-4 text-slate-600 shrink-0" strokeWidth={2.5} />;
  }
  return <span className="text-xs font-medium text-slate-300 text-right">{value}</span>;
}

function PriceTag({ plan, yearly }) {
  if (plan.monthly === 0) {
    return (
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-bold text-white tracking-tight">$0</span>
        <span className="text-sm text-slate-500">/ forever</span>
      </div>
    );
  }
  const displayed = yearly ? Math.round((plan.monthly * 10) / 12) : plan.monthly;
  return (
    <div className="flex items-baseline gap-1 mb-1">
      <span className="text-4xl font-bold text-white tracking-tight">${displayed}</span>
      <span className="text-sm text-slate-500">/ month</span>
    </div>
  );
}

function PlanCard({ plan, yearly }) {
  const Icon = plan.icon;
  const card = (
    <div
      className={`relative h-full rounded-2xl border backdrop-blur-xl p-7 flex flex-col
                  transition-all duration-300 ease-out
                  ${
                    plan.highlighted
                      ? "border-white/10 bg-[#0d0d1a]"
                      : "border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
    >
      {plan.highlighted && (
        <span
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1
                     rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-3.5 py-1
                     text-[11px] font-semibold text-white shadow-lg shadow-violet-500/30"
        >
          <Sparkles className="h-3 w-3" />
          Most popular
        </span>
      )}

      {/* icon */}
      <div className="relative inline-flex mb-5 w-fit">
        <div
          className={`absolute -inset-2 rounded-full ${plan.glow} blur-lg opacity-60`}
        />
        <div
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl
                      bg-gradient-to-br ${plan.gradient} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight mb-1">{plan.name}</h3>
      <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

      <PriceTag plan={plan} yearly={yearly} />
      {plan.monthly > 0 && yearly && (
        <p className="text-xs text-emerald-400 mb-6">billed ${plan.monthly * 10} / year</p>
      )}
      {plan.monthly > 0 && !yearly && <div className="mb-6" />}

      <button
        className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 mb-7 ${plan.ctaStyle}`}
      >
        {plan.cta}
      </button>

      {/* feature rows */}
      <ul className="space-y-3.5 mt-auto pt-1 border-t border-white/10">
        {FEATURES.map((f) => (
          <li key={f.label} className="flex items-center justify-between gap-3 pt-3.5 first:pt-5">
            <span className="text-xs text-slate-500">{f.label}</span>
            <FeatureValue value={f[plan.key]} />
          </li>
        ))}
      </ul>
    </div>
  );

  if (!plan.highlighted) return card;

  return (
    <div className="relative h-full rounded-2xl p-[1.5px] bg-gradient-to-br from-violet-500/60 via-fuchsia-500/40 to-pink-500/60 lg:scale-105 lg:-translate-y-2 shadow-2xl shadow-violet-900/30">
      {card}
    </div>
  );
}

export default function PricingSection() {
  const [yearly, setYearly] = useState(true);

  return (
    <section className="relative overflow-hidden bg-[#0a0a14] py-24 sm:py-32">
      {/* ambient background mesh, matches hero / features / trending */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-pink-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-amber-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5
                       px-4 py-1.5 text-xs font-medium tracking-wide text-transparent bg-clip-text
                       bg-gradient-to-r from-violet-300 to-amber-300 backdrop-blur-sm mb-5"
          >
            PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Simple pricing for every kind of creator
          </h2>
          <p className="text-base text-slate-400">
            Start free, upgrade when you're ready to reach more people. Cancel anytime.
          </p>
        </div>

        {/* billing toggle */}
        <div className="flex justify-center mb-14">
          <div className="relative inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
            <button
              onClick={() => setYearly(false)}
              className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                !yearly ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                yearly ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Yearly
              <span className="rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5">
                Save 17%
              </span>
            </button>
            <span
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white/10
                          transition-transform duration-300 ease-out ${
                            yearly ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
                          }`}
            />
          </div>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-start">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} yearly={yearly} />
          ))}
        </div>
      </div>
    </section>
  );
}