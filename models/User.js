import { mongoose } from "mongoose";
import validator from "validator";
// Create a schema for user accounts
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Name must be unique across users
    trim: true, // Trim whitespace from both ends
    minlength: 3, 
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique across users
    validate: {
      // Custom validator to check if the email is valid
      validator: validator.isEmail, // Use validator package to validate email format
      message: "Please enter a valid email", // Error message if validation fails
    },
  },
  // The password for the user's account
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length for the password
  },
});

// Create the User model based on the schema
const user = mongoose.model("User", UserSchema);

export default user;
