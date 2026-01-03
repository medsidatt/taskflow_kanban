-- Add achieved (done) flag to cards
ALTER TABLE cards ADD COLUMN IF NOT EXISTS achieved BOOLEAN NOT NULL DEFAULT FALSE;
