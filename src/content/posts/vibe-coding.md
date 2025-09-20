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
  # - "Learning"

# SEO and additional metadata
seo:
  keywords:
    - "AI portfolio building"
    - "prompt engineering"
    - "vibe coding"
    - "Astro framework"
---

## The Discovery Process: Learning What to Ask

I started building with a Wix resume template as inspiration, asking LLM questions as I went. While this iterative approach worked, I only realized what I truly wanted to build after several rounds of implementation.

The process taught me something valuable: I should have first considered which framework, design principles and content management strategy to adopt.

When I realized that I needed markdown support for blog posts, I had to migrate frameworks—not because I didn't plan, but because I didn't know the right questions to ask initially.

## AI Can't Give You Taste (And That's Your Advantage)

I built my entire first draft before seeking feedback. My software engineer friends delivered the verdict: "This looks like a resume. You might as well not build one."

They followed up with portfolio references that worked—minimalistic, functional designs that matched my goals. After studying these examples, I wasted another day to rebuild the entire homepage.

**Questions to ask on Design & Taste**

- What 3 websites do I want mine to look and feel like?
- What specific features do I love? (Navigation, color schemes, layout, animations)
- What’s the main thing I want visitors to do? (Contact me, view my work, read my writing)

## Industrial Standards Require Explicit Specification

LLMs build like enthusiastic juniors—functional but lacking production standards. They won't automatically include:

- CSS variables for consistent styling
- Mobile responsiveness
- Clean code architecture
- Comprehensive README

**Key learning:** Ask for all of the above explicitly.

## Prompting Tools and Techniques That Worked for Me

I started with Claude, hit rate limits, then switched to Codex (ChatGPT Plus). But real progress came when I switched from terminal-based prompting to IDE plugin integration.

The VS Code plugin was easy to use—it allowed me to upload reference images easily, reviewing conversation history was seamless, and iterating on code became efficient.

I also discovered that:

- **Screenshot-to-code translation**: Codex could convert UI screenshots into functional code with ~80% accuracy.
- **Debugging specificity**: Basic HTML/CSS knowledge helped me give precise feedback.
- **Planning vs. agent mode**: Define requirements in planning mode before implementing in agent mode to prevent unnecessary rework.

## The Main Purpose of the Website Shapes Your Technical Architecture

My portfolio's core function is showcasing projects and writing, hence my friend suggested GitHub markdown as it is easy to maintain and straightforward.

The issue was that my vanilla HTML/CSS architecture couldn't handle markdown gracefully. Every new post triggered layout bugs.

I learned that the type of website you are building directly influences your technical stack. This should be among the first questions to ask at the beginning.

This led me to discover Astro framework, which excels at markdown-based sites with native support, file-based routing, and optimized static generation. The framework choice should align with your content strategy, not the other way around.

## Additional Learnings

Building this project taught me topics beyond my existing web development knowledge:

- **Version control fluency**: Writing meaningful commit messages and revisiting Git workflows
- **Deployment processes**: Learning Astro-specific deployment patterns and hosting considerations
- **CMS ecosystem knowledge**: Understanding the spectrum from file-based to headless CMS solutions

## The Questions I Wish I'd Asked First

Based on this experience, here are the essential questions to ask beforehand:

### Design & Vision

- What 3 websites do I want mine to look and feel like?
- What specific features do I love? (Navigation, color schemes, layout, animations)
- What's the main thing I want visitors to do? (Contact me, view my work, read my writing)

### Content Strategy

- **Update frequency affects framework choice**:
  - Daily/weekly → fast and simple (Astro with markdown)
  - Monthly → static generation is fine
- **Update method determines tech stack**:
  - Markdown → Astro, Next.js
  - JSON → Static generators
  - CMS → Headless CMS + framework
- **Visitor interaction needs shape hosting**:
  - None → Static hosting (GitHub Pages, Netlify)
  - Comments/forms → Backend services or integrations
  - Accounts → Database + auth system

### Technical Foundation

- Do I want a simple blog, a portfolio showcase, or something more complex?
- Where will I host this? (GitHub, Vercel, etc.)
- How will I handle version control? (GitHub Desktop, Git basics)

### Quality Standards

- What are the key steps to ensure good code? (Fast loading, responsive, clean code)

## Reflection

Working on this vibe coding project was incredibly rewarding. While some rework was inevitable, the learning made it worthwhile. I hope this framework helps you build faster and more intentionally on your next project.

Happy building!
