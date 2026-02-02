# Push Docker Images to Docker Hub (GitHub Flow)

This guide explains how to build and push TaskFlow Kanban Docker images to Docker Hub using GitHub Actions.

## 1. GitHub secrets

In your GitHub repo: **Settings → Secrets and variables → Actions**, add:

| Secret               | Description |
|----------------------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username. Use `medsidatt` if you use the default image names in `docker-compose.yml` (`medsidatt/taskflow-backend:latest`, `medsidatt/taskflow-frontend:latest`). |
| `DOCKERHUB_TOKEN`    | Docker Hub access token (not your password). Create at [Docker Hub → Account Settings → Security → New Access Token](https://hub.docker.com/settings/security). Use “Read, Write, Delete” for push. |

## 2. How images get pushed

### Option A: Push or merge to `main`

- **Full Stack Tests** (`.github/workflows/full-test.yml`) runs on every push/PR to `main`.
- It runs backend and frontend tests, then **builds and pushes** both images to Docker Hub **only on push to `main`** (not on PRs).
- Flow: push or merge to `main` → tests run → if tests pass and event is push → `docker-publish` runs → images pushed as `DOCKERHUB_USERNAME/taskflow-backend:latest` and `DOCKERHUB_USERNAME/taskflow-frontend:latest`.

### Option B: Manual run (Publish Docker Images)

- Go to **Actions** → **Publish Docker images** → **Run workflow**.
- Choose the branch (usually `main`) and run.
- This builds and pushes both images without running the full test suite. Use when you only want to update images (e.g. after testing locally).

## 3. After push

- Pull and run with the default compose file (uses Docker Hub images):

  ```bash
  docker compose up -d
  ```

- Or build locally and run:

  ```bash
  docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
  ```

## 4. Summary

| Goal                         | Action |
|-----------------------------|--------|
| Run tests and push on merge | Merge to `main` (or push to `main`). |
| Push images only            | Actions → **Publish Docker images** → Run workflow. |
| Use pushed images elsewhere | `docker compose up -d` (with `.env` and same image names in `docker-compose.yml`). |
