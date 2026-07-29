/**
 * Nodemailer Transporter
 *
 * Uses Gmail SMTP — requires a Gmail App Password.
 * Set these in your .env file:
 *   EMAIL_USER=your-email@gmail.com
 *   EMAIL_PASS=your-16-char-app-password
 *
 * If credentials are missing, falls back to console logging
 * so the app doesn't crash during development.
 */

const nodemailer = require("nodemailer");

const hasEmailCreds = process.env.EMAIL_USER && process.env.EMAIL_PASS;

let transporter = null;

if (hasEmailCreds) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection on startup (non-blocking)
  transporter.verify().then(() => {
    console.log("✅ Email transporter is ready");
  }).catch((err) => {
    console.warn("⚠️  Email transporter not ready:", err.message);
  });
} else {
  console.warn("⚠️  EMAIL_USER/EMAIL_PASS not set. Emails will be logged to console.");
}

/**
 * Send mail – falls back to console log if no transporter.
 */
async function sendMail(options) {
  if (transporter) {
    return transporter.sendMail(options);
  }
  // Fallback: log to console
  console.log("\n========== 📧 EMAIL (DEV FALLBACK) ==========");
  console.log("To:", options.to);
  console.log("Subject:", options.subject);
  // Extract OTP from HTML
  const otpMatch = options.html && options.html.match(/otp-code["']?>([^<]+)<\/div>/);
  if (otpMatch) {
    console.log("OTP:", otpMatch[1].trim());
  }
  console.log("============================================\n");
  return { messageId: `dev-${Date.now()}` };
}

// Override sendMail on transporter or export our own
if (transporter) {
  module.exports = transporter;
} else {
  module.exports = { sendMail };
}

