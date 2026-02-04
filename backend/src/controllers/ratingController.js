import { Rating } from "../models/Rating.js";
import { Store } from "../models/Store.js";
import { validateRating } from "../utils/validators.js";

export const submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    const ratingValidation = validateRating(rating);
    if (!ratingValidation.valid) {
      return res.status(400).json({ error: ratingValidation.error });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const ratingRecord = await Rating.create({
      userId,
      storeId,
      rating,
    });

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: ratingRecord,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserRatingForStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findByUserAndStore(userId, storeId);

    if (!rating) {
      return res.json({ rating: null });
    }

    res.json({ rating });
  } catch (err) {
    next(err);
  }
};

export const getStoreRatings = async (req, res, next) => {
  try {
    const storeId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await Rating.getByStore(storeId, page, limit);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getStoreAverageRating = async (req, res, next) => {
  try {
    const storeId = req.params.id;

    const result = await Rating.getAverageRating(storeId);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteRating = async (req, res, next) => {
  try {
    const ratingId = req.params.id;

    const rating = await Rating.delete(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "Rating not found" });
    }

    res.json({ message: "Rating deleted successfully" });
  } catch (err) {
    next(err);
  }
};
