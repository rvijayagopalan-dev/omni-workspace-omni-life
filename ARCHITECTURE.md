# Architecture

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│   ┌─────────────────────────────┐                          │
│   │     omni-life-ui            │                          │
│   │     Next.js 14 (Vercel)     │                          │
│   │                             │                          │
│   │  /          Login page      │                          │
│   │  /dashboard Dashboard       │                          │
│   └──────┬──────────────────────┘                          │
│          │                                                  │
└──────────┼──────────────────────────────────────────────────┘
           │
           │  1. User clicks "Sign in with Google"
           ▼
┌──────────────────────┐
│   Google OAuth 2.0   │  accounts.google.com
│   Authorization      │
│   Server             │
└──────┬───────────────┘
       │
       │  2. Returns authorization code → NextAuth exchanges for tokens
       │     id_token (JWT) signed by Google
       ▼
┌──────────────────────────────────────────────────────────────┐
│  NextAuth.js (runs inside Next.js)                           │
│                                                              │
│  - Stores id_token in encrypted session cookie               │
│  - jwt() callback attaches id_token to session object        │
│  - Middleware protects /dashboard/* routes                   │
└──────┬───────────────────────────────────────────────────────┘
       │
       │  3. Dashboard page sends id_token to API
       │     Authorization: Bearer <google_id_token>
       ▼
┌──────────────────────────────────────────────────────────────┐
│  omni-life-api (FastAPI — Replit / Vercel)                   │
│                                                              │
│  auth.py                                                     │
│  ├── Try decode as our own JWT (python-jose)                 │
│  └── Fall back: verify Google id_token (google-auth)        │
│                                                              │
│  GET /api/me  →  returns { name, email, picture, message }  │
└──────────────────────────────────────────────────────────────┘
```

---

## Auth Token Flow (Detailed)

```
1. User clicks "Continue with Google"
   └─► NextAuth redirects to Google OAuth consent screen

2. Google issues authorization_code
   └─► NextAuth exchanges code for:
         - access_token   (Google APIs)
         - id_token       (signed JWT — user identity)
         - refresh_token  (session renewal)

3. NextAuth jwt() callback (src/lib/auth.ts)
   └─► Attaches id_token to the NextAuth token object

4. NextAuth session() callback
   └─► Exposes id_token on the session object as session.idToken

5. Dashboard component (omni-life-ui)
   └─► Reads session.idToken
   └─► Calls: GET /api/me
              Authorization: Bearer <id_token>

6. FastAPI auth.py (omni-life-api)
   └─► HTTPBearer extracts Bearer token
   └─► google.oauth2.id_token.verify_oauth2_token()
         validates signature, expiry, audience (GOOGLE_CLIENT_ID)
   └─► Returns decoded payload: { sub, name, email, picture, ... }

7. GET /api/me
   └─► Builds UserProfile from decoded payload
   └─► Returns JSON to dashboard
```

---

## Project Structure

### omni-life-ui

```
omni-life-ui/
├── src/
│   ├── app/
│   │   ├── layout.tsx              Root layout — wraps tree with Providers
│   │   ├── providers.tsx           SessionProvider (client component)
│   │   ├── globals.css             Tailwind base styles
│   │   ├── page.tsx                / — Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx            /dashboard — Protected dashboard
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts    NextAuth API route handler
│   ├── lib/
│   │   └── auth.ts                 NextAuth config — Google provider, jwt/session callbacks
│   └── middleware.ts               Route guard — protects /dashboard/*
├── .env.local                      Local secrets (git-ignored)
├── next.config.ts
├── tailwind.config.ts
└── vercel.json
```

### omni-life-api

```
omni-life-api/
├── main.py                         FastAPI app — CORS, router registration
├── auth.py                         Bearer token verification (Google + JWT)
├── config.py                       Pydantic settings — reads .env
├── routers/
│   ├── __init__.py
│   └── users.py                    GET /api/me
├── requirements.txt
├── .env                            Local secrets (git-ignored)
├── .replit                         Replit run config
└── vercel.json                     Vercel serverless config
```

---

## Key Design Decisions

### Why NextAuth instead of custom OAuth?
NextAuth handles the full OAuth 2.0 PKCE flow, CSRF protection, session encryption, and token refresh. Building this from scratch adds risk with no benefit at this stage.

### Why pass Google id_token to the API instead of a custom JWT?
- Avoids a separate login step on the backend
- The Google id_token is already cryptographically signed and verified
- `google-auth` library handles expiry and signature validation
- When the backend needs to issue its own JWTs (e.g. for service-to-service auth), `auth.py` is already wired to try our JWT first

### Why FastAPI over Django / Flask?
- Async-first — handles concurrent requests without blocking
- Auto-generated OpenAPI docs at `/docs` with zero config
- Pydantic v2 for typed, validated request/response models
- Lighter than Django for an API-only service

### Why Replit for backend deploy?
- Always-on (no cold starts on paid plan)
- Simple secret management
- Zero DevOps for the initial MVP
- Can migrate to Railway, Render, or Cloud Run later

---

## CORS Policy

The API allows requests only from origins listed in `ALLOWED_ORIGINS`. In production this must be set to the exact Vercel frontend URL. Wildcards (`*`) are not used because the API sends credentials.

```python
# main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,   # from ALLOWED_ORIGINS env var
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Future Architecture (Planned)

```
omni-life-ui  ──►  omni-life-api  ──►  PostgreSQL (Supabase)
                        │
                        ├──►  tasks table
                        ├──►  goals table
                        └──►  habits table
```

When a database is added:
- API issues its own JWT after first Google login (avoids repeated Google token verification)
- User record created on first login (`sub` claim as primary key)
- Subsequent requests use the API JWT, not the Google id_token
