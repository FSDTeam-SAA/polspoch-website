// src/lib/hooks/useAuth.ts

// src/lib/hooks/useAuth.ts
"use client";

import { useState } from "react";
import {
  createUserRegistration,
  forgotPassword,
  resendForgotOtp,
  resendRegistrationOtp,
  resetPassword,
  verifyEmailOtp,
  verifyOtp,
} from "../services/authService";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    const res = await forgotPassword(email);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  // Handle OTP verification
  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    setError(null);

    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token") || "";

    if (!tokenFromURL) {
      setError("Invalid or missing token");
      setLoading(false);
      return { success: false, message: "No token found in URL" };
    }

    const res = await verifyOtp({ otp }, tokenFromURL);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  //  NEW — Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);

    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token") || "";

    if (!tokenFromURL) {
      setError("Invalid or missing token");
      setLoading(false);
      return { success: false, message: "No token found in URL" };
    }

    const res = await resendForgotOtp(tokenFromURL);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  // Reset Password hook
  const handleResetPassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token") || "";

    if (!tokenFromURL) {
      setError("Invalid or missing token");
      setLoading(false);
      return { success: false, message: "No token found in URL" };
    }

    const res = await resetPassword(newPassword, tokenFromURL);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };


   // -----------------------
  // NEW: Signup handler
  // -----------------------
// const handleSignup = async (userData: {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }) => {
//   setLoading(true);
//   setError(null);

//   try {
//     const res = await createUserRegistration(userData);
//     if (res.success) {
//       setResult(res.data);

//       // REDIRECT to verify email page with token
//       const token = res.data.token; // make sure backend returns this
//       window.location.href = `/verify-email?token=${encodeURIComponent(token)}`;
//     } else {
//       setError(res.message || "Signup failed");
//     }
//     return res;
//     //eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     setError(err?.message || "Signup failed");
//     return { success: false, message: err?.message || "Signup failed" };
//   } finally {
//     setLoading(false);
//   }
// };
const handleSignup = async (userData: { firstName: string; lastName: string; email: string; password: string; }) => {
  setLoading(true);
  setError(null);

  try {
    const res = await createUserRegistration(userData);
    if (res.success) {
      setResult(res.data);

      // Use accessToken as verification token
      const token = res.data?.data?.accessToken;

      if (!token) {
        setError("Verification token missing");
        return { success: false, message: "Token missing" };
      }

      // Redirect to verify email
      window.location.href = `/verify-email?token=${encodeURIComponent(token)}`;
    } else {
      setError(res.message || "Signup failed");
    }

    return res;
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err || "Signup failed");
    setError(msg || "Signup failed");
    return { success: false, message: msg || "Signup failed" };
  } finally {
    setLoading(false);
  }
};




    // Handle Email OTP verification
  const handleEmailVerifyOtp = async (otp: string) => {
    setLoading(true);
    setError(null);

    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token") || "";

    if (!tokenFromURL) {
      setError("Invalid or missing token");
      setLoading(false);
      return { success: false, message: "No token found in URL" };
    }

    const res = await verifyEmailOtp({ otp }, tokenFromURL);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

//  NEW — Resend Email OTP

  const handleResendEmailOtp = async () => {
  setLoading(true);
  setError(null);

  const tokenFromURL = new URLSearchParams(window.location.search).get("token") || "";

  if (!tokenFromURL) {
    setError("Invalid or missing token");
    setLoading(false);
    return { success: false, message: "No token found in URL" };
  }

  const res = await resendRegistrationOtp(tokenFromURL);

  if (res.success) setResult(res.data);
  else setError(res.message || "Failed to resend OTP");

  setLoading(false);
  return res;
};


  return {
    loading,
    result,
    error,
    handleVerifyOtp,
    handleForgotPassword,
    handleResendOtp,
    handleResetPassword,
    handleSignup,
    handleEmailVerifyOtp,
    handleResendEmailOtp
  };
}
