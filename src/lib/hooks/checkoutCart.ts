// src/lib/hooks/useAddToCart.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutCart, checkoutCartInModal } from "../api";

// checkout cart
interface CheckoutPayload {
  type: string;
  cartItems: { cartId: string }[];
  totalAmount: number;
}

export const useCheckoutCart = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => checkoutCart(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkout-cart"] });
    },
  });
};

// checkout cart in modal
interface CheckoutModalPayload {
  orderId: string;
  totalAmount: number;
}

export const useCheckoutCartInModal = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutModalPayload) =>
      checkoutCartInModal(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkout-cart-in-modal"] });
    },
  });
};
