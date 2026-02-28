// src/components/AllProduct.tsx
"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardFooter,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { useProducts } from "@/lib/hooks/useProducts";
import { useGetAllFamily } from "@/lib/hooks/useFamily";
import { Product } from "@/lib/types/product";
import Image from "next/image";
import { ShoppingCart, ShoppingBag, Filter } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const AllProduct: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const family = searchParams.get("family") || undefined;
  const search = searchParams.get("search") || undefined;

  const updateQueryParams = (newFamily?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFamily !== undefined) {
      if (newFamily) {
        params.set("family", newFamily);
      } else {
        params.delete("family");
      }
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const params = useMemo(() => {
    const p: { family?: string; search?: string } = {};
    if (family) p.family = family;
    if (search) p.search = search;
    return p;
  }, [family, search]);

  const { data, isLoading, isError } = useProducts(params, true);
  const products: Product[] = data?.data || [];

  const { data: familyData, isLoading: isFamilyLoading } = useGetAllFamily();
  const categories = useMemo(() => familyData?.data || [], [familyData?.data]);

  const selectedFamilyName = useMemo(() => {
    if (!family || categories.length === 0) return family;
    const found = categories.find(
      (c) => `${slugify(c.familyName)}-${c._id}` === family,
    );
    return found ? found.familyName : family;
  }, [family, categories]);

  const handleCategoryClick = (catSlugId: string) => {
    if (family === catSlugId) {
      updateQueryParams(null);
    } else {
      updateQueryParams(catSlugId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filters */}
      <div className="mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {isFamilyLoading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl overflow-hidden relative"
                >
                  <Skeleton className="absolute inset-0 w-full h-full" />
                </div>
              ))
            : categories.map((cat) => {
                const catSlugId = `${slugify(cat.familyName)}-${cat._id}`;
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(catSlugId)}
                    className={clsx(
                      "group relative h-28 rounded-xl overflow-hidden cursor-pointer border-3 transition-all duration-300",
                      family === catSlugId
                        ? "border-[#7E1800] shadow-xl scale-105 z-10"
                        : "border-transparent hover:border-[#7E1800]/40",
                    )}
                  >
                    {cat.img?.url ? (
                      <Image
                        src={cat.img.url}
                        alt={cat.familyName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          Sin imagen
                        </span>
                      </div>
                    )}
                    <div
                      className={clsx(
                        "absolute inset-0 flex items-center justify-center transition-colors duration-300",
                        family === catSlugId
                          ? "bg-[#7E1800]/40"
                          : "bg-black/40 group-hover:bg-black/20",
                      )}
                    >
                      <span className="text-white font-bold text-lg tracking-wide uppercase text-center px-2">
                        {cat.familyName}
                      </span>
                    </div>
                  </button>
                );
              })}
        </div>
        {family && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => {
                updateQueryParams(null);
              }}
              variant="outline"
              className="text-[#7E1800] border-[#7E1800] hover:bg-[#7E1800] hover:text-white transition-all"
            >
              <Filter className="mr-2" size={16} />
              Limpiar filtro: {selectedFamilyName}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* Products column */}
        <main className="flex-1">
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Skeleton Loading State */}
            {isLoading &&
              [...Array(8)].map((_, i) => (
                <Card
                  key={`skeleton-${i}`}
                  className="p-3 rounded-xl overflow-hidden"
                >
                  <div className="flex flex-col">
                    <Skeleton className="w-full h-[220px]" />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                      <Skeleton className="h-10 w-full mt-2" />
                    </div>
                  </div>
                </Card>
              ))}

            {/* Error */}
            {isError && (
              <div className="col-span-full text-center py-12 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-600 font-medium">
                  Error al cargar productos. Por favor, inténtelo de nuevo.
                </p>
              </div>
            )}

            {/* No Products Found */}
            {!isLoading && !isError && products.length === 0 && (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                <ShoppingCart
                  size={48}
                  className="mx-auto text-gray-300 mb-4"
                />
                <p className="text-gray-500 font-medium text-lg">
                  No se han encontrado productos en esta categoría.
                </p>
                <Button
                  onClick={() => updateQueryParams(null)}
                  variant="link"
                  className="mt-2 text-[#7E1800]"
                >
                  Ver todos los productos
                </Button>
              </div>
            )}

            {/* Products */}
            {!isLoading &&
              !isError &&
              products.map((p) => (
                <Card
                  key={p._id}
                  className="group/card p-3 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full relative border-2 border-transparent hover:border-[#7E1800]/10"
                >
                  <Link
                    href={`/products/${slugify(p.productName)}-${p._id}`}
                    className="absolute inset-0 z-10"
                  />
                  {/* Image */}
                  <div className="w-full h-[220px] relative bg-gray-100 rounded-lg overflow-hidden">
                    {p.productImage && p.productImage[0]?.url ? (
                      <Image
                        src={p.productImage[0].url}
                        alt={p.productName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-0 mt-4 space-y-1">
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

                  {/* Global Available Finish Qualities */}
                  {(() => {
                    const uniqueQualities = Array.from(
                      new Set(
                        p.features?.map((f) => f.finishQuality).filter(Boolean),
                      ),
                    ).sort();

                    if (uniqueQualities.length === 0) return null;

                    return (
                      <div className="">
                        <div className="flex flex-wrap gap-2">
                          {uniqueQualities.map((quality) => (
                            <span
                              key={quality}
                              className="px-2.5 py-1 bg-[#7E1800]/5 text-[#7E1800] border border-[#7E1800]/20 rounded-md text-xs font-medium"
                            >
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <CardContent className="p-0 mt-2 flex-1">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {p.unitSizeCustomizationNote ??
                        "High-quality industrial steel product built for precision and durability."}
                    </p>
                  </CardContent>
                  <Link href={`/products/${slugify(p.productName)}-${p._id}`}>
                    <CardFooter className="p-0 pt-0">
                      <Button className="group w-full bg-[#7E1800] hover:bg-[#7E1800]/90 cursor-pointer text-white rounded-lg flex items-center justify-center gap-2 py-5 transition-all relative z-20 font-bold">
                        <span>Comprar ahora</span>
                        <ShoppingBag
                          size={18}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                        />
                      </Button>
                    </CardFooter>
                  </Link>
                </Card>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllProduct;
