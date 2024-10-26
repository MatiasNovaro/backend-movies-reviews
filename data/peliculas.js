import getConnection from "./conn.js";
import { ObjectId } from "mongodb";
const DATABASE = "sample_mflix";
const MOVIES = "movies";

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
export async function getMovie(id) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .findOne({_id : new ObjectId(id)})
  return movies;
}
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
export async function getTotalMoviesCount(filters) {
  const connectiondb = await getConnection();
  const totalMoviesCount = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .countDocuments(filters);
  return totalMoviesCount;
}