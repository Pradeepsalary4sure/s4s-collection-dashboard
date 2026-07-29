/**
 * Auth API Service
 *
 * Handles all authentication API calls.
 * Uses the shared axios instance from api.js for base URL.
 */

import axios from "axios";

// const API_BASE_URL = "/api";

// const authApi = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 20000,
//   withCredentials: true, // send cookies
// });



const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true,
});

// ── Request Interceptor: Auto-attach Bearer token from localStorage to ALL requests ──
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Send OTP to the given email.
 * @param {string} email
 * @returns {Promise<{success: boolean, message: string, debugOtp?: string}>}
 */
export async function sendOtp(email) {
  const response = await authApi.post("/auth/send-otp", { email });
  return response.data;
}

/**
 * Verify OTP and get JWT token.
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<{success: boolean, message: string, data?: {user: object, token: string}}>}
 */
export async function verifyOtp(email, otp) {
  const response = await authApi.post("/auth/verify-otp", { email, otp });
  return response.data;
}

/**
 * Get the currently authenticated user's profile.
 * @returns {Promise<{success: boolean, data: object}>}
 */
export async function getMe() {
  const response = await authApi.get("/auth/me");
  return response.data;
}

/**
 * Logout – clear the auth cookie.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function logout() {
  const response = await authApi.post("/auth/logout");
  return response.data;
}

/**
 * Login with email and password (alternative to OTP).
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, message: string, data?: {user: object, token: string}}>}
 */
export async function loginWithPassword(email, password) {
  const response = await authApi.post("/auth/login", { email, password });
  return response.data;
}

/**
 * Set up a password for the authenticated user.
 * @param {string} password
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function setupPassword(password) {
  const response = await authApi.post("/auth/setup-password", { password });
  return response.data;
}

/**
 * ADMIN: Create a new user.
 * @param {object} data - { email, password, name?, role? }
 * @returns {Promise<{success: boolean, message: string, data?: object}>}
 */
export async function createUser(data) {
  const token = localStorage.getItem("token");
  const response = await authApi.post("/auth/users", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

/**
 * ADMIN: List all users.
 * @returns {Promise<{success: boolean, data?: Array}>}
 */
export async function listUsers() {
  const token = localStorage.getItem("token");
  const response = await authApi.get("/auth/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

/**
 * ADMIN: Delete a user.
 * @param {number} id
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteUser(id) {
  const token = localStorage.getItem("token");
  const response = await authApi.delete(`/auth/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

/**
 * ADMIN: Toggle user access (is_verified).
 * @param {number} id
 * @param {boolean} is_verified
 * @returns {Promise<{success: boolean, message: string, data?: object}>}
 */
export async function toggleAccess(id, is_verified) {
  const token = localStorage.getItem("token");
  const response = await authApi.put(`/auth/users/${id}/access`, { is_verified }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
