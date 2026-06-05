"use client";

import { useState, useRef, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Container from "@/components/Container";

// ─── Types & Constants ────────────────────────────────────────────────────────

type NavItem = "upload" | "projects" | "settings";
type GenderType = "female" | "male";
type ProductCategory = "clothing" | "shoes" | "jewelry" | "bags" | "hats" | "fabric-male" | "fabric-female";
type AgeGroup = "adult" | "teen" | "kids-6-12" | "kids-2-5" | "toddler";
type Side = "front" | "back" | "side-profile" | "side-view" | "top-down" | "detail-close-up" | "interior-shot";
type Background = "Studio White" | "Outdoor Park" | "City Street" | "Modern Office" | "Minimal Grey" | "Luxury Interior" | "Beach" | "Rooftop";
type Quality = "standard" | "high" | "ultra";
type ReelFormat = "9:16" | "1:1" | "16:9";
type ReelTemplate = "ken-burns" | "zoom-out" | "pan-left" | "pan-right" | "fade-slideshow" | "cinematic" | "drift-up" | "pulse";
type MusicTrack = "track-1" | "track-2" | "custom";
type ReelMode = "canvas" | "ai-video";
type SharePlatform = "Instagram" | "Facebook" | "TikTok" | "Twitter";

type ProjectImage = { id: string; imageUrl: string };
type ProjectUpload = { id: string; imageUrl: string };
type Project = {
  id: string;
  name: string;
  status: string;
  gender: string;
  ethnicity: string;
  occasion: string;
  createdAt: string;
  uploads: ProjectUpload[];
  images: ProjectImage[];
};

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

const OCCASIONS = [
  "Party", "Office", "Casual", "Outdoor", "Studio",
  "Editorial", "Sport", "Festival", "Wedding", "Street Style",
] as const;

const PROGRESS_MESSAGES = [
  "Enhancing image...",
  "Placing on model...",
  "Generating scenes...",
];

const CATEGORIES: { id: ProductCategory; label: string; emoji: string }[] = [
  { id: "clothing",      label: "Clothing & Apparel",    emoji: "👕" },
  { id: "shoes",         label: "Shoes & Footwear",      emoji: "👟" },
  { id: "jewelry",       label: "Jewelry & Accessories", emoji: "💍" },
  { id: "bags",          label: "Bags & Handbags",       emoji: "👜" },
  { id: "hats",          label: "Hats & Headwear",       emoji: "🧢" },
  { id: "fabric-male",   label: "Fabric Male",           emoji: "🎽" },
  { id: "fabric-female", label: "Fabric Female",         emoji: "👗" },
];

const FABRIC_STYLES: Record<"fabric-male" | "fabric-female", { id: string; label: string; emoji: string }[]> = {
  "fabric-male": [
    { id: "Shalwar Kameez",      label: "Shalwar Kameez",      emoji: "🧣" },
    { id: "Kameez Pajama",       label: "Kameez Pajama",       emoji: "👘" },
    { id: "Italian Suit",        label: "Italian Suit",        emoji: "🤵" },
    { id: "Blazer",              label: "Blazer",              emoji: "🧥" },
    { id: "Sherwani",            label: "Sherwani",            emoji: "👔" },
    { id: "Simple Shirt",        label: "Simple Shirt",        emoji: "👕" },
    { id: "Waistcoat + Shalwar", label: "Waistcoat + Shalwar", emoji: "🎽" },
    { id: "Kurta",               label: "Kurta",               emoji: "🥻" },
  ],
  "fabric-female": [
    { id: "Shalwar Kameez", label: "Shalwar Kameez", emoji: "👗" },
    { id: "Gharara",        label: "Gharara",         emoji: "🎀" },
    { id: "Lehenga",        label: "Lehenga",         emoji: "💃" },
    { id: "Anarkali",       label: "Anarkali",        emoji: "🌸" },
    { id: "Maxi Dress",     label: "Maxi Dress",      emoji: "👗" },
    { id: "Co-ord Set",     label: "Co-ord Set",      emoji: "🎽" },
    { id: "Saree",          label: "Saree",           emoji: "🥻" },
    { id: "Kurti",          label: "Kurti",           emoji: "🌺" },
  ],
};

const AGE_GROUPS: { id: AgeGroup; label: string; range: string; desc: string }[] = [
  { id: "adult",     label: "Adult",   range: "18+",   desc: "Full range of styles and occasions" },
  { id: "teen",      label: "Teen",    range: "13–17", desc: "Youth fashion, street & casual" },
  { id: "kids-6-12", label: "Kids",    range: "6–12",  desc: "School, casual, party looks" },
  { id: "kids-2-5",  label: "Kids",    range: "2–5",   desc: "Cute, playful, comfortable styles" },
  { id: "toddler",   label: "Toddler", range: "1–2",   desc: "Soft, simple, adorable outfits" },
];

const BACKGROUNDS: { id: Background; swatch: string }[] = [
  { id: "Studio White",    swatch: "bg-white" },
  { id: "Minimal Grey",    swatch: "bg-gray-400" },
  { id: "Outdoor Park",    swatch: "bg-green-500" },
  { id: "City Street",     swatch: "bg-slate-500" },
  { id: "Modern Office",   swatch: "bg-blue-400" },
  { id: "Luxury Interior", swatch: "bg-yellow-500" },
  { id: "Beach",           swatch: "bg-cyan-400" },
  { id: "Rooftop",         swatch: "bg-purple-900" },
];

const SIDES_BY_CATEGORY: Record<ProductCategory, { id: Side; label: string }[]> = {
  clothing: [
    { id: "front",         label: "Front" },
    { id: "back",          label: "Back" },
    { id: "side-profile",  label: "Side Profile" },
  ],
  shoes: [
    { id: "front",     label: "Front" },
    { id: "side-view", label: "Side View" },
    { id: "top-down",  label: "Top Down" },
  ],
  jewelry: [
    { id: "front",           label: "Front" },
    { id: "detail-close-up", label: "Detail Close-up" },
  ],
  bags: [
    { id: "front",         label: "Front" },
    { id: "side-view",     label: "Side View" },
    { id: "interior-shot", label: "Interior Shot" },
  ],
  hats: [
    { id: "front",     label: "Front" },
    { id: "side-view", label: "Side View" },
  ],
  "fabric-male": [
    { id: "front",        label: "Front" },
    { id: "back",         label: "Back" },
    { id: "side-profile", label: "Side Profile" },
  ],
  "fabric-female": [
    { id: "front",        label: "Front" },
    { id: "back",         label: "Back" },
    { id: "side-profile", label: "Side Profile" },
  ],
};

const QUALITY_CREDITS: Record<Quality, number> = { standard: 1, high: 3, ultra: 5 };

const STEP_TITLES: Record<number, string> = {
  1:  "Upload your garment",
  2:  "Product category",
  3:  "Select style",
  4:  "Age group",
  5:  "Gender & Ethnicity",
  6:  "Background",
  7:  "Occasion",
  8:  "Sides",
  9:  "Images per side",
  10: "Quality",
  11: "Add video reel?",
};

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

const PROJECT_EXPORT_TABS: { id: Exclude<ExportTab, "reels">; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "shopify",   label: "Shopify"   },
  { id: "wordpress", label: "WordPress" },
  { id: "facebook",  label: "Facebook"  },
];

const REEL_FORMATS: { id: ReelFormat; label: string; subtitle: string; width: number; height: number; filename: string }[] = [
  { id: "9:16",  label: "9:16 Vertical",  subtitle: "Reels / TikTok", width: 1080, height: 1920, filename: "dripshoots-reel-vertical.webm"  },
  { id: "1:1",   label: "1:1 Square",     subtitle: "Feed",            width: 1080, height: 1080, filename: "dripshoots-reel-square.webm"   },
  { id: "16:9",  label: "16:9 Landscape", subtitle: "YouTube",         width: 1920, height: 1080, filename: "dripshoots-reel-landscape.webm"},
];

const REEL_TEMPLATES: { id: ReelTemplate; name: string; desc: string; icon: string }[] = [
  { id: "ken-burns",      name: "Ken Burns",     desc: "Smooth zoom in + diagonal pan",     icon: "🔍" },
  { id: "zoom-out",       name: "Zoom Out",       desc: "Pulls back with subtle rotation",   icon: "🔭" },
  { id: "pan-left",       name: "Pan Left",       desc: "Eased pan with gentle zoom",        icon: "⬅"  },
  { id: "pan-right",      name: "Pan Right",      desc: "Eased pan with gentle zoom",        icon: "➡"  },
  { id: "fade-slideshow", name: "Fade Slideshow", desc: "Multiple images with fade",         icon: "🎞"  },
  { id: "cinematic",      name: "Cinematic",      desc: "Letterbox + vignette + Ken Burns",  icon: "🎬" },
  { id: "drift-up",       name: "Drift Up",       desc: "Slow upward float + gentle zoom",   icon: "⬆"  },
  { id: "pulse",          name: "Pulse",          desc: "Rhythmic scale pulse, 2 beats",     icon: "💓" },
];

const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const MUSIC_TRACKS: { id: Exclude<MusicTrack, "custom">; label: string; src: string }[] = [
  { id: "track-1", label: "Fashion Cinematic", src: "/music/track-1.mp3" },
  { id: "track-2", label: "Editorial Luxury",  src: "/music/track-2.mp3" },
];

const AI_VIDEO_CREDITS: Record<"480p" | "720p" | "1080p", number> = { "480p": 1, "720p": 3, "1080p": 6 };

const SHARE_PLATFORMS: { id: SharePlatform; name: string; icon: string; hint: string }[] = [
  { id: "Instagram", name: "Instagram", icon: "📸", hint: "Caption copied + open app" },
  { id: "Facebook",  name: "Facebook",  icon: "👥", hint: "Share via Facebook"        },
  { id: "TikTok",    name: "TikTok",    icon: "🎵", hint: "Caption copied + open app" },
  { id: "Twitter",   name: "Twitter",   icon: "🐦", hint: "Share via Twitter / X"     },
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

function getImageUrl(url: string): string {
  if (url.startsWith("/generated/") || url.startsWith("/uploads/")) {
    return `http://153.92.209.231${url}`;
  }
  return url;
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
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicFileRef = useRef<HTMLInputElement>(null);
  const [activeExportTab, setActiveExportTab] = useState<ExportTab>("instagram");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsPage, setProjectsPage] = useState(1);
  const [showCropTool, setShowCropTool] = useState(false);
  const [cropSide, setCropSide] = useState<"front" | "back" | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [downloadingProjectId, setDownloadingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState<string | null>(null);
  const [shareProject, setShareProject] = useState<Project | null>(null);
  const [shareSelectedImages, setShareSelectedImages] = useState<string[]>([]);
  const [sharePlatform, setSharePlatform] = useState<SharePlatform>("Instagram");
  const [shareCaption, setShareCaption] = useState("");
  const [shareCaptionLoading, setShareCaptionLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [projectExportTab, setProjectExportTab] = useState<Exclude<ExportTab, "reels">>("instagram");
  const [wizardStep, setWizardStep] = useState(1);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [fabricStyle, setFabricStyle] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [background, setBackground] = useState<Background | null>(null);
  const [sides, setSides] = useState<Side[]>(["front"]);
  const [numImages, setNumImages] = useState(1);
  const [quality, setQuality] = useState<Quality>("high");
  const [addVideo, setAddVideo] = useState(false);
  const [selectedVideoImage, setSelectedVideoImage] = useState<string | null>(null);
  const [reelFormat, setReelFormat] = useState<ReelFormat>("9:16");
  const [reelTemplate, setReelTemplate] = useState<ReelTemplate>("ken-burns");
  const [reelDuration, setReelDuration] = useState<5 | 10 | 15>(10);
  const [reelBrandName, setReelBrandName] = useState("");
  const [reelRendering, setReelRendering] = useState(false);
  const [reelRenderProgress, setReelRenderProgress] = useState(0);
  const [reelOutputUrl, setReelOutputUrl] = useState<string | null>(null);
  const [selectedMusicTrack, setSelectedMusicTrack] = useState<MusicTrack | null>(null);
  const [customMusicFile, setCustomMusicFile] = useState<File | null>(null);
  const [previewingTrack, setPreviewingTrack] = useState<string | null>(null);
  const [reelMode, setReelMode] = useState<ReelMode>("canvas");
  const [aiVideoImageUrl, setAiVideoImageUrl] = useState<string | null>(null);
  const [aiVideoDuration, setAiVideoDuration] = useState<5 | 10>(5);
  const [aiVideoResolution, setAiVideoResolution] = useState<"480p" | "720p" | "1080p">("720p");
  const [aiVideoGenerating, setAiVideoGenerating] = useState(false);
  const [aiVideoProgress, setAiVideoProgress] = useState(0);
  const [aiVideoOutputUrl, setAiVideoOutputUrl] = useState<string | null>(null);
  const [aiVideoError, setAiVideoError] = useState<string | null>(null);
  const [aiVideoMotionPrompt, setAiVideoMotionPrompt] = useState("");

  // ── WooCommerce / Integrations state ──────────────────────────────────────
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const [wcConnected, setWcConnected]             = useState(false);
  const [wcForm, setWcForm]                       = useState({ siteUrl: "", consumerKey: "", consumerSecret: "", appPassword: "" });
  const [wcConnecting, setWcConnecting]           = useState(false);
  const [wcError, setWcError]                     = useState("");
  const [wcShowSecret, setWcShowSecret]           = useState(false);
  const [wcShowAppPw, setWcShowAppPw]             = useState(false);

  // ── WooCommerce Share Modal state ─────────────────────────────────────────
  const [shareTab, setShareTab]                           = useState<"social" | "woocommerce">("social");
  const [wcShareConnected, setWcShareConnected]           = useState<boolean | null>(null);
  const [wcFeaturedImage, setWcFeaturedImage]             = useState<string>("");
  const [wcGalleryImages, setWcGalleryImages]             = useState<string[]>([]);
  const [wcTitle, setWcTitle]                             = useState("");
  const [wcShortDesc, setWcShortDesc]                     = useState("");
  const [wcDescription, setWcDescription]                 = useState("");
  const [wcTags, setWcTags]                               = useState("");
  const [wcPrice, setWcPrice]                             = useState("");
  const [wcSalePrice, setWcSalePrice]                     = useState("");
  const [wcSku, setWcSku]                                 = useState("");
  const [wcStock, setWcStock]                             = useState(100);
  const [wcCategoryId, setWcCategoryId]                   = useState<number | null>(null);
  const [wcStatus, setWcStatus]                           = useState<"draft" | "publish">("draft");
  const [wcAttributes, setWcAttributes]                   = useState<{name: string; values: string[]}[]>([]);
  const [wcVariations, setWcVariations]                   = useState<{attributes: {name: string; option: string}[]; stockQuantity: string}[]>([]);
  const [wcCategories, setWcCategories]                   = useState<{id: number; name: string}[]>([]);
  const [wcPublishing, setWcPublishing]                   = useState(false);
  const [wcPublishStep, setWcPublishStep]                 = useState("");
  const [wcProductUrl, setWcProductUrl]                   = useState("");
  const [wcEnableVariations, setWcEnableVariations]       = useState(false);
  const [wcGeneratingContent, setWcGeneratingContent]     = useState(false);
  const [wcPublishError, setWcPublishError]               = useState("");
  const [wcAttrFormVisible, setWcAttrFormVisible]         = useState(false);
  const [wcAttrName, setWcAttrName]                       = useState("Size");
  const [wcAttrCustomName, setWcAttrCustomName]           = useState("");
  const [wcAttrValues, setWcAttrValues]                   = useState<string[]>([]);
  const [wcAttrValueInput, setWcAttrValueInput]           = useState("");
  const [creditInfo, setCreditInfo] = useState<{ plan: string; credits: number; creditsUsed: number; creditsLimit: number; percentage: number } | null>(null);

  useEffect(() => {
    fetch("/api/credits").then((r) => r.json()).then(setCreditInfo);
  }, []);

  useEffect(() => {
    if (activeNav !== "projects") return;
    setProjectsLoading(true);
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => { setProjects(d.projects ?? []); setProjectsPage(1); })
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  }, [activeNav]);

  // Load WooCommerce connection status when Settings tab is opened
  useEffect(() => {
    if (activeNav !== "settings") return;
    fetch("/api/settings/woocommerce")
      .then((r) => r.json())
      .then((data) => {
        if (data.connected) {
          setWcConnected(true);
          setWcForm((f) => ({ ...f, siteUrl: data.wpSiteUrl }));
        }
      })
      .catch(() => {});
  }, [activeNav]);

  // Check WC connection when WooCommerce share tab is first opened
  useEffect(() => {
    if (shareTab !== "woocommerce" || !shareProject || wcShareConnected !== null) return;
    fetch("/api/settings/woocommerce")
      .then((r) => r.json())
      .then((data) => {
        setWcShareConnected(!!data.connected);
        if (data.connected) {
          fetch("/api/woocommerce/categories")
            .then((r) => r.json())
            .then((d) => setWcCategories(d.categories ?? []))
            .catch(() => {});
        }
      })
      .catch(() => setWcShareConnected(false));
  }, [shareTab, shareProject, wcShareConnected]);

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

  const checkIfDoubleSided = (file: File) => {
    const img = new Image();
    img.onload = () => {
      if (img.width > img.height * 1.5) {
        setShowCropTool(true);
      }
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleCropSide = async (side: "front" | "back") => {
    setCropSide(side);
    setShowCropTool(false);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const halfWidth = Math.floor(img.width / 2);
      canvas.width = halfWidth;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;

      if (side === "front") {
        ctx.drawImage(img, 0, 0, halfWidth, img.height, 0, 0, halfWidth, img.height);
      } else {
        ctx.drawImage(img, halfWidth, 0, halfWidth, img.height, 0, 0, halfWidth, img.height);
      }

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], "cropped-garment.jpg", { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("file", croppedFile);
        setUploading(true);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        setUploadedUrl(data.url);
        setUploading(false);
      }, "image/jpeg", 0.95);
    };
    img.src = uploadedUrl!;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploaded(URL.createObjectURL(file));
      setShowCropTool(false);
      setCropSide(null);
      uploadToServer(file).then(() => checkIfDoubleSided(file));
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUploaded(URL.createObjectURL(file));
      setShowCropTool(false);
      setCropSide(null);
      uploadToServer(file).then(() => checkIfDoubleSided(file));
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
        body: JSON.stringify({ garmentImageUrl: uploadedUrl, gender, ethnicity, occasion, ageGroup, category, background, sides, numImages, quality, fabricStyle }),
      });
      const data = await res.json();
      setProgressPct(100);
      await new Promise((r) => setTimeout(r, 450));
      setResults(data.images);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadAllImages = async (project: Project) => {
    if (!project.images.length) return;
    setDownloadingProjectId(project.id);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      await Promise.all(
        project.images.map(async (img, i) => {
          const res = await fetch(getImageUrl(img.imageUrl));
          const blob = await res.blob();
          zip.file(`dripshoots-${i + 1}.jpg`, blob);
        })
      );
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name.replace(/[^a-z0-9]/gi, "-")}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingProjectId(null);
    }
  };

  const handleEditAndRegenerate = (project: Project) => {
    const garmentUrl = project.uploads[0]?.imageUrl;
    if (!garmentUrl) return;
    setUploadedUrl(garmentUrl);
    setUploaded(garmentUrl);
    setGender(project.gender as GenderType);
    setEthnicity(project.ethnicity as (typeof ETHNICITIES)[number]);
    setOccasion(project.occasion as (typeof OCCASIONS)[number]);
    setResults(null);
    setGenerating(false);
    setProgressPct(0);
    setProgressMsg(0);
    setCategory(null);
    setFabricStyle(null);
    setAgeGroup(null);
    setBackground(null);
    setSides(["front"]);
    setNumImages(1);
    setQuality("high");
    setAddVideo(false);
    setEditingProjectName(project.name);
    setWizardStep(2);
    setActiveNav("upload");
  };


  const openShareModal = (project: Project) => {
    setShareProject(project);
    setShareSelectedImages(project.images.slice(0, 1).map((img) => img.imageUrl));
    setSharePlatform("Instagram");
    setShareCaption("");
    setShareCaptionLoading(false);
    setShareCopied(false);
    // Reset WooCommerce share state
    setShareTab("social");
    setWcShareConnected(null);
    setWcFeaturedImage("");
    setWcGalleryImages([]);
    setWcTitle("");
    setWcShortDesc("");
    setWcDescription("");
    setWcTags("");
    setWcPrice("");
    setWcSalePrice("");
    setWcSku("");
    setWcStock(100);
    setWcCategoryId(null);
    setWcStatus("draft");
    setWcAttributes([]);
    setWcVariations([]);
    setWcCategories([]);
    setWcPublishing(false);
    setWcPublishStep("");
    setWcProductUrl("");
    setWcEnableVariations(false);
    setWcGeneratingContent(false);
    setWcPublishError("");
    setWcAttrFormVisible(false);
    setWcAttrName("Size");
    setWcAttrCustomName("");
    setWcAttrValues([]);
    setWcAttrValueInput("");
  };

  const toggleShareImage = (url: string) => {
    setShareSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleGenerateCaption = async () => {
    if (!shareProject) return;
    setShareCaptionLoading(true);
    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "fashion",
          occasion: shareProject.occasion,
          gender: shareProject.gender,
          ethnicity: shareProject.ethnicity,
          background: "studio",
          platform: sharePlatform,
        }),
      });
      const data = await res.json();
      if (data.caption) setShareCaption(data.caption);
    } catch {
      // silently skip
    } finally {
      setShareCaptionLoading(false);
    }
  };

  const handleCopyCaption = () => {
    if (!shareCaption) return;
    navigator.clipboard.writeText(shareCaption).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleShareTo = (platform: SharePlatform) => {
    const text = encodeURIComponent(shareCaption || shareProject?.name || "");
    if (platform === "Facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?quote=${text}`, "_blank");
    } else if (platform === "Twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    } else {
      if (shareCaption) navigator.clipboard.writeText(shareCaption).catch(() => {});
      window.open(platform === "Instagram" ? "https://www.instagram.com" : "https://www.tiktok.com", "_blank");
    }
  };

  const handleWcGenerateContent = async () => {
    if (!shareProject) return;
    setWcGeneratingContent(true);
    try {
      const category = shareProject.name.split(" ")[0] || "fashion";
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          occasion: shareProject.occasion,
          gender: shareProject.gender,
          ethnicity: shareProject.ethnicity,
          platform: "WooCommerce product",
        }),
      });
      const data = await res.json();
      if (data.caption) {
        const lines = data.caption.split("\n").map((l: string) => l.trim()).filter(Boolean);
        const hashLines = lines.filter((l: string) => /^#/.test(l) || /^(#\w+\s*)+$/.test(l));
        const nonHashLines = lines.filter((l: string) => !/^#/.test(l) && !/^(#\w+\s*)+$/.test(l));
        const hashtags = hashLines.join(" ").match(/#\w+/g) ?? [];
        const tagsStr = hashtags.map((t: string) => t.replace("#", "")).join(", ");
        const titleLine = (nonHashLines[0] ?? "").replace(/\*\*/g, "").slice(0, 100);
        const shortDescLines = nonHashLines.slice(1, 3).join(" ").slice(0, 300);
        const fullDescription = nonHashLines.join("\n\n");
        setWcTitle(titleLine);
        setWcShortDesc(shortDescLines);
        setWcDescription(fullDescription);
        setWcTags(tagsStr);
      }
    } catch {
      // silently skip
    } finally {
      setWcGeneratingContent(false);
    }
  };

  const handleWcPublish = async () => {
    if (!shareProject || !wcPrice || !wcFeaturedImage) return;
    setWcPublishing(true);
    setWcPublishError("");
    setWcPublishStep("Uploading images…");
    try {
      const res = await fetch("/api/woocommerce/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: wcTitle || shareProject.name,
          description: wcDescription,
          shortDescription: wcShortDesc,
          regularPrice: wcPrice,
          salePrice: wcSalePrice,
          sku: wcSku,
          stockQuantity: String(wcStock),
          categoryId: wcCategoryId ? String(wcCategoryId) : "",
          tags: wcTags,
          status: wcStatus,
          featuredImageUrl: wcFeaturedImage,
          galleryImageUrls: wcGalleryImages,
          attributes: wcAttributes,
          variations: wcVariations,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWcPublishStep("Done!");
        setWcProductUrl(data.productUrl ?? "");
      } else {
        setWcPublishError(data.error ?? "Something went wrong.");
      }
    } catch {
      setWcPublishError("Request failed. Please try again.");
    } finally {
      setWcPublishing(false);
    }
  };

  const generateVariationCombinations = () => {
    if (wcAttributes.length === 0) return;
    type Combo = {attributes: {name: string; option: string}[]; stockQuantity: string};
    let combos: Combo[] = [{ attributes: [], stockQuantity: String(wcStock) }];
    for (const attr of wcAttributes) {
      const expanded: Combo[] = [];
      for (const combo of combos) {
        for (const val of attr.values) {
          expanded.push({ attributes: [...combo.attributes, { name: attr.name, option: val }], stockQuantity: String(wcStock) });
        }
      }
      combos = expanded;
    }
    setWcVariations(combos);
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
    setWizardStep(1);
    setCategory(null);
    setFabricStyle(null);
    setAgeGroup(null);
    setBackground(null);
    setSides(["front"]);
    setNumImages(1);
    setQuality("high");
    setAddVideo(false);
    setSelectedVideoImage(null);
    setReelFormat("9:16");
    setReelTemplate("ken-burns");
    setReelDuration(10);
    setReelBrandName("");
    setReelRendering(false);
    setReelRenderProgress(0);
    setReelOutputUrl(null);
    setSelectedMusicTrack(null);
    setCustomMusicFile(null);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setPreviewingTrack(null);
    setReelMode("canvas");
    setAiVideoImageUrl(null);
    setAiVideoDuration(5);
    setAiVideoResolution("720p");
    setAiVideoGenerating(false);
    setAiVideoProgress(0);
    setAiVideoOutputUrl(null);
    setAiVideoError(null);
    setAiVideoMotionPrompt("");
    setEditingProjectName(null);
    setShowCropTool(false);
    setCropSide(null);
    if (fileRef.current) fileRef.current.value = "";
    if (musicFileRef.current) musicFileRef.current.value = "";
  };

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    setPreviewingTrack(null);
  };

  const togglePreview = (trackId: string, src: string) => {
    if (previewingTrack === trackId) { stopPreview(); return; }
    stopPreview();
    const audio = new Audio(src);
    audio.onended = () => setPreviewingTrack(null);
    audio.play().catch(() => {});
    previewAudioRef.current = audio;
    setPreviewingTrack(trackId);
  };

  const getMusicSrc = (): string | null => {
    if (selectedMusicTrack === "track-1") return "/music/track-1.mp3";
    if (selectedMusicTrack === "track-2") return "/music/track-2.mp3";
    if (selectedMusicTrack === "custom" && customMusicFile) return URL.createObjectURL(customMusicFile);
    return null;
  };

  const muxAiVideoWithAudio = async (videoUrl: string): Promise<string> => {
    const musicSrc = getMusicSrc();
    if (!musicSrc) return videoUrl;

    let videoBlobUrl = videoUrl;
    let shouldRevokeVideo = false;
    try {
      const blob = await fetch(videoUrl).then((r) => r.blob());
      videoBlobUrl = URL.createObjectURL(blob);
      shouldRevokeVideo = true;
    } catch { /* fall through to direct url */ }

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.src = videoBlobUrl;
    await new Promise<void>((res) => {
      video.onloadedmetadata = () => res();
      video.onerror = () => res();
      setTimeout(res, 10000);
    });

    const W = video.videoWidth || 1280;
    const H = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const audioCtx = new AudioContext();
    const dest = audioCtx.createMediaStreamDestination();
    const musicAudio = new Audio();
    musicAudio.crossOrigin = "anonymous";
    musicAudio.loop = true;
    musicAudio.src = musicSrc;
    await new Promise<void>((res) => {
      musicAudio.oncanplaythrough = () => res();
      musicAudio.onerror = () => res();
      setTimeout(res, 3000);
    });
    const source = audioCtx.createMediaElementSource(musicAudio);
    source.connect(dest);

    const canvasStream = canvas.captureStream(30);
    const finalStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : "video/webm";
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(finalStream, { mimeType, videoBitsPerSecond: 5_000_000 });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

    return new Promise((resolve) => {
      recorder.onstop = () => {
        musicAudio.pause(); musicAudio.src = "";
        audioCtx.close();
        if (shouldRevokeVideo) URL.revokeObjectURL(videoBlobUrl);
        if (selectedMusicTrack === "custom") URL.revokeObjectURL(musicSrc);
        resolve(URL.createObjectURL(new Blob(chunks, { type: "video/webm" })));
      };
      video.onended = () => recorder.stop();
      const drawFrame = () => {
        if (!video.paused && !video.ended) { ctx.drawImage(video, 0, 0, W, H); requestAnimationFrame(drawFrame); }
      };
      recorder.start(100);
      musicAudio.play().catch(() => {});
      video.play().then(drawFrame).catch(() => recorder.stop());
    });
  };

  const handleGenerateAiVideo = async () => {
    if (!aiVideoImageUrl) return;
    stopPreview();
    setAiVideoGenerating(true);
    setAiVideoProgress(0);
    setAiVideoOutputUrl(null);
    setAiVideoError(null);

    let prog = 0;
    const timer = setInterval(() => {
      prog = Math.min(prog + 1.5, 90);
      setAiVideoProgress(Math.round(prog));
    }, 1000);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: aiVideoImageUrl, duration: aiVideoDuration, resolution: aiVideoResolution, motionPrompt: aiVideoMotionPrompt.trim() || undefined }),
      });
      const data = await res.json();
      clearInterval(timer);

      if (!res.ok || data.error) { setAiVideoError(data.error ?? "Generation failed"); return; }

      setAiVideoProgress(100);
      await new Promise((r) => setTimeout(r, 300));

      let outputUrl: string;
      if (selectedMusicTrack) {
        outputUrl = await muxAiVideoWithAudio(data.videoUrl);
      } else {
        try {
          const blob = await fetch(data.videoUrl).then((r) => r.blob());
          outputUrl = URL.createObjectURL(blob);
        } catch {
          outputUrl = data.videoUrl;
        }
      }
      setAiVideoOutputUrl(outputUrl);
    } catch {
      setAiVideoError("Request failed. Please try again.");
    } finally {
      clearInterval(timer);
      setAiVideoGenerating(false);
    }
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

  const renderReel = async () => {
    if (!results) return;
    stopPreview();
    setReelRendering(true);
    setReelRenderProgress(0);
    setReelOutputUrl(null);

    const fmt = REEL_FORMATS.find((f) => f.id === reelFormat)!;
    const { width: W, height: H } = fmt;
    const DURATION_MS = reelDuration * 1000;
    const FPS = 30;

    const imageUrls = reelTemplate === "fade-slideshow"
      ? results
      : [selectedVideoImage ?? results[0]];

    const imgs = await Promise.all(
      imageUrls.map((url) =>
        new Promise<HTMLImageElement>((res, rej) => {
          const im = new Image();
          im.crossOrigin = "anonymous";
          im.onload = () => res(im);
          im.onerror = rej;
          im.src = url;
        })
      )
    );

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const drawCovered = (img: HTMLImageElement, dx: number, dy: number, dw: number, dh: number, alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const srcA = img.naturalWidth / img.naturalHeight;
      const dstA = dw / dh;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (srcA > dstA) { sw = img.naturalHeight * dstA; sx = (img.naturalWidth - sw) / 2; }
      else              { sh = img.naturalWidth / dstA;  sy = (img.naturalHeight - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      ctx.restore();
    };

    const drawVignette = () => {
      const cx = W / 2, cy = H / 2, r = Math.max(W, H) * 0.75;
      const gradient = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    };

    const drawFrame = (t: number) => {
      const e = easeInOut(t);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      if (reelTemplate === "ken-burns") {
        const scale = 1 + 0.2 * e;
        const tx = -0.03 * e * W;
        const ty = -0.02 * e * H;
        const dw = W * scale, dh = H * scale;
        drawCovered(imgs[0], (W - dw) / 2 + tx, (H - dh) / 2 + ty, dw, dh);
      } else if (reelTemplate === "zoom-out") {
        const scale = 1.3 - 0.3 * e;
        const angle = (0.5 - 0.5 * e) * Math.PI / 180;
        const dw = W * scale, dh = H * scale;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.rotate(angle);
        ctx.translate(-W / 2, -H / 2);
        drawCovered(imgs[0], (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.restore();
      } else if (reelTemplate === "pan-left") {
        const scale = 1.05 - 0.05 * e;
        const tx = (0.08 - 0.16 * e) * W;
        const dw = W * scale, dh = H * scale;
        drawCovered(imgs[0], (W - dw) / 2 + tx, (H - dh) / 2, dw, dh);
      } else if (reelTemplate === "pan-right") {
        const scale = 1.05 - 0.05 * e;
        const tx = (-0.08 + 0.16 * e) * W;
        const dw = W * scale, dh = H * scale;
        drawCovered(imgs[0], (W - dw) / 2 + tx, (H - dh) / 2, dw, dh);
      } else if (reelTemplate === "fade-slideshow") {
        const total = imgs.length;
        const slotSize = 1 / total;
        const fadeFrac = Math.min(0.3 / (reelDuration / total), 0.5);
        const rawIdx = t / slotSize;
        const imgIdx = Math.min(Math.floor(rawIdx), total - 1);
        const localT = rawIdx - Math.floor(rawIdx);
        let curAlpha = 1;
        if (localT > 1 - fadeFrac && imgIdx < total - 1) {
          curAlpha = 1 - (localT - (1 - fadeFrac)) / fadeFrac;
        }
        drawCovered(imgs[imgIdx], 0, 0, W, H, curAlpha);
        if (localT > 1 - fadeFrac && imgIdx + 1 < total) {
          drawCovered(imgs[imgIdx + 1], 0, 0, W, H, 1 - curAlpha);
        }
      } else if (reelTemplate === "cinematic") {
        const scale = 1 + 0.2 * e;
        const tx = -0.03 * e * W;
        const ty = -0.02 * e * H;
        const dw = W * scale, dh = H * scale;
        drawCovered(imgs[0], (W - dw) / 2 + tx, (H - dh) / 2 + ty, dw, dh);
        drawVignette();
        const barH = Math.round(H * 0.15);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, barH);
        ctx.fillRect(0, H - barH, W, barH);
      } else if (reelTemplate === "drift-up") {
        const scale = 1.1 - 0.1 * e;
        const ty = (0.05 - 0.1 * e) * H;
        const dw = W * scale, dh = H * scale;
        drawCovered(imgs[0], (W - dw) / 2, (H - dh) / 2 + ty, dw, dh);
      } else if (reelTemplate === "pulse") {
        const scale = 1 + 0.05 * Math.sin(t * Math.PI * 4);
        const dw = W * scale, dh = H * scale;
        drawCovered(imgs[0], (W - dw) / 2, (H - dh) / 2, dw, dh);
      }

      // Vignette on all templates except cinematic (which draws it before letterbox)
      if (reelTemplate !== "cinematic") drawVignette();

      if (reelBrandName.trim()) {
        const barH = Math.round(H * 0.08);
        const fontSize = Math.round(W * 0.035);
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, H - barH, W, barH);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(reelBrandName.trim(), W / 2, H - barH / 2);
      }
    };

    let musicSrc: string | null = null;
    if (selectedMusicTrack === "track-1") musicSrc = "/music/track-1.mp3";
    else if (selectedMusicTrack === "track-2") musicSrc = "/music/track-2.mp3";
    else if (selectedMusicTrack === "custom" && customMusicFile) musicSrc = URL.createObjectURL(customMusicFile);

    const canvasStream = canvas.captureStream(FPS);
    let finalStream: MediaStream = canvasStream;
    let audioCtx: AudioContext | null = null;
    let musicAudio: HTMLAudioElement | null = null;

    if (musicSrc) {
      try {
        audioCtx = new AudioContext();
        const dest = audioCtx.createMediaStreamDestination();
        musicAudio = new Audio();
        musicAudio.crossOrigin = "anonymous";
        musicAudio.loop = true;
        musicAudio.src = musicSrc;
        await new Promise<void>((res) => {
          musicAudio!.oncanplaythrough = () => res();
          musicAudio!.onerror = () => res();
          setTimeout(res, 3000);
        });
        const source = audioCtx.createMediaElementSource(musicAudio);
        source.connect(dest);
        finalStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
      } catch {
        finalStream = canvasStream;
      }
    }

    const mimeType = (() => {
      if (musicSrc && MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) return "video/webm;codecs=vp9,opus";
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) return "video/webm;codecs=vp9";
      return "video/webm";
    })();

    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(finalStream, { mimeType, videoBitsPerSecond: 5_000_000 });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

    await new Promise<void>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setReelOutputUrl(URL.createObjectURL(blob));
        if (musicAudio) { musicAudio.pause(); musicAudio.src = ""; }
        if (audioCtx) audioCtx.close();
        if (selectedMusicTrack === "custom" && musicSrc) URL.revokeObjectURL(musicSrc);
        resolve();
      };

      const startTime = performance.now();
      recorder.start(100);
      if (musicAudio) musicAudio.play().catch(() => {});

      const tick = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / DURATION_MS, 1);
        drawFrame(progress);
        setReelRenderProgress(Math.round(progress * 100));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          recorder.stop();
        }
      };
      requestAnimationFrame(tick);
    });

    setReelRendering(false);
  };

  const handleDownloadAllResults = async () => {
    if (!results) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    await Promise.all(
      results.map(async (url, i) => {
        const res = await fetch(url);
        const blob = await res.blob();
        zip.file(`dripshoots-${i + 1}.jpg`, blob);
      })
    );
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dripshoots-results.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isFabricCategory = category === "fabric-male" || category === "fabric-female";
  const totalSteps = isFabricCategory ? 11 : 10;
  const displayStep = !isFabricCategory && wizardStep >= 4 ? wizardStep - 1 : wizardStep;

  const handleNext = () => {
    if (wizardStep === 2 && !isFabricCategory) {
      setWizardStep(4);
    } else {
      setWizardStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (wizardStep === 4 && !isFabricCategory) {
      setWizardStep(2);
    } else {
      setWizardStep((s) => s - 1);
    }
  };

  const isStepValid = (() => {
    switch (wizardStep) {
      case 1: return !!uploadedUrl && !uploading;
      case 2: return !!category;
      case 3: return isFabricCategory ? !!fabricStyle : true;
      case 4: return !!ageGroup;
      case 5: return !!gender && !!ethnicity;
      case 6: return !!background;
      case 7: return !!occasion;
      default: return true;
    }
  })();

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
        {creditInfo && (
          <div className="mx-3 mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">✨ Credits</span>
              <span className="text-xs text-violet-400 capitalize">{creditInfo.plan}</span>
            </div>
            <div className="text-sm font-medium text-white mb-1">
              {creditInfo.credits} / {creditInfo.creditsLimit} remaining
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all ${
                  creditInfo.percentage > 80 ? "bg-red-500" :
                  creditInfo.percentage > 60 ? "bg-amber-500" : "bg-violet-500"
                }`}
                style={{ width: `${Math.min(creditInfo.percentage, 100)}%` }}
              />
            </div>
            <button className="w-full text-xs text-center text-violet-400 hover:text-violet-300 transition-colors">
              Upgrade Plan →
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="pt-[57px] md:ml-64 min-h-screen flex flex-col relative z-10">
        <div className="flex-1 overflow-y-auto">

          {/* ── Wizard ── */}
          {activeNav === "upload" && !generating && !results && (
            <Container className="py-10">
              {/* Editing banner */}
              {editingProjectName && (
                <div className="flex items-center justify-between gap-3 mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <span className="text-xs font-medium truncate">
                      Editing: <span className="text-amber-200">{editingProjectName}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingProjectName(null)}
                    className="flex-shrink-0 text-amber-400/60 hover:text-amber-300 transition-colors"
                    aria-label="Dismiss"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}

              {/* Step progress bar */}
              <div className="mb-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                        i + 1 <= displayStep ? "bg-violet-500" : "bg-white/[0.08]"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-1">
                  Step {displayStep} of {totalSteps}
                </p>
                <h1 className="text-2xl font-bold">{STEP_TITLES[wizardStep]}</h1>
              </div>

              {/* ── Step 1: Upload ── */}
              {wizardStep === 1 && (
                <div>
                  <div
                    className={`w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                      dragging
                        ? "border-violet-500 bg-violet-500/5 scale-[1.01]"
                        : "border-white/10 hover:border-violet-500/40 bg-white/[0.02]"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={handleZoneClick}
                  >
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    {uploaded ? (
                      <div className="p-5 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={uploaded} alt="Uploaded cloth" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm text-white/70 font-medium">{uploading ? "Uploading…" : "Image selected"}</p>
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
                  {uploaded && (
                    <div className="mt-4 flex items-center justify-between bg-white/[0.03] border border-white/[0.07] rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={uploaded} alt="" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm text-white/70">{uploading ? "Uploading…" : "Image ready"}</p>
                      </div>
                      <button onClick={handleRemove} className="text-xs text-white/40 hover:text-white/70 border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
                        Remove
                      </button>
                    </div>
                  )}
                  {showCropTool && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-3">
                      <p className="text-amber-400 text-sm font-medium mb-3">
                        ⚠️ We detected both front and back sides in your image. Please select which side to use:
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCropSide("front")}
                          className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                        >
                          Use Front Side
                        </button>
                        <button
                          onClick={() => handleCropSide("back")}
                          className="flex-1 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                        >
                          Use Back Side
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 mt-2 text-center">
                    💡 Tip: Upload front view only for best results. If your image has both sides, we will detect it automatically.
                  </p>
                </div>
              )}

              {/* ── Step 2: Category ── */}
              {wizardStep === 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${
                        category === cat.id
                          ? "border-violet-500 bg-violet-500/10 text-violet-300"
                          : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-violet-500/40 hover:bg-white/[0.05]"
                      }`}>
                      <span className="text-3xl">{cat.emoji}</span>
                      <span className="text-sm font-medium text-center leading-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Step 3: Fabric Style ── */}
              {wizardStep === 3 && isFabricCategory && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FABRIC_STYLES[category as "fabric-male" | "fabric-female"].map((style) => (
                    <button key={style.id} onClick={() => setFabricStyle(style.id)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${
                        fabricStyle === style.id
                          ? "border-violet-500 bg-violet-500/10 text-violet-300"
                          : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-violet-500/40 hover:bg-white/[0.05]"
                      }`}>
                      <span className="text-3xl">{style.emoji}</span>
                      <span className="text-sm font-medium text-center leading-tight">{style.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Step 4: Age Group ── */}
              {wizardStep === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AGE_GROUPS.map((ag) => (
                    <button key={ag.id} onClick={() => setAgeGroup(ag.id)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                        ageGroup === ag.id
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/[0.07] bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.05]"
                      }`}>
                      <div className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5 ${
                        ageGroup === ag.id ? "bg-violet-500/30 text-violet-300" : "bg-white/[0.07] text-white/40"
                      }`}>
                        {ag.range}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${ageGroup === ag.id ? "text-violet-300" : "text-white/80"}`}>
                          {ag.label}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">{ag.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Step 5: Gender + Ethnicity ── */}
              {wizardStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Gender</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(["female", "male"] as GenderType[]).map((g) => {
                        const isKids = ageGroup === "kids-6-12" || ageGroup === "kids-2-5" || ageGroup === "toddler";
                        const label = isKids
                          ? g === "female" ? "Girl" : "Boy"
                          : g === "female" ? "Female" : "Male";
                        return (
                          <button key={g} onClick={() => setGender(g)}
                            className={`py-4 rounded-2xl border text-sm font-semibold transition-all ${
                              gender === g
                                ? "border-violet-500 bg-violet-500/10 text-violet-300"
                                : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-violet-500/40"
                            }`}>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Ethnicity</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {ETHNICITIES.map((eth) => (
                        <button key={eth} onClick={() => setEthnicity(eth)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                            ethnicity === eth
                              ? "border-violet-500 bg-violet-500/10 text-violet-300"
                              : "border-white/[0.07] bg-white/[0.03] text-white/50 hover:border-violet-500/40"
                          }`}>
                          {eth}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 6: Background ── */}
              {wizardStep === 6 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BACKGROUNDS.map((bg) => (
                    <button key={bg.id} onClick={() => setBackground(bg.id)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                        background === bg.id
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/[0.07] bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.05]"
                      }`}>
                      <div className={`w-8 h-8 rounded-full ${bg.swatch} border border-white/10`} />
                      <span className={`text-xs font-medium text-center leading-tight ${
                        background === bg.id ? "text-violet-300" : "text-white/50"
                      }`}>{bg.id}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Step 7: Occasion ── */}
              {wizardStep === 7 && (
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((occ) => (
                    <button key={occ} onClick={() => setOccasion(occ)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        occasion === occ
                          ? "bg-violet-600/20 border-violet-500 text-violet-300"
                          : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                      }`}>
                      {occ}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Step 8: Sides ── */}
              {wizardStep === 8 && category && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SIDES_BY_CATEGORY[category].map((side) => {
                    const isFront = side.id === "front";
                    const isSelected = sides.includes(side.id);
                    return (
                      <button key={side.id}
                        disabled={isFront}
                        onClick={() => {
                          if (isFront) return;
                          setSides((prev) =>
                            prev.includes(side.id) ? prev.filter((s) => s !== side.id) : [...prev, side.id]
                          );
                        }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? "border-violet-500 bg-violet-500/10 text-violet-300"
                            : "border-white/[0.07] bg-white/[0.03] text-white/50 hover:border-violet-500/40"
                        } ${isFront ? "cursor-default" : "cursor-pointer"}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "border-violet-500 bg-violet-500" : "border-white/20"
                        }`}>
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {side.label}
                          {isFront && <span className="ml-1 text-[10px] text-white/30">(always on)</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── Step 9: Number of images per side ── */}
              {wizardStep === 9 && (
                <div>
                  <div className="flex gap-2 mb-4">
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button key={n} onClick={() => setNumImages(n)}
                        className={`w-14 h-14 rounded-xl border text-lg font-bold transition-all ${
                          numImages === n
                            ? "border-violet-500 bg-violet-500/10 text-violet-300"
                            : "border-white/[0.07] bg-white/[0.03] text-white/50 hover:border-violet-500/40"
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-white/40">
                    You&apos;ll get{" "}
                    <span className="text-white/80 font-semibold">
                      {numImages * sides.length} image{numImages * sides.length !== 1 ? "s" : ""}
                    </span>{" "}
                    ({numImages} per side × {sides.length} side{sides.length !== 1 ? "s" : ""})
                  </p>
                </div>
              )}

              {/* ── Step 10: Quality ── */}
              {wizardStep === 10 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["standard", "high", "ultra"] as Quality[]).map((q) => {
                    const meta = {
                      standard: { title: "Standard", desc: "Fast generation (~10s)\nGreat for previews",  credits: "1 credit / image" },
                      high:     { title: "High",     desc: "Better detail & sharpness\nRecommended",       credits: "3 credits / image" },
                      ultra:    { title: "Ultra",    desc: "Maximum resolution\nBest for print & ads",     credits: "5 credits / image" },
                    }[q];
                    return (
                      <button key={q} onClick={() => setQuality(q)}
                        className={`flex flex-col gap-2 p-5 rounded-2xl border text-left transition-all ${
                          quality === q
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-white/[0.07] bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.05]"
                        }`}>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${quality === q ? "text-violet-300" : "text-white/80"}`}>{meta.title}</p>
                          {q === "high" && (
                            <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full border border-violet-500/30">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed whitespace-pre-line">{meta.desc}</p>
                        <p className={`text-[10px] font-medium ${quality === q ? "text-violet-400" : "text-white/30"}`}>{meta.credits}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── Step 11: Video reel ── */}
              {wizardStep === 11 && (
                <div className="grid grid-cols-2 gap-3">
                  {([true, false] as const).map((val) => (
                    <button key={String(val)} onClick={() => setAddVideo(val)}
                      className={`flex flex-col gap-2 p-5 rounded-2xl border text-left transition-all ${
                        addVideo === val
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/[0.07] bg-white/[0.03] hover:border-violet-500/40"
                      }`}>
                      <p className={`text-sm font-semibold ${addVideo === val ? "text-violet-300" : "text-white/80"}`}>
                        {val ? "Yes" : "No"}
                      </p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        {val ? "Generate a cinematic reel from your images" : "Images only"}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Navigation buttons ── */}
              <div className="flex gap-3 mt-8">
                {wizardStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="px-5 py-3 rounded-xl border border-white/[0.07] text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
                  >
                    ← Back
                  </button>
                )}
                {wizardStep < 11 ? (
                  <button
                    disabled={!isStepValid}
                    onClick={handleNext}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isStepValid
                        ? "bg-violet-600 hover:bg-violet-500 text-white"
                        : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                    }`}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    disabled={!uploadedUrl || !gender || !ethnicity || !occasion}
                    onClick={handleGenerate}
                    className="flex-1 py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:bg-white/[0.04] disabled:text-white/20 disabled:cursor-not-allowed"
                  >
                    <span>Generate ✨</span>
                    <span className="ml-2 text-violet-300 text-xs font-normal">{numImages * sides.length * QUALITY_CREDITS[quality]} credits</span>
                  </button>
                )}
              </div>
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
                  <p className="text-white/40 text-sm mt-1">{results.length} image{results.length !== 1 ? "s" : ""} ready for download</p>
                </div>
                <button
                  onClick={handleReset}
                  className="self-start text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded-lg transition-colors flex-shrink-0"
                >
                  + Start New Project
                </button>
              </div>

              {/* Original garment + generated grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {/* Original garment card */}
                {uploadedUrl && (
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedUrl}
                      alt="Original Garment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                      <p className="text-white text-[11px] font-medium">Original Garment</p>
                    </div>
                  </div>
                )}
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-2">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg">
                        View full size
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadUrl(url, `dripshoots-${i + 1}.jpg`);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/15 backdrop-blur-sm border border-white/20 text-white p-1.5 rounded-lg hover:bg-white/25"
                        title="Download image"
                      >
                        <DownloadIcon />
                      </button>
                    </div>
                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-sm text-white/60 text-[10px] px-2 py-0.5 rounded-full">
                      {i + 1} / {results.length}
                    </div>
                  </div>
                ))}
              </div>

              {/* Download All */}
              <div className="mb-4 flex justify-end">
                <button
                  onClick={handleDownloadAllResults}
                  className="flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <DownloadIcon />
                  Download All
                </button>
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
                        onClick={() => setActiveExportTab(tab.id)}
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
                    <div className="space-y-6">

                      {/* Mode toggle */}
                      <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.07]">
                        {([
                          { id: "canvas" as ReelMode, label: "Canvas Reel" },
                          { id: "ai-video" as ReelMode, label: "AI Video · Fashn.ai" },
                        ]).map((mode) => (
                          <button key={mode.id} onClick={() => setReelMode(mode.id)}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                              reelMode === mode.id
                                ? "bg-violet-600 text-white"
                                : "text-white/40 hover:text-white/70"
                            }`}>
                            {mode.label}
                          </button>
                        ))}
                      </div>

                      {/* Shared hidden music file input — always mounted so both modes can use it */}
                      <input
                        ref={musicFileRef}
                        type="file"
                        accept="audio/mp3,audio/mpeg,audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) { setCustomMusicFile(file); setSelectedMusicTrack("custom"); stopPreview(); }
                        }}
                      />

                      {reelMode === "canvas" && <>

                      {/* 1. Format selector */}
                      <div>
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Format</p>
                        <div className="flex gap-2 flex-wrap">
                          {REEL_FORMATS.map((fmt) => (
                            <button key={fmt.id} onClick={() => setReelFormat(fmt.id)}
                              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                                reelFormat === fmt.id
                                  ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                  : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                              }`}>
                              <span className="font-medium">{fmt.label}</span>
                              <span className="ml-1.5 text-[10px] opacity-60">{fmt.subtitle}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Template selector */}
                      <div>
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Motion Template</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {REEL_TEMPLATES.map((tpl) => (
                            <button key={tpl.id} onClick={() => setReelTemplate(tpl.id)}
                              className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${
                                reelTemplate === tpl.id
                                  ? "border-violet-500 bg-violet-500/10"
                                  : "border-white/[0.07] bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.05]"
                              }`}>
                              <span className="text-2xl leading-none">{tpl.icon}</span>
                              <p className={`text-xs font-semibold ${reelTemplate === tpl.id ? "text-violet-300" : "text-white/80"}`}>
                                {tpl.name}
                              </p>
                              <p className="text-[10px] text-white/40 leading-relaxed">{tpl.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Image selector */}
                      <div>
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">
                          {reelTemplate === "fade-slideshow" ? "Images" : "Choose image"}
                        </p>
                        {reelTemplate === "fade-slideshow" ? (
                          <div className="flex items-center gap-3 p-4 rounded-xl border border-violet-500/30 bg-violet-500/5">
                            <div className="flex gap-1.5">
                              {results.slice(0, 4).map((url, i) => (
                                <div key={i} className="w-9 h-12 rounded-lg overflow-hidden border border-violet-500/30 flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={url} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {results.length > 4 && (
                                <div className="w-9 h-12 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[9px] text-white/40">+{results.length - 4}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-violet-300 font-medium">All {results.length} images will be used</p>
                          </div>
                        ) : (
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {results.map((url, i) => (
                              <button key={i} onClick={() => setSelectedVideoImage(url)}
                                className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                                  selectedVideoImage === url ? "border-violet-500 scale-[1.02]" : "border-white/10 hover:border-violet-500/40"
                                }`}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                                {selectedVideoImage === url && (
                                  <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                                    <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 4. Duration selector */}
                      <div>
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Duration</p>
                        <div className="flex gap-2">
                          {([5, 10, 15] as const).map((d) => (
                            <button key={d} onClick={() => setReelDuration(d)}
                              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                                reelDuration === d
                                  ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                  : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                              }`}>
                              {d} sec
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 5. Brand name input */}
                      <div>
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">
                          Brand Overlay <span className="normal-case text-white/20">(optional)</span>
                        </p>
                        <input
                          type="text"
                          value={reelBrandName}
                          onChange={(e) => setReelBrandName(e.target.value)}
                          placeholder="e.g. DripShoots"
                          maxLength={40}
                          className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                        />
                        {reelBrandName.trim() && (
                          <p className="text-[10px] text-white/30 mt-1.5">Brand name will appear at the bottom of the video</p>
                        )}
                      </div>

                      {/* 6. Music */}
                      <div>
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Music</p>
                        <div className="space-y-2">
                          {/* No music */}
                          <button
                            onClick={() => { setSelectedMusicTrack(null); stopPreview(); }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                              selectedMusicTrack === null
                                ? "border-violet-500 bg-violet-500/10"
                                : "border-white/[0.07] bg-white/[0.03] hover:border-violet-500/40"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
                              selectedMusicTrack === null ? "bg-violet-500/20" : "bg-white/[0.05]"
                            }`}>🔇</div>
                            <span className={`flex-1 text-sm font-medium ${selectedMusicTrack === null ? "text-violet-300" : "text-white/60"}`}>
                              No music
                            </span>
                            {selectedMusicTrack === null && (
                              <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                  <path d="M1.5 4l1.5 1.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </button>

                          {/* Built-in tracks */}
                          {MUSIC_TRACKS.map((track) => (
                            <div
                              key={track.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                selectedMusicTrack === track.id
                                  ? "border-violet-500 bg-violet-500/10"
                                  : "border-white/[0.07] bg-white/[0.03]"
                              }`}
                            >
                              <button
                                onClick={() => togglePreview(track.id, track.src)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                  previewingTrack === track.id
                                    ? "bg-violet-500 text-white"
                                    : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1] hover:text-white"
                                }`}
                              >
                                {previewingTrack === track.id ? (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                                    <rect x="2" y="1" width="2.5" height="8" rx="0.5"/>
                                    <rect x="5.5" y="1" width="2.5" height="8" rx="0.5"/>
                                  </svg>
                                ) : (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                                    <path d="M2 1.5L8.5 5 2 8.5V1.5z"/>
                                  </svg>
                                )}
                              </button>
                              <span className={`flex-1 text-sm font-medium ${
                                selectedMusicTrack === track.id ? "text-violet-300" : "text-white/60"
                              }`}>{track.label}</span>
                              <button
                                onClick={() => { setSelectedMusicTrack(track.id); stopPreview(); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
                                  selectedMusicTrack === track.id
                                    ? "bg-violet-500/20 border border-violet-500/40 text-violet-300"
                                    : "bg-white/[0.05] border border-white/10 text-white/50 hover:text-white hover:border-white/20"
                                }`}
                              >
                                {selectedMusicTrack === track.id ? "Selected" : "Select"}
                              </button>
                            </div>
                          ))}

                          {/* Upload own */}
                          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            selectedMusicTrack === "custom"
                              ? "border-violet-500 bg-violet-500/10"
                              : "border-white/[0.07] bg-white/[0.03]"
                          }`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
                              selectedMusicTrack === "custom" ? "bg-violet-500/20" : "bg-white/[0.05]"
                            }`}>🎵</div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${selectedMusicTrack === "custom" ? "text-violet-300" : "text-white/60"}`}>
                                {customMusicFile ? customMusicFile.name : "Upload your own"}
                              </p>
                              {customMusicFile && (
                                <p className="text-[10px] text-white/30 mt-0.5">{(customMusicFile.size / 1024 / 1024).toFixed(1)} MB · MP3</p>
                              )}
                            </div>
                            <button
                              onClick={() => musicFileRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors flex-shrink-0"
                            >
                              Browse
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 7 & 8. Render button + progress */}
                      {!reelOutputUrl && (
                        <div>
                          <button
                            disabled={reelRendering || (reelTemplate !== "fade-slideshow" && !selectedVideoImage)}
                            onClick={renderReel}
                            className={`w-full py-3.5 rounded-xl text-sm font-medium transition-colors ${
                              !reelRendering && (reelTemplate === "fade-slideshow" || selectedVideoImage)
                                ? "bg-violet-600 hover:bg-violet-500 text-white"
                                : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                            }`}
                          >
                            {reelRendering ? "Rendering…" : "Render Reel"}
                          </button>
                          {reelRendering && (
                            <div className="mt-4 space-y-2">
                              <div className="bg-white/[0.06] rounded-full h-[3px] overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${reelRenderProgress}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-white/40">
                                <span>Rendering frames…</span>
                                <span>{reelRenderProgress}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 8. Video preview + Download */}
                      {reelOutputUrl && (
                        <div className="space-y-4">
                          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                          <video src={reelOutputUrl} controls autoPlay loop className="w-full rounded-2xl bg-black" />
                          <div className="flex gap-3">
                            <a
                              href={reelOutputUrl}
                              download={REEL_FORMATS.find((f) => f.id === reelFormat)!.filename}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                            >
                              <DownloadIcon />
                              Download
                            </a>
                            <button
                              onClick={() => { setReelOutputUrl(null); setReelRenderProgress(0); }}
                              className="flex-1 py-3 rounded-xl text-sm font-medium border border-white/[0.07] text-white/60 hover:text-white hover:border-white/20 transition-colors"
                            >
                              ← Render Again
                            </button>
                          </div>
                        </div>
                      )}

                      </>}

                      {/* ── AI Video mode ── */}
                      {reelMode === "ai-video" && <>

                      {/* Image selector */}
                      {!aiVideoOutputUrl && (
                        <div>
                          <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Choose image</p>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {results.map((url, i) => (
                              <button key={i} onClick={() => setAiVideoImageUrl(url)}
                                className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                                  aiVideoImageUrl === url ? "border-violet-500 scale-[1.02]" : "border-white/10 hover:border-violet-500/40"
                                }`}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                                {aiVideoImageUrl === url && (
                                  <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                                    <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Duration */}
                      {!aiVideoOutputUrl && (
                        <div>
                          <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Duration</p>
                          <div className="flex gap-2">
                            {([5, 10] as const).map((d) => (
                              <button key={d} onClick={() => setAiVideoDuration(d)}
                                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                                  aiVideoDuration === d
                                    ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                    : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                                }`}>
                                {d}s
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resolution */}
                      {!aiVideoOutputUrl && (
                        <div>
                          <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Resolution</p>
                          <div className="flex gap-2 flex-wrap">
                            {(["480p", "720p", "1080p"] as const).map((res) => (
                              <button key={res} onClick={() => setAiVideoResolution(res)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${
                                  aiVideoResolution === res
                                    ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                    : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                                }`}>
                                <span className="font-medium">{res}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                                  aiVideoResolution === res
                                    ? "bg-violet-500/20 border-violet-500/30 text-violet-300"
                                    : "bg-white/[0.05] border-white/10 text-white/30"
                                }`}>{AI_VIDEO_CREDITS[res]}cr</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Credit badge */}
                      {!aiVideoOutputUrl && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <span className="text-white/40 text-xs">Cost</span>
                          <span className="text-violet-400 font-bold text-sm">
                            {AI_VIDEO_CREDITS[aiVideoResolution]} credit{AI_VIDEO_CREDITS[aiVideoResolution] !== 1 ? "s" : ""}
                          </span>
                          <span className="text-white/20 text-xs">· {aiVideoDuration}s · {aiVideoResolution}</span>
                        </div>
                      )}

                      {/* Motion prompt */}
                      {!aiVideoOutputUrl && (
                        <div>
                          <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">
                            Model Motion <span className="normal-case text-white/20">(optional)</span>
                          </p>
                          <input
                            type="text"
                            value={aiVideoMotionPrompt}
                            onChange={(e) => setAiVideoMotionPrompt(e.target.value)}
                            placeholder="e.g. walking confidently, sexy pose, smart look, fabric flowing, slow spin..."
                            maxLength={120}
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                          />
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {["Walking", "Sexy Pose", "Smart Look", "Fabric Flowing", "Slow Spin", "Runway Walk"].map((pill) => (
                              <button
                                key={pill}
                                onClick={() => setAiVideoMotionPrompt(pill)}
                                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                                  aiVideoMotionPrompt === pill
                                    ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                    : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:border-white/20 hover:text-white/70"
                                }`}
                              >
                                {pill}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Music */}
                      <div>
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Music</p>
                        <div className="space-y-2">
                          <button
                            onClick={() => { setSelectedMusicTrack(null); stopPreview(); }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                              selectedMusicTrack === null
                                ? "border-violet-500 bg-violet-500/10"
                                : "border-white/[0.07] bg-white/[0.03] hover:border-violet-500/40"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
                              selectedMusicTrack === null ? "bg-violet-500/20" : "bg-white/[0.05]"
                            }`}>🔇</div>
                            <span className={`flex-1 text-sm font-medium ${selectedMusicTrack === null ? "text-violet-300" : "text-white/60"}`}>
                              No music
                            </span>
                            {selectedMusicTrack === null && (
                              <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                  <path d="M1.5 4l1.5 1.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </button>
                          {MUSIC_TRACKS.map((track) => (
                            <div key={track.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              selectedMusicTrack === track.id
                                ? "border-violet-500 bg-violet-500/10"
                                : "border-white/[0.07] bg-white/[0.03]"
                            }`}>
                              <button onClick={() => togglePreview(track.id, track.src)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                  previewingTrack === track.id
                                    ? "bg-violet-500 text-white"
                                    : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1] hover:text-white"
                                }`}>
                                {previewingTrack === track.id ? (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                                    <rect x="2" y="1" width="2.5" height="8" rx="0.5"/>
                                    <rect x="5.5" y="1" width="2.5" height="8" rx="0.5"/>
                                  </svg>
                                ) : (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                                    <path d="M2 1.5L8.5 5 2 8.5V1.5z"/>
                                  </svg>
                                )}
                              </button>
                              <span className={`flex-1 text-sm font-medium ${
                                selectedMusicTrack === track.id ? "text-violet-300" : "text-white/60"
                              }`}>{track.label}</span>
                              <button
                                onClick={() => { setSelectedMusicTrack(track.id); stopPreview(); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
                                  selectedMusicTrack === track.id
                                    ? "bg-violet-500/20 border border-violet-500/40 text-violet-300"
                                    : "bg-white/[0.05] border border-white/10 text-white/50 hover:text-white hover:border-white/20"
                                }`}>
                                {selectedMusicTrack === track.id ? "Selected" : "Select"}
                              </button>
                            </div>
                          ))}
                          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            selectedMusicTrack === "custom"
                              ? "border-violet-500 bg-violet-500/10"
                              : "border-white/[0.07] bg-white/[0.03]"
                          }`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
                              selectedMusicTrack === "custom" ? "bg-violet-500/20" : "bg-white/[0.05]"
                            }`}>🎵</div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${selectedMusicTrack === "custom" ? "text-violet-300" : "text-white/60"}`}>
                                {customMusicFile ? customMusicFile.name : "Upload your own"}
                              </p>
                              {customMusicFile && (
                                <p className="text-[10px] text-white/30 mt-0.5">{(customMusicFile.size / 1024 / 1024).toFixed(1)} MB · MP3</p>
                              )}
                            </div>
                            <button
                              onClick={() => musicFileRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors flex-shrink-0"
                            >
                              Browse
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Generate button + progress */}
                      {!aiVideoOutputUrl && (
                        <div>
                          <button
                            disabled={!aiVideoImageUrl || aiVideoGenerating}
                            onClick={handleGenerateAiVideo}
                            className={`w-full py-3.5 rounded-xl text-sm font-medium transition-colors ${
                              aiVideoImageUrl && !aiVideoGenerating
                                ? "bg-violet-600 hover:bg-violet-500 text-white"
                                : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                            }`}
                          >
                            {aiVideoGenerating ? "Generating…" : "Generate AI Video"}
                          </button>
                          {aiVideoGenerating && (
                            <div className="mt-4 space-y-2">
                              <div className="bg-white/[0.06] rounded-full h-[3px] overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full transition-all duration-1000"
                                  style={{ width: `${aiVideoProgress}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-white/40">
                                <span>Generating via Fashn.ai…</span>
                                <span>{aiVideoProgress}%</span>
                              </div>
                            </div>
                          )}
                          {aiVideoError && (
                            <p className="mt-3 text-xs text-red-400 text-center">{aiVideoError}</p>
                          )}
                        </div>
                      )}

                      {/* AI Video output */}
                      {aiVideoOutputUrl && (
                        <div className="space-y-4">
                          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                          <video src={aiVideoOutputUrl} controls autoPlay loop className="w-full rounded-2xl bg-black" />
                          <div className="flex gap-3">
                            <a
                              href={aiVideoOutputUrl}
                              download="dripshoots-ai-video.webm"
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                            >
                              <DownloadIcon />
                              Download
                            </a>
                            <button
                              onClick={() => { setAiVideoOutputUrl(null); setAiVideoProgress(0); setAiVideoError(null); }}
                              className="flex-1 py-3 rounded-xl text-sm font-medium border border-white/[0.07] text-white/60 hover:text-white hover:border-white/20 transition-colors"
                            >
                              ← Generate Again
                            </button>
                          </div>
                        </div>
                      )}

                      </>}

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
          {activeNav === "projects" && (
            <Container className="py-10">
              <div className="mb-8">
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">
                  Projects
                </p>
                <h1 className="text-2xl font-bold">My Projects</h1>
                {!projectsLoading && (
                  <p className="text-white/30 text-sm mt-1">
                    {projects.length} project{projects.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {projectsLoading ? (
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl h-36 animate-pulse"
                    />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-16 text-center">
                  <p className="text-white/40 text-sm">No projects yet</p>
                  <p className="text-white/20 text-xs mt-1">
                    Generate your first shoot from the Upload tab.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const PROJECTS_PER_PAGE = 6;
                    const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
                    const paginatedProjects = projects.slice((projectsPage - 1) * PROJECTS_PER_PAGE, projectsPage * PROJECTS_PER_PAGE);
                    return (<>
                  {paginatedProjects.map((project) => {
                    const isExpanded = expandedProjectId === project.id;
                    const originalImage = project.uploads[0]?.imageUrl;
                    const date = new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    return (
                      <div
                        key={project.id}
                        className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden transition-all"
                      >
                        <div className="p-5 flex gap-5">
                          {/* Original garment thumbnail */}
                          <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white/[0.05]">
                            {originalImage && (
                              <img
                                src={getImageUrl(originalImage)}
                                alt="Garment"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-semibold text-white text-sm leading-tight">
                                {project.name}
                              </h3>
                              <span className="text-xs text-white/30 flex-shrink-0">{date}</span>
                            </div>

                            {/* Tag pills */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {[project.gender, project.ethnicity, project.occasion].map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-violet-600/15 text-violet-300 border border-violet-500/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Generated image thumbnails */}
                            <div className="flex gap-2 mt-3">
                              {project.images.slice(0, 4).map((img, i) => (
                                <div
                                  key={img.id}
                                  className="w-10 h-14 rounded-lg overflow-hidden bg-white/[0.05] flex-shrink-0"
                                >
                                  <img
                                    src={getImageUrl(img.imageUrl)}
                                    alt={`Generated ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {project.images.length > 4 && (
                                <div className="w-10 h-14 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                                  <span className="text-[10px] text-white/40">
                                    +{project.images.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => handleDownloadAllImages(project)}
                                disabled={downloadingProjectId === project.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/25 text-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {downloadingProjectId === project.id ? (
                                  <>
                                    <span className="w-3 h-3 rounded-full border border-violet-400 border-t-transparent animate-spin" />
                                    Zipping…
                                  </>
                                ) : (
                                  <>↓ Download All</>
                                )}
                              </button>
                              <button
                                onClick={() => handleEditAndRegenerate(project)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/50 hover:text-white/80 transition-colors"
                              >
                                ✎ Edit &amp; Regenerate
                              </button>
                              <button
                                onClick={() => openShareModal(project)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/50 hover:text-white/80 transition-colors"
                              >
                                ↗ Share
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded full image grid */}
                        {isExpanded && project.images.length > 0 && (
                          <div className="border-t border-white/[0.07] p-5">
                            <div className="grid grid-cols-3 gap-3">
                              {project.images.map((img, i) => (
                                <div
                                  key={img.id}
                                  className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/[0.05] group"
                                >
                                  <img
                                    src={getImageUrl(img.imageUrl)}
                                    alt={`Generated ${i + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                                    <button
                                      onClick={async () => {
                                        const res = await fetch(getImageUrl(img.imageUrl));
                                        const blob = await res.blob();
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `dripshoots-${i + 1}.jpg`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-2 rounded-lg"
                                    >
                                      <DownloadIcon />
                                      Download
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Export toolbar */}
                            <div className="mt-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
                              <div className="px-5 pt-5">
                                <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-4">Export</p>
                                <div className="flex gap-0.5 overflow-x-auto pb-px">
                                  {PROJECT_EXPORT_TABS.map((tab) => (
                                    <button
                                      key={tab.id}
                                      onClick={() => setProjectExportTab(tab.id)}
                                      className={`
                                        px-4 py-2.5 text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all rounded-t-lg border-b-2
                                        ${projectExportTab === tab.id
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
                              <div className="p-5">
                                <div className="grid grid-cols-2 gap-4">
                                  {PLATFORM_FORMATS[projectExportTab].map((fmt, i) => (
                                    <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-xl overflow-hidden">
                                      <div className="relative h-36 overflow-hidden bg-black/20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={getImageUrl(project.images[i]?.imageUrl ?? project.images[0].imageUrl)}
                                          alt={fmt.label}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white/50 text-[9px] px-1.5 py-0.5 rounded font-mono tracking-wide">
                                          {fmt.ratioLabel}
                                        </div>
                                      </div>
                                      <div className="p-3 flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                          <p className="text-xs text-white/70 font-medium truncate">{fmt.label}</p>
                                          <p className="text-[10px] text-white/30 mt-0.5">{fmt.description}</p>
                                        </div>
                                        <button
                                          onClick={() => downloadCropped(
                                            getImageUrl(project.images[i]?.imageUrl ?? project.images[0].imageUrl),
                                            fmt.width,
                                            fmt.height,
                                            fmt.filename
                                          )}
                                          className="flex-shrink-0 flex items-center gap-1.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                                        >
                                          <DownloadIcon />
                                          Download
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expand / collapse toggle */}
                        {project.images.length > 0 && (
                          <button
                            onClick={() =>
                              setExpandedProjectId(isExpanded ? null : project.id)
                            }
                            className="w-full py-3 text-xs text-white/30 hover:text-violet-400 border-t border-white/[0.07] transition-colors"
                          >
                            {isExpanded
                              ? "Collapse ↑"
                              : `View all ${project.images.length} image${project.images.length !== 1 ? "s" : ""} ↓`}
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-6">
                      <p className="text-sm text-white/40">
                        Showing {Math.min((projectsPage - 1) * PROJECTS_PER_PAGE + 1, projects.length)}–{Math.min(projectsPage * PROJECTS_PER_PAGE, projects.length)} of {projects.length} projects
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setProjectsPage(p => Math.max(1, p - 1))}
                          disabled={projectsPage === 1}
                          className="px-3 py-1.5 text-sm rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >← Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setProjectsPage(page)}
                            className={`w-8 h-8 text-sm rounded-lg transition-colors ${page === projectsPage ? "bg-violet-600 text-white" : "border border-white/10 text-white/60 hover:text-white"}`}
                          >{page}</button>
                        ))}
                        <button
                          onClick={() => setProjectsPage(p => Math.min(totalPages, p + 1))}
                          disabled={projectsPage === totalPages || totalPages === 0}
                          className="px-3 py-1.5 text-sm rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >Next →</button>
                      </div>
                    </div>
                  )}
                  </>);
                  })()}
                </div>
              )}
            </Container>
          )}

          {/* Settings — Integrations */}
          {activeNav === "settings" && (
            <Container className="py-10">
              {/* Header */}
              <div className="mb-8">
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">Settings</p>
                <h1 className="text-2xl font-bold">Integrations</h1>
                <p className="text-white/40 text-sm mt-1">Connect your store and social platforms.</p>
              </div>

              {/* Integration cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* ── WooCommerce card (active) ── */}
                <div className="border border-white/[0.07] rounded-2xl overflow-hidden">
                  {/* Card header */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🛍️</span>
                      <div>
                        <p className="font-semibold text-sm">WooCommerce</p>
                        <p className="text-xs mt-0.5 flex items-center gap-1">
                          {wcConnected ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                              <span className="text-green-400">Connected</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block" />
                              <span className="text-white/40">Not connected</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveIntegration(activeIntegration === "woo" ? null : "woo")}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        wcConnected
                          ? "border-green-500/30 text-green-400 bg-green-500/10"
                          : "border-violet-500/50 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20"
                      }`}
                    >
                      {wcConnected ? "Connected ✓" : "Connect"}
                    </button>
                  </div>

                  {/* Inline expand form */}
                  {activeIntegration === "woo" && (
                    <div className="border-t border-white/[0.07] p-5 bg-white/[0.02] space-y-3">
                      {/* Store URL */}
                      <div>
                        <label className="text-xs text-white/40 mb-1 block">Store URL</label>
                        <input
                          type="url"
                          placeholder="https://yourstore.com"
                          value={wcForm.siteUrl}
                          onChange={(e) => setWcForm({ ...wcForm, siteUrl: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
                        />
                      </div>
                      {/* Consumer Key */}
                      <div>
                        <label className="text-xs text-white/40 mb-1 block">Consumer Key</label>
                        <input
                          type="text"
                          placeholder="ck_..."
                          value={wcForm.consumerKey}
                          onChange={(e) => setWcForm({ ...wcForm, consumerKey: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
                        />
                      </div>
                      {/* Consumer Secret */}
                      <div>
                        <label className="text-xs text-white/40 mb-1 block">Consumer Secret</label>
                        <div className="relative">
                          <input
                            type={wcShowSecret ? "text" : "password"}
                            placeholder="cs_..."
                            value={wcForm.consumerSecret}
                            onChange={(e) => setWcForm({ ...wcForm, consumerSecret: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 pr-14 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
                          />
                          <button
                            type="button"
                            onClick={() => setWcShowSecret(!wcShowSecret)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs"
                          >
                            {wcShowSecret ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                      {/* App Password */}
                      <div>
                        <label className="text-xs text-white/40 mb-1 block">App Password</label>
                        <div className="relative">
                          <input
                            type={wcShowAppPw ? "text" : "password"}
                            placeholder="xxxx xxxx xxxx xxxx"
                            value={wcForm.appPassword}
                            onChange={(e) => setWcForm({ ...wcForm, appPassword: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 pr-14 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
                          />
                          <button
                            type="button"
                            onClick={() => setWcShowAppPw(!wcShowAppPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs"
                          >
                            {wcShowAppPw ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                      {/* Error */}
                      {wcError && <p className="text-red-400 text-xs">{wcError}</p>}
                      {/* Submit */}
                      <button
                        disabled={wcConnecting}
                        onClick={async () => {
                          setWcConnecting(true);
                          setWcError("");
                          const res = await fetch("/api/settings/woocommerce", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              wpSiteUrl: wcForm.siteUrl,
                              wpConsumerKey: wcForm.consumerKey,
                              wpConsumerSecret: wcForm.consumerSecret,
                              wpAppPassword: wcForm.appPassword,
                            }),
                          });
                          const data = await res.json();
                          setWcConnecting(false);
                          if (data.success) {
                            setWcConnected(true);
                            setActiveIntegration(null);
                          } else {
                            setWcError(data.error ?? "Something went wrong.");
                          }
                        }}
                        className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-sm font-medium transition-colors"
                      >
                        {wcConnecting ? "Connecting…" : "Connect Store"}
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Coming Soon cards ── */}
                {[
                  { icon: "📘", name: "Facebook" },
                  { icon: "📸", name: "Instagram" },
                  { icon: "🎵", name: "TikTok" },
                  { icon: "🟦", name: "Shopify" },
                ].map(({ icon, name }) => (
                  <div
                    key={name}
                    className="border border-white/[0.04] rounded-2xl p-5 opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <p className="font-semibold text-sm">{name}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.07] text-white/40">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            </Container>
          )}

        </div>
      </main>

      {/* ── Share Modal ── */}
      {shareProject && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShareProject(null); }}
        >
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] flex-shrink-0">
              <div>
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium">Share</p>
                <h2 className="text-sm font-semibold mt-0.5 truncate">{shareProject.name}</h2>
              </div>
              <button
                onClick={() => setShareProject(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-white/[0.07] flex-shrink-0">
              {(["social", "woocommerce"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShareTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                    shareTab === tab
                      ? "text-violet-400 border-violet-500"
                      : "text-white/40 border-transparent hover:text-white/70"
                  }`}
                >
                  {tab === "social" ? "Social" : "🛍️ WooCommerce"}
                </button>
              ))}
            </div>

            {/* ── Social Tab ── */}
            {shareTab === "social" && (
              <div className="overflow-y-auto flex-1">

                {/* Section 1 — Image selector */}
                <div className="px-5 py-4 border-b border-white/[0.07]">
                  <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">
                    Select Images
                    <span className="normal-case text-white/20 ml-2">({shareSelectedImages.length} selected)</span>
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {shareProject.images.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => toggleShareImage(img.imageUrl)}
                        className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                          shareSelectedImages.includes(img.imageUrl)
                            ? "border-violet-500 scale-[1.02]"
                            : "border-white/10 hover:border-violet-500/40"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getImageUrl(img.imageUrl)} alt="" className="w-full h-full object-cover" />
                        {shareSelectedImages.includes(img.imageUrl) && (
                          <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2 — AI Caption */}
                <div className="px-5 py-4 border-b border-white/[0.07]">
                  <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">AI Caption</p>

                  {/* Platform pills */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {SHARE_PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setSharePlatform(p.id); setShareCaption(""); }}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          sharePlatform === p.id
                            ? "bg-violet-600/20 border-violet-500 text-violet-300"
                            : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>

                  {/* Generate button */}
                  <button
                    onClick={handleGenerateCaption}
                    disabled={shareCaptionLoading}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      shareCaptionLoading
                        ? "bg-white/[0.04] text-white/30 cursor-not-allowed"
                        : "bg-violet-600 hover:bg-violet-500 text-white"
                    }`}
                  >
                    {shareCaptionLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border border-white/40 border-t-white animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>{shareCaption ? "✨ Regenerate" : "✨ Generate Caption"}</>
                    )}
                  </button>

                  {/* Editable caption */}
                  {shareCaption && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={shareCaption}
                        onChange={(e) => setShareCaption(e.target.value)}
                        rows={6}
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white/80 resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                      <button
                        onClick={handleCopyCaption}
                        className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
                          shareCopied
                            ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-300"
                            : "bg-violet-600/15 border border-violet-500/25 text-violet-300 hover:bg-violet-600/25"
                        }`}
                      >
                        {shareCopied ? "✓ Copied to clipboard!" : "Copy to Clipboard"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Section 3 — Share buttons */}
                <div className="px-5 py-4">
                  <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Share to</p>
                  <div className="grid grid-cols-2 gap-3">
                    {SHARE_PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleShareTo(p.id)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all text-left"
                      >
                        <span className="text-2xl leading-none flex-shrink-0">{p.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white/80">{p.name}</p>
                          <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{p.hint}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ── WooCommerce Tab ── */}
            {shareTab === "woocommerce" && (
              <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

                {/* Loading connection state */}
                {wcShareConnected === null && (
                  <div className="flex items-center justify-center py-10">
                    <span className="w-5 h-5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                  </div>
                )}

                {/* Not connected */}
                {wcShareConnected === false && (
                  <div className="text-center py-10 space-y-4">
                    <div className="text-3xl">🛍️</div>
                    <p className="text-white/60 text-sm">Connect WooCommerce in Settings → Integrations first</p>
                    <button
                      onClick={() => { setShareProject(null); setActiveNav("settings"); }}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
                    >
                      Go to Settings
                    </button>
                  </div>
                )}

                {/* Connected — show form */}
                {wcShareConnected === true && (
                  <>

                    {/* Success card */}
                    {wcProductUrl && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <p className="text-emerald-300 text-sm font-semibold">✓ Product published!</p>
                        <p className="text-[11px] text-emerald-400/70 truncate">{wcProductUrl}</p>
                        <a
                          href={wcProductUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                        >
                          View Product ↗
                        </a>
                      </div>
                    )}

                    {/* ── Images ── */}
                    <div>
                      <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">Featured Image</p>
                      <p className="text-[11px] text-white/30 mb-3">Click one image to set as featured</p>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {shareProject.images.map((img) => (
                          <button
                            key={img.id}
                            onClick={() => setWcFeaturedImage(img.imageUrl)}
                            className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                              wcFeaturedImage === img.imageUrl
                                ? "border-violet-500 scale-[1.02]"
                                : "border-white/10 hover:border-violet-500/40"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getImageUrl(img.imageUrl)} alt="" className="w-full h-full object-cover" />
                            {wcFeaturedImage === img.imageUrl && (
                              <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">Gallery Images</p>
                      <p className="text-[11px] text-white/30 mb-3">Check multiple images for the gallery</p>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {shareProject.images.map((img) => (
                          <button
                            key={img.id}
                            onClick={() =>
                              setWcGalleryImages((prev) =>
                                prev.includes(img.imageUrl)
                                  ? prev.filter((u) => u !== img.imageUrl)
                                  : [...prev, img.imageUrl]
                              )
                            }
                            className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                              wcGalleryImages.includes(img.imageUrl)
                                ? "border-violet-500"
                                : "border-white/10 hover:border-violet-500/40"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getImageUrl(img.imageUrl)} alt="" className="w-full h-full object-cover" />
                            {wcGalleryImages.includes(img.imageUrl) && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-violet-500 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── AI Content ── */}
                    <button
                      onClick={handleWcGenerateContent}
                      disabled={wcGeneratingContent}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        wcGeneratingContent
                          ? "bg-white/[0.04] text-white/30 cursor-not-allowed"
                          : "bg-violet-600 hover:bg-violet-500 text-white"
                      }`}
                    >
                      {wcGeneratingContent ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border border-white/40 border-t-white animate-spin" />
                          Generating…
                        </>
                      ) : "✨ Generate All with AI"}
                    </button>

                    {/* Product Title */}
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Product Title</label>
                      <input
                        type="text"
                        value={wcTitle}
                        onChange={(e) => setWcTitle(e.target.value)}
                        placeholder="e.g. Floral Summer Dress"
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"
                      />
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Short Description</label>
                      <textarea
                        value={wcShortDesc}
                        onChange={(e) => setWcShortDesc(e.target.value)}
                        rows={2}
                        placeholder="Brief product summary…"
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white resize-none"
                      />
                    </div>

                    {/* Full Description */}
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Full Description</label>
                      <textarea
                        value={wcDescription}
                        onChange={(e) => setWcDescription(e.target.value)}
                        rows={5}
                        placeholder="Detailed product description…"
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white resize-none"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Tags</label>
                      <input
                        type="text"
                        value={wcTags}
                        onChange={(e) => setWcTags(e.target.value)}
                        placeholder="fashion, party, dress"
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"
                      />
                      <p className="text-[10px] text-white/20 mt-1">Comma separated</p>
                    </div>

                    {/* ── Pricing ── */}
                    <div>
                      <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Pricing</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-white/40 mb-1.5 block">
                            Regular Price $ <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            value={wcPrice}
                            onChange={(e) => setWcPrice(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1.5 block">Sale Price $</label>
                          <input
                            type="number"
                            value={wcSalePrice}
                            onChange={(e) => setWcSalePrice(e.target.value)}
                            placeholder="Optional"
                            min="0"
                            step="0.01"
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Product Details ── */}
                    <div>
                      <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Product Details</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-white/40 mb-1.5 block">SKU</label>
                          <input
                            type="text"
                            value={wcSku}
                            onChange={(e) => setWcSku(e.target.value)}
                            placeholder="Optional"
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1.5 block">Stock Quantity</label>
                          <input
                            type="number"
                            value={wcStock}
                            onChange={(e) => setWcStock(parseInt(e.target.value) || 100)}
                            min="0"
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1.5 block">Category</label>
                          <select
                            value={wcCategoryId ?? ""}
                            onChange={(e) => setWcCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full bg-[#1c1c1c] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 text-white/70"
                          >
                            <option value="">Select category…</option>
                            {wcCategories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-2 block">Status</label>
                          <div className="flex gap-2">
                            {(["draft", "publish"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => setWcStatus(s)}
                                className={`px-5 py-1.5 rounded-full border text-xs font-medium transition-all ${
                                  wcStatus === s
                                    ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                    : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                                }`}
                              >
                                {s === "draft" ? "Draft" : "Publish"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Variations ── */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium">Variations</p>
                        <button
                          onClick={() => setWcEnableVariations(!wcEnableVariations)}
                          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                            wcEnableVariations ? "bg-violet-600" : "bg-white/[0.1]"
                          }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                            wcEnableVariations ? "left-5" : "left-0.5"
                          }`} />
                        </button>
                      </div>
                      <p className="text-[11px] text-white/30 mb-3">Add Size / Color Variations?</p>

                      {wcEnableVariations && (
                        <div className="space-y-3">
                          {/* Attribute cards */}
                          {wcAttributes.map((attr, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-white/80">{attr.name}</p>
                                <button
                                  onClick={() => setWcAttributes((prev) => prev.filter((_, i) => i !== idx))}
                                  className="text-white/30 hover:text-red-400 transition-colors"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {attr.values.map((v, vi) => (
                                  <span key={vi} className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
                                    {v}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}

                          {/* Add attribute button / inline form */}
                          {!wcAttrFormVisible ? (
                            <button
                              onClick={() => setWcAttrFormVisible(true)}
                              className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.1] text-xs text-white/40 hover:border-violet-500/40 hover:text-violet-400 transition-all"
                            >
                              + Add Attribute
                            </button>
                          ) : (
                            <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/5 space-y-3">
                              <div>
                                <label className="text-xs text-white/40 mb-1.5 block">Attribute Name</label>
                                <select
                                  value={wcAttrName}
                                  onChange={(e) => setWcAttrName(e.target.value)}
                                  className="w-full bg-[#1c1c1c] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 text-white/70"
                                >
                                  <option>Size</option>
                                  <option>Color</option>
                                  <option>Material</option>
                                  <option>Custom</option>
                                </select>
                              </div>
                              {wcAttrName === "Custom" && (
                                <div>
                                  <label className="text-xs text-white/40 mb-1.5 block">Custom Name</label>
                                  <input
                                    type="text"
                                    value={wcAttrCustomName}
                                    onChange={(e) => setWcAttrCustomName(e.target.value)}
                                    placeholder="e.g. Weight"
                                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"
                                  />
                                </div>
                              )}
                              <div>
                                <label className="text-xs text-white/40 mb-1.5 block">Values</label>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  {wcAttrValues.map((v, vi) => (
                                    <span key={vi} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
                                      {v}
                                      <button
                                        onClick={() => setWcAttrValues((prev) => prev.filter((_, i) => i !== vi))}
                                        className="text-violet-300/60 hover:text-red-400 leading-none"
                                      >×</button>
                                    </span>
                                  ))}
                                </div>
                                <input
                                  type="text"
                                  value={wcAttrValueInput}
                                  onChange={(e) => setWcAttrValueInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && wcAttrValueInput.trim()) {
                                      e.preventDefault();
                                      setWcAttrValues((prev) => [...prev, wcAttrValueInput.trim()]);
                                      setWcAttrValueInput("");
                                    }
                                  }}
                                  placeholder="Type value + Enter to add"
                                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const name = wcAttrName === "Custom" ? (wcAttrCustomName.trim() || "Custom") : wcAttrName;
                                    if (!wcAttrValues.length) return;
                                    setWcAttributes((prev) => [...prev, { name, values: wcAttrValues }]);
                                    setWcAttrFormVisible(false);
                                    setWcAttrName("Size");
                                    setWcAttrCustomName("");
                                    setWcAttrValues([]);
                                    setWcAttrValueInput("");
                                  }}
                                  disabled={wcAttrValues.length === 0}
                                  className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => {
                                    setWcAttrFormVisible(false);
                                    setWcAttrValues([]);
                                    setWcAttrValueInput("");
                                  }}
                                  className="px-4 py-2 rounded-lg border border-white/[0.07] text-sm text-white/50 hover:text-white transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Generate Combinations */}
                          {wcAttributes.length > 0 && (
                            <button
                              onClick={generateVariationCombinations}
                              className="w-full py-2.5 rounded-xl border border-white/[0.07] text-sm text-white/60 hover:text-white hover:border-violet-500/30 transition-colors"
                            >
                              Generate Combinations
                            </button>
                          )}

                          {/* Variations table */}
                          {wcVariations.length > 0 && (
                            <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                                    <th className="text-white/40 font-medium text-left px-3 py-2">Variation</th>
                                    <th className="text-white/40 font-medium text-left px-3 py-2">Stock</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {wcVariations.map((v, vi) => (
                                    <tr key={vi} className="border-b border-white/[0.04] last:border-0">
                                      <td className="px-3 py-2 text-white/60">
                                        {v.attributes.map((a) => a.option).join(" / ")}
                                      </td>
                                      <td className="px-3 py-2">
                                        <input
                                          type="number"
                                          value={v.stockQuantity}
                                          onChange={(e) =>
                                            setWcVariations((prev) =>
                                              prev.map((item, i) =>
                                                i === vi ? { ...item, stockQuantity: e.target.value } : item
                                              )
                                            )
                                          }
                                          className="w-16 bg-white/[0.03] border border-white/[0.07] rounded px-2 py-1 text-white/70 outline-none focus:border-violet-500/50"
                                          min="0"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Error */}
                    {wcPublishError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <p className="text-red-400 text-xs">{wcPublishError}</p>
                      </div>
                    )}

                    {/* Publish button */}
                    {!wcProductUrl && (
                      <button
                        disabled={wcPublishing || !wcPrice || !wcFeaturedImage}
                        onClick={handleWcPublish}
                        className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                          wcPublishing || !wcPrice || !wcFeaturedImage
                            ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
                            : "bg-violet-600 hover:bg-violet-500 text-white"
                        }`}
                      >
                        {wcPublishing
                          ? (wcPublishStep || "Publishing…")
                          : (!wcFeaturedImage
                            ? "Select a featured image first"
                            : !wcPrice
                              ? "Enter a price to publish"
                              : "Publish to WooCommerce →"
                          )
                        }
                      </button>
                    )}

                    {/* Bottom spacing */}
                    <div className="h-2" />

                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
