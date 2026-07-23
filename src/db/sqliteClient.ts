import fs from "node:fs";
import path from "node:path";
import initSqlJs, { Database, SqlJsStatic } from "sql.js";

let sqlRuntime: SqlJsStatic | null = null;

async function loadRuntime(): Promise<SqlJsStatic> {
  if (sqlRuntime !== null) {
    return sqlRuntime;
  }

  sqlRuntime = await initSqlJs({
    locateFile: (file: string) => path.join(process.cwd(), "node_modules", "sql.js", "dist", file)
  });

  return sqlRuntime;
}

export interface SqliteClient {
  db: Database;
  save: () => void;
}

export async function openSqliteClient(dbPath: string): Promise<SqliteClient> {
  const SQL = await loadRuntime();
  const absolutePath = path.resolve(dbPath);
  const dirPath = path.dirname(absolutePath);

  fs.mkdirSync(dirPath, { recursive: true });

  const db = fs.existsSync(absolutePath)
    ? new SQL.Database(new Uint8Array(fs.readFileSync(absolutePath)))
    : new SQL.Database();

  return {
    db,
    save: () => {
      const binary = db.export();
      fs.writeFileSync(absolutePath, Buffer.from(binary));
    }
  };
}