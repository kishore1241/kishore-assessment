import { ShortUrlRecord, ShortUrlStore } from "./types.js";

function randomCode(length = 7): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  for (let i = 0; i < length; i += 1) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }
  return value;
}

export function createMemoryShortUrlStore(): ShortUrlStore {
  const records = new Map<string, ShortUrlRecord>();

  return {
    async createShortUrl(originalUrl: string, customCode?: string): Promise<ShortUrlRecord> {
      const code = (customCode ?? randomCode()).toLowerCase();

      if (records.has(code)) {
        throw new Error("Code already exists");
      }

      const record: ShortUrlRecord = {
        code,
        originalUrl,
        createdAt: new Date().toISOString(),
        clickCount: 0,
        lastClickedAt: null
      };

      records.set(code, record);
      return record;
    },

    async getShortUrl(code: string): Promise<ShortUrlRecord | undefined> {
      return records.get(code.toLowerCase());
    },

    async recordClick(code: string): Promise<ShortUrlRecord | undefined> {
      const existing = records.get(code.toLowerCase());
      if (!existing) {
        return undefined;
      }

      existing.clickCount += 1;
      existing.lastClickedAt = new Date().toISOString();
      records.set(existing.code, existing);

      return existing;
    },

    async listShortUrls(): Promise<ShortUrlRecord[]> {
      return Array.from(records.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async clearForTests(): Promise<void> {
      records.clear();
    }
  };
}