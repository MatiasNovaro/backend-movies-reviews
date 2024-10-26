import getConnection from "./conn.js";
const DATABASE = "sample_mflix";
const USERS = "users";

export async function getUser(name) {
    const connectiondb = await getConnection();
    let user = await connectiondb
    .db(DATABASE)
    .collection(USERS)
    .findOne({ name: name }) 
    return user;
}

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