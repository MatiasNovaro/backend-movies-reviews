import express from "express";
import {
  getAllMovies,
  getMoviesFiltered,
  getMovie,
  getTotalMoviesCount,
} from "../data/peliculas.js";

// Create a new Express router instance
const router = express.Router();

/**
 * @route GET /
 * @description Retrieve all movies with optional pagination
 * @param {number} [pageSize] - Number of movies to return per page
 * @param {number} [page] - The page number to retrieve
 * @access Public
 */
router.get("/", async (req, res, next) => {
  try {
    // Get pageSize and page from query parameters; default to 0 if not provided
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    // Fetch all movies using the getAllMovies function and respond with the result
    res.json(await getAllMovies(pageSize, page));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

/**
 * @route GET /count
 * @description Get total number of movies with optional filtering
 * @param {string} [genres] - Comma-separated list of genres to filter by
 * @param {string} [title] - Title filter (case-insensitive)
 * @access Public
 */
router.get("/count", async (req, res, next) => {
  try {
    // Destructure genres and title from query parameters
    const { genres, title } = req.query;
    const filters = {}; // Initialize an empty filters object
    // Add filters if provided
    if (genres) filters.genres = { $in: [genres] };
    if (title) filters.title = { $regex: title, $options: "i" }; //case-insensitive regex

    // Respond with the total count of movies matching the filters
    res.json(await getTotalMoviesCount(filters));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

/**
 * @route GET /filter
 * @description Retrieve filtered movies with optional pagination
 * @param {string} [genres] - Comma-separated list of genres to filter by
 * @param {string} [title] - Title filter (case-insensitive)
 * @param {number} [pageSize] - Number of movies to return per page
 * @param {number} [page] - The page number to retrieve
 * @access Public
 */
router.get("/filter", async (req, res, next) => {
  try {
    // Destructure genres, title, pageSize, and page from query parameters
    const { genres, title, pageSize = 0, page = 0 } = req.query;

    // Parse page and pageSize as integers
    const pagina = parseInt(page);
    const tamanioPg = parseInt(pageSize);

    const filters = {}; // Initialize an empty filters object

    // Add filters if provided
    if (genres) filters.genres = { $in: [genres] };
    if (title) filters.title = { $regex: title, $options: "i" }; //case-insensitive regex

    // Fetch filtered movies using the getMoviesFiltered function and respond with the result
    res.json(await getMoviesFiltered(filters, tamanioPg, pagina));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

/**
 * @route GET /:id
 * @description Retrieve a specific movie by ID
 * @param {string} id - The ID of the movie to retrieve
 * @access Public
 */
router.get("/:id", async (req, res, next) => {
  try {
    // Get the movie ID from the request parameters
    const id = req.params.id;
    // Fetch the movie using the getMovie function and respond with the result
    res.json(await getMovie(id));
  } catch (error) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(error);
  }
});

export default router;
