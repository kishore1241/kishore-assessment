export interface ShortUrlRecord {
  code: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  lastClickedAt: string | null;
}

const records = new Map<string, ShortUrlRecord>();

function randomCode(length = 7): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  for (let i = 0; i < length; i += 1) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }
  return value;
}

export function createShortUrl(originalUrl: string, customCode?: string): ShortUrlRecord {
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
}

export function getShortUrl(code: string): ShortUrlRecord | undefined {
  return records.get(code.toLowerCase());
}

export function recordClick(code: string): ShortUrlRecord | undefined {
  const existing = getShortUrl(code);
  if (!existing) {
    return undefined;
  }

  existing.clickCount += 1;
  existing.lastClickedAt = new Date().toISOString();
  records.set(existing.code, existing);
  return existing;
}

export function listShortUrls(): ShortUrlRecord[] {
  return Array.from(records.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function clearStoreForTests(): void {
  records.clear();
}
