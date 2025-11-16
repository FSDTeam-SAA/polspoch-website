"use client";
import { Clock, Truck, BadgeCheck, CreditCard } from "lucide-react";

export default function WorkingProcess() {
  return (
    <div className="w-full py-20 bg-white">
      <div className="mx-auto container grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
        {/* Fast Lead Times */}
        <div className="flex flex-col items-center px-4">
          <Clock className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Fast Lead Times</h3>
          <p className="text-sm text-gray-600">
            Get your customized steel products delivered quickly with efficient
            processing and production.
          </p>
        </div>

        {/* Shipping By Size & Weight */}
        <div className="flex flex-col items-center px-4">
          <Truck className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            Shipping By Size & Weight
          </h3>
          <p className="text-sm text-gray-600">
            Automated shipping rules ensure accurate costs based on dimensions,
            weight, and order volume.
          </p>
        </div>

        {/* Certified Quality */}
        <div className="flex flex-col items-center px-4">
          <BadgeCheck className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Certified Quality</h3>
          <p className="text-sm text-gray-600">
            Every product meets industry standards for durability, precision,
            and performance.
          </p>
        </div>

        {/* Secure Payments */}
        <div className="flex flex-col items-center px-4">
          <CreditCard className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
          <p className="text-sm text-gray-600">
            Multiple payment gateways with encryption for safe and seamless
            transactions.
          </p>
        </div>
      </div>
    </div>
  );
}
