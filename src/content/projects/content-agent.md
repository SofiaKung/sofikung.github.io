---
# Basic metadata
title: "Content Agent"
slug: "content-agent"
date: "2025-12-01"
date_pretty: "Dec 01, 2025"
description: "I built a content agent that writes for me—here's the 4-step system that actually worked."
importance: 1
type: "project"

# Hero/cover section
hero:
  image: "assets/content-agent.png"
  alt: "Content Agent - An AI-powered content writing system with evaluation loops."

# Project metadata
project:
  tags:
    - "ai"
    - "n8n"
    - "notion"

# SEO and additional metadata
seo:
  keywords:
    - "Content Agent"
    - "AI Writing"
    - "Content Strategy"
    - "LinkedIn Content"
    - "LLM"
  og_image: "assets/content-agent.png"
---

I built a content agent that writes for me. The first few posts? Generic LinkedIn posts that sound fake.

The problem was we are not giving enough details for LLM to write specifically to your context, audience and your actual experience.

Here's the 4-step system that actually worked:

## Step 1: Define your content strategy

- Figure out for your profile what kind of content (topic, angle, pain point) your audience is interested in.
- The content pillar types - Storytelling posts, product updates, educational threads, project showcases.
- Pick a voice to write in.
- Generic writing instructions = generic output.

## Step 2: Topic generation with evaluation loops

- Then I feed my content strategy + web search context into the LLM for topic ideas depending what I want to write about.
- But here's the key: I manually review and record selected topics in a structured format. This is going to be used to improve my prompt strategy over time.

## Step 3: Write with post-type-specific instructions

- For each selected topic, the agent writes using the exact template for that content pillar type.
- Push the drafts to my Notion for my review.

## Step 4: Feed in your content vault

- Then I feed these drafts with my own content from my content vault.
- Rewrite the content with a click of a button from my Notion page and then evaluates its own output and reflects on style accuracy before updating the rewritten content in same page.

## Step 5: Competitive analysis on autopilot (Working on it)

- To scrape my own LinkedIn for performance data, then scrape top voices in my space. The agent analyzes their content strategy and suggests style elements worth adopting.

---

The game-changer? **Treating content agents as your co-author as you open your content vault for it to write on and treating evals as a core feature, not an afterthought.**
