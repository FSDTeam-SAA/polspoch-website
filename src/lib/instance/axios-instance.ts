// axios-instance.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { getOrCreateGuestId } from "../guestId";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  // No withCredentials here to avoid stale cookie issues with tokens
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // 1) If Authorization header is already set (manually passed), don't overwrite it
      if (config.headers.Authorization) {
        return config;
      }

      // 2) If verify-otp gives custom token → use that instead
      if (config.headers?._customToken) {
        config.headers.Authorization = `Bearer ${config.headers._customToken}`;
        delete config.headers._customToken;
        return config;
      }

      // 3) Fallback to NextAuth session
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      } else {
        // 4) If no session, add Guest ID header
        const guestId = getOrCreateGuestId();
        if (guestId) {
          config.headers["x-guest-id"] = guestId;
        }
      }
    } catch (error) {
      console.error(
        "Failed to get session in axiosInstance interceptor:",
        error,
      );
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
