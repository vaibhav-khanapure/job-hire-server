CREATE TABLE IF NOT EXISTS employer_sessions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL REFERENCES employers(id) ON DELETE CASCADE,

    refresh_token_hash TEXT NOT NULL UNIQUE,

    device_name VARCHAR(500),
    ip_address VARCHAR(200),
    user_agent VARCHAR(200),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,

    revoked_at TIMESTAMPTZ,

    CONSTRAINT valid_session_expiry 
      CHECK (expires_at > created_at)
);

CREATE INDEX idx_user_sessions_active
ON employer_sessions (user_id, expires_at)
WHERE revoked_at IS NULL;