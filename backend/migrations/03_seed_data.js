import pkg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seed() {
  try {
    await client.connect();
    console.log("Connected to rating_system database");

    // Check if admin exists
    const existingAdmin = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      ["admin@example.com"],
    );

    if (existingAdmin.rows.length > 0) {
      console.log("Admin user already exists, skipping seeding");
      await client.end();
      return;
    }

    // Create admin user (password: Admin@123)
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    await client.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        "System Administrator User",
        "admin@example.com",
        hashedPassword,
        "123 Admin Street, Admin City",
        "admin",
      ],
    );
    console.log("Admin user created: admin@example.com / Admin@123");

    // Create a sample store owner (password: Owner@123)
    const ownerPassword = await bcrypt.hash("Owner@123", 10);
    await client.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        "Sample Store Owner User",
        "storeowner@example.com",
        ownerPassword,
        "456 Store Street, Shop City",
        "store_owner",
      ],
    );
    console.log("Store owner created: storeowner@example.com / Owner@123");

    // Create sample normal user (password: User@123)
    const userPassword = await bcrypt.hash("User@123", 10);
    await client.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        "Sample Normal User Account",
        "user@example.com",
        userPassword,
        "789 User Lane, User Town",
        "normal_user",
      ],
    );
    console.log("Normal user created: user@example.com / User@123");

    // Create a sample store
    const storeOwnerResult = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      ["storeowner@example.com"],
    );

    await client.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)`,
      [
        "Sample Electronics Store",
        "electronics@example.com",
        "100 Commerce Blvd, Shopping District",
        storeOwnerResult.rows[0].id,
      ],
    );
    console.log("Sample store created");

    console.log("\n=== Seed data completed ===");
    console.log("Admin: admin@example.com / Admin@123");
    console.log("Store Owner: storeowner@example.com / Owner@123");
    console.log("Normal User: user@example.com / User@123");

    await client.end();
    console.log("Seeding completed successfully");
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
