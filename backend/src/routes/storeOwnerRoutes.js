import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
  getStoreRatings,
  getStoreAverageRating,
} from "../controllers/ratingController.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole("store_owner"));

router.get("/dashboard/:storeId", getStoreAverageRating);
router.get("/dashboard/:id/ratings", getStoreRatings);

export default router;
