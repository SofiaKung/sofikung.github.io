---
# Basic metadata
title: "What I Learned Vibe Coding My Portfolio in 4 Days"
slug: "vibe-coding-portfolio"
date: "2025-09-20"
date_pretty: "Sep 20, 2025"
description: "Lessons on taste, prompting, frameworks, and building a portfolio website with Codex"
type: "post"

tags:
  - "Vibe Coding"
  - "Prompting"
  # - "Portfolio"
  - "Learning"

# SEO and additional metadata
seo:
  keywords:
    - "AI portfolio building"
    - "prompt engineering"
    - "vibe coding"
    - "Astro framework"
---

## The Discovery Process: Learning What to Ask

I started building this portfolio website with a Wix resume template as inspiration, asking LLM questions as I went. While this iterative approach worked, I only realized what I truly wanted to build after several rounds of implementation.

The process taught me something valuable: I should have first considered which framework, design approach and content management strategy to adopt.

When I realized that I needed markdown support for blog posts, I had to migrate to a new framework—not because I didn't plan, but because I didn't know the right questions to ask initially.

## AI Can't Give You Taste

AI can only build what you ask for. Since I based my design on a resume-like template, my software engineer friends told me: "This looks like a resume. You might as well not build one."

They gave me a few portfolio references that worked—minimalistic, compact, and functional designs that matched my goals. After studying these examples, I spent another day rebuilding the entire homepage based on the new reference.

That's when I realized I needed to define my taste, styling, and purpose clearly before starting—because the effort to rebuild is high. (The specific questions I should have asked are covered in my framework below.)

## Trial and Error: What Works for AI-Assisted Coding

I started with Claude, hit rate limits, then switched to Codex (ChatGPT Plus). But real progress came when I switched from terminal-based prompting to the Codex plugin in VS Code.

The VS Code plugin was easy to use—it allowed me to upload reference images easily, made reviewing conversation history seamless, and made iterating on code efficient.

I discovered that:

- **Screenshot-to-code translation**: Codex could convert UI screenshots into functional code with ~80% accuracy. You can also paste website URLs into your prompt as reference.
- **Debugging specificity**: Basic HTML/CSS knowledge helped me give precise feedback. Codex understands better when you say 'Move the experience-description into the first column of the grid' than 'Move the experience-description to the left side of the box.'
- **Planning vs. agent mode**: Define requirements in planning mode before implementing in agent mode to prevent unnecessary rework.

## Building Production-Quality Code with AI

While building this project, I faced another challenge: getting AI to write quality code. LLMs build like enthusiastic juniors—functional but lacking production standards. They won't automatically include:

- CSS variables for consistent styling
- Mobile responsiveness
- Automated code cleaning whenever you rebuild or migrate frameworks
- Comprehensive README
- Logical file organization based on your web framework
- Creating reusable page templates and components to keep your styling consistent

You have to ask for all of the above explicitly.

## Your Website's Purpose Determines Your Tech Stack

Just when I thought I was done building, I hit a fundamental problem: I had chosen the wrong tech stack. Adding new content meant updating JSON files, which quickly became cumbersome to maintain.

My friend suggested using GitHub markdown as an easier solution, but my vanilla HTML/CSS setup couldn't handle markdown files gracefully. Every new post triggered layout bugs.

That's when I learned that your website's purpose should drive your tech stack choice—this should be the first question you ask. I needed a framework built for markdown content, which led me to Astro with its native markdown support, file-based routing, and static generation.

### Additional Learnings

Beyond the core lessons, this project taught me about other development skills.

- **Version control fluency**: Writing meaningful commit messages and revisiting Git workflows
- **Deployment processes**: Learning Astro deployment and hosting options
- **CMS ecosystem knowledge**: Understanding different types of CMS systems from file-based to headless CMS solutions

## &nbsp;

---

## The Questions I Wish I'd Asked First

Ask these questions before building anything:

#### Design & Vision

- What websites do I want mine to look and feel like? Pick 1 or 2 websites
- What specific elements do I want to steal? (Screenshot specific elements: nav style, button design, color palette, typography)
- What’s the main thing I want visitors to do? (Contact me, view my work, read my writing)
- What's my content hierarchy? (What should visitors see first, second, third?)

#### Tech Stack & Tools

- Do I want a simple blog, a portfolio showcase, or something more complex?
- Where will I host this? (GitHub, Vercel, etc.)
- How will I handle version control? (GitHub Desktop, Git basics)

#### Content Strategy

- How often I update affects framework choice:
  - Daily/weekly → fast and simple (Astro with markdown)
  - Monthly → static generation is fine
- How I update determines tech stack:
  - Markdown → Astro, Next.js
  - JSON → Static generators
  - CMS → Headless CMS + framework
- Visitor interaction needs affect hosting decisions:
  - None → Static hosting (GitHub Pages, Netlify)
  - Comments/forms → Backend services or integrations
  - Accounts → Database + auth system

#### Quality Code

- What are the key steps to ensure my code is good? (Fast loading, responsive, clean code)

## Reflection

Working on this vibe coding project was incredibly fun. While some rework was inevitable, the learning made it worthwhile. I hope this framework helps you build faster and more intentionally on your next project.

Happy building!
