# AI Blog — Project Guide

## Tech Stack
- **Framework**: Astro 6.x (static site generator)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with @tailwindcss/typography
- **Content**: MDX via Astro Content Collections (Content Layer API)
- **Node**: v22+ required (see .nvmrc)

## Project Structure
```
src/content/blog/      — Published blog posts (MDX)
src/content/drafts/    — Draft blog posts (MDX)
src/content.config.ts  — Content collection schema (Astro 5+ location)
src/components/        — Astro components (layout/, blog/, seo/, ui/)
src/layouts/           — Page layouts (Base, BlogPost, BlogList)
src/pages/             — Route pages
src/utils/             — Helper functions
src/styles/global.css  — Tailwind theme and global styles
.claude/commands/      — AI blog creation skills
```

## Content Schema (frontmatter)
All blog posts MUST include this frontmatter:
```yaml
---
title: string            # Required. SEO: keep under 60 chars
description: string      # Required. MUST be under 160 chars
date: YYYY-MM-DD         # Required
author: string           # Default: "Blog Author"
category: string         # Required. Title Case. Fully dynamic — any value works.
tags: ["tag1", "tag2"]   # Default: []. Lowercase, hyphenated
image:
  src: "/images/blog/slug.jpg"
  alt: "Descriptive alt text"
featured: boolean        # Default: false
draft: boolean           # Default: false
canonicalURL: string     # Optional. For cross-posted content
---
```

## Blog Owner Context
The author is a fullstack engineer focused on backend, DevOps, and system design.
When suggesting categories or topics, prefer these domains:
- Backend Development, System Design, DevOps, Cloud & Infrastructure,
  Databases, API Design, Microservices, Security, Performance, Architecture

Categories are fully dynamic — whatever string you put in `category` frontmatter
will automatically create a topic section on the homepage. No config needed.

## AI Skills (Slash Commands)
- `/research <topic>` — Research a topic via web search and scraping
- `/write-blog <topic>` — Generate a blog post with proper frontmatter
- `/publish <slug>` — Move a draft to published (validates frontmatter)
- `/blog <topic>` — Full pipeline: research → write → save
- `/upload-image <url|query>` — Upload an image to Cloudinary (search or direct URL)
- `/test-ui [url|focus]` — QA agent: analyzes code → generates test cases → tests via Chrome → reports issues

### Flags for /blog and /write-blog:
- `--publish` — Write directly to src/content/blog/ instead of drafts/
- `--category "Name"` — Set category
- `--tags "tag1,tag2"` — Set tags
- `--urls "url1,url2"` — Include specific source URLs (for /blog)
- `--no-image` — Skip image crawling

### Image Crawling + Cloudinary Upload
By default, `/blog` and `/write-blog` will:
1. Search Unsplash for a relevant photo (fallback: Pexels)
2. Upload the image to Cloudinary via `npx tsx scripts/upload-cloudinary.ts <url> <slug>`
3. Use the returned Cloudinary URL in frontmatter `image.src`
4. If Cloudinary credentials are missing, falls back to placeholder path

Only use images from Unsplash or Pexels (free to use). Never scrape random websites.
Use `--no-image` to skip image crawling entirely.

## Diagrams
Use Mermaid (```` ```mermaid ```` code blocks) for all diagrams and flowcharts in blog posts.
Never use ASCII art diagrams — they render poorly. Mermaid is rendered at build time
via `rehype-mermaid` (strategy: `img-svg`), so no client-side JS is needed.

## Conventions
- Components use `.astro` extension
- Post slugs: lowercase, hyphenated, derived from title
- Image paths: `/images/blog/{slug}.jpg` with descriptive alt text
- Category names: Title Case
- Tags: lowercase, hyphenated
- All styling via Tailwind utility classes (no CSS modules)
- Content files use `.mdx` extension

## Cloudinary Setup
Images are hosted on Cloudinary. Set credentials in `.env` (see `.env.example`):
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Upload script: `npx tsx scripts/upload-cloudinary.ts <image-url> <slug>`
Images are stored in the `blog/` folder on Cloudinary with auto format/quality.

## Commands
```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build static site to dist/
npm run preview  # Preview built site
```

## Content Collections (Astro 5+ API)
- Config file: `src/content.config.ts` (NOT src/content/config.ts)
- Uses `glob()` loader from `astro/loaders`
- Uses `z` from `astro/zod`
- Query with `getCollection()` and `getEntry()` from `astro:content`
- Render with `render()` from `astro:content`
