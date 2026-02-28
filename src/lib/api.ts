// src/lib/api.ts

import axiosInstance from "./instance/axios-instance";
import { UserProfilePayload } from "./types/profile";
import { ServicePayload } from "./services/createservice";
import { ShippingAddressPayload } from "./types/shipping";

const api = axiosInstance;

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
  let { family } = params;
  const { search, limit } = params;
  const query = new URLSearchParams();
  // if (page) query.append("page", String(page));
  if (limit) query.append("limit", String(limit));

  if (family) {
    // If family contains a slug format (slug-id), extract just the 24-char hex ID
    const parts = family.split("-");
    const last = parts.at(-1) ?? "";
    const isObjectId = /^[a-f0-9]{24}$/i.test(last);
    family = isObjectId ? last : family;

    query.append("family", family);
  }

  if (search) query.append("search", search);

  try {
    const res = await api.get(`/product?${query.toString()}`);
    // console.log("response", res);
    // API returns { success: true, data: [...], total, page, limit }
    return res?.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
}

export async function getProductById(productId: string) {
  // If the productId contains a slug format (slug-id), extract just the 24-char hex ID
  const parts = productId.split("-");
  const last = parts.at(-1) ?? "";
  const isObjectId = /^[a-f0-9]{24}$/i.test(last);
  const id = isObjectId ? last : productId;

  try {
    const res = await api.get(`/product/${id}`);
    return res?.data;
  } catch (err) {
    // console.error("Error fetching product by ID:", err);
    throw err;
  }
}

export async function createService(data: ServicePayload, token?: string) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await api.post("/service/create-service", data, { headers });
    return res.data;
  } catch (err) {
    throw err;
  }
}

// add to cart
export interface AddToCartPayload {
  productId?: string;
  serviceId?: string;
  type: string;
  product?: {
    productId: string;
    featuredId?: string;
    size?: number;
    unitSize?: number;
    range?: number;
  };
  quantity?: number;
  reference?: string;
  thickness?: number | null;
  size1?: number | null;
  size2?: number | null;
  finish?: string | null;
  lengthMm?: number;
  price?: number;
  shippingMethod?: string;
  totalAmount?: number;
  userId?: string;
  guestId?: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties if necessary
}

export async function addToCart(data: AddToCartPayload, token?: string) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await api.post("/cart/add-cart", data, { headers });
    return res.data;
  } catch (err) {
    throw err;
  }
}

// get cart
export async function getCart(token?: string) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await api.get("/cart/my-cart", { headers });
    return res.data;
  } catch (err) {
    throw err;
  }
}

// delete cart
export async function deleteCart(token?: string, id?: string) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await api.delete(`/cart/delete-cart/${id}`, { headers });
    return res.data;
  } catch (err) {
    throw err;
  }
}
// order create
export async function checkoutCart(
  payload: {
    type: string;
    cartItems: { cartId: string }[];
    totalAmount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  },
  token?: string,
) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await api.post("/order/create-order", payload, { headers });
    return res.data;
  } catch (err) {
    throw err;
  }
}

// checkout cart in modal
export async function checkoutCartInModal(
  payload: {
    orderId: string;
    totalAmount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  },
  token?: string,
) {
  try {
    const res = await api.post("/payment/pay", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    throw err;
  }
}
// get my orders
export async function getMyOrders(token?: string, page = 1, limit = 10) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await api.get(`/order/my-orders?page=${page}&limit=${limit}`, {
      headers,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
}

// Get Rebar Templates
export async function getRebarTemplates() {
  try {
    const res = await api.get("/rebar/templates");
    return res.data;
  } catch (err) {
    console.error("Error fetching rebar templates:", err);
    throw new Error("Failed to fetch rebar templates");
  }
}

//Get Bending Templates
export async function getBendingTemplates() {
  try {
    const res = await api.get("/bending/bending-templates");
    return res.data;
  } catch (err) {
    console.error("Error fetching bending templates:", err);
    throw new Error("Failed to fetch bending templates");
  }
}

//Get Cutting Templates
export async function getCuttingTemplates() {
  try {
    const res = await api.get("/cutting");
    return res.data;
  } catch (err) {
    console.error("Error fetching cutting templates:", err);
    throw new Error("Failed to fetch cutting templates");
  }
}

//Get all family
export async function getAllFamily() {
  try {
    const res = await api.get("/product/family/all");
    return res.data;
  } catch (err) {
    console.error("Error fetching all family:", err);
    throw new Error("Failed to fetch all family");
  }
}

//shipping post api
export async function shippingPostApi(
  payload: ShippingAddressPayload,
  token?: string,
) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await api.post("/shipping-address/create", payload, {
      headers,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching shipping:", err);
    throw new Error("Failed to fetch shipping");
  }
}
// Merge Cart
export async function mergeCart(guestId: string, token: string) {
  try {
    const res = await api.post(
      "/cart/merge-cart",
      { guestId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (err) {
    console.error("Error merging cart:", err);
    throw err;
  }
}

// get advanced shipping policies (Courier/Truck)
export async function getAdvancedShippingPolicies() {
  try {
    const res = await api.get("/shippingPolicy/all");
    return res.data;
  } catch (err) {
    console.error("Error fetching advanced shipping policies:", err);
    throw new Error("Failed to fetch advanced shipping policies");
  }
}


// shipping price for the product 
// shippingPolicy/calculate-product

export async function getShippingPrice(payload: { totalWeight: number; maxDimension: number }) {
  try {
    const res = await api.post("/shippingPolicy/calculate-product", payload);
    return res.data;
  } catch (err) {
    console.error("Error fetching shipping price:", err);
    throw new Error("Failed to fetch shipping price");
  }
}
