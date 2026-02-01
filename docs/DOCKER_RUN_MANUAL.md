# TaskFlow Kanban - Manual Docker Run (with Volumes)

This guide explains how to run the TaskFlow Kanban stack manually using `docker run` with named volumes for data persistence.

## Prerequisites

- Docker installed
- Images pulled from Docker Hub: `medsidatt/taskflow-backend:latest`, `medsidatt/taskflow-frontend:latest`, `postgres:16-alpine`

## 1. Create Network and Volume

```cmd
docker network create taskflow-network
docker volume create taskflow-postgres-data
```

## 2. Environment Variables

Use these values in the commands below (replace with your own for production):

- `POSTGRES_DB=taskflow`
- `POSTGRES_USER=taskflow`
- `POSTGRES_PASSWORD=YourSecurePassword123!`
- `JWT_SECRET=mySecretKeyForTaskFlowKanban2024!`
- `JWT_EXPIRATION=86400000`

**Important:** The frontend nginx proxies `/api` to hostname `backend`. The backend container must be named `backend` when running manually.

## 3. Run PostgreSQL

```cmd
docker run -d --name taskflow-postgres --network taskflow-network -v taskflow-postgres-data:/var/lib/postgresql/data -e POSTGRES_DB=taskflow -e POSTGRES_USER=taskflow -e POSTGRES_PASSWORD=YourSecurePassword123! -p 5432:5432 postgres:16-alpine
```

Wait a few seconds for Postgres to be ready. Verify: `docker ps`

## 4. Run Backend

```cmd
docker run -d --name backend --network taskflow-network -e SPRING_DATASOURCE_URL=jdbc:postgresql://taskflow-postgres:5432/taskflow -e SPRING_DATASOURCE_USERNAME=taskflow -e SPRING_DATASOURCE_PASSWORD=YourSecurePassword123! -e SPRING_JPA_HIBERNATE_DDL_AUTO=update -e SPRING_JPA_SHOW_SQL=false -e SPRING_PROFILES_ACTIVE=docker -e JWT_SECRET=mySecretKeyForTaskFlowKanban2024! -e JWT_EXPIRATION=86400000 -p 8080:8080 medsidatt/taskflow-backend:latest
```

**Note:** Container is named `backend` so the frontend nginx can resolve it.

## 5. Run Frontend

```cmd
docker run -d --name taskflow-frontend --network taskflow-network -p 4200:80 medsidatt/taskflow-frontend:latest
```

## 6. Verify

```cmd
docker ps
curl http://localhost:8080/api/actuator/health
```

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8080/api
- **Swagger:** http://localhost:8080/api/swagger-ui.html

## 7. Stop and Remove Containers

```cmd
docker stop taskflow-frontend backend taskflow-postgres
docker rm taskflow-frontend backend taskflow-postgres
```

**Data persists** in volume `taskflow-postgres-data`. To remove it:

```cmd
docker volume rm taskflow-postgres-data
```

## Volumes Summary

| Volume                 | Purpose                     |
|------------------------|-----------------------------|
| taskflow-postgres-data | PostgreSQL data persistence |

## Troubleshooting

**Password authentication failed:** Ensure Postgres and backend use the same `POSTGRES_USER` and `POSTGRES_PASSWORD`. If you changed credentials, remove the volume and start fresh: `docker volume rm taskflow-postgres-data`.

**Frontend cannot reach API:** Ensure the backend container is named `backend` and all containers are on `taskflow-network`. Check with `docker network inspect taskflow-network`.
