"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
type ReelTemplate = "ken-burns" | "zoom-out" | "pan-left" | "pan-right" | "fade-slideshow" | "cinematic" | "drift-up" | "pulse" | "multi-motion";
type MusicTrack = "track-1" | "track-2" | "custom";
type SharePlatform = "Instagram" | "Facebook" | "TikTok" | "Twitter";
type ClothingType = "stitched" | "unstitched";
type ToastType = "success" | "error" | "warning" | "info"
type Toast = { id: string; message: string; type: ToastType }

type ProjectImage = { id: string; imageUrl: string };
type ProjectUpload = { id: string; imageUrl: string };
type ProjectReel = { id: string; videoUrl: string };
type Project = {
  id: string;
  name: string;
  status: string;
  gender: string;
  ethnicity: string;
  occasion: string;
  prompt?: string | null;
  createdAt: string;
  uploads: ProjectUpload[];
  images: ProjectImage[];
  reels: ProjectReel[];
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
  { id: "clothing",      label: "Clothing & Apparel",    emoji: "" },
  { id: "shoes",         label: "Shoes & Footwear",      emoji: "" },
  { id: "jewelry",       label: "Jewelry & Accessories", emoji: "" },
  { id: "bags",          label: "Bags & Handbags",       emoji: "" },
  { id: "hats",          label: "Hats & Headwear",       emoji: "" },
  { id: "fabric-male",   label: "Fabric Male",           emoji: "" },
  { id: "fabric-female", label: "Fabric Female",         emoji: "" },
];

const FABRIC_STYLES: Record<"fabric-male" | "fabric-female", { id: string; label: string; emoji: string; desc?: string }[]> = {
  "fabric-male": [
    { id: "Shalwar Kameez",      label: "Shalwar Kameez",      emoji: "" },
    { id: "Kameez Pajama",       label: "Kameez Pajama",       emoji: "" },
    { id: "Italian Suit",        label: "Italian Suit",        emoji: "" },
    { id: "Blazer",              label: "Blazer",              emoji: "" },
    { id: "Sherwani",            label: "Sherwani",            emoji: "" },
    { id: "Simple Shirt",        label: "Simple Shirt",        emoji: "" },
    { id: "Waistcoat + Shalwar", label: "Waistcoat + Shalwar", emoji: "" },
    { id: "Kurta",               label: "Kurta",               emoji: "" },
    { id: "italian-with-tie",    label: "Italian Suit with Tie",    emoji: "", desc: "Classic Italian cut, formal tie"  },
    { id: "italian-without-tie", label: "Italian Suit without Tie", emoji: "", desc: "Smart casual, no tie"             },
    { id: "double-button",       label: "Double Breasted",          emoji: "", desc: "Double button formal suit"        },
    { id: "prince-suit",         label: "Prince Coat",              emoji: "", desc: "Traditional prince coat style"   },
    { id: "long-coat",           label: "Long Coat",                emoji: "", desc: "Elegant long coat style"         },
    { id: "italian-big-flaps",   label: "Italian Big Flaps",        emoji: "", desc: "Wide lapel Italian style"        },
  ],
  "fabric-female": [
    { id: "Shalwar Kameez", label: "Shalwar Kameez", emoji: "" },
    { id: "Gharara",        label: "Gharara",         emoji: "" },
    { id: "Lehenga",        label: "Lehenga",         emoji: "" },
    { id: "Anarkali",       label: "Anarkali",        emoji: "" },
    { id: "Maxi Dress",     label: "Maxi Dress",      emoji: "" },
    { id: "Co-ord Set",     label: "Co-ord Set",      emoji: "" },
    { id: "Saree",          label: "Saree",           emoji: "" },
    { id: "Kurti",          label: "Kurti",           emoji: "" },
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

const SUIT_STYLES: { id: string; label: string; icon: string; desc: string }[] = [
  { id: "italian-with-tie",     label: "Italian Suit with Tie",    icon: "", desc: "Classic Italian cut, formal tie"  },
  { id: "italian-without-tie",  label: "Italian Suit without Tie", icon: "", desc: "Smart casual, no tie"             },
  { id: "double-button",        label: "Double Breasted",          icon: "", desc: "Double button formal suit"        },
  { id: "prince-suit",          label: "Prince Coat",              icon: "", desc: "Traditional prince coat style"   },
  { id: "long-coat",            label: "Long Coat",                icon: "", desc: "Elegant long coat style"         },
  { id: "italian-big-flaps",    label: "Italian Big Flaps",        icon: "", desc: "Wide lapel Italian style"        },
];

const STITCHED_STYLES_MALE = [
  { id: "casual-shirt",        label: "Casual Shirt",       emoji: "" },
  { id: "shalwar-kameez",      label: "Shalwar Kameez",     emoji: "" },
  { id: "italian-suit",        label: "Italian Suit",       emoji: "" },
  { id: "blazer",              label: "Blazer",             emoji: "" },
  { id: "sherwani",            label: "Sherwani",           emoji: "" },
  { id: "kurta",               label: "Kurta",              emoji: "" },
  { id: "waistcoat-shalwar",   label: "Waistcoat + Shalwar",emoji: "" },
  { id: "double-breasted-suit",label: "Double Breasted",    emoji: "" },
  { id: "prince-coat",         label: "Prince Coat",        emoji: "" },
  { id: "long-coat",           label: "Long Coat",          emoji: "" },
];

const STITCHED_STYLES_FEMALE = [
  { id: "kurti",        label: "Kurti",         emoji: "" },
  { id: "shalwar-kameez",label: "Shalwar Kameez",emoji: "" },
  { id: "gharara",      label: "Gharara",       emoji: "" },
  { id: "lehenga",      label: "Lehenga",       emoji: "" },
  { id: "anarkali",     label: "Anarkali",      emoji: "" },
  { id: "maxi-dress",   label: "Maxi Dress",    emoji: "" },
  { id: "coord-set",    label: "Co-ord Set",    emoji: "" },
  { id: "saree",        label: "Saree",         emoji: "" },
];

const UNSTITCHED_STYLES_MALE = [
  { id: "shalwar-kameez-fabric",    label: "Shalwar Kameez",  emoji: "" },
  { id: "kurta-pajama-fabric",      label: "Kurta Pajama",    emoji: "" },
  { id: "casual-shirt-fabric",      label: "Casual Shirt",    emoji: "" },
  { id: "italian-suit-fabric",      label: "Italian Suit",    emoji: "" },
  { id: "double-breasted-fabric",   label: "Double Breasted", emoji: "" },
  { id: "prince-coat-fabric",       label: "Prince Coat",     emoji: "" },
  { id: "long-coat-fabric",         label: "Long Coat",       emoji: "" },
  { id: "sherwani-fabric",          label: "Sherwani",        emoji: "" },
  { id: "blazer-fabric",            label: "Blazer",          emoji: "" },
  { id: "waistcoat-fabric",         label: "Waistcoat + Shalwar", emoji: "" },
];

const UNSTITCHED_STYLES_FEMALE = [
  { id: "shalwar-kameez-fabric", label: "Shalwar Kameez", emoji: "" },
  { id: "gharara-fabric",        label: "Gharara",        emoji: "" },
  { id: "lehenga-fabric",        label: "Lehenga",        emoji: "" },
  { id: "anarkali-fabric",       label: "Anarkali",       emoji: "" },
  { id: "maxi-dress-fabric",     label: "Maxi Dress",     emoji: "" },
  { id: "coord-set-fabric",      label: "Co-ord Set",     emoji: "" },
  { id: "saree-fabric",          label: "Saree",          emoji: "" },
  { id: "kurti-fabric",          label: "Kurti",          emoji: "" },
];

const STEP_TITLES: Record<number, string> = {
  1:  "Upload your garment",
  2:  "Stitched or Unstitched?",
  3:  "Select Style",
  4:  "Age group",
  5:  "Gender & Ethnicity",
  6:  "Background",
  7:  "Occasion",
  8:  "Sides",
  9:  "Images per side",
  11: "Final Details",
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
  { id: "ken-burns",      name: "Ken Burns",     desc: "Smooth zoom in + diagonal pan",     icon: "" },
  { id: "zoom-out",       name: "Zoom Out",       desc: "Pulls back with subtle rotation",   icon: "" },
  { id: "pan-left",       name: "Pan Left",       desc: "Eased pan with gentle zoom",        icon: "" },
  { id: "pan-right",      name: "Pan Right",      desc: "Eased pan with gentle zoom",        icon: "" },
  { id: "fade-slideshow", name: "Fade Slideshow", desc: "Multiple images with fade",         icon: "" },
  { id: "cinematic",      name: "Cinematic",      desc: "Letterbox + vignette + Ken Burns",  icon: "" },
  { id: "drift-up",       name: "Drift Up",       desc: "Slow upward float + gentle zoom",   icon: "" },
  { id: "pulse",          name: "Pulse",          desc: "Rhythmic scale pulse, 2 beats",     icon: "" },
  { id: "multi-motion",   name: "Multi Motion",   desc: "3 different motions from 1 image",   icon: "" },
];

const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const MUSIC_TRACKS: { id: Exclude<MusicTrack, "custom">; label: string; src: string }[] = [
  { id: "track-1", label: "Fashion Cinematic", src: "/music/track-1.mp3" },
  { id: "track-2", label: "Editorial Luxury",  src: "/music/track-2.mp3" },
];

const AI_VIDEO_CREDITS: Record<string, number> = {
  "480p":  2,
  "720p":  6,
  "1080p": 12,
};

const SHARE_PLATFORMS: { id: SharePlatform; name: string; icon: string; hint: string }[] = [
  { id: "Instagram", name: "Instagram", icon: "", hint: "Caption copied + open app" },
  { id: "Facebook",  name: "Facebook",  icon: "", hint: "Share via Facebook"        },
  { id: "TikTok",    name: "TikTok",    icon: "", hint: "Caption copied + open app" },
  { id: "Twitter",   name: "Twitter",   icon: "", hint: "Share via Twitter / X"     },
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
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }
  if (url.startsWith("/uploads/") || url.startsWith("/generated/")) {
    return `https://dripshoots.com${url}`
  }
  return url
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function buildClientPrompt(
  category: string,
  gender: string,
  ethnicity: string,
  occasion: string,
  ageGroup: string,
  background: string,
  fabricStyle?: string | null,
  suitStyle?: string | null,
  clothingType?: string,
): string {
  const AGE_LABEL: Record<string, string> = {
    adult:       `${ethnicity} adult ${gender} model`,
    teen:        `${ethnicity} teen ${gender} model, approximately 15 years old`,
    "kids-6-12": `${ethnicity} child ${gender} model, approximately 9 years old`,
    "kids-2-5":  `${ethnicity} young child ${gender} model, approximately 3 years old`,
    toddler:     `${ethnicity} toddler model, approximately 1 year old`,
  };

  const ageLabel = AGE_LABEL[ageGroup] ?? `${ethnicity} ${gender} model`;
  const bgLower  = background.toLowerCase();
  const occLower = occasion.toLowerCase();

  if (clothingType === "unstitched" && fabricStyle) {
    const styleName = fabricStyle.replace(/-fabric$/, "").replace(/-/g, " ");
    return `${ageLabel}, wearing a ${styleName} made from this fabric, ${occLower} setting, ${bgLower} background, South Asian fashion photography, professional fashion photography, high quality`;
  }

  if (clothingType === "stitched" && fabricStyle) {
    const styleName = fabricStyle.replace(/-/g, " ");
    return `${ageLabel}, wearing a ${styleName}, ${occLower} setting, ${bgLower} background, fashion clothing photography, professional fashion photography, high quality`;
  }

  // suitStyle fallback (legacy / unused path)
  const suitStr = suitStyle ? `, wearing a ${suitStyle.replace(/-/g, " ")} suit` : "";
  void category;
  return `${ageLabel}${suitStr}, ${occLower} setting, ${bgLower} background, fashion clothing photography, professional fashion photography, high quality`;
}

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
  const [activeProjectTab, setActiveProjectTab] = useState<Record<string, string>>({});
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
  const [clothingType, setClothingType] = useState<ClothingType | null>(null);
  const [clothingStyle, setClothingStyle] = useState<string | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [fabricStyle, setFabricStyle] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [background, setBackground] = useState<Background | null>(null);
  const [sides, setSides] = useState<Side[]>(["front"]);
  const [numImages, setNumImages] = useState(1);
  const [quality, setQuality] = useState("standard");
  const [suitStyle, setSuitStyle] = useState("");
  const [addVideo, setAddVideo] = useState(false);
  const [selectedVideoImage, setSelectedVideoImage] = useState<string | null>(null);
  const [canvasSelectedImages, setCanvasSelectedImages] = useState<string[]>([]);
  const [reelMode, setReelMode] = useState<"fashn" | "canvas">("fashn");
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
  const [editablePrompt, setEditablePrompt] = useState("");
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [aiVideoImages, setAiVideoImages] = useState<string[]>([]);
  const [aiVideoDuration] = useState<number>(10);
  const [aiVideoResolution, setAiVideoResolution] = useState<"480p" | "720p" | "1080p">("720p");
  const [aiVideoGenerating, setAiVideoGenerating] = useState(false);
  const [aiVideoProgress, setAiVideoProgress] = useState(0);
  const [aiVideoOutputUrls, setAiVideoOutputUrls] = useState<string[]>([]);
  const [aiVideoError, setAiVideoError] = useState<string | null>(null);
  const [showVideoPromptPreview, setShowVideoPromptPreview] = useState(false);
  const [showThirdImageAlert, setShowThirdImageAlert] = useState(false);
  const pendingVideoImageRef = useRef<string | null>(null);

  // ── WooCommerce / Integrations state ──────────────────────────────────────
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState<"integrations" | "branding" | "shopify" | "woocommerce">("integrations")
  const [shopifyConnected, setShopifyConnected] = useState(false)
  const [shopifyForm, setShopifyForm] = useState({ siteUrl: "", accessToken: "" })
  const [shopifyConnecting, setShopifyConnecting] = useState(false)
  const [shopifyError, setShopifyError] = useState("")
  const [shopifyShowToken, setShopifyShowToken] = useState(false)
  const [wcConnected, setWcConnected]             = useState(false);
  const [wcForm, setWcForm]                       = useState({ siteUrl: "", consumerKey: "", consumerSecret: "", appPassword: "" });
  const [wcConnecting, setWcConnecting]           = useState(false);
  const [wcError, setWcError]                     = useState("");
  const [wcShowSecret, setWcShowSecret]           = useState(false);
  const [wcShowAppPw, setWcShowAppPw]             = useState(false);

  // ── WooCommerce Share Modal state ─────────────────────────────────────────
  const [shareTab, setShareTab]                           = useState<"social" | "woocommerce" | "shopify">("social");
  const [shopifyShareConnected, setShopifyShareConnected] = useState<boolean | null>(null)
  const [shopifyTitle, setShopifyTitle]                   = useState("")
  const [shopifyDescription, setShopifyDescription]       = useState("")
  const [shopifyPrice, setShopifyPrice]                   = useState("")
  const [shopifyTags, setShopifyTags]                     = useState("")
  const [shopifyStatus, setShopifyStatus]                 = useState<"draft" | "active">("draft")
  const [shopifyImages, setShopifyImages]                 = useState<string[]>([])
  const [shopifyPublishing, setShopifyPublishing]         = useState(false)
  const [shopifyProductUrl, setShopifyProductUrl]         = useState("")
  const [shopifyPublishError, setShopifyPublishError]     = useState("")
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

  // ── Toast state ──────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // ── Branding state ────────────────────────────────────────────────────────
  const [brandingLogoUrl, setBrandingLogoUrl] = useState<string | null>(null)
  const [brandingPosition, setBrandingPosition] = useState("south_east")
  const [brandingSize, setBrandingSize] = useState(150)
  const [brandingOpacity, setBrandingOpacity] = useState(70)
  const [brandingUploading, setBrandingUploading] = useState(false)
  const [brandingSaved, setBrandingSaved] = useState(false)
  const [brandingPreviewUrl, setBrandingPreviewUrl] = useState<string | null>(null)
  const [brandingPreviewing, setBrandingPreviewing] = useState(false)
  const brandingFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then(setCreditInfo)
      .catch(() => showToast("Failed to load credit info.", "warning"));
  }, []);

  useEffect(() => {
    if (activeNav !== "projects") return;
    setProjectsLoading(true);
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => { setProjects(d.projects ?? []); setProjectsPage(1); })
      .catch(() => { setProjects([]); showToast("Failed to load projects.", "error"); })
      .finally(() => setProjectsLoading(false));
  }, [activeNav]);

  // Load branding settings when Settings tab is opened
  useEffect(() => {
    if (activeNav !== "settings") return
    fetch("/api/settings/branding")
      .then(r => r.json())
      .then(data => {
        if (data.brandingLogoUrl) setBrandingLogoUrl(data.brandingLogoUrl)
        if (data.brandingPosition) setBrandingPosition(data.brandingPosition)
        if (data.brandingSize) setBrandingSize(data.brandingSize)
        if (data.brandingOpacity) setBrandingOpacity(data.brandingOpacity)
      })
      .catch(() => {})
  }, [activeNav])

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
    fetch("/api/settings/shopify")
      .then(r => r.json())
      .then(data => {
        if (data.connected) {
          setShopifyConnected(true)
          setShopifyForm(f => ({ ...f, siteUrl: data.shopifySiteUrl }))
        }
      })
      .catch(() => {})
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

  // Check Shopify connection when Shopify share tab is first opened
  useEffect(() => {
    if (shareTab !== "shopify" || !shareProject || shopifyShareConnected !== null) return
    fetch("/api/settings/shopify")
      .then(r => r.json())
      .then(data => setShopifyShareConnected(!!data.connected))
      .catch(() => setShopifyShareConnected(false))
  }, [shareTab, shareProject, shopifyShareConnected])

  useEffect(() => {
    if (wizardStep === 11 && gender && ethnicity && occasion && ageGroup && background) {
      setEditablePrompt(buildClientPrompt(
        "clothing", gender, ethnicity, occasion, ageGroup, background,
        clothingType === "unstitched" ? clothingStyle : null,
        clothingType === "stitched" ? clothingStyle : null,
        clothingType || "stitched",
      ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardStep]);

  useEffect(() => {
    if (reelTemplate === "multi-motion") setReelDuration(15);
  }, [reelTemplate]);

  useEffect(() => {
    if (results?.length === 1) setReelTemplate("multi-motion");
  }, [results]);

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
      if (res.ok) {
        setUploadedUrl(data.url);
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast("Upload failed. Please try again.", "error");
      }
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
        body: JSON.stringify({ garmentImageUrl: uploadedUrl, gender, ethnicity, occasion, ageGroup, category: "clothing", background, sides, numImages, quality: "standard", fabricStyle: clothingStyle, clothingType, customPrompt: editablePrompt || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "insufficient_credits") {
          showToast(`Not enough credits. Need ${data.required}, have ${data.available}. Please upgrade.`, "error")
        } else if (data.error?.includes("not found")) {
          showToast("Image not found. Please upload your garment again.", "error")
        } else if (data.error?.includes("FASHN")) {
          showToast("AI generation failed. Please try again in a moment.", "error")
        } else {
          showToast(data.error || "Generation failed. Please try again.", "error")
        }
        return
      }

      setProgressPct(100);
      await new Promise((r) => setTimeout(r, 450));
      setResults(data.images);
      showToast(`${data.images.length} images generated successfully!`, "success")
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
      showToast("Images downloaded successfully!", "success")
    } catch {
      showToast("Download failed. Please try again.", "error")
    } finally {
      setDownloadingProjectId(null);
    }
  };

  const handleEditAndRegenerate = (project: Project) => {
    const garmentUrl = project.uploads[0]?.imageUrl;
    if (!garmentUrl) return;
    showToast("Project loaded for editing.", "info");
    setUploadedUrl(garmentUrl);
    setUploaded(garmentUrl);
    setGender(project.gender as GenderType);
    setEthnicity(project.ethnicity as (typeof ETHNICITIES)[number]);
    setOccasion(project.occasion as (typeof OCCASIONS)[number]);
    setResults(null);
    setGenerating(false);
    setProgressPct(0);
    setProgressMsg(0);
    setClothingType(null);
    setClothingStyle(null);
    setCategory(null);
    setFabricStyle(null);
    setAgeGroup(null);
    setBackground(null);
    setSides(["front"]);
    setNumImages(1);
    setQuality("standard");
    setSuitStyle("");
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
    // Reset Shopify share state
    setShopifyShareConnected(null)
    setShopifyTitle("")
    setShopifyDescription("")
    setShopifyPrice("")
    setShopifyTags("")
    setShopifyStatus("draft")
    setShopifyImages([])
    setShopifyPublishing(false)
    setShopifyProductUrl("")
    setShopifyPublishError("")
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
      if (data.caption) {
        setShareCaption(data.caption);
        showToast("Caption generated!", "success");
      }
    } catch {
      showToast("Failed to generate caption. Please try again.", "error");
    } finally {
      setShareCaptionLoading(false);
    }
  };

  const handleCopyCaption = () => {
    if (!shareCaption) return;
    navigator.clipboard.writeText(shareCaption).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
    showToast("Caption copied to clipboard!", "success");
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
        showToast("Product published to WooCommerce!", "success");
      } else {
        setWcPublishError(data.error ?? "Something went wrong.");
        showToast(data.error ?? "Failed to publish to WooCommerce.", "error");
      }
    } catch {
      setWcPublishError("Request failed. Please try again.");
      showToast("Request failed. Please try again.", "error");
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

  const handleGenerateAiVideo = async () => {
    if (!aiVideoImages.length) return;
    setAiVideoGenerating(true);
    setAiVideoProgress(0);
    setAiVideoOutputUrls([]);

    let prog = 0;
    const timer = setInterval(() => {
      prog = Math.min(prog + 1.5, 90);
      setAiVideoProgress(Math.round(prog));
    }, 1000);

    try {
      const outputs: string[] = [];

      // Reel 1: image 1 (start) + image 2 (end) if exists
      const res1 = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: aiVideoImages[0],
          endImageUrl: aiVideoImages.length >= 2 ? aiVideoImages[1] : undefined,
          duration: 10,
          resolution: aiVideoResolution,
        }),
      });
      const data1 = await res1.json();
      if (data1.videoUrl) {
        outputs.push(data1.videoUrl);
        if (selectedMusicTrack && data1.videoUrl) {
          const muxed = await muxAiVideoWithAudio(data1.videoUrl);
          outputs[outputs.length - 1] = muxed;
        }
      }

      // Reel 2: if 3rd image exists, generate separate reel
      if (aiVideoImages.length === 3) {
        setAiVideoProgress(50);
        const res2 = await fetch("/api/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: aiVideoImages[2],
            duration: 10,
            resolution: aiVideoResolution,
          }),
        });
        const data2 = await res2.json();
        if (data2.videoUrl) {
          outputs.push(data2.videoUrl);
          if (selectedMusicTrack && data2.videoUrl) {
            const muxed = await muxAiVideoWithAudio(data2.videoUrl);
            outputs[outputs.length - 1] = muxed;
          }
        }
      }

      clearInterval(timer);
      setAiVideoProgress(100);
      setAiVideoOutputUrls(outputs);
      if (outputs.length > 0) {
        showToast("Video reel generated successfully!", "success");
      } else {
        showToast("Video generation failed. Please try again.", "error");
      }
    } catch {
      showToast("Request failed. Please try again.", "error");
    } finally {
      clearInterval(timer);
      setAiVideoGenerating(false);
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
    setWizardStep(1);
    setClothingType(null);
    setClothingStyle(null);
    setCategory(null);
    setFabricStyle(null);
    setAgeGroup(null);
    setBackground(null);
    setSides(["front"]);
    setNumImages(1);
    setQuality("standard");
    setSuitStyle("");
    setAddVideo(false);
    setSelectedVideoImage(null);
    setCanvasSelectedImages([]);
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
    setEditingProjectName(null);
    setShowCropTool(false);
    setCropSide(null);
    setAiVideoImages([]);
    setAiVideoOutputUrls([]);
    setAiVideoProgress(0);
    setAiVideoGenerating(false);
    setAiVideoError(null);
    setShowVideoPromptPreview(false);
    setShowThirdImageAlert(false);
    pendingVideoImageRef.current = null;
    setReelMode("fashn");
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

  const muxAiVideoWithAudio = (videoUrl: string): Promise<string> => {
    const musicSrc = getMusicSrc();
    if (!musicSrc) return Promise.resolve(videoUrl);

    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.preload = "auto";

      video.onloadedmetadata = () => {
        try {
          const audioCtx = new AudioContext();
          const dest = audioCtx.createMediaStreamDestination();

          const musicAudio = new Audio();
          musicAudio.src = musicSrc;
          musicAudio.loop = true;
          musicAudio.crossOrigin = "anonymous";

          const musicSource = audioCtx.createMediaElementSource(musicAudio);
          musicSource.connect(dest);

          const videoStream = (video as unknown as { captureStream?: () => MediaStream }).captureStream?.();
          if (!videoStream) { audioCtx.close(); resolve(videoUrl); return; }

          const combined = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...dest.stream.getAudioTracks(),
          ]);

          const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
            ? "video/webm;codecs=vp9,opus"
            : "video/webm";
          const recorder = new MediaRecorder(combined, { mimeType });
          const chunks: Blob[] = [];

          recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            resolve(URL.createObjectURL(blob));
            audioCtx.close();
          };

          musicAudio.play().catch(() => {});
          video.play().catch(() => {});
          recorder.start();

          setTimeout(() => {
            recorder.stop();
            video.pause();
            musicAudio.pause();
            musicAudio.src = "";
          }, (video.duration + 0.5) * 1000);
        } catch {
          resolve(videoUrl);
        }
      };

      video.onerror = () => resolve(videoUrl);
    });
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
      : reelTemplate === "multi-motion"
        ? [results[0]]
        : canvasSelectedImages.length > 0
          ? canvasSelectedImages
          : [results[0]];

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

      // For multi-image canvas, pick which image to show based on time
      const activeImg = (reelTemplate !== "fade-slideshow" && reelTemplate !== "multi-motion" && imgs.length > 1)
        ? imgs[Math.floor(t * imgs.length) % imgs.length]
        : imgs[0];

      if (reelTemplate === "ken-burns") {
        const scale = 1 + 0.2 * e;
        const tx = -0.03 * e * W;
        const ty = -0.02 * e * H;
        const dw = W * scale, dh = H * scale;
        drawCovered(activeImg, (W - dw) / 2 + tx, (H - dh) / 2 + ty, dw, dh);
      } else if (reelTemplate === "zoom-out") {
        const scale = 1.3 - 0.3 * e;
        const angle = (0.5 - 0.5 * e) * Math.PI / 180;
        const dw = W * scale, dh = H * scale;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.rotate(angle);
        ctx.translate(-W / 2, -H / 2);
        drawCovered(activeImg, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.restore();
      } else if (reelTemplate === "pan-left") {
        const scale = 1.05 - 0.05 * e;
        const tx = (0.08 - 0.16 * e) * W;
        const dw = W * scale, dh = H * scale;
        drawCovered(activeImg, (W - dw) / 2 + tx, (H - dh) / 2, dw, dh);
      } else if (reelTemplate === "pan-right") {
        const scale = 1.05 - 0.05 * e;
        const tx = (-0.08 + 0.16 * e) * W;
        const dw = W * scale, dh = H * scale;
        drawCovered(activeImg, (W - dw) / 2 + tx, (H - dh) / 2, dw, dh);
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
        drawCovered(activeImg, (W - dw) / 2 + tx, (H - dh) / 2 + ty, dw, dh);
        drawVignette();
        const barH = Math.round(H * 0.15);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, barH);
        ctx.fillRect(0, H - barH, W, barH);
      } else if (reelTemplate === "drift-up") {
        const scale = 1.1 - 0.1 * e;
        const ty = (0.05 - 0.1 * e) * H;
        const dw = W * scale, dh = H * scale;
        drawCovered(activeImg, (W - dw) / 2, (H - dh) / 2 + ty, dw, dh);
      } else if (reelTemplate === "pulse") {
        const scale = 1 + 0.05 * Math.sin(t * Math.PI * 4);
        const dw = W * scale, dh = H * scale;
        drawCovered(activeImg, (W - dw) / 2, (H - dh) / 2, dw, dh);
      } else if (reelTemplate === "multi-motion") {
        const segment = Math.min(Math.floor(t * 3), 2);
        const segT = easeInOut((t * 3) % 1);
        const img = imgs[0];
        if (segment === 0) {
          const scale = 1 + 0.2 * segT;
          const tx = -0.03 * segT * W;
          const ty = -0.02 * segT * H;
          const dw = W * scale, dh = H * scale;
          drawCovered(img, (W - dw) / 2 + tx, (H - dh) / 2 + ty, dw, dh);
        } else if (segment === 1) {
          const scale = 1.3 - 0.3 * segT;
          const dw = W * scale, dh = H * scale;
          drawCovered(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
        } else {
          const scale = 1.1 - 0.1 * segT;
          const ty = (0.05 - 0.1 * segT) * H;
          const dw = W * scale, dh = H * scale;
          drawCovered(img, (W - dw) / 2, (H - dh) / 2 + ty, dw, dh);
        }
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
    showToast("Images downloaded successfully!", "success");
  };

  const stepSequence = [1, 2, 4, 5, 3, 6, 7, 8, 9, 11];

  const totalSteps = stepSequence.length;
  const displayStep = Math.max(1, stepSequence.indexOf(wizardStep) + 1);

  const handleNext = () => {
    if (wizardStep === 1)      setWizardStep(2);
    else if (wizardStep === 2) setWizardStep(4);
    else if (wizardStep === 4) setWizardStep(5);
    else if (wizardStep === 5) setWizardStep(3);
    else if (wizardStep === 3) setWizardStep(6);
    else if (wizardStep === 6) setWizardStep(7);
    else if (wizardStep === 7) setWizardStep(8);
    else if (wizardStep === 8) setWizardStep(9);
    else if (wizardStep === 9) setWizardStep(11);
  };

  const handleBack = () => {
    if (wizardStep === 2)       setWizardStep(1);
    else if (wizardStep === 4)  setWizardStep(2);
    else if (wizardStep === 5)  setWizardStep(4);
    else if (wizardStep === 3)  setWizardStep(5);
    else if (wizardStep === 6)  setWizardStep(3);
    else if (wizardStep === 7)  setWizardStep(6);
    else if (wizardStep === 8)  setWizardStep(7);
    else if (wizardStep === 9)  setWizardStep(8);
    else if (wizardStep === 11) setWizardStep(9);
  };

  const isStepValid = (() => {
    switch (wizardStep) {
      case 1: return !!uploadedUrl && !uploading;
      case 2: return !!clothingType;
      case 4: return !!ageGroup;
      case 5: return !!gender && !!ethnicity;
      case 3: return !!clothingStyle;
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
              <span className="text-xs text-white/50">Credits</span>
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
      <main className="pt-[57px] md:ml-64 min-h-screen flex flex-col relative z-10 pb-28 md:pb-0">
        <div className="flex-1 overflow-y-auto">

          {/* ── Wizard ── */}
          {activeNav === "upload" && !generating && !results && (
            <Container className="py-6 sm:py-10">
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
              <div className="mb-6 sm:mb-8">
                <div className="flex gap-1 mb-3 sm:mb-4">
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
                <h1 className="text-xl sm:text-2xl font-bold">{STEP_TITLES[wizardStep]}</h1>
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
                        We detected both front and back sides in your image. Please select which side to use:
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
                    Tip: Upload front view only for best results. If your image has both sides, we will detect it automatically.
                  </p>
                </div>
              )}

              {/* ── Step 2: Stitched or Unstitched ── */}
              {wizardStep === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setClothingType("stitched"); setClothingStyle(null); }}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                      clothingType === "stitched"
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-violet-500/40"
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-semibold text-sm">Stitched</p>
                      <p className="text-xs text-white/40 mt-1">Ready to wear garment</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setClothingType("unstitched"); setClothingStyle(null); }}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                      clothingType === "unstitched"
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-violet-500/40"
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-semibold text-sm">Unstitched</p>
                      <p className="text-xs text-white/40 mt-1">Fabric - select style</p>
                    </div>
                  </button>
                </div>
              )}

              {/* ── Step 3: Style selector ── */}
              {wizardStep === 3 && gender && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(() => {
                    const styles = clothingType === "stitched"
                      ? (gender === "male" ? STITCHED_STYLES_MALE : STITCHED_STYLES_FEMALE)
                      : (gender === "male" ? UNSTITCHED_STYLES_MALE : UNSTITCHED_STYLES_FEMALE);
                    return styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setClothingStyle(style.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                          clothingStyle === style.id
                            ? "border-violet-500 bg-violet-500/10 text-violet-300"
                            : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-violet-500/40"
                        }`}
                      >
                        <span className="text-xs font-medium text-center leading-tight">{style.label}</span>
                      </button>
                    ));
                  })()}
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
              {wizardStep === 8 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SIDES_BY_CATEGORY["clothing"].map((side) => {
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

              {/* ── Step 11: Final Details (prompt) ── */}
              {wizardStep === 11 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white/70">AI Prompt (editable)</h3>
                      <button
                        onClick={() => setEditablePrompt(buildClientPrompt(
                          "clothing", gender!, ethnicity!, occasion!, ageGroup!, background!,
                          clothingType === "unstitched" ? clothingStyle : null,
                          clothingType === "stitched" ? clothingStyle : null,
                          clothingType!,
                        ))}
                        className="text-xs text-violet-400 hover:text-violet-300"
                      >
                        Reset
                      </button>
                    </div>
                    <textarea
                      value={editablePrompt}
                      onChange={(e) => setEditablePrompt(e.target.value)}
                      rows={5}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    <p className="text-xs text-white/40">
                      Add custom details: &ldquo;add white boot cut trousers&rdquo;, &ldquo;make model sit on chair&rdquo;, &ldquo;holding a coffee cup&rdquo;, etc.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Navigation buttons ── */}
              <div className="flex gap-3 mt-8">
                {wizardStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="px-5 py-3 rounded-xl border border-white/[0.07] text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
                  >
                    Back
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
                    Next
                  </button>
                ) : (
                  <button
                    disabled={!uploadedUrl || !gender || !ethnicity || !occasion}
                    onClick={() => setShowPromptPreview(true)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:bg-white/[0.04] disabled:text-white/20 disabled:cursor-not-allowed"
                  >
                    <span>Generate</span>
                    <span className="ml-2 text-violet-300 text-xs font-normal">{numImages * sides.length} credits</span>
                  </button>
                )}
              </div>
            </Container>
          )}

          {/* ── Generating / Loading ── */}
          {activeNav === "upload" && generating && (
            <Container className="py-6 sm:py-10">
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
            <Container className="py-6 sm:py-10">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
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
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
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
                        <button onClick={() => setReelMode("fashn")}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${reelMode === "fashn" ? "bg-violet-600 text-white" : "text-white/40 hover:text-white/70"}`}>
                          AI Video
                        </button>
                        <button onClick={() => setReelMode("canvas")}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${reelMode === "canvas" ? "bg-violet-600 text-white" : "text-white/40 hover:text-white/70"}`}>
                          Canvas Reel
                        </button>
                      </div>

                      {/* ── AI Video section ── */}
                      {reelMode === "fashn" && <>

                        {/* Image selector */}
                        <div>
                          <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Choose images</p>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {results.map((url, i) => (
                              <button key={i}
                                onClick={() => {
                                  if (aiVideoImages.includes(url)) {
                                    setAiVideoImages(prev => prev.filter(u => u !== url));
                                    setShowThirdImageAlert(false);
                                    return;
                                  }
                                  if (aiVideoImages.length === 2) {
                                    pendingVideoImageRef.current = url;
                                    setShowThirdImageAlert(true);
                                    return;
                                  }
                                  setAiVideoImages(prev => [...prev, url]);
                                }}
                                className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                                  aiVideoImages.includes(url) ? "border-violet-500 scale-[1.02]" : "border-white/10 hover:border-violet-500/40"
                                }`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                                {aiVideoImages.includes(url) && (
                                  <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                      aiVideoImages.indexOf(url) === 0
                                        ? "bg-violet-500 text-white"
                                        : aiVideoImages.indexOf(url) === 1
                                        ? "bg-fuchsia-500 text-white"
                                        : "bg-amber-500 text-white"
                                    }`}>
                                      {aiVideoImages.indexOf(url) === 0 ? "START" : aiVideoImages.indexOf(url) === 1 ? "END" : "EXTRA"}
                                    </span>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-white/30 mt-2">Select up to 3 images — 1st is start frame, 2nd is end frame, 3rd generates a second reel</p>
                        </div>

                        {/* Resolution */}
                        {!aiVideoOutputUrls.length && (
                          <div>
                            <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Resolution</p>
                            <div className="flex gap-2 flex-wrap">
                              {(["480p", "720p", "1080p"] as const).map((res) => (
                                <button key={res} onClick={() => setAiVideoResolution(res)}
                                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                                    aiVideoResolution === res
                                      ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                      : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                                  }`}>
                                  {res}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Music selector */}
                        {!aiVideoOutputUrls.length && (
                          <div>
                            <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">
                              Music <span className="normal-case text-white/20">(optional)</span>
                            </p>
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
                                    <p className="text-[10px] text-white/30 mt-0.5">
                                      {(customMusicFile.size / 1024 / 1024).toFixed(1)} MB
                                    </p>
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
                        )}

                        {/* Generate button + progress */}
                        {!aiVideoOutputUrls.length && (
                          <div>
                            <button
                              disabled={!aiVideoImages.length || aiVideoGenerating}
                              onClick={() => setShowVideoPromptPreview(true)}
                              className={`w-full py-3.5 rounded-xl text-sm font-medium transition-colors ${
                                aiVideoImages.length && !aiVideoGenerating
                                  ? "bg-violet-600 hover:bg-violet-500 text-white"
                                  : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                              }`}
                            >
                              {aiVideoGenerating
                                ? "Generating…"
                                : <>
                                    {aiVideoImages.length === 3 ? "Generate 2 Reels" : "Generate AI Reel"}
                                    {aiVideoImages.length > 0 && (
                                      <span className="text-xs text-violet-300 ml-1">
                                        ({aiVideoImages.length === 3
                                          ? `${AI_VIDEO_CREDITS[aiVideoResolution] * 2} credits`
                                          : `${AI_VIDEO_CREDITS[aiVideoResolution]} credits`})
                                      </span>
                                    )}
                                  </>
                              }
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
                                  <span>Generating…</span>
                                  <span>{aiVideoProgress}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Video outputs */}
                        {aiVideoOutputUrls.length > 0 && (
                          <div className="space-y-4">
                            {aiVideoOutputUrls.map((url, i) => (
                              <div key={i} className="space-y-2">
                                <p className="text-xs text-white/40">Reel {i + 1}</p>
                                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                                <video src={url} controls autoPlay loop className="w-full rounded-2xl bg-black" />
                                <a
                                  href={url}
                                  download={`dripshoots-reel-${i + 1}.mp4`}
                                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                                >
                                  <DownloadIcon /> Download Reel {i + 1}
                                </a>
                              </div>
                            ))}
                            <button
                              onClick={() => { setAiVideoOutputUrls([]); setAiVideoProgress(0); setAiVideoError(null); }}
                              className="w-full py-2.5 rounded-xl text-sm font-medium border border-white/[0.07] text-white/60 hover:text-white transition-colors"
                            >
                              ← Generate Again
                            </button>
                          </div>
                        )}

                      </>}

                      {/* ── Canvas section ── */}
                      {reelMode === "canvas" && <>

                        {/* Hidden music file input */}
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

                        {/* Format selector */}
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

                        {/* Template selector */}
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
                                <p className={`text-xs font-semibold ${reelTemplate === tpl.id ? "text-violet-300" : "text-white/80"}`}>
                                  {tpl.name}
                                </p>
                                <p className="text-[10px] text-white/40 leading-relaxed">{tpl.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 1-image hint */}
                        {results.length === 1 && (
                          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
                            1 image detected — Multi Motion template creates a dynamic reel using 3 different camera movements.
                          </div>
                        )}

                        {/* Image selector */}
                        <div>
                          <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">
                            {reelTemplate === "fade-slideshow" || reelTemplate === "multi-motion" ? "Images" : "Choose image"}
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
                          ) : reelTemplate === "multi-motion" ? (
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-violet-500/30 bg-violet-500/5">
                              <div className="w-9 h-12 rounded-lg overflow-hidden border border-violet-500/30 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={results[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-violet-300 font-medium">First image used with 3 motion segments</p>
                            </div>
                          ) : (
                            <div>
                              <div className="flex gap-3 overflow-x-auto pb-2">
                                {results.map((url, i) => {
                                  const idx = canvasSelectedImages.indexOf(url)
                                  const isSelected = idx !== -1
                                  return (
                                    <button
                                      key={i}
                                      onClick={() => {
                                        if (isSelected) {
                                          setCanvasSelectedImages(prev => prev.filter(u => u !== url))
                                        } else {
                                          setCanvasSelectedImages(prev => [...prev, url])
                                        }
                                      }}
                                      className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                                        isSelected ? "border-violet-500 scale-[1.02]" : "border-white/10 hover:border-violet-500/40"
                                      }`}
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                                      {isSelected && (
                                        <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-[9px] font-bold text-white">
                                            {idx + 1}
                                          </div>
                                        </div>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                              <p className="text-xs text-white/30 mt-2">
                                {canvasSelectedImages.length === 0
                                  ? "Select one or more images — they will play in sequence"
                                  : `${canvasSelectedImages.length} image${canvasSelectedImages.length > 1 ? "s" : ""} selected — tap to reorder by deselecting and reselecting`}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Duration selector */}
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

                        {/* Brand name input */}
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
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-medium ${
                                selectedMusicTrack === null ? "bg-violet-500/20 text-violet-300" : "bg-white/[0.05] text-white/40"
                              }`}>Off</div>
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
                            <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              selectedMusicTrack === "custom"
                                ? "border-violet-500 bg-violet-500/10"
                                : "border-white/[0.07] bg-white/[0.03]"
                            }`}>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                selectedMusicTrack === "custom" ? "bg-violet-500/20" : "bg-white/[0.05]"
                              }`}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selectedMusicTrack === "custom" ? "text-violet-300" : "text-white/40"}>
                                  <path d="M9 18V5l12-2v13"/>
                                  <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                                </svg>
                              </div>
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

                        {/* Render button + progress */}
                        {!reelOutputUrl && (
                          <div>
                            <button
                              disabled={reelRendering || (reelTemplate !== "fade-slideshow" && reelTemplate !== "multi-motion" && canvasSelectedImages.length === 0)}
                              onClick={renderReel}
                              className={`w-full py-3.5 rounded-xl text-sm font-medium transition-colors ${
                                !reelRendering && (reelTemplate === "fade-slideshow" || reelTemplate === "multi-motion" || canvasSelectedImages.length > 0)
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

                        {/* Video preview + Download */}
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
            <Container className="py-6 sm:py-10">
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
                        <div className="p-4 sm:p-5 flex gap-3 sm:gap-5">
                          {/* Original garment thumbnail */}
                          <div className="w-14 h-20 sm:w-20 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white/[0.05]">
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

                            {project.prompt && (
                              <div className="mt-2">
                                <p className="text-[10px] text-white/25 line-clamp-2 italic leading-relaxed">
                                  &ldquo;{project.prompt}&rdquo;
                                </p>
                              </div>
                            )}

                            {/* Tabs */}
                            <div className="flex gap-2 mt-3 mb-3">
                              {["Generated", "Original", "Reels"].map((tab) => (
                                <button
                                  key={tab}
                                  onClick={() => setActiveProjectTab((prev) => ({ ...prev, [project.id]: tab }))}
                                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                                    (activeProjectTab[project.id] || "Generated") === tab
                                      ? "bg-violet-600 text-white"
                                      : "bg-white/5 text-white/50 hover:text-white"
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>

                            {/* Tab: Generated thumbnails */}
                            {(activeProjectTab[project.id] || "Generated") === "Generated" && (
                              <div className="flex gap-2">
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
                            )}

                            {/* Tab: Original */}
                            {activeProjectTab[project.id] === "Original" && (
                              <div className="mt-1">
                                {project.uploads[0] ? (
                                  <img
                                    src={getImageUrl(project.uploads[0].imageUrl)}
                                    alt="Original garment"
                                    className="h-28 rounded-xl object-cover"
                                  />
                                ) : (
                                  <p className="text-xs text-white/30">No original image</p>
                                )}
                              </div>
                            )}

                            {/* Tab: Reels */}
                            {activeProjectTab[project.id] === "Reels" && (
                              <div className="mt-1 space-y-2">
                                {project.reels.length > 0 ? (
                                  project.reels.map((reel) => (
                                    <video
                                      key={reel.id}
                                      src={reel.videoUrl}
                                      controls
                                      className="w-full rounded-lg"
                                      style={{ maxHeight: "300px" }}
                                    />
                                  ))
                                ) : (
                                  <p className="text-xs text-white/30">No reels yet for this project</p>
                                )}
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 mt-4">
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
                                  <>Download All</>
                                )}
                              </button>
                              <button
                                onClick={() => handleEditAndRegenerate(project)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/50 hover:text-white/80 transition-colors"
                              >
                                Edit &amp; Regenerate
                              </button>
                              <button
                                onClick={() => {
                                  const projectImages = project.images.map(img => getImageUrl(img.imageUrl));
                                  setResults(projectImages);
                                  setAiVideoImages(projectImages);
                                  setAiVideoOutputUrls([]);
                                  setAiVideoProgress(0);
                                  setAiVideoGenerating(false);
                                  setAiVideoError(null);
                                  setReelMode("fashn");
                                  setActiveExportTab("reels");
                                  setActiveNav("upload");
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/50 hover:text-white/80 transition-colors"
                              >
                                Create Reel
                              </button>
                              <button
                                onClick={() => openShareModal(project)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/50 hover:text-white/80 transition-colors"
                              >
                                Share
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded full image grid */}
                        {(activeProjectTab[project.id] || "Generated") === "Generated" && isExpanded && project.images.length > 0 && (
                          <div className="border-t border-white/[0.07] p-5">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                        {(activeProjectTab[project.id] || "Generated") === "Generated" && project.images.length > 0 && (
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

          {/* Settings */}
          {activeNav === "settings" && (
            <Container className="py-6 sm:py-10">
              {/* Header */}
              <div className="mb-8">
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">Settings</p>
                <h1 className="text-2xl font-bold">Integrations</h1>
                <p className="text-white/40 text-sm mt-1">Connect your store and social platforms.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-[500px]">

                {/* Tabs — horizontal scrollable on mobile, vertical on desktop */}
                <div className="md:w-48 md:flex-shrink-0">
                  <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0">
                    {[
                      { id: "integrations", label: "Integrations" },
                      { id: "woocommerce",  label: "WooCommerce"  },
                      { id: "shopify",      label: "Shopify"      },
                      { id: "branding",     label: "Brand Watermark" },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSettingsTab(tab.id as "integrations" | "branding" | "shopify" | "woocommerce")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all whitespace-nowrap md:whitespace-normal flex-shrink-0 md:flex-shrink ${
                          settingsTab === tab.id
                            ? "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                            : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                        }`}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right content */}
                <div className="flex-1 min-w-0">

                  {/* Integrations overview */}
                  {settingsTab === "integrations" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-white/[0.07] rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-violet-500/30 transition-all"
                        onClick={() => setSettingsTab("woocommerce")}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">WooCommerce</p>
                            <p className="text-xs mt-0.5 flex items-center gap-1">
                              {wcConnected
                                ? <><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"/><span className="text-green-400">Connected</span></>
                                : <><span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block"/><span className="text-white/40">Not connected</span></>
                              }
                            </p>
                          </div>
                        </div>
                        <span className="text-white/30 text-xs">→</span>
                      </div>

                      <div className="border border-white/[0.07] rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-violet-500/30 transition-all"
                        onClick={() => setSettingsTab("shopify")}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Shopify</p>
                            <p className="text-xs mt-0.5 flex items-center gap-1">
                              {shopifyConnected
                                ? <><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"/><span className="text-green-400">Connected</span></>
                                : <><span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block"/><span className="text-white/40">Not connected</span></>
                              }
                            </p>
                          </div>
                        </div>
                        <span className="text-white/30 text-xs">→</span>
                      </div>

                      <div className="border border-white/[0.07] rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-violet-500/30 transition-all"
                        onClick={() => setSettingsTab("branding")}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Brand Watermark</p>
                            <p className="text-xs mt-0.5 flex items-center gap-1">
                              {brandingLogoUrl
                                ? <><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"/><span className="text-green-400">Logo uploaded</span></>
                                : <><span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block"/><span className="text-white/40">Not set</span></>
                              }
                            </p>
                          </div>
                        </div>
                        <span className="text-white/30 text-xs">→</span>
                      </div>

                      {[
                        { name: "Facebook" },
                        { name: "Instagram" },
                        { name: "TikTok" },
                      ].map(({ name }) => (
                        <div key={name} className="border border-white/[0.04] rounded-2xl p-5 opacity-50 cursor-not-allowed flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-sm">{name}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.07] text-white/40">Coming Soon</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WooCommerce tab */}
                  {settingsTab === "woocommerce" && (
                    <div className="max-w-md">
                      <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setSettingsTab("integrations")} className="text-white/40 hover:text-white text-sm">Back</button>
                        <h2 className="text-lg font-semibold">WooCommerce</h2>
                        {wcConnected && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400">Connected</span>}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">Store URL</label>
                          <input type="url" placeholder="https://yourstore.com" value={wcForm.siteUrl}
                            onChange={e => setWcForm({ ...wcForm, siteUrl: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">Consumer Key</label>
                          <input type="text" placeholder="ck_..." value={wcForm.consumerKey}
                            onChange={e => setWcForm({ ...wcForm, consumerKey: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">Consumer Secret</label>
                          <div className="relative">
                            <input type={wcShowSecret ? "text" : "password"} placeholder="cs_..." value={wcForm.consumerSecret}
                              onChange={e => setWcForm({ ...wcForm, consumerSecret: e.target.value })}
                              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 pr-14 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                            <button type="button" onClick={() => setWcShowSecret(!wcShowSecret)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">
                              {wcShowSecret ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">App Password</label>
                          <div className="relative">
                            <input type={wcShowAppPw ? "text" : "password"} placeholder="xxxx xxxx xxxx xxxx" value={wcForm.appPassword}
                              onChange={e => setWcForm({ ...wcForm, appPassword: e.target.value })}
                              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 pr-14 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                            <button type="button" onClick={() => setWcShowAppPw(!wcShowAppPw)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">
                              {wcShowAppPw ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                        <button
                          disabled={wcConnecting}
                          onClick={async () => {
                            setWcConnecting(true);
                            const res = await fetch("/api/settings/woocommerce", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ wpSiteUrl: wcForm.siteUrl, wpConsumerKey: wcForm.consumerKey, wpConsumerSecret: wcForm.consumerSecret, wpAppPassword: wcForm.appPassword }),
                            });
                            const data = await res.json();
                            setWcConnecting(false);
                            if (data.success) { setWcConnected(true); showToast("WooCommerce connected successfully!", "success"); } else { showToast(data.error ?? "Connection failed. Check your credentials.", "error"); }
                          }}
                          className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-sm font-medium transition-colors"
                        >
                          {wcConnecting ? "Connecting…" : wcConnected ? "Update Connection" : "Connect Store"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Shopify tab */}
                  {settingsTab === "shopify" && (
                    <div className="max-w-md">
                      <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setSettingsTab("integrations")} className="text-white/40 hover:text-white text-sm">Back</button>
                        <h2 className="text-lg font-semibold">Shopify</h2>
                        {shopifyConnected && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400">Connected</span>}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">Store URL</label>
                          <input type="text" placeholder="yourstore.myshopify.com" value={shopifyForm.siteUrl}
                            onChange={e => setShopifyForm({ ...shopifyForm, siteUrl: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">Access Token</label>
                          <div className="relative">
                            <input type={shopifyShowToken ? "text" : "password"} placeholder="shpat_xxxxxxxxxxxx" value={shopifyForm.accessToken}
                              onChange={e => setShopifyForm({ ...shopifyForm, accessToken: e.target.value })}
                              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 pr-14 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                            <button type="button" onClick={() => setShopifyShowToken(!shopifyShowToken)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">
                              {shopifyShowToken ? "Hide" : "Show"}
                            </button>
                          </div>
                          <p className="text-[10px] text-white/20 mt-1">Shopify Admin → Settings → Apps → Develop apps → Create app → Admin API access token</p>
                        </div>
                        <button
                          disabled={shopifyConnecting}
                          onClick={async () => {
                            setShopifyConnecting(true);
                            const res = await fetch("/api/settings/shopify", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ shopifySiteUrl: shopifyForm.siteUrl, shopifyAccessToken: shopifyForm.accessToken })
                            });
                            const data = await res.json();
                            setShopifyConnecting(false);
                            if (data.success) { setShopifyConnected(true); showToast("Shopify connected successfully!", "success"); } else { showToast(data.error ?? "Connection failed. Check your store URL and token.", "error"); }
                          }}
                          className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-sm font-medium transition-colors"
                        >
                          {shopifyConnecting ? "Connecting…" : shopifyConnected ? "Update Connection" : "Connect Store"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Branding tab */}
                  {settingsTab === "branding" && (
                    <div className="max-w-md">
                      <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setSettingsTab("integrations")} className="text-white/40 hover:text-white text-sm">Back</button>
                        <h2 className="text-lg font-semibold">Brand Watermark</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-white/40 mb-2">Logo (PNG with transparency recommended)</p>
                          <div onClick={() => brandingFileRef.current?.click()}
                            className="w-full h-24 rounded-xl border border-dashed border-white/10 hover:border-violet-500/40 flex items-center justify-center cursor-pointer transition-colors">
                            {brandingLogoUrl
                              ? <img src={brandingLogoUrl} alt="Brand logo" className="h-14 object-contain"/>
                              : <p className="text-xs text-white/30">Click to upload logo</p>
                            }
                          </div>
                          <input ref={brandingFileRef} type="file" accept="image/png,image/svg+xml,image/webp" className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]; if (!file) return;
                              setBrandingUploading(true);
                              const form = new FormData();
                              form.append("file", file);
                              form.append("position", brandingPosition);
                              form.append("size", String(brandingSize));
                              form.append("opacity", String(brandingOpacity));
                              const res = await fetch("/api/settings/branding", { method: "POST", body: form });
                              const data = await res.json();
                              if (data.brandingLogoUrl) { setBrandingLogoUrl(data.brandingLogoUrl); showToast("Brand logo uploaded!", "success"); }
                              setBrandingUploading(false); setBrandingSaved(true);
                              setTimeout(() => setBrandingSaved(false), 2000);
                            }}
                          />
                          {brandingUploading && <p className="text-xs text-violet-400 mt-1">Uploading...</p>}
                          {brandingSaved && <p className="text-xs text-green-400 mt-1">✓ Saved!</p>}
                        </div>

                        <div>
                          <p className="text-xs text-white/40 mb-2">Position</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "north_west", label: "Top Left" },
                              { id: "north_east", label: "Top Right" },
                              { id: "south_west", label: "Bottom Left" },
                              { id: "south_east", label: "Bottom Right" },
                            ].map(pos => (
                              <button key={pos.id} onClick={() => setBrandingPosition(pos.id)}
                                className={`py-2 rounded-lg text-xs border transition-all ${
                                  brandingPosition === pos.id
                                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                                    : "border-white/[0.07] text-white/50 hover:border-violet-500/40"
                                }`}>
                                {pos.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-white/40 mb-2">Size: {brandingSize}px</p>
                          <input type="range" min="50" max="300" value={brandingSize}
                            onChange={e => setBrandingSize(parseInt(e.target.value))}
                            className="w-full accent-violet-500"/>
                        </div>

                        <div>
                          <p className="text-xs text-white/40 mb-2">Opacity: {brandingOpacity}%</p>
                          <input type="range" min="10" max="100" value={brandingOpacity}
                            onChange={e => setBrandingOpacity(parseInt(e.target.value))}
                            className="w-full accent-violet-500"/>
                        </div>

                        <button
                          onClick={async () => {
                            const form = new FormData();
                            form.append("position", brandingPosition);
                            form.append("size", String(brandingSize));
                            form.append("opacity", String(brandingOpacity));
                            await fetch("/api/settings/branding", { method: "POST", body: form });
                            setBrandingSaved(true); setTimeout(() => setBrandingSaved(false), 2000);
                            showToast("Branding settings saved!", "success");
                          }}
                          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
                        >
                          Save Settings
                        </button>

                        <button
                          onClick={async () => {
                            setBrandingPreviewing(true)
                            setBrandingPreviewUrl(null)
                            const res = await fetch("/api/settings/branding/test")
                            const data = await res.json()
                            if (data.previewUrl) { setBrandingPreviewUrl(data.previewUrl); showToast("Preview generated!", "success"); }
                            setBrandingPreviewing(false)
                          }}
                          disabled={!brandingLogoUrl || brandingPreviewing}
                          className="w-full py-2.5 rounded-xl border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-500/10 transition-colors disabled:opacity-40"
                        >
                          {brandingPreviewing ? "Generating preview..." : "Test Watermark Preview"}
                        </button>

                        {brandingPreviewUrl && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                            <img src={brandingPreviewUrl} alt="Branding preview" className="w-full"/>
                            <p className="text-xs text-white/30 text-center py-2">Preview — watermark on a sample image</p>
                          </div>
                        )}

                        {brandingLogoUrl && (
                          <button
                            onClick={async () => {
                              await fetch("/api/settings/branding", { method: "DELETE" });
                              setBrandingLogoUrl(null);
                              showToast("Watermark removed.", "info");
                            }}
                            className="w-full py-2 rounded-xl border border-white/[0.07] text-xs text-white/40 hover:text-red-400 transition-colors"
                          >
                            Remove Watermark
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </Container>
          )}

        </div>
      </main>

      {/* ── Share Modal ── */}
      {shareProject && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShareProject(null); }}
        >
          <div className="bg-[#111] border border-white/[0.08] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg h-[88svh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden">

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
              {(["social", "woocommerce", "shopify"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShareTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                    shareTab === tab
                      ? "text-violet-400 border-violet-500"
                      : "text-white/40 border-transparent hover:text-white/70"
                  }`}
                >
                  {tab === "social" ? "Social" : tab === "woocommerce" ? "WooCommerce" : "Shopify"}
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
                      <>{shareCaption ? "Regenerate" : "Generate Caption"}</>
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
                    <p className="text-white/60 text-sm">Connect WooCommerce in Settings first</p>
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
                      ) : "Generate All with AI"}
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

            {/* ── Shopify Tab ── */}
            {shareTab === "shopify" && (
              <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

                {shopifyShareConnected === null && (
                  <div className="flex items-center justify-center py-10">
                    <span className="w-5 h-5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin"/>
                  </div>
                )}

                {shopifyShareConnected === false && (
                  <div className="text-center py-10 space-y-4">
                    <p className="text-white/60 text-sm">Connect Shopify in Settings first</p>
                    <button
                      onClick={() => { setShareProject(null); setActiveNav("settings"); }}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
                    >
                      Go to Settings
                    </button>
                  </div>
                )}

                {shopifyShareConnected === true && (
                  <>
                    {shopifyProductUrl && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <p className="text-emerald-300 text-sm font-semibold">✓ Product published!</p>
                        <a href={shopifyProductUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                          View in Shopify Admin ↗
                        </a>
                      </div>
                    )}

                    {/* Image selector */}
                    <div>
                      <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-2">Select Images</p>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {shareProject?.images.map((img) => (
                          <button key={img.id}
                            onClick={() => setShopifyImages(prev =>
                              prev.includes(img.imageUrl)
                                ? prev.filter(u => u !== img.imageUrl)
                                : [...prev, img.imageUrl]
                            )}
                            className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                              shopifyImages.includes(img.imageUrl)
                                ? "border-violet-500 scale-[1.02]"
                                : "border-white/10 hover:border-violet-500/40"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getImageUrl(img.imageUrl)} alt="" className="w-full h-full object-cover"/>
                            {shopifyImages.includes(img.imageUrl) && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Product Title */}
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Product Title</label>
                      <input type="text" value={shopifyTitle} onChange={e => setShopifyTitle(e.target.value)}
                        placeholder="e.g. Black Embroidered Kurta"
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Description</label>
                      <textarea value={shopifyDescription} onChange={e => setShopifyDescription(e.target.value)}
                        rows={4} placeholder="Product description..."
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white resize-none"/>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Price (PKR)</label>
                      <input type="number" value={shopifyPrice} onChange={e => setShopifyPrice(e.target.value)}
                        placeholder="0.00" min="0"
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Tags</label>
                      <input type="text" value={shopifyTags} onChange={e => setShopifyTags(e.target.value)}
                        placeholder="fashion, kurta, eid"
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 text-white"/>
                      <p className="text-[10px] text-white/20 mt-1">Comma separated</p>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-xs text-white/40 mb-2 block">Status</label>
                      <div className="flex gap-2">
                        {(["draft", "active"] as const).map(s => (
                          <button key={s} onClick={() => setShopifyStatus(s)}
                            className={`px-5 py-1.5 rounded-full border text-xs font-medium transition-all ${
                              shopifyStatus === s
                                ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                            }`}>
                            {s === "draft" ? "Draft" : "Active"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {!shopifyProductUrl && (
                      <button
                        disabled={shopifyPublishing || !shopifyPrice || shopifyImages.length === 0}
                        onClick={async () => {
                          setShopifyPublishing(true)
                          const res = await fetch("/api/shopify/publish", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              title: shopifyTitle || shareProject?.name,
                              description: shopifyDescription,
                              price: shopifyPrice,
                              tags: shopifyTags,
                              status: shopifyStatus,
                              images: shopifyImages,
                            })
                          })
                          const data = await res.json()
                          setShopifyPublishing(false)
                          if (data.success) {
                            setShopifyProductUrl(data.productUrl)
                            showToast("Product published to Shopify!", "success")
                          } else {
                            showToast(data.error ?? "Failed to publish to Shopify.", "error")
                          }
                        }}
                        className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                          shopifyPublishing || !shopifyPrice || shopifyImages.length === 0
                            ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
                            : "bg-violet-600 hover:bg-violet-500 text-white"
                        }`}
                      >
                        {shopifyPublishing ? "Publishing…" :
                          shopifyImages.length === 0 ? "Select images first" :
                          !shopifyPrice ? "Enter price first" :
                          "Publish to Shopify →"}
                      </button>
                    )}
                    <div className="h-2"/>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── Mobile Credits Bar (above bottom nav) ── */}
      {creditInfo && (
        <div className="fixed bottom-16 left-0 right-0 z-40 flex md:hidden items-center gap-3 px-4 py-2 bg-[#080808]/95 border-t border-white/[0.04]">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                creditInfo.percentage > 80 ? "bg-red-500" :
                creditInfo.percentage > 60 ? "bg-amber-500" : "bg-violet-500"
              }`}
              style={{ width: `${Math.min(creditInfo.percentage, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-white/40 whitespace-nowrap flex-shrink-0">
            {creditInfo.credits} credits
          </span>
        </div>
      )}

      {/* ── Third Image Alert Toast ── */}
      {showThirdImageAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-full max-w-sm mx-4">
          <div className="bg-[#1a1025] border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-amber-300 text-sm font-semibold mb-1">Third image = Separate Reel</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  A second reel will be generated using the 3rd image separately. This will cost extra credits.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setShowThirdImageAlert(false)}
                    className="flex-1 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (pendingVideoImageRef.current) {
                        setAiVideoImages(prev => [...prev, pendingVideoImageRef.current!]);
                        pendingVideoImageRef.current = null;
                      }
                      setShowThirdImageAlert(false);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-colors"
                  >
                    Add anyway (+credits)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Prompt Preview Modal ── */}
      {showVideoPromptPreview && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowVideoPromptPreview(false) }}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Review Video Generation</h3>
              <button onClick={() => setShowVideoPromptPreview(false)} className="text-white/40 hover:text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Duration</span>
                <span className="text-white/80 font-medium">10 seconds</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Resolution</span>
                <span className="text-white/80 font-medium">{aiVideoResolution}</span>
              </div>
              {selectedMusicTrack && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Music</span>
                  <span className="text-white/80 font-medium">
                    {selectedMusicTrack === "custom"
                      ? customMusicFile?.name || "Custom"
                      : MUSIC_TRACKS.find(t => t.id === selectedMusicTrack)?.label || selectedMusicTrack}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Images</span>
                <span className="text-white/80 font-medium">
                  {aiVideoImages.length === 1
                    ? "1 image (start frame only)"
                    : aiVideoImages.length === 2
                    ? "2 images (start + end frame)"
                    : "3 images (2 reels)"}
                </span>
              </div>
              {aiVideoImages.length > 0 && (
                <div className="flex gap-3 mt-1">
                  {aiVideoImages.map((url, i) => (
                    <div key={i} className="relative flex flex-col items-center gap-1">
                      <img src={url} alt="" className="w-20 h-24 object-cover rounded-xl border border-white/10"/>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        i === 0
                          ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                          : i === 1
                          ? "bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300"
                          : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                      }`}>
                        {i === 0 ? "START" : i === 1 ? "END" : "EXTRA"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {aiVideoImages.length === 3 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-300 text-xs font-medium">2 Reels will be generated</p>
                  <p className="text-amber-300/60 text-xs mt-0.5">
                    Reel 1: Image 1 → Image 2 (start + end frame)<br/>
                    Reel 2: Image 3 (separate reel)
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowVideoPromptPreview(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-sm text-white/60 hover:text-white transition-colors">
                Edit
              </button>
              <button onClick={() => { setShowVideoPromptPreview(false); handleGenerateAiVideo(); }}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium text-white transition-colors">
                Generate Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Prompt Preview Modal ── */}
      {showPromptPreview && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowPromptPreview(false) }}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Review Your Prompt</h3>
              <button onClick={() => setShowPromptPreview(false)} className="text-white/40 hover:text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
              {sides.map(side => {
                const sideHint = side !== "front" ? `, ${side.replace(/-/g, " ")} view` : ""
                return (
                  <div key={side} className="space-y-1">
                    <p className="text-xs text-violet-400 uppercase tracking-wider capitalize">{side.replace(/-/g, " ")} view</p>
                    <p className="text-sm text-white/80 leading-relaxed">{editablePrompt + sideHint}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-white/40">
              <div><span className="text-white/60">Gender:</span> {gender}</div>
              <div><span className="text-white/60">Ethnicity:</span> {ethnicity}</div>
              <div><span className="text-white/60">Occasion:</span> {occasion}</div>
              <div><span className="text-white/60">Background:</span> {background}</div>
              <div><span className="text-white/60">Sides:</span> {sides.join(", ")}</div>
              <div><span className="text-white/60">Images:</span> {numImages} per side</div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPromptPreview(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-sm text-white/60 hover:text-white transition-colors">
                Edit Prompt
              </button>
              <button onClick={() => { setShowPromptPreview(false); handleGenerate(); }}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium text-white transition-colors">
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-white/[0.06] bg-[#080808]/90 backdrop-blur-sm flex md:hidden items-center">
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActiveNav(item.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              activeNav === item.id ? "text-violet-400" : "text-white/40"
            }`}>
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Toast Container ── */}
      <div className="fixed top-6 right-6 z-[500] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-2xl max-w-sm backdrop-blur-sm ${
                toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/30" :
                toast.type === "error"   ? "bg-red-500/15 border-red-500/30" :
                toast.type === "warning" ? "bg-amber-500/15 border-amber-500/30" :
                                           "bg-violet-500/15 border-violet-500/30"
              }`}
            >
              <span className="mt-0.5 text-base shrink-0">
                {toast.type === "success" ? "✓" :
                 toast.type === "error"   ? "✕" :
                 toast.type === "warning" ? "⚠" : "ℹ"}
              </span>
              <p className={`text-sm font-medium flex-1 ${
                toast.type === "success" ? "text-emerald-300" :
                toast.type === "error"   ? "text-red-300" :
                toast.type === "warning" ? "text-amber-300" :
                                           "text-violet-300"
              }`}>{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-white/30 hover:text-white/60 text-xs ml-1 shrink-0 transition-colors"
              >✕</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
