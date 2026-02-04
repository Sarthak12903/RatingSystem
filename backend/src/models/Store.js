import pool from "../utils/db.js";

export class Store {
  static async create(storeData) {
    const { name, email, address, ownerId } = storeData;

    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id, created_at`,
      [name, email, address, ownerId],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT id, name, email, address, owner_id, created_at, updated_at FROM stores WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(`SELECT * FROM stores WHERE email = $1`, [
      email,
    ]);
    return result.rows[0];
  }

  static async getAll(filters = {}, page = 1, limit = 10, userId = null) {
    let query = `SELECT s.id, s.name, s.email, s.address, s.owner_id, 
                 COALESCE(AVG(r.rating), 0) as rating,
                 s.created_at`;

    if (userId) {
      query += `, (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = $1) as user_rating`;
    }

    query += ` FROM stores s
                 LEFT JOIN ratings r ON s.id = r.store_id
                 WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    if (userId) {
      params.push(userId);
      paramCount++;
    }

    if (filters.name) {
      query += ` AND s.name ILIKE $${paramCount}`;
      params.push(`%${filters.name}%`);
      paramCount++;
    }

    if (filters.email) {
      query += ` AND s.email ILIKE $${paramCount}`;
      params.push(`%${filters.email}%`);
      paramCount++;
    }

    if (filters.address) {
      query += ` AND s.address ILIKE $${paramCount}`;
      params.push(`%${filters.address}%`);
      paramCount++;
    }

    query += ` GROUP BY s.id`;

    const validSortFields = { id: 1, name: 1, email: 1, address: 1, rating: 1 };
    if (filters.sortBy && filters.sortBy in validSortFields) {
      if (filters.sortBy === "rating") {
        query += ` ORDER BY rating ${filters.sortOrder === "desc" ? "DESC" : "ASC"}`;
      } else {
        query += ` ORDER BY s.${filters.sortBy} ${filters.sortOrder === "desc" ? "DESC" : "ASC"}`;
      }
    } else {
      query += ` ORDER BY s.id ASC`;
    }

    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    let countQuery = `SELECT COUNT(DISTINCT s.id) FROM stores s WHERE 1=1`;
    const countParams = [];
    let countParamCount = 1;

    if (filters.name) {
      countQuery += ` AND s.name ILIKE $${countParamCount}`;
      countParams.push(`%${filters.name}%`);
      countParamCount++;
    }
    if (filters.email) {
      countQuery += ` AND s.email ILIKE $${countParamCount}`;
      countParams.push(`%${filters.email}%`);
      countParamCount++;
    }
    if (filters.address) {
      countQuery += ` AND s.address ILIKE $${countParamCount}`;
      countParams.push(`%${filters.address}%`);
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

  static async update(id, storeData) {
    const { name, email, address } = storeData;
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

    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      params.push(address);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    params.push(id);

    const query = `UPDATE stores SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING id, name, email, address, owner_id, updated_at`;

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM stores WHERE id = $1 RETURNING id`,
      [id],
    );
    return result.rows[0];
  }

  static async getTotalCount() {
    const result = await pool.query(`SELECT COUNT(*) FROM stores`);
    return parseInt(result.rows[0].count);
  }
}
