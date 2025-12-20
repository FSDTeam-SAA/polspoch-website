"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function OurProducts() {
  const products = [
    { title: "Sheets", value: "Sheets", img: "/images/categories/sheets.png" },
    { title: "Bars", value: "BEAMS", img: "/images/categories/bars.png" },
    { title: "Tubes", value: "Tubes", img: "/images/categories/tubes.png" },
    { title: "Plates", value: "Plates", img: "/images/categories/plates.png" },
    { title: "Coils", value: "Coils", img: "/images/categories/coils.png" },
    { title: "Rebars", value: "Rebars", img: "/images/categories/rebars.png" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Our Products
        </h2>

        <p className="max-w-2xl mx-auto mt-2 text-gray-500 text-sm">
          Explore a complete range of premium iron and steel materials built for
          strength, precision, and performance.
        </p>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, index) => (
            <Link
              key={index}
              href={`/products?family=${p.value}`}
              className="group relative h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 block"
            >
              <Image
                src={p.img}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <p className="text-white font-bold text-xl tracking-wide uppercase">
                  {p.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="mt-10">
          <Link href={"/products"}>
            <button className="px-6 py-2 border border-[#7E1800] rounded-md bg-transparent text-[#7E1800] hover:bg-[#7E1800] hover:text-white cursor-pointer transition-colors duration-300">
              See all Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
