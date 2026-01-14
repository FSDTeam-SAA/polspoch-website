import { useMutation } from "@tanstack/react-query";
import { shippingPostApi } from "../api";
import { ShippingAddressPayload } from "../types/shipping";

interface UseShippingAddOptions {
  token: string;
}

// shipping post
export const useShippingAdd = ({ token }: UseShippingAddOptions) => {
  return useMutation({
    mutationFn: (payload: ShippingAddressPayload) => {
      if (!token) {
        throw new Error("User is not authenticated");
      }
      return shippingPostApi(payload, token);
    },

    onSuccess: (data) => {
      console.log("Shipping added successfully:", data);
    },

    onError: (error) => {
      console.error("Failed to add shipping:", error);
    },
  });
};
