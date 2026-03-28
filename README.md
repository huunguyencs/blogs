# AI Blog

A modern, magazine-style blog powered by AI. Give it a topic — it researches, writes, finds a hero image, and publishes a complete SEO-optimized blog post.

Built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and [Claude Code](https://claude.ai/claude-code) custom skills.

## Quick Start

### Prerequisites

- Node.js 22+ ([nvm](https://github.com/nvm-sh/nvm) recommended)
- [Claude Code](https://claude.ai/claude-code) CLI (for AI blog generation)
- [Cloudinary](https://cloudinary.com) account (free tier works, for image hosting)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd blogs

# Use correct Node version
nvm use

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Cloudinary credentials
```

### Environment Variables

Create a `.env` file in the project root:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get these from your [Cloudinary Console](https://console.cloudinary.com/settings/api-keys).

### Development

```bash
npm run dev       # Start dev server at http://localhost:4321
npm run build     # Build static site to dist/
npm run preview   # Preview the built site
```

## Generate Blog Posts with AI

Open Claude Code in the project directory and use these slash commands:

### `/blog "topic"` — Full Pipeline (Recommended)

Researches the topic, finds a hero image, writes the post, and saves it.

```
/blog "designing rate limiters at scale"
```

With options:

```
/blog "Kubernetes pod autoscaling strategies" --category "DevOps" --tags "kubernetes,scaling,infrastructure" --publish
```

| Flag | Description |
|------|-------------|
| `--publish` | Save directly to published posts (skips draft) |
| `--category "Name"` | Set the post category (Title Case) |
| `--tags "a,b,c"` | Set post tags (lowercase) |
| `--urls "url1,url2"` | Include specific URLs as research sources |
| `--no-image` | Skip image search and Cloudinary upload |

### `/research "topic"` — Research Only

Gathers information from the web without writing a post. Useful when you want to review research before writing.

```
/research "event-driven architecture patterns"
```

### `/write-blog "topic"` — Write Only

Generates a blog post from a topic or from research output. Same flags as `/blog`.

```
/write-blog "database indexing strategies" --category "Databases" --tags "postgresql,indexing,performance"
```

### `/publish slug` — Publish a Draft

Moves a draft post to published. Validates frontmatter before publishing.

```
/publish              # List all drafts
/publish my-post      # Publish a specific draft
/publish --all        # Publish all drafts
```

### `/upload-image "query"` — Upload Image to Cloudinary

Search for a free image and upload it to Cloudinary, or upload from a direct URL.

```
/upload-image "server infrastructure"
/upload-image "https://images.unsplash.com/photo-..." --slug my-post
```

## Project Structure

```
.
├── .claude/commands/          # AI slash commands (skills)
│   ├── blog.md                #   /blog — full pipeline
│   ├── research.md            #   /research — web research
│   ├── write-blog.md          #   /write-blog — post generation
│   ├── publish.md             #   /publish — draft → published
│   ├── upload-image.md        #   /upload-image — Cloudinary upload
│   └── test-ui.md             #   /test-ui — QA visual testing agent
├── scripts/
│   └── upload-cloudinary.ts   # Cloudinary upload helper
├── src/
│   ├── content/
│   │   ├── blog/              # Published posts (MDX)
│   │   └── drafts/            # Draft posts (MDX)
│   ├── content.config.ts      # Content collection schema
│   ├── components/
│   │   ├── blog/              # Blog components (cards, TOC, tags, etc.)
│   │   ├── layout/            # Header, Footer
│   │   ├── seo/               # SEOHead, JSON-LD structured data
│   │   └── ui/                # Pagination
│   ├── layouts/
│   │   ├── BaseLayout.astro   # HTML shell with SEO
│   │   └── BlogPostLayout.astro # Post page with TOC sidebar
│   ├── pages/
│   │   ├── index.astro        # Magazine-style homepage
│   │   ├── blog/              # Blog listing + individual posts
│   │   ├── category/          # Posts filtered by category
│   │   ├── tag/               # Posts filtered by tag
│   │   └── rss.xml.ts         # RSS feed
│   ├── styles/global.css      # Tailwind theme + global styles
│   └── utils/                 # Helpers (posts, readingTime, slugify)
├── CLAUDE.md                  # AI agent project guide
├── .env.example               # Environment variables template
├── astro.config.mjs           # Astro configuration
└── package.json
```

## Blog Post Format

Posts are MDX files with YAML frontmatter:

```yaml
---
title: "Your Post Title"                    # Required — keep under 60 chars
description: "A compelling meta description" # Required — must be under 160 chars
date: 2026-03-28                             # Required
author: "Blog Author"                        # Optional — defaults to "Blog Author"
category: "System Design"                    # Required — Title Case, fully dynamic
tags: ["typescript", "tutorial"]              # Optional — lowercase
image:
  src: "https://res.cloudinary.com/..."      # Cloudinary URL or local path
  alt: "Descriptive alt text"                # Required if image is set
featured: true                               # Optional — shows in hero section
draft: false                                 # Optional — hidden from listings if true
canonicalURL: "https://..."                  # Optional — for cross-posted content
---

Your markdown content here...
```

## SEO Features

Every page includes:

- **Meta tags** — title, description, canonical URL
- **Open Graph** — og:title, og:description, og:image, og:type
- **Twitter Cards** — summary_large_image with title, description, image
- **JSON-LD** — BlogPosting schema on posts, WebSite schema on homepage
- **Sitemap** — auto-generated at `/sitemap-index.xml`
- **RSS Feed** — available at `/rss.xml`
- **Reading time** — calculated per post
- **Table of contents** — generated from H2/H3 headings

## Image Pipeline

Images flow through this pipeline:

1. AI searches Unsplash (or Pexels) for a relevant free-to-use photo
2. The image is uploaded to Cloudinary via `scripts/upload-cloudinary.ts`
3. Cloudinary optimizes it (auto format, auto quality, 1200px max width)
4. The Cloudinary URL goes into the post's frontmatter

You can also upload images manually:

```bash
npx tsx scripts/upload-cloudinary.ts "https://example.com/photo.jpg" "my-post-slug"
```

### `/test-ui` — Visual QA Agent

Autonomous QA agent that uses Chrome browser automation to test the blog UI. It reads the source code, generates test cases, executes them via screenshots and DOM inspection, and writes a detailed report.

```
/test-ui                            # Full site audit
/test-ui "hero section"             # Focus on a specific area
/test-ui http://localhost:4321/blog # Test a specific page
```

Requires:
- Dev server running (`npm run dev`)
- [Claude-in-Chrome extension](https://chromewebstore.google.com/detail/claude-in-chrome) installed

The agent tests: layout correctness, text contrast, broken images, responsive behavior (mobile/tablet/desktop), navigation links, content rendering, and SEO elements. Results are written to `src/__tests__/ui-test-report.md`.

## Writing Posts Manually

If you prefer writing without AI:

1. Create an `.mdx` file in `src/content/blog/` (or `src/content/drafts/` for drafts)
2. Add the required frontmatter (see format above)
3. Write your content in Markdown/MDX
4. Run `npm run dev` to preview

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Astro 6](https://astro.build) | Static site generator |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography) | Prose/article styling |
| [MDX](https://mdxjs.com) | Markdown + JSX components |
| [Cloudinary](https://cloudinary.com) | Image hosting + CDN + optimization |
| [Claude Code](https://claude.ai/claude-code) | AI blog generation agent |

## License

MIT
