/**
 * Authentication Routes
 *
 * Prefix: /api/auth
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

// ── INITIALIZATION (First-time setup only) ──
router.post("/init-admin", controller.initializeFirstAdmin);

// ── Public Routes ──
router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);
router.post("/login", controller.loginWithPassword);
router.post("/logout", controller.logout);

// ── Protected Routes ──
router.get("/me", authenticate, controller.getMe);
router.post("/setup-password", authenticate, controller.setupPassword);

// ── Admin Routes ──
router.get("/users", authenticate, controller.listUsers);
router.post("/users", authenticate, controller.createUser);
router.put("/users/:id/access", authenticate, controller.toggleAccess);
router.delete("/users/:id", authenticate, controller.deleteUser);

module.exports = router;