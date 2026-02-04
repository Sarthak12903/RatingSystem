import { User } from "../models/User.js";
import { Store } from "../models/Store.js";
import {
  validateUserSignup,
  validatePassword,
  validateEmail,
} from "../utils/validators.js";
import { generateToken } from "../utils/jwt.js";
import pool from "../utils/db.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await User.validatePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    // If store owner, include their store ID
    if (user.role === "store_owner") {
      const storeResult = await pool.query(
        "SELECT id FROM stores WHERE owner_id = $1",
        [user.id],
      );
      if (storeResult.rows.length > 0) {
        userData.storeId = storeResult.rows[0].id;
      }
    }

    res.json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    // Validation
    const validation = validateUserSignup({ name, email, password, address });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      address,
      role: "user",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old and new password required" });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify old password
    const passwordMatch = await User.validatePassword(
      oldPassword,
      (await User.findByEmail(user.email)).password,
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Update password
    await User.update(userId, { password: newPassword });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
