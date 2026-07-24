function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, _next) {
  const statusCode = Number(error.statusCode) || 500;

  // Console में पूरा Error दिखाओ
  console.error("\n========== API ERROR ==========");
  console.error("URL:", req.originalUrl);
  console.error("Method:", req.method);
  console.error("Status:", statusCode);
  console.error("Message:", error.message);
  console.error("Stack:");
  console.error(error.stack);

  if (error.cause) {
    console.error("\nCause:");
    console.error(error.cause);
  }

  console.error("================================\n");

  res.status(statusCode).json({
    success: false,
    message: error.message,
    statusCode,
    stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
  });
}

module.exports = { errorHandler, notFoundHandler };