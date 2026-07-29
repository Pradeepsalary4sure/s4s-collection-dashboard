/**
 * JWT Service
 *
 * Handles signing and verifying JSON Web Tokens
 * for authenticated users.
 */

const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "s4s-jwt-secret-change-in-production";
const EXPIRY = process.env.JWT_EXPIRY || "7d";

/**
 * Sign a JWT for the given user.
 * @param {object} payload - Data to embed in the token
 * @param {string} payload.id - User ID
 * @param {string} payload.email - User email
 * @returns {string} Signed JWT
 */
function signToken(payload) {
  return jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role || "user" },
    SECRET,
    { expiresIn: EXPIRY }
  );
}

/**
 * Verify and decode a JWT.
 * @param {string} token - The JWT string
 * @returns {{ valid: boolean, decoded?: object, error?: string }}
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return { valid: true, decoded };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { valid: false, error: "Token has expired" };
    }
    return { valid: false, error: "Invalid token" };
  }
}

module.exports = { signToken, verifyToken };

