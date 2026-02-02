# TaskFlow Kanban - Manual Build and Run

Run backend and frontend from source without Docker.

## Prerequisites

- **Java 21** (for backend)
- **Node.js 20** (for frontend)
- **PostgreSQL 16** (or compatible)
- **Maven** (or use `./mvnw` from backend)

---

## 1. Database Setup

Create a PostgreSQL database:

```cmd
psql -U postgres
CREATE DATABASE taskflow_db;
```

Default config in `application.yml` uses:
- Host: `localhost:5432`
- Database: `taskflow_db`
- Username: `postgres`
- Password: `root`

Override with environment variables if needed:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taskflow_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
```

---

## 2. Backend - Build and Run

**Windows:**
```cmd
cd backend
mvnw.cmd spring-boot:run
```

**Linux/macOS:**
```cmd
cd backend
./mvnw spring-boot:run
```

Or build then run:
```cmd
cd backend
mvnw.cmd clean package -DskipTests
java -jar target/taskflow-kanban-backend-1.0.0.jar
```
(Use `./mvnw` on Linux/macOS instead of `mvnw.cmd`)

**Backend URL:** http://localhost:8080/api

---

## 3. Frontend - Build and Run

**Development (with live reload):**
```cmd
cd frontend
npm install
npm start
```

Opens http://localhost:4200 (API: http://localhost:8080/api)

**Production build:**
```cmd
cd frontend
npm install
npm run build
```

Output in `frontend/dist/frontend/browser`. Serve with any static server (e.g. `npx serve dist/frontend/browser`).

---

## 4. Quick Reference

| Step     | Command                         | URL                    |
|----------|---------------------------------|------------------------|
| Database | Start Postgres                  | localhost:5432         |
| Backend  | `cd backend && ./mvnw spring-boot:run` | http://localhost:8080/api |
| Frontend | `cd frontend && npm start`      | http://localhost:4200  |

---

## 5. Environment Variables (Backend)

| Variable                     | Default                                         |
|-----------------------------|-------------------------------------------------|
| SPRING_DATASOURCE_URL       | jdbc:postgresql://localhost:5432/taskflow_db    |
| SPRING_DATASOURCE_USERNAME  | postgres                                        |
| SPRING_DATASOURCE_PASSWORD  | root                                            |
| JWT_SECRET                  | TaskFlowKanbanSecretKey...                      |
| JWT_EXPIRATION              | 86400000                                        |

---

## 6. Troubleshooting

**Backend: "Connection refused" to Postgres**
- Ensure PostgreSQL is running
- Check host/port/user/password match your DB

**Frontend: API calls fail**
- Ensure backend is running on port 8080
- Dev mode uses `apiUrl: 'http://localhost:8080/api'` in `environment.ts`
