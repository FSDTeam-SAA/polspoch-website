// "use client";

// import { Card } from "@/components/ui/card";
// import { useProduct } from "@/lib/hooks/useProduct";
// import { useParams } from "next/navigation";
// import Image from "next/image";

// export default function ProductDetails() {
//   const { id } = useParams(); // /product/[id]
//   const { data, isLoading, error } = useProduct(id as string);

//   if (isLoading) {
//     return <div className="container mx-auto py-10">Loading product...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-10 text-red-500">
//         Failed to load product.
//       </div>
//     );
//   }

//   const product = data;
//   console.log("asdjfasasdfsadf",data )

//   // derive a safe image src: product.productImage may be an array of strings or objects
//   const images = product?.productImage;
//   const imageSrc =
//     images && Array.isArray(images) && images.length > 0
//       ? typeof images[0] === "string"
//         ? images[0]
//         : (images[0]?.url ?? "/placeholder.png")
//       : "/placeholder.png";

//   return (
//     <div className="container mx-auto py-10">
//       <Card className="p-6 shadow-md">
//         {/* Product Image */}
//         {product?._id && (
//           <div className="w-full flex justify-center mb-6">
//             <Image
//               src={imageSrc}
//               alt={product?.productName || "Product Image"}
//               width={400}
//               height={300}
//               className="rounded-lg object-cover"
//             />
//           </div>
//         )}

//         {/* Product Info */}
//         <h1 className="text-3xl font-semibold mb-4">{product?.productName}</h1>

//         <p className="text-gray-600 mb-4">{product.description}</p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//           <div className="flex justify-between border-b py-2">
//             <span className="font-medium">Family:</span>
//             <span>{product.family || "N/A"}</span>
//           </div>

//           <div className="flex justify-between border-b py-2">
//             <span className="font-medium">Category:</span>
//             <span>{product.category || "N/A"}</span>
//           </div>

//           <div className="flex justify-between border-b py-2">
//             <span className="font-medium">Price:</span>
//             <span>{product.price ? `${product.price} Tk` : "N/A"}</span>
//           </div>

//           <div className="flex justify-between border-b py-2">
//             <span className="font-medium">SKU:</span>
//             <span>{product.sku || "N/A"}</span>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }
"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useProduct } from "@/lib/hooks/useProduct";
import { Product, ProductFeature } from "@/lib/types/product";
import { ShoppingCart, ShoppingBag, Edit3, Info } from "lucide-react";

function fmtDate(iso?: string) {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ProductDetailsCard() {
  const { id } = useParams() as { id?: string };
  const { data: rawData, isLoading, isError, error } = useProduct(id ?? "", !!id);

  // normalize response shape
  const product: Product | undefined = useMemo(() => {
    if (!rawData) return undefined;
    // rawData may be { success, data: Product } or Product itself
    
    if (rawData?.data && rawData.data._id) return rawData.data as Product;
    
    if (rawData?._id) return rawData as Product;
    return undefined;
  }, [rawData]);

  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const [selectedLongest, setSelectedLongest] = useState<number | null>(null);
  const [selectedShortest, setSelectedShortest] = useState<number | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<number | null>(null);
  const [customLength, setCustomLength] = useState<string>("");
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // derive option lists from features
  const longestOptions = useMemo(() => {
    const s = new Set<number>();
    product?.features?.forEach((f) => {
      if (typeof f.size1 === "number") s.add(f.size1);
    });
    return Array.from(s).sort((a, b) => a - b);
  }, [product]);

  const shortestOptions = useMemo(() => {
    const s = new Set<number>();
    product?.features?.forEach((f) => {
      if (typeof f.size2 === "number") s.add(f.size2);
    });
    return Array.from(s).sort((a, b) => a - b);
  }, [product]);

  const thicknessOptions = useMemo(() => {
    const s = new Set<number>();
    product?.features?.forEach((f) => {
      if (typeof f.thickness === "number") s.add(f.thickness);
    });
    return Array.from(s).sort((a, b) => a - b);
  }, [product]);

  const finishOptions = useMemo(() => {
    // prefer finishes from features, fallback to a static list
    const s = new Set<string>();
    product?.features?.forEach((f) => {
      if (f.finishQuality) s.add(f.finishQuality);
    });
    if (s.size === 0) {
      ["Sendzimir Galvanized", "Cold finished LC", "Cold rolled cold finished", "Hot forming", "Cold galvanized finish", "Cold forming pickling"].forEach(x => s.add(x));
    }
    return Array.from(s);
  }, [product]);

  // unit sizes (for price selection etc)
  const unitSizes = useMemo(() => {
    const set = new Set<number>();
    product?.features?.forEach((f) => f.unitSizes?.forEach((u) => set.add(u)));
    return Array.from(set).sort((a, b) => a - b);
  }, [product]);

  // price calculation: prefer a feature that matches selected options
  const displayedPrice = useMemo(() => {
    if (!product) return null;
    // try to find feature that matches longest/shortest/thickness
    const findMatch = () =>
      product.features.find((f) => {
        if (selectedLongest != null && f.size1 !== selectedLongest) return false;
        if (selectedShortest != null && f.size2 !== selectedShortest) return false;
        if (selectedThickness != null && f.thickness !== selectedThickness) return false;
        return typeof f.miterPerUnitPrice === "number";
      });
    const match = findMatch();
    if (match) return match.miterPerUnitPrice;
    const first = product.features.find((f) => typeof f.miterPerUnitPrice === "number");
    return first?.miterPerUnitPrice ?? null;
  }, [product, selectedLongest, selectedShortest, selectedThickness]);

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading product...</div>;
  }
  if (isError || !product) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-600">Failed to load product. {error?.message ?? ""}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <Card className="p-6"> */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: big image + thumbnails */}
          <div className="lg:col-span-6">
            <div className="rounded-lg overflow-hidden border bg-gray-50">
              <div className="relative w-full h-[520px]">
                {product.productImage?.[selectedThumbnail]?.url ? (
                  <Image
                    src={product.productImage[selectedThumbnail].url}
                    alt={product.productName}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
            </div>

            {/* thumbnails */}
            <div className="mt-4 flex gap-3 items-center">
              {product.productImage && product.productImage.length > 0 ? (
                product.productImage.map((img, idx) => (
                  <button
                    key={img._id ?? idx}
                    onClick={() => setSelectedThumbnail(idx)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${selectedThumbnail === idx ? "border-rose-800" : "border-gray-300"} p-0`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img.url} alt={`${product.productName}-${idx}`} fill style={{ objectFit: "cover" }} />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-gray-500">No thumbnails</div>
              )}
            </div>
          </div>

          {/* Right: details & selectors */}
          <div className="lg:col-span-6 flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-semibold mb-3">{product.productName}</h1>
            <p className="text-sm text-gray-500 mb-6">
              Crafted for strength and durability. Available in multiple sizes and finishes. {product.unitSizeCustomizationNote ?? ""}
            </p>

            {/* Option rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Longest side */}
              <div>
                <div className="text-sm font-medium text-rose-800 mb-2">Longest Side (mm)</div>
                <div className="flex flex-wrap gap-2">
                  {longestOptions.length === 0 ? <div className="text-sm text-gray-400">—</div> :
                    longestOptions.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedLongest(v)}
                        className={`px-3 py-1 rounded border ${selectedLongest === v ? "bg-rose-100 border-rose-800 text-rose-800" : "bg-black/40 border-gray-600 text-gray-200"}`}
                      >
                        {v}
                      </button>
                    ))
                  }
                </div>
              </div>

              {/* Shortest side */}
              <div>
                <div className="text-sm font-medium text-rose-800 mb-2">Shortest Side (mm)</div>
                <div className="flex flex-wrap gap-2">
                  {shortestOptions.length === 0 ? <div className="text-sm text-gray-400">—</div> :
                    shortestOptions.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedShortest(v)}
                        className={`px-3 py-1 rounded border ${selectedShortest === v ? "bg-rose-100 border-rose-800 text-rose-800" : "bg-black/40 border-gray-600 text-gray-200"}`}
                      >
                        {v}
                      </button>
                    ))
                  }
                </div>
              </div>

              {/* Thickness */}
              <div>
                <div className="text-sm font-medium text-rose-800 mb-2">Thickness</div>
                <div className="flex flex-wrap gap-2">
                  {thicknessOptions.length === 0 ? <div className="text-sm text-gray-400">—</div> :
                    thicknessOptions.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedThickness(v)}
                        className={`px-3 py-1 rounded border ${selectedThickness === v ? "bg-rose-100 border-rose-800 text-rose-800" : "bg-black/40 border-gray-600 text-gray-200"}`}
                      >
                        {v}
                      </button>
                    ))
                  }
                </div>
              </div>

              {/* Custom Length input + quick selects */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-rose-800">Long</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1"><Info size={14} /></div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <input
                    value={customLength}
                    onChange={(e) => setCustomLength(e.target.value)}
                    placeholder="Custom Length"
                    className="flex-1 px-3 py-2 border rounded bg-black/5"
                  />
                  <button className="p-2 border rounded bg-white/5"><Edit3 size={16} /></button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {unitSizes.length === 0 ? <div className="text-sm text-gray-400">—</div> :
                    unitSizes.map((v) => (
                      <button
                        key={v}
                        onClick={() => { setCustomLength(String(v)); }}
                        className="px-3 py-1 rounded border bg-black/40 border-gray-600 text-gray-200"
                      >
                        {v}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Finish (two column buttons) */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-rose-800">Finish</div>
                <div className="text-xs text-gray-400">Choose finish</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {finishOptions.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFinish(f)}
                    className={`py-3 px-4 rounded border text-sm text-left ${selectedFinish === f ? "bg-rose-100 border-rose-800 text-rose-800" : "bg-black/40 border-gray-600 text-gray-200"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + shipping + CTAs */}
            <div className="mt-8 flex flex-col gap-6">
              {/* <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">€{displayedPrice ?? "—"}</div>
                  <div className="text-sm text-gray-400">/1 kg</div>
                </div>
                <div className="text-sm text-rose-600">Free shipping for orders above €500</div>
              </div> */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="w-full py-4 border rounded text-lg flex items-center justify-center gap-3">
                  <ShoppingCart /> Add to Cart
                </button>
                <button className="w-full py-4 bg-rose-800 text-white rounded text-lg flex items-center justify-center gap-3">
                  <ShoppingBag /> Order Now
                </button>
              </div>

              {/* small info row */}
              <div className="text-xs text-gray-500 mt-2">
                <span className="mr-4">Min: {product.minRange ?? "N/A"}</span>
                <span className="mr-4">Max: {product.maxRange ?? "N/A"}</span>
                <span>Updated: {fmtDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      {/* </Card> */}
    </div>
  );
}
