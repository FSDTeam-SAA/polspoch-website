"use client";
import { Trash2 } from "lucide-react";
import { useDeleteCart, useGetCart } from "@/lib/hooks/useAddToCart";
import { useSession } from "next-auth/react";
import {
  useCheckoutCart,
  useCheckoutCartInModal,
} from "@/lib/hooks/checkoutCart";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CartItem } from "@/lib/types/cart";

const CartProducts = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  // 1. Create Order Mutation
  const { mutate: checkoutCart } = useCheckoutCart({ token });

  // 2. Payment Modal Mutation
  const { mutate: checkoutInModal } = useCheckoutCartInModal({ token });

  const { data: cart } = useGetCart({ token }) as {
    data: { data: CartItem[] } | undefined;
  };

  const { mutate: deleteCartItem } = useDeleteCart({ token });

  const cartItems = cart?.data || [];

  const handleDelete = (id: string) => {
    deleteCartItem(id);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const itemTotal =
      item.totalAmount ||
      (item.serviceId?.price || item.price || 0) * item.quantity;
    return acc + itemTotal;
  }, 0);
  const shippingFee = 0; // Fixed for now or 0
  const total = subtotal + shippingFee;

  // Handle Checkout (Create Order)
  const handleCheckout = () => {
    const payload = {
      type: "cart",
      cartItems: cartItems.map((item) => ({
        cartId: item._id,
      })),
      totalAmount: total,
    };

    checkoutCart(payload, {
      onSuccess: (data: { data?: { _id: string }; _id?: string }) => {
        // Assuming the response data contains the order ID in `data.data._id` or similar
        // Adjust this based on actual API response structure
        // If data itself is the order object:
        const createdOrderId = data?.data?._id || data?._id;

        if (createdOrderId) {
          setOrderId(createdOrderId);
          console.log("Order created, ID:", createdOrderId);
        } else {
          console.error("Order ID not found in response:", data);
        }
      },
      onError: (error: Error) => {
        console.error("Failed to create order:", error);
      },
    });
  };

  // Handle Proceed to Checkout (Payment)
  const handleProceedToCheckout = () => {
    if (!orderId) {
      console.error("No Order ID found. Cannot proceed to payment.");
      return;
    }

    console.log("Proceeding to payment with Order ID:", orderId);

    checkoutInModal(
      {
        orderId: orderId,
        totalAmount: total,
      },
      {
        onSuccess: (data: { data?: { url?: string } }) => {
          console.log("Payment initiated successfully", data);
          if (data?.data?.url) {
            window.location.href = data.data.url;
          } else {
            console.error("No payment URL found");
          }
        },
        onError: (error: Error) => {
          console.error("Payment initiation failed", error);
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT: Cart Items */}
      <div className="md:col-span-2 bg-white rounded-xl border p-6">
        {/* Select All + Delete Icon */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-3 text-gray-700">
            {/* <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300"
            /> */}
            <span className="text-sm font-medium">
              Total Cart Items {cartItems.length}
            </span>
          </label>

          {/* <Trash2 className="text-red-500 cursor-pointer" size={20} /> */}
        </div>

        {/* Cart Rows */}
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between py-6 border-b last:border-none"
          >
            {/* Checkbox + Image + Name */}
            <div className="flex items-center gap-5">
              {/* <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300"
              /> */}

              <button
                onClick={() => handleDelete(item._id)}
                className="md:hidden text-red-500 p-2"
                aria-label="Delete item"
              >
                <Trash2 size={18} />
              </button>

              <div className="w-[140px] h-[80px] bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                {/* Fallback image or custom SVG based on shape could go here */}
                {item.serviceId?.templateName || "Product"}
              </div>

              <div>
                <div className="font-semibold text-gray-800">
                  {item.serviceId?.templateName || "Custom Product"}
                </div>
                <div className="text-sm text-gray-500">
                  {item.serviceId?.material && (
                    <span className="uppercase">{item.serviceId.material}</span>
                  )}
                  {item.serviceId?.diameter && (
                    <span> {item.serviceId.diameter}mm</span>
                  )}
                  {item.product && (
                    <span>
                      {" "}
                      {item.product.size ? `${item.product.size}mm` : ""}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Size{" "}
                  {item.serviceId?.sizes
                    ? Object.entries(item.serviceId.sizes)
                        .map(([key, val]) => `${key}:${val}`)
                        .join(", ")
                    : item.product
                      ? `${item.product.unitSize ?? item.product.range}m`
                      : ""}
                </div>
              </div>
            </div>

            {/* Price + Qty */}
            <div className="flex items-center gap-6">
              <div className="font-semibold text-gray-900">
                €{" "}
                {(
                  item.totalAmount ||
                  (item.serviceId?.price || item.price || 0) * item.quantity
                ).toFixed(2)}
                <span className="text-sm text-gray-500">
                  {" "}
                  x {item.serviceId?.units || item.quantity} unit(s)
                </span>
              </div>

              {/* Qty Button */}
              {/* <div className="flex items-center gap-3">
                <button className="border rounded-md p-1">
                  <Minus size={16} />
                </button>

                <span className="w-6 text-center font-medium">
                  {item.quantity}
                </span>

                <button className="border rounded-md p-1 bg-green-100 text-green-700">
                  <Plus size={16} />
                </button>
              </div> */}

              {/* Delete Button (Desktop) */}
              <button
                onClick={() => handleDelete(item._id)}
                className="hidden md:block p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {cartItems.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Your cart is empty.
          </div>
        )}
      </div>

      {/* RIGHT: Order Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6 h-max">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Order Summary
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>€ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span>€ {shippingFee.toFixed(2)}</span>
          </div>
        </div>

        <hr className="my-5" />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold mb-6">
          <span>Total</span>
          <span className="text-red-600">€ {total.toFixed(2)}</span>
        </div>

        {/* Button with AlertDialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              onClick={handleCheckout}
              className="w-full rounded-xl bg-[#7E1800] 
                 py-3.5 text-base font-semibold text-white 
                 shadow-lg transition-all duration-200
                 hover:from-red-700 hover:to-red-800 hover:shadow-xl
                 active:scale-[0.98] cursor-pointer"
            >
              Order Now
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-md rounded-2xl p-6">
            <AlertDialogHeader className="space-y-3 text-center">
              {/* Optional icon */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-xl">🛒</span>
              </div>

              <AlertDialogTitle className="text-xl font-bold text-center">
                Confirm Your Order
              </AlertDialogTitle>

              <AlertDialogDescription className="text-sm text-muted-foreground text-center w-3/4 mx-auto">
                Please confirm that you want to place this order. Once
                confirmed, you’ll be redirected to the payment page.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-4 flex gap-3">
              <AlertDialogCancel
                className="flex-1 rounded-xl border border-gray-300 
                   text-gray-700 transition
                   hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleProceedToCheckout}
                className="flex-1 rounded-xl bg-red-700 
                   text-white font-semibold transition
                   hover:bg-red-800 active:scale-[0.98]
                   cursor-pointer"
              >
                Proceed to Payment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CartProducts;
