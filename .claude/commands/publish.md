---
description: "Move a draft blog post to published or list current drafts"
---

# Publish a Draft Blog Post

Manage the publication of draft blog posts.

## Input

The user provides: $ARGUMENTS

This can be:
- A filename or slug of a draft to publish (e.g., `my-post` or `my-post.mdx`)
- `--list` to show all current drafts
- `--all` to publish all drafts

## Process

### If `--list` or no arguments:
1. Read the contents of `src/content/drafts/` directory using Glob
2. For each draft file, read the frontmatter and display:
   ```
   Drafts:
   1. [title] (slug.mdx) - [date] - [category]
   2. ...
   ```
3. If no drafts exist, say "No drafts found."

### If a specific slug/filename:
1. Read the draft file from `src/content/drafts/{slug}.mdx` (add .mdx if not present)
2. Validate the frontmatter:
   - Title is present and not empty
   - Description is present and under 160 characters
   - Category is present
   - Tags array exists
   - Warn if no image is set (but don't block)
   - Warn if description exceeds 155 characters
3. Update the frontmatter:
   - Set `draft: false`
   - Optionally update `date` to today
4. Write the file to `src/content/blog/{slug}.mdx`
5. Delete the original from `src/content/drafts/{slug}.mdx`
6. Report:
   ```
   Published: [title]
   - From: src/content/drafts/{slug}.mdx
   - To: src/content/blog/{slug}.mdx
   ```

### If `--all`:
1. List all drafts in `src/content/drafts/`
2. Validate and publish each one following the same process
3. Report summary of all published posts

## Validation Warnings

Print warnings (but still publish) for:
- Missing image
- Description close to 160 char limit (>150)
- No tags specified
- Category doesn't match existing categories (suggest existing ones)
