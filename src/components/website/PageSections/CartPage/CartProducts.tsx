// import React from 'react'

// const CartProducts = () => {
//   return (
//     <div>This is the CartProducts</div>
//   )
// }

// export default CartProducts

import React from "react";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";

const CartProducts = () => {
  const items = [1, 2, 3, 4]; // Fake items for UI layout

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* LEFT: Cart Items */}
      <div className="md:col-span-2 bg-white rounded-xl border p-6">
        {/* Select All + Delete Icon */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-3 text-gray-700">
            <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
            <span className="text-sm font-medium">Select All (1 Items)</span>
          </label>

          <Trash2 className="text-red-500 cursor-pointer" size={20} />
        </div>

        {/* Cart Rows */}
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-6 border-b last:border-none"
          >
            {/* Checkbox + Image + Name */}
            <div className="flex items-center gap-5">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />

              <Image
                src="/images/no-image.jpg"  // replace with your actual path
                alt="Steel Pipe"
                width={140}
                height={80}
                className="rounded-lg object-cover"
              />

              <div className="font-semibold text-gray-800">Steel Pipe</div>
            </div>

            {/* Price + Qty */}
            <div className="flex items-center gap-6">
              <div className="font-semibold text-gray-900">€100<span className="text-sm text-gray-500">/1 kg</span></div>

              {/* Qty Button */}
              <div className="flex items-center gap-3">
                <button className="border rounded-md p-1">
                  <Minus size={16} />
                </button>

                <span className="w-6 text-center font-medium">1</span>

                <button className="border rounded-md p-1 bg-green-100 text-green-700">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Order Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6 h-max">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Summary</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal (1 items)</span>
            <span>€1,234</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span>€123</span>
          </div>

          <div className="flex justify-between">
            <span>Lorem Ipsum</span>
            <span>€12</span>
          </div>
        </div>

        <hr className="my-5" />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold mb-6">
          <span>Total</span>
          <span className="text-red-600">€1,2345</span>
        </div>

        {/* Button */}
        <button className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition">
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
};

export default CartProducts;
