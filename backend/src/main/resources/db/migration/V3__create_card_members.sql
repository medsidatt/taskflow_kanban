-- V3__create_card_members.sql

-- Create card_members table
CREATE TABLE card_members (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    card_id UUID NOT NULL REFERENCES cards(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    UNIQUE (card_id, user_id)
);

-- Migrate data from card_assignees
-- Assuming pgcrypto or Postgres 13+ for gen_random_uuid()
-- If gen_random_uuid() is not available, we might need: CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO card_members (id, created_at, updated_at, card_id, user_id, role)
SELECT
    gen_random_uuid(),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    card_id,
    user_id,
    'ASSIGNEE'
FROM card_assignees;

-- Drop old table
DROP TABLE card_assignees;
