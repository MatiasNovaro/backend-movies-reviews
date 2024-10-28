import { body } from 'express-validator';

// Validation rules for user registration
export const registerValidation = [
  // Validate the 'name' field
  body('name')  
    .notEmpty() // Check that the name is not empty
    .withMessage('Name is required') // Custom error message if empty
    .trim() // Trim whitespace from both ends of the name
    .escape(), // Escape HTML characters to prevent XSS attacks

  // Validate the 'email' field
  body('email') 
    .isEmail() // Check that the email format is valid
    .withMessage('Invalid email') // Custom error message if invalid
    .normalizeEmail(), // Normalize the email (lowercase, etc.) for consistency

  // Validate the 'password' field
  body('password')
    .isLength({ min: 6 }) // Check that the password is at least 6 characters long
    .withMessage('Password must be at least 6 characters long') // Custom error message if too short
    .trim(), // Trim whitespace from both ends of the password
];

// Validation rules for user login
export const loginValidation = [
  // Validate the 'name' field
  body('name')
    .notEmpty() // Check that the name is not empty
    .withMessage('Name is required') // Custom error message if empty
    .trim() // Trim whitespace from both ends of the name
    .escape(), // Escape HTML characters to prevent XSS attacks
  // Validate the 'password' field
  body('password') 
    .notEmpty() // Check that the password is not empty
    .withMessage('Password is required') // Custom error message if empty
    .trim(), // Trim whitespace from both ends of the password
];
