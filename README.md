# TaskFlow Kanban

A modern, full-stack Kanban board application built with **Angular 19** and **Spring Boot 3**, featuring Docker containerization and enterprise-grade architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)
![Angular](https://img.shields.io/badge/Angular-19-red.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Best Practices](#best-practices)
- [Security](#security)
- [Testing](#testing)
- [Contributing](#contributing)

## ✨ Features

- 🎯 **Kanban Boards**: Create and manage multiple boards with columns and cards
- 👥 **Workspaces**: Organize boards into workspaces with team collaboration
- 🔐 **Authentication & Authorization**: JWT-based secure authentication with role-based access control
- 🏷️ **Labels & Tags**: Organize cards with customizable labels
- 💬 **Comments**: Real-time collaboration with card comments
- 📎 **Attachments**: Upload and manage file attachments
- 📊 **Activity Tracking**: Comprehensive audit logs for all actions
- 🎨 **Modern UI**: Responsive and intuitive user interface
- 🐳 **Docker Ready**: Fully containerized for easy deployment
- 📚 **API Documentation**: Interactive Swagger UI documentation

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **Security**: Spring Security + JWT
- **ORM**: JPA/Hibernate
- **Migration**: Flyway
- **Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven
- **Additional Libraries**:
  - MapStruct (DTO mapping)
  - Lombok (Boilerplate reduction)
  - Validation API

### Frontend
- **Framework**: Angular 19
- **Language**: TypeScript 5.7
- **Styling**: CSS3
- **HTTP Client**: Angular HttpClient with Interceptors
- **Routing**: Angular Router with Guards
- **Build Tool**: Angular CLI

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Code Quality**: Qodana

## 🏗️ Architecture

### Backend Architecture (Layered Architecture)

```
backend/
├── controller/     # REST API endpoints
├── service/        # Business logic
├── repository/     # Data access layer
├── entity/         # JPA entities
├── dto/            # Data Transfer Objects
├── config/         # Configuration classes
├── security/       # Security & JWT
└── exception/      # Global exception handling
```

### Frontend Architecture (Feature-Based)

```
frontend/
├── core/           # Singleton services, models, guards
├── features/       # Feature modules (auth, board, workspace)
├── shared/         # Reusable components, pipes, directives
└── environments/   # Environment configurations
```

## 📦 Prerequisites

- **Docker** 24.0+ and **Docker Compose** 2.20+
- **Java** 21 (for local development)
- **Node.js** 20+ and **npm** 10+ (for local development)
- **Maven** 3.9+ (for local development)

## 🚀 Getting Started

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow-kanban.git
   cd taskflow-kanban
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/api/swagger-ui.html
   - PostgreSQL: localhost:5432

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_DB=taskflow_db
POSTGRES_USER=taskflow_user
POSTGRES_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_minimum_256_bits
JWT_EXPIRATION=86400000

# Spring Profile
SPRING_PROFILES_ACTIVE=docker
```

## 💻 Development

### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run PostgreSQL only**
   ```bash
   docker-compose -f ../docker-compose.dev.yml up postgres
   ```

3. **Run Spring Boot application**
   ```bash
   mvn spring-boot:run
   ```

   Or in your IDE, run `TaskFlowKanbanBackendApplication.java`

4. **Access backend**
   - API: http://localhost:8080/api
   - Swagger: http://localhost:8080/api/swagger-ui.html
   - H2 Console (if enabled): http://localhost:8080/api/h2-console

### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm start
   ```

4. **Access frontend**
   - Application: http://localhost:4200
   - Auto-reloads on file changes

### Database Migrations

Flyway migrations are located in `backend/src/main/resources/db/migration/`

- Migrations run automatically on application startup
- Naming convention: `V{version}__{description}.sql`
- Example: `V1__Initial_Schema.sql`

## 🚢 Production Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Health Checks

- **Backend**: http://localhost:8080/api/actuator/health
- **Frontend**: http://localhost:4200/health
- **Database**: Automated health checks in Docker Compose

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at:
- Development: http://localhost:8080/api/swagger-ui.html
- Production: https://your-domain.com/api/swagger-ui.html

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

#### Workspaces
- `GET /api/workspaces` - Get all workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/{id}` - Get workspace by ID
- `PUT /api/workspaces/{id}` - Update workspace
- `DELETE /api/workspaces/{id}` - Delete workspace

#### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create board
- `GET /api/boards/{id}` - Get board by ID
- `PUT /api/boards/{id}` - Update board
- `DELETE /api/boards/{id}` - Delete board

#### Cards
- `GET /api/cards` - Get all cards
- `POST /api/cards` - Create card
- `GET /api/cards/{id}` - Get card by ID
- `PUT /api/cards/{id}` - Update card
- `DELETE /api/cards/{id}` - Delete card

## 📁 Project Structure

```
taskflow-kanban/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskflow/kanban/
│   │   │   │   ├── auth/            # Authentication module
│   │   │   │   ├── board/           # Board management
│   │   │   │   ├── workspace/       # Workspace management
│   │   │   │   ├── user/            # User management
│   │   │   │   ├── config/          # Configuration
│   │   │   │   ├── security/        # Security & JWT
│   │   │   │   └── exception/       # Exception handling
│   │   │   └── resources/
│   │   │       ├── db/migration/    # Flyway migrations
│   │   │       ├── application.yml  # Default config
│   │   │       └── application-docker.yml
│   │   └── test/                    # Unit & Integration tests
│   ├── Dockerfile                   # Multi-stage Docker build
│   ├── pom.xml                      # Maven dependencies
│   └── .dockerignore
├── frontend/                         # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                # Core services & models
│   │   │   ├── features/            # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── board/
│   │   │   │   ├── dashboard/
│   │   │   │   └── workspace/
│   │   │   └── shared/              # Shared components
│   │   └── environments/            # Environment configs
│   ├── Dockerfile                   # Multi-stage with Nginx
│   ├── nginx.conf                   # Nginx configuration
│   ├── package.json
│   └── .dockerignore
├── docker-compose.yml               # Production compose
├── docker-compose.dev.yml           # Development compose
├── .env.example                     # Environment template
├── .gitignore
└── README.md
```

## 📖 Documentation

All project documentation is in the **[`docs/`](docs/)** folder:

- **[docs/README.md](docs/README.md)** — Index of all docs, quick links, and backend/frontend guides
- **[docs/REFERENCE.md](docs/REFERENCE.md)** — **Reference** — config, API, testing, CI/CD, useful commands
- **[docs/TESTING-GUIDE.md](docs/TESTING-GUIDE.md)** — Unit, integration, and manual testing; troubleshooting
- **Backend** — [docs/backend/](docs/backend/) (README, CONCEPTION, HELP)
- **Frontend** — [docs/frontend/](docs/frontend/) (README, FRONTEND-SETUP)
- **Guides** — Quick start, setup, architecture, implementation notes, and more

## 🎯 Best Practices Implemented

### Backend

1. **Layered Architecture**: Clear separation of concerns (Controller → Service → Repository)
2. **DTO Pattern**: Decoupling API contracts from domain models using MapStruct
3. **Global Exception Handling**: Centralized error handling with meaningful responses
4. **Security**: JWT authentication, BCrypt password hashing, method-level security
5. **Database Migrations**: Version-controlled schema changes with Flyway
6. **API Documentation**: Automated with SpringDoc OpenAPI
7. **Validation**: Bean Validation API for input validation
8. **Logging**: SLF4J with structured logging
9. **Health Checks**: Actuator endpoints for monitoring
10. **CORS Configuration**: Properly configured cross-origin requests

### Frontend

1. **Feature-Based Architecture**: Modular organization by feature
2. **Lazy Loading**: Route-level code splitting for performance
3. **Reactive Programming**: RxJS for asynchronous operations
4. **Type Safety**: Full TypeScript usage with strict mode
5. **HTTP Interceptors**: Centralized token management and error handling
6. **Route Guards**: Protected routes with authentication checks
7. **Environment Configuration**: Separate configs for dev/prod
8. **Standalone Components**: Modern Angular architecture

### DevOps

1. **Multi-Stage Builds**: Optimized Docker images
2. **Non-Root Users**: Security-first container configuration
3. **Health Checks**: Automated service health monitoring
4. **Volume Persistence**: Data persistence for PostgreSQL
5. **Network Isolation**: Docker networks for service communication
6. **Environment Variables**: Externalized configuration
7. **Docker Ignore**: Optimized build contexts

## 🔒 Security

- **JWT Authentication**: Stateless authentication with refresh tokens
- **Password Encryption**: BCrypt with configurable strength
- **CORS Protection**: Whitelist-based origin validation
- **SQL Injection Prevention**: JPA/Hibernate parameter binding
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Token-based CSRF for stateful operations
- **Rate Limiting**: API endpoint throttling (configure as needed)
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw clean test           # Run all tests (uses H2, Flyway disabled)
./mvnw test -Dtest=ClassName   # Run specific test class
./mvnw verify               # Run integration tests
```

### Frontend Tests

```bash
cd frontend
npm test                    # Run unit tests (interactive)
npm test -- --watch=false --browsers=ChromeHeadless   # CI-friendly
npm run test:coverage       # Generate coverage report (if configured)
```

- **Full guide**: [docs/TESTING-GUIDE.md](docs/TESTING-GUIDE.md)
- **Reference**: [docs/REFERENCE.md](docs/REFERENCE.md#testing)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Senior Full-Stack Developer**
- Angular + Spring Boot Expert
- Docker & Cloud Architecture Specialist

## 🙏 Acknowledgments

- Spring Boot Team for the excellent framework
- Angular Team for the modern frontend framework
- PostgreSQL Community
- Docker Community

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
