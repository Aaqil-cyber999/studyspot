import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

// Connect to default 'postgres' database to create our target database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace("/studyspot", "/postgres"),
});

async function main() {
  await pool.query('CREATE DATABASE studyspot');
  console.log("Database 'studyspot' created");
  pool.end();
}

main().catch((err) => {
  if (err.message.includes("already exists")) {
    console.log("Database 'studyspot' already exists");
  } else {
    console.error("Failed to create database:", err.message);
  }
  process.exit(0);
});
