/**
 * Auth Controller
 *
 * Handles:
 *   POST /api/auth/send-otp  – Send OTP to email
 *   POST /api/auth/verify-otp – Verify OTP & return JWT
 *   GET  /api/auth/me        – Get current user profile
 *   POST /api/auth/logout    – Clear auth cookie
 *   POST /api/auth/init-admin – Initialize first admin user
 */

const prisma = require("../config/prisma");
const otpService = require("../services/otpService");
const { signToken } = require("../services/jwtService");
const bcrypt = require("bcryptjs");

// ──────────────────────────────────────────────
// 0. INITIALIZE FIRST ADMIN
// ──────────────────────────────────────────────
async function initializeFirstAdmin(req, res, next) {
  try {
    const { email, password, setupKey } = req.body;

    // Check if setup key matches
    const SETUP_KEY = process.env.SETUP_KEY || "setup-secret-key-123";
    if (setupKey !== SETUP_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid setup key.",
      });
    }

    // Check if any admin already exists
    const adminExists = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin user already exists. This endpoint can only be used for initial setup.",
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create first admin user (auto-verified)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: "Admin",
        password: hashedPassword,
        role: "admin",
        is_verified: true, // Auto-verified for first admin
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`✅ First admin user created: ${normalizedEmail}`);

    return res.status(201).json({
      success: true,
      message: "First admin user created successfully. You can now login and create other users.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 1. SEND OTP
// ──────────────────────────────────────────────
async function sendOtp(req, res, next) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Only allow OTP for pre-registered users (created by admin)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "This email is not registered. Please contact admin to get access.",
      });
    }

    // Check if user has been granted access by admin
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Your account has not been approved yet. Please contact admin to grant access.",
      });
    }

    // Generate and hash OTP
    const otp = otpService.generateOtp();
    const otpHash = otpService.hashOtp(otp);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: otpHash, otpExpiry },
    });

    // Send OTP via email
    await otpService.sendOtpEmail(normalizedEmail, otp);

    console.log(`✅ OTP sent to ${normalizedEmail}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
      // In production, remove this. Only for development/testing:
      debugOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 2. VERIFY OTP
// ──────────────────────────────────────────────
async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = String(otp).trim();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No OTP was requested for this email.",
      });
    }

    // Verify OTP
    const result = otpService.verifyOtp(normalizedOtp, user.otp, user.otpExpiry);

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: result.reason || "OTP verification failed.",
      });
    }

    // Clear OTP fields (one-time use)
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null },
    });

    // Generate JWT with role
    const token = signToken({ id: user.id, email: user.email, role: user.role || "user" });

    // Set HTTP-only cookie (secure in production)
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
        },
        token, // also return in body for mobile/API clients
      },
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 3. GET CURRENT USER
// ──────────────────────────────────────────────
async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 4. LOGOUT
// ──────────────────────────────────────────────
async function logout(req, res) {
  // Clear the cookie
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}

// ──────────────────────────────────────────────
// 5. LOGIN WITH PASSWORD (Alternative to OTP)
// ──────────────────────────────────────────────
async function loginWithPassword(req, res, next) {
  try {
    const { email, password } = req.body;

    console.log(`[Auth] Login attempt: email="${email}"`);

    // Validate inputs
    if (!email || !password) {
      console.warn(`[Auth] Login failed: missing email or password`);
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log(`[Auth] Normalized email: "${normalizedEmail}"`);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.warn(`[Auth] Login failed: user not found for "${normalizedEmail}"`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    console.log(`[Auth] User found: id=${user.id}, email=${user.email}, role=${user.role}, hasPassword=${!!user.password}, is_verified=${user.is_verified}`);

    // Check if user has a password set
    if (!user.password) {
      console.warn(`[Auth] Login failed: no password set for user "${normalizedEmail}"`);
      return res.status(401).json({
        success: false,
        message: "Password not set. Please use OTP login or set up a password.",
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`[Auth] Password comparison: ${isValid ? 'MATCH ✓' : 'NO MATCH ✗'}`);
    
    if (!isValid) {
      console.warn(`[Auth] Login failed: invalid password for "${normalizedEmail}"`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT with role
    const token = signToken({ id: user.id, email: user.email, role: user.role || "user" });

    // Set HTTP-only cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 6. SET UP PASSWORD (After OTP verification)
// ──────────────────────────────────────────────
async function setupPassword(req, res, next) {
  try {
    const { password } = req.body;
    const userId = req.user.id; // from auth middleware

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      success: true,
      message: "Password set up successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 7. ADMIN: CREATE USER
// ──────────────────────────────────────────────
async function createUser(req, res, next) {
  try {
    const { email, password, name, role } = req.body;

    // Only admins can create users
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create users.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Hash password only if provided (otherwise user logs in via OTP only)
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || null,
        password: hashedPassword,
        role: role || "user",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 8. ADMIN: LIST USERS
// ──────────────────────────────────────────────
async function listUsers(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view users.",
      });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_verified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 9. ADMIN: DELETE USER
// ──────────────────────────────────────────────
async function deleteUser(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete users.",
      });
    }

    const { id } = req.params;

    // Prevent deleting yourself
    if (Number(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// 10. ADMIN: TOGGLE USER ACCESS (is_verified)
// ──────────────────────────────────────────────
async function toggleAccess(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can toggle user access.",
      });
    }

    const { id } = req.params;
    const { is_verified } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { is_verified },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_verified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Access ${is_verified ? "granted" : "revoked"} for ${user.email}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  initializeFirstAdmin, 
  sendOtp, 
  verifyOtp, 
  getMe, 
  logout, 
  loginWithPassword, 
  setupPassword, 
  createUser, 
  listUsers, 
  deleteUser, 
  toggleAccess 
};