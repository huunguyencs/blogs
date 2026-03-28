---
description: "Upload an image to Cloudinary from a URL or search for one on Unsplash/Pexels"
---

# Upload Image to Cloudinary

Upload an image to Cloudinary for use as a blog hero image. Can search for free images or accept a direct URL.

## Input

The user provides: $ARGUMENTS

This can be:
- A direct image URL to upload
- A search query to find an image (e.g., `"javascript programming"`)
- A search query with slug (e.g., `"javascript programming" --slug my-post-slug`)

## Process

### If input looks like a URL (starts with http):

1. Upload directly to Cloudinary:
   ```bash
   npx tsx scripts/upload-cloudinary.ts "IMAGE_URL" "SLUG"
   ```
2. The script outputs JSON with the Cloudinary URL. Parse and display it.

### If input is a search query:

1. **Search for image**: Use WebSearch with query: `site:unsplash.com [query] photo`
2. **Pick the best result**: Choose the most relevant Unsplash photo URL
3. **Extract direct image URL**: Use WebFetch on the Unsplash photo page to find the direct image URL (contains `images.unsplash.com/photo-...`). Look in the page content for the high-res image source.
4. **Upload to Cloudinary**:
   ```bash
   npx tsx scripts/upload-cloudinary.ts "DIRECT_IMAGE_URL" "SLUG"
   ```
5. **Verify**: The script outputs JSON. Check that `url` field is present.
6. **Fallback**: If Unsplash fails, try `site:pexels.com [query] photo`

### Determine the slug:
- If `--slug` is provided, use that
- Otherwise, derive from the search query (lowercase, hyphenated)

## Output

Print the result:

```
Image uploaded to Cloudinary:
  URL:       [cloudinary secure_url]
  Public ID: [public_id]
  Size:      [width]x[height] ([format])

Use in frontmatter:
  image:
    src: "[cloudinary_url]"
    alt: "Descriptive alt text"
```

## Error Handling

- If Cloudinary credentials are missing, remind the user to set up `.env`:
  ```
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```
- If image search finds nothing, suggest the user provide a direct URL
- If upload fails, show the error and suggest trying a different image URL
