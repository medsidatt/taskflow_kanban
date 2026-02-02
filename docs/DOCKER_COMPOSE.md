# TaskFlow Kanban - Docker Compose

This guide explains how to run TaskFlow Kanban using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- Images from Docker Hub (or built locally)

## 1. Create `.env` File

Create a `.env` file **in the same directory as `docker-compose.yml`** (the folder from which you run `docker compose`):

```
# Database Configuration
POSTGRES_DB=taskflow
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=YourSecurePassword123!

# JWT Configuration
JWT_SECRET=mySecretKeyForTaskFlowKanban2024!
JWT_EXPIRATION=86400000

# Optional: Show SQL in backend logs (true/false)
SPRING_JPA_SHOW_SQL=false
```

**Important:** If you run from a **different folder** (e.g. a copy like `run-project\taskflow`), you must have a `.env` file **in that folder** with the same values. Otherwise the backend gets no DB credentials or JWT config and login/register will fail.

## 2. Pull Images

```cmd
docker pull medsidatt/taskflow-backend:latest
docker pull medsidatt/taskflow-frontend:latest
docker pull postgres:16-alpine
```

## 3. Start Stack

```cmd
docker compose up -d
```

Or from project root:

```cmd
cd c:\workspace\taskflow-kanban
docker compose up -d
```

## 4. Service URLs

| Service   | URL                                              |
|-----------|--------------------------------------------------|
| Frontend  | http://localhost:4200                            |
| Backend   | http://localhost:8080/api                        |
| Swagger   | http://localhost:8080/api/swagger-ui.html        |
| Postgres  | localhost:5432 (internal)                        |

## 5. Useful Commands

**View logs:**
```cmd
docker compose logs -f
```

**View specific service:**
```cmd
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

**Check status:**
```cmd
docker compose ps
```

**Stop services:**
```cmd
docker compose down
```

**Stop and remove volumes (deletes database data):**
```cmd
docker compose down -v
```

## 6. Volumes

| Volume       | Service  | Purpose               |
|--------------|----------|-----------------------|
| postgres_data| postgres | PostgreSQL data files |

Data persists across `docker compose down`. Use `docker compose down -v` to remove volumes and reset data.

**Running from another folder (e.g. `run-project\taskflow`):** Docker Compose uses the **directory name** as the project name. A different folder = different project = **different volume** (e.g. `taskflow_postgres_data` instead of `taskflow-kanban_postgres_data`). So you get a **new, empty database**. Use **Sign up** in the app to create an account first, then log in. Copy `.env` into that folder too so DB and JWT config are correct.

## 7. Restart

```cmd
docker compose down
docker compose up -d
```

## 8. Troubleshooting

**Pulled from Docker Hub but app doesn’t work / frontend never starts:**

- **Cause:** The backend container’s healthcheck uses `curl`. Older backend images didn’t include `curl`, so the healthcheck failed and the backend was never marked healthy. The frontend has `depends_on: backend: condition: service_healthy`, so it waited forever and never started.
- **Fix:** Use a backend image that includes `curl` (the Dockerfile was updated to install it). Pull the latest images and run again: `docker compose pull && docker compose up -d`. If you built images before this fix, rebuild the backend and push a new image.
- **Check:** `docker compose ps` — if the frontend is missing or not “Up”, check backend health: `docker compose logs backend` and ensure the backend image has curl (or rebuild from current Dockerfile).

**Password authentication failed for user "taskflow":**
- Ensure `.env` values match. PostgreSQL stores credentials on first init.
- Reset: `docker compose down -v` then `docker compose up -d`

**Frontend cannot reach backend:**
- Verify all services on `taskflow-network`: `docker network inspect taskflow-taskflow-network`
- Check backend health: `curl http://localhost:8080/api/actuator/health`

**Login or Register fails / "Can't login and register":**

1. **Running from a different folder (e.g. `run-project\taskflow`)?**  
   - You need a **`.env` file in that folder** with the same DB and JWT values (see Step 1). Without it, the backend can’t connect or sign tokens.  
   - That folder is a **different Compose project** → **new volume** → **empty database**. Use **Sign up** to create an account, then log in.

2. **Check browser DevTools** (F12 → Network tab): What is the HTTP status? 502, 504, 500, 401, 404?

3. **Verify backend is reachable:**
   ```cmd
   curl http://localhost:8080/api/actuator/health
   ```
   Should return `{"status":"UP"}`.

4. **Test auth API directly:**
   ```cmd
   curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
   ```

5. **Check backend logs** for errors:
   ```cmd
   docker compose logs backend
   ```

6. **Ensure frontend proxies to backend:** Use **http://localhost:4200** (not 8080) to access the app. The frontend nginx proxies `/api` to the backend.

7. **If using manual docker run:** Backend container must be named `backend` and all containers on the same network. See `docs/DOCKER_RUN_MANUAL.md`.
