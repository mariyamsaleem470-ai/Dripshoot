# DripShoots — Project Status

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.6 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Auth | Clerk (@clerk/nextjs) | ^7.3.3 |
| ORM | Prisma | ^7.8.0 |
| Database | PostgreSQL | — |
| AI Generation | Fashn.ai API | v1 |
| AI (future) | Hugging Face | — |

---

## API Keys Required

Set these in `.env.local` at the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Fashn.ai (image generation)
FASHN_API_KEY=...

# Hugging Face (video / background — future use)
HUGGINGFACE_API_KEY=...

# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:5432/dripshoots
```

> **Note:** `DATABASE_URL` is NOT set yet. Prisma connection will fail until this is provided.
> Connection URL lives in `prisma.config.ts` (Prisma 7 convention) — do NOT add it to `schema.prisma`.

---

## VPS Details

| Field | Value |
|-------|-------|
| IP Address | 153.92.209.231 |
| App Port | 8090 |
| Deploy Path | `/var/www/dripshoots` |
| Start Command | `npm run start` (or via PM2) |
| Build Command | `npm run build` |

Suggested PM2 start:
```bash
cd /var/www/dripshoots
npm run build
pm2 start npm --name dripshoots -- start -- -p 8090
```

---

## Database Details

- **Provider:** PostgreSQL
- **ORM:** Prisma 7 (`prisma.config.ts` holds the connection URL)
- **Schema file:** `prisma/schema.prisma`
- **Generate client:** `npx prisma generate`
- **Push schema to DB:** `npx prisma db push` ← **not run yet**

### Models

| Model | Key Fields |
|-------|-----------|
| `User` | `id`, `clerkId` (unique), `email`, `createdAt` |
| `Project` | `id`, `userId`, `name`, `status`, `gender`, `ethnicity`, `occasion`, `createdAt` |
| `Upload` | `id`, `projectId`, `imageUrl`, `createdAt` |
| `GeneratedImage` | `id`, `projectId`, `imageUrl`, `createdAt` |

---

## What's Working

- [x] Landing page (`/`) with pricing, how-it-works, model selector UI
- [x] Clerk authentication — sign-in, sign-up, route protection via middleware
- [x] Garment image upload → stored in `public/uploads/` via `/api/upload`
- [x] Fashn.ai generation — `POST /api/generate` calls `product-to-model`, polls status, returns images
- [x] DB persistence — after generation, upserts User + creates Project/Upload/GeneratedImage records
- [x] My Projects tab — fetches `/api/projects`, renders project cards with thumbnails, tags, expand-to-grid
- [x] Export formats — Instagram, Shopify, WordPress, Facebook (canvas crop + download)
- [x] Reels tab — generates WebM video (VP9, 30 fps, ~7 sec) from generated images
- [x] Prisma schema + client generated (models: User, Project, Upload, GeneratedImage)

---

## Pending / Known Issues

### 1. Fix `/api/projects` 404
- **Root cause:** `DATABASE_URL` is not set, so Prisma cannot connect and the route crashes/404s.
- **Fix:** Set `DATABASE_URL` in `.env.local`, then run `npx prisma db push` to create tables.

### 2. Video Improvement
- Current reel is a basic WebM slideshow generated client-side via Canvas API.
- Planned: Use Hugging Face API (`HUGGINGFACE_API_KEY` already in env) for higher-quality video generation or transitions.

### 3. Background Selection
- Users currently get a random generated scene based on the occasion prompt.
- Planned: UI to let users pick a specific background/scene before generating.

### 4. Settings Tab
- Currently a "Coming soon" placeholder at `/dashboard` → Settings tab.

---

## Important File Paths

```
E:\dripshoots\
├── .env.local                              ← API keys & DATABASE_URL
├── middleware.ts                           ← Clerk route protection (active)
├── prisma.config.ts                        ← Prisma 7 DB connection config
├── prisma/
│   └── schema.prisma                       ← DB schema (User, Project, Upload, GeneratedImage)
├── src/
│   ├── lib/
│   │   └── prisma.ts                       ← Prisma client singleton
│   ├── components/
│   │   └── Container.tsx                   ← Max-width layout wrapper
│   ├── app/
│   │   ├── layout.tsx                      ← Root layout (ClerkProvider)
│   │   ├── page.tsx                        ← Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx                    ← Main dashboard (upload, projects, settings)
│   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── page.tsx
│   │   ├── sign-up/[[...sign-up]]/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── upload/route.ts             ← POST: saves image to public/uploads/
│   │       ├── generate/route.ts           ← POST: Fashn.ai generation + DB save
│   │       └── projects/
│   │           ├── route.ts                ← GET: list user's projects
│   │           └── save/route.ts           ← POST: manually save a project
│   └── proxy.ts                            ← Legacy middleware (unused — root middleware.ts is active)
└── public/
    └── uploads/                            ← Uploaded garment images stored here
```
