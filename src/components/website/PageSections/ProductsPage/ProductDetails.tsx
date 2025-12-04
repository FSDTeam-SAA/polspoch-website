"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useProduct } from "@/lib/hooks/useProduct";
import { Product, ProductFeature } from "@/lib/types/product";
import {
  ShoppingCart,
  ShoppingBag,
  Edit3,
  Info,
  Plus,
  Minus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(id ?? "", !!id);

  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);

  // Feature-based selection
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null
  );
  const [selectedUnitSizeMm, setSelectedUnitSizeMm] = useState<number | null>(
    null
  );
  const [rangeLengthMeters, setRangeLengthMeters] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [customLength, setCustomLength] = useState<string>("");

  // Initialize range value when product loads
  React.useEffect(() => {
    if (!product) return;
    const minv = product.minRange ?? 1;
    setRangeLengthMeters(minv);
  }, [product]);

  // Get selected feature object
  const selectedFeature = useMemo(() => {
    if (!selectedFeatureId || !product) return null;
    return product.features?.find((f) => f._id === selectedFeatureId);
  }, [selectedFeatureId, product]);

  // Get all unique thickness values for initial selection
  const thicknessOptions = useMemo(() => {
    if (!product?.features) return [];
    const set = new Set<number>();
    product.features.forEach((f) => {
      if (typeof f.thickness === "number") set.add(f.thickness);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [product]);

  // Calculate price
  const displayedPrice = useMemo(() => {
    if (!selectedFeature) return null;

    const pricePerMeter = selectedFeature.miterPerUnitPrice ?? 0;

    // If user selected a specific unit size (in mm)
    if (selectedUnitSizeMm !== null) {
      const meters = selectedUnitSizeMm / 1000; // Convert mm to meter
      return (pricePerMeter * meters * quantity).toFixed(2);
    }

    // Otherwise use range slider (already in meters)
    return (pricePerMeter * rangeLengthMeters * quantity).toFixed(2);
  }, [selectedFeature, selectedUnitSizeMm, rangeLengthMeters, quantity]);

  // Handle thickness selection - locks to a feature
  const handleThicknessSelect = (thickness: number) => {
    if (!product?.features) return;
    const feature = product.features.find((f) => f.thickness === thickness);
    if (feature) {
      setSelectedFeatureId(feature._id ?? null);
      setSelectedUnitSizeMm(null); // Reset unit size selection
      setCustomLength(""); // Reset custom length
    }
  };

  // Handle unit size button click
  const handleUnitSizeSelect = (size: number) => {
    setSelectedUnitSizeMm(size);
    setCustomLength(String(size));
  };

  // Handle custom length input
  const handleCustomLengthSubmit = () => {
    const parsed = parseFloat(customLength);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedUnitSizeMm(parsed);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <Skeleton className="w-full h-[520px] mb-4" />
            <div className="flex gap-3">
              <Skeleton className="w-20 h-20" />
              <Skeleton className="w-20 h-20" />
              <Skeleton className="w-20 h-20" />
            </div>
          </div>
          <div className="lg:col-span-6">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-600">
          Failed to load product. {error?.message ?? ""}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Image Section - UNCHANGED */}
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
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3 items-center">
            {product.productImage && product.productImage.length > 0 ? (
              product.productImage.map((img, idx) => (
                <button
                  key={img._id ?? idx}
                  onClick={() => setSelectedThumbnail(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedThumbnail === idx
                      ? "border-rose-800"
                      : "border-gray-300"
                  } p-0`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img?.url}
                      alt={`${product.productName}-${idx}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500">No thumbnails</div>
            )}
          </div>
        </div>

        {/* RIGHT: Product Details - MODIFIED */}
        <div className="lg:col-span-6 flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-3">
            {product.productName}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Crafted for strength and durability. Available in multiple sizes and
            finishes. {product.unitSizeCustomizationNote ?? ""}
          </p>

          {/* Step 1: Select Thickness (locks to feature) */}
          <div className="mb-6">
            <div className="text-sm font-medium text-rose-800 mb-2">
              Step 1: Select Thickness (mm)
            </div>
            <div className="flex flex-wrap gap-2">
              {thicknessOptions.length === 0 ? (
                <div className="text-sm text-gray-400">
                  No thickness options available
                </div>
              ) : (
                thicknessOptions.map((thickness) => {
                  const isSelected = selectedFeature?.thickness === thickness;

                  return (
                    <button
                      key={thickness}
                      onClick={() => handleThicknessSelect(thickness)}
                      className={`px-4 py-2 rounded border ${
                        isSelected
                          ? "bg-rose-800 border-rose-800 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                      }`}
                    >
                      {thickness}mm
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Show feature details when selected */}
          {selectedFeature && (
            <>
              {/* Feature Info Card */}
              <div className="mb-6 p-4 border rounded-lg bg-rose-50">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Selected Configuration
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-600">
                    Reference:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.reference}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Thickness:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.thickness}mm
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Size1:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.size1}mm
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Size2:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.size2}mm
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Finish:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.finishQuality}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Weight:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.kgsPerUnit} kg/unit
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-600">
                    Price per meter:{" "}
                    <span className="font-medium text-rose-800">
                      €{selectedFeature.miterPerUnitPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2: Length Selection */}
              <div className="mb-6">
                <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                  Step 2: Select Length
                  <Info size={14} className="text-gray-400" />
                </div>

                {/* Custom Length Input */}
                {/* <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    value={customLength}
                    onChange={(e) => setCustomLength(e.target.value)}
                    placeholder="Enter custom length (mm)"
                    className="flex-1 px-3 py-2 border rounded bg-white"
                  />
                  <button 
                    onClick={handleCustomLengthSubmit}
                    className="px-4 py-2 border rounded bg-rose-800 text-white hover:bg-rose-900"
                  >
                    <Edit3 size={16} />
                  </button>
                </div> */}

                {/* Quick Select Unit Sizes */}
                {selectedFeature.unitSizes &&
                  selectedFeature.unitSizes.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">
                        Quick select (mm):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedFeature.unitSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleUnitSizeSelect(size)}
                            className={`px-3 py-1 rounded border ${
                              selectedUnitSizeMm === size
                                ? "bg-rose-100 border-rose-800 text-rose-800"
                                : "bg-gray-100 border-gray-300 text-gray-700 hover:border-rose-400"
                            }`}
                          >
                            {size}mm
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Range Finder (if no unit size selected) */}
              {selectedUnitSizeMm === null && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Or use range finder (meters)
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={product.minRange ?? 1}
                      max={product.maxRange ?? 100}
                      value={rangeLengthMeters}
                      onChange={(e) =>
                        setRangeLengthMeters(Number(e.target.value))
                      }
                      className="flex-1"
                    />
                    <div className="text-lg font-semibold text-rose-800 min-w-[80px] text-right">
                      {rangeLengthMeters}m
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: {product.minRange}m</span>
                    <span>Max: {product.maxRange}m</span>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {/* <div className="mb-6">
                <div className="text-sm font-medium text-rose-800 mb-2">Quantity</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border rounded text-center"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div> */}

              {/* Price Display */}
              <div className="mb-6 p-4 border-2 border-rose-800 rounded-lg bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-rose-800">
                      €{displayedPrice ?? "—"}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedUnitSizeMm
                        ? `Based on ${selectedUnitSizeMm}mm × ${quantity} qty`
                        : `Based on ${rangeLengthMeters}m × ${quantity} qty`}
                    </div>
                  </div>
                  <div className="text-xs text-rose-600 text-right">
                    Free shipping
                    <br />
                    for orders above €500
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button className="w-full py-4 border-2 border-rose-800 text-rose-800 rounded-lg text-lg font-medium flex items-center justify-center gap-3 hover:bg-rose-50 transition">
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <button className="w-full py-4 bg-rose-800 text-white rounded-lg text-lg font-medium flex items-center justify-center gap-3 hover:bg-rose-900 transition">
                  <ShoppingBag size={20} /> Order Now
                </button>
              </div>

              {/* Additional Info */}
              {/* <div className="text-xs text-gray-500 pt-4 border-t">
                <span className="mr-4">Range: {product.minRange}-{product.maxRange}m</span>
                <span className="mr-4">Unit: {product.measureUnit}</span>
                <span>Updated: {fmtDate(product.updatedAt)}</span>
              </div> */}
            </>
          )}

          {/* Initial message when no feature selected */}
          {!selectedFeature && (
            <div className="mt-8 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <Info size={32} className="mx-auto mb-2 text-gray-400" />
              <p>Please select a thickness to view available options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
