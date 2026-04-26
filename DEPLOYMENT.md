# Deployment Guide

---

## Prerequisites

- [ ] Google OAuth credentials created (see [ENVIRONMENT.md](ENVIRONMENT.md))
- [ ] Both `.env.local` (UI) and `.env` (API) filled in locally
- [ ] App runs successfully locally (`npm run dev` + `uvicorn main:app --reload`)
- [ ] GitHub repository created and code pushed

---

## 1. Deploy omni-life-api (FastAPI) → Replit

### Step 1 — Create Replit project
1. Go to [replit.com](https://replit.com) → **Create Repl**
2. Choose **Import from GitHub**
3. Select your repo and set the **root directory** to `omni-life/omni-life-api`
4. Language: **Python**

### Step 2 — Add secrets
In Replit sidebar → **Secrets (lock icon)**:

| Secret key | Value |
|-----------|-------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `JWT_SECRET` | Output of `python -c "import secrets; print(secrets.token_hex(32))"` |
| `JWT_ALGORITHM` | `HS256` |
| `JWT_EXPIRE_MINUTES` | `60` |
| `ALLOWED_ORIGINS` | (leave blank for now — fill in after UI is deployed) |

### Step 3 — Run
Click **Run**. Replit uses `.replit` to execute:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Step 4 — Verify
- Open the Replit webview URL (e.g. `https://omni-life-api.username.repl.co`)
- Visit `/docs` — FastAPI auto-generated docs should appear
- Health check: `GET /` → `{"status": "ok", "service": "omni-life-api"}`

### Step 5 — Note the API URL
Copy the Replit URL — you'll need it for the UI deployment.

---

## 2. Deploy omni-life-ui (Next.js) → Vercel

### Step 1 — Install Vercel CLI (optional)
```bash
npm install -g vercel
```

### Step 2 — Import project in Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `omni-life/omni-life-ui`
4. Framework preset: **Next.js** (auto-detected)

### Step 3 — Add environment variables

In Vercel → **Project → Settings → Environment Variables**:

| Key | Value | Environment |
|-----|-------|-------------|
| `GOOGLE_CLIENT_ID` | Your Google Client ID | Production, Preview |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret | Production, Preview |
| `NEXTAUTH_SECRET` | Output of `openssl rand -base64 32` | Production, Preview |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production only |
| `NEXT_PUBLIC_API_URL` | Your Replit API URL | Production, Preview |

> Leave `NEXTAUTH_URL` unset for Preview deployments — Vercel sets it automatically per branch.

### Step 4 — Deploy
```bash
# via CLI
cd omni-life/omni-life-ui
vercel --prod

# or click Deploy in the Vercel dashboard
```

### Step 5 — Note the frontend URL
Copy the Vercel URL (e.g. `https://omni-life.vercel.app`).

---

## 3. Post-Deployment Wiring

### Update ALLOWED_ORIGINS in API
Go back to Replit → Secrets → update `ALLOWED_ORIGINS`:
```
https://omni-life.vercel.app
```
Restart the Replit repl.

### Add Vercel URL to Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Open your OAuth 2.0 Client ID
3. Under **Authorised redirect URIs** add:
   ```
   https://omni-life.vercel.app/api/auth/callback/google
   ```
4. Save

---

## 4. Smoke Test (Production)

- [ ] Visit `https://omni-life.vercel.app`
- [ ] Login page loads
- [ ] Click "Continue with Google" → Google consent screen appears
- [ ] After consent → redirected to `/dashboard`
- [ ] Dashboard shows your name and avatar
- [ ] Visit `https://your-api.repl.co/docs` → Swagger UI loads
- [ ] Sign out → redirected back to `/`
- [ ] Direct visit to `/dashboard` without login → redirected to `/`

---

## Alternative: Deploy API → Vercel (Serverless)

If Replit is not preferred, the API can also run on Vercel as a serverless function.

```bash
cd omni-life/omni-life-api
vercel --prod
```

Set the same secrets as environment variables in the Vercel dashboard.

> **Note:** Vercel serverless functions have a cold start penalty (~500ms). For production, Replit (always-on) or Railway is preferred for the API.

---

## Rollback

### Vercel
- Go to **Deployments** tab → find the last working deployment → **Promote to Production**

### Replit
- Use Replit's built-in version history (sidebar → History) to revert to a prior state

---

## Local Development vs Production

| Setting | Local | Production |
|---------|-------|------------|
| Frontend URL | `http://localhost:3000` | `https://omni-life.vercel.app` |
| API URL | `http://localhost:8000` | `https://your-api.repl.co` |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://omni-life.vercel.app` |
| Google redirect URI | `http://localhost:3000/api/auth/callback/google` | `https://omni-life.vercel.app/api/auth/callback/google` |
