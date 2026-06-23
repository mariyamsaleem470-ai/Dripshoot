"use client";

import Link from "next/link";

const PLAN = {
  id: "standard",
  name: "DripShoots Plan",
  price: 100,
  credits: 400,
  features: [
    "400 credits — use for images or video reels",
    "AI model photo generation (garments, jewellery, crockery)",
    "AI video reel generation",
    "Front, back & side views",
    "Custom AI prompts",
    "Cloudinary storage",
    "WooCommerce & Shopify export",
    "Brand watermark",
    "Priority generation",
  ],
};

const FAQ = [
  {
    q: "Do credits expire?",
    a: "Credits are valid for 30 days from the date of purchase.",
  },
  {
    q: "Can credits be used for both images and reels?",
    a: "Yes — your 400 credits can be used for AI model photos, product photos, or video reels, in any combination.",
  },
  {
    q: "What payment methods are accepted?",
    a: "All major cards via Stripe (coming soon). Bank transfer available on request.",
  },
];

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="7" cy="7" r="7" className="fill-violet-500/20" />
      <path
        d="M4 7l2 2 4-4"
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-fuchsia-700/8 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 12L5 7L8 10L10 5L13 2"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-tight">
              Drip<span className="text-violet-400">Shoots</span>
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Hero */}
        <div className="text-center mb-14 sm:mb-20">
          <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">
            Pricing
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto">
            One plan. Everything included. No confusing tiers.
          </p>
        </div>

        {/* Plan */}
        <div className="flex justify-center mb-20">
          <div className="relative rounded-2xl border border-violet-500 bg-violet-500/5 flex flex-col w-full max-w-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-violet-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                Everything Included
              </span>
            </div>

            <div className="p-6 sm:p-7 flex flex-col flex-1">

              {/* Plan name */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">{PLAN.name}</h2>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
                  {PLAN.credits} credits
                </span>
              </div>

              {/* Price */}
              <div className="mb-1">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight">
                  ${PLAN.price}
                </span>
                <span className="text-white/30 text-sm ml-2">/month</span>
              </div>
              <p className="text-[11px] text-white/25 mb-6">
                400 credits to use across images and video reels
              </p>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-6" />

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {PLAN.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/sign-up"
                className="w-full py-3 rounded-xl text-sm font-semibold text-center transition-colors block bg-violet-600 hover:bg-violet-500 text-white"
              >
                Get Started
              </Link>

            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <div
                key={q}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-6 py-5"
              >
                <p className="text-sm font-medium text-white/80 mb-1.5">{q}</p>
                <p className="text-sm text-white/40">{a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 text-center">
        <p className="text-xs text-white/20">
          &copy; {new Date().getFullYear()} DripShoots. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
