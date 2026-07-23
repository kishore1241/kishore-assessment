import { AnalyticsSummary, ShortUrlRecord, ShortUrlStore, TopLinkAnalytics } from "./types.js";

interface ClickEvent {
  code: string;
  clickedAt: string;
}

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
  const clickEvents: ClickEvent[] = [];

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

      const clickedAt = new Date().toISOString();
      existing.clickCount += 1;
      existing.lastClickedAt = clickedAt;
      records.set(existing.code, existing);
      clickEvents.push({ code: existing.code, clickedAt });

      return existing;
    },

    async listShortUrls(): Promise<ShortUrlRecord[]> {
      return Array.from(records.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async getAnalyticsSummary(sinceHours: number): Promise<AnalyticsSummary> {
      const since = Date.now() - sinceHours * 60 * 60 * 1000;
      const recent = clickEvents.filter((event) => Date.parse(event.clickedAt) >= since);

      return {
        sinceHours,
        totalClicks: recent.length,
        uniqueLinks: new Set(recent.map((event) => event.code)).size,
        generatedAt: new Date().toISOString()
      };
    },

    async getTopLinks(limit: number, sinceHours: number): Promise<TopLinkAnalytics[]> {
      const since = Date.now() - sinceHours * 60 * 60 * 1000;
      const recent = clickEvents.filter((event) => Date.parse(event.clickedAt) >= since);

      const counts = new Map<string, number>();
      for (const event of recent) {
        counts.set(event.code, (counts.get(event.code) ?? 0) + 1);
      }

      const ranked = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

      return ranked.map(([code, clickCount]) => {
        const record = records.get(code);
        return {
          code,
          originalUrl: record?.originalUrl ?? "unknown",
          clickCount,
          lastClickedAt: record?.lastClickedAt ?? null
        };
      });
    },

    async clearForTests(): Promise<void> {
      records.clear();
      clickEvents.length = 0;
    }
  };
}