import bcrypt from "bcryptjs";
import pool from "../utils/db.js";
import { USER_ROLES } from "../utils/constants.js";

export class User {
  static async create(userData) {
    const {
      name,
      email,
      password,
      address,
      role = USER_ROLES.NORMAL_USER,
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role, created_at`,
      [name, email, hashedPassword, address || null, role],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return result.rows[0];
  }

  static async getAll(filters = {}, page = 1, limit = 10) {
    let query = `SELECT id, name, email, address, role, created_at FROM users WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    if (filters.name) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${filters.name}%`);
      paramCount++;
    }

    if (filters.email) {
      query += ` AND email ILIKE $${paramCount}`;
      params.push(`%${filters.email}%`);
      paramCount++;
    }

    if (filters.address) {
      query += ` AND address ILIKE $${paramCount}`;
      params.push(`%${filters.address}%`);
      paramCount++;
    }

    if (filters.role) {
      query += ` AND role = $${paramCount}`;
      params.push(filters.role);
      paramCount++;
    }

    // Sorting
    if (
      filters.sortBy &&
      filters.sortBy in { id: 1, name: 1, email: 1, address: 1, role: 1 }
    ) {
      query += ` ORDER BY ${filters.sortBy} ${filters.sortOrder === "desc" ? "DESC" : "ASC"}`;
    } else {
      query += ` ORDER BY id ASC`;
    }

    // Pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`;
    const countParams = [];
    let countParamCount = 1;

    if (filters.name) {
      countQuery += ` AND name ILIKE $${countParamCount}`;
      countParams.push(`%${filters.name}%`);
      countParamCount++;
    }
    if (filters.email) {
      countQuery += ` AND email ILIKE $${countParamCount}`;
      countParams.push(`%${filters.email}%`);
      countParamCount++;
    }
    if (filters.address) {
      countQuery += ` AND address ILIKE $${countParamCount}`;
      countParams.push(`%${filters.address}%`);
      countParamCount++;
    }
    if (filters.role) {
      countQuery += ` AND role = $${countParamCount}`;
      countParams.push(filters.role);
      countParamCount++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return {
      data: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async update(id, userData) {
    const { name, email, password, address } = userData;
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      params.push(name);
      paramCount++;
    }

    if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      params.push(email);
      paramCount++;
    }

    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramCount}`);
      params.push(hashedPassword);
      paramCount++;
    }

    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      params.push(address);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    params.push(id);

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING id, name, email, address, role, updated_at`;

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [id],
    );
    return result.rows[0];
  }

  static async validatePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  static async getTotalCount() {
    const result = await pool.query(`SELECT COUNT(*) FROM users`);
    return parseInt(result.rows[0].count);
  }
}
