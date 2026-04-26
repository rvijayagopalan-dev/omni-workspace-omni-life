# Environment Variables

Single source of truth for all environment variables across both projects.

---

## omni-life-ui (Frontend)

File: `omni-life-ui/.env.local` — **never committed**
Reference: `omni-life-ui/.env.example`

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `GOOGLE_CLIENT_ID` | ✅ | `123456.apps.googleusercontent.com` | OAuth 2.0 Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | ✅ | `GOCSPX-...` | OAuth 2.0 Client Secret |
| `NEXTAUTH_SECRET` | ✅ | `base64-random-string` | Signing key for NextAuth JWTs and cookies. Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` | Canonical URL of the frontend app. Must match exactly — no trailing slash. Use `https://your-app.vercel.app` in production. |
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:8000` | Base URL of the FastAPI backend. Prefix `NEXT_PUBLIC_` makes it available in the browser. |

### Notes
- `NEXT_PUBLIC_*` variables are embedded at build time and exposed to the browser — never put secrets in them.
- In Vercel, set these under **Project → Settings → Environment Variables**. Mark each one for the correct environment (Preview / Production).
- `NEXTAUTH_URL` is not required on Vercel — Vercel sets it automatically, but override if using a custom domain.

---

## omni-life-api (Backend)

File: `omni-life-api/.env` — **never committed**
Reference: `omni-life-api/.env.example`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_CLIENT_ID` | ✅ | — | Same Client ID as the frontend. Used to verify Google ID tokens server-side. |
| `JWT_SECRET` | ✅ | — | Secret key for signing internal JWTs. Generate: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `JWT_ALGORITHM` | ❌ | `HS256` | Algorithm for JWT signing. `HS256` is standard for symmetric keys. |
| `JWT_EXPIRE_MINUTES` | ❌ | `60` | Token expiry in minutes. |
| `ALLOWED_ORIGINS` | ✅ | `http://localhost:3000` | Comma-separated list of allowed CORS origins. Must include the frontend URL. |

### Notes
- On Replit, add these as **Secrets** (not as plain env vars in `.replit`) to keep them encrypted.
- On Vercel, set under **Project → Settings → Environment Variables**.

---

## Local Development Setup

### Frontend
```bash
cd omni-life-ui
cp .env.example .env.local
# Edit .env.local — fill in all values
npm run dev
```

### Backend
```bash
cd omni-life-api
cp .env.example .env
# Edit .env — fill in all values
uvicorn main:app --reload
```

---

## Per-Environment Values

| Variable | Local | Vercel Preview | Vercel Production |
|----------|-------|----------------|-------------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://<branch>.vercel.app` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Replit URL | Replit or Vercel backend URL |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | `https://<branch>.vercel.app` | `https://your-app.vercel.app` |

---

## Secrets Generation Reference

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# JWT_SECRET
python -c "import secrets; print(secrets.token_hex(32))"
```
