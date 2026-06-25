import React, { useState } from "react";
import {
  Repeat,
  Mail,
  Check,
 
} from "lucide-react";

/**
 * FooterSection
 * Closing beat of the homepage — same dark theme as the hero / Features /
 * Trending / Pricing / FAQ, but deliberately quieter: one soft ambient
 * glow instead of several, since a footer should settle the page down
 * rather than compete with it.
 */

const LINK_COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Communities", "Live Streaming", "Mobile App", "What's New"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Blog", "Brand Kit"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Community Guidelines", "Developer API", "Creator Resources", "Status"],
  },
  {
    title: "Community",
    links: ["Trending", "Events", "Ambassadors", "Forums", "Become a Moderator"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "Security"],
  },
];


function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
        <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
        You're subscribed. Watch your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <div className="relative flex-1">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm
                     text-white placeholder:text-slate-500 backdrop-blur-xl outline-none
                     transition-colors duration-200 focus:border-white/25 focus:bg-white/[0.06]"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-5 py-2.5 text-sm font-semibold
                   text-white shadow-lg shadow-violet-500/20 transition-all duration-200
                   hover:opacity-90 hover:scale-[1.02] shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}

function FooterLink({ label }) {
  return (
    <li>
      <a
        href="#"
        className="group inline-flex items-center text-sm text-slate-400 transition-all duration-200
                   hover:text-white hover:translate-x-0.5"
      >
        {label}
      </a>
    </li>
  );
}

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden bg-[#06060b] border-t border-white/10 pt-20">
      {/* single soft ambient glow, quieter than the rest of the page */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* brand + newsletter banner */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-14 border-b border-white/10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-pink-500 shadow-lg shadow-violet-500/20">
                <Repeat className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Loopin</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The social platform built for real connection, live moments, and
              communities that actually feel like yours.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-white mb-1">Stay in the loop</p>
            <p className="text-xs text-slate-500 mb-3">
              Product updates and community highlights. No spam, unsubscribe anytime.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 py-14">
          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <FooterLink key={link} label={link} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 py-8 border-t border-white/10">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 Loopin, Inc. All rights reserved.
          </p>

      
        </div>
      </div>
    </footer>
  );
}