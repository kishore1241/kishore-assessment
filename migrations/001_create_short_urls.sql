CREATE TABLE IF NOT EXISTS short_urls (
  code TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  created_at TEXT NOT NULL,
  click_count INTEGER NOT NULL DEFAULT 0,
  last_clicked_at TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_short_urls_created_at ON short_urls(created_at DESC);