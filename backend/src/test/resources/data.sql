-- Minimal initial data for tests (Flyway disabled; Hibernate creates schema)
-- Roles required by auth and security tests (DB is recreated each run, so no conflict)
INSERT INTO roles (id, name, created_at, updated_at, deleted) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);
