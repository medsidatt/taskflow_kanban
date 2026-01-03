-- V4__add_indexes.sql
-- This migration adds indexes to frequently queried foreign key columns to improve performance.

-- Indexes for membership tables
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);

CREATE INDEX IF NOT EXISTS idx_board_members_board_id ON board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_id ON board_members(user_id);

CREATE INDEX IF NOT EXISTS idx_card_members_card_id ON card_members(card_id);
CREATE INDEX IF NOT EXISTS idx_card_members_user_id ON card_members(user_id);

-- Indexes for entity hierarchy
CREATE INDEX IF NOT EXISTS idx_boards_workspace_id ON boards(workspace_id);
CREATE INDEX IF NOT EXISTS idx_board_columns_board_id ON board_columns(board_id);
CREATE INDEX IF NOT EXISTS idx_cards_column_id ON cards(column_id);

-- Indexes for related entities
CREATE INDEX IF NOT EXISTS idx_labels_board_id ON labels(board_id);
CREATE INDEX IF NOT EXISTS idx_attachments_card_id ON attachments(card_id);
CREATE INDEX IF NOT EXISTS idx_comments_card_id ON comments(card_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);

-- Index for activity logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_id ON activity_logs(entity_id);
