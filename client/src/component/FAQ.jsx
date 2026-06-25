import React, { useState } from "react";
import { ChevronDown, Lock, Images, Users, Crown, ShieldCheck } from "lucide-react";

/**
 * FAQSection
 * Same dark glassmorphism language as the rest of the homepage
 * (bg-[#0a0a14], glass cards, gradient accents). Expand/collapse uses
 * the CSS grid-template-rows 0fr -> 1fr technique, so the height
 * animates smoothly without measuring DOM heights in JS.
 */

const FAQS = [
  {
    category: "Privacy",
    icon: Lock,
    gradient: "from-indigo-400 to-violet-600",
    glow: "bg-indigo-500/20",
    question: "Who can see what I post?",
    answer:
      "You choose the audience for every post: public, followers only, or a custom list. You can also change a post's visibility after publishing, and individual conversations stay private to the people in them.",
  },
  {
    category: "Privacy",
    icon: Lock,
    gradient: "from-indigo-400 to-violet-600",
    glow: "bg-indigo-500/20",
    question: "Can I permanently delete my data?",
    answer:
      "Yes. Deleting your account removes your posts, messages, and media from the platform. The process starts immediately and finishes within 30 days, giving you a short window to cancel if you change your mind.",
  },
  {
    category: "Content Sharing",
    icon: Images,
    gradient: "from-fuchsia-400 to-pink-600",
    glow: "bg-pink-500/20",
    question: "What file types and sizes can I share?",
    answer:
      "Photos, videos, and short audio clips are all supported. Free accounts can upload files up to 100MB; Pro and Creator plans raise that limit and add automatic compression so quality stays high without slowing down your feed.",
  },
  {
    category: "Communities",
    icon: Users,
    gradient: "from-amber-400 to-orange-600",
    glow: "bg-amber-500/20",
    question: "How do I create or moderate a community?",
    answer:
      "Tap Create Community from your profile, set a name, topic, and privacy level, and invite members. As the owner you can add moderators, set posting rules, and remove members or content that breaks them.",
  },
  {
    category: "Premium Features",
    icon: Crown,
    gradient: "from-violet-400 to-pink-500",
    glow: "bg-violet-500/20",
    question: "What's the difference between Free, Pro, and Creator?",
    answer:
      "Free covers the core experience. Pro adds live streaming, unlimited communities, and priority support. Creator builds on Pro with monetization tools, a verified badge, and advanced analytics for people running this as a business.",
  },
  {
    category: "Account Security",
    icon: ShieldCheck,
    gradient: "from-cyan-400 to-blue-600",
    glow: "bg-cyan-500/20",
    question: "How is my account protected from unauthorized access?",
    answer:
      "Two-factor authentication, login alerts for new devices, and end-to-end encrypted messaging are available on every plan. You can also review and revoke active sessions at any time from your security settings.",
  },
  {
    category: "Account Security",
    icon: ShieldCheck,
    gradient: "from-cyan-400 to-blue-600",
    glow: "bg-cyan-500/20",
    question: "What happens if I lose access to my account?",
    answer:
      "Use the recovery flow with your verified email or phone number to regain access. If two-factor authentication is enabled, you'll also need a backup code, which we recommend saving somewhere safe when you first set it up.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  const Icon = faq.icon;

  return (
    <div
      className={`group rounded-2xl border backdrop-blur-xl transition-colors duration-300
                  ${
                    isOpen
                      ? "border-white/20 bg-white/[0.06]"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.05] hover:border-white/15"
                  }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-4 text-left px-6 py-5"
      >
        <div className="relative shrink-0">
          <div className={`absolute -inset-1.5 rounded-full ${faq.glow} blur-md opacity-60`} />
          <div
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg
                        bg-gradient-to-br ${faq.gradient} shadow-md`}
          >
            <Icon className="h-4 w-4 text-white" strokeWidth={2.25} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-0.5">
            {faq.category}
          </p>
          <p className="text-[15px] font-semibold text-white tracking-tight">
            {faq.question}
          </p>
        </div>

        <ChevronDown
          className={`h-4.5 w-4.5 text-slate-400 shrink-0 transition-transform duration-300 ease-out
                      ${isOpen ? "rotate-180 text-white" : "group-hover:text-slate-300"}`}
        />
      </button>

      <div className={`accordion-content ${isOpen ? "open" : ""}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 pl-[4.25rem] text-sm leading-relaxed text-slate-400">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#0a0a14] py-24 sm:py-32">
      <style>{`
        .accordion-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 320ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .accordion-content.open {
          grid-template-rows: 1fr;
        }
        .accordion-content > div {
          min-height: 0;
        }
      `}</style>

      {/* ambient background mesh, matches rest of homepage */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-1/3 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        {/* header */}
        <div className="text-center mb-14">
          <span
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5
                       px-4 py-1.5 text-xs font-medium tracking-wide text-transparent bg-clip-text
                       bg-gradient-to-r from-indigo-300 to-pink-300 backdrop-blur-sm mb-5"
          >
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Questions, answered
          </h2>
          <p className="text-base text-slate-400">
            Everything you need to know about privacy, sharing, communities,
            and keeping your account secure.
          </p>
        </div>

        {/* accordion list */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        {/* fallback contact line */}
        <p className="text-center text-sm text-slate-500 mt-10">
          Still have questions?{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300 font-medium cursor-pointer hover:underline">
            Contact support
          </span>
        </p>
      </div>
    </section>
  );
}