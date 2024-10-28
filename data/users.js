import getConnection from "./conn.js";

// Constants for database and collection names.
const DATABASE = process.env.DATABASE;
const USERS = process.env.USERS_COLLECTION;

/**
 * Retrieve a user by their name from the database.
 * 
 * @param {string} name - The name of the user to retrieve.
 * @returns {Promise<Object|null>} - The user object if found, or null if not found.
 */
export async function getUser(name) {
    const connectiondb = await getConnection();
    let user = await connectiondb
    .db(DATABASE)
    .collection(USERS)
    .findOne({ name: name }) 
    return user;
}
/**
 * Create a new user in the database.
 * 
 * @param {Object} userData - The data of the user to be created.
 * @returns {Promise<Object>} - The created user object from the database.
 */
export async function createUser(userData) {
    const connectiondb = await getConnection();
    const result = await connectiondb
        .db(DATABASE)
        .collection(USERS)
        .insertOne(userData);
    const createdUser = await connectiondb
        .db(DATABASE)
        .collection(USERS)
        .findOne({ _id: result.insertedId });
    return createdUser;
}