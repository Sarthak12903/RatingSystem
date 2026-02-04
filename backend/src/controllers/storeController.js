import { Store } from "../models/Store.js";
import { Rating } from "../models/Rating.js";
import { validateStoreData } from "../utils/validators.js";

export const addStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const validation = validateStoreData({ name, email, address });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    if (!ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    const existingStore = await Store.findByEmail(email);
    if (existingStore) {
      return res.status(400).json({ error: "Store email already registered" });
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (err) {
    next(err);
  }
};

export const getStores = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      sortBy: req.query.sortBy || "id",
      sortOrder: req.query.sortOrder || "asc",
    };
    const userId = req.user?.id;

    const result = await Store.getAll(filters, page, limit, userId);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getStoreDetails = async (req, res, next) => {
  try {
    const storeId = req.params.id;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const ratingInfo = await Rating.getAverageRating(storeId);

    res.json({
      ...store,
      averageRating: ratingInfo.averageRating,
      totalRatings: ratingInfo.totalRatings,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const storeId = req.params.id;
    const { name, email, address } = req.body;

    if (name || email || address) {
      const validation = validateStoreData({
        name: name || "",
        email: email || "",
        address: address || "",
      });
      if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
      }
    }

    if (email) {
      const existingStore = await Store.findByEmail(email);
      if (existingStore && existingStore.id !== parseInt(storeId)) {
        return res
          .status(400)
          .json({ error: "Store email already registered" });
      }
    }

    const store = await Store.update(storeId, { name, email, address });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({
      message: "Store updated successfully",
      store,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const storeId = req.params.id;

    const store = await Store.delete(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    next(err);
  }
};
