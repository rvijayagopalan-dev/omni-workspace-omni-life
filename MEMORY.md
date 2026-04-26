# Omni Life — Project Memory

> Running context for AI-assisted development. Update this file as decisions are made and context evolves.

---

## What This Project Is

**Omni Life** is a personal life management platform. The initial version focuses on authenticated access (Google login) and a dashboard UI. Future phases will add tasks, goals, habits, and integrations.

---

## Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Frontend framework | Next.js 14 (App Router) | Vercel-native, SSR, file-based routing |
| Auth strategy | NextAuth.js v4 + Google OAuth | Handles token lifecycle, session management out of the box |
| Backend framework | FastAPI | Async-first, typed, fast to iterate |
| Token flow | Google ID token forwarded to API | Avoids double login; backend verifies directly with Google |
| Deployment — UI | Vercel | Zero-config Next.js support |
| Deployment — API | Replit (primary) / Vercel (alt) | Replit always-on for hobby tier; Vercel for serverless |
| CSS | Tailwind CSS | Utility-first, no build overhead, consistent design tokens |
| Language — frontend | TypeScript | Type safety, better DX |
| Language — backend | Python 3.11+ | FastAPI requirement, team familiarity |

---

## Key Constraints

- Google OAuth Client ID must be shared between `omni-life-ui` and `omni-life-api` — both validate the same token issuer.
- `NEXTAUTH_URL` must exactly match the deployed frontend URL; mismatch causes OAuth redirect failures.
- `ALLOWED_ORIGINS` in the API must include the frontend URL, otherwise CORS blocks API calls from the dashboard.
- `.env` and `.env.local` files are git-ignored — never commit credentials.

---

## Conventions

- **Route protection**: handled by `src/middleware.ts` in the UI using NextAuth middleware — no per-page redirect logic needed.
- **Session token**: `idToken` (Google ID token) is attached to the NextAuth session via the `jwt` callback in `src/lib/auth.ts` and passed as `Authorization: Bearer <idToken>` to the API.
- **API auth**: `auth.py` tries our own JWT first, falls back to Google ID token — supports both direct frontend calls and future service-to-service calls.
- **Env prefix**: `NEXT_PUBLIC_` prefix required for any env var read client-side in Next.js.

---

## People & Roles

| Person | Role |
|--------|------|
| rvijayagopalan-dev | Project owner / lead developer |

---

## Open Questions

- [ ] Will the API need its own database, or is Google profile data sufficient for v1?
- [ ] Should the API issue its own JWT (stateless) or use server-side sessions?
- [ ] Preferred Replit plan — affects always-on availability of the API.
- [ ] Custom domain for UI and API?

---

## Completed Milestones

| Date | Milestone |
|------|-----------|
| 2026-04-25 | Project scaffolded — UI and API created in `omni-workspace/omni-life/` |
| 2026-04-25 | Google OAuth flow wired (NextAuth → Google → FastAPI verification) |
| 2026-04-25 | Login page + protected dashboard page built |
| 2026-04-25 | Vercel and Replit deployment configs added |

---

## Change Log

### 2026-04-25
- Initial scaffold: `omni-life-ui` (Next.js) and `omni-life-api` (FastAPI)
- Google Sign-In on login page → redirects to `/dashboard`
- Dashboard shows user avatar, name, email, and placeholder stats
- Middleware guards `/dashboard/*` — unauthenticated users sent to `/`
- API `GET /api/me` verifies Google ID token, returns user profile
