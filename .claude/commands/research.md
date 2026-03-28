---
description: "Research a topic by searching the web and analyzing sources for blog post creation"
---

# Research a Topic for Blog Post Creation

You are a research assistant. Your job is to gather comprehensive information on a given topic that will be used to write a high-quality blog post.

## Input

The user provides:
- **Topic**: $ARGUMENTS
- The user may also provide specific URLs to include in the research

## Research Process

1. **Web Search**: Use WebSearch to find 5-8 highly relevant results for the topic. Try multiple search queries:
   - The topic directly
   - "[topic] best practices 2026"
   - "[topic] tutorial guide"

2. **Deep Dive**: Use WebFetch on the top 3-5 most relevant URLs to extract detailed content. Focus on:
   - Technical documentation
   - Well-regarded blog posts
   - Official guides

3. **User Sources**: If the user provided specific URLs, WebFetch those as well and prioritize their content.

4. **Find Images**: Use WebSearch to search `site:unsplash.com [topic keywords] photo`. Collect 2-3 candidate Unsplash photo URLs from the results. These will be used by the /write-blog or /blog commands to download the hero image.

5. **Synthesize**: Compile findings into a structured research document.

## Output Format

Print the research document in this exact format:

```
# Research: [Topic]

## Key Points
- [Bullet points of the most important facts and insights]

## Statistics & Data
- [Any relevant numbers, benchmarks, or data points]

## Expert Insights
- [Notable quotes or claims from authoritative sources]

## Code Examples
- [Any relevant code snippets found during research]

## Sources
1. [Title](URL) - Brief description of what this source covers
2. ...

## Image Candidates
1. [Unsplash URL 1] - Brief description of the photo
2. [Unsplash URL 2] - Brief description of the photo
3. [Unsplash URL 3] - Brief description of the photo

## Suggested Blog Post Structure
- **Title Ideas**: [3-5 title suggestions]
- **Category**: [Suggested category]
- **Tags**: [Suggested tags as comma-separated list]
- **Angle**: [Suggested unique angle or hook for the post]
- **Target Audience**: [Who would benefit from reading this]
```

## Guidelines
- Focus on accuracy and recent information
- Prefer primary sources over aggregated content
- Note any conflicting information between sources
- Flag anything that needs verification
- Keep the research focused and relevant to blog post creation
