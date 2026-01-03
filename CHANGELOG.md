# Changelog

All notable changes to TaskFlow Kanban will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

#### Backend
- **Authentication System**
  - JWT-based authentication with access and refresh tokens
  - User registration and login endpoints
  - Email verification (placeholder)
  - Password reset functionality (placeholder)
  - BCrypt password hashing

- **Core Features**
  - Workspace management (create, read, update, delete)
  - Board management with workspace association
  - Column management for Kanban boards
  - Card management with full CRUD operations
  - Label system for card categorization
  - Comment system for card discussions
  - Attachment support for cards
  - Activity logging for audit trails
  - User role management

- **Architecture**
  - Layered architecture (Controller, Service, Repository, Entity)
  - Global exception handling with custom exceptions
  - DTO pattern with MapStruct for object mapping
  - JPA entities with audit fields
  - Flyway database migrations
  - CORS configuration
  - Spring Security configuration
  - Actuator health checks

- **API Documentation**
  - SpringDoc OpenAPI integration
  - Swagger UI for interactive API testing
  - Comprehensive endpoint documentation

#### Frontend
- **Modern Angular Architecture**
  - Feature-based modular structure
  - Standalone components
  - Core, Features, and Shared organization
  - TypeScript strict mode

- **Authentication**
  - Login and registration pages
  - JWT token management
  - Auth guard for protected routes
  - HTTP interceptor for token injection
  - Automatic token refresh on 401

- **Interceptors**
  - Auth interceptor for JWT tokens
  - Error interceptor for global error handling
  - Loading interceptor for progress indication

- **Services**
  - Auth service with login/logout
  - Board service for board operations
  - User service for user management
  - Workspace service for workspace operations
  - Loading service for UI state

- **Utilities**
  - HTTP utility functions
  - Date utility functions
  - Custom form validators
  - API constants
  - Type-safe models

- **Components**
  - Loading spinner component
  - Dashboard component
  - Workspace component

- **Pipes**
  - Relative time pipe
  - Truncate text pipe

#### DevOps
- **Docker Support**
  - Multi-stage Dockerfile for backend (Maven + JDK → JRE)
  - Multi-stage Dockerfile for frontend (Node → Nginx)
  - Docker Compose for orchestration
  - Development and production compose files
  - Health checks for all services
  - Volume persistence for PostgreSQL

- **Nginx Configuration**
  - Reverse proxy to backend API
  - Static file serving with caching
  - Gzip compression
  - Security headers
  - Angular routing support

- **CI/CD**
  - GitHub Actions workflow for backend
  - Qodana code quality checks
  - Automated testing (placeholder)

#### Documentation
- Comprehensive README with setup instructions
- Architecture documentation with diagrams
- Quick start guide
- Contributing guidelines
- Security policy
- This changelog
- License (MIT)

#### Configuration
- Environment-based configuration
- Default and Docker profiles for Spring Boot
- Development and production environments for Angular
- Logback configuration for structured logging
- Database connection pooling with HikariCP

### Security
- JWT token-based authentication
- BCrypt password hashing
- CORS protection
- SQL injection prevention (JPA)
- XSS protection headers
- Method-level security
- Non-root Docker containers
- Secure defaults

### Database
- PostgreSQL 16 Alpine
- Flyway migrations for schema versioning
- Audit fields (createdBy, createdAt, modifiedBy, modifiedAt)
- Optimized indexes
- Demo data for testing

### Best Practices
- Clean architecture principles
- SOLID principles
- RESTful API design
- Consistent error handling
- Comprehensive validation
- Type safety (TypeScript)
- Code documentation (JavaDoc, JSDoc)
- Separation of concerns
- DRY (Don't Repeat Yourself)

## [Unreleased]

### Planned Features
- Real-time updates with WebSocket
- Drag and drop for cards
- File upload for attachments
- Email notifications
- Search functionality
- Board templates
- Dark mode
- Mobile responsive design
- Internationalization (i18n)
- Performance monitoring
- Integration tests
- E2E tests with Cypress

---

## Version History

- **1.0.0** - Initial release with core features
- **0.1.0** - Project setup and architecture

[1.0.0]: https://github.com/yourusername/taskflow-kanban/releases/tag/v1.0.0
[Unreleased]: https://github.com/yourusername/taskflow-kanban/compare/v1.0.0...HEAD
