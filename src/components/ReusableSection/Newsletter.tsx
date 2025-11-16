"use client";
import React from "react";
import Image from "next/image";

const Newsletter = () => {
  return (
    <section className="py-20 px-15 bg-white ">

    <div className="relative w-full bg-[#7E1800] rounded-3xl overflow-hidden py-10 px-6 flex items-center justify-center">

      {/* Top-left curve */}
      <div className="absolute top-0 left-0 w-40 h-40 opacity-40">
        <Image
          src="/images/shape-top.png" 
          alt="curve"
          fill
          className="object-contain"
        />
      </div>

      {/* Bottom-right curve */}
      <div className="absolute bottom-0 right-0 w-56 h-56 opacity-40">
        <Image
          src="/images/shape-bottom.png" 
          alt="curve"
          fill
          className="object-contain"
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-white font-semibold text-3xl md:text-4xl mb-2">
          Stay Updated with Latest Offers & Industrial News
        </h2>

        {/* Subheading */}
        <p className="text-gray-200 mb-10">
          Stay Updated with Latest Offers & Industrial News
        </p>

        {/* Input & Button */}
        <div className="flex items-center justify-center">
          <div className="flex w-full max-w-xl">
            <input
              type="email"
              placeholder="hello@example.com"
              className="w-full px-5 py-4 bg-white rounded-l-xl text-gray-700 outline-none"
            />
            <button className="px-8 bg-white/20 cursor-pointer text-white border border-white rounded-r-xl font-medium hover:bg-white/30 transition">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Newsletter;
