"use client";

import { useClerk } from "@clerk/nextjs";

export default function PendingPage() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[120px]" />
      </div>

      <div className="relative text-center max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L5 7L8 10L10 5L13 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold tracking-tight">
            Drip<span className="text-violet-400">Shoots</span>
          </span>
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3">Account Under Review</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Your account is pending approval. You will receive an email once approved.
        </p>
        <p className="text-white/30 text-sm mb-10">
          Contact:{" "}
          <a href="mailto:mfaizan518@gmail.com" className="text-violet-400 hover:underline">
            mfaizan518@gmail.com
          </a>
        </p>

        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-6 py-2.5 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
