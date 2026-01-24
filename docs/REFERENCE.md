# TaskFlow Kanban — Reference Documentation

Quick reference for developers: configuration, API, testing, and CI/CD.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Environment Variables](#environment-variables)
- [Useful Commands](#useful-commands)

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Backend** | Spring Boot | 3.3.4 |
| | Java | 21 |
| | PostgreSQL | 16 |
| | Flyway | (managed) |
| | JWT (jjwt) | 0.11.5 |
| | MapStruct | 1.5.5 |
| **Frontend** | Angular | 20.x |
| | TypeScript | 5.9 |
| | Angular CDK | 20.x |
| **DevOps** | Docker / Compose | 24+ / 2.20+ |
| | GitHub Actions | - |
| | Qodana | 2025.2 |

---

## Project Structure

```
taskflow-kanban/
├── backend/                    # Spring Boot API
│   ├── src/main/java/          # Application code
│   │   └── com/taskflow/kanban/
│   │       ├── auth/           # Authentication
│   │       ├── board/          # Boards, columns, cards, labels
│   │       ├── user/           # Users, roles
│   │       ├── workspace/      # Workspaces, members
│   │       ├── config/         # Configuration
│   │       ├── security/       # JWT, Security
│   │       └── exception/      # Global exception handling
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway migrations (PostgreSQL)
│   │   └── application*.yml    # Config
│   └── src/test/               # Unit & integration tests
├── frontend/                   # Angular SPA
│   ├── src/app/
│   │   ├── core/               # Services, models, guards
│   │   ├── features/           # Auth, board, workspace, etc.
│   │   └── shared/             # Components, pipes
│   └── src/environments/       # Environment config
├── .github/workflows/          # CI/CD
├── docker-compose*.yml         # Docker setup
└── docs/                       # Documentation
```

---

## Configuration

### Backend

- **Main config**: `backend/src/main/resources/application.yml`
- **Docker**: `application-docker.yml` (profile `docker`)
- **Tests**: `backend/src/test/resources/application-test.properties`
  - H2 in-memory DB, Flyway disabled, Hibernate `ddl-auto=create-drop`
  - Initial data: `data.sql` (USER, ADMIN roles)

### Frontend

- **Env**: `frontend/src/environments/environment.ts` (dev), `environment.prod.ts` (prod)
- **API base**: see `api.constants.ts` or environment files

### Context Path

- Backend API base: **`/api`** (e.g. `http://localhost:8080/api`)

---

## API Reference

### Base URL

- Local: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api/v3/api-docs`

### Main Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register user |
| `POST` | `/auth/login` | Login |
| `POST` | `/auth/refresh` | Refresh JWT |
| `POST` | `/auth/logout` | Logout |
| `GET` | `/workspaces` | List workspaces |
| `POST` | `/workspaces` | Create workspace |
| `GET` | `/workspaces/{id}` | Get workspace |
| `PUT` | `/workspaces/{id}` | Update workspace |
| `DELETE` | `/workspaces/{id}` | Delete workspace |
| `GET` | `/boards` | List boards |
| `POST` | `/boards` | Create board |
| `GET` | `/boards/{id}` | Get board |
| `PUT` | `/boards/{id}` | Update board |
| `DELETE` | `/boards/{id}` | Delete board |
| `GET` | `/columns` | List columns |
| `POST` | `/columns` | Create column |
| `GET` | `/cards` | List cards |
| `POST` | `/cards` | Create card |
| `PUT` | `/cards/{id}/move` | Move card |
| `GET` | `/labels` | List labels |
| `POST` | `/labels` | Create label |

### Authentication

- **Header**: `Authorization: Bearer <access_token>`
- **Login request**: `{ "login": "emailOrUsername", "password": "..." }`
- **Register**: `{ "username", "email", "password" }`

---

## Testing

### Backend (Maven)

```bash
cd backend
./mvnw clean test
```

- **Profile**: `test` (H2, Flyway disabled, `data.sql` for roles)
- **Unit tests**: `*Test.java`, `*ServiceTest.java`
- **Integration**: `*SecurityTest.java`, `*ControllerSecurityTest.java`
- **Reports**: `backend/target/surefire-reports/`

### Frontend (Karma/Jasmine)

```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

- **Config**: `angular.json` (Karma section)
- **Specs**: `*.spec.ts`
- **CI**: use `--watch=false --browsers=ChromeHeadless`

### Test Configuration (Backend)

- **DB**: H2 in-memory (`jdbc:h2:mem:testdb`)
- **Flyway**: disabled (`spring.flyway.enabled=false`)
- **Schema**: Hibernate `create-drop`
- **Data**: `src/test/resources/data.sql` (USER, ADMIN roles)
- **JWT**: test secret in `application-test.properties`

### Security / Integration Tests

- **Workspace** update/delete: test user must be **workspace member** (e.g. OWNER).
- **Board** operations (e.g. create column): test user must be **workspace member** and **board member** (e.g. OWNER).
- See `WorkspaceControllerSecurityTest`, `BoardControllerSecurityTest` for examples.

### Troubleshooting Tests

| Issue | Action |
|-------|--------|
| Flyway / PostgreSQL SQL errors in tests | Ensure `spring.flyway.enabled=false` in `application-test.properties` |
| 403 in security tests | Add `WorkspaceMember` / `BoardMember` with OWNER for test user |
| `UnauthorizedException` in auth test | Use `assertThrows(UnauthorizedException.class, ...)` for invalid login |
| Frontend specs fail on title | Use `TaskFlow Kanban`; ensure `ThemeService` and `provideRouter` are mocked |

---

## CI/CD

### Workflows (`.github/workflows/`)

| Workflow | Triggers | Jobs |
|----------|----------|------|
| **Backend CI/CD** | Push/PR to `main`, `backend/**` | Build, unit+integration tests, upload reports; on `main`: Docker build & push |
| **Frontend CI/CD** | Push/PR to `main`, `frontend/**` | Lint, build, unit tests, coverage; on `main`: Docker build & push |
| **Full Stack Tests** | Push/PR to `main`, manual | Backend + frontend tests in parallel |
| **Qodana** | Push/PR to `main`, manual | Code quality |

### Required Secrets

- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` — for Docker push
- `QODANA_TOKEN` (optional) — for Qodana

### Artifacts

- Backend: `backend-test-results` (`surefire-reports/`)
- Frontend: `frontend-test-coverage` (`coverage/`), `frontend-test-results` (`karma-results/`)

### Actions Versions

- `actions/checkout@v4`
- `actions/setup-java@v4`, `actions/setup-node@v4`
- `actions/upload-artifact@v4`
- `docker/login-action@v3`

---

## Environment Variables

### Application (`.env`)

```env
POSTGRES_DB=taskflow_db
POSTGRES_USER=taskflow_user
POSTGRES_PASSWORD=<secure>
JWT_SECRET=<min 256 bits>
JWT_EXPIRATION=86400000
SPRING_PROFILES_ACTIVE=docker
```

### Backend (optional)

- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`, `SPRING_JPA_SHOW_SQL`

---

## Useful Commands

| Task | Command |
|------|---------|
| Backend tests | `cd backend && ./mvnw clean test` |
| Frontend tests | `cd frontend && npm test -- --watch=false --browsers=ChromeHeadless` |
| Frontend build | `cd frontend && npm run build` |
| Backend run | `cd backend && ./mvnw spring-boot:run` |
| Frontend run | `cd frontend && npm start` |
| Docker up | `docker-compose up -d --build` |
| Docker down | `docker-compose down` |
| Swagger UI | Open `http://localhost:8080/api/swagger-ui.html` |

---

## Related Docs

- [Testing Guide](TESTING-GUIDE.md) — manual and automated testing
- [Architecture](ARCHITECTURE.md) — system design
- [Quick Start](QUICKSTART.md) — run the app
- [README](../README.md) — project overview

---

*Last updated: 2026-01*
