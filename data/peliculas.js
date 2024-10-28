import getConnection from "./conn.js";
import { ObjectId } from "mongodb";

// Database and collection constants.
const DATABASE = process.env.DATABASE;
const MOVIES = process.env.MOVIES_COLLECTION;

/**
 * Retrieve all movies from the database limited by the defined page size.
 * 
 * @param {number} pageSize - The maximum number of movies to retrieve.
 * @param {number} page - The page number for pagination (0-based).
 * @returns {Promise<Array>} - An array of movie objects.
 */
export async function getAllMovies(pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({})
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

/**
 * Retrieve a movie from the database by the given ID.
 * 
 * @param {string} id - The ID of the movie to retrieve.
 * @returns {Promise<Object>} - The movie object or null if not found.
 */
export async function getMovie(id) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .findOne({_id : new ObjectId(id)})
  return movies;
}

/**
 * Retrieve all movies matching the given filters.
 * 
 * @param {Object} filters - The filter criteria for querying movies.
 * @param {number} pageSize - The maximum number of movies to retrieve.
 * @param {number} page - The page number for pagination (0-based).
 * @returns {Promise<Array>} - An array of movie objects that match the filters.
 */
export async function getMoviesFiltered(filters, pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find(filters)
    .collation({ locale: 'en', strength: 2 })
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}
/**
 * Calculates the number of movies that match the given filters.
 * 
 * @param {Object} filters - The filter criteria for counting movies.
 * @returns {Promise<number>} - The total count of movies that match the filters.
 */
export async function getTotalMoviesCount(filters) {
  const connectiondb = await getConnection();
  const totalMoviesCount = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .countDocuments(filters);
  return totalMoviesCount;
}