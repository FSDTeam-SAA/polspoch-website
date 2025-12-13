// src/lib/hooks/useAddToCart.ts

import { useMutation } from "@tanstack/react-query";
import { addToCart } from "../api";

interface UseAddToCartOptions {
  token: string;
}

interface AddToCartPayload {
  serviceId: string;
  type: string;
}

export const useAddToCart = ({ token }: UseAddToCartOptions) => {
  return useMutation({
    mutationFn: (data: AddToCartPayload) => addToCart(data, token),

    onSuccess: (data) => {
      console.log("Item added to cart successfully:", data);
    },

    onError: (error) => {
      console.error("Failed to add item to cart:", error);
    },
  });
};
