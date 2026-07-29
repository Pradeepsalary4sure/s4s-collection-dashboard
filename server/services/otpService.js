/**
 * OTP Service
 *
 * Generates secure 6-digit OTPs, hashes them with SHA-256,
 * sends them via email, and provides verification helpers.
 */

const crypto = require("crypto");

/**
 * Generate a cryptographically secure random 6-digit OTP.
 * @returns {string} 6-digit numeric OTP
 */
function generateOtp() {
  // Generate a random integer between 100000 and 999999
  const otp = crypto.randomInt(100000, 999999);
  return otp.toString();
}

/**
 * Hash the OTP using SHA-256 with a secret pepper.
 * The pepper prevents OTP brute-force even if DB is leaked.
 * @param {string} otp - The 6-digit OTP
 * @returns {string} Hex-encoded SHA-256 hash
 */
function hashOtp(otp) {
  const pepper = process.env.OTP_PEPPER || "s4s-otp-pepper-default";
  return crypto
    .createHash("sha256")
    .update(otp + pepper)
    .digest("hex");
}

/**
 * Build a friendly HTML email for the OTP.
 * @param {string} otp - The 6-digit OTP
 * @param {number} expiryMinutes - Minutes until OTP expires
 * @returns {object} { subject, html }
 */
function buildOtpEmail(otp, expiryMinutes = 5) {
  const subject = "Your S4S Collection Dashboard Login OTP";
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f7f6; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #f3f9f6, #e1e4e2); padding: 32px 24px; text-align: center; }
    .header h1 { color: #34d399; font-size: 22px; margin: 0; }
    .body { padding: 32px 24px; }
    .otp-box { background: #f0fdf4; border: 2px dashed #34d399; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #059669; font-family: 'Courier New', monospace; }
    .info { font-size: 13px; color: #64748b; line-height: 1.6; }
    .footer { text-align: center; padding: 20px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 S4S Collection Dashboard</h1>
    </div>
    <div class="body">
      <p style="font-size:15px;color:#1e293b;margin:0 0 8px;">Hello,</p>
      <p style="font-size:14px;color:#475569;margin:0 0 20px;">
        Use the following OTP to sign in to your dashboard.
      </p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <p class="info">
        This OTP is valid for <strong>${expiryMinutes} minutes</strong>.
        Please do not share it with anyone.
      </p>
      <p class="info">
        If you did not request this OTP, please ignore this email.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Salary 4 Sure. All rights reserved.
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}

/**
 * Send OTP email to the user.
 * @param {string} email - Recipient email
 * @param {string} otp - The 6-digit OTP
 * @returns {Promise<void>}
 */
async function sendOtpEmail(email, otp) {
  const transporter = require("../config/email");
  const { subject, html } = buildOtpEmail(otp);

  await transporter.sendMail({
    from: `"S4S Dashboard" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  });
}

/**
 * Verify a plain-text OTP against the stored hash and expiry.
 * @param {string} plainOtp - The OTP entered by the user
 * @param {string|null} storedHash - Hash from DB
 * @param {Date|null} storedExpiry - Expiry timestamp from DB
 * @returns {{ valid: boolean, reason?: string }}
 */
function verifyOtp(plainOtp, storedHash, storedExpiry) {
  // No OTP was ever requested
  if (!storedHash || !storedExpiry) {
    return { valid: false, reason: "No OTP requested" };
  }

  // OTP expired
  if (new Date() > new Date(storedExpiry)) {
    return { valid: false, reason: "OTP has expired" };
  }

  // Hash mismatch
  const hash = hashOtp(plainOtp);
  if (hash !== storedHash) {
    return { valid: false, reason: "Invalid OTP" };
  }

  return { valid: true };
}

module.exports = {
  generateOtp,
  hashOtp,
  sendOtpEmail,
  verifyOtp,
};

