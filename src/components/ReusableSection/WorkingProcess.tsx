"use client";
import { Clock, Truck, BadgeCheck, CreditCard, Ruler, Settings } from "lucide-react";
import Image from "next/image";

export default function WorkingProcess() {
  return (
    <div className="w-full py-20 bg-white">
      <div className="mx-auto container grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
        {/* Fast Lead Times */}
        <div className="flex flex-col items-center px-4">
          {/* <Clock className="w-10 h-10 text-red-700 mb-4" /> */}
          <Image
            src="/images/icon/spain-icon.png"
            alt="spain-icon"
            width={100}
            height={100}
            className="w-10 h-10 object-contain mb-4 group-hover:scale-105 duration-300"
          />
          <h3 className="font-semibold text-lg mb-2">Delivery across Spain </h3>
          <p className="text-sm text-gray-600">
            We deliver to every corner of the peninsula.
          </p>
        </div>

        {/* Shipping By Size & Weight */}
        <div className="flex flex-col items-center px-4">
          <Truck className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            Home Delivery
          </h3>
          <p className="text-sm text-gray-600">
            We adapt the shipping method to the order&apos;s dimensions and weight. Check our delivery conditions.
          </p>
        </div>

        {/* Certified Quality */}
        <div className="flex flex-col items-center px-4">
          <Ruler className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">All Products Cut-to-Size</h3>
          <p className="text-sm text-gray-600">
            Custom cutting for all products. Enter your measurements in our configurator and pay only for what you need.
          </p>
        </div>

        {/* Secure Payments */}
        <div className="flex flex-col items-center px-4">
          <Settings className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Online Service Center</h3>
          <p className="text-sm text-gray-600">
            Plasma sheet cutting, rebar fabrication, and sheet metal bending services from your home, error-free and with just one click.
          </p>
        </div>
      </div>
    </div>
  );
}
