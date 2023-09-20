import express from "express";
import {
  createTour,
  deleteTour,
  getRelatedTours,
  getTour,
  getTours,
  getToursBySearch,
  getToursByTag,
  getToursByUser,
  likeTour,
  updateTour,
} from "../controllers/tourController.mjs";
import auth from "../middleware/auth.mjs";

const router = express.Router();

router.get("/search", getToursBySearch);
router.get("/tag/:tag", getToursByTag);
router.post("/relatedTours", getRelatedTours);
router.get("/", getTours);
router.get("/:id", getTour);

router.get("/userTours/:id", auth, getToursByUser);
router.post("/", auth, createTour);
router.patch("/:id", auth, updateTour);
router.delete("/:id", auth, deleteTour);
router.patch("/like/:id", auth, likeTour);

export default router;
