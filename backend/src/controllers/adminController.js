import { User } from "../models/User.js";
import { Store } from "../models/Store.js";
import { Rating } from "../models/Rating.js";
import {
  validateUserSignup,
  validateName,
  validateEmail,
  validateAddress,
} from "../utils/validators.js";
import { USER_ROLES } from "../utils/constants.js";

export const getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.getTotalCount();
    const totalStores = await Store.getTotalCount();
    const totalRatings = await Rating.getTotalCount();

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const validation = validateUserSignup({ name, email, password, address });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    if (!Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      role: req.query.role,
      sortBy: req.query.sortBy || "id",
      sortOrder: req.query.sortOrder || "asc",
    };

    const result = await User.getAll(filters, page, limit);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === USER_ROLES.STORE_OWNER) {
      const storeResult = await Store.getAll({ sortBy: "id" }, 1, 1000);
      const store = storeResult.data.find((s) => s.owner_id === userId);

      if (store) {
        user.storeRating = store.rating;
        user.storeId = store.id;
      }
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { name, email, address } = req.body;

    if (name) {
      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
        return res.status(400).json({ error: nameValidation.error });
      }
    }

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== parseInt(userId)) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    if (address) {
      const addressValidation = validateAddress(address);
      if (!addressValidation.valid) {
        return res.status(400).json({ error: addressValidation.error });
      }
    }

    const user = await User.update(userId, { name, email, address });

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.delete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
