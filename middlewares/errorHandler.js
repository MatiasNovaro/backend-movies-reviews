/**
 * Centralized error handling middleware for the application.
 *
 * This middleware catches errors from other middleware and route handlers,
 * logs the error stack to the console, and sends a standardized JSON response
 * to the client with the error message and HTTP status code.
 * 
 * @param {Object} err - The error object thrown in the application.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack (not used here).
 */
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
  