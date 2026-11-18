import dotenv from "dotenv";
dotenv.config();
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as drizzleNodePostgres from "drizzle-orm/node-postgres";
import { ensureDatabase } from "./create-db.js";

const envUrl = process.env.DATABASE_URL;
if (!envUrl) {
  throw new Error("DATABASE_URL is not set");
}
const connectionString: string = envUrl;

async function main() {
  await ensureDatabase(connectionString);
  const pool = new Pool({ connectionString });
  try {
    const db = drizzleNodePostgres.drizzle(pool);
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
