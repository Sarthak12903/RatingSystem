import express from "express";
import {
  login,
  signup,
  updatePassword,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/update-password", authenticateToken, updatePassword);

export default router;
