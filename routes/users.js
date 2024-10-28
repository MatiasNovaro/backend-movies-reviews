import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getUser, createUser } from "../data/users.js";
import { loginLimiter } from "../middlewares/rateLimit.js";
import { registerValidation, loginValidation } from "../middlewares/validators.js";
import { validationResult } from "express-validator";
// Create a new Express router instance
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @param {object} req.body - User data
 * @param {string} req.body.name - The username for the new user
 * @param {string} req.body.email - The email address for the new user
 * @param {string} req.body.password - The password for the new user
 * @access Public
 * @middleware registerValidation - Middleware to validate registration data
 */
router.post("/register", registerValidation, async (req, res, next) => {
  // Validate the request body using the validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Destructure user data from request body
    const { name, email, password } = req.body;
    let user = await getUser(name); // Check if the user already exists by username
    // If user already exists, return an error
    if (user) {
      const error = new Error("El usuario ya existe");
      error.status = 400;
      // Pass the error to the next middleware (error handler)
      next(error);
    }

    // Create a new User instance with the provided data
    user = new User({ name, email, password });

    // Hash the user's password before saving it
    const salt = await bcrypt.genSalt(10); // Generate a salt
    user.password = await bcrypt.hash(password, salt);

    // Save the newly created user to the database
    const createdUser = await createUser(user);

    // Create the payload for the JWT
    const payload = {
      user: {
        name: createdUser.name,
        email: createdUser.email,
      },
    };
    // Sign a JWT token with the payload and a secret key, set to expire in 1 hour
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the generated token
    res.json({ token });
  } catch (err) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(err);
  }
});

/**
 * @route POST /api/auth/login
 * @description Log in a user
 * @param {object} req.body - User credentials
 * @param {string} req.body.name - The username of the user
 * @param {string} req.body.password - The password of the user
 * @access Public
 * @middleware loginLimiter - Middleware to limit login attempts
 * @middleware loginValidation - Middleware to validate login data
 */
router.post("/login", loginLimiter, loginValidation, async (req, res, next) => {
  // Validate the request body using the validationResult
  const errors = validationResult(req);

  // Return validation errors if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Destructure username and password from request body
    const { name, password } = req.body;
    // Fetch the user by username
    let user = await getUser(name);

    // If user does not exist, return an error
    if (!user) {
      const error = new Error("El inexistente");
      error.status = 400;
      // Pass the error to the next middleware (error handler)
      return next(error);
    }

    // Compare provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Credenciales incorrectas");
      error.status = 400;
      // Pass the error to the next middleware (error handler)
      return next(error);
    }

    // Create the payload for the JWT
    const payload = {
      user: {
        name: user.name,
        email: user.email,
      },
    };
    // Sign a JWT token with the payload and a secret key, set to expire in 1 hour
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the generated token
    res.json({ token });
  } catch (err) {
    // If an error occurs, pass it to the next middleware (error handler)
    next(err);
  }
});

export default router;
