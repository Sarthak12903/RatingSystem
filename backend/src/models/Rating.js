import pool from "../utils/db.js";

export class Rating {
  static async create(ratingData) {
    const { userId, storeId, rating } = ratingData;

    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id) DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING id, user_id, store_id, rating, created_at`,
      [userId, storeId, rating],
    );

    return result.rows[0];
  }

  static async findByUserAndStore(userId, storeId) {
    const result = await pool.query(
      `SELECT id, user_id, store_id, rating, created_at, updated_at FROM ratings WHERE user_id = $1 AND store_id = $2`,
      [userId, storeId],
    );
    return result.rows[0];
  }

  static async getByStore(storeId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT r.id, r.user_id, u.name as user_name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [storeId, limit, offset],
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM ratings WHERE store_id = $1`,
      [storeId],
    );

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

  static async getAverageRating(storeId) {
    const result = await pool.query(
      `SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as total_ratings FROM ratings WHERE store_id = $1`,
      [storeId],
    );
    return {
      averageRating: parseFloat(result.rows[0].average_rating),
      totalRatings: parseInt(result.rows[0].total_ratings),
    };
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM ratings WHERE id = $1 RETURNING id`,
      [id],
    );
    return result.rows[0];
  }

  static async getTotalCount() {
    const result = await pool.query(`SELECT COUNT(*) FROM ratings`);
    return parseInt(result.rows[0].count);
  }
}
