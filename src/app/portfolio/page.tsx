'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

type ProjectUpload = { id: string; imageUrl: string }
type ProjectImage = { id: string; imageUrl: string }
type ProjectReel = { id: string; videoUrl: string }
type Project = {
  id: string
  name: string
  status: string
  category: string
  prompt?: string | null
  createdAt: string
  uploads: ProjectUpload[]
  images: ProjectImage[]
  reels: ProjectReel[]
}

type FilterId = 'all' | 'garments' | 'jewellery' | 'crockery'

const FILTERS: { id: FilterId; label: string; emoji: string }[] = [
  { id: 'all',      label: 'All',       emoji: '✨' },
  { id: 'garments', label: 'Garments',  emoji: '👗' },
  { id: 'jewellery',label: 'Jewellery', emoji: '💍' },
  { id: 'crockery', label: 'Crockery',  emoji: '🍽️' },
]

const CATEGORY_BADGES: Record<string, { emoji: string; label: string; color: string }> = {
  garments:  { emoji: '👗', label: 'Garments',  color: 'bg-violet-600/20 text-violet-300 border-violet-500/30' },
  jewellery: { emoji: '💍', label: 'Jewellery', color: 'bg-amber-600/20 text-amber-300 border-amber-500/30' },
  crockery:  { emoji: '🍽️', label: 'Crockery',  color: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30' },
}

const getImageUrl = (url: string) =>
  url.startsWith('http') ? url : `https://dripshoots.com${url}`

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden animate-pulse">
      <div className="h-4 bg-white/10 rounded m-4 w-1/2" />
      <div className="aspect-[4/3] bg-white/5" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)

  const badge = CATEGORY_BADGES[project.category] ?? {
    emoji: '📦', label: project.category, color: 'bg-white/10 text-white/50 border-white/20',
  }

  const visibleImages = expanded ? project.images : project.images.slice(0, 4)
  const extraCount = project.images.length - 4

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 pb-0 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-tight">{project.name}</h3>
        <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${badge.color}`}>
          {badge.emoji} {badge.label}
        </span>
      </div>

      {/* Prompt */}
      {project.prompt && (
        <p className="mx-4 mt-2 text-[11px] italic text-white/35 leading-relaxed line-clamp-2">
          &ldquo;{project.prompt}&rdquo;
        </p>
      )}

      {/* Before thumbnail + generated images grid */}
      <div className="p-4 space-y-3">
        {/* Original upload */}
        {project.uploads[0] && (
          <div>
            <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Original</span>
            <div className="mt-1 w-14 h-20 rounded-xl overflow-hidden bg-white/[0.05]">
              <img
                src={getImageUrl(project.uploads[0].imageUrl)}
                alt="Original"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Generated images */}
        {project.images.length > 0 && (
          <div>
            <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Generated</span>
            <div className="mt-1 grid grid-cols-4 gap-1.5">
              {visibleImages.map((img, i) => (
                <div key={img.id} className="aspect-[3/4] rounded-lg overflow-hidden bg-white/[0.05]">
                  <img
                    src={getImageUrl(img.imageUrl)}
                    alt={`Generated ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {!expanded && extraCount > 0 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="aspect-[3/4] rounded-lg bg-white/[0.05] flex items-center justify-center text-white/40 text-xs hover:bg-white/10 transition-colors"
                >
                  +{extraCount}
                </button>
              )}
            </div>
            {expanded && extraCount > 0 && (
              <button
                onClick={() => setExpanded(false)}
                className="mt-2 text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
              >
                Show less
              </button>
            )}
          </div>
        )}

        {/* Reels */}
        {project.reels.length > 0 && (
          <div>
            <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Reels</span>
            <div className="mt-1 space-y-2">
              {project.reels.map((reel) => (
                <video
                  key={reel.id}
                  src={reel.videoUrl}
                  controls
                  muted
                  loop
                  playsInline
                  className="w-full rounded-xl bg-black"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterId>('all')

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => setProjects(data.projects ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    filter === 'all'
      ? projects
      : projects.filter(p => p.category === filter)

  const countFor = (id: FilterId) =>
    id === 'all' ? projects.length : projects.filter(p => p.category === id).length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/" className="text-xl font-bold tracking-tight">
            Drip<span className="text-violet-400">Shoots</span>
          </Link>
          <Link href="/sign-up" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
            Try Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            Real Results
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            See the
            <span className="block text-violet-400">transformation</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            Every image below was generated by DripShoots in under 30 seconds.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span>{f.emoji}</span>
              {f.label}
              {!loading && (
                <span className={`text-xs ${filter === f.id ? 'text-white/70' : 'text-white/30'}`}>
                  {countFor(f.id)}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/30 text-lg">No projects yet.</p>
              <p className="text-white/20 text-sm mt-2">Check back soon — more transformations are on the way.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Want results like these?
          </h2>
          <p className="text-white/40 text-lg mb-8">
            Upload your first product and see the transformation yourself — free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors text-base">
              Get Started Free
            </Link>
            <Link href="/how-it-works" className="px-8 py-4 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium rounded-xl transition-colors text-base">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} DripShoots. All rights reserved.
          </p>
          <p className="text-white/20 text-sm">
            Powered by{' '}
            <a href="https://pbsdigitals.com" target="_blank" rel="noopener noreferrer" className="text-violet-400/60 hover:text-violet-400 transition-colors">
              PBS Digitals
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
