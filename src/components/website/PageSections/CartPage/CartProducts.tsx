"use client";
import { Trash2 } from "lucide-react";
import { useDeleteCart, useGetCart } from "@/lib/hooks/useAddToCart";
import { useSession } from "next-auth/react";

interface CartItem {
  _id: string;
  serviceId: {
    _id: string;
    serviceType: string;
    templateName: string;
    units: number;
    price: number;
    diameter: number;
    sizes: Record<string, number>;
    material?: string;
    degrees?: Record<string, number>;
  };
  quantity: number;
}

const CartProducts = () => {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const { data: cart } = useGetCart({ token }) as {
    data: { data: CartItem[] } | undefined;
  };

  const { mutate: deleteCartItem } = useDeleteCart({ token });

  const cartItems = cart?.data || [];

  const handleDelete = (id: string) => {
    deleteCartItem(id);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.serviceId.price * item.quantity,
    0,
  );
  const shippingFee = 0; // Fixed for now or 0
  const total = subtotal + shippingFee;

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
                {item.serviceId.templateName}
              </div>

              <div>
                <div className="font-semibold text-gray-800">
                  {item.serviceId.templateName}
                </div>
                <div className="text-sm text-gray-500">
                  {item.serviceId.material && (
                    <span className="uppercase">{item.serviceId.material}</span>
                  )}
                  {item.serviceId.diameter && (
                    <span> {item.serviceId.diameter}mm</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Size{" "}
                  {Object.entries(item.serviceId.sizes || {})
                    .map(([key, val]) => `${key}:${val}`)
                    .join(", ")}
                </div>
              </div>
            </div>

            {/* Price + Qty */}
            <div className="flex items-center gap-6">
              <div className="font-semibold text-gray-900">
                € {item.serviceId.price.toFixed(2)}
                <span className="text-sm text-gray-500">
                  {" "}
                  x {item.serviceId.units} unit(s)
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

        {/* Button */}
        <button className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition cursor-pointer">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartProducts;
