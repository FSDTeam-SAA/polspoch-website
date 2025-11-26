// src/components/AllProduct.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/types/product";
import Image from "next/image";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import clsx from "clsx";

const DEFAULT_LIMIT = 12;

const AllProduct: React.FC = () => {
  const [family, setFamily] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [filterOpen, setFilterOpen] = useState(false);

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
  const ids = data?.data.map(item => item._id);
console.log(ids);

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
              <CardTitle className="text-sm mb-2">Filter</CardTitle>

              <div className="space-y-4">
                <div>
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
                </div>

                <div>
                  <label className="text-xs block mb-1">Family Product</label>
                  <select
                    className="w-full input input-bordered"
                    value={family || ""}
                    onChange={(e) => setFamily(e.target.value || undefined)}
                  >
                    <option value="">Select Family Product</option>
                    <option value="Family 1">Family 1</option>
                    <option value="Family 2">Family 2</option>
                    <option value="Tiles">Tiles</option>
                    <option value="Marble">Marble</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs block mb-1">Search</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type here..."
                    className="w-full input input-bordered"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFamily(undefined);
                      setSearch("");
                      setPage(1);
                    }}
                    className="flex-1 btn btn-ghost border border-red-300 text-red-600"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={handleApplyFilter}
                    className="flex-1 btn bg-rose-800 text-white"
                  >
                    Apply Filter
                  </button>
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
            {isLoading && <div>Loading products...</div>}
            {isError && <div>Error loading products.</div>}

            {!isLoading && products.length === 0 && (
              <div className="col-span-full text-center py-8">
                No products found.
              </div>
            )}

            {products.map((p) => (
              <Card key={p._id} className="p-0 shadow-md">
                <div className="flex flex-col">
                  {/* Image */}
                  <div className="w-full h-48 relative bg-gray-100">
                    {p.productImage && p.productImage[0]?.url ? (
                      <Image
                        src={p.productImage[0].url}
                        alt={p.productName}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-semibold">{p.productName}</h3>
                      {/* Price — show first feature price if available */}
                      <div className="text-sm font-semibold">
                        €{p.features?.[0]?.miterPerUnitPrice ?? "—"}/1 kg
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-3">
                      {p.unitSizeCustomizationNote ??
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <button className="btn btn-ghost border rounded-md p-2">
                        <ShoppingCart size={16} />
                      </button>

                      <button className="btn w-full bg-rose-800 text-white rounded-md flex items-center justify-center gap-2" onClick={() => console.log(p._id)}>
                        <ShoppingBag size={16} />
                        <span>Buy Now</span>
                      </button>
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
