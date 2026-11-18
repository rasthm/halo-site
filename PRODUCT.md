# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owners and managers of small and growing businesses (roughly 5–200 people), India first; GCC, UK and US clients are welcome but secondary. They are not technical. They arrive wanting more done without more hires: a website that brings enquiries, an app their team needs, or relief from repeated work (quotes, follow-ups, reports, data entry, copying between tools). They decide on trust and on expected return in hours and money.

## Product Purpose

Halo Automations is a build studio. One team designs and ships websites, web apps and MVPs, automations and AI agents, integrations between existing tools, APIs and MCP servers, narrated reels, and a private "company brain" (an AI that learns the business from sources the client picks and answers staff by role). Success for a visitor: they understand Halo builds all of this, believe it will pay back, and book a call or send an enquiry.

## Positioning

A studio for the whole system, not a single platform product: the same team builds the site people find you on, the apps your team works in, and the automations and AI that take repeated work off desks. Results are measured: a written baseline in week one, hours saved in the weekly report during the pilot, money saved by months two and three. Clients own the code, data and accounts.

Must stay clearly distinct from Ant Venture (antventure.ai, a client site built by the founder in Desktop/antventure): Ant Venture is one enterprise/government platform (ROLE:X) out of Dubai. Halo must not reuse its story beats (scattered CRM/ERP tiles as the lead, "8–12 disconnected systems", agents-with-approval as the headline, region lines like "India · GCC · UK"), nor its look.

## Operating Context

Visitors come from WhatsApp shares, Instagram (account planned, not live), the founder's portfolio and search. Many will read on a phone. Next steps offered: book a call (desk booking link when set, otherwise the contact page), the enquiry form (goes to the founder's desk worker), or WhatsApp +91 75590 35930.

## Capabilities and Constraints

- Stack: Vite + React 19, pre-rendered to static HTML per page, served by a Cloudflare Worker (wrangler) that also receives enquiries and serves live prices/booking link. GSAP for scroll motion, loaded after first paint. Fonts self-hosted.
- Pages: home, company brain, agents, how we work, work, about, contact, privacy, 404. A pricing page exists but prices are **not advertised**: it stays out of nav, home, footer, sitemap, llms.txt and structured data.
- No cookies, no analytics, no trackers.
- All copy lives in src/content.ts.
- Timelines that may be stated (from the packages): launch page 3–5 days, agent/API build 2–3 weeks, MVP sprint 3–4 weeks.

## Brand Commitments

- Name: Halo Automations (short: Halo). Logo: the ring-over-HALO wordmark (public/logo.svg, src/logo.ts). Its shape stays; its colour follows the current palette (owner, 18 Nov 2026).
- No colour or light/dark commitment: the owner opened the palette and background completely for the second redesign (18 Nov 2026). The neon world was replaced, not kept.
- Page structure is open as well; product facts, positioning, the no-pricing rule and the no-invented-proof rule stay.
- Voice: plain, direct, no hype; explains terms; one idea per sentence.
- Founder stays visible: Rasthm, founder, India, with photo and the cards video on About.
- Halo reels use the brand and a narrator voice, never the founder's own voice.

## Evidence on Hand

- Shipped projects (src/content.ts `projects`, images in public/work/): AI agent team & company brain (built with Zaper, private), Casper voice assistant, Migration-in-a-box (live), Yoga Reels API + MCP (8 reels ordered through the API), ORBIT.FM (live), FoodKavach/Zoitic, FSSAI Lookup, Silent Earth (live game), KPerfume Bliss and Collection (live concept sites), KPerfume NOIR reel.
- Sourced industry statistics already on the site (Panopto/YouGov 2018, Workday/Harris Poll 2026, Cyberhaven 2023).
- **No client testimonials, client result numbers or client logos exist. Never invent them.** The savings calculator multiplies the visitor's own inputs and is labelled an estimate.

## Product Principles

1. Breadth with one owner: every service comes from the same team, so the pieces fit.
2. Numbers over adjectives: show what will be measured and when, never promised results.
3. Show real work: shipped, linkable projects are the proof.
4. The client stays in control: they choose what AI may read, a person approves what matters, and they own what is built.
5. Plain words for non-technical owners.

## Accessibility & Inclusion

Readable on low-end Android phones and slow connections; motion respects reduced-motion; WCAG AA contrast.
