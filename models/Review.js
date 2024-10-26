import mongoose from 'mongoose';
import { Schema } from 'mongoose';

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
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', ReviewSchema);

export default Review;