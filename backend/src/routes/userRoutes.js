import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
  submitRating,
  getUserRatingForStore,
  deleteRating,
} from "../controllers/ratingController.js";
import { getStores, getStoreDetails } from "../controllers/storeController.js";
import { getStoreAverageRating } from "../controllers/ratingController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/stores", authorizeRole("normal_user", "user", "admin"), getStores);
router.get(
  "/stores/:id",
  authorizeRole("normal_user", "user", "admin"),
  getStoreDetails,
);

router.post("/ratings", authorizeRole("normal_user", "user"), submitRating);
router.get(
  "/ratings/store/:storeId",
  authorizeRole("normal_user", "user"),
  getUserRatingForStore,
);
router.get(
  "/stores/:id/average-rating",
  authorizeRole("normal_user", "user", "store_owner"),
  getStoreAverageRating,
);
router.delete(
  "/ratings/:id",
  authorizeRole("normal_user", "user"),
  deleteRating,
);

export default router;
