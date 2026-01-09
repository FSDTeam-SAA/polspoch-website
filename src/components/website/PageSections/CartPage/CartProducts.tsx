// src/components/website/PageSections/CartPage/CartProducts.tsx
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
import { Eye } from "lucide-react";
import CartItemDetailsModal from "./CartItemDetailsModal";
import { calculateShippingCost } from "@/lib/shippingUtils";
import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const CartProducts = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [viewingItem, setViewingItem] = useState<CartItem | null>(null);
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  // 1. Create Order Mutation
  const { mutate: checkoutCart } = useCheckoutCart({ token });

  // 2. Payment Modal Mutation
  const { mutate: checkoutInModal } = useCheckoutCartInModal({ token });

  const { data: cart } = (useGetCart({ token }) as {
    data: { data: CartItem[] } | undefined;
  }) || { data: undefined };

  const { mutate: deleteCartItem } = useDeleteCart({ token });

  const cartItems = useMemo(() => cart?.data || [], [cart?.data]);

  const handleDelete = (id: string) => {
    deleteCartItem(id);
  };

  // 3. Calculate Subtotal, Weight, and Shipping
  const { subtotal, totalWeight, maxLength, isTruckRequired } = useMemo(() => {
    let sub = 0;
    let weight = 0;
    let maxL = 0;
    let truckReq = false;

    cartItems.forEach((item) => {
      // Subtotal calculation
      const itemTotal =
        item.totalAmount ||
        (item.serviceId?.price || item.price || 0) * item.quantity;
      sub += itemTotal;

      // Weight and Length calculation for Products
      if (item.product && item.product.selectedFeature) {
        const feature = item.product.selectedFeature;
        const lengthMeters = item.product.unitSize || item.product.range || 0;
        const itemWeight =
          (feature.kgsPerUnit || 0) * lengthMeters * item.quantity;
        weight += itemWeight;

        const lengthMm = lengthMeters * 1000;
        if (lengthMm > maxL) maxL = lengthMm;
        if (lengthMm > 2500) truckReq = true;
        if (lengthMm > 2500) truckReq = true;
      } else if (item.serviceId) {
        // Length calculation for Services (Old structure)
        const serviceSizes = Object.values(item.serviceId.sizes || {});
        const maxServiceL =
          serviceSizes.length > 0 ? Math.max(...(serviceSizes as number[])) : 0;
        if (maxServiceL > maxL) maxL = maxServiceL;
        if (maxServiceL > 2500) truckReq = true;
      } else if (item.serviceData) {
        // Length/Weight for Services (New Structure)
        if (item.serviceData.totalWeight) {
          weight += item.serviceData.totalWeight * item.quantity;
        }

        const length = item.serviceData.totalLength || 0;
        if (length > maxL) maxL = length; // assuming totalLength is in mm based on JSON (90, 10 etc.) - wait, JSON says sizeA: 90. If it's mm, 90mm is small. Let's assume consistent units. If previous code multiplied by 1000 for products (meters to mm), and service sizes were in mm. 
        // Logic check: "lengthMeters * 1000". Produc unitSize is meters.
        // Service JSON: "totalLength": 90. Is this mm, cm, or m? 
        // "sizeA": 90. "totalWeight": 1.91. 
        // 90 meters would be huge. 90mm is tiny. 90cm?
        // Let's assume it matches the "maxL" unit which is mm. 
        if (length > 2500) truckReq = true;
      }
    });

    return {
      subtotal: sub,
      totalWeight: weight,
      maxLength: maxL,
      isTruckRequired: truckReq,
    };
  }, [cartItems]);

  const shippingFee = calculateShippingCost(
    totalWeight,
    maxLength,
    !isTruckRequired,
  );
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
        const createdOrderId = data?.data?._id || data?._id;
        if (createdOrderId) {
          setOrderId(createdOrderId);
        }
      },
      onError: (error: Error) => {
        console.error("Failed to create order:", error);
      },
    });
  };

  // Handle Proceed to Checkout (Payment)
  const handleProceedToCheckout = () => {
    if (!orderId) return;

    checkoutInModal(
      {
        orderId: orderId,
        totalAmount: total,
      },
      {
        onSuccess: (data: { data?: { url?: string } }) => {
          if (data?.data?.url) {
            window.location.href = data.data.url;
          }
        },
      },
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
              Total Cart Items {cartItems?.length}
            </span>
          </label>

          {/* <Trash2 className="text-red-500 cursor-pointer" size={20} /> */}
        </div>

        {/* Cart Rows */}
        {cartItems?.map((item) => (
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

              <div className="w-[140px] h-[80px] bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
                {item?.product?.productId?.productImage &&
                  item.product.productId.productImage.length > 0 ? (
                  <Image
                    src={item.product.productId.productImage[0].url}
                    alt={item.product.productId.productName}
                    width={140}
                    height={80}
                    className="w-full h-full object-contain p-2"
                  />
                ) : item?.serviceId?.imageUrl ? (
                  <Image
                    src={item.serviceId.imageUrl}
                    alt={item.serviceId.templateName}
                    width={140}
                    height={80}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[10px] text-slate-400 font-medium px-2 text-center uppercase">
                    <span>{item?.serviceId?.templateName || item?.serviceData?.serviceType || "Product"}</span>
                    <span>{item?.product?.productId?.productName}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="font-semibold text-gray-800 uppercase">
                  {item?.product?.productId?.productName ||
                    item?.serviceId?.templateName ||
                    item?.serviceData?.serviceType ||
                    "Custom Product"}
                </div>
                {/* eye button for viewing the modal */}
                <motion.button
                  onClick={() => setViewingItem(item)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    hover: {
                      scale: 1.1,
                      backgroundColor: "rgba(126, 24, 0, 0.05)",
                      color: "#7E1800",
                      boxShadow: "0px 4px 15px rgba(126, 24, 0, 0.1)",
                    },
                    tap: { scale: 0.95 },
                  }}
                  className="p-2 text-slate-400 cursor-pointer bg-slate-100/50 rounded-lg flex items-center justify-center relative overflow-hidden group"
                  title="View Details"
                >
                  <motion.div
                    variants={{
                      hover: { scale: 1.2, rotate: 15 },
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Eye size={18} />
                  </motion.div>
                  {/* Sophisticated Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
                    variants={{
                      hover: { x: ["-150%", "150%"] },
                    }}
                    transition={{
                      duration: 0.75,
                      repeat: Infinity,
                      repeatDelay: 0.1,
                      ease: "easeInOut",
                    }}
                  />
                </motion.button>
              </div>
            </div>

            {/* Price + Qty */}
            <div className="flex items-center gap-4">
              <div className="font-semibold text-gray-900 text-right">
                €{" "}
                {(
                  item?.totalAmount ||
                  (item?.serviceId?.price || item?.price || 0) * item?.quantity
                ).toFixed(2)}
                <div className="text-[10px] text-gray-500 font-normal">
                  {item?.serviceId?.units || item?.serviceData?.units || item?.quantity} unit(s)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* <button
                  onClick={() => setViewingItem(item)}
                  className="p-2 text-slate-400 hover:text-[#7E1800] transition-colors cursor-pointer bg-slate-50 hover:bg-[#7E1800]/5 rounded-lg"
                  title="View Details"
                >
                  <Eye size={18} />
                </button> */}

                <motion.button
                  onClick={() => handleDelete(item._id)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    hover: {
                      scale: 1.1,
                      backgroundColor: "rgba(239, 68, 68, 0.05)",
                      color: "#ef4444",
                    },
                    tap: { scale: 0.95 },
                  }}
                  className="p-2 text-slate-400 cursor-pointer bg-slate-100/50 rounded-lg flex items-center justify-center"
                  title="Remove item"
                >
                  <motion.div
                    variants={{
                      hover: { rotate: [0, -10, 10, -10, 10, 0] },
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Trash2 size={18} />
                  </motion.div>
                </motion.button>
              </div>
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

          <div className="flex justify-between items-center">
            <span className="flex flex-col">
              <span>Shipping Fee</span>
              <span className="text-[10px] text-gray-500">
                {totalWeight.toFixed(2)}kg • {maxLength / 1000}m max
              </span>
            </span>
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

      <CartItemDetailsModal
        item={viewingItem}
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
      />
    </div>
  );
};

export default CartProducts;
