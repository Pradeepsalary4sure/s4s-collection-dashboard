/**
 * JWT Authentication Middleware
 *
 * Protects routes by verifying the JWT from cookies
 * or Authorization header. Sets req.user on success.
 */

const { verifyToken } = require("../services/jwtService");

/**
 * Middleware: require valid JWT to access route.
 */
function authenticate(req, res, next) {
  // 1. Try cookie first (more secure, prevents XSS)
  let token = req.cookies?.token;

  // 2. Fallback: Authorization header (Bearer token)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  // 3. No token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  // 4. Verify token
  const result = verifyToken(token);
  if (!result.valid) {
    return res.status(401).json({
      success: false,
      message: result.error || "Invalid token",
    });
  }

  // 5. Attach user info to request
  req.user = result.decoded;
  next();
}

/**
 * Middleware: optionally attach user if token exists,
 * but don't block if missing (for public routes).
 */
function optionalAuth(req, res, next) {
  const token = req.cookies?.token;

  if (token) {
    const result = verifyToken(token);
    if (result.valid) {
      req.user = result.decoded;
    }
  }

  next();
}

module.exports = { authenticate, optionalAuth };

