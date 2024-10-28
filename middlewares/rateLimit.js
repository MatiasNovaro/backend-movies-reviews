import rateLimit from "express-rate-limit";

// Rate limiting middleware for login attempts
const loginLimiter = rateLimit({
  // Set the time window for rate limiting to 15 minutes
  windowMs: 15 * 60 * 1000, 
  // Limit each IP address to a maximum of 5 requests per time window
  max: 5, 
  // Custom message to be returned when the limit is exceeded
  message: "Too many login attempts from this IP, please try again later.",
});

// Rate limiting middleware for review submissions
const reviewLimiter = rateLimit({
  // Set the time window for rate limiting to 1 hour
  windowMs: 60 * 60 * 1000,
  // Limit each IP address to a maximum of 15 requests per time window
  max: 15, 
  // Custom message to be returned when the limit is exceeded
  message: "Too many reviews submitted from this IP, please try again later.",
});

export { loginLimiter, reviewLimiter };
