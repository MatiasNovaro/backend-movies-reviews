import express from "express";
import {
  getAllReviews,
  getReviewsByMovieId,
  saveReview,
  getReviewsByUser,
  getTotalReviewsByUser,
  getTotalReviewsByMovieId,
} from "../data/review.js";
import auth from "../middlewares/auth.js";
import Review from "../models/Review.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    res.json(await getAllReviews(pageSize, page));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    res.json(await getReviewsByUser(username, pageSize, page));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/count/:id", async (req, res) => {
  try {
    const id = req.params.id;
    res.json(await getTotalReviewsByMovieId(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/user/count/:username", async (req, res) => {
  try {
    const { username } = req.params;
    res.json(await getTotalReviewsByUser(username));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    res.json(await getReviewsByMovieId(id, pageSize, page));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth , async (req, res) => {
  try {
    const { movie_id, reviewText } = req.body;
    if(!reviewText || !movie_id) return res.status(400).json({ message: 'El texto de la reseña es requerido' });
    const user = req.user;
    const text =reviewText;
    const { name, email } = req.user.user;
    const review = new Review({ name, email, movie_id, text });
    res.json(await saveReview(review));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
