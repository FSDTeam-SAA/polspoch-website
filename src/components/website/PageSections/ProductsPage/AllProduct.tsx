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
import { useGetAllFamily } from "@/lib/hooks/useFamily";
import { Product } from "@/lib/types/product";
import Image from "next/image";
import { ShoppingCart, ShoppingBag, Filter } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const DEFAULT_LIMIT = 8;

const AllProduct: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const family = searchParams.get("family") || undefined;
  const search = searchParams.get("search") || undefined; // Derive search from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [limit] = useState<number>(DEFAULT_LIMIT); // Use DEFAULT_LIMIT

  const updateQueryParams = (newFamily?: string | null, newPage?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFamily !== undefined) {
      if (newFamily) {
        params.set("family", newFamily);
      } else {
        params.delete("family");
      }
      // Reset page when category changes
      params.set("page", "1");
    }

    if (newPage !== undefined) {
      params.set("page", String(newPage));
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: true });
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

  const { data: familyData, isLoading: isFamilyLoading } = useGetAllFamily();
  const categories = useMemo(() => familyData?.data || [], [familyData?.data]);

  const hasMore = products.length === limit;
  const lastPage = Math.max(
    currentPage + (hasMore ? 1 : 0),
    Math.ceil((data?.total ?? products.length) / limit),
  );

  const selectedFamilyName = useMemo(() => {
    if (!family || categories.length === 0) return family;
    const found = categories.find((c) => c._id === family);
    return found ? found.familyName : family;
  }, [family, categories]);

  const handleCategoryClick = (id: string) => {
    if (family === id) {
      updateQueryParams(null);
    } else {
      updateQueryParams(id);
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
            : categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id)}
                  className={clsx(
                    "group relative h-28 rounded-xl overflow-hidden cursor-pointer border-3 transition-all duration-300",
                    family === cat._id
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
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <div
                    className={clsx(
                      "absolute inset-0 flex items-center justify-center transition-colors duration-300",
                      family === cat._id
                        ? "bg-[#7E1800]/40"
                        : "bg-black/40 group-hover:bg-black/20",
                    )}
                  >
                    <span className="text-white font-bold text-lg tracking-wide uppercase text-center px-2">
                      {cat.familyName}
                    </span>
                  </div>
                </button>
              ))}
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
              Clear Filter: {selectedFamilyName}
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
                  onClick={() => updateQueryParams(null)}
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
                        {typeof p.family === "string"
                          ? p.family
                          : p.family?.familyName}
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
          {(lastPage > 1 || currentPage > 1 || products.length === limit) && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-gray-100">
              <div className="text-sm font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                Showing page{" "}
                <span className="text-[#7E1800]">{currentPage}</span> of{" "}
                <span className="text-gray-900">{lastPage}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQueryParams(undefined, currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-[#7E1800]/20 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2"
                >
                  <span className="text-lg">←</span> Previous
                </button>
                <div className="hidden md:flex items-center gap-2">
                  {[...Array(lastPage)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === lastPage ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => updateQueryParams(undefined, pageNum)}
                          className={clsx(
                            "w-11 h-11 rounded-xl text-sm font-bold transition-all cursor-pointer border-2",
                            currentPage === pageNum
                              ? "bg-[#7E1800] border-[#7E1800] text-white shadow-lg shadow-[#7E1800]/30 scale-110 z-10"
                              : "border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-200",
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
                        <span
                          key={pageNum}
                          className="text-gray-300 font-bold px-1"
                        >
                          •••
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => updateQueryParams(undefined, currentPage + 1)}
                  disabled={currentPage >= lastPage && products.length < limit}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-[#7E1800]/20 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2"
                >
                  Next <span className="text-lg">→</span>
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
