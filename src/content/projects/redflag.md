---
# Basic metadata
title: "RedFlag"
slug: "redflag"
date: "2026-02-01"
date_pretty: "Feb 01, 2026"
description: "An AI-powered scam detection tool that puts threat intelligence in the hands of everyday consumers."
importance: 1
type: "project"

# Hero/cover section
hero:
  image: "assets/redflag.png"
  alt: "RedFlag - An AI-powered scam detection tool with screenshot analysis, QR code scanning, and link verification."
  link: "https://redflag-bay.vercel.app"
  link_text: "Try RedFlag"

# Project metadata
project:
  tags:
    - "app"
    - "ai"
    - "gemini api"
    - "fraud detection"

# SEO and additional metadata
seo:
  keywords:
    - "RedFlag"
    - "Scam Detection"
    - "Fraud Detection"
    - "AI Agent"
    - "Gemini API"
    - "Phishing Detection"
    - "Consumer Security"
  og_image: "assets/redflag.png"
---

Fraud is rampant. The US loses approximately US$34 million daily to scams; in Taiwan, the figure is US$8–9 million. Scam tactics are everywhere — and AI is helping bad actors become more sophisticated, more convincing, and harder to detect.

If AI is making offense better, we need to make defense better too. That's why I created RedFlag — a threat detection and risk assessment tool that puts the power of AI-driven scam analysis directly into the hands of everyday consumers.

## What It Does

RedFlag is a universal fraud detector. Screenshot a suspicious message or URL, or scan a QR code — an agentic Gemini investigation runs real security tools behind the scenes (WHOIS, DNS/GeoIP, Google Safe Browsing), then cross-references the technical evidence against the content's claims to surface red flags.

RedFlag explains fraud through a 3-step narrative: the **hook** (what lured you), the **MO** (how the scam operates), and the **risk signals** (the technical evidence that proves it). Every fact shown in the UI — domain age, registrar, server location, registrant — comes from real API data, not model generation. The app works in 8 languages and auto-detects the user's locale.

Drawing from my experience as a fraud analyst — building risk frameworks, fraud rules, and data infrastructure for enterprises — I mapped the consumer scam landscape into three core threat types:

- **Phishing Links** — Fraudulent URLs designed to steal credentials or personal data by impersonating trusted websites, from crude fakes to near-perfect replicas of banking portals and government services.
- **QR Code Scams** — A growing attack vector where malicious links hide behind QR codes. The consumer sees a seemingly legitimate code on a poster, in a message, or at a payment terminal, but scanning it redirects them to a phishing site.
- **Social Engineering Scams** — Scams delivered through conversation: chat messages, SMS, emails, paper mail, or in-app messages. These rely on psychological manipulation — urgency, authority, fear, or trust — rather than technical exploits, making them the hardest to detect and the most damaging.

## How I Built It

- **Frontend:** React 19 + TypeScript SPA with Vite, Tailwind CSS, and Framer Motion
- **Backend:** Vercel serverless functions with a single `/api/analyze` endpoint
- **AI:** Gemini Interactions API (agentic multi-turn loop) — Gemini autonomously decides which security tools to call, executes them in parallel, then reasons across all results to produce a bilingual fraud analysis
- **Intelligence Tools:** 4 backend tools (DNS/GeoIP, RDAP with registrar referral chain, Google Safe Browsing, homograph detection) that Gemini calls as needed
- **Trust Layer:** Server-side `buildVerifiedFromToolResults()` constructs a verified data object from raw tool output, completely independent of the model's JSON response
- **Logging:** Supabase for fire-and-forget analysis logging and user feedback tracking
- **i18n:** Custom React Context provider with 8 locale files and browser language auto-detection

## Challenges I Ran Into

**Reliable phishing detection.** I discovered that WHOIS data and other publicly available domain intelligence can be used reliably for detection — domain age, registrar history, and hosting location tell a story before you ever load the page.

**Building a unified analysis pipeline.** I initially built three separate API calls for each feature. Then I realised that these three checks are inherently similar — a URL is a URL whether it was typed, scanned from a QR code, or extracted from a screenshot. Switching to the Gemini Interactions API's agentic capabilities let the model decide which tools to call, eliminating redundant code and producing smarter, more context-aware analysis.

**Designing for global users.** A user's language and location are independent from the scam's language and origin. A Singaporean travelling in Taiwan might encounter a Chinese-language fraud but still want to read the analysis in English — or in Chinese. The solution was dual-language output: analyse in the scam's native language for accuracy, then present in the user's preferred language for clarity.

## What I'm Proud Of

**From manual rules to agentic orchestration.** Traditional fraud detection requires understanding each category of fraud, learning its patterns, then manually creating data features or ML models to detect them. With RedFlag, the paradigm shifts — orchestrating an AI agent with the right tools means the system can reason across fraud categories rather than being hard-coded for each one.

**The 3-step fraud narrative.** Hook, MO, and risk signals make fraud understandable to non-technical users. It's not a risk score — it's a story that teaches people how scams actually work, with actionable next steps they can take immediately.

**Geo-mismatch detection.** Cross-referencing server hosting country against registrant country against the brand being impersonated catches sophisticated phishing that no single check would flag.

**The verified data layer.** Gemini reasons about fraud, but the Digital Fingerprint grid shows only real data from actual API responses. This separation means users never see hallucinated facts — a "registered 3 days ago" claim is provably true.

**Screenshot-first input.** Asking someone to paste a suspicious link — and risk accidentally clicking it — defeats the purpose. This was a design decision rooted in user safety.

**Dual-mode fallback.** The Interactions API is in beta and can fail. I built a complete legacy path using `generateContent` that shares the same system prompt, response schema, and verified data pipeline — so if the agentic path errors, users still get a full analysis without knowing anything went wrong.

## What I Learned

- **Agentic AI is a paradigm shift.** Letting the model drive tool selection produces smarter, more adaptive analysis than pre-calling everything or routing through separate APIs.
- **Open infrastructure is underrated.** Free tools like IANA RDAP, DNS-over-HTTPS, and GeoIP databases can replace expensive commercial threat intel APIs for most fraud detection use cases.
- **Security hygiene matters in consumer apps.** Moving API keys from client-side to server-side, implementing rate limiting, and supporting multi-language output were all lessons learned through building rather than theory.

---

- [Try RedFlag](https://redflag-bay.vercel.app)
- [Architecture](https://redflag-bay.vercel.app/#/architecture)
