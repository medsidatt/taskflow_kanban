-- V1__Initial_Schema.sql
-- Establishes the initial database schema for the TaskFlow application.

-- =================================================================
-- Section 1: User and Authentication
-- =================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    account_locked BOOLEAN NOT NULL DEFAULT FALSE,
    credentials_expired BOOLEAN NOT NULL DEFAULT FALSE,
    account_expired BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(50)
);

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id),
    role_id UUID NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

-- =================================================================
-- Section 2: Workspace
-- =================================================================

CREATE TABLE workspaces (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_private BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE workspace_members (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    UNIQUE (workspace_id, user_id)
);

-- =================================================================
-- Section 3: Board, Column, Card, and related entities
-- =================================================================

CREATE TABLE boards (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    position INT NOT NULL DEFAULT 0,
    workspace_id UUID NOT NULL REFERENCES workspaces(id)
);

CREATE TABLE board_members (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    board_id UUID NOT NULL REFERENCES boards(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    UNIQUE (board_id, user_id)
);

CREATE TABLE board_columns (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    wip_limit INT,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    board_id UUID NOT NULL REFERENCES boards(id)
);

CREATE TABLE labels (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(255),
    board_id UUID NOT NULL REFERENCES boards(id)
);

CREATE TABLE cards (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INT NOT NULL,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    due_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    priority INT,
    column_id UUID NOT NULL REFERENCES board_columns(id)
);

-- Note: This table is replaced in V3 with card_members
CREATE TABLE card_assignees (
    card_id UUID NOT NULL REFERENCES cards(id),
    user_id UUID NOT NULL REFERENCES users(id),
    PRIMARY KEY (card_id, user_id)
);

CREATE TABLE card_labels (
    card_id UUID NOT NULL REFERENCES cards(id),
    label_id UUID NOT NULL REFERENCES labels(id),
    PRIMARY KEY (card_id, label_id)
);

-- =================================================================
-- Section 4: Card Details
-- =================================================================

CREATE TABLE attachments (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    card_id UUID NOT NULL REFERENCES cards(id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    content TEXT NOT NULL,
    edited BOOLEAN NOT NULL DEFAULT FALSE,
    card_id UUID NOT NULL REFERENCES cards(id),
    author_id UUID NOT NULL REFERENCES users(id)
);

-- =================================================================
-- Section 5: Auditing
-- =================================================================

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY,
    entity_type VARCHAR(255) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    performed_by UUID NOT NULL
);
