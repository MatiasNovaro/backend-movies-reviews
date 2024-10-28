import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate users based on JWT provided in the Authorization header.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 */
export default function auth (req, res, next) {

 // Check if the 'Authorization' header is present in the request
 const authHeader = req.headers['authorization'];

 // If no authorization header is found, respond with 401 Unauthorized
 if (!authHeader) {
  return next({ status: 401, message: 'Access Denied.' });
 }

 // Extract the token from the header. The expected format is "Bearer <token>"
 const token = authHeader.split(' ')[1];

 // If no token is found, respond with 401 Unauthorized
 if (!token) {
  return next({ status: 401, message: 'Access Denied.' });
 }

 // Verify the token using the secret from environment variables
 jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
   if (err) {
    // If the token is invalid or expired, respond with 403 Forbidden
    return next({ status: 403, message: 'Access Denied.' });
   }
   
   // Store the authenticated user information in the request object for downstream use
   req.user = user;
   next();  // Proceed to the next middleware or route handler
 });
};