/**
 * Login Page
 *
 * Two authentication modes:
 *   Mode 1: Email OTP flow (Step 1: Email → Step 2: OTP)
 *   Mode 2: Email + Password login
 *
 * Includes:
 *   - Toggle between OTP and Password login
 *   - 30-second resend countdown timer
 *   - 5-minute OTP expiry notice
 *   - Loading states, error handling, responsive design
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Mail, Lock, ArrowRight, ArrowLeft, RefreshCw, LogIn, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendOtp, verifyOtp, loginWithPassword } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  // ── Auth Mode ──
  const [authMode, setAuthMode] = useState("otp"); // "otp" | "password"

  // ── State ──
  const [step, setStep] = useState("email"); // "email" | "otp" (only for OTP mode)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [debugOtp, setDebugOtp] = useState("");

  const otpRefs = useRef([]);

  // ── Resend timer ──
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // ── Toggle Auth Mode ──
  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "otp" ? "password" : "otp"));
    setError("");
    setStep("email");
    setOtp(["", "", "", "", "", ""]);
    setPassword("");
  };

  // ── Send OTP ──
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await sendOtp(email.trim());
      if (response.success) {
        setStep("otp");
        setResendCountdown(30);
        if (response.debugOtp) {
          setDebugOtp(response.debugOtp);
        }
      } else {
        setError(response.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await sendOtp(email.trim());
      if (response.success) {
        setResendCountdown(30);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        if (response.debugOtp) {
          setDebugOtp(response.debugOtp);
        }
      } else {
        setError(response.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not resend OTP."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handlers ──
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Backspace → go to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    // Enter → submit
    if (e.key === "Enter") {
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  // ── Verify OTP ──
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOtp(email.trim(), otpString);
      if (response.success) {
        login(response.data.user, response.data.token);
      } else {
        setError(response.message || "OTP verification failed.");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP verification failed. Please try again."
      );
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // ── Login with Password ──
  const handlePasswordLogin = async (e) => {
    e?.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await loginWithPassword(email.trim(), password);
      if (response.success) {
        login(response.data.user, response.data.token);
      } else {
        setError(response.message || "Login failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Go back to email step ──
  const handleBack = () => {
    setStep("email");
    setError("");
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafcfa] relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #34d399 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/30">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              S4S Collection Dashboard
            </h1>
            <p className="text-sm text-[#7a8a80]">
              {authMode === "otp"
                ? step === "email"
                  ? "Sign in with your email to continue"
                  : `Enter the OTP sent to ${email}`
                : "Sign in with your email and password"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ── OTP MODE ── */}
            {authMode === "otp" && (
              <motion.div
                key="otp-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {step === "email" ? (
                  /* Step 1: Email (OTP mode) */
                  <motion.form
                    key="email-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSendOtp}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#8a9b90]">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e4ede6]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#fafcfa] border border-[#fafcfa] text-white placeholder-[#fafcfa] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                          autoFocus
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-medium text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm hover:from-emerald-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  /* Step 2: OTP Input */
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    {/* OTP Input Boxes */}
                    <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-11 h-14 text-center text-xl font-bold text-white bg-[#1a221e] border border-[#25312a] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:opacity-50"
                          disabled={isLoading}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>

                    {/* Debug OTP (dev only) */}
                    {debugOtp && (
                      <p className="text-center text-xs text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg">
                        🔧 Dev OTP: <span className="font-mono font-bold">{debugOtp}</span>
                      </p>
                    )}

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-medium text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg text-center"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.join("").length !== 6}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm hover:from-emerald-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Sign In
                          <Lock className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Resend & Back */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleBack}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#fafcfa] hover:text-white transition-colors disabled:opacity-50"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Change Email
                      </button>

                      <button
                        onClick={handleResendOtp}
                        disabled={isLoading || resendCountdown > 0}
                        className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors disabled:text-#fafcfa] disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${resendCountdown > 0 ? 'animate-spin' : ''}`} />
                        {resendCountdown > 0
                          ? `Resend in ${resendCountdown}s`
                          : "Resend OTP"}
                      </button>
                    </div>

                    {/* OTP Expiry Notice */}
                    <p className="text-center text-[10px] text-[##e4ede6]">
                      OTP is valid for 5 minutes. Please check your inbox (and spam folder).
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── PASSWORD MODE ── */}
            {authMode === "password" && (
              <motion.form
                key="password-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePasswordLogin}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#fafcfa]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fafcfa]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#fafcfa] border border-[#fafcfa] text-white placeholder-[#fafcfa] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      autoFocus
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#8a9b90]">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[##e4ede6]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#fafcfa] border border-[#25312a] text-white placeholder-[##e4ede6] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#fafcfa6] hover:text-white transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm hover:from-emerald-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <Lock className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Toggle between OTP and Password mode */}
          <div className="mt-6 pt-4 border-t border-[#fafcfa]">
            <button
              onClick={toggleAuthMode}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[#fafcfa] hover:text-emerald-400 transition-colors"
            >
              {authMode === "otp" ? (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  Sign in with Password instead
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  Sign in with OTP instead
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-[10px] text-[##e4ede6]">
          &copy; {new Date().getFullYear()} Salary 4 Sure. All rights reserved.
        </p>
      </motion.div>
    </div>  
  );
}

