// src/components/AllProduct.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardFooter,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/types/product";
import Image from "next/image";
import { ShoppingCart, ShoppingBag, Filter } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const DEFAULT_LIMIT = 10;

const CATEGORIES = [
  { name: "Sheets", value: "Sheets", image: "/images/categories/sheets.png" },
  { name: "Beams", value: "BEAMS", image: "/images/categories/bars.png" },
  { name: "Tubes", value: "Tubes", image: "/images/categories/tubes.png" },
  { name: "Plates", value: "Plates", image: "/images/categories/plates.png" },
  { name: "Coils", value: "Coils", image: "/images/categories/coils.png" },
  { name: "Rebars", value: "Rebars", image: "/images/categories/rebars.png" },
];

const AllProduct: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const family = searchParams.get("family") || undefined;
  const search = searchParams.get("search") || undefined; // Derive search from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [limit] = useState<number>(DEFAULT_LIMIT); // Use DEFAULT_LIMIT

  const updateQueryParams = (newFamily?: string, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFamily) {
      params.set("family", newFamily);
    } else {
      params.delete("family");
    }

    if (resetPage) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const params = useMemo(() => {
    const p: { page: number; limit: number; family?: string; search?: string } =
      { page: currentPage, limit };
    if (family) p.family = family;
    if (search) p.search = search;
    return p;
  }, [family, search, currentPage, limit]);

  const { data, isLoading, isError } = useProducts(params, true);
  const products: Product[] = data?.data || [];

  const lastPage = Math.max(
    1,
    Math.ceil((data?.total ?? products.length) / limit)
  );

  const handleCategoryClick = (value: string) => {
    if (family === value) {
      updateQueryParams(undefined);
    } else {
      updateQueryParams(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filters */}
      <div className="mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className={clsx(
                "group relative h-28 rounded-xl overflow-hidden cursor-pointer border-3 transition-all duration-300",
                family === cat.value
                  ? "border-[#7E1800] shadow-xl scale-105 z-10"
                  : "border-transparent hover:border-[#7E1800]/40"
              )}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className={clsx(
                  "absolute inset-0 flex items-center justify-center transition-colors duration-300",
                  family === cat.value
                    ? "bg-[#7E1800]/40"
                    : "bg-black/40 group-hover:bg-black/20"
                )}
              >
                <span className="text-white font-bold text-lg tracking-wide uppercase">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
        {family && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => {
                updateQueryParams(undefined);
              }}
              variant="outline"
              className="text-[#7E1800] border-[#7E1800] hover:bg-[#7E1800] hover:text-white transition-all"
            >
              <Filter className="mr-2" size={16} />
              Clear Filter: {family}
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
                  Error loading products. Please try again.
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
                  No products found in this category.
                </p>
                <Button
                  onClick={() => updateQueryParams(undefined)}
                  variant="link"
                  className="mt-2 text-[#7E1800]"
                >
                  View all products
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
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-0 mt-4 space-y-1">
                    <CardTitle className="text-base font-bold text-gray-900 line-clamp-1">
                      {p.productName}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                        {p.family}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 mt-2 flex-1">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {p.unitSizeCustomizationNote ??
                        "High-quality industrial steel product built for precision and durability."}
                    </p>
                  </CardContent>
                  <Link href={`/products/${p._id}`}>
                    <CardFooter className="p-0 mt-4 pt-0">
                      <Button className="group w-full bg-[#7E1800] hover:bg-[#7E1800]/90 cursor-pointer text-white rounded-lg flex items-center justify-center gap-2 py-5 transition-all relative z-20 font-bold">
                        <span>Buy Now</span>
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

          {/* Pagination (bottom) */}
          {lastPage > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-500">
                Showing page{" "}
                <span className="text-gray-900">{currentPage}</span> of{" "}
                <span className="text-gray-900">{lastPage}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQueryParams(family, false)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(lastPage)].map((_, i) => {
                    const pageNum = i + 1;
                    // Only show limited pages if many
                    if (
                      pageNum === 1 ||
                      pageNum === lastPage ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            const params = new URLSearchParams(
                              searchParams.toString()
                            );
                            params.set("page", String(pageNum));
                            router.push(`${pathname}?${params.toString()}`, {
                              scroll: false,
                            });
                          }}
                          className={clsx(
                            "w-10 h-10 rounded-lg text-sm font-bold transition-all",
                            currentPage === pageNum
                              ? "bg-[#7E1800] text-white shadow-lg shadow-[#7E1800]/20"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(currentPage + 1));
                    router.push(`${pathname}?${params.toString()}`, {
                      scroll: false,
                    });
                  }}
                  disabled={currentPage >= lastPage}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllProduct;
