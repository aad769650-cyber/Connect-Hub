// If you're using Next.js App Router, add `"use client";` as the first line —
// Framer Motion requires a client component.
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Lock,
  Zap,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Quote,
  Image as ImageIcon,
  Bell,
  Home,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

/* ----------------------------- Animation presets ---------------------------- */

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

/* --------------------------------- Helpers ---------------------------------- */

function Counter({ value, suffix = "", duration = 1.8 }) {
  const [display, setDisplay] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const frame = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }
    let start;
    function step(timestamp) {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    }
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration, shouldReduceMotion]);

  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function Avatar({ initials, gradient }) {
  return (
    <span
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-xs font-semibold text-white ring-2 ring-[#0B0B14]`}
    >
      {initials}
    </span>
  );
}

function FloatingBlob({ className, color, duration = 16, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute rounded-full blur-[110px] ${color} ${className}`}
      animate={
        shouldReduceMotion
          ? {}
          : { x: [0, 30, -10, 0], y: [0, -20, 15, 0] }
      }
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function FloatingIcon({ icon: Icon, className, duration = 5, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute text-white/10 ${className}`}
      animate={shouldReduceMotion ? {} : { y: [0, -16, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon size={28} />
    </motion.div>
  );
}

function TrustBadge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-sm">
      <Icon size={13} className="text-indigo-400" aria-hidden="true" />
      {label}
    </span>
  );
}

/* ----------------------------- Dashboard mockup ------------------------------ */

function DashboardMockup() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative" aria-hidden="true">
      {/* Ambient glow behind the panel */}
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-cyan-500/20 blur-3xl" />

      {/* Main glass panel — entrance + gentle continuous float */}
      <motion.div
        initial={{ opacity: 0, x: 50, y: 0 }}
        animate={{
          opacity: 1,
          x: 0,
          y: shouldReduceMotion ? 0 : [0, -10, 0],
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.3 },
          x: { duration: 0.8, delay: 0.3 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
        }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl sm:max-w-lg"
      >
        {/* Window chrome */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Home size={14} />
            <Search size={14} />
            <span className="relative">
              <Bell size={14} />
              <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            <Avatar initials="MQ" gradient="from-purple-500 to-pink-500" />
          </div>
        </div>

        {/* Composer */}
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <Avatar initials="MQ" gradient="from-purple-500 to-pink-500" />
          <span className="flex-1 text-sm text-gray-500">Share something with your community…</span>
          <ImageIcon size={16} className="text-gray-500" />
          <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1.5 text-xs font-semibold text-white">
            Post
          </span>
        </div>

        {/* Feed card 1 */}
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-3">
            <Avatar initials="AK" gradient="from-blue-500 to-cyan-400" />
            <div>
              <p className="text-sm font-semibold text-white">Aiko Tanaka</p>
              <p className="text-xs text-gray-500">2h ago</p>
            </div>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-gray-300">
            Just shipped our biggest community update yet — your feedback made this possible.
          </p>
          <div className="mb-3 h-28 w-full rounded-xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-cyan-400/20" />
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Heart size={14} className="text-pink-400" /> 248
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={14} /> 32
            </span>
            <span className="flex items-center gap-1.5">
              <Share2 size={14} /> 18
            </span>
          </div>
        </div>

        {/* Feed card 2 — peeking */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 opacity-70">
          <Avatar initials="JD" gradient="from-emerald-500 to-teal-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Jordan Diaz</p>
            <p className="truncate text-xs text-gray-500">Loving the new dashboard layout 👏</p>
          </div>
        </div>
      </motion.div>

      {/* Floating chip — liked post */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: shouldReduceMotion ? 0 : [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.9 },
          scale: { duration: 0.6, delay: 0.9 },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        }}
        className="absolute -left-10 top-6 hidden w-52 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-xl lg:flex"
      >
        <Avatar initials="SR" gradient="from-rose-500 to-orange-400" />
        <p className="text-xs text-gray-200">
          <span className="font-semibold text-white">Sarah</span> liked your post
        </p>
        <Heart size={14} className="ml-auto flex-shrink-0 fill-pink-500 text-pink-500" />
      </motion.div>

      {/* Floating chip — follower growth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: shouldReduceMotion ? 0 : [0, 8, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 1.1 },
          scale: { duration: 0.6, delay: 1.1 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.7 },
        }}
        className="absolute -right-6 top-12 hidden w-44 flex-col gap-1 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-xl lg:flex"
      >
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
          <TrendingUp size={13} /> Today
        </span>
        <span className="text-lg font-bold text-white">+128</span>
        <span className="text-[11px] text-gray-400">new followers</span>
      </motion.div>

      {/* Floating testimonial card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.3 }}
        className="absolute -bottom-10 -left-6 hidden w-64 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl md:flex md:flex-col"
      >
        <Quote size={16} className="mb-2 text-indigo-400" />
        <p className="mb-3 text-xs leading-relaxed text-gray-200">
          SocialHub completely changed how our community connects. It actually feels alive.
        </p>
        <div className="flex items-center gap-2">
          <Avatar initials="JC" gradient="from-indigo-500 to-violet-500" />
          <div>
            <p className="text-xs font-semibold text-white">Jamie Chen</p>
            <p className="text-[11px] text-gray-500">Community Lead, Lumen Studios</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------------------------- Hero ------------------------------------ */

export default function HeroSection({ onGetStarted = () => {}, onLogin = () => {} }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="SocialHub introduction"
      className="relative isolate overflow-hidden bg-[#07070f] py-24 sm:py-28 lg:py-32"
    >
      {/* Background blobs */}
      <FloatingBlob
        className="-left-40 -top-40 h-[34rem] w-[34rem]"
        color="bg-indigo-600/30"
        duration={20}
      />
      <FloatingBlob
        className="-bottom-32 -right-32 h-[30rem] w-[30rem]"
        color="bg-violet-600/25"
        duration={22}
        delay={2}
      />
      <FloatingBlob
        className="left-1/2 top-1/3 h-[22rem] w-[22rem] -translate-x-1/2"
        color="bg-cyan-500/10"
        duration={26}
        delay={4}
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Ambient floating icons */}
      <FloatingIcon icon={Heart} className="left-[8%] top-[22%]" duration={6} delay={0.5} />
      <FloatingIcon icon={MessageCircle} className="right-[12%] top-[18%]" duration={7} delay={1.2} />
      <FloatingIcon icon={Sparkles} className="left-[18%] bottom-[16%]" duration={5.5} delay={0.8} />
      <FloatingIcon icon={Users} className="right-[20%] bottom-[24%]" duration={6.5} delay={1.6} />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* ---------------- Left: copy & CTAs ---------------- */}
        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
            </span>
            Now live — free forever plan
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            The social home{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              your community
            </span>{" "}
            deserves
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0"
          >
            SocialHub brings posts, communities, and real conversations into one fast, beautiful
            space — no ads, no noise, just the people you actually care about.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <motion.button
              type="button"
              onClick={onGetStarted}
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] transition-shadow duration-300 hover:shadow-[0_0_45px_-5px_rgba(99,102,241,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f] sm:w-auto"
            >
              Get Started Free
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>

            <motion.button
              type="button"
              onClick={onLogin}
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f] sm:w-auto"
            >
              Log In
            </motion.button>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-3 text-xs text-gray-500">
            No credit card required · Cancel anytime
          </motion.p>

          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-5 lg:justify-start"
          >
            <div className="flex -space-x-2">
              <Avatar initials="AK" gradient="from-blue-500 to-cyan-400" />
              <Avatar initials="SR" gradient="from-rose-500 to-orange-400" />
              <Avatar initials="JD" gradient="from-emerald-500 to-teal-400" />
              <Avatar initials="TL" gradient="from-amber-500 to-yellow-400" />
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-gray-200 ring-2 ring-[#07070f]">
                +2M
              </span>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-0.5 sm:justify-start" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-200">4.9/5</span> from 12,000+ reviews ·{" "}
                <Counter value={2400000} suffix="+ members" />
              </p>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
          >
            <TrustBadge icon={ShieldCheck} label="SOC 2 Type II" />
            <TrustBadge icon={Lock} label="256-bit encryption" />
            <TrustBadge icon={Zap} label="99.9% uptime" />
          </motion.div>
        </motion.div>

        {/* ---------------- Right: dashboard mockup ---------------- */}
        <div className="flex justify-center pt-4 lg:justify-end lg:pt-0">
          <DashboardMockup />
        </div>
      </div>

      {/* ---------------- Bottom: "trusted by" strip ---------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto mt-20 max-w-5xl px-6 lg:px-8"
      >
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-gray-600">
          Trusted by community teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60 grayscale">
          {["Lumen", "Orbital", "NorthPeak", "Vantage", "Kindred"].map((brand) => (
            <span key={brand} className="text-lg font-bold tracking-tight text-gray-400">
              {brand}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}