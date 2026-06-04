"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminUser = {
  id: string;
  email: string;
  plan: string;
  credits: number;
  creditsUsed: number;
  creditsLimit: number;
  projectsCount: number;
  createdAt: string;
};

type AdminStats = {
  totalUsers: number;
  totalProjects: number;
  totalCreditsUsed: number;
  revenueEstimate: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PLANS = ["free", "starter", "growth", "pro", "agency"] as const;

const PLAN_BADGE: Record<string, string> = {
  free:    "bg-white/10 text-white/50",
  starter: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  growth:  "bg-green-500/15 text-green-400 border border-green-500/20",
  pro:     "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  agency:  "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

const PAGE_SIZE = 10;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});

  const refreshUsers = async () => {
    const data = await fetch("/api/admin/users").then((r) => r.json());
    if (!data.error) setUsers(data.users ?? []);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
    ]).then(([statsData, usersData]) => {
      if (statsData.error === "Forbidden" || usersData.error === "Forbidden") {
        setAccessDenied(true);
        setTimeout(() => router.push("/dashboard"), 2500);
        return;
      }
      setStats(statsData);
      setUsers(usersData.users ?? []);
    }).finally(() => setLoading(false));
  }, [router]);

  const callPatch = async (userId: string, body: Record<string, unknown>) => {
    setUpdating((p) => ({ ...p, [userId]: true }));
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...body }),
      });
      if (res.ok) {
        await refreshUsers();
        setSuccess((p) => ({ ...p, [userId]: true }));
        setTimeout(() => setSuccess((p) => ({ ...p, [userId]: false })), 2000);
      }
    } finally {
      setUpdating((p) => ({ ...p, [userId]: false }));
    }
  };

  const handleSetPlan = (userId: string, plan: string) =>
    callPatch(userId, { action: "setPlan", plan });

  const handleAddCredits = (userId: string) => {
    const raw = prompt("How many credits to add?");
    if (!raw) return;
    const amount = parseInt(raw, 10);
    if (isNaN(amount) || amount <= 0) { alert("Enter a valid positive number."); return; }
    callPatch(userId, { action: "addCredits", amount });
  };

  const handleReset = (userId: string) =>
    callPatch(userId, { action: "reset" });

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce<(number | "…")[]>((acc, n, idx, arr) => {
      if (idx > 0 && (n as number) - (arr[idx - 1] as number) > 1) acc.push("…");
      acc.push(n);
      return acc;
    }, []);

  // ── Access denied ─────────────────────────────────────────────────────────

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <p className="text-xl font-bold text-red-400">Access Denied</p>
          <p className="text-white/40 text-sm">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-500/60 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-violet-700/8 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-fuchsia-700/6 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12L5 7L8 10L10 5L13 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[17px] font-semibold tracking-tight">
                Drip<span className="text-violet-400">Shoots</span>
              </span>
              <span className="text-[11px] bg-violet-500/15 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            </div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-white/30 text-sm mt-0.5">Manage users, plans, and platform stats</p>
          </div>
          <Link
            href="/dashboard"
            className="flex-shrink-0 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded-lg transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {([
              { label: "Total Users",    value: stats.totalUsers.toLocaleString(),           icon: "👥" },
              { label: "Total Projects", value: stats.totalProjects.toLocaleString(),        icon: "🗂️" },
              { label: "Credits Used",   value: stats.totalCreditsUsed.toLocaleString(),     icon: "✨" },
              { label: "Est. Revenue",   value: `$${stats.revenueEstimate.toLocaleString()}`, icon: "💰" },
            ] as { label: string; value: string; icon: string }[]).map((card) => (
              <div
                key={card.label}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-colors"
              >
                <p className="text-2xl mb-3 leading-none">{card.icon}</p>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                <p className="text-xs text-white/35 mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + count */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-72 bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <p className="text-xs text-white/30">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {["Email", "Plan", "Credits Left / Limit", "Used", "Projects", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-white/20 text-sm">
                      No users found
                    </td>
                  </tr>
                ) : (
                  paginated.map((user, i) => (
                    <tr
                      key={user.id}
                      className={`border-b border-white/[0.04] last:border-0 hover:bg-violet-500/[0.04] transition-colors ${
                        i % 2 !== 0 ? "bg-white/[0.012]" : ""
                      }`}
                    >
                      {/* Email */}
                      <td className="px-4 py-3">
                        <span
                          className="font-mono text-xs text-white/70 block max-w-[180px] truncate"
                          title={user.email}
                        >
                          {user.email}
                        </span>
                      </td>

                      {/* Plan badge */}
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${PLAN_BADGE[user.plan] ?? PLAN_BADGE.free}`}>
                          {user.plan}
                        </span>
                      </td>

                      {/* Credits progress */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                user.credits / user.creditsLimit > 0.5
                                  ? "bg-violet-500"
                                  : user.credits / user.creditsLimit > 0.2
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(100, Math.round((user.credits / user.creditsLimit) * 100))}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/45 whitespace-nowrap tabular-nums">
                            {user.credits}/{user.creditsLimit}
                          </span>
                        </div>
                      </td>

                      {/* Used */}
                      <td className="px-4 py-3 text-xs text-white/45 tabular-nums">
                        {user.creditsUsed}
                      </td>

                      {/* Projects */}
                      <td className="px-4 py-3 text-xs text-white/45 tabular-nums">
                        {user.projectsCount}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-xs text-white/35 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">

                          {/* Plan dropdown */}
                          <select
                            value={user.plan}
                            onChange={(e) => handleSetPlan(user.id, e.target.value)}
                            disabled={!!updating[user.id]}
                            className="bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-white/65 px-2 py-1.5 focus:outline-none focus:border-violet-500/50 disabled:opacity-40 cursor-pointer hover:border-white/20 transition-colors"
                          >
                            {PLANS.map((p) => (
                              <option key={p} value={p} className="bg-[#111118] capitalize">
                                {p}
                              </option>
                            ))}
                          </select>

                          {/* Add credits */}
                          <button
                            onClick={() => handleAddCredits(user.id)}
                            disabled={!!updating[user.id]}
                            className="text-xs bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/20 text-violet-300 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 whitespace-nowrap"
                          >
                            + Credits
                          </button>

                          {/* Reset */}
                          <button
                            onClick={() => handleReset(user.id)}
                            disabled={!!updating[user.id]}
                            className="text-xs bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/35 hover:text-white/65 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                          >
                            Reset
                          </button>

                          {/* Spinner */}
                          {updating[user.id] && (
                            <svg
                              className="w-3.5 h-3.5 text-violet-400 animate-spin flex-shrink-0"
                              viewBox="0 0 24 24" fill="none"
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                          )}

                          {/* Success checkmark */}
                          {success[user.id] && !updating[user.id] && (
                            <svg
                              className="w-3.5 h-3.5 text-green-400 flex-shrink-0"
                              viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5"
                              strokeLinecap="round" strokeLinejoin="round"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.07] flex-wrap gap-3">
              <p className="text-xs text-white/25">
                {filtered.length} user{filtered.length !== 1 ? "s" : ""} · page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {pageNumbers.map((n, i) =>
                  n === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-xs text-white/20 select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        page === n
                          ? "bg-violet-600 text-white"
                          : "border border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/20"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
