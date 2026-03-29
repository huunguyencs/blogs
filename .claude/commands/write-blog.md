---
description: "Generate a complete blog post from research or a topic with proper frontmatter and SEO optimization"
---

# Generate a Blog Post

You are an expert blog writer. Generate a complete, SEO-optimized blog post in MDX format with proper frontmatter.

## Input

The user provides: $ARGUMENTS

This can be:
- A topic string (you'll do quick research first)
- Research output from the /research command
- A topic with flags like: `--publish`, `--category "Name"`, `--tags "tag1,tag2"`, `--no-image`

## Process

1. **Quick Research** (if no research provided): Use WebSearch to get context on the topic. Fetch 2-3 top results with WebFetch.

2. **Find and Upload Hero Image to Cloudinary** (unless `--no-image` flag is set):

   a. Use WebSearch to search: `site:unsplash.com [topic keywords] photo`
   b. From the search results, pick the most relevant Unsplash photo URL (looks like `https://unsplash.com/photos/...`)
   c. Use WebFetch on that Unsplash page to extract the direct image URL (contains `images.unsplash.com/photo-...`). Also note the photographer's name.
   d. Upload to Cloudinary using the helper script:
      ```bash
      npx tsx scripts/upload-cloudinary.ts "DIRECT_IMAGE_URL" "SLUG"
      ```
      The script outputs JSON like: `{"url":"https://res.cloudinary.com/...","public_id":"blog/slug",...}`
   e. Parse the JSON output and use the `url` field as the image `src` in frontmatter.
   f. If Unsplash fails, try: `site:pexels.com [topic keywords] photo` as fallback.
   g. If Cloudinary upload fails (e.g., missing credentials), warn the user and leave image as a placeholder path `/images/blog/{slug}.jpg`.

   **IMPORTANT**: Only use images from Unsplash or Pexels — these are free to use. Never scrape images from random websites.

3. **Scan Existing Posts for Internal Links**:

   Before writing, check for internal linking opportunities:
   - Use Glob to list all files in `src/content/blog/*.mdx`
   - For each file, read the frontmatter (first 15 lines) to get title, category, tags
   - Identify related posts by category, tags, or topic overlap
   - When writing, naturally link to related posts: `[title](/blog/slug)`
   - Aim for 1-3 internal links per post. Skip if no posts exist or none are relevant.

4. **Generate the Blog Post** following these requirements:

### Frontmatter Schema (MUST match exactly)

```yaml
---
title: "Your Post Title Here"
description: "A concise meta description under 160 characters for SEO."
date: YYYY-MM-DD  # Today's date
author: "Blog Author"
category: "Category Name"  # Title Case
tags: ["tag1", "tag2", "tag3"]  # lowercase, hyphenated
image:
  src: "https://res.cloudinary.com/CLOUD_NAME/image/upload/..."  # Cloudinary URL from upload
  alt: "Descriptive alt text for the hero image"
featured: false
draft: false
---
```

### Content Requirements

- **Length**: 1200-2000 words
- **Structure**: Use H2 (`##`) and H3 (`###`) headings. These generate the table of contents and are important for SEO.
- **Introduction**: Start with a compelling hook — a question, statistic, or bold statement
- **Body**: Well-organized sections with clear headings. Include practical examples.
- **Code Blocks**: Use fenced code blocks with language tags (```typescript, ```css, etc.) for any code examples
- **Diagrams**: Use Mermaid (``` ```mermaid ```) for all diagrams and flowcharts. Never use ASCII art — it renders poorly. Mermaid is rendered at build time as SVG images.
- **Conclusion**: End with key takeaways or a call to action
- **Tone**: Authoritative but conversational. Write for developers/tech professionals.

### SEO Guidelines

- **Title**: Include the primary keyword naturally. Keep under 60 characters if possible.
- **Description**: Must be under 160 characters. Include the primary keyword. Make it compelling.
- **Headings**: Each H2 should be descriptive and keyword-rich (not just "Introduction", "Conclusion")
- **Internal Links**: Where relevant, suggest linking to related topics

5. **Determine Output Location**:
   - If `--publish` flag is present: write to `src/content/blog/{slug}.mdx`
   - Otherwise (default): write to `src/content/drafts/{slug}.mdx`
   - Slug: derived from title, lowercase, hyphenated (e.g., "My Great Post" → "my-great-post")

6. **Write the File**: Use the Write tool to create the MDX file at the appropriate path.

7. **Report**: After writing, print a summary:
   ```
   Blog post created:
   - Title: [title]
   - File: [path]
   - Image: [Cloudinary URL] (by Photographer Name from Unsplash)
   - Category: [category]
   - Tags: [tags]
   - Word count: ~[count]
   - Status: [Draft / Published]
   ```

## Example

User runs: `/write-blog "Getting started with Bun runtime" --category "JavaScript" --tags "bun,runtime,nodejs"`

You search Unsplash for a relevant image, upload it to Cloudinary, get the URL, generate a complete MDX file with the Cloudinary image URL in frontmatter, and write it to `src/content/drafts/getting-started-with-bun-runtime.mdx`.
