# TaskFlow Kanban - Architecture Documentation

## Overview

TaskFlow Kanban is a full-stack application built with enterprise-grade architecture principles, featuring a clear separation of concerns, layered design, and modern best practices.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                      (Angular 19 SPA)                        │
│  ┌────────────┬──────────────┬────────────┬──────────────┐ │
│  │   Auth     │   Dashboard  │   Board    │  Workspace   │ │
│  │  Features  │   Features   │  Features  │   Features   │ │
│  └────────────┴──────────────┴────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                     HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Nginx Reverse Proxy                     │
│               (SSL Termination, Load Balancing)              │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│                    (Spring Boot 3.3.4)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Controller Layer (REST)                 │   │
│  │    ┌──────┬─────────┬────────┬──────────────────┐  │   │
│  │    │ Auth │  Board  │  Card  │  Workspace  etc. │  │   │
│  │    └──────┴─────────┴────────┴──────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Service Layer (Business Logic)          │   │
│  │    ┌──────────┬──────────┬─────────┬─────────────┐ │   │
│  │    │ AuthSvc  │ BoardSvc │ CardSvc │ WorkspaceSvc│ │   │
│  │    └──────────┴──────────┴─────────┴─────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Repository Layer (Data Access)          │   │
│  │    ┌──────────┬──────────┬─────────┬─────────────┐ │   │
│  │    │ UserRepo │ BoardRepo│ CardRepo│ WorkspaceRp │ │   │
│  │    └──────────┴──────────┴─────────┴─────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                         JPA/Hibernate
                            │
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│                    (PostgreSQL 16)                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Tables: users, roles, workspaces, boards, cards,  │    │
│  │  columns, labels, comments, attachments, etc.      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Layered Architecture Pattern

#### 1. Controller Layer
**Responsibility**: HTTP Request Handling
- RESTful API endpoints
- Request/Response mapping
- Input validation
- HTTP status codes
- Exception handling delegation

**Example**:
```java
@RestController
@RequestMapping("/boards")
public class BoardController {
    private final BoardService boardService;
    
    @GetMapping("/{id}")
    public ResponseEntity<BoardDto> getBoard(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoard(id));
    }
}
```

#### 2. Service Layer
**Responsibility**: Business Logic
- Core business rules
- Transaction management
- Orchestration between multiple repositories
- DTO to Entity mapping (MapStruct)
- Business validations

**Example**:
```java
@Service
@Transactional
public class BoardServiceImpl implements BoardService {
    private final BoardRepository boardRepository;
    private final BoardMapper boardMapper;
    
    @Override
    public BoardDto getBoard(Long id) {
        Board board = boardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        return boardMapper.toDto(board);
    }
}
```

#### 3. Repository Layer
**Responsibility**: Data Persistence
- CRUD operations
- Custom queries (JPQL, native SQL)
- Database interactions
- Extending Spring Data JPA

**Example**:
```java
@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByWorkspaceId(Long workspaceId);
    
    @Query("SELECT b FROM Board b LEFT JOIN FETCH b.columns WHERE b.id = :id")
    Optional<Board> findByIdWithColumns(@Param("id") Long id);
}
```

#### 4. Entity Layer
**Responsibility**: Domain Model
- JPA entities
- Relationships mapping
- Audit fields
- Business constraints

**Example**:
```java
@Entity
@Table(name = "boards")
public class Board extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;
    
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<BoardColumn> columns;
}
```

### Cross-Cutting Concerns

#### Security (Spring Security)
- **JWT Authentication**: Stateless token-based auth
- **Authorization**: Method-level security with `@PreAuthorize`
- **Password Encryption**: BCrypt hashing
- **CORS**: Configured for allowed origins

#### Exception Handling
- **Global Handler**: `@RestControllerAdvice`
- **Custom Exceptions**: ResourceNotFoundException, BadRequestException, etc.
- **Standardized Responses**: ErrorResponse DTO

#### Validation
- **Bean Validation**: `@Valid`, `@NotNull`, `@Size`, etc.
- **Custom Validators**: For complex business rules

#### Logging
- **SLF4J + Logback**: Structured logging
- **Levels**: DEBUG for development, INFO for production

## Frontend Architecture

### Feature-Based Architecture

```
src/app/
├── core/                    # Singleton services, global state
│   ├── models/              # TypeScript interfaces/classes
│   ├── services/            # HTTP services
│   └── guards/              # Route guards
├── features/                # Feature modules
│   ├── auth/
│   │   ├── pages/           # Smart components
│   │   ├── services/        # Feature services
│   │   ├── guards/          # Auth guard
│   │   └── interceptors/    # HTTP interceptors
│   ├── board/
│   ├── dashboard/
│   └── workspace/
└── shared/                  # Reusable components
    ├── components/          # Dumb components
    ├── pipes/               # Custom pipes
    └── directives/          # Custom directives
```

### Key Patterns

#### 1. Smart vs Dumb Components
- **Smart Components**: Container components with business logic
- **Dumb Components**: Presentational components with @Input/@Output

#### 2. HTTP Interceptors
- **Auth Interceptor**: Attaches JWT token to requests
- **Error Interceptor**: Global error handling
- **Refresh Token**: Automatic token refresh on 401

#### 3. Route Guards
- **Auth Guard**: Protects authenticated routes
- **Role Guard**: Role-based access control

#### 4. Services
- **HTTP Services**: API communication
- **State Services**: Feature-level state management

## Database Design

### Entity Relationships

```
User (1) ──────── (*) WorkspaceMember (*) ──────── (1) Workspace
                                                           │
                                                          (1)
                                                           │
                                                          (*)
                                                         Board
                                                           │
                                                          (1)
                                    ┌──────────────────────┼──────────────┐
                                   (*)                    (*)            (*)
                              BoardColumn               Label      BoardMember
                                   │
                                  (1)
                                   │
                                  (*)
                                 Card ─────── (*) Comment
                                   │
                                   ├─────── (*) Attachment
                                   │
                                   └─────── (*) CardMember
```

### Key Tables

1. **users**: User accounts and authentication
2. **roles**: User roles (ADMIN, USER, etc.)
3. **workspaces**: Top-level organization containers
4. **workspace_members**: Many-to-many with roles
5. **boards**: Kanban boards within workspaces
6. **board_columns**: Columns (TODO, IN_PROGRESS, DONE)
7. **cards**: Tasks/items on the board
8. **labels**: Color-coded tags for cards
9. **comments**: Card discussion threads
10. **attachments**: File uploads for cards
11. **activity_logs**: Audit trail for all actions

## Security Architecture

### Authentication Flow

```
1. User Login
   ↓
2. Credentials Validation (Spring Security)
   ↓
3. JWT Generation (Access + Refresh Tokens)
   ↓
4. Token Storage (Frontend - localStorage/sessionStorage)
   ↓
5. Subsequent Requests (Bearer Token in Authorization Header)
   ↓
6. Token Validation (JWT Filter)
   ↓
7. Access Granted/Denied
```

### JWT Structure

```json
{
  "header": {
    "alg": "HS512",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "userId": 123,
    "roles": ["ROLE_USER"],
    "iat": 1640000000,
    "exp": 1640086400
  },
  "signature": "..."
}
```

## Deployment Architecture

### Docker Compose Setup

```
docker-compose.yml
├── postgres (Database)
│   ├── Volume: postgres_data
│   ├── Port: 5432
│   └── Health Check
├── backend (Spring Boot)
│   ├── Depends on: postgres
│   ├── Port: 8080
│   └── Health Check (Actuator)
└── frontend (Angular + Nginx)
    ├── Depends on: backend
    ├── Port: 80
    └── Reverse Proxy to backend
```

### Multi-Stage Docker Builds

#### Backend Dockerfile
```
Stage 1: Build (Maven + JDK)
  - Resolve dependencies
  - Compile source code
  - Package as JAR
Stage 2: Runtime (JRE only)
  - Copy JAR from Stage 1
  - Non-root user
  - Optimized image size
```

#### Frontend Dockerfile
```
Stage 1: Build (Node.js)
  - Install dependencies
  - Build production bundle
Stage 2: Runtime (Nginx)
  - Copy dist from Stage 1
  - Serve static files
  - Reverse proxy to backend
```

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT)
- Load balancer (Nginx/HAProxy)
- Multiple backend instances
- Shared PostgreSQL

### Vertical Scaling
- Database connection pooling
- JVM heap tuning
- Nginx worker processes

### Caching Strategy
- HTTP caching headers
- Redis for session storage (future)
- Database query caching

## Monitoring & Observability

### Health Checks
- **Backend**: `/api/actuator/health`
- **Frontend**: `/health`
- **Database**: PostgreSQL health check

### Metrics (Actuator)
- JVM metrics
- HTTP request metrics
- Database connection pool
- Custom business metrics

### Logging
- Application logs (Logback)
- Access logs (Nginx)
- Database logs (PostgreSQL)
- Centralized logging (ELK stack - future)

## Future Enhancements

1. **Real-time Updates**: WebSocket for live collaboration
2. **Notifications**: Email/Push notifications
3. **File Storage**: S3-compatible object storage
4. **Search**: Elasticsearch for full-text search
5. **Caching**: Redis for performance
6. **Message Queue**: RabbitMQ/Kafka for async processing
7. **API Gateway**: Kong/Spring Cloud Gateway
8. **Service Mesh**: Istio for microservices

## Testing Strategy

### Backend Testing
- **Unit Tests**: JUnit 5 + Mockito
- **Integration Tests**: TestContainers + PostgreSQL
- **API Tests**: MockMvc
- **Security Tests**: Spring Security Test

### Frontend Testing
- **Unit Tests**: Jasmine + Karma
- **Component Tests**: Angular Testing Library
- **E2E Tests**: Cypress/Playwright (future)

## Conclusion

TaskFlow Kanban is built with production-ready architecture, following industry best practices for maintainability, scalability, and security. The clear separation of concerns and modular design allow for easy testing, debugging, and future enhancements.
