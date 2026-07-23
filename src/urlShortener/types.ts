export interface ShortUrlRecord {
  code: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  lastClickedAt: string | null;
}

export interface ShortUrlStore {
  createShortUrl(originalUrl: string, customCode?: string): Promise<ShortUrlRecord>;
  getShortUrl(code: string): Promise<ShortUrlRecord | undefined>;
  recordClick(code: string): Promise<ShortUrlRecord | undefined>;
  listShortUrls(): Promise<ShortUrlRecord[]>;
  clearForTests?(): Promise<void>;
}