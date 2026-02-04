import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Client } = pkg;

async function runMigrations() {
  // First, create the database if it doesn't exist
  const adminClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres", // Connect to default postgres database
  });

  try {
    await adminClient.connect();
    console.log("Connected to PostgreSQL server");

    // Check if database exists
    const dbCheckResult = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME],
    );

    if (dbCheckResult.rows.length === 0) {
      console.log(`Creating database: ${process.env.DB_NAME}`);
      await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log("Database created successfully");
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    }
  } catch (err) {
    console.error("Error creating database:", err.message);
  } finally {
    await adminClient.end();
  }

  // Now connect to the rating_system database and create schema
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log(`Connected to ${process.env.DB_NAME} database`);

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400),
        role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'store_owner')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created/verified");

    // Create stores table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400),
        owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Stores table created/verified");

    // Create ratings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `);
    console.log("Ratings table created/verified");

    // Create indexes
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id)`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id)`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id)`,
    );
    console.log("Indexes created/verified");

    // Seed admin user if not exists
    const bcrypt = (await import("bcryptjs")).default;
    const adminPassword = await bcrypt.hash("Admin@123", 10);

    const adminCheck = await client.query(
      `SELECT id FROM users WHERE email = 'admin@ratingsystem.com'`,
    );
    if (adminCheck.rows.length === 0) {
      await client.query(
        `
        INSERT INTO users (name, email, password, role, address)
        VALUES ('System Administrator', 'admin@ratingsystem.com', $1, 'admin', '123 Admin Street, Tech City')
      `,
        [adminPassword],
      );
      console.log("Admin user created: admin@ratingsystem.com / Admin@123");
    }

    // Seed store owner and store if not exists
    const ownerPassword = await bcrypt.hash("Owner@123", 10);
    const ownerCheck = await client.query(
      `SELECT id FROM users WHERE email = 'owner@store.com'`,
    );
    let ownerId;

    if (ownerCheck.rows.length === 0) {
      const ownerResult = await client.query(
        `
        INSERT INTO users (name, email, password, role, address)
        VALUES ('Store Owner Demo', 'owner@store.com', $1, 'store_owner', '456 Store Ave, Commerce City')
        RETURNING id
      `,
        [ownerPassword],
      );
      ownerId = ownerResult.rows[0].id;
      console.log("Store owner created: owner@store.com / Owner@123");
    } else {
      ownerId = ownerCheck.rows[0].id;
    }

    // Seed store if not exists
    const storeCheck = await client.query(
      `SELECT id FROM stores WHERE email = 'contact@demostore.com'`,
    );
    if (storeCheck.rows.length === 0) {
      await client.query(
        `
        INSERT INTO stores (name, email, address, owner_id)
        VALUES ('Demo Store', 'contact@demostore.com', '789 Market Street, Shopping District', $1)
      `,
        [ownerId],
      );
      console.log("Demo store created");
    }

    // Seed normal user if not exists
    const userPassword = await bcrypt.hash("User@123", 10);
    const userCheck = await client.query(
      `SELECT id FROM users WHERE email = 'user@example.com'`,
    );
    if (userCheck.rows.length === 0) {
      await client.query(
        `
        INSERT INTO users (name, email, password, role, address)
        VALUES ('Normal User Demo', 'user@example.com', $1, 'user', '321 User Lane, Residential Area')
      `,
        [userPassword],
      );
      console.log("Normal user created: user@example.com / User@123");
    }

    console.log("\n✅ All migrations completed successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("   Admin: admin@ratingsystem.com / Admin@123");
    console.log("   Store Owner: owner@store.com / Owner@123");
    console.log("   User: user@example.com / User@123");
  } catch (err) {
    console.error("Migration error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
