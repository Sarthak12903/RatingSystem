import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: "postgres",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const queries = [`CREATE DATABASE ${process.env.DB_NAME}`];

async function runMigrations() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    for (const query of queries) {
      try {
        await client.query(query);
        console.log(`Executed: ${query.substring(0, 50)}...`);
      } catch (err) {
        if (err.code === "42P04") {
          console.log("Database already exists, skipping creation");
        } else {
          throw err;
        }
      }
    }

    await client.end();
    console.log("Migrations completed");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

runMigrations();
