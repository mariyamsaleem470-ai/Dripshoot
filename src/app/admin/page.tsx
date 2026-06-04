"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";

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

const PLANS = ["free", "starter", "growth", "pro", "agency"] as const;

export default function AdminPage() {
  const { signOut } = useClerk();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => {
        if (r.status === 403) { setForbidden(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setUsers(data.users);
      })
      .finally(() => setLoading(false));
  }, []);

  async function patch(body: object) {
    const r = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return r.json();
  }

  async function handlePlanChange(userId: string, plan: string) {
    setUpdating(userId + ":plan");
    await patch({ userId, action: "setPlan", plan });
    const data = await fetch("/api/admin/users").then((r) => r.json());
    setUsers(data.users);
    setUpdating(null);
  }

  async function handleAddCredits(userId: string) {
    const input = prompt("How many credits to add?");
    if (!input) return;
    const amount = parseInt(input, 10);
    if (isNaN(amount) || amount <= 0) return alert("Enter a positive number.");
    setUpdating(userId + ":credits");
    await patch({ userId, action: "addCredits", amount });
    const data = await fetch("/api/admin/users").then((r) => r.json());
    setUsers(data.users);
    setUpdating(null);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#a78bfa" }}>Loading…</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#f87171", fontSize: 24, fontWeight: 700 }}>Access Denied</p>
          <p style={{ color: "#6b7280", marginTop: 8 }}>You are not authorised to view this page.</p>
        </div>
      </div>
    );
  }

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const totalProjects = users.reduce((s, u) => s + u.projectsCount, 0);
  const totalCreditsUsed = users.reduce((s, u) => s + u.creditsUsed, 0);
  const estimatedRevenue = (totalCreditsUsed * 0.075).toFixed(2);

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", background: "#0a0a0f", color: "#f3f4f6", fontFamily: "Inter, sans-serif", padding: "0 0 60px" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 32px", borderBottom: "1px solid #1f1f2e" },
    title: { fontSize: 22, fontWeight: 700, color: "#a78bfa", letterSpacing: "-0.5px" },
    logoutBtn: { background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14 },
    body: { padding: "32px" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 },
    statCard: { background: "#111118", border: "1px solid #1f1f2e", borderRadius: 12, padding: "20px 24px" },
    statLabel: { fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    statValue: { fontSize: 28, fontWeight: 700, color: "#a78bfa" },
    searchInput: { background: "#111118", border: "1px solid #1f1f2e", borderRadius: 8, color: "#f3f4f6", padding: "10px 14px", fontSize: 14, width: 280, outline: "none", marginBottom: 20 },
    table: { width: "100%", borderCollapse: "collapse" as const, background: "#111118", borderRadius: 12, overflow: "hidden" },
    th: { padding: "14px 16px", textAlign: "left" as const, fontSize: 12, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: 1, borderBottom: "1px solid #1f1f2e" },
    td: { padding: "14px 16px", fontSize: 14, color: "#d1d5db", borderBottom: "1px solid #1a1a2a" },
    planSelect: { background: "#1a1a2a", border: "1px solid #374151", color: "#a78bfa", borderRadius: 6, padding: "6px 10px", fontSize: 13, cursor: "pointer" },
    addBtn: { background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", color: "#fff", borderRadius: 6, padding: "6px 12px", fontSize: 13, cursor: "pointer", marginLeft: 8 },
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <span style={s.title}>DripShoots Admin</span>
        <button style={s.logoutBtn} onClick={() => signOut({ redirectUrl: "/" })}>Log out</button>
      </header>

      <div style={s.body}>
        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { label: "Total Users", value: totalUsers },
            { label: "Total Projects", value: totalProjects },
            { label: "Total Credits Used", value: totalCreditsUsed },
            { label: "Est. Revenue", value: `$${estimatedRevenue}` },
          ].map(({ label, value }) => (
            <div key={label} style={s.statCard}>
              <div style={s.statLabel}>{label}</div>
              <div style={s.statValue}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          style={s.searchInput}
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div style={{ overflowX: "auto" as const }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Email", "Plan", "Credits Left", "Credits Used", "Projects", "Joined", "Actions"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}>
                    <span style={{ background: "#1a1a2a", color: "#a78bfa", borderRadius: 4, padding: "2px 8px", fontSize: 12, textTransform: "capitalize" as const }}>
                      {u.plan}
                    </span>
                  </td>
                  <td style={s.td}>{u.credits} / {u.creditsLimit}</td>
                  <td style={s.td}>{u.creditsUsed}</td>
                  <td style={s.td}>{u.projectsCount}</td>
                  <td style={s.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={s.td}>
                    <select
                      style={s.planSelect}
                      value={u.plan}
                      disabled={updating === u.id + ":plan"}
                      onChange={(e) => handlePlanChange(u.id, e.target.value)}
                    >
                      {PLANS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <button
                      style={{ ...s.addBtn, opacity: updating === u.id + ":credits" ? 0.5 : 1 }}
                      disabled={updating === u.id + ":credits"}
                      onClick={() => handleAddCredits(u.id)}
                    >
                      {updating === u.id + ":credits" ? "…" : "+ Credits"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...s.td, textAlign: "center", color: "#4b5563" }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
