"use client";
import { useState, useRef } from "react";
import { SignInButton } from "@clerk/nextjs";
import Container from "@/components/Container";

export default function Home() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploaded(URL.createObjectURL(file));
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploaded(URL.createObjectURL(file));
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] rounded-full bg-fuchsia-700/8 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-violet-900/10 blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/[0.06]">
        <Container className="flex items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L5 7L8 10L10 5L13 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-tight">
              Drip<span className="text-violet-400">Shoots</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#examples" className="hover:text-white transition-colors">Examples</a>
          </div>
          <div className="flex items-center gap-3">
            <SignInButton mode="redirect">
              <button className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">
                Sign in
              </button>
            </SignInButton>
            <button className="text-sm bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg transition-colors font-medium">
              Start free
            </button>
          </div>
        </Container>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-6">
        <Container className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 text-xs bg-violet-500/10 text-violet-300 px-3 py-1.5 rounded-full mb-8 border border-violet-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Fashion Photography — No Studio Needed
          </div>

          <h1 className="text-[52px] md:text-[68px] font-bold leading-[1.05] tracking-tight max-w-4xl mb-6">
            Turn flat lay photos
            <br />
            into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              pro model shoots
            </span>
          </h1>

          <p className="text-white/40 text-lg max-w-lg mb-10 leading-relaxed">
            Upload a cloth photo. Choose a model, ethnicity &amp; scene.
            Get 6 ready-to-publish images — Instagram, Shopify, Reels.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <button className="bg-violet-600 hover:bg-violet-500 px-7 py-3 rounded-xl text-sm font-medium transition-colors">
              Start for free
            </button>
            <button className="border border-white/10 hover:border-white/25 px-7 py-3 rounded-xl text-sm font-medium transition-colors text-white/70 hover:text-white">
              Watch demo →
            </button>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/25 mb-16">
            {["No credit card required", "2 min per product", "16 model options", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Upload Box */}
      <section id="upload" className="relative z-10 pb-24">
        <Container className="flex justify-center">
          <div
            className={`w-full max-w-2xl rounded-2xl border-2 border-dashed transition-all cursor-pointer
              ${dragging ? "border-violet-500 bg-violet-500/5 scale-[1.01]" : "border-white/10 hover:border-violet-500/40 bg-white/[0.02]"}
            `}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            {uploaded ? (
              <div className="p-6">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploaded} alt="Uploaded cloth" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-sm text-white/80 font-medium">Image uploaded — configure model below</span>
                  </div>
                </div>
                <button
                  className="mt-4 w-full bg-violet-600 hover:bg-violet-500 py-3 rounded-xl text-sm font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Generate shoots →
                </button>
              </div>
            ) : (
              <div className="p-16 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="text-white/60 text-sm mb-1 font-medium">Drop your cloth photo here</p>
                <p className="text-white/25 text-xs mb-6">JPG, PNG, WEBP — up to 20MB</p>
                <button className="bg-violet-600/90 hover:bg-violet-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Browse file
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 pb-28">
        <Container>
          <div className="text-center mb-14">
            <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-3">Process</p>
            <h2 className="text-3xl font-bold">From photo to publish in minutes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="14" height="14" rx="2"/>
                    <path d="M3 9h14M9 3v14"/>
                  </svg>
                ),
                title: "Upload flat lay",
                desc: "Place your cloth on a flat surface, take a photo showing every inch, and upload. Any garment works — shirts, dresses, kurtas, jackets."
              },
              {
                step: "02",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="7" r="3"/>
                    <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                  </svg>
                ),
                title: "Choose model & scene",
                desc: "Pick gender, one of 8 ethnicities, and occasion — party, office, outdoor, casual. Our AI dresses the model and places them in that setting."
              },
              {
                step: "03",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 16l4-4 3 3 4-5 3 3"/>
                    <rect x="2" y="2" width="16" height="16" rx="2"/>
                  </svg>
                ),
                title: "Download & publish",
                desc: "Get 6 pro photos — sized for Instagram posts, Reels, Shopify product pages, and WordPress. One click export to your store."
              },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-violet-500/30 hover:bg-white/[0.05] transition-all group">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/15 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono text-white/15">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-2 text-white/90">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Model selector preview */}
      <section className="relative z-10 pb-28">
        <Container>
          <div className="text-center mb-14">
            <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-3">Customization</p>
            <h2 className="text-3xl font-bold">16 model options — male &amp; female</h2>
            <p className="text-white/40 text-sm mt-3 max-w-md mx-auto">
              Represent every market. Choose ethnicity and gender to match your target audience.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">
            <div className="flex gap-3 mb-6">
              {["Female", "Male"].map((g, i) => (
                <button key={g} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? "bg-violet-600 text-white" : "bg-white/5 text-white/50 hover:text-white"}`}>
                  {g}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {["South Asian", "East Asian", "Arab", "African", "Caucasian", "Latino", "South East Asian", "Mixed"].map((eth, i) => (
                <div key={eth} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center text-lg
                    ${i === 0 ? "border-violet-500 bg-violet-500/20" : "border-white/10 bg-white/5 group-hover:border-violet-500/50"}`}>
                    👤
                  </div>
                  <span className="text-[10px] text-white/40 text-center leading-tight group-hover:text-white/70 transition-colors">{eth}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-t border-white/[0.06] py-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "6", unit: "photos", label: "Per product upload" },
              { value: "< 2", unit: "min", label: "Generation time" },
              { value: "16", unit: "models", label: "Ethnicity options" },
              { value: "4", unit: "formats", label: "Export ready" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-4xl font-bold text-white">{s.value}</span>
                  <span className="text-violet-400 text-sm font-medium">{s.unit}</span>
                </div>
                <p className="text-white/30 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 pb-28 pt-16">
        <Container>
          <div className="text-center mb-14">
            <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Starter",
                price: "$19",
                period: "/mo",
                desc: "Perfect for small brands just starting out",
                features: ["50 products/month", "6 photos per product", "8 model options", "Instagram & Shopify export"],
                cta: "Start free trial",
                highlight: false,
              },
              {
                name: "Growth",
                price: "$49",
                period: "/mo",
                desc: "For growing brands with higher volume",
                features: ["200 products/month", "6 photos per product", "16 model options", "All export formats", "Reels generation", "Priority processing"],
                cta: "Start free trial",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                desc: "For large brands and agencies",
                features: ["Unlimited products", "Custom model training", "API access", "Dedicated support", "White label option"],
                cta: "Contact sales",
                highlight: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 border transition-all relative
                ${plan.highlight
                  ? "border-violet-500/50 bg-violet-500/5"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
                }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Most popular
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-sm text-white/50 mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-white/30 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-white/35 text-xs mt-2">{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3.5 3.5L12 3" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${plan.highlight
                    ? "bg-violet-600 hover:bg-violet-500 text-white"
                    : "border border-white/10 hover:border-white/25 text-white/70 hover:text-white"
                  }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 pb-28">
        <Container>
          <div className="bg-gradient-to-br from-violet-900/40 to-fuchsia-900/20 border border-violet-500/20 rounded-3xl px-10 py-14 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your product photos?</h2>
            <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
              Join fashion brands already using DripShoots to cut photography costs by 90%.
            </p>
            <button className="bg-violet-600 hover:bg-violet-500 px-8 py-3.5 rounded-xl text-sm font-medium transition-colors">
              Start free — no credit card needed
            </button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold">
            Drip<span className="text-violet-400">Shoots</span>
          </span>
          <p className="text-white/25 text-xs">© 2025 DripShoots. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-white/30">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:legal@dripshoots.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </Container>
      </footer>

    </main>
  );
}
