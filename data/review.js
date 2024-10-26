import getConnection from "./conn.js";
import { ObjectId } from "mongodb";
const DATABASE = "sample_mflix";
const REVIEWS = "comments";

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
  export async function saveReview(newReview) {
    const connectiondb = await getConnection();
    const result = await connectiondb
    .db(DATABASE)
    .collection(REVIEWS)
    .insertOne(newReview);
    return result;
  }

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
export async function getTotalReviewsByUser(username) {
  const connectiondb = await getConnection();
  const totalReviewsCount = await connectiondb
    .db(DATABASE)
    .collection(REVIEWS)
    .countDocuments({name : username});
  return totalReviewsCount;
}
export async function getTotalReviewsByMovieId(id) {
  const connectiondb = await getConnection();
  const totalReviewsCount = await connectiondb
    .db(DATABASE)
    .collection(REVIEWS)
    .countDocuments({movie_id : new ObjectId(id)});
  return totalReviewsCount;
}
  