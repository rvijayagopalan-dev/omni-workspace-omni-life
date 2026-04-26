# Omni Life — Build State

## Project Overview
Full-stack life management platform with Google OAuth authentication.

## Status: 🟡 In Progress — Scaffolded, awaiting credentials & deployment

---

## Project Structure

```
omni-life/
├── omni-life-ui/        Next.js 14 frontend (Vercel)
└── omni-life-api/       Python FastAPI backend (Replit / Vercel)
```

---

## omni-life-ui (Frontend)

### Stack
- Next.js 14 (App Router)
- TypeScript
- NextAuth.js v4 (Google OAuth)
- Tailwind CSS

### Pages
| Route | File | Status |
|-------|------|--------|
| `/` | `src/app/page.tsx` | ✅ Done — Login page with Google Sign-In |
| `/dashboard` | `src/app/dashboard/page.tsx` | ✅ Done — Protected dashboard with stats |

### Key Files
| File | Status |
|------|--------|
| `src/app/api/auth/[...nextauth]/route.ts` | ✅ Done |
| `src/lib/auth.ts` | ✅ Done — Google provider, forwards `id_token` to session |
| `src/middleware.ts` | ✅ Done — Guards `/dashboard/*` |
| `src/app/providers.tsx` | ✅ Done — SessionProvider wrapper |
| `.env.local` | ⚠️ Needs credentials filled in |
| `vercel.json` | ✅ Done |

### Environment Variables Required
```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_API_URL
```

### Pending
- [ ] Fill in `.env.local` with Google credentials
- [ ] Update `NEXTAUTH_URL` for production Vercel URL
- [ ] Deploy to Vercel

---

## omni-life-api (Backend)

### Stack
- Python 3.11+
- FastAPI 0.111
- google-auth (ID token verification)
- python-jose (JWT)
- pydantic-settings

### Endpoints
| Method | Route | Status |
|--------|-------|--------|
| GET | `/` | ✅ Done — Health check |
| GET | `/api/me` | ✅ Done — Returns authenticated user profile |

### Key Files
| File | Status |
|------|--------|
| `main.py` | ✅ Done — App entry, CORS, router mount |
| `auth.py` | ✅ Done — Google ID token + JWT verification |
| `config.py` | ✅ Done — Pydantic settings |
| `routers/users.py` | ✅ Done — `/api/me` endpoint |
| `.env` | ⚠️ Needs credentials filled in |
| `.replit` | ✅ Done |
| `vercel.json` | ✅ Done |

### Environment Variables Required
```
GOOGLE_CLIENT_ID
JWT_SECRET
JWT_ALGORITHM
JWT_EXPIRE_MINUTES
ALLOWED_ORIGINS
```

### Pending
- [ ] Fill in `.env` with Google Client ID and JWT secret
- [ ] Set `ALLOWED_ORIGINS` to the deployed frontend URL
- [ ] Deploy to Replit or Vercel
- [ ] Add database (future: user data persistence)

---

## OAuth Setup Checklist
- [ ] Create project in Google Cloud Console
- [ ] Enable Google OAuth 2.0 API
- [ ] Create OAuth 2.0 Client ID (Web application)
- [ ] Add authorised redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://<your-app>.vercel.app/api/auth/callback/google`
- [ ] Copy Client ID and Secret into both `.env` files

---

## Deployment Checklist

### Frontend (Vercel)
- [ ] Push `omni-life-ui/` to GitHub
- [ ] Import repo into Vercel
- [ ] Set environment variables in Vercel dashboard
- [ ] Confirm redirect URI added to Google OAuth client

### Backend (Replit)
- [ ] Import `omni-life-api/` into Replit Python project
- [ ] Add Secrets: `GOOGLE_CLIENT_ID`, `JWT_SECRET`, `ALLOWED_ORIGINS`
- [ ] Run and confirm health check at `/`

---

## Future Roadmap
- [ ] User data persistence (PostgreSQL / Supabase)
- [ ] Tasks CRUD endpoints
- [ ] Goals & habits tracking
- [ ] Notifications / reminders
- [ ] Mobile-responsive PWA
- [ ] Dark mode
