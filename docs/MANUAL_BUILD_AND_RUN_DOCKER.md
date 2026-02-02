# TaskFlow Kanban - Manual Build and Run with Docker

Build Docker images from source and run them locally (without pulling from Docker Hub).

## Prerequisites

- Docker installed
- `.env` file with required variables (see Step 1)

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

## 7. Quick Reference

**One command (build + run):**
```cmd
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

**Stop:**
```cmd
docker compose down
```
