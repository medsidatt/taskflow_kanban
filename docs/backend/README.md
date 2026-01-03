# TaskFlow Kanban Backend

TaskFlow is a powerful and flexible Kanban board application designed to streamline task management and collaboration. This repository contains the backend service built with Spring Boot.

## 🚀 Features

*   **Workspace Management**: Create and manage workspaces with role-based access control (Owner, Admin, Member, Viewer).
*   **Board Management**: Create multiple boards within workspaces.
*   **Kanban Workflow**: Columns, Cards, Drag-and-Drop support (via API positioning).
*   **Task Management**:
    *   Create, update, delete, and move cards.
    *   **Rich Member Roles**: Assign users to cards with specific roles (Lead, Assignee, Reviewer, Viewer).
    *   Due dates, priorities, labels.
*   **Security**:
    *   JWT-based Authentication (Access & Refresh Tokens).
    *   Role-Based Access Control (RBAC) at Workspace and Board levels.
*   **Audit Logging**: Tracks activities (Create, Update, Move, Delete) for auditing.
*   **API Documentation**: Integrated OpenAPI / Swagger UI.

## 🛠️ Tech Stack

*   **Java 17**
*   **Spring Boot 3**
*   **Spring Security** (JWT)
*   **Spring Data JPA** (Hibernate)
*   **PostgreSQL**
*   **Flyway** (Database Migration)
*   **Lombok**
*   **Docker & Docker Compose**

## ⚙️ Configuration

The application is configured via `application.yaml`. Key settings include:

*   **Server Port**: `8081`
*   **Context Path**: `/api`
*   **Database**: PostgreSQL on `localhost:5432` (default)
*   **JWT**:
    *   Secret: Configurable via `JWT_SECRET` env var.
    *   Expiration: 15 minutes (Access), 7 days (Refresh).

## 🏃‍♂️ Getting Started

### Prerequisites

*   Java 17+
*   Maven
*   PostgreSQL
*   Docker (optional)

### Local Development

1.  **Database Setup**:
    Ensure PostgreSQL is running and create a database named `taskflow` (or update `application.yaml`).
    ```sql
    CREATE DATABASE taskflow;
    ```

2.  **Build & Run**:
    ```bash
    ./mvnw spring-boot:run
    ```

3.  **API Documentation**:
    Access Swagger UI at: [http://localhost:8081/api/swagger-ui.html](http://localhost:8081/api/swagger-ui.html)

### 🐳 Docker Support

A `docker-compose.yml` is provided for easy deployment.

1.  **Build and Start**:
    ```bash
    docker-compose up --build -d
    ```
    This starts both the PostgreSQL database and the Backend service.

2.  **Access**:
    *   Backend: `http://localhost:8080/api`
    *   Swagger UI: `http://localhost:8080/api/swagger-ui.html`

## 🔑 Authentication

The API uses Bearer Token authentication.

1.  **Register**: `POST /api/auth/register`
2.  **Login**: `POST /api/auth/login` -> Returns `accessToken` and `refreshToken`.
3.  **Access Protected Endpoints**: Add header `Authorization: Bearer <your_access_token>`.

## 📝 API Endpoints Overview

### Workspaces
*   `POST /workspaces`: Create a workspace.
*   `GET /workspaces`: List user's workspaces.
*   `PUT /workspaces/{id}/members/{userId}`: Update a member's workspace role.

### Boards
*   `POST /boards`: Create a board.
*   `GET /boards?workspaceId=...`: List boards.

### Cards
*   `POST /cards`: Create a card.
*   `PUT /cards/{id}/move`: Move a card (change column/position).
*   `POST /cards/{id}/assignees/{userId}`: Add an assignee (Default: ASSIGNEE).
*   `PUT /cards/{id}/members/{userId}?role=REVIEWER`: Add/Update a member with a specific role (LEAD, ASSIGNEE, REVIEWER, VIEWER).

## 🗄️ Database Schema

The database schema is managed by **Flyway**.
*   `V1`: Initial Schema (Users, Workspaces, Boards, Cards).
*   `V2`: Initial Data.
*   `V3`: Migration to `card_members` table for rich card roles.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit changes.
4.  Push to the branch.
5.  Open a Pull Request.
