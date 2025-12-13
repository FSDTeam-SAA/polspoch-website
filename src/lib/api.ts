// src/lib/api.ts

import axios from "axios";
import { UserProfilePayload } from "./types/profile";
import { ServicePayload } from "./services/createservice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Get reviews all with pagination and dynamic params
export async function getAllReview(page = 1, limit = 10) {
  try {
    const res = await api.get(`/reviews/all?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching reviewss:", err);
    throw new Error("Failed to fetch all reviews with pagination");
  }
}

// POST: Send Contact Message
export async function sendContactMessage(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}) {
  try {
    const res = await api.post("/contact/send-message", payload);
    return res.data;
  } catch (err) {
    console.error("Error sending contact message:", err);
    throw new Error("Failed to send contact message");
  }
}

// ===========================
// UPDATE USER PROFILE
// ===========================
export async function updateUserProfileAPI(
  payload: UserProfilePayload,
  accessToken: string,
) {
  if (!accessToken) throw new Error("Session expired. Please login again.");

  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && key !== "photo") {
        formData.append(key, value as string);
      }
    });

    if (payload.photo instanceof File) {
      formData.append("photo", payload.photo);
    }

    const res = await api.put("/user/update-profile", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error updating user profile:", err);
    throw new Error("Failed to update user profile");
  }
}

export async function uploadProfileImage(file: File, token: string) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.put("/user/profile-image", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string,
) => {
  try {
    const response = await api.post(
      "/auth/change-password",
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Password change failed",
    };
  }
};

// Add to src/lib/api.ts (near other exported functions)

export type GetProductsParams = {
  family?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export async function getProducts(params: GetProductsParams = {}) {
  const { family, search, page = 1, limit = 12 } = params;
  const query = new URLSearchParams();
  if (family) query.append("family", family);
  if (search) query.append("search", search);
  if (page) query.append("page", String(page));
  if (limit) query.append("limit", String(limit));

  try {
    // const res = await api.get(`/product?${query.toString()}`);
    const res = await api.get(`/product`);
    console.log("response", res);
    // API returns { success: true, data: [...], total, page, limit }
    return res?.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
}

export async function getProductById(productId: string) {
  try {
    const res = await api.get(`/product/${productId}`);
    return res?.data;
  } catch (err) {
    // console.error("Error fetching product by ID:", err);
    throw err;
  }
}

export async function createService(data: ServicePayload, token: string) {
  try {
    const res = await api.post("/service/create-service", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function addToCart(
  data: { serviceId: string; type: string },
  token: string,
) {
  try {
    const res = await api.post("/cart/add-cart", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    throw err;
  }
}
