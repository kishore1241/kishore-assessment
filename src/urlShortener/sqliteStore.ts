import { openSqliteClient } from "../db/sqliteClient.js";
import { runMigrations } from "../db/migrate.js";
import { ShortUrlRecord, ShortUrlStore } from "./types.js";

function randomCode(length = 7): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  for (let i = 0; i < length; i += 1) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }
  return value;
}

function normalize(row: unknown[]): ShortUrlRecord {
  return {
    code: String(row[0]),
    originalUrl: String(row[1]),
    createdAt: String(row[2]),
    clickCount: Number(row[3]),
    lastClickedAt: row[4] ? String(row[4]) : null
  };
}

export async function createSqliteShortUrlStore(dbPath: string): Promise<ShortUrlStore> {
  const client = await openSqliteClient(dbPath);
  runMigrations(client.db);
  client.save();

  const getByCode = (code: string): ShortUrlRecord | undefined => {
    const result = client.db.exec(
      "SELECT code, original_url, created_at, click_count, last_clicked_at FROM short_urls WHERE code = ?;",
      [code.toLowerCase()]
    );
    const first = result[0];

    if (!first || first.values.length === 0) {
      return undefined;
    }

    const row = first.values[0];
    if (!row) {
      return undefined;
    }

    return normalize(row);
  };

  return {
    async createShortUrl(originalUrl: string, customCode?: string): Promise<ShortUrlRecord> {
      const code = (customCode ?? randomCode()).toLowerCase();
      const createdAt = new Date().toISOString();

      const existing = client.db.exec("SELECT code FROM short_urls WHERE code = ?;", [code]);
      if (existing.length > 0) {
        throw new Error("Code already exists");
      }

      client.db.run(
        "INSERT INTO short_urls(code, original_url, created_at, click_count, last_clicked_at) VALUES (?, ?, ?, 0, NULL);",
        [code, originalUrl, createdAt]
      );
      client.save();

      return {
        code,
        originalUrl,
        createdAt,
        clickCount: 0,
        lastClickedAt: null
      };
    },

    async getShortUrl(code: string): Promise<ShortUrlRecord | undefined> {
      return getByCode(code);
    },

    async recordClick(code: string): Promise<ShortUrlRecord | undefined> {
      const current = getByCode(code);
      if (!current) {
        return undefined;
      }

      const clickedAt = new Date().toISOString();
      const nextCount = current.clickCount + 1;

      client.db.run("UPDATE short_urls SET click_count = ?, last_clicked_at = ? WHERE code = ?;", [nextCount, clickedAt, current.code]);
      client.db.run("INSERT INTO short_url_clicks(code, clicked_at) VALUES(?, ?);", [current.code, clickedAt]);
      client.save();

      return {
        ...current,
        clickCount: nextCount,
        lastClickedAt: clickedAt
      };
    },

    async listShortUrls(): Promise<ShortUrlRecord[]> {
      const result = client.db.exec(
        "SELECT code, original_url, created_at, click_count, last_clicked_at FROM short_urls ORDER BY created_at DESC;"
      );
      const first = result[0];

      if (!first) {
        return [];
      }

      return first.values.map((row: unknown[]) => normalize(row));
    }
  };
}