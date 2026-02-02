# TaskFlow Kanban - Manual Build and Run with Docker

Build Docker images from source, run the stack locally, then push to Docker Hub when ready.

## One script: build, run, then push

From the project root (PowerShell):

```powershell
.\build-run-then-push.ps1
```

This script will:

1. Create `.env` from a template if missing
2. Build backend and frontend images
3. Start Postgres, backend, and frontend with Docker Compose
4. Wait for the backend to be ready
5. Print service URLs and the exact `docker tag` / `docker push` commands to use when you are ready to push

Set `$env:DOCKERHUB_USERNAME` before running if your Docker Hub username is not `medsidatt`.

---

## Prerequisites

- Docker installed
- `.env` file with required variables (see Step 1), or let the script create it

---

## 1. Create `.env` File

Create `.env` in the project root:

```
POSTGRES_DB=taskflow
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=YourSecurePassword123!

JWT_SECRET=mySecretKeyForTaskFlowKanban2024!
JWT_EXPIRATION=86400000

SPRING_JPA_SHOW_SQL=false
```

---

## 2. Build Images

**Backend:**
```cmd
cd backend
docker build -t taskflow-backend:latest .
cd ..
```

**Frontend:**
```cmd
cd frontend
docker build -t taskflow-frontend:latest .
cd ..
```

---

## 3. Build and Run with Docker Compose (Recommended)

Use `docker-compose.build.yml` to build images locally instead of pulling:

```cmd
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

This builds backend and frontend from source and runs the full stack (Postgres + backend + frontend).

**Rebuild after code changes:**
```cmd
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

**Without rebuild flag (uses cached images):**
```cmd
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d
```

---

## 4. Run Manually (without Docker Compose)

**Create network and volume:**
```cmd
docker network create taskflow-network
docker volume create taskflow-postgres-data
```

**PostgreSQL:**
```cmd
docker run -d --name taskflow-postgres --network taskflow-network -v taskflow-postgres-data:/var/lib/postgresql/data -e POSTGRES_DB=taskflow -e POSTGRES_USER=taskflow -e POSTGRES_PASSWORD=YourSecurePassword123! -p 5432:5432 postgres:16-alpine
```

**Backend** (name must be `backend` for frontend nginx proxy):
```cmd
docker run -d --name backend --network taskflow-network -e SPRING_DATASOURCE_URL=jdbc:postgresql://taskflow-postgres:5432/taskflow -e SPRING_DATASOURCE_USERNAME=taskflow -e SPRING_DATASOURCE_PASSWORD=YourSecurePassword123! -e SPRING_JPA_HIBERNATE_DDL_AUTO=update -e SPRING_JPA_SHOW_SQL=false -e SPRING_PROFILES_ACTIVE=docker -e JWT_SECRET=mySecretKeyForTaskFlowKanban2024! -e JWT_EXPIRATION=86400000 -p 8080:8080 taskflow-backend:latest
```

**Frontend:**
```cmd
docker run -d --name taskflow-frontend --network taskflow-network -p 4200:80 taskflow-frontend:latest
```

---

## 5. Service URLs

| Service  | URL                           |
|----------|-------------------------------|
| Frontend | http://localhost:4200         |
| Backend  | http://localhost:8080/api     |
| Swagger  | http://localhost:8080/api/swagger-ui.html |

---

## 6. Push to Docker Hub (after testing)

When the stack is running and you have tested it, tag and push:

```cmd
docker login
docker tag taskflow-backend:latest   <YOUR_DOCKERHUB_USER>/taskflow-backend:latest
docker tag taskflow-frontend:latest <YOUR_DOCKERHUB_USER>/taskflow-frontend:latest
docker push <YOUR_DOCKERHUB_USER>/taskflow-backend:latest
docker push <YOUR_DOCKERHUB_USER>/taskflow-frontend:latest
```

Replace `<YOUR_DOCKERHUB_USER>` with your Docker Hub username (e.g. `medsidatt`). The script `build-run-then-push.ps1` prints these commands with your username.

---

## 7. Quick Reference

**One command (build + run):**
```cmd
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

**Stop (when using build override):**
```cmd
docker compose -f docker-compose.yml -f docker-compose.build.yml down
```
