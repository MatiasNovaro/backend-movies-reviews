import "dotenv/config";
import { MongoClient } from "mongodb";

// Retrieve the connection string from environment variables.
const uri = process.env.MONGODB;

// Create a new instance of the MongoDB client with the URI.
const client = new MongoClient(uri);

// Initialize the connection instance to null.
let instance = null;

// Returns a new connection instance to the database.
export default async function getConnection() {
  if (instance == null) {
    try {
      // Connect to the database and set the instance.
      instance = await client.connect();
    } catch (error) {
      console.log(error.message);
    }
  }
  return instance;
}