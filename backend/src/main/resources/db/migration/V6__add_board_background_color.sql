-- V6__add_board_background_color.sql
-- Add background_color to boards so board/workspace colors work when using Flyway with ddl-auto=validate.
-- Hibernate with ddl-auto=update would add this automatically; this migration ensures it exists for all setups.

ALTER TABLE boards ADD COLUMN IF NOT EXISTS background_color VARCHAR(255);
