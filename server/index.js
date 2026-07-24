require("dotenv").config({ quiet: true });

require("dotenv").config();

require("dotenv").config({ quiet: true });

console.log("PORT =", process.env.PORT);
console.log("CSV_URL =", process.env.CSV_URL);

// require("./config/db");

const express = require("express");
const cors = require("cors");

const dashboardRoutes = require("./routes/dashboardRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

const path = require("path");

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api", dashboardRoutes);

// Serve static assets from client/dist
app.use(express.static(path.join(__dirname, "../client/dist")));

// Fallback to index.html for client-side routing
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    console.info(`S4S Collection API is running at http://localhost:${port}`);
  });
}

module.exports = app;
