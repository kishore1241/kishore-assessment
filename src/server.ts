import { createApp } from "./app.js";
import { createSqliteShortUrlStore } from "./urlShortener/sqliteStore.js";

const port = Number(process.env.PORT ?? "3000");

async function startServer(): Promise<void> {
  const dbPath = process.env.SQLITE_DB_PATH ?? "data/app.db";
  const store = await createSqliteShortUrlStore(dbPath);
  const app = createApp({ store });

  app.listen(port, () => {
    console.log(`assessment-prototype server running on http://localhost:${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("failed to start server", error);
  process.exit(1);
});
