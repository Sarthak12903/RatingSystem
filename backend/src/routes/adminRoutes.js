import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
  getDashboard,
  addUser,
  getUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";
import {
  addStore,
  getStores,
  getStoreDetails,
  updateStore,
  deleteStore,
} from "../controllers/storeController.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole("admin"));

// Dashboard
router.get("/dashboard", getDashboard);

// User management
router.post("/users", addUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Store management
router.post("/stores", addStore);
router.get("/stores", getStores);
router.get("/stores/:id", getStoreDetails);
router.put("/stores/:id", updateStore);
router.delete("/stores/:id", deleteStore);

export default router;
