"use client";

import { useState, useRef, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Container from "@/components/Container";

// ─── Types & Constants ────────────────────────────────────────────────────────

type NavItem = "upload" | "projects" | "settings";
type GenderType = "female" | "male";

const ETHNICITIES = [
  "South Asian",
  "East Asian",
  "Arab",
  "African",
  "Caucasian",
  "Latino",
  "South East Asian",
  "Mixed",
] as const;

const OCCASIONS = ["Party", "Office", "Casual", "Outdoor", "Studio"] as const;

const PROGRESS_MESSAGES = [
  "Enhancing image...",
  "Placing on model...",
  "Generating scenes...",
];

const NAV_ITEMS: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  { id: "upload", label: "Upload", icon: <UploadIcon /> },
  { id: "projects", label: "My Projects", icon: <GridIcon /> },
  { id: "settings", label: "Settings", icon: <GearIcon /> },
];

type ExportTab = "instagram" | "shopify" | "wordpress" | "facebook" | "reels";

type PlatformFormat = {
  label: string;
  width: number;
  height: number;
  ratioLabel: string;
  description: string;
  filename: string;
};

const PLATFORM_FORMATS: Record<Exclude<ExportTab, "reels">, PlatformFormat[]> = {
  instagram: [
    { label: "Square Post",    width: 1080, height: 1080, ratioLabel: "1:1",    description: "1080 × 1080 px", filename: "instagram-square.jpg"   },
    { label: "Portrait Post",  width: 1080, height: 1350, ratioLabel: "4:5",    description: "1080 × 1350 px", filename: "instagram-portrait.jpg" },
  ],
  shopify: [
    { label: "Product Square", width: 2048, height: 2048, ratioLabel: "1:1",    description: "2048 × 2048 px", filename: "shopify-square.jpg"    },
    { label: "Landscape",      width: 1200, height: 900,  ratioLabel: "4:3",    description: "1200 × 900 px",  filename: "shopify-landscape.jpg" },
  ],
  wordpress: [
    { label: "Featured Image", width: 1200, height: 628,  ratioLabel: "1.91:1", description: "1200 × 628 px",  filename: "wordpress-featured.jpg" },
    { label: "Thumbnail",      width: 150,  height: 150,  ratioLabel: "1:1",    description: "150 × 150 px",   filename: "wordpress-thumb.jpg"    },
  ],
  facebook: [
    { label: "Post",           width: 1200, height: 630,  ratioLabel: "1.91:1", description: "1200 × 630 px",  filename: "facebook-post.jpg"  },
    { label: "Story",          width: 1080, height: 1920, ratioLabel: "9:16",   description: "1080 × 1920 px", filename: "facebook-story.jpg" },
  ],
};

const EXPORT_TABS: { id: ExportTab; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "shopify",   label: "Shopify"   },
  { id: "wordpress", label: "WordPress" },
  { id: "facebook",  label: "Facebook"  },
  { id: "reels",     label: "Reels"     },
];

// ─── Icon Components ──────────────────────────────────────────────────────────

function UploadIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// ─── Placeholder Section ──────────────────────────────────────────────────────

function renderPlaceholder(label: string, title: string) {
  return (
    <Container className="py-10">
      <div className="mb-8">
        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">
          {label}
        </p>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-16 text-center">
        <p className="text-white/40 text-sm">Coming soon</p>
        <p className="text-white/20 text-xs mt-1">This section is under construction.</p>
      </div>
    </Container>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState<NavItem>("upload");
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [gender, setGender] = useState<GenderType | null>(null);
  const [ethnicity, setEthnicity] = useState<(typeof ETHNICITIES)[number] | null>(null);
  const [occasion, setOccasion] = useState<(typeof OCCASIONS)[number] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [results, setResults] = useState<string[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeExportTab, setActiveExportTab] = useState<ExportTab>("instagram");
  const [reelGenerating, setReelGenerating] = useState(false);
  const [reelProgress, setReelProgress] = useState(0);
  const [reelDone, setReelDone] = useState(false);

  useEffect(() => {
    if (!generating) return;

    const t1 = setTimeout(() => setProgressPct(35), 900);
    const t2 = setTimeout(() => setProgressPct(65), 1900);
    const t3 = setTimeout(() => setProgressPct(88), 2700);

    const msgInterval = setInterval(() => {
      setProgressMsg((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(msgInterval);
    };
  }, [generating]);

  const uploadToServer = async (file: File) => {
    setUploading(true);
    setUploadedUrl(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok) setUploadedUrl(data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploaded(URL.createObjectURL(file));
      uploadToServer(file);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUploaded(URL.createObjectURL(file));
      uploadToServer(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploaded(null);
    setUploadedUrl(null);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleZoneClick = () => fileRef.current?.click();

  const handleGenerate = async () => {
    setGenerating(true);
    setProgressMsg(0);
    setProgressPct(0);
    setResults(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garmentImageUrl: uploadedUrl, gender, ethnicity, occasion }),
      });
      const data = await res.json();
      setProgressPct(100);
      await new Promise((r) => setTimeout(r, 450));
      setResults(data.images);
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setUploaded(null);
    setUploadedUrl(null);
    setUploading(false);
    setGender(null);
    setEthnicity(null);
    setOccasion(null);
    setResults(null);
    setGenerating(false);
    setProgressPct(0);
    setProgressMsg(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const downloadUrl = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadCropped = async (imageUrl: string, w: number, h: number, filename: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = imageUrl;
    });
    const srcA = img.naturalWidth / img.naturalHeight;
    const dstA = w / h;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (srcA > dstA) { sw = img.naturalHeight * dstA; sx = (img.naturalWidth - sw) / 2; }
    else { sh = img.naturalWidth / dstA; sy = (img.naturalHeight - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, "image/jpeg", 0.92);
  };

  const generateReel = async () => {
    if (!results) return;
    setReelGenerating(true);
    setReelProgress(0);
    setReelDone(false);
    try {
      const W = 1080, H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const imgs = await Promise.all(
        results.map((url) => new Promise<HTMLImageElement>((res, rej) => {
          const im = new Image();
          im.crossOrigin = "anonymous";
          im.onload = () => res(im);
          im.onerror = rej;
          im.src = url;
        }))
      );

      const drawCover = (im: HTMLImageElement) => {
        const srcA = im.naturalWidth / im.naturalHeight;
        const dstA = W / H;
        let sx = 0, sy = 0, sw = im.naturalWidth, sh = im.naturalHeight;
        if (srcA > dstA) { sw = im.naturalHeight * dstA; sx = (im.naturalWidth - sw) / 2; }
        else { sh = im.naturalWidth / dstA; sy = (im.naturalHeight - sh) / 2; }
        ctx.drawImage(im, sx, sy, sw, sh, 0, 0, W, H);
      };

      let currentImg = imgs[0];
      let rafId = 0;
      const loop = () => { drawCover(currentImg); rafId = requestAnimationFrame(loop); };

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const stream = canvas.captureStream(30);
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      rafId = requestAnimationFrame(loop);
      recorder.start(100);

      for (let i = 0; i < imgs.length; i++) {
        currentImg = imgs[i];
        setReelProgress(Math.round(((i + 0.5) / imgs.length) * 100));
        await new Promise((r) => setTimeout(r, 1200));
      }

      cancelAnimationFrame(rafId);
      recorder.stop();

      await new Promise<void>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "dripshoots-reel.webm";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
          resolve();
        };
      });

      setReelDone(true);
    } catch (err) {
      console.error("Reel generation failed:", err);
    } finally {
      setReelGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] rounded-full bg-fuchsia-700/8 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-violet-900/10 blur-[80px]" />
      </div>

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[57px] border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-sm">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          </div>
          <UserButton />
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed top-[57px] left-0 bottom-0 w-64 z-40 border-r border-white/[0.06] bg-[#080808] hidden md:flex flex-col">
        <nav className="flex flex-col gap-1 pt-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`
                mx-2 px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium
                w-[calc(100%-1rem)] transition-all text-left
                ${
                  activeNav === item.id
                    ? "bg-violet-600/10 text-violet-400 border-r-2 border-violet-500"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                }
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-[57px] md:ml-64 min-h-screen flex flex-col relative z-10">
        <div className="flex-1 overflow-y-auto">

          {/* ── Upload / Configure ── */}
          {activeNav === "upload" && !generating && !results && (
            <Container className="py-10">
              <div className="mb-8">
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">
                  New Project
                </p>
                <h1 className="text-2xl font-bold">Upload your cloth photo</h1>
                <p className="text-white/40 text-sm mt-1">
                  Start by dropping a flat lay or product image below.
                </p>
              </div>

              {/* Drop Zone */}
              <div
                className={`
                  w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer
                  ${
                    dragging
                      ? "border-violet-500 bg-violet-500/5 scale-[1.01]"
                      : "border-white/10 hover:border-violet-500/40 bg-white/[0.02]"
                  }
                `}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={handleZoneClick}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />

                {uploaded ? (
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploaded} alt="Uploaded cloth" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-medium">
                        {uploading ? "Uploading…" : "Image selected"}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="text-white/60 text-sm mb-1 font-medium">Drop your cloth photo here</p>
                    <p className="text-white/25 text-xs mb-6">JPG, PNG, WEBP — up to 20MB</p>
                    <button
                      className="bg-violet-600/90 hover:bg-violet-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleZoneClick(); }}
                    >
                      Browse file
                    </button>
                  </div>
                )}
              </div>

              {/* Options Panel */}
              {uploaded && (
                <div className="mt-6 space-y-6">
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploaded} alt="Uploaded cloth" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 font-medium">
                        {uploading ? "Uploading…" : "Image ready"}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">
                        {uploading ? "Please wait…" : "Configure model options below"}
                      </p>
                    </div>
                    <button
                      onClick={handleRemove}
                      className="text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Gender */}
                  <div>
                    <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Gender</p>
                    <div className="flex gap-3">
                      {(["female", "male"] as GenderType[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`
                            px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                            ${gender === g ? "bg-violet-600 text-white" : "bg-white/5 text-white/50 hover:text-white"}
                          `}
                        >
                          {g === "female" ? "Female" : "Male"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ethnicity */}
                  <div>
                    <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Ethnicity</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {ETHNICITIES.map((eth) => (
                        <button
                          key={eth}
                          onClick={() => setEthnicity(eth)}
                          className={`
                            flex flex-col items-center gap-2 py-3 px-2 rounded-xl border transition-all cursor-pointer
                            ${ethnicity === eth
                              ? "border-violet-500 bg-violet-500/20"
                              : "border-white/10 bg-white/5 hover:border-violet-500/50"
                            }
                          `}
                        >
                          <div className={`
                            w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg
                            ${ethnicity === eth ? "border-violet-500 bg-violet-500/20" : "border-white/10 bg-white/5"}
                          `}>
                            👤
                          </div>
                          <span className={`text-[10px] text-center leading-tight transition-colors ${ethnicity === eth ? "text-violet-300" : "text-white/40"}`}>
                            {eth}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Occasion */}
                  <div>
                    <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Occasion</p>
                    <div className="flex flex-wrap gap-2">
                      {OCCASIONS.map((occ) => (
                        <button
                          key={occ}
                          onClick={() => setOccasion(occ)}
                          className={`
                            px-4 py-2 rounded-full border text-sm transition-all
                            ${occasion === occ
                              ? "bg-violet-600/20 border-violet-500 text-violet-300"
                              : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                            }
                          `}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={!uploadedUrl || uploading || !gender || !ethnicity || !occasion}
                onClick={handleGenerate}
                className={`
                  w-full py-3.5 rounded-xl text-sm font-medium transition-colors mt-6
                  ${uploadedUrl && !uploading && gender && ethnicity && occasion
                    ? "bg-violet-600 hover:bg-violet-500 text-white"
                    : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                  }
                `}
              >
                Generate Shoots →
              </button>
            </Container>
          )}

          {/* ── Generating / Loading ── */}
          {activeNav === "upload" && generating && (
            <Container className="py-10">
              <div className="max-w-xs mx-auto text-center py-8">
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">
                  Processing
                </p>
                <h1 className="text-2xl font-bold mb-8">Creating your shoots</h1>

                {/* Cloth thumbnail */}
                {uploaded && (
                  <div className="w-28 h-36 rounded-2xl overflow-hidden mx-auto mb-10 border border-white/10 shadow-lg shadow-violet-900/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uploaded} alt="Your cloth" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Progress bar */}
                <div className="bg-white/[0.06] rounded-full h-[3px] mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full transition-all duration-700 ease-in-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Cycling message */}
                <p className="text-white/50 text-sm mb-6 h-5">
                  {PROGRESS_MESSAGES[progressMsg]}
                </p>

                {/* Pulse dots */}
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-violet-500/60 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            </Container>
          )}

          {/* ── Results ── */}
          {activeNav === "upload" && results && !generating && (
            <Container className="py-10">
              {/* Header row */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-4 sm:justify-between">
                <div>
                  <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">
                    Results
                  </p>
                  <h1 className="text-2xl font-bold">Your generated shoots</h1>
                  <p className="text-white/40 text-sm mt-1">6 images ready for download</p>
                </div>
                <button
                  onClick={handleReset}
                  className="self-start text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded-lg transition-colors flex-shrink-0"
                >
                  + Start New Project
                </button>
              </div>

              {/* 2×3 image grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {results.map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 group cursor-pointer"
                    onClick={() => window.open(url, "_blank")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Generated shoot ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg">
                        View full size
                      </span>
                    </div>
                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-sm text-white/60 text-[10px] px-2 py-0.5 rounded-full">
                      {i + 1} / 6
                    </div>
                  </div>
                ))}
              </div>

              {/* Export panel */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
                {/* Tab bar */}
                <div className="px-5 pt-5">
                  <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-4">Export</p>
                  <div className="flex gap-0.5 overflow-x-auto pb-px">
                    {EXPORT_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveExportTab(tab.id); setReelDone(false); }}
                        className={`
                          px-4 py-2.5 text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all rounded-t-lg border-b-2
                          ${activeExportTab === tab.id
                            ? "text-violet-400 border-violet-500 bg-violet-500/10"
                            : "text-white/40 border-transparent hover:text-white/70 hover:bg-white/[0.03]"
                          }
                        `}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="h-px bg-white/[0.07] -mx-5" />
                </div>

                {/* Tab content */}
                <div className="p-5">
                  {activeExportTab !== "reels" ? (
                    <div className="grid grid-cols-2 gap-4">
                      {PLATFORM_FORMATS[activeExportTab].map((fmt, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-xl overflow-hidden">
                          {/* Preview */}
                          <div className="relative h-36 overflow-hidden bg-black/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={results[i] ?? results[0]}
                              alt={fmt.label}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white/50 text-[9px] px-1.5 py-0.5 rounded font-mono tracking-wide">
                              {fmt.ratioLabel}
                            </div>
                          </div>
                          {/* Footer */}
                          <div className="p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs text-white/70 font-medium truncate">{fmt.label}</p>
                              <p className="text-[10px] text-white/30 mt-0.5">{fmt.description}</p>
                            </div>
                            <button
                              onClick={() => downloadCropped(results[i] ?? results[0], fmt.width, fmt.height, fmt.filename)}
                              className="flex-shrink-0 flex items-center gap-1.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              <DownloadIcon />
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* ── Reels tab ── */
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      {/* Phone mockup */}
                      <div className="flex-shrink-0">
                        <div
                          className="relative w-28 rounded-[20px] border-[3px] border-white/20 bg-black overflow-hidden shadow-2xl shadow-black/50"
                          style={{ aspectRatio: "9/16" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={results[0]} alt="Reel preview" className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/70 rounded-full" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                                <polygon points="2,1 11,6 2,11" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="text-center text-[9px] text-white/25 mt-2 tracking-wide">9:16 · 1080×1920</p>
                      </div>

                      {/* Controls */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-sm font-semibold mb-1">Generate Reel</h3>
                        <p className="text-xs text-white/40 mb-5 leading-relaxed">
                          Animates your 6 images into a vertical slideshow at 30 fps.
                          Downloads as <span className="text-white/60 font-medium">WebM video</span>.
                        </p>

                        {reelGenerating ? (
                          <div className="space-y-2">
                            <div className="bg-white/[0.06] rounded-full h-[3px] overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${reelProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-white/40">
                              Processing frame {Math.max(1, Math.ceil(reelProgress / 100 * results.length))} of {results.length}…
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={generateReel}
                            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
                          >
                            {reelDone ? "↓ Download Again" : "▶ Generate Reel"}
                          </button>
                        )}

                        {reelDone && !reelGenerating && (
                          <p className="text-xs text-emerald-400/60 mt-3">✓ Reel downloaded</p>
                        )}

                        <p className="text-[10px] text-white/20 mt-5">WebM (VP9) · 30 fps · ~7 sec</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom reset */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  ← Generate new shoots
                </button>
              </div>
            </Container>
          )}

          {/* My Projects */}
          {activeNav === "projects" && renderPlaceholder("Projects", "My Projects")}

          {/* Settings */}
          {activeNav === "settings" && renderPlaceholder("Settings", "Settings")}

        </div>
      </main>
    </div>
  );
}
