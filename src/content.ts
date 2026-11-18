/**
 * Every word on the site lives here. Facts about projects, skills and the timeline come from the
 * portfolio (rasthm-portfolio/src/content.ts); only the voice changes. Never add a number, client,
 * result or person that is not in the portfolio. The savings calculator only multiplies the visitor's own
 * inputs; it is labelled as an estimate and never shown as a client result.
 */

export const SITE = 'https://halo-automations.orbit-fm.workers.dev';

/** The Halo Instagram account. While this is empty, every Instagram link shows "coming soon". */
export const INSTAGRAM_URL = 'https://www.instagram.com/haloautomations/';
export const INSTAGRAM_HANDLE = '@haloautomations';

export const brand = {
  name: 'Halo Automations',
  short: 'Halo',
  line: 'Everything your business runs on, built by one team.',
  what: 'Halo Automations is a build studio for growing businesses: websites, web apps, automations and AI agents, integrations and a private company brain, with the results measured in hours and money.',
};

export const founder = {
  name: 'Rasthm',
  role: 'Founder',
  base: 'India',
  photo: {
    small: '/portrait/rasthm-800.webp',
    large: '/portrait/rasthm-1400.webp',
    width: 1400,
    height: 933,
    alt: 'Rasthm, founder of Halo Automations, in a charcoal suit, looking down at a deck of red-edged cards',
  },
  video: {src: '/portrait/rasthm-flow.mp4', poster: '/portrait/rasthm-flow-poster.webp', label: 'Rasthm fanning and throwing a deck of cards, an 8-second clip'},
  whatsapp: {
    handle: '+91 75590 35930',
    url: `https://wa.me/917559035930?text=${encodeURIComponent('Hi, I saw the Halo Automations website and I’d like to talk about a project.')}`,
  },
  github: {handle: 'rasthm', url: 'https://github.com/rasthm'},
  portfolio: 'https://rasthm.orbit-fm.workers.dev',
};

export const nav = [
  {label: 'Services', href: '/#services'},
  {label: 'Results', href: '/#results'},
  {label: 'Company brain', href: '/brain/'},
  {label: 'Work', href: '/work/'},
  {label: 'About', href: '/about/'},
];

export const footerNav = [
  {label: 'Services', href: '/#services'},
  {label: 'Company brain', href: '/brain/'},
  {label: 'Agents', href: '/agents/'},
  {label: 'How we work', href: '/how-we-work/'},
  {label: 'Work', href: '/work/'},
  {label: 'About', href: '/about/'},
  {label: 'Contact', href: '/contact/'},
  {label: 'Privacy', href: '/privacy/'},
];

/* ------------------------------------------------------------------ pages and their meta */

export type PageId = 'home' | 'brain' | 'agents' | 'how' | 'work' | 'pricing' | 'about' | 'contact' | 'privacy' | 'notfound';

export const pages: {id: PageId; path: string; title: string; description: string}[] = [
  {
    id: 'home',
    path: '/',
    title: 'Halo Automations · Websites, automations and AI for growing businesses',
    description:
      'One studio for everything your business runs on: websites, web apps, automations and AI agents, integrations and a private company brain. You see the hours and money saved from the first weeks.',
  },
  {
    id: 'brain',
    path: '/brain/',
    title: 'The company brain · Halo Automations',
    description: 'What the Halo company brain learns, who can see what, where your data lives and how it stays current. Try the brain settings yourself.',
  },
  {
    id: 'agents',
    path: '/agents/',
    title: 'AI agents and automations · Halo Automations',
    description: 'Six agents we build on top of your company brain: quotes, follow-ups, reports, support triage, document intake and CRM to ERP sync. Each one shows where a person approves.',
  },
  {
    id: 'how',
    path: '/how-we-work/',
    title: 'How we work · Halo Automations',
    description: 'Discovery call, map one workflow, build a pilot, then run, measure and extend. What you give, what we give, and how your data stays safe at every step.',
  },
  {
    id: 'work',
    path: '/work/',
    title: 'Work · Halo Automations',
    description: 'Real, shipped projects: AI agent teams, a voice assistant, document tools, APIs with MCP servers, web apps and sites. Live links open the real thing.',
  },
  {
    id: 'pricing',
    path: '/pricing/',
    title: 'Pricing · Halo Automations',
    description: 'Pick a package and add-ons and see the total: launch pages, MVP sprints, AI agent and API builds, plus a monthly care plan. Company brains are scoped on a call.',
  },
  {
    id: 'about',
    path: '/about/',
    title: 'About · Halo Automations',
    description: 'Halo Automations is a build studio for websites, apps, automations and AI, founded by Rasthm, a full-stack developer and AI builder in India. The disciplines, the tools and the work so far.',
  },
  {
    id: 'contact',
    path: '/contact/',
    title: 'Contact · Halo Automations',
    description: 'Tell us about the workflow you want to fix. Send the form, message us on WhatsApp or book a call.',
  },
  {
    id: 'privacy',
    path: '/privacy/',
    title: 'Privacy · Halo Automations',
    description: 'What this website collects, why, where it goes and how to have it deleted. No cookies, no trackers.',
  },
];

/* ------------------------------------------------------------------ the story */

export const hero = {
  kicker: 'Websites · Automations · AI · Integrations',
  title: ['Everything your', 'business runs on,'],
  accent: 'one team.',
  sub: 'Websites, apps, automations and AI, measured in hours and money.',
  for: 'For founders and growing teams who want more done without more hires',
};

/* ------------------------------------------------------------------ services */

export type Service = {id: string; n: string; name: string; short: string; line: string; gets: string[]; live: string; measure: string; href: string; proof: string};

/** What Halo builds. Each "proof" is a project id from the Work page. */
export const services: Service[] = [
  {
    id: 'websites',
    short: 'Websites',
    live: '3–5 days',
    n: '01',
    name: 'Websites & landing pages',
    line: 'Fast, good-looking sites that explain what you do and bring in enquiries.',
    gets: ['Design, copy edit and motion', 'Phone and laptop layouts', 'Enquiry form straight to you'],
    measure: 'Enquiries per week, page speed',
    href: '/work/#kperfume-collection',
    proof: 'kperfume-collection',
  },
  {
    id: 'apps',
    short: 'Web apps',
    live: '3–4 weeks',
    n: '02',
    name: 'Web apps & MVPs',
    line: 'Logins, dashboards, reminders and roles, on a real database.',
    gets: ['Core screens and flows', 'Database and server code', 'Weekly working previews'],
    measure: 'Active users, tasks done in the app',
    href: '/work/#foodkavach',
    proof: 'foodkavach',
  },
  {
    id: 'automations',
    short: 'Automations',
    live: '2–3 weeks',
    n: '03',
    name: 'Automations & AI agents',
    line: 'The quotes, follow-ups, reports and data entry your team repeats, done for them.',
    gets: ['One job per agent, written down', 'A person approves what matters', 'Every action logged'],
    measure: 'Hours saved, tasks done, reply time',
    href: '/agents/',
    proof: 'ai-agent-team',
  },
  {
    id: 'brain',
    short: 'Company brain',
    live: 'Scoped on a call',
    n: '04',
    name: 'Company brain',
    line: 'A private AI that knows your business and answers your team in seconds.',
    gets: ['Learns only the sources you pick', 'Answers by role, never more', 'Stays yours, never trains public AI'],
    measure: 'Questions answered, time per answer',
    href: '/brain/',
    proof: 'ai-agent-team',
  },
  {
    id: 'integrations',
    short: 'Integrations',
    live: '2–3 weeks',
    n: '05',
    name: 'Integrations & data sync',
    line: 'Your CRM, accounts, sheets, inboxes and WhatsApp, finally talking to each other.',
    gets: ['Connectors to the tools you have', 'No more copy and paste', 'Messy files turned into clean data'],
    measure: 'Entries typed by hand, errors caught',
    href: '/work/#migration-in-a-box',
    proof: 'migration-in-a-box',
  },
  {
    id: 'apis',
    short: 'APIs & reels',
    live: '2–3 weeks',
    n: '06',
    name: 'APIs, MCP & content',
    line: 'APIs other apps call, MCP servers so AI can use your tools, and reels made on demand.',
    gets: ['Documented, keyed APIs', 'MCP servers for AI assistants', 'Narrated reels from one request'],
    measure: 'Requests served, content shipped',
    href: '/work/#yoga-reels-api',
    proof: 'yoga-reels-api',
  },
];

/* ------------------------------------------------------------------ results */

export const results = {
  label: 'What you gain',
  title: ['Numbers you can check.', 'not promises.'],
  intro:
    'Before we build, we write down your starting point: how many hours the work takes, how fast you reply, how many mistakes slip through. Then every week you see the same numbers again, next to the work we did.',
  timeline: [
    {
      when: 'Week 1',
      title: 'Week 1: your baseline, in writing',
      text: 'We measure the work as it is today: hours spent, reply times, errors, enquiries lost. A launch page can already be live in 3–5 days.',
      numbers: ['Hours per week on the task', 'Reply time today', 'Errors per week'],
    },
    {
      when: 'Weeks 2–4',
      title: 'Weeks 2–4: the first hours come back',
      text: 'The pilot runs on your real work, usually live within 2–3 weeks. A weekly report shows what it did, the minutes saved per task and what a person still checked.',
      numbers: ['Tasks done for you', 'Minutes saved per task', 'Reply time now'],
    },
    {
      when: 'Months 2–3',
      title: 'Months 2–3: savings in money',
      text: 'Hours saved times what those hours cost, compared with the baseline. The numbers decide the next workflow, not us.',
      numbers: ['Money saved per month', 'Hours back per person', 'Next workflow, by payback'],
    },
  ],
  calc: {
    label: 'Savings estimate',
    title: 'What is the repeated work costing you?',
    note: 'An estimate from your own numbers. In the pilot we replace it with the real figure, measured against your baseline.',
    anchor: {text: 'Nearly 1 in 3 workers spends 7+ hours a week copying and reconciling data between systems.', source: 'Workday / Harris Poll, 2026'},
  },
  report: {
    title: 'In your weekly report',
    items: ['Hours saved', 'Tasks completed', 'Reply time', 'Errors caught', 'Enquiries answered', 'Money saved'],
  },
};

/** Currencies for the savings calculator, with a starting cost per hour for each (the visitor changes it). */
export const currencies = [
  {id: 'INR', symbol: '₹', rate: 400, locale: 'en-IN'},
  {id: 'USD', symbol: '$', rate: 15, locale: 'en-US'},
  {id: 'AED', symbol: 'AED ', rate: 55, locale: 'en-US'},
  {id: 'GBP', symbol: '£', rate: 15, locale: 'en-GB'},
];

export const stats = {
  label: 'The cost of scattered knowledge',
  lead: ['People leave.', 'Systems don’t talk.', 'Data leaks into public AI.'],
  items: [
    {value: '42%', text: 'of what an employee knows is unique to them. When they leave, it leaves with them.', source: 'Panopto / YouGov, 2018'},
    {value: '$47M', text: 'a year lost to poor knowledge sharing at large US companies (average 17,700 staff).', source: 'Panopto / YouGov, 2018'},
    {value: '1 in 3', text: 'workers spend 7+ hours a week copying and reconciling data between systems.', source: 'Workday / Harris Poll, 2026', prefix: 'Nearly'},
    {value: '11%', text: 'of what employees paste into ChatGPT is confidential.', source: 'Cyberhaven, 2023'},
  ],
};

/** The systems that orbit the brain in the signature visual. */
export const systems = [
  {id: 'crm', label: 'CRM', note: 'deals · contacts'},
  {id: 'erp', label: 'ERP', note: 'orders · stock'},
  {id: 'docs', label: 'Docs', note: 'policies · SOPs'},
  {id: 'email', label: 'Email', note: 'shared inboxes'},
  {id: 'chats', label: 'Chats', note: 'team channels'},
  {id: 'sheets', label: 'Sheets', note: 'trackers · reports'},
];

export const brainStory = {
  label: 'Spotlight: the company brain',
  title: ['A brain that knows', 'your business.'],
  steps: [
    {k: '01', title: 'Your knowledge is everywhere', text: 'Deals in the CRM, stock in the ERP, the real process in someone’s head and a sheet only they understand.'},
    {k: '02', title: 'We connect what you choose', text: 'Connectors read the systems you pick, with read-only access first, and nothing else.'},
    {k: '03', title: 'The brain learns the business', text: 'Every fact is labelled with where it came from, kept current, and shown only to the roles allowed to see it.'},
  ],
};

/** Why a company brain pays, in what changes for the team. Each one says what we measure. */
export const brainBenefits = {
  label: 'Why a company brain',
  title: ['What your team gains', 'from day one.'],
  items: [
    {title: 'Answers in seconds', text: 'People ask the brain instead of digging through drives and chats or interrupting a colleague.', measure: 'Time per answer'},
    {title: 'New people up to speed faster', text: 'Prices, SOPs and past decisions are there from the first day, so a new hire doesn’t wait for someone to explain.', measure: 'Days to first solo task'},
    {title: 'Knowledge stays when people leave', text: 'What one person knew is written down, labelled by source and kept current.', measure: 'Questions only one person could answer'},
    {title: 'No more pasting into public AI', text: 'Your team gets an AI that knows the business, in a private store, so confidential data stops leaking into consumer chat apps.', measure: 'Sources connected, access by role'},
  ],
};

/* ------------------------------------------------------------------ brain settings demo */

export type SourceId = 'crm' | 'erp' | 'docs' | 'email' | 'chats' | 'sheets' | 'hr';
export type RoleId = 'sales' | 'finance' | 'ops';

export const demo = {
  label: 'Illustration',
  title: 'Brain settings',
  intro: 'This is how the controls work in a Halo system. Switch sources on and off, then look at the brain through each role.',
  sources: [
    {id: 'crm', label: 'CRM', note: 'Deals, contacts, pipeline', on: true},
    {id: 'erp', label: 'ERP', note: 'Orders, stock, invoices', on: true},
    {id: 'docs', label: 'Shared drive', note: 'Policies, contracts, SOPs', on: true},
    {id: 'email', label: 'Email', note: 'Shared inboxes', on: true},
    {id: 'chats', label: 'Team chats', note: 'Project channels', on: true},
    {id: 'sheets', label: 'Sheets', note: 'Trackers and reports', on: true},
    {id: 'hr', label: 'HR & payroll', note: 'Salaries, reviews, personal files', on: false},
  ] as {id: SourceId; label: string; note: string; on: boolean}[],
  roles: [
    {
      id: 'sales',
      label: 'Sales',
      sees: [
        {text: 'Pipeline, deal history and next steps', source: 'crm'},
        {text: 'Price lists and past quotes', source: 'docs'},
        {text: 'Customer email threads', source: 'email'},
        {text: 'Stock available to promise', source: 'erp'},
      ],
      ask: {q: 'Can we promise 400 units by the 30th?', a: 'Yes. 520 are in stock and 90 are reserved for open orders, so 430 are free. The last quote at this volume was 6% below list.', uses: ['erp', 'docs']},
    },
    {
      id: 'finance',
      label: 'Finance',
      sees: [
        {text: 'Invoices, payments due and overdue', source: 'erp'},
        {text: 'Budgets and monthly forecasts', source: 'sheets'},
        {text: 'Payroll totals by team', source: 'hr'},
        {text: 'Contract payment terms', source: 'docs'},
      ],
      ask: {q: 'What is overdue this month, and why?', a: 'Three invoices are past 30 days. Two are waiting on a delivery sign-off mentioned in the ops channel; one has no reply to two reminders.', uses: ['erp', 'chats']},
    },
    {
      id: 'ops',
      label: 'Ops',
      sees: [
        {text: 'Orders, stock levels and suppliers', source: 'erp'},
        {text: 'SOPs and checklists', source: 'docs'},
        {text: 'Delivery and shift trackers', source: 'sheets'},
        {text: 'Team updates and blockers', source: 'chats'},
      ],
      ask: {q: 'Which orders are at risk this week?', a: 'Four orders depend on one supplier who is two days late. The SOP says to offer a split delivery; the tracker shows two vans free on Thursday.', uses: ['erp', 'docs', 'sheets']},
    },
  ] as {id: RoleId; label: string; sees: {text: string; source: SourceId}[]; ask: {q: string; a: string; uses: SourceId[]}}[],
};

/* ------------------------------------------------------------------ architecture */

export const architecture = {
  label: 'How a Halo system is built',
  title: ['Sources in. Work out.', 'A person in between.'],
  intro: 'Every system we build follows the same path. Your data stays in a store that belongs to you, and nothing reaches the outside world until someone approves it.',
  stages: [
    {id: 'sources', title: 'Sources', items: ['CRM', 'ERP', 'Docs', 'Email', 'Chats', 'Sheets'], tech: 'Your existing tools'},
    {id: 'connectors', title: 'Connectors', items: ['Read-only first', 'Scheduled sync', 'Only the sources you pick'], tech: 'REST APIs · MCP servers · Cron jobs'},
    {id: 'brain', title: 'Company brain', items: ['Private store', 'Permissions per role', 'Audit log'], tech: 'Postgres & RLS on Supabase · Durable Objects'},
    {id: 'agents', title: 'Agents', items: ['Draft quotes', 'Follow up', 'Report', 'Sync data'], tech: 'Claude API · LangGraph · Node.js workers'},
    {id: 'approval', title: 'Human approval', items: ['Approve', 'Edit', 'Reject'], tech: 'A dashboard your team already opens'},
    {id: 'back', title: 'Back into your systems', items: ['CRM updated', 'Email sent', 'Report filed'], tech: 'Same connectors, write access only where approved'},
  ],
  stack: {
    label: 'The stack behind it',
    note: 'The tools we build with, the same ones behind the projects on the Work page.',
    items: ['Cloudflare Workers', 'Durable Objects', 'Supabase', 'Postgres & RLS', 'Claude API', 'LangGraph', 'MCP servers', 'Node.js', 'Next.js 16', 'Cron jobs'],
  },
};

/* ------------------------------------------------------------------ agents */

export type Agent = {
  id: string;
  name: string;
  job: string;
  trigger: string;
  steps: string[];
  approval: string;
  result: string;
  alone: string;
  needsYes: string;
};

export const agents: Agent[] = [
  {
    id: 'quote',
    name: 'Quote agent',
    job: 'Turns an enquiry into a priced quote in minutes.',
    trigger: 'A quote request arrives by email or form',
    steps: ['Reads the request', 'Checks price lists and stock', 'Drafts the quote with past terms'],
    approval: 'Sales checks margin and terms',
    result: 'Quote sent, CRM updated',
    alone: 'Read the request, look up prices, stock and past quotes, draft the document.',
    needsYes: 'Sending the quote to the customer, any discount above your set limit.',
  },
  {
    id: 'followup',
    name: 'Follow-up agent',
    job: 'Makes sure no lead or open quote goes quiet.',
    trigger: 'A deal has no reply for a set number of days',
    steps: ['Reads the thread and deal notes', 'Drafts a follow-up in your tone', 'Suggests the next step'],
    approval: 'The owner of the deal approves or edits',
    result: 'Email sent, next step logged',
    alone: 'Watch deal dates, read the history, draft the message.',
    needsYes: 'Every email that leaves the company.',
  },
  {
    id: 'report',
    name: 'Report agent',
    job: 'Writes the weekly numbers so nobody copies cells on a Monday.',
    trigger: 'Every Monday at 8:00, or on request',
    steps: ['Pulls figures from the ERP and sheets', 'Checks them against last week', 'Writes the summary and flags odd numbers'],
    approval: 'The team lead reviews before it goes out',
    result: 'Report shared with the team',
    alone: 'Collect the figures, compare, draft the report and charts.',
    needsYes: 'Sharing the report outside the team.',
  },
  {
    id: 'triage',
    name: 'Support triage agent',
    job: 'Sorts the support inbox and drafts first answers.',
    trigger: 'A new message reaches the support inbox',
    steps: ['Classifies the request and urgency', 'Finds the answer in your docs', 'Drafts a reply, or routes it to the right person'],
    approval: 'An agent on the team sends or edits the reply',
    result: 'Customer answered, ticket tagged',
    alone: 'Tag, prioritise, find the relevant policy, draft.',
    needsYes: 'Any reply to a customer, any refund or credit.',
  },
  {
    id: 'intake',
    name: 'Document intake agent',
    job: 'Reads invoices, POs and forms, and fills your systems.',
    trigger: 'A PDF, scan or spreadsheet lands in a shared folder',
    steps: ['Reads every line, including scans', 'Matches items to your catalogue', 'Marks each value as printed or filled in'],
    approval: 'Ops checks anything the agent marked unsure',
    result: 'Entries created in the ERP',
    alone: 'Read, extract, match and prepare the entries.',
    needsYes: 'Posting entries to the ERP, any value it could not read clearly.',
  },
  {
    id: 'sync',
    name: 'CRM–ERP sync agent',
    job: 'Keeps customers, orders and invoices the same in both systems.',
    trigger: 'A record changes in either system',
    steps: ['Spots the change', 'Matches the record on the other side', 'Prepares the update and explains any conflict'],
    approval: 'Conflicts go to a person; clean matches follow your rule',
    result: 'Both systems agree, change logged',
    alone: 'Detect changes, match records, prepare updates.',
    needsYes: 'Overwriting data when the two systems disagree.',
  },
];

export const principles = {
  label: 'You stay in control',
  title: ['Built so you can', 'try it safely.'],
  items: [
    {title: 'You choose the sources', text: 'The brain learns only from the systems you switch on. HR, payroll or anything sensitive stays out until you decide otherwise.'},
    {title: 'Role-based access', text: 'Sales sees sales, finance sees finance. The brain answers each person with only what their role may see.'},
    {title: 'Nothing external without approval', text: 'Agents draft. A person approves anything that leaves the company or changes a record that matters.'},
    {title: 'Every action logged', text: 'Each read, draft, approval and change is written to an audit log you can open at any time.'},
  ],
};

/* ------------------------------------------------------------------ how we work */

export const process = {
  label: 'How a project runs',
  title: ['Start with one workflow.', 'Prove it. Then extend.'],
  steps: [
    {
      k: '01',
      title: 'Discovery call',
      short: 'Twenty minutes on the work that costs you the most time.',
      you: 'The workflow that hurts, who does it today, and the systems it touches.',
      we: 'Honest questions, a first view of what can be automated and what should not be.',
      security: 'No access to anything yet. We ask about systems, not for passwords.',
    },
    {
      k: '02',
      title: 'Map one workflow',
      short: 'We write down how the work really happens, step by step.',
      you: 'An hour with the person who does the work, and sample documents with anything sensitive removed.',
      we: 'A one-page map: trigger, steps, decisions, where a person must approve, and a fixed scope and price.',
      security: 'We agree which sources the brain may read and which roles may see what, in writing, before we build.',
    },
    {
      k: '03',
      title: 'Build a pilot',
      short: 'A working brain and one agent on your real data.',
      you: 'Read-only access to the agreed systems, and a few minutes a week to review drafts.',
      we: 'The connectors, the brain, the agent and the approval screen, shown to you as it grows.',
      security: 'Read-only access first, a private store for your data, every action logged from day one.',
    },
    {
      k: '04',
      title: 'Run, measure, extend',
      short: 'Your team uses it. We watch what it saves and fix what it misses.',
      you: 'Feedback from the people using it.',
      we: 'Fixes, measured results on your own numbers, and the next workflow when you are ready.',
      security: 'Write access only where you approved it, access reviewed as roles change, logs you can export.',
    },
  ],
};

export const disciplines = [
  {title: 'Strategy', text: 'Finding the workflow where automation pays first, and saying no to the ones where it doesn’t.'},
  {title: 'Agent engineering', text: 'Agents with clear roles, tools, spending caps, tests and approval steps.'},
  {title: 'Integrations', text: 'Connectors to the CRM, ERP, inboxes, drives and sheets you already run on.'},
  {title: 'Security & governance', text: 'Private stores, role-based access, audit logs and secrets kept out of code.'},
];

/* ------------------------------------------------------------------ pricing */

export type Prices = {
  launch: number;
  mvp: number;
  ai: number;
  addons: {logins: number; database: number; payments: number; aiAgent: number; mcp: number; email: number};
  carePlan: number;
  foundingDiscountPct: number;
};

/** Build-time defaults; the live prices come from the desk through GET /api/prices. Keep in step with the desk's DEFAULTS. */
export const DEFAULT_PRICES: Prices = {
  launch: 400,
  mvp: 2500,
  ai: 1500,
  addons: {logins: 300, database: 500, payments: 400, aiAgent: 800, mcp: 600, email: 200},
  carePlan: 150,
  foundingDiscountPct: 30,
};

export type BaseId = 'launch' | 'mvp' | 'ai';
export type AddonId = keyof Prices['addons'];

export const packages: {id: BaseId; name: string; time: string; text: string; includes: string[]}[] = [
  {
    id: 'launch',
    name: 'Launch page',
    time: '3–5 days',
    text: 'A fast, polished page or small site that explains what you do and brings in enquiries.',
    includes: ['Design and copy edit', 'Phone and laptop layouts', 'Enquiry form to your inbox', 'Hosting set up on the edge'],
  },
  {
    id: 'mvp',
    name: 'MVP sprint',
    time: '3–4 weeks',
    text: 'A working first version of your web app, on a real database, ready for real users.',
    includes: ['Core screens and flows', 'Database and server code', 'Weekly working previews', 'Deployed and handed over'],
  },
  {
    id: 'ai',
    name: 'AI agents & API build',
    time: '2–3 weeks',
    text: 'One agent or API wired into your tools, with approval steps and logs.',
    includes: ['One agent or API', 'Connected to your systems', 'Approval step and audit log', 'Tested on your real cases'],
  },
];

export const addons: {id: AddonId; name: string; text: string}[] = [
  {id: 'logins', name: 'Logins & user accounts', text: 'Sign-in, roles and password reset.'},
  {id: 'database', name: 'Database & admin panel', text: 'Your data in Postgres, with a screen to manage it.'},
  {id: 'payments', name: 'Payments', text: 'Take payments or subscriptions online.'},
  {id: 'aiAgent', name: 'AI chat or agent', text: 'An assistant that answers from your own content.'},
  {id: 'mcp', name: 'MCP server', text: 'Let AI assistants use your tools and data.'},
  {id: 'email', name: 'Email & notifications', text: 'Reminders, receipts and alerts.'},
];

export const pricing = {
  label: 'Pricing',
  title: ['Pick a starting point.', 'See the number.'],
  intro: 'Fixed starting prices for websites, apps and agent builds. Choose one package, add what you need, and send it to us. We confirm scope and price in writing before any work starts.',
  care: {name: 'Care plan', text: 'Hosting checks, fixes, small changes and updates, every month.'},
  brain: {
    name: 'Company brain & custom systems',
    text: 'A brain across your CRM, ERP, documents, email and chats, with agents and approvals on top. Every company is different, so this is scoped per workflow after a discovery call.',
    price: 'Scoped on a call',
  },
  note: 'Prices in US dollars. The total is a starting estimate; the written scope is what you pay.',
  founding: 'Founding-client discount',
};

/* ------------------------------------------------------------------ FAQ */

export const faq = [
  {q: 'Do you only build AI?', a: 'No. We build websites, web apps, automations, integrations, APIs and company brains. Many teams start with a website or one automation and add the rest once the first piece pays off.'},
  {q: 'What do we actually gain, and when?', a: 'Hours back and money saved, measured against a baseline we write down in the first week. The first saved hours show up in the weekly report during the pilot; the money view follows in months two and three.'},
  {q: 'What systems can it connect to?', a: 'Anything with an API, an export or a shared folder: CRMs, ERPs, email, chat tools, drives and spreadsheets. If a system has no API, we start from its exports and scheduled files.'},
  {q: 'Where does our data live?', a: 'In a private store set up for your company only, with access rules per role and an audit log. If you prefer, we set it up in your own cloud account so you hold the keys.'},
  {q: 'Do you train public models on our data?', a: 'No. The brain is private to you. Your documents and records are never used to train public models, and nothing is pasted into consumer chat apps.'},
  {q: 'How do we start small?', a: 'With one workflow: a single brain over the two or three systems it needs, and one agent with a person approving every action. If it saves time, we extend it.'},
  {q: 'What do you need from us?', a: 'One person who knows the workflow, read-only access to the systems we agree on, and a few minutes a week to review what the agent drafts.'},
  {q: 'Who owns what you build?', a: 'You do. The code, the data and the accounts it runs on are yours, and we can set it up in your own cloud account so you hold the keys.'},
];

/* ------------------------------------------------------------------ work (from the portfolio) */

export type Category = 'all' | 'web' | 'ai' | 'media';

export const categories: {id: Category; label: string}[] = [
  {id: 'all', label: 'All'},
  {id: 'web', label: 'Web'},
  {id: 'ai', label: 'AI & tools'},
  {id: 'media', label: 'Media'},
];

export type Visual =
  | {kind: 'image'; src: string; alt: string; position?: string}
  | {kind: 'terminal'}
  | {kind: 'partner'; logo: string; name: string; flow: string[]}
  | {kind: 'island'}
  | {kind: 'reels'; frames: {src: string; alt: string}[]; tone: 'sage' | 'night'};

export type Project = {
  id: string;
  title: string;
  label: string;
  oneLiner: string;
  description: string;
  categories: Exclude<Category, 'all'>[];
  visual: Visual;
  live?: string;
  code?: string;
  note?: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    id: 'ai-agent-team',
    title: 'AI agent team & company brain',
    label: 'AI · Agents',
    oneLiner: 'A team of AI agents that finds and qualifies clients, guided by a brain that learns the business.',
    description:
      'An orchestrator hands work to two pipelines of AI agents. Marketing researches the market and checks that each company fits; sales qualifies the lead, finds a public business contact and drafts one pitch. A person approves every lead and picks who receives each email. A company brain interviews the team, reads their documents and keeps one shared map of the business that the agents work from.',
    categories: ['ai'],
    visual: {kind: 'partner', logo: '/partners/zaper.webp', name: 'Zaper', flow: ['orchestrator', 'marketing', 'sales', 'brain']},
    note: 'Built with Zaper · private system',
    tags: ['LangGraph', 'Claude', 'Multi-agent', 'Supabase', 'Next.js 16', 'Node.js workers'],
  },
  {
    id: 'casper',
    title: 'Casper',
    label: 'AI · Assistant',
    oneLiner: 'A voice assistant that lives at the top of the Windows screen and on the phone.',
    description:
      'Say the wake word and Casper listens from a small pill at the top of the screen. Claude is its brain, connected to Gmail, Calendar and MCP servers, so it can plan your day, take screenshots, type, play Spotify and write meeting notes. It speaks English and Malayalam, takes live voice calls from its phone app, and asks for a yes before anything that can’t be undone.',
    categories: ['ai'],
    visual: {kind: 'island'},
    note: 'Personal build · demo on request',
    tags: ['Electron', 'Claude', 'MCP', 'ElevenLabs', 'ONNX speech', 'Cloudflare relay'],
  },
  {
    id: 'migration-in-a-box',
    title: 'Migration-in-a-box',
    label: 'AI · Live',
    oneLiner: 'PDFs, Excel and CSV files in. One clean Excel out.',
    description:
      'Drop in invoices, price lists and sheets and get back one tidy Excel file. Files are read in your browser and never uploaded. AI sorts every item by trade, and every cell is marked as printed, filled by AI or made by the app. You can even speak your request in nine Indian languages.',
    categories: ['ai', 'web'],
    visual: {kind: 'image', src: '/work/migration-in-a-box.webp', alt: 'Migration-in-a-box: six invoices turned into a sorted table of items', position: 'left top'},
    live: 'https://migration-in-a-box.orbit-fm.workers.dev',
    code: 'https://github.com/rasthm/migration-in-a-box',
    tags: ['React', 'TypeScript', 'OCR', 'Claude AI', 'Excel export'],
  },
  {
    id: 'yoga-reels-api',
    title: 'Yoga Reels API + MCP',
    label: 'AI · API',
    oneLiner: 'One API call in, a finished narrated reel out.',
    description:
      'Ask for a yoga reel with a topic. Claude Code writes the script, an ElevenLabs voice reads it, music and motion are added, and you get back a single HTML file that plays anywhere. An MCP server lets other AI assistants order reels too.',
    categories: ['ai', 'media'],
    visual: {
      kind: 'reels',
      tone: 'sage',
      frames: [
        {src: '/work/reel-breath.webp', alt: 'Reel frame: Puraka, Kumbhaka, Rechaka, the three parts of a breath'},
        {src: '/work/reel-seed.webp', alt: 'Reel frame: I begin again'},
      ],
    },
    code: 'https://github.com/rasthm/yoga-reels-api',
    tags: ['Cloudflare Workers', 'Durable Objects', 'MCP', 'ElevenLabs', 'HyperFrames'],
  },
  {
    id: 'orbit-fm',
    title: 'ORBIT.FM',
    label: 'Web · Live',
    oneLiner: 'Spin a 3D globe and tune into 38,000 live radio stations.',
    description:
      'A techno-styled web radio. Spin the globe, tap a glowing city and a live station starts playing, with a real audio visualiser. It installs like an app and keeps playing with the screen locked.',
    categories: ['web'],
    visual: {kind: 'image', src: '/work/orbit-fm.webp', alt: 'ORBIT.FM: a glowing 3D globe dotted with radio station counts'},
    live: 'https://orbit-fm.orbit-fm.workers.dev',
    code: 'https://github.com/rasthm/orbit-fm',
    tags: ['Preact', 'MapLibre GL', 'Web Audio', 'PWA', 'Cloudflare Workers'],
  },
  {
    id: 'foodkavach',
    title: 'FoodKavach / Zoitic',
    label: 'Web app · SaaS',
    oneLiner: 'Every licence, every deadline, for Indian businesses.',
    description:
      'A compliance tracker for food businesses and their agents: FSSAI licence countdowns, a document vault, email reminders at 90, 60, 30 and 7 days, a dashboard for consultants with every client in one place, and an AI assistant and label checker.',
    categories: ['web', 'ai'],
    visual: {kind: 'image', src: '/work/foodkavach.webp', alt: 'Zoitic home page: Every licence. Every deadline.', position: 'left top'},
    code: 'https://github.com/rasthm/foodkavach',
    tags: ['Next.js 16', 'Supabase', 'Row-level security', 'Resend', 'Claude AI'],
  },
  {
    id: 'fssai-lookup',
    title: 'FSSAI Lookup',
    label: 'Tool · Open source',
    oneLiner: 'Look up who holds an FSSAI licence, from the command line.',
    description:
      'A small command-line tool and library: type an FSSAI licence number and see who holds it, with the company, address, licence type and status. Zero dependencies, plus a daily self-check that tells us if it ever stops working.',
    categories: ['ai'],
    visual: {kind: 'terminal'},
    code: 'https://github.com/rasthm/fssai-lookup-nokey',
    tags: ['Node.js', 'Zero dependencies', 'CLI', 'Library', 'Daily self-check'],
  },
  {
    id: 'silent-earth',
    title: 'Silent Earth',
    label: 'Game · Live',
    oneLiner: 'A 2D gothic horror action game you play in the browser.',
    description:
      'Rika descends into hell with a lantern and a gun: five acts, five Fallen Lords, hidden crypts and vaults, secret bosses and a boss rush mode. Every demon is drawn in code and every sound is made live with Web Audio. It plays with keyboard, mouse or a gamepad.',
    categories: ['web'],
    visual: {kind: 'image', src: '/work/silent-earth.webp', alt: 'Silent Earth: the title screen, a burning eye over a gothic city'},
    live: 'https://silent-earth.orbit-fm.workers.dev',
    code: 'https://github.com/rasthm/silent-earth',
    tags: ['JavaScript', 'Canvas 2D', 'Web Audio', 'Gamepad API', 'Vite'],
  },
  {
    id: 'kperfume-bliss',
    title: 'KPerfume Bliss',
    label: 'Web · Live',
    oneLiner: 'A fragrance launch that unveils as you scroll.',
    description:
      'A scroll-driven concept page for an extrait de parfum. The bottle reveals itself frame by frame as you scroll, with roses, gold light, the scent’s notes, specs and where to buy.',
    categories: ['web'],
    visual: {kind: 'image', src: '/work/kperfume-bliss.webp', alt: 'KPerfume Bliss: a perfume bottle among roses and gold light'},
    live: 'https://kperfume-bliss.orbit-fm.workers.dev',
    code: 'https://github.com/rasthm/kperfume-bliss',
    tags: ['React', 'Lenis', 'Frame sequence', 'Concept'],
  },
  {
    id: 'kperfume-collection',
    title: 'KPerfume Collection',
    label: 'Web · Live',
    oneLiner: 'Five extraits, one house, told in editorial motion.',
    description:
      'A concept site for a house of five fragrances: Atlantis, Aura, Bliss, Noir and Rouge. Editorial type, floating bottles and GSAP motion that moves with the scroll.',
    categories: ['web'],
    visual: {kind: 'image', src: '/work/kperfume-collection.webp', alt: 'KPerfume Collection: five bottles floating around the words Five Extraits, one house'},
    live: 'https://kperfume-collection.orbit-fm.workers.dev',
    code: 'https://github.com/rasthm/kperfume-collection',
    tags: ['React', 'GSAP', 'Editorial', 'Concept'],
  },
  {
    id: 'kperfume-noir',
    title: 'KPerfume NOIR reel',
    label: 'Media · Reel',
    oneLiner: 'A 30-second wordless reel, told through scent notes.',
    description:
      'An Instagram reel with no words, only music and sound. It follows the perfume’s notes, from cardamom and lavender to vanilla and smoke, into the spray and the final hero shot. Music and sound effects were made with ElevenLabs.',
    categories: ['media'],
    visual: {
      kind: 'reels',
      tone: 'night',
      frames: [
        {src: '/work/reel-noir.webp', alt: 'NOIR reel: close-up of the bottle label'},
        {src: '/work/reel-noir-2.webp', alt: 'NOIR reel: the bottle and box in smoke'},
      ],
    },
    tags: ['Remotion', 'ElevenLabs', 'Sound design', '1080×1920'],
  },
];

/** The three shown on the home page: an AI system, an automation tool and a website, to show the range. */
export const selectedWork = ['ai-agent-team', 'migration-in-a-box', 'kperfume-collection'];

export const partners = [{name: 'Zaper', logo: '/partners/zaper.webp'}];

export type Dive = {title: string; hook: string; body: string[]; flow: string[]; facts: string[]; project: string};

export const dives: Dive[] = [
  {
    title: 'A company brain that keeps an AI team honest',
    hook: 'AI agent team',
    body: [
      'Agents are only as good as what they know about the business. So the system has a brain: it interviews the people who know the company, one question at a time, reads the documents they upload part by part, and builds one shared topic tree. Every fact is marked as from a document, someone’s understanding, or confirmed. When two people disagree, it records the disagreement and asks a neutral question instead of guessing who is right. Every night it tidies the tree.',
      'The agents work from that knowledge. LangGraph runs each request as a graph with saved checkpoints in Postgres, so a crashed worker picks up where it stopped. Every agent has its own model, instructions and daily spending cap, a test bench grades their answers against a written rubric, and nothing reaches a real prospect until a person approves the lead and picks the recipient.',
    ],
    flow: ['people & documents', 'brain', 'orchestrator', 'pipelines', 'human approval'],
    facts: ['Facts labelled by source', 'Disagreements recorded, not guessed', 'Spending cap per agent', 'A person approves every lead'],
    project: 'ai-agent-team',
  },
  {
    title: 'AI that shows its work',
    hook: 'Migration-in-a-box',
    body: [
      'Messy invoices and price lists go in, one clean Excel comes out, and the files never leave your browser. Every cell says where it came from: purple means AI filled it in, green means the app made it, and no colour means it’s exactly as printed.',
      'AI sees the items in document order, so it knows a copper pipe is plumbing and a copper wire is electrical. Nothing is ever made up: a detail a bill doesn’t print is left blank and listed in one note. It took 11 versions to get right.',
    ],
    flow: ['PDF / Excel / CSV', 'read in browser', 'AI sorts by trade', 'colour-coded cells', 'one Excel'],
    facts: ['11 versions', 'Speak your request in 9 Indian languages', 'Files are never uploaded'],
    project: 'migration-in-a-box',
  },
  {
    title: 'A video studio behind one URL',
    hook: 'Yoga Reels API',
    body: [
      'A client’s app sends one request with a topic, like “a 30-second reel about breathing”. The API answers straight away with a job number, so nobody waits on a loading spinner.',
      'Behind it, a Cloudflare Worker keeps every job in one small SQLite database (a Durable Object), so every status check sees the latest update. A worker machine picks the job up, Claude Code writes the script, an ElevenLabs voice reads it, music and motion are added, and the finished reel comes back as one HTML file that plays in any browser.',
    ],
    flow: ['POST /api/jobs', '{ jobid }', 'pending', 'running', 'done', 'reel.html'],
    facts: ['8 reels ordered through the API so far', 'Status notes like “voice done” while it works', 'Any language that can send a web request can use it'],
    project: 'yoga-reels-api',
  },
  {
    title: 'MCP: letting other AIs use your tools',
    hook: 'Model Context Protocol',
    body: [
      'MCP is a standard way to give an AI assistant new tools, the way a USB port lets a laptop use new devices. We wrote an MCP server for the reel API, so an assistant like Claude can order a reel in a normal conversation. You say “make me a reel about letting go” and it calls the API itself.',
      'It has four tools: reel_request, reel_status, reel_download and reel_list. It runs two ways: as a small Node program on your own computer, or over plain HTTP at /mcp on the Worker, so there’s nothing to install.',
    ],
    flow: ['You ask your AI', 'reel_request', 'reel_status', 'reel_download', 'file saved'],
    facts: ['4 tools, one API key', 'Local (Node) or remote (HTTP /mcp)', 'Works with any MCP-aware assistant'],
    project: 'yoga-reels-api',
  },
  {
    title: 'API keys: the boring part we take seriously',
    hook: 'Security',
    body: [
      'Every call to the reel API must carry a key in an x-api-key header. The Worker compares it in constant time, so the key can’t be guessed by timing the replies, and anything wrong gets a 401. Keys live in server secrets. The public docs only ever say YOUR_KEY.',
      'AI keys never reach the browser either. Migration-in-a-box sends requests to its own /api/ai route, where only the server holds the key, behind a passcode so strangers can’t spend credits. Before making our repos public, we searched every commit in every repo for 40 real secret values and the usual key patterns. Leaks found: zero.',
    ],
    flow: ['request', 'x-api-key', 'constant-time check', '401 or accepted'],
    facts: ['Timing-safe key comparison', 'Secrets in env, placeholders in docs', '0 leaks found in the public repos'],
    project: 'migration-in-a-box',
  },
  {
    title: 'A radio built on an API that doesn’t want visitors',
    hook: 'ORBIT.FM',
    body: [
      'radio.garden’s API is unofficial: no CORS headers, and it challenges anything that isn’t a browser. So a Cloudflare Worker sits in between. It adds browser headers, caches answers at the edge (station lists for 12 hours) and trims the data down.',
      'Playback tries three routes in order: direct with a real audio visualiser, direct with a simulated one, then a stream piped through the edge. On iPhone the visualiser is switched off, so music keeps playing with the screen locked.',
    ],
    flow: ['tap a city', 'edge Worker', 'cached stations', '3 playback routes', 'music'],
    facts: ['About 38,000 live stations', 'Installs like an app (PWA)', 'Free to run on the edge'],
    project: 'orbit-fm',
  },
  {
    title: 'A horror game whose demons are drawn by code',
    hook: 'Silent Earth',
    body: [
      'During play, every demon in Silent Earth is drawn by code, frame by frame (painted art appears only in the story scenes). Each one is a small drawing function that reads the creature’s state (walking, winding up an attack, hurt, enraged) and poses it to match, so bigger elites and bosses scale up for free.',
      'There are no audio files at all. Gunshots, explosions, footsteps and the music are made live in the browser with Web Audio, with a little random pitch on each sound so nothing repeats exactly.',
    ],
    flow: ['game loop', 'update demons', 'draw in code', 'carve out light', 'synth sound'],
    facts: ['About 16,000 lines of JavaScript', 'Zero audio files: every sound is synthesised', 'Keyboard, mouse or gamepad'],
    project: 'silent-earth',
  },
];

/* ------------------------------------------------------------------ about */

export const capabilities = [
  {title: 'AI agents', text: 'Teams of agents with roles and approval steps, and assistants that read documents and act on them.', tools: ['LangGraph', 'Claude', 'Agents'], proof: 'ai-agent-team'},
  {title: 'APIs & MCP', text: 'APIs other apps call, and MCP servers so AI can use them.', tools: ['Workers', 'Durable Objects', 'MCP'], proof: 'yoga-reels-api'},
  {title: 'Web apps', text: 'Logins, dashboards, reminders and roles, on a real database.', tools: ['Next.js', 'Supabase', 'Postgres'], proof: 'foodkavach'},
  {title: 'Websites', text: 'Fast, beautiful sites with motion that feels premium.', tools: ['React', 'Next.js', 'GSAP'], proof: 'kperfume-collection'},
  {title: 'Apps', text: 'Installable apps that keep working on the phone.', tools: ['PWA', 'Web Audio', 'Cloudflare'], proof: 'orbit-fm'},
  {title: 'Reels & motion', text: 'Narrated reels with voice, music and motion graphics.', tools: ['HyperFrames', 'Remotion', 'ElevenLabs'], proof: 'kperfume-noir'},
  {title: 'Games', text: 'Browser games with bosses, story and sound, playable with a keyboard or gamepad.', tools: ['Canvas 2D', 'Web Audio', 'Gamepad API'], proof: 'silent-earth'},
];

export const skills = [
  {title: 'AI & agents', note: 'Assistants that read, sort and act', items: ['Claude API', 'Claude Code', 'LangGraph', 'Multi-agent pipelines', 'MCP servers', 'Agent & tool design', 'Prompt design', 'OCR', 'AI classification']},
  {title: 'Frontend', note: 'Interfaces that feel fast and calm', items: ['React 19', 'Next.js 16', 'Preact', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis', 'MapLibre GL', 'PWA', 'Web Audio']},
  {title: 'Backend & cloud', note: 'APIs that stay up and stay cheap', items: ['Node.js', 'Cloudflare Workers', 'Durable Objects', 'Supabase', 'Postgres & RLS', 'REST APIs', 'Cron jobs', 'Resend email']},
  {title: 'Video & sound', note: 'Reels from script to render', items: ['HyperFrames', 'Remotion', 'ElevenLabs voice', 'AI music & SFX', 'FFmpeg', 'Scroll-driven video']},
  {title: 'Data & security', note: 'The careful, invisible part', items: ['PDF, Excel & CSV parsing', 'Data validation', 'Secrets hygiene', 'End-to-end testing', 'SQL']},
];

export const about = {
  label: 'About Halo',
  title: ['A small studio that', 'ships the whole system.'],
  intro:
    'Halo Automations is a build studio. We make the website people find you on, the apps your team works in, and the automations and AI that take repeated work off their desks, then we measure what it saves. One team from the first page to the full system, and we stay to run it.',
  founderText: [
    'Halo was founded by Rasthm, a full-stack developer and AI builder based in India. He turns ideas into websites, web apps and practical AI tools, handling the design, backend, integrations and deployment himself.',
    'Every project on the Work page went from idea to a working link: an agent team with a company brain, a voice assistant that asks before it acts, document tools that show where every value came from, and APIs that other AI assistants can use.',
  ],
  quote: 'An agent drafts. A person decides.',
};

/** From the portfolio journey. The 15 Oct "India licence libraries" step is left out on purpose (no other FSSAI tools on this site). */
export const journey = {
  label: 'Experience',
  title: ['October 2026,', 'in the order it shipped.'],
  intro: 'Everything on the Work page was built in October 2026. This is the order it happened in.',
  steps: [
    {date: '7 Oct', title: 'First project: ORBIT.FM', text: 'A web radio on a 3D globe, with an edge proxy around an unofficial API.', project: 'orbit-fm'},
    {date: '11–13 Oct', title: 'FoodKavach takes shape', text: '35 commits: licence countdowns, reminders, an agent dashboard and an AI label checker.', project: 'foodkavach'},
    {date: '14 Oct', title: 'FSSAI licence lookup tool', text: 'A small command-line tool that shows who holds an FSSAI licence, with a daily self-check.', project: 'fssai-lookup'},
    {date: '19 Oct', title: 'Migration-in-a-box', text: '11 versions in, invoices become one clean, colour-coded Excel file.', project: 'migration-in-a-box'},
    {date: '20–21 Oct', title: 'First narrated reels', text: 'Yoga reels with voice, music and motion, plus the wordless KPerfume NOIR reel.', project: 'kperfume-noir'},
    {date: '22 Oct', title: 'The Reels API + MCP server', text: 'Turned the reel workflow into an API and MCP server a client uses. 8 reels ordered so far.', project: 'yoga-reels-api'},
    {date: '28 Oct', title: 'Two perfume sites, 7 repos public', text: 'Shipped KPerfume Bliss and Collection, then open-sourced 7 projects after a full leak check.', project: 'kperfume-bliss'},
    {date: '29 Oct', title: 'Silent Earth, the first game', text: 'A 2D gothic horror action game: five acts, secret bosses and a boss rush, playable in the browser.', project: 'silent-earth'},
  ] as {date: string; title: string; text: string; project?: string}[],
};

/* ------------------------------------------------------------------ contact */

/** Must match NEEDS in worker/index.ts. */
export const NEEDS = [
  'Company brain',
  'AI agents & automations',
  'Integrations & data sync',
  'Web app or MVP',
  'Website or launch page',
  'APIs & MCP servers',
  'Something else',
];

export const contact = {
  label: 'Contact',
  title: ['Tell us the workflow', 'that eats your week.'],
  text: 'Send the form and it reaches our desk straight away. We read every enquiry and reply to the email you give, usually within a day.',
  placeholder: 'What takes your team the most time? Which systems does it touch? When would you like to start?',
};

export const closing = {
  title: 'Tell us what slows you down.',
  accent: "We're open.",
  text: 'A website, an automation or a company brain: start with one. Twenty minutes is enough to find out if we can help.',
};

/* ------------------------------------------------------------------ inner pages */

export const brainPage = {
  label: 'The company brain',
  title: ['One private brain', 'for the whole business.'],
  intro:
    'The brain is a private store of what your company knows, built from the systems you choose, labelled by source, kept current, and shown to each person only as far as their role allows.',
  learns: {
    title: ['What it', 'learns from.'],
    items: [
      {src: 'CRM', text: 'Customers, deals, stages, notes and who owns what.'},
      {src: 'ERP', text: 'Orders, stock, suppliers, invoices and payment status.'},
      {src: 'Documents', text: 'Policies, contracts, price lists, SOPs and manuals.'},
      {src: 'Email', text: 'Shared inboxes and the threads behind each deal or ticket.'},
      {src: 'Chats', text: 'Project channels, decisions and blockers.'},
      {src: 'Sheets', text: 'Trackers, budgets and the reports people keep by hand.'},
      {src: 'People', text: 'Short interviews with the people who know how the work really happens, one question at a time.'},
    ],
  },
  facts: [
    {
      title: 'How access works',
      points: [
        'Every source, document and record carries a permission, and roles decide who sees it.',
        'The brain answers each person with only what their role may see, and says so when it holds something back.',
        'Sensitive sources, like HR and payroll, stay off until you switch them on.',
        'Access is reviewed when someone changes role or leaves.',
      ],
    },
    {
      title: 'Where your data lives',
      points: [
        'In a private store set up for your company only: Postgres with row-level security on Supabase, or on Cloudflare.',
        'In your own cloud account if you prefer, so you hold the keys.',
        'Never used to train public models.',
        'Keys and passwords live in server settings, never in code or in the browser.',
      ],
    },
    {
      title: 'How it stays current',
      points: [
        'Connectors sync on a schedule, or when a record changes.',
        'Every fact is labelled: from a document, from someone’s understanding, or confirmed.',
        'When two sources disagree, the brain records the disagreement and asks a person instead of guessing.',
        'A nightly tidy-up merges duplicates and flags facts that have gone stale.',
      ],
    },
  ],
};

export const agentsPage = {
  label: 'Agents & automations',
  title: ['Agents that draft.', 'People who decide.'],
  intro:
    'Six agents we build on top of your company brain. Each one reads, prepares and drafts on its own. Anything that leaves the company, or changes a record that matters, waits for a person’s yes.',
  built: {
    title: ['How every agent', 'is built.'],
    items: [
      {title: 'One job, written down', text: 'Each agent has its own instructions, tools and model, so you know exactly what it does and what it may touch.'},
      {title: 'A spending cap', text: 'Every agent has a daily budget. If it hits the cap, it stops and tells you.'},
      {title: 'Tested before it runs', text: 'A test bench grades its answers against a written rubric, on your real cases.'},
      {title: 'Picks up where it stopped', text: 'Work runs as a series of saved steps, so a crash or restart never loses a half-done job.'},
    ],
  },
};

export const howPage = {
  label: 'How we work',
  title: ['One workflow first.', 'Then the next.'],
  intro:
    'We start small on purpose. One workflow, a pilot on your real data, and a person approving every action. You see it working before you commit to more.',
};

export const workPage = {
  label: 'Work',
  title: ['Shipped,', 'and live where it can be.'],
  intro: 'Agent systems, a voice assistant, document tools, APIs with MCP servers, web apps, sites and reels. Live links open the real thing. Code links go to GitHub.',
  divesTitle: ['How the', 'interesting parts work.'],
  divesIntro: 'The parts we had the most fun figuring out, explained in plain words.',
};

export const privacy = {
  updated: '18 November 2026',
  sections: [
    {
      title: 'What we collect',
      text: [
        'Only what you type into the enquiry form: your name, email, company (if you give it), what you need, your message and any package you chose. We also note the country your request came from, as reported by our hosting network, so we can reply at a sensible hour.',
        'Nothing else. This site sets no cookies and runs no analytics, ads or tracking scripts. Fonts and images are served from this site, not from third parties.',
      ],
    },
    {
      title: 'Why, and where it goes',
      text: [
        'We use your enquiry only to reply to you and to prepare for a call if you want one. It goes to our private enquiry desk, which runs on Cloudflare. It is never sold, shared for marketing or used to train AI models.',
        'Our hosting provider, Cloudflare, keeps short-lived technical logs (such as IP addresses) to run and protect the site.',
      ],
    },
    {
      title: 'How long we keep it',
      text: ['We keep an enquiry for as long as we are talking about work together, and delete it when you ask.'],
    },
    {
      title: 'Your choices',
      text: ['To see, correct or delete what we hold about you, message us on WhatsApp or reply to any email from us. We act on it within 30 days.'],
    },
    {
      title: 'Client data in the systems we build',
      text: [
        'This page is about the website. Data in a company brain we build for a client belongs to that client, stays in a store set up for them, and is handled as agreed in writing for that project.',
      ],
    },
  ],
};

export const projectById = (id: string) => {
  const p = projects.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown project ${id}`);
  return p;
};
