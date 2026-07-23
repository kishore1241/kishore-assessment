import fs from "node:fs";
import path from "node:path";
import { Database } from "sql.js";

function ensureMigrationsTable(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
}

function appliedMigrationIds(db: Database): Set<string> {
  const result = db.exec("SELECT id FROM schema_migrations;");
  const first = result[0];

  if (!first) {
    return new Set<string>();
  }

  const ids = first.values.map((row: unknown[]) => String(row[0]));
  return new Set<string>(ids);
}

export function runMigrations(db: Database, migrationsDir = path.resolve("migrations")): number {
  ensureMigrationsTable(db);
  const applied = appliedMigrationIds(db);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  let appliedCount = 0;

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    db.run("BEGIN TRANSACTION;");
    try {
      db.run(sql);
      db.run("INSERT INTO schema_migrations(id, applied_at) VALUES(?, ?);", [file, new Date().toISOString()]);
      db.run("COMMIT;");
      appliedCount += 1;
    } catch (error) {
      db.run("ROLLBACK;");
      throw error;
    }
  }

  return appliedCount;
}