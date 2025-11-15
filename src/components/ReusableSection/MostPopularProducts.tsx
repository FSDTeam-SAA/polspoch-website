"use client";

import Image from "next/image";

const products = [
  {
    id: 1,
    title: "Steel Pipe",
    price: "€100",
    unit: "/kg",
    image: "/images/product.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    id: 2,
    title: "Steel Pipe",
    price: "€100",
    unit: "/kg",
    image: "/images/product.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    id: 3,
    title: "Steel Pipe",
    price: "€100",
    unit: "/kg",
    image: "/images/product.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    id: 4,
    title: "Steel Pipe",
    price: "€100",
    unit: "/kg",
    image: "/images/product.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    id: 5,
    title: "Steel Pipe",
    price: "€100",
    unit: "/kg",
    image: "/images/product.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    id: 6,
    title: "Steel Pipe",
    price: "€100",
    unit: "/kg",
    image: "/images/product.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    id: 7,
    title: "Steel Pipe",
    price: "€100",
    unit: "/kg",
    image: "/images/product.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    id: 8,
    title: "Steel Pipe",
    price: "€100",
    unit: "/kg",
    image: "/images/product.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
  },
];

export default function MostPopularProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Most Popular Products
        </h2>
        <p className="text-gray-600 mt-2">
          Customize your steel products with our advanced processing and
          fabrication options.
        </p>

        {/* Product Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl shadow-sm hover:shadow-md transition bg-white p-4"
            >
              <Image
                src={p.image}
                alt={p.title}
                width={300}
                height={200}
                className="rounded-md w-full h-[180px] object-cover"
              />

              <div className="mt-4 text-left">
                <h3 className="font-semibold text-lg">{p.title}</h3>

                <p className="text-lg font-bold text-gray-900 mt-1">
                  {p.price}
                  <span className="text-sm text-gray-500">{p.unit}</span>
                </p>

                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {p.description}
                </p>

                {/* Buttons */}
                <div className="mt-4 flex items-center gap-3">
                  <button className="p-2 border rounded-md hover:bg-gray-100 transition cursor-pointer">
                    🛒
                  </button>
                  <button className="flex-1 bg-[#8B1D13] text-white py-2 rounded-md font-semibold hover:bg-[#6f170f] transition cursor-pointer">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <button className="mt-10 px-6 py-3 border border-[#8B1D13] text-[#8B1D13] rounded-full hover:bg-[#8B1D13] hover:text-white transition cursor-pointer">
          See All Products
        </button>
      </div>
    </section>
  );
}
