"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useProducts } from "@/lib/hooks/useProducts";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HeadingText from "./HeadingText";

export default function MostPopularProducts() {
  const { data, isLoading, isError } = useProducts({ limit: 8 }, true);
  const products = data?.data || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        {/* <div className="mb-12">
          <h2 className="text-4xl font-semibold ">Most Popular Products</h2>
          <p className="text-gray-600 mt-2">
            Customize your steel products with our advanced processing and
            fabrication options.
          </p>
        </div> */}

        <HeadingText
          subHeading="Todos los productos"
          heading="Descubre nuestro catálogo de Hierro y Acero"
          description="Tu Almacén de Hierro Online: Encuentra la mayor variedad de tubos, vigas, chapas o perfiles, todo con corte personalizado. Selecciona la categoría de producto para filtrar la búsqueda"
          align="center"
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#7E1800] animate-spin" />
            <p className="mt-4 text-gray-500 font-medium">
              Loading products...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-20 text-center">
            <p className="text-red-500 font-medium">
              Failed to load most popular products.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <Card
                key={p._id}
                className="group/card p-3 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full relative border-2 border-transparent hover:border-[#7E1800]/10"
              >
                <Link
                  href={`/products/${p._id}`}
                  className="absolute inset-0 z-10"
                />

                {/* Image */}
                <div className="w-full h-[220px] relative bg-gray-100 rounded-lg overflow-hidden">
                  {p.productImage && p.productImage[0]?.url ? (
                    <Image
                      src={p.productImage[0].url}
                      alt={p.productName}
                      fill
                      className="object-contain transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <CardHeader className="p-0 mt-4 space-y-1 text-left">
                  <CardTitle className="text-base font-bold text-gray-900 line-clamp-1">
                    {p.productName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                      {typeof p.family === "string"
                        ? p.family
                        : p.family?.familyName}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-0 mt-2 flex-1 text-left">
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {p.unitSizeCustomizationNote ??
                      "High-quality industrial steel product built for precision and durability."}
                  </p>
                </CardContent>

                <Link
                  href={`/products/${p._id}`}
                  className="relative z-20 mt-4"
                >
                  <CardFooter className="p-0 pt-0">
                    <Button className="group w-full bg-[#7E1800] hover:bg-[#7E1800]/90 cursor-pointer text-white rounded-lg flex items-center justify-center gap-2 py-5 transition-all font-bold">
                      <span>Buy Now</span>
                      <ShoppingBag
                        size={18}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover/card:translate-x-1"
                      />
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Button */}
        {!isLoading && !isError && (
          <Link href="/products" className="inline-block mt-12">
            <button className="px-8 py-3 cursor-pointer border-2 border-[#7E1800] text-[#7E1800] rounded-lg font-bold hover:bg-[#7E1800] hover:text-white transition-all transform hover:-translate-y-1">
              See All Products
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}
