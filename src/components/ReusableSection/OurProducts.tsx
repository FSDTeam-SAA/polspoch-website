"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetAllFamily } from "@/lib/hooks/useFamily";
import { Skeleton } from "../ui/skeleton";
import { slugify } from "@/lib/utils";

export default function OurProducts() {
  const { data: familyData, isLoading } = useGetAllFamily();
  const categories = familyData?.data || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
          Descubre nuestro catálogo de Hierro y Acero
        </h2>

        <p className="max-w-2xl mx-auto mt-4 text-slate-600 text-lg">
          Tu Almacén de Hierro Online: Encuentra la mayor variedad de tubos,
          vigas, chapas o perfiles, todo con corte personalizado
        </p>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-64 rounded-xl overflow-hidden relative"
                >
                  <Skeleton className="absolute inset-0 w-full h-full" />
                </div>
              ))
            : categories.map((p, index) => (
                <Link
                  key={index}
                  href={`/products?family=${slugify(p.familyName)}-${p._id}`}
                  className="group relative h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 block"
                >
                  {p.img?.url ? (
                    <Image
                      src={p.img.url}
                      alt={p.familyName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <p className="text-white font-bold text-xl tracking-wide uppercase">
                      {p.familyName}
                    </p>
                  </div>
                </Link>
              ))}
        </div>

        {/* Button */}
        <div className="mt-10">
          <Link href={"/products"}>
            <button className="px-6 py-2 border border-[#7E1800] rounded-md bg-transparent text-[#7E1800] hover:bg-[#7E1800] hover:text-white cursor-pointer transition-colors duration-300">
              Ver todos los productos
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
