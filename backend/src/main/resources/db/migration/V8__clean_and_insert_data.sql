-- V8__clean_and_insert_data.sql
-- This migration deletes all existing data and inserts clean data for 4 users with all features

-- =================================================================
-- Section 1: Delete all existing data (in reverse dependency order)
-- =================================================================

-- Delete data from tables with foreign keys first
DELETE FROM activity_logs;
DELETE FROM comments;
DELETE FROM attachments;
DELETE FROM card_labels;
DELETE FROM card_members;
DELETE FROM cards;
DELETE FROM labels;
DELETE FROM board_columns;
DELETE FROM board_members;
DELETE FROM boards;
DELETE FROM workspace_members;
DELETE FROM workspaces;
DELETE FROM user_roles;
DELETE FROM users;
DELETE FROM roles;

-- =================================================================
-- Section 2: Insert Roles
-- =================================================================

INSERT INTO roles (id, name, created_at, updated_at, deleted) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 3: Insert 4 Users
-- =================================================================

INSERT INTO users (id, username, email, password, active, account_locked, credentials_expired, account_expired, created_at, updated_at, deleted) VALUES
('11111111-1111-1111-1111-111111111111', 'user_1', 'user_1@example.com', '$2a$10$CHbt2vLbtv28HVD34z6ub.898aCtRQb6LnwLTbh4JlfpAAeORCMmO', true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('22222222-2222-2222-2222-222222222222', 'user_2', 'user_2@example.com', '$2a$10$Co/rWhMZIXV67SSmsajDuOk7O3Ft9DYQ7OoGE2fHbZdEXQyvwpvy2', true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('33333333-3333-3333-3333-333333333333', 'user_3', 'user_3@example.com', '$2a$10$93HViemSYx8jMmc.tbhoquoFK/xJnSGSWT/kYl/s/ekNFm5a6A3Ru', true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('44444444-4444-4444-4444-444444444444', 'user_4', 'user_4@example.com', '$2a$10$lbrzl64AV5Z2GLjsiNuas.YuR4yq8Gij./eaM.lbsJ/fA2C8rgpoq', true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 4: Assign USER role to all users
-- =================================================================

INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'), -- user_1 -> USER
('22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'), -- user_2 -> USER
('33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'), -- user_3 -> USER
('44444444-4444-4444-4444-444444444444', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'); -- user_4 -> USER

-- Also assign ADMIN role to user_1
INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'); -- user_1 -> ADMIN

-- =================================================================
-- Section 5: Create Workspaces
-- =================================================================

INSERT INTO workspaces (id, name, description, is_private, created_by, created_at, updated_at, deleted) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Development Team', 'Main workspace for the development team working on the project.', false, '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Marketing Team', 'Workspace for marketing campaigns and content planning.', false, '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Product Team', 'Product management and feature planning workspace.', false, '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 6: Add Workspace Members
-- =================================================================

-- Development Team: user_1 (OWNER), user_2 (ADMIN), user_3 (MEMBER), user_4 (MEMBER)
INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Marketing Team: user_2 (OWNER), user_3 (ADMIN)
INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Product Team: user_1 (OWNER), user_4 (MEMBER)
INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 7: Create Boards
-- =================================================================

INSERT INTO boards (id, name, description, archived, is_private, position, workspace_id, background_color, created_by, created_at, updated_at, deleted) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Sprint 2024-Q1', 'Q1 Sprint board for development tasks', false, false, 0, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '#4A90E2', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Backend API Development', 'Backend services and API endpoints', false, false, 1, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '#50C878', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Q1 Marketing Campaign', 'Social media and content marketing tasks', false, false, 0, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '#FF6B6B', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('10101010-1010-1010-1010-101010101010', 'Feature Roadmap', 'Product features and enhancements planning', false, false, 0, 'cccccccc-cccc-cccc-cccc-cccccccccccc', '#9B59B6', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 8: Add Board Members
-- =================================================================

-- Sprint 2024-Q1 Board
INSERT INTO board_members (id, board_id, user_id, role, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Backend API Development Board
INSERT INTO board_members (id, board_id, user_id, role, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Q1 Marketing Campaign Board
INSERT INTO board_members (id, board_id, user_id, role, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Feature Roadmap Board
INSERT INTO board_members (id, board_id, user_id, role, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), '10101010-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), '10101010-1010-1010-1010-101010101010', '44444444-4444-4444-4444-444444444444', 'MEMBER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 9: Create Board Columns
-- =================================================================

-- Sprint 2024-Q1 Board Columns
INSERT INTO board_columns (id, name, position, wip_limit, archived, board_id, created_by, created_at, updated_at, deleted) VALUES
('c1111111-1111-1111-1111-111111111111', 'Backlog', 0, NULL, false, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c2222222-2222-2222-2222-222222222222', 'To Do', 1, NULL, false, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c3333333-3333-3333-3333-333333333333', 'In Progress', 2, 3, false, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c4444444-4444-4444-4444-444444444444', 'Code Review', 3, NULL, false, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c5555555-5555-5555-5555-555555555555', 'Done', 4, NULL, false, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Backend API Development Board Columns
INSERT INTO board_columns (id, name, position, wip_limit, archived, board_id, created_by, created_at, updated_at, deleted) VALUES
('c6666666-6666-6666-6666-666666666666', 'Planning', 0, NULL, false, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c7777777-7777-7777-7777-777777777777', 'Development', 1, 2, false, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c8888888-8888-8888-8888-888888888888', 'Testing', 2, NULL, false, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c9999999-9999-9999-9999-999999999999', 'Deployed', 3, NULL, false, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Q1 Marketing Campaign Board Columns
INSERT INTO board_columns (id, name, position, wip_limit, archived, board_id, created_by, created_at, updated_at, deleted) VALUES
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ideas', 0, NULL, false, 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'In Progress', 1, NULL, false, 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Review', 2, NULL, false, 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('cddddddd-dddd-dddd-dddd-dddddddddddd', 'Published', 3, NULL, false, 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Feature Roadmap Board Columns
INSERT INTO board_columns (id, name, position, wip_limit, archived, board_id, created_by, created_at, updated_at, deleted) VALUES
('ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Proposed', 0, NULL, false, '10101010-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('cfffffff-ffff-ffff-ffff-ffffffffffff', 'In Design', 1, NULL, false, '10101010-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c1010101-1010-1010-1010-101010101010', 'In Development', 2, NULL, false, '10101010-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('c2020202-2020-2020-2020-202020202020', 'Released', 3, NULL, false, '10101010-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 10: Create Labels
-- =================================================================

-- Labels for Sprint 2024-Q1 Board
INSERT INTO labels (id, name, color, board_id, created_by, created_at, updated_at, deleted) VALUES
('a1111111-1111-1111-1111-111111111111', 'Bug', '#FF0000', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a2222222-2222-2222-2222-222222222222', 'Feature', '#00FF00', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a3333333-3333-3333-3333-333333333333', 'High Priority', '#FFA500', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a4444444-4444-4444-4444-444444444444', 'Frontend', '#4169E1', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a5555555-5555-5555-5555-555555555555', 'Backend', '#8B4513', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Labels for Backend API Development Board
INSERT INTO labels (id, name, color, board_id, created_by, created_at, updated_at, deleted) VALUES
('a6666666-6666-6666-6666-666666666666', 'API', '#9932CC', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a7777777-7777-7777-7777-777777777777', 'Database', '#228B22', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 11: Create Cards
-- =================================================================

-- Cards for Sprint 2024-Q1 Board
INSERT INTO cards (id, title, description, position, archived, due_date, start_date, priority, achieved, column_id, created_by, created_at, updated_at, deleted) VALUES
-- Backlog
('ca111111-1111-1111-1111-111111111111', 'Implement user authentication', 'Add JWT-based authentication with refresh tokens', 0, false, CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP, 1, false, 'c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('ca222222-2222-2222-2222-222222222222', 'Design new dashboard UI', 'Create mockups for the new dashboard interface', 1, false, CURRENT_TIMESTAMP + INTERVAL '10 days', NULL, 2, false, 'c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- To Do
('ca333333-3333-3333-3333-333333333333', 'Setup CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment', 0, false, CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '2 days', 1, false, 'c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('ca444444-4444-4444-4444-444444444444', 'Write API documentation', 'Document all REST API endpoints with Swagger', 1, false, CURRENT_TIMESTAMP + INTERVAL '8 days', NULL, 2, false, 'c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- In Progress
('ca555555-5555-5555-5555-555555555555', 'Fix login bug', 'Users cannot login with special characters in password', 0, false, CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 1, false, 'c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('ca666666-6666-6666-6666-666666666666', 'Optimize database queries', 'Improve performance of board loading queries', 1, false, CURRENT_TIMESTAMP + INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 2, false, 'c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Code Review
('ca777777-7777-7777-7777-777777777777', 'Add card drag and drop', 'Implement drag and drop functionality for cards between columns', 0, false, CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '5 days', 1, false, 'c4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Done
('ca888888-8888-8888-8888-888888888888', 'Setup project structure', 'Initialize project with Spring Boot and Angular', 0, false, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '15 days', 2, true, 'c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('ca999999-9999-9999-9999-999999999999', 'Configure database', 'Setup PostgreSQL database with Flyway migrations', 1, false, CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '12 days', 2, true, 'c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Cards for Backend API Development Board
INSERT INTO cards (id, title, description, position, archived, due_date, start_date, priority, achieved, column_id, created_by, created_at, updated_at, deleted) VALUES
-- Planning
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Design user service API', 'Plan endpoints for user management', 0, false, CURRENT_TIMESTAMP + INTERVAL '6 days', NULL, 1, false, 'c6666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Development
('cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Implement board service', 'Create REST endpoints for board operations', 0, false, CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days', 1, false, 'c7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Testing
('cacccccc-cccc-cccc-cccc-cccccccccccc', 'Test authentication endpoints', 'Write integration tests for auth API', 0, false, CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '4 days', 1, false, 'c8888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Deployed
('cadddddd-dddd-dddd-dddd-dddddddddddd', 'Deploy user registration API', 'User registration endpoint is live', 0, false, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '10 days', 1, true, 'c9999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Cards for Q1 Marketing Campaign Board
INSERT INTO cards (id, title, description, position, archived, due_date, start_date, priority, achieved, column_id, created_by, created_at, updated_at, deleted) VALUES
-- Ideas
('caeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Social media campaign ideas', 'Brainstorm content ideas for Q1', 0, false, CURRENT_TIMESTAMP + INTERVAL '12 days', NULL, 2, false, 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- In Progress
('caffffff-ffff-ffff-ffff-ffffffffffff', 'Create blog post about features', 'Write article about new kanban features', 0, false, CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 1, false, 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Review
('ca101010-1010-1010-1010-101010101010', 'Review email campaign draft', 'Check email template for product launch', 0, false, CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 1, false, 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Published
('ca202020-2020-2020-2020-202020202020', 'Publish welcome blog post', 'Published introduction post on company blog', 0, false, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '7 days', 2, true, 'cddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Cards for Feature Roadmap Board
INSERT INTO cards (id, title, description, position, archived, due_date, start_date, priority, achieved, column_id, created_by, created_at, updated_at, deleted) VALUES
-- Proposed
('ca303030-3030-3030-3030-303030303030', 'Dark mode support', 'Add dark theme option for better user experience', 0, false, NULL, NULL, 2, false, 'ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- In Design
('ca404040-4040-4040-4040-404040404040', 'Mobile app design', 'Design mobile application interface', 0, false, CURRENT_TIMESTAMP + INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 1, false, 'cfffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- In Development
('ca505050-5050-5050-5050-505050505050', 'Real-time notifications', 'Implement WebSocket for live updates', 0, false, CURRENT_TIMESTAMP + INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 1, false, 'c1010101-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Released
('ca606060-6060-6060-6060-606060606060', 'Card attachments feature', 'Users can now attach files to cards', 0, false, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '30 days', 1, true, 'c2020202-2020-2020-2020-202020202020', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 12: Add Card Members
-- =================================================================

-- Card Members for Sprint 2024-Q1 Board
INSERT INTO card_members (id, card_id, user_id, role, created_at, updated_at, deleted) VALUES
-- Implement user authentication
(gen_random_uuid(), 'ca111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'LEAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'ca111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'ASSIGNEE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Fix login bug
(gen_random_uuid(), 'ca555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'LEAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'ca555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'REVIEWER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Optimize database queries
(gen_random_uuid(), 'ca666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'LEAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'ca666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'ASSIGNEE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
-- Add card drag and drop
(gen_random_uuid(), 'ca777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'LEAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'ca777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'ASSIGNEE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Card Members for Backend API Development Board
INSERT INTO card_members (id, card_id, user_id, role, created_at, updated_at, deleted) VALUES
-- Implement board service
(gen_random_uuid(), 'cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'LEAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'ASSIGNEE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Card Members for Q1 Marketing Campaign Board
INSERT INTO card_members (id, card_id, user_id, role, created_at, updated_at, deleted) VALUES
-- Create blog post
(gen_random_uuid(), 'caffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'LEAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
(gen_random_uuid(), 'caffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'REVIEWER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- =================================================================
-- Section 13: Add Card Labels
-- =================================================================

INSERT INTO card_labels (card_id, label_id) VALUES
-- Implement user authentication - Feature, High Priority
('ca111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222'),
('ca111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333'),
-- Fix login bug - Bug, High Priority
('ca555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111'),
('ca555555-5555-5555-5555-555555555555', 'a3333333-3333-3333-3333-333333333333'),
-- Optimize database queries - Backend, High Priority
('ca666666-6666-6666-6666-666666666666', 'a5555555-5555-5555-5555-555555555555'),
('ca666666-6666-6666-6666-666666666666', 'a3333333-3333-3333-3333-333333333333'),
-- Design new dashboard UI - Frontend, Feature
('ca222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444'),
('ca222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222'),
-- Implement board service - API, Backend
('cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a6666666-6666-6666-6666-666666666666'),
('cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a5555555-5555-5555-5555-555555555555');

-- =================================================================
-- Section 14: Add Comments
-- =================================================================

INSERT INTO comments (id, content, edited, card_id, author_id, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), 'I started working on the authentication module. JWT implementation is in progress.', false, 'ca111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days', false),
(gen_random_uuid(), 'Great! Let me know if you need help with the refresh token logic.', false, 'ca111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', false),
(gen_random_uuid(), 'Found the issue - password encoding was not handling special characters correctly.', false, 'ca555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP - INTERVAL '5 hours', false),
(gen_random_uuid(), 'Fixed! The issue was in the password validation regex.', true, 'ca555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours', false),
(gen_random_uuid(), 'The board service API is ready for testing. All CRUD operations are implemented.', false, 'cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', false),
(gen_random_uuid(), 'Draft is ready for review. Please check the content and provide feedback.', false, 'caffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours', false);

-- =================================================================
-- Section 15: Add Attachments
-- =================================================================

INSERT INTO attachments (id, file_name, file_url, file_size, mime_type, card_id, created_by, created_at, updated_at, deleted) VALUES
(gen_random_uuid(), 'auth_design.pdf', '/uploads/auth_design.pdf', 245760, 'application/pdf', 'ca111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days', false),
(gen_random_uuid(), 'dashboard_mockup.png', '/uploads/dashboard_mockup.png', 512000, 'image/png', 'ca222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', false),
(gen_random_uuid(), 'bug_report.md', '/uploads/bug_report.md', 8192, 'text/markdown', 'ca555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP - INTERVAL '6 hours', false),
(gen_random_uuid(), 'api_spec.yaml', '/uploads/api_spec.yaml', 32768, 'application/x-yaml', 'cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', false);
