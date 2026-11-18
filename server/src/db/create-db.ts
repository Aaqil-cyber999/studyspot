import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

export function databaseNameFrom(connectionString: string): string {
  const name = decodeURIComponent(new URL(connectionString).pathname.slice(1));
  if (!name) {
    throw new Error("DATABASE_URL must include a database name");
  }
  return name;
}

export function adminConnectionString(connectionString: string): string {
  const url = new URL(connectionString);
  url.pathname = "/postgres";
  return url.toString();
}

export function quoteIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

export async function ensureDatabase(connectionString: string): Promise<boolean> {
  const name = databaseNameFrom(connectionString);
  const pool = new Pool({ connectionString: adminConnectionString(connectionString) });
  try {
    const existing = await pool.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);
    if (existing.rowCount && existing.rowCount > 0) {
      return false;
    }
    try {
      await pool.query(`CREATE DATABASE ${quoteIdentifier(name)}`);
      return true;
    } catch (err) {
      // Two migrations can race on a fresh server; the loser sees duplicate_database.
      if ((err as { code?: string }).code === "42P04") {
        return false;
      }
      throw err;
    }
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exitCode = 1;
  } else {
    const name = databaseNameFrom(connectionString);
    ensureDatabase(connectionString)
      .then((created) => {
        console.log(`Database '${name}' ${created ? "created" : "already exists"}`);
      })
      .catch((err) => {
        console.error("Failed to create database:", err instanceof Error ? err.message : err);
        process.exitCode = 1;
      });
  }
}
