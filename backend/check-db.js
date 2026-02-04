import pool from "./src/config/database.js";

async function checkDB() {
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
    );
    console.log("Tables in rating_system database:");
    tables.rows.forEach((r) => console.log(" -", r.table_name));

    const result = await pool.query("SELECT id, name, email, role FROM users");
    console.log("\nUsers in database:");
    console.table(result.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

checkDB();
