"use client";

import { useClerk } from "@clerk/nextjs";

export default function RejectedPage() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-red-700/8 blur-[120px]" />
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
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3">Account Not Approved</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Unfortunately your account was not approved.
        </p>
        <p className="text-white/30 text-sm mb-10">
          Contact{" "}
          <a href="mailto:mfaizan518@gmail.com" className="text-violet-400 hover:underline">
            mfaizan518@gmail.com
          </a>{" "}
          for more information.
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
