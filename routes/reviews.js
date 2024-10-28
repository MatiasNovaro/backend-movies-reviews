import express from "express";
import { reviewLimiter } from "../middlewares/rateLimit.js";
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

// Create a new Express router instance
const router = express.Router();

/**
 * @route GET /
 * @description Retrieve all reviews with optional pagination
 * @param {number} [pageSize] - Number of reviews to return per page
 * @param {number} [page] - The page number to retrieve
 * @access Public
 */
router.get("/", async (req, res, next) => {
  try {
    // Get pageSize and page from query parameters; default to 0 if not provided
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    // Fetch all reviews using the getAllReviews function and respond with the result
    res.json(await getAllReviews(pageSize, page));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

/**
 * @route GET /user/:username
 * @description Get reviews by a specific user
 * @param {string} [username] - User's username
 * @param {number} [pageSize] - Number of reviews to return per page
 * @param {number} [page] - The page number to retrieve
 * @access Public
 */
router.get("/user/:username", async (req, res, next) => {
  try {
    // Get the username from the request parameters
    const { username } = req.params;
    // Get pageSize and page from query parameters; default to 0 if not provided
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    // Fetch reviews by user using the getReviewsByUser function and respond with the result
    res.json(await getReviewsByUser(username, pageSize, page));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});
/**
 * @route GET /count
 * @description Get total number of reviews for a specific movie by its ID
 * @param {string} [id] - The ID of the movie to retrieve reviews for
 * @access Public
 */
router.get("/count/:id", async (req, res, next) => {
  try {
    // Get the movie ID from the request parameter
    const id = req.params.id;
    // Respond with the total number of reviews for the specified movie ID
    res.json(await getTotalReviewsByMovieId(id));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

/**
 * @route GET /user/count/:username
 * @description Get the total number of reviews submitted by a specific user
 * @param {string} username - The username of the user to get the review count for
 * @access Public
 */
router.get("/user/count/:username", async (req, res, next) => {
  try {
    // Get the username from the request parameters
    const { username } = req.params;
    // Respond with the total number of reviews submitted by the specified user
    res.json(await getTotalReviewsByUser(username));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

/**
 * @route GET /:id
 * @description Get reviews for a specific movie by its ID with optional pagination
 * @param {string} id - The ID of the movie to retrieve reviews for
 * @param {number} [pageSize] - Number of reviews to return per page (default is 0)
 * @param {number} [page] - The page number to retrieve (default is 0)
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    // Get the movie ID from the request parameters
    const id = req.params.id;
    // Get pageSize and page from query parameters; default to 0 if not provided
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    // Fetch reviews for the specified movie ID using the getReviewsByMovieId function and respond with the result
    res.json(await getReviewsByMovieId(id, pageSize, page));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

/**
 * @route POST /
 * @description Submit a new review for a movie
 * @param {object} req.body - The review data
 * @param {string} req.body.movie_id - The ID of the movie being reviewed
 * @param {string} req.body.reviewText - The text of the review
 * @access Private
 * @middleware reviewLimiter - Rate limiting middleware
 * @middleware auth - Authentication middleware to ensure the user is logged in
 */
router.post("/", reviewLimiter, auth, async (req, res, next) => {
  try {
    // Get movie_id and reviewText from request body
    const { movie_id, reviewText } = req.body;

    // Validate that both movie_id and reviewText are provided
    if (!reviewText || !movie_id) {
      const err = new Error("El texto de la reseña es requerido"); // Create a new error if validation fails
      err.status = 400; // Set the error status to 400 (Bad Request)
      return next(err); // Pass the error to the next middleware (error handler)
    }
    const user = req.user; // Get the authenticated user from the request
    const text = reviewText; // Store review text
    const { name, email } = req.user.user; // Extract user's name and email from the request

    // Create a new Review instance with the user's details and the review text
    const review = new Review({ name, email, movie_id, text });

    // Save the review using the saveReview function and respond with the result
    res.json(await saveReview(review));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

export default router;
