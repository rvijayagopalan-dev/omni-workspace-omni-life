# Omni Life — Skills & Technologies

> Reference sheet for every skill, library, tool, and pattern used in this project.

---

## Frontend — omni-life-ui

### Core
| Skill / Tool | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 14.2.5 | React framework — App Router, SSR, API routes |
| [React](https://react.dev) | 18 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 5 | Static typing |

### Auth
| Skill / Tool | Version | Role |
|---|---|---|
| [NextAuth.js](https://next-auth.js.org) | 4.24 | Session management, Google OAuth provider |
| Google OAuth 2.0 | — | Identity provider |

### Styling
| Skill / Tool | Version | Role |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Utility-first CSS |
| [PostCSS](https://postcss.org) | 8 | CSS processing |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | 10 | Vendor prefixes |

### Key Patterns
| Pattern | Where | Notes |
|---------|-------|-------|
| App Router | `src/app/` | Next.js 14 file-system routing |
| Server Components | `layout.tsx` | Static shell, no client JS |
| Client Components | `page.tsx`, `dashboard/page.tsx` | `"use client"` — uses hooks |
| Middleware route guard | `src/middleware.ts` | Redirects unauthenticated users away from `/dashboard/*` |
| Session provider | `src/app/providers.tsx` | Wraps tree with `<SessionProvider>` |
| JWT callback | `src/lib/auth.ts` | Attaches Google `id_token` to session for API calls |

### Deployment
| Tool | Config file | Notes |
|------|-------------|-------|
| [Vercel](https://vercel.com) | `vercel.json` | Zero-config Next.js; set env vars in dashboard |

---

## Backend — omni-life-api

### Core
| Skill / Tool | Version | Role |
|---|---|---|
| [Python](https://python.org) | 3.11+ | Runtime |
| [FastAPI](https://fastapi.tiangolo.com) | 0.111 | Async web framework, auto OpenAPI docs |
| [Uvicorn](https://www.uvicorn.org) | 0.30 | ASGI server |
| [Pydantic v2](https://docs.pydantic.dev) | 2.7 | Data validation, response models |
| [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) | 2.3 | `.env` → typed settings |

### Auth
| Skill / Tool | Version | Role |
|---|---|---|
| [google-auth](https://google-auth.readthedocs.io) | 2.30 | Verify Google ID tokens server-side |
| [python-jose](https://python-jose.readthedocs.io) | 3.3 | JWT encode / decode |

### HTTP
| Skill / Tool | Version | Role |
|---|---|---|
| [httpx](https://www.python-httpx.org) | 0.27 | Async HTTP client (future integrations) |
| [requests](https://requests.readthedocs.io) | 2.32 | Sync HTTP (google-auth transport) |

### Key Patterns
| Pattern | Where | Notes |
|---------|-------|-------|
| Dependency injection | `auth.py → get_current_user` | FastAPI `Depends()` for auth on every protected route |
| Dual-token auth | `auth.py` | Accepts our JWT first, falls back to Google ID token |
| CORS middleware | `main.py` | Origins driven by `ALLOWED_ORIGINS` env var |
| Router separation | `routers/users.py` | Keeps `main.py` clean; prefix `/api` |
| Pydantic response model | `routers/users.py` | `UserProfile` — auto-validates and documents response shape |

### Deployment
| Tool | Config file | Notes |
|------|-------------|-------|
| [Replit](https://replit.com) | `.replit` | Primary deploy target; always-on |
| [Vercel](https://vercel.com) | `vercel.json` | Alternative serverless deploy via `@vercel/python` |

---

## Shared / DevOps

| Tool | Purpose |
|------|---------|
| Git | Version control |
| `.env` / `.env.local` | Local secrets — never committed |
| Google Cloud Console | OAuth 2.0 credential management |
| `openssl rand -base64 32` | Generate `NEXTAUTH_SECRET` |
| `python -c "import secrets; print(secrets.token_hex(32))"` | Generate `JWT_SECRET` |

---

## Learning Resources

| Topic | Resource |
|-------|---------|
| NextAuth Google setup | https://next-auth.js.org/providers/google |
| FastAPI dependency injection | https://fastapi.tiangolo.com/tutorial/dependencies/ |
| Google ID token verification | https://developers.google.com/identity/gsi/web/guides/verify-google-id-token |
| Vercel env vars | https://vercel.com/docs/projects/environment-variables |
| Replit secrets | https://docs.replit.com/replit-workspace/workspace-features/secrets |

---

## Skills To Add (Future)

| Skill | Reason |
|-------|--------|
| Supabase / PostgreSQL | Persist user tasks, goals, habits |
| Prisma or SQLAlchemy | ORM for backend data layer |
| React Query / SWR | Data fetching & caching on frontend |
| Zustand | Lightweight client state management |
| Playwright | End-to-end testing |
| GitHub Actions | CI/CD pipeline |
