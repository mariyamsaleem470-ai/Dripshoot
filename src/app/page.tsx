"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Play } from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [modelTab, setModelTab] = useState("female");
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const heroWords1 = ["Turn", "flat-lay", "photos"];
  const heroWords2 = ["into"];

  return (
    <main className="min-h-screen bg-[#080808] text-[#f8f8f8] overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          backgroundColor: scrolled ? "rgba(8,8,8,0.9)" : "transparent",
          borderBottomColor: scrolled ? "rgba(255,255,255,0.07)" : "transparent",
        }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid", backdropFilter: scrolled ? "blur(12px)" : "none" }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 13L5.5 8L8.5 11L11 6L14 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight">
              Drip<span className="text-violet-400">Shoots</span>
            </span>
          </a>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/how-it-works" className="text-white/70 hover:text-white transition-colors text-sm font-medium">How It Works</Link>
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="text-white/70 hover:text-white transition-colors text-sm font-medium">Pricing</button>
            <Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Contact</Link>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/sign-in" className="text-sm px-4 py-2 rounded-lg transition-colors hover:text-white" style={{ color: "rgba(248,248,248,0.5)" }}>Sign in</a>
            <a href="/sign-up" className="text-sm bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg font-medium transition-colors">Start free</a>
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2" onClick={() => setShowMenu(!showMenu)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {showMenu ? (
                <><path d="M4 4l12 12M16 4L4 16"/></>
              ) : (
                <><path d="M3 6h14M3 10h14M3 14h14"/></>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden px-6 pb-6 flex flex-col gap-4 text-sm"
              style={{ backgroundColor: "rgba(8,8,8,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Link href="/how-it-works" onClick={() => setShowMenu(false)} className="py-2 text-left text-white/70 hover:text-white transition-colors text-sm font-medium">How It Works</Link>
              <button onClick={() => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); setShowMenu(false); }} className="text-left py-2" style={{ color: "rgba(248,248,248,0.6)" }}>Pricing</button>
              <Link href="/contact" onClick={() => setShowMenu(false)} className="py-2 text-left text-white/70 hover:text-white transition-colors text-sm font-medium">Contact</Link>
              <a href="/sign-in" className="py-2" style={{ color: "rgba(248,248,248,0.6)" }}>Sign in</a>
              <a href="/sign-up" className="bg-violet-600 px-4 py-2.5 rounded-lg font-medium text-center">Start free</a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-25" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #d946ef 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-sm text-violet-300"
            style={{ border: "1px solid rgba(124,58,237,0.3)", backgroundColor: "rgba(124,58,237,0.1)" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#a78bfa"><path d="M5 0l1.2 3.8H10L6.9 6.2l1.2 3.8L5 7.6 1.9 10l1.2-3.8L0 3.8h3.8z"/></svg>
            AI-Powered Fashion Photography — No Studio Needed
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {heroWords1.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
              {heroWords2.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + 0.1 * i, duration: 0.5 }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-block text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #7c3aed, #d946ef)" }}
              >
                pro model shoots
              </motion.span>
            </div>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg max-w-xl mx-auto mb-8 leading-relaxed"
            style={{ color: "rgba(248,248,248,0.5)" }}
          >
            Upload a cloth photo. Choose model, ethnicity &amp; scene.
            Get 6 ready-to-publish images — Instagram, Shopify, Reels.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <motion.a
              href="/sign-up"
              whileHover={{ boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}
              className="bg-violet-600 hover:bg-violet-500 px-8 py-4 rounded-xl font-semibold text-base transition-colors"
            >
              Start for free
            </motion.a>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-xl font-semibold text-base transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(248,248,248,0.7)" }}
            >
              Watch demo →
            </button>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              How It Works
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-sm mb-16"
            style={{ color: "rgba(248,248,248,0.3)" }}
          >
            {["No credit card required", "2 min per product", "15 free images", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(124,58,237,0.2)" }}
          >
            <div className="grid grid-cols-2">
              <div className="p-8 flex flex-col items-center justify-center gap-3" style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)" }}>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(248,248,248,0.4)" }}>Flat-lay</span>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(248,248,248,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <span className="text-xs text-center" style={{ color: "rgba(248,248,248,0.3)" }}>Your garment photo</span>
              </div>
              <div className="p-8 flex flex-col items-center justify-center gap-3" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(217,70,239,0.3))" }}>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(124,58,237,0.3)", color: "#c4b5fd" }}>AI Generated</span>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
                  </svg>
                </div>
                <span className="text-xs text-center" style={{ color: "rgba(196,181,253,0.7)" }}>Professional model shoot</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LOGO BAR ── */}
      <section className="py-12 overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-center text-sm mb-6" style={{ color: "rgba(248,248,248,0.25)" }}>Trusted by fashion brands across Pakistan</p>
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {["GULABO", "BONANZA", "NISHAT", "KHAADI", "ALKARAM", "GUL AHMED", "SANA SAFINAZ", "MARIA B", "GULABO", "BONANZA", "NISHAT", "KHAADI", "ALKARAM", "GUL AHMED", "SANA SAFINAZ", "MARIA B"].map((brand, i) => (
              <span key={i} className="text-lg font-semibold tracking-widest uppercase flex-shrink-0" style={{ color: "rgba(248,248,248,0.2)" }}>{brand}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 md:py-24 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Process</p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black"
            >
              From photo to published — in 3 steps
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Upload your garment",
                body: "Place on flat surface and upload. We detect front, back, and double-sided layouts automatically.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Pick model & scene",
                body: "Choose gender, one of 8 ethnicities, occasion, and background. AI places the model in your garment.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Download & publish",
                body: "Get ready-to-publish images. Export to Instagram, Shopify, WooCommerce, or download ZIP.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                ),
              },
            ].map((card, i) => (
              <motion.div
                key={card.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl p-8 group transition-colors"
                style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              >
                <div className="text-6xl font-black mb-4 transition-colors" style={{ color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>{card.step}</div>
                <div className="mb-4">{card.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(248,248,248,0.5)" }}>{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODEL OPTIONS ── */}
      <section className="py-24 md:py-24 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Customization</p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black"
            >
              16 model options — every market covered
            </motion.h2>
            <p className="mt-4 text-sm" style={{ color: "rgba(248,248,248,0.5)" }}>Represent your target audience. Choose ethnicity and gender to match your customer.</p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-8">
            <div className="flex p-1 rounded-xl relative" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {["female", "male"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModelTab(tab)}
                  className="relative px-6 py-2 rounded-lg text-sm font-medium transition-colors z-10 capitalize"
                  style={{ color: modelTab === tab ? "#f8f8f8" : "rgba(248,248,248,0.4)" }}
                >
                  {modelTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: "#7c3aed" }}
                    />
                  )}
                  <span className="relative z-10 capitalize">{tab === "female" ? "Female" : "Male"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {["South Asian", "East Asian", "Arab", "African", "Caucasian", "Latino", "South East Asian", "Mixed"].map((eth, i) => (
              <div key={eth} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                  style={{
                    border: i === 0 ? "2px solid #7c3aed" : "2px solid rgba(255,255,255,0.1)",
                    background: modelTab === "female"
                      ? `linear-gradient(135deg, rgba(124,58,237,${0.1 + i * 0.03}), rgba(217,70,239,${0.1 + i * 0.02}))`
                      : `linear-gradient(135deg, rgba(59,130,246,${0.1 + i * 0.03}), rgba(99,102,241,${0.1 + i * 0.02}))`,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgba(248,248,248,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                  </svg>
                </div>
                <span className="text-xs text-center leading-tight transition-colors" style={{ color: "rgba(248,248,248,0.5)" }}>{eth}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-16 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#0f0f0f" }}>
            {[
              { value: "8", label: "Ethnicities" },
              { value: "2", label: "Genders" },
              { value: "10+", label: "Backgrounds" },
              { value: "4", label: "Export formats" },
            ].map((s, i) => (
              <div key={s.label} className="py-8 text-center" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div className="text-4xl font-black mb-1">{s.value}</div>
                <div className="text-xs" style={{ color: "rgba(248,248,248,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 md:py-24 py-16" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Features</p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black"
            >
              Everything your shoot workflow needs
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "AI Model Generation",
                body: "Photorealistic models wearing your garments, generated in seconds.",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="6" r="3"/><path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>,
              },
              {
                title: "Brand Watermark",
                body: "Auto-add your logo to every generated image before download.",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="14" height="14" rx="2"/><path d="M2 7h14M7 2v14"/></svg>,
              },
              {
                title: "Multi-angle Shoots",
                body: "Front, back, and side profile — all from one upload.",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="10" height="10" rx="1.5"/><rect x="7" y="2" width="10" height="10" rx="1.5" opacity="0.5"/></svg>,
              },
              {
                title: "Direct Publishing",
                body: "Push product images straight to Shopify or WooCommerce.",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l6 6 6-6M9 3v12"/></svg>,
              },
              {
                title: "Video Reels",
                body: "Generate 10-second AI fashion videos from any product image.",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="14" height="12" rx="2"/><path d="M7 7l4 2-4 2V7z" fill="#a78bfa" stroke="none"/></svg>,
              },
              {
                title: "Custom Prompts",
                body: "Full creative control over poses, scenes, and styling details.",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L10 5l3 3-7 7H3v-3z"/><path d="M8.5 6.5l3 3"/></svg>,
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(124,58,237,0.1)" }}>
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{feat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(248,248,248,0.4)" }}>{feat.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ONE-CLICK PUBLISHING ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">PUBLISHING</p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black"
            >
              One click. Every platform.
            </motion.h2>
            <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: "rgba(248,248,248,0.5)" }}>
              Your AI-generated images, instantly published wherever your customers shop.
            </p>
          </div>

          {/* Publishing Demo */}
          <div className="relative mx-auto" style={{ height: 500, maxWidth: 800 }}>
            {/* Animated SVG lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ pointerEvents: "none" }}
            >
              {[
                { x2: 14, y2: 12 },
                { x2: 88, y2: 12 },
                { x2: 9,  y2: 50 },
                { x2: 91, y2: 50 },
                { x2: 14, y2: 84 },
                { x2: 88, y2: 84 },
              ].map((line, i) => (
                <motion.line
                  key={i}
                  x1="50" y1="50"
                  x2={line.x2} y2={line.y2}
                  stroke="rgba(124,58,237,0.6)"
                  strokeWidth="0.4"
                  strokeDasharray="2 1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0.9, 0.3] }}
                  transition={{ delay: i * 0.15, duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </svg>

            {/* Center product card */}
            <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
                style={{ width: 200, height: 260 }}
              >
                {/* Rotating glow border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute rounded-2xl"
                  style={{ inset: -2, background: "conic-gradient(from 0deg, #7c3aed, #d946ef, transparent, #7c3aed)", zIndex: 0 }}
                />
                <div
                  className="absolute rounded-2xl flex flex-col items-center justify-center gap-3"
                  style={{ inset: 2, background: "linear-gradient(135deg, #3b0764, #701a75)", zIndex: 1 }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
                    </svg>
                  </div>
                  <span className="text-xs text-center px-3" style={{ color: "rgba(255,255,255,0.5)" }}>Generated Image</span>
                </div>
              </motion.div>
            </div>

            {/* Platform pills */}
            {[
              { name: "Instagram",    color: "#E1306C", style: { left: "5%",  top: "8%" } },
              { name: "Shopify",      color: "#96BF48", style: { right: "5%", top: "8%" } },
              { name: "WooCommerce",  color: "#7F54B3", style: { left: "0%",  top: "50%", transform: "translateY(-50%)" } },
              { name: "Facebook",     color: "#1877F2", style: { right: "0%", top: "50%", transform: "translateY(-50%)" } },
              { name: "TikTok",       color: "#69C9D0", style: { left: "5%",  bottom: "8%" } },
              { name: "Download ZIP", color: "#6B7280", style: { right: "5%", bottom: "8%" } },
            ].map((platform, i) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="absolute"
                style={platform.style}
              >
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm whitespace-nowrap">{platform.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { title: "Direct API connection", body: "No copy-paste needed" },
              { title: "Auto-formatted", body: "Right dimensions for each platform" },
              { title: "One-time setup", body: "Connect once, publish forever" },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <h3 className="font-semibold text-sm mb-1">{feat.title}</h3>
                <p className="text-xs" style={{ color: "rgba(248,248,248,0.4)" }}>{feat.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <motion.a
              href="/sign-up"
              whileHover={{ boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Connect your store →
            </motion.a>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 md:py-24 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Pricing</p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black"
            >
              Simple, one-time pricing
            </motion.h2>
            <p className="mt-4 text-sm" style={{ color: "rgba(248,248,248,0.5)" }}>Pay once. Credits valid for 12 months. No subscriptions, no hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Starter",
                price: "$49",
                credits: "150 credits",
                images: "150 images",
                reels: null,
                featured: false,
                badge: null,
                cta: "Get Starter",
                features: ["AI model generation", "Brand watermark", "WooCommerce & Shopify", "Custom prompts", "12-month validity"],
              },
              {
                name: "Growth",
                price: "$99",
                credits: "300 credits",
                images: "250 images",
                reels: "5 video reels",
                featured: true,
                badge: "Most Popular",
                cta: "Get Growth",
                features: ["Everything in Starter", "Video reels", "Priority generation", "Bulk download"],
              },
              {
                name: "Pro",
                price: "$199",
                credits: "750 credits",
                images: "620 images",
                reels: "15 video reels",
                featured: false,
                badge: null,
                cta: "Get Pro",
                features: ["Everything in Growth", "Highest volume", "All resolutions"],
              },
              {
                name: "Reels",
                price: "$49",
                credits: "160 credits",
                images: null,
                reels: "20 video reels",
                featured: false,
                badge: null,
                cta: "Get Reels",
                features: ["AI video generation", "Motion prompts", "720p quality", "Brand overlay"],
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-2xl p-6 relative flex flex-col"
                style={{
                  backgroundColor: plan.featured ? "rgba(124,58,237,0.05)" : "#0f0f0f",
                  border: plan.featured ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full font-medium bg-violet-600 text-white">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-sm mb-1" style={{ color: "rgba(248,248,248,0.5)" }}>{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                  </div>
                  <p className="text-xs" style={{ color: "rgba(248,248,248,0.4)" }}>{plan.credits}</p>
                  {plan.images && <p className="text-xs mt-0.5" style={{ color: "rgba(248,248,248,0.4)" }}>{plan.images}</p>}
                  {plan.reels && <p className="text-xs mt-0.5" style={{ color: "rgba(196,181,253,0.7)" }}>{plan.reels}</p>}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "rgba(248,248,248,0.6)" }}>
                      <svg className="mt-0.5 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l2.5 2.5L10 3" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="/sign-up"
                  className="block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={plan.featured
                    ? { backgroundColor: "#7c3aed", color: "#f8f8f8" }
                    : { border: "1px solid rgba(255,255,255,0.12)", color: "rgba(248,248,248,0.7)" }
                  }
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm mt-8" style={{ color: "rgba(248,248,248,0.3)" }}>
            All plans include 15 free images on signup. No credit card required.
          </p>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 md:py-24 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl p-16 md:p-16 p-8" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, transparent 50%, rgba(217,70,239,0.2) 100%)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black mb-4"
            >
              Ready to cut your photography costs by 90%?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-base mb-8 max-w-md mx-auto"
              style={{ color: "rgba(248,248,248,0.5)" }}
            >
              Join fashion brands already using DripShoots to generate studio-quality images — without the studio.
            </motion.p>
            <motion.a
              href="/sign-up"
              whileHover={{ boxShadow: "0 0 40px rgba(124,58,237,0.5)" }}
              className="inline-block bg-white text-black px-10 py-4 rounded-xl font-bold text-base transition-colors hover:bg-violet-100"
            >
              Start free — no card needed
            </motion.a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 md:py-24 py-16" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Contact</p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black"
            >
              Get in touch
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left */}
            <div>
              <p className="text-base mb-8" style={{ color: "rgba(248,248,248,0.5)" }}>Have questions? We&apos;re here to help.</p>
              <div className="space-y-5">
                {[
                  { icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h12c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1z"/><path d="M2 5l7 5 7-5"/></svg>, label: "Email", value: "support@dripshoots.com" },
                  { icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="7"/><path d="M9 5v4l2.5 2.5"/></svg>, label: "Response", value: "Usually within 24 hours" },
                  { icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2C6.2 2 4 4.4 4 7.3c0 4.2 5 8.7 5 8.7s5-4.5 5-8.7C14 4.4 11.8 2 9 2zm0 3.5a1.8 1.8 0 110 3.6A1.8 1.8 0 019 5.5z"/></svg>, label: "Location", value: "Karachi, Pakistan" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(124,58,237,0.1)" }}>{item.icon}</div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "rgba(248,248,248,0.3)" }}>{item.label}</p>
                      <p className="text-sm" style={{ color: "rgba(248,248,248,0.8)" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div>
              <AnimatePresence mode="wait">
                {formSent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full gap-4 py-12"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "#22c55e" }}>Message sent!</p>
                    <p className="text-xs text-center" style={{ color: "rgba(248,248,248,0.4)" }}>We&apos;ll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                    onSubmit={(e) => { e.preventDefault(); setFormSent(true); }}
                  >
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#f8f8f8" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#f8f8f8" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                    />
                    <textarea
                      placeholder="Your message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-colors"
                      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#f8f8f8" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 transition-colors"
                    >
                      Send message
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L5 7L8 10L10 5L13 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="font-bold">Drip<span className="text-violet-400">Shoots</span></span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(248,248,248,0.3)" }}>AI-Powered Fashion Photography for Pakistani brands</p>
            </div>

            {/* Center */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(248,248,248,0.3)" }}>Product</p>
              <div className="space-y-2.5">
                {[
                  { label: "How it works", id: "how-it-works" },
                  { label: "Pricing", id: "pricing" },
                  { label: "Contact", id: "contact" },
                ].map((link) => (
                  <button key={link.label} onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })} className="block text-sm transition-colors hover:text-white text-left" style={{ color: "rgba(248,248,248,0.4)" }}>
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(248,248,248,0.3)" }}>Account</p>
              <div className="space-y-2.5 mb-5">
                {[{ label: "Sign in", href: "/sign-in" }, { label: "Start free", href: "/sign-up" }].map((link) => (
                  <a key={link.label} href={link.href} className="block text-sm transition-colors hover:text-white" style={{ color: "rgba(248,248,248,0.4)" }}>{link.label}</a>
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(248,248,248,0.3)" }}>Legal</p>
              <div className="space-y-2.5">
                {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }].map((link) => (
                  <a key={link.label} href={link.href} className="block text-sm transition-colors hover:text-white" style={{ color: "rgba(248,248,248,0.4)" }}>{link.label}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-xs" style={{ color: "rgba(248,248,248,0.2)" }}>© 2026 DripShoots. All rights reserved.</p>
              <Link href="/how-it-works" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(248,248,248,0.3)" }}>How it works</Link>
              <Link href="/contact" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(248,248,248,0.3)" }}>Contact</Link>
            </div>
            <a href="https://pbsdigitals.com" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors hover:text-violet-400" style={{ color: "rgba(167,139,250,0.4)" }}>Powered by PBS Digitals</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
