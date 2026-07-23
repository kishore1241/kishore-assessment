CREATE TABLE IF NOT EXISTS short_url_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  clicked_at TEXT NOT NULL,
  FOREIGN KEY(code) REFERENCES short_urls(code)
);

CREATE INDEX IF NOT EXISTS idx_short_url_clicks_code_time ON short_url_clicks(code, clicked_at DESC);