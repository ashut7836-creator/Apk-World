PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  session_hash TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS oauth_states (
  state_hash TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expiry ON oauth_states(expires_at);

CREATE TABLE IF NOT EXISTS google_tokens (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  refresh_token_ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS catalogue_items (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('app','video','link')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  version TEXT,
  file_size INTEGER,
  url TEXT,
  drive_file_id TEXT,
  drive_view_url TEXT,
  mime_type TEXT,
  thumbnail_url TEXT,
  published_at TEXT NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_catalogue_published
  ON catalogue_items(is_published, published_at DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip_hash TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_started_at INTEGER NOT NULL,
  blocked_until INTEGER NOT NULL DEFAULT 0
);
