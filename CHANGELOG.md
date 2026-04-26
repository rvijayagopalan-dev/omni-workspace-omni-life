# Changelog

All notable changes to Omni Life are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Planned
- User data persistence (PostgreSQL / Supabase)
- Tasks CRUD — create, complete, delete tasks
- Goals tracking with progress indicators
- Habit streaks and daily check-ins
- Dark mode toggle

---

## [0.1.0] — 2026-04-25

### Added
- **omni-life-ui** — Next.js 14 frontend scaffolded with App Router and TypeScript
- **omni-life-api** — Python FastAPI backend scaffolded
- Google OAuth login via NextAuth.js v4
- Login page (`/`) with "Continue with Google" button
- Protected dashboard page (`/dashboard`) — redirects to login if unauthenticated
- NextAuth middleware route guard for `/dashboard/*`
- Dashboard displays user name, email, profile picture, and placeholder stats (Tasks, Goals, Habits, Streak)
- `GET /api/me` endpoint — verifies Google ID token, returns user profile
- CORS middleware configured via `ALLOWED_ORIGINS` env var
- Dual-token auth in API — accepts own JWT or Google ID token
- Vercel deployment config for frontend (`vercel.json`)
- Replit deployment config for backend (`.replit`)
- Vercel serverless config for backend (`vercel.json`)
- Project documentation: `README.md`, `BUILD_STATE.md`, `MEMORY.md`, `SKILLS.md`
- Enterprise docs: `CLAUDE.md`, `ENVIRONMENT.md`, `ARCHITECTURE.md`, `DEPLOYMENT.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CHANGELOG.md`

---

## Version Scheme

| Segment | When to bump |
|---------|-------------|
| **MAJOR** (1.x.x) | Breaking change — auth flow, API contract, data model |
| **MINOR** (x.1.x) | New feature — new page, new endpoint, new integration |
| **PATCH** (x.x.1) | Bug fix, dependency update, documentation change |
