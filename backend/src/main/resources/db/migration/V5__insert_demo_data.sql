-- V5__insert_demo_data.sql
-- Inserts additional demo data for a richer user experience.

-- =================================================================
-- Section 1: Create More Users
-- =================================================================
-- Passwords are "password"
INSERT INTO users (id, username, email, password, active) VALUES
(gen_random_uuid(), 'alice', 'alice@example.com', '$2a$10$XQSbajvlcBPp1obB65ESDO5lpiIKDikTGjHjkqe/Dm7EZW1xl03Yi', true),
(gen_random_uuid(), 'bob', 'bob@example.com', '$2a$10$XQSbajvlcBPp1obB65ESDO5lpiIKDikTGjHjkqe/Dm7EZW1xl03Yi', true)
ON CONFLICT (username) DO NOTHING;

-- Assign USER role to new users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username IN ('alice', 'bob') AND r.name = 'USER'
ON CONFLICT (user_id, role_id) DO NOTHING;


-- =================================================================
-- Section 2: Add Users to "My First Workspace"
-- =================================================================
-- Add Alice as ADMIN and Bob as MEMBER to the first workspace
INSERT INTO workspace_members (id, workspace_id, user_id, role)
SELECT
    gen_random_uuid(),
    (SELECT id FROM workspaces WHERE name = 'My First Workspace'),
    u.id,
    CASE u.username
        WHEN 'alice' THEN 'ADMIN'
        WHEN 'bob' THEN 'MEMBER'
    END
FROM users u
WHERE u.username IN ('alice', 'bob')
ON CONFLICT (workspace_id, user_id) DO NOTHING;


-- =================================================================
-- Section 3: Create Cards in the "My First Board"
-- =================================================================
-- Get Column IDs
DO $$
DECLARE
    todo_col_id UUID := (SELECT id FROM board_columns WHERE name = 'To Do');
    inprogress_col_id UUID := (SELECT id FROM board_columns WHERE name = 'In Progress');
    done_col_id UUID := (SELECT id FROM board_columns WHERE name = 'Done');
    card1_id UUID := gen_random_uuid();
    card2_id UUID := gen_random_uuid();
    card3_id UUID := gen_random_uuid();
    user_id_main UUID := (SELECT id FROM users WHERE username = 'user');
    alice_id UUID := (SELECT id FROM users WHERE username = 'alice');
    bob_id UUID := (SELECT id FROM users WHERE username = 'bob');
BEGIN
    -- Insert Cards
    INSERT INTO cards (id, title, description, column_id, position, priority) VALUES
    (card1_id, 'Design the new login page', 'Create mockups and a prototype in Figma.', todo_col_id, 0, 1),
    (card2_id, 'Develop the API for user authentication', 'Implement JWT-based authentication endpoints.', inprogress_col_id, 0, 1),
    (card3_id, 'Set up the CI/CD pipeline', 'Configure GitHub Actions to build and deploy the application.', done_col_id, 0, 2);

    -- Assign Members to Cards
    INSERT INTO card_members (id, card_id, user_id, role) VALUES
    (gen_random_uuid(), card1_id, user_id_main, 'LEAD'),
    (gen_random_uuid(), card1_id, alice_id, 'REVIEWER'),
    (gen_random_uuid(), card2_id, alice_id, 'LEAD'),
    (gen_random_uuid(), card2_id, bob_id, 'ASSIGNEE'),
    (gen_random_uuid(), card3_id, user_id_main, 'LEAD');
END $$;


-- =================================================================
-- Section 4: Create a Second Workspace for a different team
-- =================================================================
DO $$
DECLARE
    dev_workspace_id UUID := gen_random_uuid();
    dev_board_id UUID := gen_random_uuid();
    user_id_main UUID := (SELECT id FROM users WHERE username = 'user');
    alice_id UUID := (SELECT id FROM users WHERE username = 'alice');
BEGIN
    -- Create "Dev Team" Workspace
    INSERT INTO workspaces (id, name, description, created_by) VALUES
    (dev_workspace_id, 'Dev Team Workspace', 'Workspace for the core development team.', user_id_main);

    -- Add 'user' as OWNER and 'alice' as ADMIN
    INSERT INTO workspace_members (id, workspace_id, user_id, role) VALUES
    (gen_random_uuid(), dev_workspace_id, user_id_main, 'OWNER'),
    (gen_random_uuid(), dev_workspace_id, alice_id, 'ADMIN');

    -- Create "Backend Sprint" Board
    INSERT INTO boards (id, name, workspace_id, created_by) VALUES
    (dev_board_id, 'Backend Sprint', dev_workspace_id, user_id_main);

    -- Add members to the board
    INSERT INTO board_members (id, board_id, user_id, role) VALUES
    (gen_random_uuid(), dev_board_id, user_id_main, 'OWNER'),
    (gen_random_uuid(), dev_board_id, alice_id, 'MEMBER');

    -- Add columns to the new board
    INSERT INTO board_columns (id, name, board_id, position) VALUES
    (gen_random_uuid(), 'Backlog', dev_board_id, 0),
    (gen_random_uuid(), 'In Development', dev_board_id, 1),
    (gen_random_uuid(), 'Code Review', dev_board_id, 2),
    (gen_random_uuid(), 'Done', dev_board_id, 3);
END $$;
