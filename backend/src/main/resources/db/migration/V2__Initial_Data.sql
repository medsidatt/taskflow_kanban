-- V2__Initial_Data.sql
-- This script populates the database with initial data for a fresh setup.
-- It's designed to be run after V1__Initial_Schema.sql.
-- Note: UUIDs are hardcoded for consistency across environments.

-- 1. Create default Roles if they don't exist
INSERT INTO roles (id, name) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'USER'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'ADMIN')
ON CONFLICT (name) DO NOTHING;

-- 2. Create a default User (Super Admin) if they don't exist
-- Password is "password" hashed with BCrypt
INSERT INTO users (id, username, email, password, active) VALUES
('c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'user', 'user@example.com', '$2a$10$XQSbajvlcBPp1obB65ESDO5lpiIKDikTGjHjkqe/Dm7EZW1xl03Yi', true)
ON CONFLICT (username) DO NOTHING;

-- 3. Assign ALL roles (USER and ADMIN) to the default user
INSERT INTO user_roles (user_id, role_id) VALUES
('c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'), -- USER role
('c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'b2c3d4e5-f6a7-8901-2345-67890abcdef1')  -- ADMIN role
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 4. Create a default Workspace if it doesn't exist
INSERT INTO workspaces (id, name, description, created_by) VALUES
('d4e5f6a7-b8c9-0123-4567-890abcdef123', 'My First Workspace', 'A default workspace to get you started.', 'c3d4e5f6-a7b8-9012-3456-7890abcdef12')
ON CONFLICT (id) DO NOTHING;

-- 5. Add the default user as the OWNER of the workspace
INSERT INTO workspace_members (id, workspace_id, user_id, role) VALUES
(gen_random_uuid(), 'd4e5f6a7-b8c9-0123-4567-890abcdef123', 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'OWNER')
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- 6. Create a default Board if it doesn't exist
INSERT INTO boards (id, name, workspace_id, created_by) VALUES
('e5f6a7b8-c9d0-1234-5678-90abcdef1234', 'My First Board', 'd4e5f6a7-b8c9-0123-4567-890abcdef123', 'c3d4e5f6-a7b8-9012-3456-7890abcdef12')
ON CONFLICT (id) DO NOTHING;

-- 7. Add the default user as the OWNER of the board
INSERT INTO board_members (id, board_id, user_id, role) VALUES
(gen_random_uuid(), 'e5f6a7b8-c9d0-1234-5678-90abcdef1234', 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'OWNER')
ON CONFLICT (board_id, user_id) DO NOTHING;

-- 8. Create default Columns for the board
INSERT INTO board_columns (id, name, board_id, position, created_by) VALUES
('f6a7b8c9-d0e1-2345-6789-0abcdef12345', 'To Do', 'e5f6a7b8-c9d0-1234-5678-90abcdef1234', 0, 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'),
('a7b8c9d0-e1f2-3456-7890-bcdef1234567', 'In Progress', 'e5f6a7b8-c9d0-1234-5678-90abcdef1234', 1, 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'),
('b8c9d0e1-f2a3-4567-8901-cdef12345678', 'Done', 'e5f6a7b8-c9d0-1234-5678-90abcdef1234', 2, 'c3d4e5f6-a7b8-9012-3456-7890abcdef12')
ON CONFLICT (id) DO NOTHING;
