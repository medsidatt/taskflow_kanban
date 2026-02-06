-- Notifications table for real-time user notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    entity_id UUID,
    entity_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fetching user notifications efficiently
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Index for ordering by created_at
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Composite index for unread count queries
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
