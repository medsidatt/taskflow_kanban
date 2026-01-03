# TaskFlow Kanban - Quick Start Guide

## Prerequisites

- Docker & Docker Compose
- (Optional) Java 21 & Node.js 20+ for local development

## 1. Environment Setup

Create `.env` file in project root:

```bash
POSTGRES_DB=taskflow_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
JWT_SECRET=your_256_bit_secret_key_change_in_production
JWT_EXPIRATION=86400000
```

## 2. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

**Access the application:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- API Docs: http://localhost:8080/api/api-docs

## 3. Default Credentials

```
Username: user
Password: password
```

**⚠️ Change these in production!**

## 4. Local Development (Optional)

### Backend Only

```bash
# Start database
docker-compose -f docker-compose.dev.yml up -d

# Run backend locally
cd backend
./mvnw spring-boot:run
```

### Frontend Only

```bash
# Start backend (see above)
# Then run frontend
cd frontend
npm install
npm start
```

## 5. Key API Endpoints

### Authentication
```bash
# Register
POST /api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST /api/auth/login
{
  "username": "user",
  "password": "password"
}
```

### Workspaces
```bash
# Get workspaces
GET /api/workspaces

# Create workspace
POST /api/workspaces
{
  "name": "My Workspace",
  "description": "A workspace for my team"
}
```

### Boards
```bash
# Get boards in workspace
GET /api/boards?workspaceId={uuid}

# Create board
POST /api/boards
{
  "name": "Sprint Board",
  "workspaceId": "{uuid}",
  "isPrivate": false
}
```

### Cards
```bash
# Get cards in column
GET /api/cards?columnId={uuid}

# Create card
POST /api/cards
{
  "title": "New Task",
  "description": "Task description",
  "columnId": "{uuid}",
  "priority": 1
}

# Move card
PUT /api/cards/{id}/move
{
  "targetColumnId": "{uuid}",
  "newPosition": 0
}
```

## 6. Common Tasks

### Reset Database

```bash
# Stop everything
docker-compose down -v

# Start fresh
docker-compose up -d
```

### View Database

```bash
# Connect to PostgreSQL
docker exec -it taskflow-postgres psql -U postgres -d taskflow_db

# List tables
\dt

# View data
SELECT * FROM boards;
```

### Check Health

```bash
# Backend health
curl http://localhost:8080/api/actuator/health

# Should return:
# {"status":"UP"}
```

### Build for Production

```bash
# Build images
docker-compose build

# Tag and push (replace with your registry)
docker tag taskflow-backend:latest myregistry/taskflow-backend:1.0
docker tag taskflow-frontend:latest myregistry/taskflow-frontend:1.0
docker push myregistry/taskflow-backend:1.0
docker push myregistry/taskflow-frontend:1.0
```

## 7. Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Database not ready: Wait 30 seconds and check again
# - Port conflict: Change port in docker-compose.yml
# - Flyway error: Check migration files in src/main/resources/db/migration
```

### Frontend won't connect to backend
```bash
# Check environment
cat frontend/src/environments/environment.ts

# Should have:
# apiUrl: 'http://localhost:8080/api'

# Check CORS in backend
# SecurityConfig.java should allow your frontend origin
```

### Database connection refused
```bash
# Verify database is running
docker-compose ps postgres

# Check environment variables
cat .env

# Recreate database
docker-compose down postgres
docker-compose up -d postgres
```

## 8. Project Structure

```
taskflow-kanban/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Config & migrations
│   └── pom.xml             # Maven dependencies
├── frontend/               # Angular application
│   ├── src/app/           # Application code
│   └── package.json       # NPM dependencies
├── docker-compose.yml     # Production compose file
├── docker-compose.dev.yml # Development compose file
├── .env                   # Environment variables (create this)
└── UPGRADE-SUMMARY.md     # Detailed documentation
```

## 9. Demo Data

The application comes with demo data (V5 migration):
- 3 users: `user`, `alice`, `bob` (all password: `password`)
- 2 workspaces
- 2 boards with sample cards

## 10. Next Steps

1. ✅ Read UPGRADE-SUMMARY.md for detailed documentation
2. ✅ Change default passwords
3. ✅ Customize JWT secret
4. ✅ Configure CORS for your domain
5. ✅ Set up monitoring
6. ✅ Add tests
7. ✅ Deploy to production

## Support

For issues, check:
- UPGRADE-SUMMARY.md (comprehensive guide)
- ARCHITECTURE.md (system design)
- Backend logs: `docker-compose logs backend`
- Frontend logs: `docker-compose logs frontend`

---

**Happy Building! 🚀**
