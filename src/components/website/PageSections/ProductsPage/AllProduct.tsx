// src/components/AllProduct.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/types/product";
import Image from "next/image";
import { ShoppingCart, ShoppingBag, Filter } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_LIMIT = 12;

const AllProduct: React.FC = () => {
  const [family, setFamily] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [filterOpen, setFilterOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(1024);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const params = useMemo(() => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = { page, limit };
    if (family) p.family = family;
    if (search) p.search = search;
    return p;
  }, [family, search, page, limit]);

  const { data, isLoading, isError } = useProducts(params, true);
  const products: Product[] = (data?.data as Product[]) || [];

  const total = data?.total ?? products.length;
  const ids = data?.data.map((item) => item._id);
  console.log("dataaa", data);

  const lastPage = Math.max(
    1,
    Math.ceil((data?.total ?? products.length) / limit)
  );

  const handleApplyFilter = () => {
    setPage(1);
    setFilterOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter column */}
        <aside className="w-full md:w-80">
          {/* Mobile show toggle */}
          {/* <div className="md:hidden mb-4">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="w-full text-left bg-white border rounded-md py-2 px-3 shadow-sm"
            >
              {filterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div> */}

          <div
            className={clsx("transition-all", {
              "hidden md:block":
                !filterOpen &&
                typeof window !== "undefined" &&
                window.innerWidth < 768,
            })}
          >
            <Card className="p-4 mb-6">
              <CardTitle className="text-sm mb-2">
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-semibold">Filter</p>
                  {/* <Filter className="ml-2" size={16} /> */}
                </div>
              </CardTitle>

              <div className="space-y-4">
                {/* <div>
                  <label className="text-xs block mb-1">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 input input-bordered"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 input input-bordered"
                    />
                  </div>
                </div> */}
                <div className="flex  justify-between items-center gap-4">
                  <label className="text-base block mb-1">Search</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type here..."
                    className="w-full input input-bordered border p-2 rounded border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-base block mb-1">Family Product</label>
                  <select
                    className="w-full p-2 input input-bordered border px-2 rounded border-gray-300"
                    // className="w-full input input-bordered"
                    value={family || ""}
                    onChange={(e) => setFamily(e.target.value || undefined)}
                  >
                    <option value="">Select </option>
                    <option value="Family 1">Family 1</option>
                    <option value="Family 2">Family 2</option>
                    <option value="Tiles">Tiles</option>
                    <option value="Marble">Marble</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setFamily(undefined);
                      setSearch("");
                      setPage(1);
                    }}
                    className="flex-1 bg-transparent cursor-pointer hover:bg-[#7E1800] hover:text-white btn btn-ghost border border-[#7E1800] text-[#7E1800]"
                  >
                    Clear All Filters
                  </Button>
                  <Button
                    onClick={handleApplyFilter}
                    className="flex-1 btn bg-[#7E1800] hover:bg-red-800 cursor-pointer text-white"
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </aside>

        {/* Products column */}
        <main className="flex-1">
          {/* <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">All Products</h2>

            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Page {page} of {lastPage}
              </div>
              <div className="ml-2 flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page >= lastPage}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            </div>
          </div> */}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton Loading State */}
            {isLoading &&
              [...Array(3)].map((_, i) => (
                <Card
                  key={`skeleton-${i}`}
                  className="p-3 rounded-xl overflow-hidden"
                >
                  <div className="flex flex-col">
                    {/* Image Skeleton */}
                    <Skeleton className="w-full h-[220px]" />

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-3">
                      {/* Name + Price Skeleton */}
                      <div className="flex items-start justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>

                      {/* Description Skeleton */}
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>

                      {/* Buttons Skeleton */}
                      <div className="flex items-center justify-between gap-3 mt-2">
                        <Skeleton className="w-10 h-10" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

            {/* Error */}
            {isError && <div>Error loading products.</div>}

            {/* No Products Found */}
            {!isLoading && products.length === 0 && (
              <div className="col-span-full text-center py-8">
                No products found.
              </div>
            )}

            {/* Products */}
            {products.map((p) => (
              <Card
                key={p._id}
                className="p-3 hover:shadow-md rounded-xl overflow-hidden"
              >
                <div className="flex flex-col">
                  {/* Image */}
                  <div className="w-full h-[220px] relative bg-gray-100">
                    {p.productImage && p.productImage[0]?.url ? (
                      <Image
                        src={p.productImage[0].url}
                        alt={p.productName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-3">
                    {/* Name + Price */}
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-semibold text-gray-800">
                        {p.productName}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {p.unitSizeCustomizationNote ??
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum been the standard dummy text..."}
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center justify-between gap-3 mt-2">
                      {/* <Link href={`/cart`} className="w-10 h-10">
                        <Button className="w-10 h-10 cursor-pointer flex items-center justify-center bg-transparent border border-gray-300 hover:bg-[#7E1800] hover:text-white text-gray-700 rounded-none">
                          <ShoppingCart size={16} />
                        </Button>
                      </Link> */}

                      <Link href={`/products/${p._id}`} className="w-full">
                        <Button className="group w-full bg-[#7E1800] hover:bg-red-800 cursor-pointer text-white rounded-none flex items-center justify-center gap-2 py-2 transition-all">
                          <span>Buy Now</span>

                          <ShoppingBag
                            size={16}
                            className="opacity-0 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                          />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination (bottom) */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {page} of {lastPage}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="btn btn-sm btn-outline"
              >
                First
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-sm btn-outline"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage}
                className="btn btn-sm btn-outline"
              >
                Next
              </button>
              <button
                onClick={() => setPage(lastPage)}
                disabled={page === lastPage}
                className="btn btn-sm btn-outline"
              >
                Last
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllProduct;
