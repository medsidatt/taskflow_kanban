# TaskFlow Kanban - Docker Compose

This guide explains how to run TaskFlow Kanban using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- Images from Docker Hub (or built locally)

## 1. Create `.env` File

Create a `.env` file in the project root:

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

## 7. Restart

```cmd
docker compose down
docker compose up -d
```

## 8. Troubleshooting

**Password authentication failed for user "taskflow":**
- Ensure `.env` values match. PostgreSQL stores credentials on first init.
- Reset: `docker compose down -v` then `docker compose up -d`

**Frontend cannot reach backend:**
- Verify all services on `taskflow-network`: `docker network inspect taskflow-taskflow-network`
- Check backend health: `curl http://localhost:8080/api/actuator/health`
