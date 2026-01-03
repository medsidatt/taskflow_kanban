# TaskFlow Kanban - Quick Start Guide

Get TaskFlow Kanban up and running in 5 minutes!

## Prerequisites

- Docker Desktop installed and running
- Git (optional, for cloning)

## Step 1: Get the Code

```bash
git clone https://github.com/yourusername/taskflow-kanban.git
cd taskflow-kanban
```

## Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file (optional - defaults work for development)
# Update POSTGRES_PASSWORD and JWT_SECRET for production
```

## Step 3: Start the Application

```bash
# Build and start all services
docker-compose up --build
```

Wait for all services to start (this may take a few minutes on first run).

## Step 4: Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html

## Step 5: Create Your First Account

1. Click "Register" on the login page
2. Fill in your details
3. Start creating workspaces and boards!

## Default Demo Data

The application initializes with demo data:
- Sample workspaces
- Example boards with columns
- Test cards

## Common Commands

```bash
# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart backend

# Clean up everything (including database)
docker-compose down -v

# Run in development mode (database only)
docker-compose -f docker-compose.dev.yml up
```

## Troubleshooting

### Port Already in Use

If you see port conflict errors:

```bash
# Check what's using the port
# Windows
netstat -ano | findstr :8080

# macOS/Linux
lsof -i :8080

# Change ports in docker-compose.yml
ports:
  - "8081:8080"  # Change 8081 to any available port
```

### Database Connection Issues

```bash
# Wait for database to be ready
docker-compose logs postgres

# Recreate database
docker-compose down -v
docker-compose up
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

## Development Mode

### Backend Development

```bash
# Start database only
docker-compose -f docker-compose.dev.yml up postgres

# In another terminal, run backend locally
cd backend
mvn spring-boot:run
```

### Frontend Development

```bash
# Install dependencies
cd frontend
npm install

# Start development server with hot reload
npm start
```

Access at http://localhost:4200 with auto-reload on file changes.

## Next Steps

- Read the [full documentation](README.md)
- Check out the [architecture guide](ARCHITECTURE.md)
- Learn about [contributing](CONTRIBUTING.md)
- Explore the [API documentation](http://localhost:8080/api/swagger-ui.html)

## Need Help?

- Check logs: `docker-compose logs -f`
- Read the [troubleshooting section](README.md#troubleshooting)
- Open an issue on GitHub

## Quick Tips

1. **First Time Setup**: Initial build takes longer, subsequent starts are faster
2. **Database Persistence**: Data persists in Docker volumes even after stopping containers
3. **Hot Reload**: Use development mode for frontend/backend hot reload
4. **API Testing**: Use Swagger UI for interactive API testing
5. **Clean Slate**: Use `docker-compose down -v` to reset everything

---

**Happy Coding! 🚀**

For detailed information, see the [complete README](README.md).
