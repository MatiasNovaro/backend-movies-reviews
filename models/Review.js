import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import DOMPurify from 'isomorphic-dompurify';

// Create the schema for a review
const ReviewSchema = new Schema({
  // The name of the reviewer
  name: {
    type: String,
    required: true
  },
  // The email of the reviewer
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Por favor ingrese un email válido'] // Basic email validation using regex
  },
  // Reference to the associated movie
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,  // ObjectId type for MongoDB reference
    ref: 'movies', // Reference to the 'movies' collection
    required: true
  },
  // The text content of the review
  text: {
    type: String,
    required: true,
    minlength: 10, // Minimum length for review text
    maxlength: 1000, // Maximum length for review text
    set: (value) => DOMPurify.sanitize(value), // Sanitize input to prevent XSS attacks
  },
  // The date the review was created
  date: {
    type: Date,
    default: Date.now // Default value is the current date and time
  }
});
// Create the Review model based on the schema
const Review = mongoose.model('Review', ReviewSchema);

export default Review;