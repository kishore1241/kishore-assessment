export interface ShortUrlRecord {
  code: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  lastClickedAt: string | null;
}

export interface AnalyticsSummary {
  sinceHours: number;
  totalClicks: number;
  uniqueLinks: number;
  generatedAt: string;
}

export interface TopLinkAnalytics {
  code: string;
  originalUrl: string;
  clickCount: number;
  lastClickedAt: string | null;
}

export interface ShortUrlStore {
  createShortUrl(originalUrl: string, customCode?: string): Promise<ShortUrlRecord>;
  getShortUrl(code: string): Promise<ShortUrlRecord | undefined>;
  recordClick(code: string): Promise<ShortUrlRecord | undefined>;
  listShortUrls(): Promise<ShortUrlRecord[]>;
  getAnalyticsSummary(sinceHours: number): Promise<AnalyticsSummary>;
  getTopLinks(limit: number, sinceHours: number): Promise<TopLinkAnalytics[]>;
  clearForTests?(): Promise<void>;
}