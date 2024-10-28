import getConnection from "./conn.js";
import { ObjectId } from "mongodb";

// Constants for database and collection names.
const DATABASE = process.env.DATABASE;
const REVIEWS = process.env.REVIEWS_COLLECTION;


/**
 * Retrieve all reviews from the database limited by the defined page size.
 * 
 * @param {number} pageSize - The maximum number of reviews to retrieve.
 * @param {number} page - The page number for pagination (0-based).
 * @returns {Promise<Array>} - An array of review objects.
 */
export async function getAllReviews(pageSize, page) {
    const connectiondb = await getConnection();
    const reviews = await connectiondb
      .db(DATABASE)
      .collection(REVIEWS)
      .find({})
      .limit(pageSize)
      .skip(pageSize * page)
      .toArray();
    return reviews;
  }

  /**
 * Retrieve reviews for a specific movie by its ID.
 * 
 * @param {string} id - The ID of the movie whose reviews are to be retrieved.
 * @param {number} pageSize - The maximum number of reviews to retrieve.
 * @param {number} page - The page number for pagination (0-based).
 * @returns {Promise<Array>} - An array of review objects related to the specified movie.
 */
  export async function getReviewsByMovieId(id, pageSize, page) {
    const connectiondb = await getConnection();
    const reviews = await connectiondb
      .db(DATABASE)
      .collection(REVIEWS)
      .find({movie_id : new ObjectId(id)})
      .limit(pageSize)
      .skip(pageSize * page)
      .toArray();
    return reviews;
  }

  /**
 * Save a new review to the database.
 * 
 * @param {Object} newReview - The review object to be saved.
 * @returns {Promise<Object>} - The result of the insert operation.
 */
  export async function saveReview(newReview) {
    const connectiondb = await getConnection();
    const result = await connectiondb
    .db(DATABASE)
    .collection(REVIEWS)
    .insertOne(newReview);
    return result;
  }

  /**
 * Retrieve all reviews by a specific user.
 * 
 * @param {string} username - The username of the reviewer.
 * @param {number} pageSize - The maximum number of reviews to retrieve.
 * @param {number} page - The page number for pagination (0-based).
 * @returns {Promise<Array>} - An array of review objects by the specified user.
 * @throws {Error} - Throws an error if fetching reviews fails.
 */
  export async function getReviewsByUser(username, pageSize, page) {
    try {
        const connectiondb = await getConnection();
        const reviews = await connectiondb
        .db(DATABASE)
        .collection(REVIEWS)
        .find({name : username})
        .limit(pageSize)
        .skip(pageSize * page)
        .toArray()
        return reviews;
    } catch (error) {
        throw new Error('Error fetching reviews by user: ' + error.message);
    }
}

/**
 * Calculate the total number of reviews by a specific user.
 * 
 * @param {string} username - The username of the reviewer.
 * @returns {Promise<number>} - The total count of reviews by the specified user.
 */
export async function getTotalReviewsByUser(username) {
  const connectiondb = await getConnection();
  const totalReviewsCount = await connectiondb
    .db(DATABASE)
    .collection(REVIEWS)
    .countDocuments({name : username});
  return totalReviewsCount;
}

/**
 * Calculate the total number of reviews for a specific movie by its ID.
 * 
 * @param {string} id - The ID of the movie whose review count is to be calculated.
 * @returns {Promise<number>} - The total count of reviews for the specified movie.
 */
export async function getTotalReviewsByMovieId(id) {
  const connectiondb = await getConnection();
  const totalReviewsCount = await connectiondb
    .db(DATABASE)
    .collection(REVIEWS)
    .countDocuments({movie_id : new ObjectId(id)});
  return totalReviewsCount;
}
  