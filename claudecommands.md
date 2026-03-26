# Claude Code — Freelancer Reference Guide

> Covers Beginner → Intermediate → Advanced. Grounded in the coffeshop3d stack.
> Stack: React 19 · Vite · TypeScript · GSAP · Three.js · Drizzle/Neon · Clerk · Tailwind v4 · Gemini AI · Vercel

---

## Your Progression Roadmap

```
01 BEGINNER     → Surface Level       (where most users stop)
02 INTERMEDIATE → Workflow Level      (the real workflows)
03 ADVANCED     → Operating System    (where the leverage lives)
```

### 01 — Beginner (Surface Level) — Where You Are Now
1. Install Claude Code in 2 minutes — Terminal, VS Code, or Windsurf
2. Write your `CLAUDE.md` — auto-loads every session as your standing brief
3. Learn 4 Permission Modes — from safe defaults to full bypass
4. Plan Mode first — read-only research before building. Saves 10x time
5. Key slash commands — `/plan`, `/context`, `/compact`, `/clear`

### 02 — Intermediate (Workflow Level) — The Real Workflows
1. **Build Skills** — Markdown files that run entire workflows with one command
2. **Spawn Parallel Agents** — batch tasks across multiple agents at once
3. **Automate deliverables** — lead scraping, proposals, websites, and video
4. **Connect MCP Servers** — Context7, Playwright, Excalidraw, DeepWiki
5. **Package for clients** — ship as ZIP plugins they run with one command

### 03 — Advanced (Operating System Level) — Where the Leverage Lives
1. **Build your Second Brain** — full business in a PARA folder structure
2. **48 Skills replacing $600–1K/mo** — content, outreach, ops, and dev tools
3. **Connect 7+ MCP Servers** — Unipile, Attio, Slack, Ahrefs, Notion, Figma
4. **LinkedIn from your terminal** — post, DM, track, and prospect. No browser
5. **Full business from the CLI** — sales, content, proposals. 15–20 hrs/week saved

---

## Your Use Cases: 3D Websites · Landing Pages · UI Design · AI Automation

### 3D Websites
**Intermediate moves:**
- Use Context7 MCP for instant Three.js + GSAP docs without Googling:
  ```
  "Using context7, show me how to use Float from @react-three/drei"
  "Using context7, look up GSAP ScrollTrigger scrub options"
  ```
- Build a `/3d-scene` skill that scaffolds an R3F scene with Float + lighting + seeded PRNG
- Use Playwright MCP to screenshot 3D scenes across browsers automatically

**Advanced moves:**
- Build a personal skill library: `/hero-3d`, `/coffee-scene`, `/particles-bg` — reuse across clients
- Store proven scene templates in PARA: `~/.claude/resources/3d-templates/`
- Figma MCP: design the 3D layout in Figma → pass design to Claude → implement in R3F
- Package 3D scene as a standalone component ZIP the client drops into any project

---

### Landing Pages
**Intermediate moves:**
- Build a `/landing-page` skill:
  ```
  "Given a client brief, scaffold a Vite + React landing page:
   Hero, Features, Testimonials, CTA, Footer.
   Use GSAP ScrollTrigger for reveal animations."
  ```
- Use Excalidraw MCP to wireframe before coding:
  ```
  "Draw a wireframe for a SaaS landing page with hero + 3 feature cards + pricing"
  ```
- Use parallel agents: one builds structure, one writes CSS, one sets up animations — all at once

**Advanced moves:**
- Full pipeline: brief → wireframe (Excalidraw) → build (Claude) → deploy (Vercel MCP) → SEO report (Ahrefs MCP)
- Ahrefs MCP: keyword research before writing any copy — rank before you ship
- Package the final landing page as a ZIP with README for non-technical clients
- `/landing-audit` skill: checks CTA placement, loading speed, mobile layout, SEO tags

---

### UI Designs
**Intermediate moves:**
- Use Excalidraw MCP: create and iterate wireframes directly in Claude chat
- Use Canva MCP (already active): generate design assets, mock up UI variations, export
- Build a `/design-system` skill:
  ```
  "Generate a Tailwind v4 @theme block from these brand colours: primary #3D2B1F,
   accent #C8A96E, background #1A1A1A. Include font scale and spacing tokens."
  ```

**Advanced moves:**
- Figma MCP: read Figma design files → Claude converts frames to React components automatically
- Build `/ui-audit` skill: checks contrast ratios, font sizes, spacing against WCAG 2.1 standards
- Notion MCP: sync component specs and design decisions to a living Notion design system doc
- 48-skill approach: one skill per UI component type (`/card`, `/modal`, `/navbar`, `/hero`)

---

### AI Automation
**Intermediate moves:**
- Playwright MCP: automate browser tasks (scraping, form fills, screenshots) from inside Claude
  ```
  "Using Playwright, go to linkedin.com/company/X, scrape the last 10 posts, save as leads.csv"
  ```
- Build a `/lead-scraper` skill: given a URL list → extract company info → save CSV
- Build a `/proposal-generator` skill: given brief + pricing → output formatted client proposal

**Advanced moves:**
- Chain skills into pipelines:
  ```
  /client-brief → /proposal-generator → send via Slack MCP → log in Attio CRM
  ```
- Unipile MCP: LinkedIn DMs, email outreach, and social automation from the terminal
- Attio MCP: CRM — log contacts, track pipeline stages, update deal notes without opening a browser
- Notion MCP: project tracker — new client → Notion page auto-created with tasks and timeline
- Full loop: lead in → brief extracted → proposal sent → CRM updated → follow-up scheduled

---

## Level 01 — Beginner

### Starting Claude
```bash
claude               # open Claude Code in the current directory
claude --resume      # resume the previous conversation in this project
claude --continue    # same as --resume (shorter)
```

### Everyday Commands
| Command | What it does |
|---|---|
| `/help` | Show all available commands |
| `/clear` | Clear the current conversation |
| `/compact` | Summarise and compress old messages to save context |
| `/plan` | Enter plan mode — research first, then propose before touching code |
| `/cost` | Show token usage for this session |
| `/quit` | Exit Claude Code |

### 4 Permission Modes
| Mode | What it allows | When to use |
|---|---|---|
| Default | Asks before any file edit or command | Learning, new projects |
| Auto-approve edits | Edits files without asking, still asks for commands | Active coding sessions |
| Auto-approve all | Edits + runs commands without asking | Trusted, fast builds |
| Plan only | Read-only — no edits, no commands | Research, planning |

Activate in Claude Code settings (`/config`) or pass `--dangerously-skip-permissions` (use with care).

### Asking Claude to Work
```
"Explain what Hero.tsx does"
"Find where orders are inserted into the database"
"Fix the TypeScript error on line 42 of Menu.tsx"
"Add a loading spinner to the OrderModal"
"Rename all instances of `om-btn` to `om-button` in OrderModal.css"
```

### Running Project Commands Through Claude
```
"Run npm run dev"
"Run npm run build and show me any errors"
"Run npm run lint and fix the warnings"
"Run npx drizzle-kit push to sync the schema"
```
Or just run them yourself:
```bash
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # TypeScript check + production build → dist/
npm run lint       # ESLint
npm run preview    # serve the dist/ folder locally
npx drizzle-kit generate   # generate SQL migration from schema change
npx drizzle-kit push       # push schema directly to Neon DB
npx drizzle-kit studio     # open Drizzle Studio GUI
```

### Git Workflow With Claude
```
"Show git status"
"Commit all changes with message: add chatbot"
"Create a new branch called feature/dark-mode"
```
Important: Claude will NOT push unless you explicitly say "push". It confirms
before destructive or shared-state actions.

### The Golden Rule at Level 01
> Use `/plan` before any task that touches more than 2 files.
> Plan → Review → Approve → Implement.

---

## Level 02 — Intermediate

### Skills (Slash Commands)
Skills are reusable prompt templates invoked with `/skill-name`.

**Already available in your setup:**
- `/keybindings-help` — customise Claude Code keyboard shortcuts (rebind keys, chord shortcuts)

**How to call a skill:**
```
/commit
/review-pr 42
/keybindings-help
```

**How to create a skill:**
Create `~/.claude/skills/my-skill.md`:
```markdown
---
name: deploy-vercel
description: Run the Vercel pre-flight checklist for this project
---

Check the following before deploying:
1. No .env file committed (`git status`)
2. `npm run build` passes with zero errors
3. All VITE_* env vars are set in Vercel dashboard
4. Clerk, Neon, and Gemini keys are rotated if repo is public
Then confirm: "Ready to deploy."
```

**Useful skills to build next:**
- `/commit` — staged diff → semantic commit message
- `/review-pr` — summarise PR changes and flag risks
- `/deploy-vercel` — pre-flight checklist (Neon, Clerk, Gemini keys)
- `/new-project` — scaffold CLAUDE.md + folder structure for a new client site
- `/client-brief` — intake template: goals, stack, deadline, budget
- `/3d-scene` — scaffold React Three Fiber scene with Float + lighting + seeded PRNG
- `/landing-page` — full landing page: Hero, Features, CTA, Footer + GSAP reveals
- `/design-system` — generate Tailwind v4 `@theme` from brand colours
- `/lead-scraper` — scrape a URL list → CSV of company/contact info
- `/proposal-generator` — client brief + pricing → formatted proposal doc
- `/ui-audit` — check WCAG contrast, font sizes, spacing

---

### Parallel Agents (Speed Up Research)
Send **one message** with multiple independent requests and Claude runs them simultaneously:

```
"Search for all GSAP ScrollTrigger usages, find where Clerk useUser() is called,
 and check what MCP servers are configured — do all three at once."
```

Claude internally dispatches parallel agents for independent searches. Use this when:
- You need to explore multiple files at once
- You want to search + read + check simultaneously
- A task has clearly independent sub-tasks

**Batching deliverables with parallel agents:**
```
"Build the Hero component, write its CSS file, and set up the GSAP ScrollTrigger —
 do all three simultaneously."
```

---

### MCP Servers (Active + Ready to Install)
MCP (Model Context Protocol) servers give Claude tools beyond file editing.

**Active in your Claude config:**
| Server | What it adds |
|---|---|
| `Canva` | Search designs, generate designs, get design content, export, comment |
| `Vercel` | List deployments, get logs, deploy, manage toolbar comments |

**Key servers to add next (Intermediate):**
| Server | Best For |
|---|---|
| `Context7` | Live docs for React, Three.js, GSAP, Drizzle — no Googling |
| `Playwright` | Browser automation, scraping, screenshot testing |
| `Excalidraw` | Wireframing and diagramming inside Claude |
| `DeepWiki` | Deep research on any GitHub repo or technical topic |

**How to use active servers:**
```
"Search my Canva designs for the coffeshop logo"
"Show me the latest Vercel deployment for this project"
"Get the build logs for the last failed Vercel deployment"
"Deploy the current dist/ to Vercel"
```

---

### Automate Deliverables
Use Claude + MCP to produce entire deliverables automatically:

```
"Using Playwright, go to [competitor URL], screenshot every section, save as screenshots/"
"Using Context7, look up the latest Three.js WebGPU renderer API"
"Using Excalidraw, create a wireframe for a coffee shop landing page with hero + menu + contact"
```

Build a `/proposal-generator` skill so every new client brief → formatted proposal in seconds:
```markdown
---
name: proposal-generator
description: Turn a client brief into a project proposal
---
Given the following client brief, generate a professional project proposal:
- Executive Summary (2 sentences)
- Scope of Work (bullet list)
- Tech Stack and Why
- Timeline (week-by-week milestones)
- Pricing (use the rates provided)
- Next Steps

Brief: [paste brief here]
Rates: [paste rates here]
```

---

### Package for Clients (ZIP)
Ship your Claude skills and project setup as a ZIP clients can run themselves:

```
~/.claude/skills/          ← your skill .md files
project-folder/
  CLAUDE.md               ← project instructions
  .env.example            ← list of required env vars (no real values)
  README.md               ← setup + deploy steps
  package.json
  src/
```

Zip the whole project folder → send to client → they run `npm install && claude` and it works.

---

### Plan → Execute Workflow (The Right Way to Build)
```
1. Open Claude:          claude
2. Enter plan mode:      /plan
3. Describe the task:    "Add a dark mode toggle to the Navbar"
4. Claude explores:      reads files, finds patterns, asks questions
5. Claude writes plan:   presents approach for your approval
6. You approve:          "Looks good, proceed"
7. Claude implements:    edits files, respects the plan
8. Verify:               npm run build → check browser
```

Never skip step 2–6 for anything touching more than 2 files. It prevents wasted
rewrites and keeps you in control.

---

### CLAUDE.md — Project Memory That Persists
`CLAUDE.md` in the project root is read by Claude at the start of every session.

**What to put in it:**
- Commands (npm scripts, DB commands)
- Architecture overview (what files do what)
- Component-specific rules (GSAP transform rules, CSS prefix conventions)
- "Never do X" gotchas discovered during development

**Tip:** After debugging a tricky issue (e.g. "GSAP overwrites CSS transform"),
immediately add the lesson to CLAUDE.md so every future session knows it.

---

### Client Packaging (Ship It)
```bash
npm run build       # produces dist/
# Then either:
# A) Vercel: connect GitHub repo → auto-deploys on push
# B) Static host: upload dist/ folder
# C) Preview locally: npm run preview
```

Set these env vars in Vercel dashboard (not in code):
| Variable | Source |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `DATABASE_URL` | Neon Console → Connection string (pooled) |
| `GEMINI_API_KEY` | Google AI Studio → API Keys |

---

## Level 03 — Advanced

### PARA Structure for Claude Projects
Organise your Claude memory files using PARA:

```
~/.claude/
  projects/
    <project-hash>/
      memory/
        MEMORY.md          ← loaded into every session (keep < 200 lines)
        debugging.md       ← recurring bugs + fixes
        patterns.md        ← confirmed code patterns
        client-notes.md    ← preferences, constraints

~/Desktop/
  Projects/               ← active client work
    coffeshop3d/
    bakery-landing/
    saas-dashboard/
  Areas/                  ← ongoing responsibilities
    skills/               ← your ~/.claude/skills/ library
    templates/            ← reusable component templates
  Resources/              ← reference material
    3d-templates/         ← proven Three.js scene setups
    design-systems/       ← Tailwind theme tokens per brand style
    prompt-library/       ← your best prompts
  Archives/               ← completed projects
```

**MEMORY.md** is auto-injected into Claude's system prompt. Keep it tight:
- Tech stack and key file paths
- User/client preferences
- Gotchas and hard-won lessons
- Links to detailed topic files

---

### 48 Skills — Replace $600–1K/mo in Subscriptions
Build one skill per tool or task you currently pay for or do manually:

| Category | Skills to build |
|---|---|
| Dev | `/commit`, `/review-pr`, `/deploy-vercel`, `/new-project`, `/debug` |
| Design | `/design-system`, `/ui-audit`, `/wireframe`, `/3d-scene`, `/landing-page` |
| Outreach | `/lead-scraper`, `/proposal-generator`, `/follow-up-email`, `/linkedin-post` |
| Content | `/blog-post`, `/case-study`, `/portfolio-entry`, `/seo-audit` |
| Ops | `/client-brief`, `/invoice`, `/project-status`, `/weekly-report` |

Each skill = one `.md` file in `~/.claude/skills/`. One command replaces one subscription.

---

### LinkedIn from Your Terminal
With Unipile MCP connected:
```
"Using Unipile, post this update to my LinkedIn: [paste content]"
"Using Unipile, send a connection request to [name] with this note: [message]"
"Using Unipile, show me my LinkedIn message requests from the last 7 days"
"Using Unipile, DM everyone who liked my last post"
```

Combine with a `/linkedin-post` skill to write + post in one command.

---

### Full Business from the CLI
With the full MCP stack connected, your entire freelance business runs from the terminal:

```
New lead →   /client-brief            (extract goals, stack, budget)
           → /proposal-generator       (generate proposal doc)
           → Slack MCP: send proposal  (no email client needed)
           → Attio MCP: log in CRM     (contact + deal stage updated)

Project →    /new-project              (scaffold folder, CLAUDE.md, README)
           → /plan + build             (Claude builds the site)
           → /deploy-vercel            (pre-flight + deploy)
           → Notion MCP: update status (project marked complete)

Growth →     Ahrefs MCP: keyword research
           → /blog-post skill          (SEO article written)
           → /linkedin-post skill      (social post written)
           → Unipile MCP: post it      (published without opening browser)
```

Estimated savings: 15–20 hrs/week once the skill library is built.

---

### 7+ MCP Servers — Install Commands (Windows)

> Run these in PowerShell or bash. Replace `<TOKEN>` with your actual key.

```bash
# Already active — no install needed
# Canva and Vercel are connected via claude.ai plugins

# GitHub — create issues, review PRs, search code
claude mcp add github -e GITHUB_TOKEN=<YOUR_TOKEN> \
  -- npx -y @modelcontextprotocol/server-github

# Context7 — live docs for any npm package (Three.js, GSAP, Drizzle, React…)
claude mcp add context7 \
  -- npx -y @upstash/context7-mcp

# Playwright — browser automation, scraping, screenshot testing
claude mcp add playwright \
  -- npx -y @microsoft/playwright-mcp

# Filesystem — give Claude access to folders outside the project
claude mcp add filesystem \
  -- npx -y @modelcontextprotocol/server-filesystem C:/Users/ES/Desktop

# Supabase — alternative to Neon for projects using Supabase
claude mcp add supabase \
  -e SUPABASE_URL=<YOUR_URL> \
  -e SUPABASE_ANON_KEY=<YOUR_KEY> \
  -- npx -y @supabase/mcp-server-supabase

# Brave Search — web search without leaving Claude
claude mcp add brave-search \
  -e BRAVE_API_KEY=<YOUR_KEY> \
  -- npx -y @modelcontextprotocol/server-brave-search

# Figma — read Figma designs → convert to React components
claude mcp add figma \
  -e FIGMA_API_KEY=<YOUR_KEY> \
  -- npx -y figma-mcp

# Notion — project tracker, design system docs, client notes
claude mcp add notion \
  -e NOTION_API_KEY=<YOUR_KEY> \
  -- npx -y @modelcontextprotocol/server-notion

# Ahrefs — SEO keyword research, backlink data, site audits
# (check https://github.com/modelcontextprotocol/servers for latest package)
claude mcp add ahrefs \
  -e AHREFS_API_KEY=<YOUR_KEY> \
  -- npx -y ahrefs-mcp

# Slack — post messages, read channels, client communication
claude mcp add slack \
  -e SLACK_BOT_TOKEN=<YOUR_TOKEN> \
  -e SLACK_TEAM_ID=<YOUR_TEAM_ID> \
  -- npx -y @modelcontextprotocol/server-slack

# Linear — sprint planning, ticket management
claude mcp add linear \
  -e LINEAR_API_KEY=<YOUR_KEY> \
  -- npx -y @linear/mcp-server

# Unipile — LinkedIn DMs, email, social outreach from terminal
# (check https://docs.unipile.com for current MCP install)
claude mcp add unipile \
  -e UNIPILE_API_KEY=<YOUR_KEY> \
  -- npx -y unipile-mcp

# Attio — CRM: contacts, pipeline, deal notes
# (check https://attio.com/developers for current MCP install)
claude mcp add attio \
  -e ATTIO_API_KEY=<YOUR_KEY> \
  -- npx -y attio-mcp
```

> **Windows note:** If `npx` fails inside an MCP subprocess, use `npx.cmd` instead.
> **Package names:** MCP ecosystem moves fast — if a package isn't found, check
> https://github.com/modelcontextprotocol/servers for the current name.

**Manage installed servers:**
```bash
claude mcp list             # list all configured MCP servers
claude mcp remove <name>    # remove a server
claude mcp get <name>       # show a server's config
```

---

### Custom Skills — Template
`~/.claude/skills/new-project.md`:

```markdown
---
name: new-project
description: Scaffold a new client website project with CLAUDE.md and folder structure
---

Create the following for a new client project:

1. CLAUDE.md with sections: Commands, Architecture, Styling Conventions, Gotchas
2. src/ folder structure: components/, hooks/, styles/, utils/, db.ts, schema.ts
3. public/ with: images/, videos/, frames/ (if animated hero needed)
4. .env.example listing all required environment variables (no real values)
5. README.md with: project name, stack, setup steps, deploy steps

Ask me for: client name, primary stack, authentication provider (Clerk/Auth.js/none),
database (Neon/Supabase/none), animation level (none/GSAP/GSAP+Three.js).
```

---

### Hooks — Automate Repetitive Actions
Hooks run shell commands before or after Claude uses a tool.
Configure in `~/.claude/settings.json` under `"hooks"`:

```json
{
  "hooks": {
    "postToolCall": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint --silent"
          }
        ]
      }
    ]
  }
}
```

Useful hook ideas:
- Run lint after every file edit
- Run `git add -p` after a batch of edits
- Play a sound when a long build finishes
- Log tool usage to a file for billing/time-tracking

---

### Multi-Repo Freelance Setup
One Claude instance per client project. Each has its own:
- `CLAUDE.md` with client-specific rules
- `~/.claude/projects/<hash>/memory/MEMORY.md` with client preferences
- Separate git repo and Vercel project

**Naming convention for client projects:**
```
~/Desktop/2025/
  clientname-projecttype/    e.g. coffeshop3d, bakery-landing, saas-dashboard
```

Open Claude per project from that folder:
```bash
cd ~/Desktop/2025/clientname-projecttype
claude
```

---

## MCP Server Quick Reference

| Server | Status | Best For |
|---|---|---|
| Canva | ✅ Active | Design assets, generate mockups, export |
| Vercel | ✅ Active | Deployments, logs, preview URLs |
| Context7 | Install above | Live docs for Three.js, GSAP, React, Drizzle |
| Playwright | Install above | Browser automation, scraping, screenshot testing |
| GitHub | Install above | PR review, issue tracking, code search |
| Filesystem | Install above | Access files outside the project |
| Figma | Install above | Read Figma designs → React components |
| Notion | Install above | Project tracking, design system docs |
| Ahrefs | Install above | SEO keyword research, site audits |
| Supabase | Install above | Projects using Supabase instead of Neon |
| Brave Search | Install above | Web research without leaving Claude |
| Slack | Install above | Client communication, standup posts |
| Linear | Install above | Sprint planning, ticket management |
| Unipile | Install above | LinkedIn DMs, email outreach from terminal |
| Attio | Install above | CRM — contacts, pipeline, deal tracking |

---

## Skills Quick Reference

| Skill | Status | What It Does |
|---|---|---|
| `keybindings-help` | ✅ Available | Customise Claude Code keyboard shortcuts |
| `commit` | Build it | Semantic commit from staged diff |
| `review-pr` | Build it | Summarise PR + flag risks |
| `deploy-vercel` | Build it | Pre-flight checklist before deploying |
| `new-project` | Build it | Scaffold new client project |
| `client-brief` | Build it | Intake template for new clients |
| `3d-scene` | Build it | Scaffold React Three Fiber scene |
| `landing-page` | Build it | Full landing page with GSAP animations |
| `design-system` | Build it | Tailwind v4 theme from brand colours |
| `ui-audit` | Build it | WCAG contrast + spacing checks |
| `lead-scraper` | Build it | URL list → company/contact CSV |
| `proposal-generator` | Build it | Brief + pricing → client proposal |
| `linkedin-post` | Build it | Write + post to LinkedIn via Unipile |
| `blog-post` | Build it | SEO article from keyword + outline |
| `seo-audit` | Build it | Page-level SEO check via Ahrefs |

---

## Freelancer Project Delivery Workflow

### Phase 1 — Discovery
```
"Help me write a project brief. Client: [name]. They want: [description].
Stack preference: [React/Vue/plain HTML]. Timeline: [X weeks]. Budget: [X]."
```
Output: `brief.md` with goals, deliverables, stack, risks.

### Phase 2 — Planning
```bash
claude          # open in new project folder
/plan           # enter plan mode
"Scaffold this project: [paste brief summary]"
```
Claude will: create CLAUDE.md, propose folder structure, list env vars needed.

### Phase 3 — Build
- One feature per conversation (keeps context clean)
- Always `/plan` before multi-file features
- Use parallel agents for research-heavy tasks
- Commit after each working feature:
  ```
  "Commit the completed chatbot feature"
  ```

### Phase 4 — Review
```
"Run npm run build and fix any TypeScript errors"
"Run npm run lint and fix warnings"
/review-pr      # if using a PR workflow
```

### Phase 5 — Deploy
```
"Check the Vercel pre-flight checklist"
"Show me the latest Vercel deployment status"
```
Env vars to set in Vercel dashboard:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `DATABASE_URL`
- Any API keys used (GEMINI_API_KEY, etc.)

### Phase 6 — Handoff
- Update README.md with setup steps and env var list
- Leave CLAUDE.md clean for future maintenance sessions
- Deliver `dist/` URL or live Vercel URL to client
- Optionally: give client this `claudecommands.md` if they'll maintain it themselves

---

## Award-Winning Website Checklist

Drawn from the coffeshop3d project as the reference standard.

### Performance
- [ ] Images preloaded into refs before animation starts (see `imagesRef` in Hero.tsx)
- [ ] GSAP `scrub` value tuned (0.3–1.0) — not too laggy, not too snappy
- [ ] Three.js scenes lazy-loaded — only mount Canvas when section is in view
- [ ] `npm run build` output < 2MB total (check with `npx vite-bundle-analyzer`)
- [ ] No layout shifts (CLS) — fixed dimensions on image/canvas containers

### Animation
- [ ] GSAP ScrollTrigger `pin: true` for cinematic scroll sections
- [ ] `gsap.quickSetter` for high-frequency updates (mouse tilt, audio params)
- [ ] GSAP transform rule: never mix CSS `transform` + GSAP `x/y` on the same element
- [ ] `requestAnimationFrame` loop for continuous rotation (Navbar logo)
- [ ] `useGSAP` hook with `{ scope: ref }` for scoped animations

### 3D (Three.js / React Three Fiber)
- [ ] Seeded PRNG for deterministic scene layouts (no layout change on reload)
- [ ] `@react-three/drei` Float component for organic movement
- [ ] Separate seeds per scene (coffeshop: 42, profile: 137)
- [ ] MeshStandardMaterial with metalness + roughness for realism

### Authentication
- [ ] Clerk `<ClerkProvider>` wraps the whole app in main.tsx
- [ ] `useUser()` + `useClerk()` gate paid/logged-in features
- [ ] Store `user.id` (Clerk ID) in every DB row for per-user data isolation

### Database
- [ ] Neon HTTP serverless driver — no API server needed for simple apps
- [ ] Drizzle ORM schema in `src/schema.ts` — types inferred via `$inferSelect`
- [ ] JSON columns for flexible data (e.g. order `items` array)
- [ ] `drizzle-kit push` for schema changes in development

### Styling
- [ ] Tailwind v4 `@theme` block in `index.css` (no `tailwind.config.js`)
- [ ] Component CSS files for GSAP-animated elements (not inline styles)
- [ ] BEM-style flat naming with component prefix (e.g. `om-`, `pp-`, `ohm-`)
- [ ] Inline styles only for About / Contact sections (truly static, no animation)

### Accessibility
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus ring visible on buttons and links
- [ ] `@media (prefers-reduced-motion: reduce)` disables or reduces animations
- [ ] Alt text on all images
- [ ] Colour contrast ratio ≥ 4.5:1 for body text

### SEO
- [ ] `<title>` and `<meta name="description">` in index.html
- [ ] Open Graph tags (`og:title`, `og:image`, `og:url`)
- [ ] Canonical URL set
- [ ] Sitemap (optional for single-page apps, but good for multi-page)

### Security & Deploy
- [ ] `.env` never committed (check `git log --all -- .env`)
- [ ] All secrets rotated before making repo public
- [ ] All env vars set in Vercel dashboard (not hardcoded)
- [ ] CSP headers considered (Vercel `vercel.json` `headers` block)
- [ ] `npm audit` shows no critical vulnerabilities

---

*Last updated: March 2026 | Project: coffeshop3d | Stack: React 19 + Vite + GSAP + Three.js*
