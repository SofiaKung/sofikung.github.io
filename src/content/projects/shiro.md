---
# Basic metadata
title: "Shiro"
slug: "shiro"
date: "2026-01-16"
date_pretty: "Jan 16, 2025"
description: "My personal AI assistant powered by the Claude Agent SDK—built to prioritize, unblock, and keep me accountable."
importance: 1
type: "project"

# Hero/cover section
hero:
  image: "assets/shiro.png"
  alt: "Shiro - A personal AI assistant built with Claude Agent SDK and Notion integration."

# Project metadata
project:
  tags:
    - "ml"
    - "AI Agent"
    - "Claude SDK"
    - "Python"

# SEO and additional metadata
seo:
  keywords:
    - "Shiro"
    - "AI Assistant"
    - "Claude Agent SDK"
    - "Notion Integration"
    - "Personal AI"
    - "MCP"
  og_image: "assets/shiro.png"
---

As someone constantly juggling new ideas, I suffer from "context overflow." Just like an AI agent. I'm often managing multiple projects, scattered research, and half-finished thoughts—the constant context switching was killing my productivity.

To solve this, I first built Mind Lake—a centralized knowledge system in Notion. It's my single source of truth for every idea, project, and learning. It helped, but it wasn't enough. I realized I didn't just need a place to store info; I needed a system that understood my 2026 goals well enough to prioritize and unblock work for me.

So, I spent the last 5 days building Shiro: my personal AI assistant powered by the Claude Agent SDK.

## What Shiro Can Do

- **Telegram Interface:** I interact with Shiro via text, treating him like a high-level employee.
- **Notion Integration:** He searches my Notion workspace to prioritize tasks based on my specific goals and deadlines.
- **Content Creation:** Draft content for me based on my latest learning in my project.
- **Active Unblocking:** Shiro asks why tasks are stalling and takes initiative—doing the research or suggesting ways to unblock it.
- **Daily Accountability:** He sends a priority reminder every morning and a "check-in" every night to keep me on track.
- **Self-Evolving Memory:** He learns from my patterns and develops new Claude Skills (modular prompts) to grow his own capabilities.

**Tech Stack:** Python, Claude Agent SDK, Model Context Protocol (MCP), Docker, Fly.io

## Why Build This?

You would say why build an AI agent when some of the above can be achieved by Claude chat and Notion MCP? I have learnt so much in the past 5 days building this AI agent and it amazed me.

## What I Learned Shipping It

**Agentic Minimalism:** Don't give your AI agents all the tools and let them pick from it. Define the tools well and when to use them. For example, when it comes to getting data from Notion, MCP is not the best way to get all my active tasks, it was way slower than direct Notion API, in the end I used a hybrid approach.

**The Permission Guardrail:** Early on, I gave Shiro full file write permissions. I was baffled to find new Python files appearing in my local project—turns out Shiro was building his own toolkit to do a better job! I had to implement strict guards. Now, he can only edit his memory and skills, but he cannot touch his core functions (Python files).

**Dynamic nature of AI Agents:** AI agent develops and grows, it would update its learnings and skills on the VM- syncing the ai agent would be key.

---

Building Shiro has completely evolved my understanding of AI development.

I had so much fun building this, can't wait to share more! Next would be to use a vector db for memory.
