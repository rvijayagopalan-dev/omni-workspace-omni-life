# Contributing

---

## Getting Started

1. Read `CLAUDE.md` — coding conventions and project rules
2. Read `BUILD_STATE.md` — understand what is in progress
3. Set up your local environment — see `ENVIRONMENT.md` and `DEPLOYMENT.md`
4. Run both projects locally and confirm the login flow works end-to-end

---

## Branch Strategy

```
main          ← production-ready, protected
  └── dev     ← integration branch, PR target for features
        └── feature/my-feature
        └── fix/bug-description
        └── chore/task-description
        └── docs/update-description
```

- Branch off `dev`, not `main`
- PRs go to `dev` — only `dev → main` merges go to production
- Never push directly to `main`

### Branch naming
```
feature/add-tasks-endpoint
fix/cors-header-missing
chore/update-dependencies
docs/add-deployment-guide
```

---

## Commit Messages

Format: `<type>: <short imperative description>`

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance, dependency updates |
| `docs` | Documentation only |
| `refactor` | Code restructure, no behaviour change |
| `test` | Adding or updating tests |
| `style` | Formatting, whitespace — no logic change |

### Examples
```
feat: add GET /api/tasks endpoint
fix: correct NEXTAUTH_URL in production config
docs: update DEPLOYMENT.md with Replit secrets steps
chore: upgrade fastapi to 0.112
```

---

## Pull Request Process

1. **Scope** — One feature or fix per PR. Keep PRs small and reviewable.
2. **Description** — Explain what changed and why. Reference `BUILD_STATE.md` task if applicable.
3. **Checklist** before opening a PR:
   - [ ] Code follows conventions in `CLAUDE.md`
   - [ ] No secrets or `.env` files committed
   - [ ] `npm run lint` passes (frontend)
   - [ ] `uvicorn main:app` starts without errors (backend)
   - [ ] New env vars added to `.env.example` and `ENVIRONMENT.md`
   - [ ] `CHANGELOG.md` updated under `[Unreleased]`
   - [ ] `BUILD_STATE.md` updated if a task is completed
4. **Review** — At least one approval required before merge
5. **Squash merge** — Prefer squash commits to keep `dev` history clean

---

## Local Development

### Frontend
```bash
cd omni-life-ui
npm install
npm run dev        # http://localhost:3000
npm run lint       # ESLint check
npm run build      # production build check
```

### Backend
```bash
cd omni-life-api
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload     # http://localhost:8000
# API docs: http://localhost:8000/docs
```

---

## Adding New Features

### New API endpoint
1. Add router file in `omni-life-api/routers/` if it's a new domain
2. Register router in `main.py`
3. Add Pydantic request/response models
4. Protect with `Depends(get_current_user)` if auth required
5. Document in `BUILD_STATE.md` and `CHANGELOG.md`

### New frontend page
1. Create `src/app/<route>/page.tsx`
2. If protected, confirm `src/middleware.ts` matcher covers the route
3. Use Tailwind for all styling
4. Fetch data in a Client Component using `useSession` to get the `idToken`

---

## Code Review Checklist (Reviewer)

- [ ] Auth flows match the pattern in `ARCHITECTURE.md`
- [ ] No hardcoded URLs, credentials, or secrets
- [ ] CORS — new origins added to `ENVIRONMENT.md` and `ALLOWED_ORIGINS`
- [ ] TypeScript — no untyped `any` without justification
- [ ] Python — all functions have type hints
- [ ] Response models defined (FastAPI) — no bare `dict` returns
- [ ] No new packages added without updating `requirements.txt` or `package.json`

---

## Reporting Issues

Open an issue in the GitHub repository with:
- **Title:** Short description of the problem
- **Environment:** Local / Preview / Production
- **Steps to reproduce**
- **Expected vs actual behaviour**
- **Screenshots** if UI-related
