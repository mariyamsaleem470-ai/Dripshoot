'use client'
import Link from 'next/link'
import { ArrowLeft, Upload, Zap, Sparkles, Download } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f8f8f8] overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]" style={{ backgroundColor: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="w-px h-5 bg-white/10" />
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 13L5.5 8L8.5 11L11 6L14 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-bold tracking-tight">
                Drip<span className="text-violet-400">Shoots</span>
              </span>
            </Link>
          </div>
          <Link
            href="/sign-up"
            className="text-sm bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm text-violet-300" style={{ border: '1px solid rgba(124,58,237,0.3)', backgroundColor: 'rgba(124,58,237,0.1)' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#a78bfa"><path d="M5 0l1.2 3.8H10L6.9 6.2l1.2 3.8L5 7.6 1.9 10l1.2-3.8L0 3.8h3.8z"/></svg>
            Watch Demo
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-5">
            See DripShoots{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #7c3aed, #d946ef)' }}>
              in action
            </span>
          </h1>
          <p className="text-base md:text-lg max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(248,248,248,0.5)' }}>
            From flat-lay to model shot in 30 seconds — watch exactly how it works.
          </p>
        </div>
      </section>

      {/* YouTube Shorts Embed */}
      <section className="pb-20 px-6">
        <div className="relative mx-auto" style={{ maxWidth: 380 }}>
          {/* Glow behind */}
          <div className="absolute inset-0 rounded-2xl blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', transform: 'scale(1.2)' }} />
          <div
            className="relative rounded-2xl overflow-hidden border border-white/10"
            style={{ paddingBottom: '177.78%' }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/zQqHrLBq7ME?rel=0&modestbranding=1&controls=1"
              title="DripShoots Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6" style={{ backgroundColor: '#0d0d12' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-black">How it works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                num: '01',
                title: 'Upload Your Product',
                desc: 'Upload a flat-lay or hanger shot. Stitched or unstitched both work.',
                icon: <Upload className="w-5 h-5 text-violet-400" />,
              },
              {
                num: '02',
                title: 'Customize Your Model',
                desc: 'Choose age, gender, ethnicity, style, background, occasion, viewing angle.',
                icon: <Zap className="w-5 h-5 text-violet-400" />,
              },
              {
                num: '03',
                title: 'AI Generates in Seconds',
                desc: 'Fashn.ai places your garment on a photorealistic model in seconds.',
                icon: <Sparkles className="w-5 h-5 text-violet-400" />,
              },
              {
                num: '04',
                title: 'Download & Publish',
                desc: 'Export to Shopify, WooCommerce, or download directly with your brand watermark.',
                icon: <Download className="w-5 h-5 text-violet-400" />,
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-2xl p-6 transition-colors group"
                style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    {step.icon}
                  </div>
                  <span className="font-mono text-sm font-bold" style={{ color: 'rgba(167,139,250,0.5)' }}>{step.num}</span>
                </div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,248,248,0.5)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Ready to try it?</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(248,248,248,0.5)' }}>Start with 15 free images. No credit card needed.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
            >
              Get Started Free →
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(248,248,248,0.7)' }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(248,248,248,0.2)' }}>© 2025 DripShoots. All rights reserved.</p>
          <a
            href="https://pbsdigitals.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors hover:text-violet-400"
            style={{ color: 'rgba(167,139,250,0.4)' }}
          >
            Powered by PBS Digitals
          </a>
        </div>
      </footer>

    </main>
  )
}
