"use client";

import Link from "next/link";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    credits: 150,
    images: 150,
    reels: 0,
    popular: false,
    features: [
      "150 AI generated images",
      "Front & back views",
      "Custom AI prompts",
      "Cloudinary storage",
      "WooCommerce & Shopify export",
      "Brand watermark",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 99,
    credits: 300,
    images: 250,
    reels: 5,
    popular: true,
    features: [
      "250 AI generated images",
      "5 AI video reels (10s each)",
      "Front, back & side views",
      "Custom AI prompts",
      "Cloudinary storage",
      "WooCommerce & Shopify export",
      "Brand watermark",
      "Priority generation",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    credits: 750,
    images: 620,
    reels: 15,
    popular: false,
    features: [
      "620 AI generated images",
      "15 AI video reels (10s each)",
      "All view angles",
      "Custom AI prompts",
      "Cloudinary storage",
      "WooCommerce & Shopify export",
      "Brand watermark",
      "Priority generation",
      "Bulk download",
    ],
  },
  {
    id: "reels",
    name: "Reels Only",
    price: 49,
    credits: 160,
    images: 0,
    reels: 20,
    popular: false,
    features: [
      "20 AI video reels (10s each)",
      "720p resolution",
      "Custom motion prompts",
      "Multiple formats (9:16, 1:1, 16:9)",
      "Brand watermark on videos",
      "Direct social sharing",
    ],
  },
];

const FAQ = [
  {
    q: "Do credits expire?",
    a: "Credits are valid for 12 months from the date of purchase.",
  },
  {
    q: "Can I upgrade?",
    a: "Yes, purchase any plan anytime. Credits stack — unused credits carry over.",
  },
  {
    q: "What payment methods are accepted?",
    a: "All major cards via Stripe (coming soon). PKR bank transfer available on request.",
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
            Pay once, use your credits anytime. No subscriptions.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border flex flex-col transition-all ${
                plan.popular
                  ? "border-violet-500 bg-violet-500/5"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-7 flex flex-col flex-1">

                {/* Plan name */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  <div className="flex items-center gap-2">
                    {plan.images > 0 && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-white/50">
                        {plan.images} images
                      </span>
                    )}
                    {plan.reels > 0 && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300">
                        {plan.reels} reels
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="text-white/30 text-sm ml-2">/one-time</span>
                </div>
                <p className="text-[11px] text-white/25 mb-6">
                  {plan.credits} credits included
                </p>

                {/* Divider */}
                <div className="h-px bg-white/[0.06] mb-6" />

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/sign-up"
                  className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-colors block ${
                    plan.popular
                      ? "bg-violet-600 hover:bg-violet-500 text-white"
                      : "bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white/80"
                  }`}
                >
                  Get Started
                </Link>

              </div>
            </div>
          ))}
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
