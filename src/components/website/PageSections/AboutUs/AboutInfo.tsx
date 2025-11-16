"use client";
import Image from "next/image";
import React from "react";

export default function AboutInfo() {
  return (
    <section className="w-full py-10 px-4">
      {/* Outer rounded container */}
      <div className="mx-auto max-w-7xl bg-white rounded-3xl overflow-hidden ">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: image (parent is relative with explicit height so next/image fill works) */}
          <div className="relative h-64 md:h-[540px] lg:h-[600px]">
            <Image
              src="/images/about-us-img.jpg"
              alt="about info Image"
              fill
              className="object-cover"
              priority
            />
            {/* Optional subtle overlay if you want the right side darker for contrast */}
            <div className="absolute inset-0 bg-black/0 md:bg-black/0 pointer-events-none" />
          </div>

          {/* RIGHT: content */}
          <div className="px-6 md:px-12 py-10 md:py-16 flex flex-col justify-center">
            <p className="text-sm text-[#7E1800] font-medium mb-3">
              Trusted by Steel Professionals Worldwide
            </p>

            <h2 className="text-[#111827] text-3xl md:text-4xl font-semibold leading-tight mb-6">
              Premium steel solutions for <br className="hidden md:block" />
              businesses worldwide.
            </h2>

            <p className="text-gray-500 mb-8 max-w-xl">
              We deliver high-quality steel products with unmatched reliability,
              helping businesses finish projects on time and on budget.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 max-w-xl">
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#7E1800]">
                  400+
                </div>
                <div className="text-sm text-gray-500">Projects completed</div>
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#7E1800]">
                  600%
                </div>
                <div className="text-sm text-gray-500">Return on investment for clients</div>
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#7E1800]">
                  10k
                </div>
                <div className="text-sm text-gray-500">Tons of steel delivered</div>
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#7E1800]">
                  200+
                </div>
                <div className="text-sm text-gray-500">Satisfied customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
