'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react'

const faqs = [
  {
    q: 'What garment types work best?',
    a: 'Shalwar kameez, kurtas, western tops, dresses. Stitched and unstitched both work.',
  },
  {
    q: 'How many images per credit?',
    a: '1 credit = 1 generated image. Reels use 3 credits.',
  },
  {
    q: 'Can I use my own watermark?',
    a: 'Yes. Settings → Brand Watermark. Control opacity and position.',
  },
  {
    q: 'Do you offer custom plans?',
    a: 'Yes — reach out via this form.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 1500)
  }

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
      <section className="relative pt-40 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative z-10 max-w-xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm text-violet-300" style={{ border: '1px solid rgba(124,58,237,0.3)', backgroundColor: 'rgba(124,58,237,0.1)' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#a78bfa"><path d="M5 0l1.2 3.8H10L6.9 6.2l1.2 3.8L5 7.6 1.9 10l1.2-3.8L0 3.8h3.8z"/></svg>
            Get in touch
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-5">
            Let&apos;s talk{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #7c3aed, #d946ef)' }}>
              fashion tech
            </span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(248,248,248,0.5)' }}>
            Questions, feedback, or custom plans — we&apos;re here.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left column */}
          <div>
            {/* Contact cards */}
            <div className="space-y-3 mb-10">
              <a
                href="mailto:hello@dripshoots.com"
                className="flex items-center gap-4 p-4 rounded-2xl transition-colors group"
                style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <Mail className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(248,248,248,0.3)' }}>Email</p>
                  <p className="text-sm font-medium">hello@dripshoots.com</p>
                </div>
              </a>

              <a
                href="https://instagram.com/dripshoots"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#a78bfa" stroke="none"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(248,248,248,0.3)' }}>Instagram</p>
                  <p className="text-sm font-medium">@dripshoots</p>
                </div>
              </a>
            </div>

            {/* FAQ */}
            <div>
              <p className="text-xs uppercase tracking-widest text-violet-400 mb-5">FAQ</p>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="rounded-xl p-4" style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <p className="text-sm font-medium mb-2">{faq.q}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(248,248,248,0.5)' }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — form */}
          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-5 py-20">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-base font-semibold text-green-400">Message sent!</p>
                <p className="text-sm text-center" style={{ color: 'rgba(248,248,248,0.4)' }}>We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#f8f8f8' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#f8f8f8' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#f8f8f8' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                />
                <textarea
                  placeholder="Message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#f8f8f8' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-70 transition-colors"
                >
                  {sending ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
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
