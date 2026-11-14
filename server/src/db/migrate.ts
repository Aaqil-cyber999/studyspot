import dotenv from "dotenv";
dotenv.config();
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as drizzleNodePostgres from "drizzle-orm/node-postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });

async function main() {
  const db = drizzleNodePostgres.drizzle(pool);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations completed");
  pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
