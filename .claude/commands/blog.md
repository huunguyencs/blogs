---
description: "End-to-end blog creation: research a topic, write a complete post, and optionally publish"
---

# Full Blog Post Creation Pipeline

You are a blog content creation pipeline. Take a topic and produce a complete, publication-ready blog post with a hero image hosted on Cloudinary.

## Input

The user provides: $ARGUMENTS

Expected format: `"topic" [options]`

Options:

- `--publish` — Write directly to published (src/content/blog/) instead of drafts
- `--urls "url1,url2"` — Include specific URLs as research sources
- `--category "Name"` — Set the post category
- `--tags "tag1,tag2"` — Set the post tags
- `--no-image` — Skip image crawling and Cloudinary upload

## Pipeline

### Step 1: Research Phase

Conduct thorough research on the topic:

1. Use WebSearch with 2-3 different query variations to find 5-8 relevant sources
2. Use WebFetch on the top 3-5 most authoritative/relevant URLs
3. If `--urls` provided, also WebFetch those specific URLs
4. Compile research into key points, data, code examples, and source attributions

### Step 2: Find and Upload Hero Image to Cloudinary

Find a high-quality, relevant hero image and upload it to Cloudinary (unless `--no-image` is set):

1. **Search for image**: Use WebSearch with query: `site:unsplash.com [topic keywords] photo`
2. **Pick the best result**: Choose the most relevant Unsplash photo URL from search results
3. **Extract direct image URL**: Use WebFetch on the Unsplash photo page to find:
   - The direct image URL (contains `images.unsplash.com/photo-...`)
   - The photographer's name (for attribution in the summary)
4. **Upload to Cloudinary**: Use Bash to run:
   ```bash
   npx tsx scripts/upload-cloudinary.ts "DIRECT_IMAGE_URL" "POST_SLUG"
   ```
   The script outputs JSON: `{"url":"https://res.cloudinary.com/...","public_id":"blog/slug","width":...,"height":...,"format":"..."}`
5. **Parse the result**: Extract the `url` field from the JSON output. This becomes the image `src` in frontmatter.
6. **Fallback on failure**:
   - If Unsplash search fails → try `site:pexels.com [topic keywords] photo`
   - If Cloudinary upload fails (missing credentials) → warn the user, use placeholder `/images/blog/{slug}.jpg`

**IMPORTANT**: Only use images from Unsplash or Pexels — these are free to use. Never scrape images from random websites.

### Step 3: Internal Linking — Scan Existing Posts

Before writing, scan existing blog posts to find internal linking opportunities:

1. Use Glob to list all files in `src/content/blog/*.mdx`
2. For each file, read the frontmatter (first 15 lines) to get: title, category, tags, slug (filename)
3. Identify posts that are related to the current topic by matching:
   - Same or overlapping category
   - Shared tags
   - Conceptually related subjects (e.g., "rate limiting" relates to "API design")
4. Keep a list of related posts with their titles and slugs: `[title](/blog/slug)`
5. When writing the article, naturally link to these related posts where relevant. For example:
   - "As covered in [our guide to database indexing](/blog/database-indexing-strategies), ..."
   - "This pairs well with [event-driven architecture patterns](/blog/event-driven-architecture-patterns)."
6. Aim for 1-3 internal links per post where relevant. Don't force links if no existing posts relate.
7. If no existing posts are found (empty blog), skip this step.

### Step 4: Write Phase

Using the research, generate a complete blog post:

1. Create an engaging, SEO-optimized title
2. Write a meta description under 160 characters
3. Determine category (use `--category` if provided, or infer from topic)
4. Determine tags (use `--tags` if provided, or infer from research)
5. Write the full post (1200-2000 words) with:
   - Compelling introduction with a hook
   - Well-structured body with H2/H3 headings
   - Practical code examples where relevant
   - Mermaid diagrams (` `mermaid ```) for any flowcharts or architecture visuals. Never use ASCII art — Mermaid is rendered at build time as SVG images.
   - Data and insights from research
   - Strong conclusion with takeaways
6. Follow the frontmatter schema exactly:

```yaml
---
title: "Post Title"
description: "Meta description under 160 chars"
date: YYYY-MM-DD
author: "AI Agent"
category: "Category Name"
tags: ["tag1", "tag2"]
image:
  src: "https://res.cloudinary.com/CLOUD_NAME/image/upload/blog/slug" # Cloudinary URL
  alt: "Descriptive alt text"
featured: false
draft: false
---
```

### Step 5: Save

1. Generate slug from title (lowercase, hyphenated)
2. If `--publish` flag: write to `src/content/blog/{slug}.mdx`
3. Otherwise: write to `src/content/drafts/{slug}.mdx`

### Step 6: Summary

Print a completion report:

```
Blog post created successfully!

  Title:    [title]
  File:     [file path]
  Image:    [Cloudinary URL] (by Photographer Name from Unsplash)
  Category: [category]
  Tags:     [tags]
  Words:    ~[word count]
  Status:   [Draft — run /publish slug to publish | Published]
  Sources:  [number] sources referenced

Next steps:
  - Review the post at [file path]
  - [If draft] Run /publish [slug] when ready to publish
  - Run `npm run dev` to preview locally
```

## Quality Checklist (verify before saving)

- [ ] Title is under 60 characters and includes primary keyword
- [ ] Description is under 160 characters and compelling
- [ ] At least 3 H2 headings for good structure/TOC
- [ ] Code examples have language tags
- [ ] Content is 1200-2000 words
- [ ] Sources are attributed where claims are made
- [ ] Category is Title Case
- [ ] Tags are lowercase
- [ ] Slug is clean (no special characters)
- [ ] Hero image uploaded to Cloudinary and URL is in frontmatter
- [ ] Image alt text is descriptive and includes topic keywords
- [ ] Internal links to related existing posts where relevant (1-3 links)
- [ ] Diagrams use Mermaid code blocks, not ASCII art

## Example

```
/blog "building REST APIs with Hono.js" --tags "hono,api,typescript" --category "Backend"
```

This will:

1. Research Hono.js REST API development
2. Search Unsplash for a relevant image, upload to Cloudinary
3. Write a ~1500 word post with code examples and Cloudinary image URL
4. Save to src/content/drafts/building-rest-apis-with-hono-js.mdx
5. Print the summary
