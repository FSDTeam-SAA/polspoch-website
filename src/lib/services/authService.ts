// src/lib/services/authService.ts
import axiosInstance from "../instance/axios-instance";

// User Registration

export const createUserRegistration = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/user/register", userData);
    return {
      success: true,
      data: response.data,
    };
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: string | any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Registration failed",
    };
  }
};

// Forgot Password
export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch {
    return {
      success: false,
      message: "Request failed",
    };
  }
};

// Verify OTP
export const verifyOtp = async (
  payload: { otp: string },
  tokenFromURL: string,
) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", payload, {
      headers: {
        _customToken: tokenFromURL,
      },
    });

    return { success: true, data: response.data };
  } catch {
    return {
      success: false,
      message: "Verification failed",
    };
  }
};

// Resend Forgot OTP
export const resendForgotOtp = async (tokenFromURL: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/resend-forgot-otp",
      {},
      {
        headers: {
          _customToken: tokenFromURL,
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch {
    return {
      success: false,
      message: "Failed to resend OTP",
    };
  }
};

// Reset Password
export const resetPassword = async (
  newPassword: string,
  tokenFromURL: string,
) => {
  try {
    const response = await axiosInstance.post(
      "/auth/reset-password",
      { newPassword },
      {
        headers: {
          _customToken: tokenFromURL,
        },
      },
    );

    return { success: true, data: response.data };
  } catch {
    return { success: false, message: "Reset password failed" };
  }
};

// Verify email OTP
export const verifyEmailOtp = async (
  payload: { otp: string },
  tokenFromURL: string,
) => {
  try {
    const response = await axiosInstance.post("/user/verify-email", payload, {
      headers: {
        _customToken: tokenFromURL,
      },
    });

    return { success: true, data: response.data };
  } catch {
    return {
      success: false,
      message: "Verification failed",
    };
  }
};

// Resend Registration OTP

export const resendRegistrationOtp = async (tokenFromURL: string) => {
  try {
    const response = await axiosInstance.post(
      "/user/resend-otp",
      {},
      {
        headers: { _customToken: tokenFromURL },
      }
    );
    return { success: true, data: response.data };
  } catch {
    return { success: false, message: "Failed to resend OTP" };
  }
};

