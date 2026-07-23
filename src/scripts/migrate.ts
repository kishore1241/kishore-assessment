import { openSqliteClient } from "../db/sqliteClient.js";
import { runMigrations } from "../db/migrate.js";

async function main(): Promise<void> {
  const dbPath = process.env.SQLITE_DB_PATH ?? "data/app.db";
  const client = await openSqliteClient(dbPath);
  const count = runMigrations(client.db);
  client.save();

  console.log(`migrations applied: ${count}`);
}

main().catch((error: unknown) => {
  console.error("migration failed", error);
  process.exit(1);
});
