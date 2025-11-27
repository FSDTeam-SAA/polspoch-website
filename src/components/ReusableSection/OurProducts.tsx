"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function OurProducts() {
  const products = [
    { title: "Sheets", img: "/images/product.png" },
    { title: "Bars", img: "/images/product.png" },
    { title: "Tubes", img: "/images/product.png" },
    { title: "Plates", img: "/images/product.png" },
    { title: "Coils", img: "/images/product.png" },
    { title: "Rebars", img: "/images/product.png" },
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
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full h-56">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="py-4 text-center">
                <p className="text-red-700 font-semibold">{p.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-10">
          <Link href={'/product'}></Link>
          <Button className="px-6 py-2 border border-red-400 rounded-md bg-transparent text-red-700 hover:bg-[#7E1800] hover:text-white cursor-pointer">
            See all Products
          </Button>
        </div>
      </div>
    </section>
  );
}
