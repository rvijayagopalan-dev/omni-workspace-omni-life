# CLAUDE.md — Omni Life Project Instructions

> Claude reads this file automatically at the start of every session.
> These instructions override default behavior and must be followed exactly.

---

## Project Overview

**Omni Life** is a full-stack life management platform.

| Project | Path | Stack | Deploy |
|---------|------|-------|--------|
| Frontend | `omni-life-ui/` | Next.js 14, TypeScript, NextAuth.js, Tailwind CSS | Vercel |
| Backend | `omni-life-api/` | Python 3.11+, FastAPI, google-auth, python-jose | Replit / Vercel |

---

## Coding Conventions

### General
- No comments unless the **why** is non-obvious — never comment what the code already says
- No TODOs in committed code — use `BUILD_STATE.md` for pending work
- No `console.log` or `print()` left in committed code
- Prefer editing existing files over creating new ones
- Keep functions small and single-purpose

### TypeScript / Next.js
- Use TypeScript strict mode — no `any` unless absolutely necessary and documented
- Use App Router conventions (`page.tsx`, `layout.tsx`, `route.ts`) — no Pages Router
- Mark client components with `"use client"` — default to Server Components
- Use named exports for components, default export only for page files
- File names: `kebab-case` for folders, `PascalCase` for component files
- Tailwind only — no inline styles, no CSS modules unless Tailwind cannot solve it
- Use `next/image` for all images — never raw `<img>`
- Use `next/font` for fonts

### Python / FastAPI
- PEP 8 — 4-space indent, max 100 chars per line
- Type hints on all function signatures
- Pydantic models for all request/response bodies
- Use `Depends()` for auth and shared logic — never inline auth checks
- Router files in `routers/` — one file per domain (users, tasks, goals, etc.)
- Env vars via `config.py` (pydantic-settings) — never `os.getenv()` scattered in code
- Raise `HTTPException` with explicit status codes — no bare `Exception`

### Git
- Branch naming: `feature/`, `fix/`, `chore/`, `docs/`
- Commit messages: imperative present tense — "Add dashboard stats" not "Added stats"
- Never commit `.env`, `.env.local`, or any file containing secrets

---

## Auth Architecture (Critical)

```
Browser → NextAuth (Google OAuth) → Google
                ↓
          Session contains Google id_token
                ↓
    Dashboard → FastAPI (Authorization: Bearer <id_token>)
                ↓
         google-auth verifies token
                ↓
            User profile returned
```

- `GOOGLE_CLIENT_ID` is shared between UI and API — same OAuth app
- `NEXTAUTH_URL` must exactly match the deployed domain — mismatch breaks OAuth
- `ALLOWED_ORIGINS` in API must include the frontend URL — CORS will block otherwise
- The Google `id_token` is forwarded via the NextAuth `jwt` callback in `src/lib/auth.ts`
- API `auth.py` accepts our own JWT first, then falls back to Google `id_token`

---

## Environment Variables

Never hardcode credentials. See `ENVIRONMENT.md` for the full variable reference.

- Frontend secrets: `omni-life-ui/.env.local` (git-ignored)
- Backend secrets: `omni-life-api/.env` (git-ignored)

---

## Allowed Commands (No Confirmation Needed)

```bash
# Frontend
npm install
npm run dev
npm run build
npm run lint

# Backend
pip install -r requirements.txt
uvicorn main:app --reload
python -m pytest

# Git (read-only)
git status
git log
git diff
```

---

## File Reference Map

| Purpose | File |
|---------|------|
| Build progress & todos | `BUILD_STATE.md` |
| Architecture decisions & context | `MEMORY.md` |
| Stack & library reference | `SKILLS.md` |
| All environment variables | `ENVIRONMENT.md` |
| System architecture diagrams | `ARCHITECTURE.md` |
| Deployment steps | `DEPLOYMENT.md` |
| Version history | `CHANGELOG.md` |
| Contribution guidelines | `CONTRIBUTING.md` |
| AI agent roles | `AGENTS.md` |

---

## What NOT To Do

- Do not create new pages or endpoints beyond what is asked
- Do not add error handling for scenarios that cannot happen
- Do not add logging frameworks — use FastAPI's built-in logging
- Do not install new packages without updating `requirements.txt` or `package.json`
- Do not use `fetch` in Server Components — use it in Client Components or API routes
- Do not bypass NextAuth middleware — all route protection goes through `src/middleware.ts`
- Do not push to `main` directly — always use a feature branch and PR
