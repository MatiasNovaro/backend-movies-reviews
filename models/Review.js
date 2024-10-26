import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import DOMPurify from 'isomorphic-dompurify';
// Crear el esquema para el comentario
const ReviewSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Por favor ingrese un email válido'] // Validación básica de email
  },
  movie_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'movies',
    required: true
  },
  text: {
    type: String,
    required: true,
    minlength: 10, // Minimum length for review text
    maxlength: 1000, // Maximum length for review text
    set: (value) => DOMPurify.sanitize(value),
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', ReviewSchema);

export default Review;