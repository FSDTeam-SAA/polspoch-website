//components/website/PageSections/ProductsPage/ProductDetails.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useProduct } from "@/lib/hooks/useProduct";
import {
  ShoppingCart,
  Plus,
  Minus,
  HelpCircle,
  ListChecks,
  Ruler,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// Shipping cost calculation based on weight and length
function calculateShippingCost(
  weightKg: number,
  lengthMm: number,
  isCourier: boolean
): number {
  if (isCourier) {
    // COURIER SHIPPING (Green Sizes)
    // BASE PRICE: 15 € (0-2000mm, Up to 30kgs)
    let cost = 15;

    // Extra Size: +20 € (>= 2000mm)
    if (lengthMm >= 2000) {
      cost += 20;
    }

    // Extra KG: +0.5 €/KG (> 30kgs)
    if (weightKg > 30) {
      const extraKg = weightKg - 30;
      cost += extraKg * 0.5;
    }

    // MAXIMUM: 150 € (Cap)
    return Math.min(cost, 150);
  } else {
    // TRUCK DELIVERY SERVICE (Blue Sizes)
    // MINIMUM PRICE: 60 € (Up to 1000 kgs)
    let cost = 60;

    // Extra 500 kgs: +10 €/500 kgs (> 1000 kgs)
    if (weightKg > 1000) {
      const extraWeight = weightKg - 1000;
      const extra500kgUnits = Math.ceil(extraWeight / 500);
      cost += extra500kgUnits * 10;
    }

    return cost;
  }
}

// Helper tooltips
const TOOLTIPS = {
  thickness: "Thickness determines product strength. Thicker = Stronger",
  size1: "Primary dimension - width or diameter of the product",
  size2:
    "Secondary dimension - height or second dimension (required for this product)",
  finishQuality: `Finish Quality Options:
• Mill Finish: Standard (economical)
• Polished: Glossy (medium price)
• Galvanized: Rust-resistant (outdoor use)
• Powder Coated: Colored + Durable (premium)`,
  length: "Length - how long you want the product",
  shipping: "Shipping cost calculated based on weight and length",
};

// Tooltip component
const Tooltip = ({
  text,
  step,
  showTooltip,
  setShowTooltip,
}: {
  text: string;
  step: string;
  showTooltip: string | null;
  setShowTooltip: (step: string | null) => void;
}) => (
  <div className="relative inline-block">
    <button
      type="button"
      onMouseEnter={() => setShowTooltip(step)}
      onMouseLeave={() => setShowTooltip(null)}
      onClick={() => setShowTooltip(showTooltip === step ? null : step)}
      className="ml-2 text-gray-400 hover:text-rose-800 transition-colors"
      aria-label="Help"
    >
      <HelpCircle size={16} />
    </button>
    {showTooltip === step && (
      <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 whitespace-pre-line">
        {text}
        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
      </div>
    )}
  </div>
);

export default function ProductDetailsCard() {
  const { id } = useParams() as { id?: string };
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(id ?? "", !!id);

  // Progressive filtering state
  const [selectedThickness, setSelectedThickness] = useState<number | null>(
    null
  );
  const [selectedSize1, setSelectedSize1] = useState<number | null>(null);
  const [selectedSize2, setSelectedSize2] = useState<number | null>(null);
  const [selectedFinishQuality, setSelectedFinishQuality] = useState<
    string | null
  >(null);

  // Length and shipping
  const [selectedUnitSizeMm, setSelectedUnitSizeMm] = useState<number | null>(
    null
  );
  const [rangeLengthMeters, setRangeLengthMeters] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);

  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const { mutate: addToCartMutate, isPending } = useAddToCart({
    token,
  });

  // Initialize range value when product loads
  React.useEffect(() => {
    if (!product) return;
    const minv = product.minRange ?? 1;
    setRangeLengthMeters(minv);
  }, [product]);

  // STEP 1: Get unique thickness values
  const thicknessOptions = useMemo(() => {
    if (!product?.features) return [];
    const set = new Set<number>();
    product.features.forEach((f) => {
      if (typeof f.thickness === "number") set.add(f.thickness);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [product]);

  // STEP 2: Get Size1 options based on selected thickness
  const size1Options = useMemo(() => {
    if (!product?.features || selectedThickness === null) return [];
    const set = new Set<number>();
    product.features.forEach((f) => {
      if (f.thickness === selectedThickness && typeof f.size1 === "number") {
        set.add(f.size1);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [product, selectedThickness]);

  // STEP 3: Get Size2 options based on thickness and size1 (size2 is required)
  const size2Options = useMemo(() => {
    if (
      !product?.features ||
      selectedThickness === null ||
      selectedSize1 === null
    )
      return [];
    const set = new Set<number>();
    product.features.forEach((f) => {
      if (
        f.thickness === selectedThickness &&
        f.size1 === selectedSize1 &&
        typeof f.size2 === "number"
      ) {
        set.add(f.size2);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [product, selectedThickness, selectedSize1]);

  // STEP 4: Get Finish Quality options
  const finishQualityOptions = useMemo(() => {
    if (
      !product?.features ||
      selectedThickness === null ||
      selectedSize1 === null ||
      selectedSize2 === null
    )
      return [];
    const set = new Set<string>();
    product.features.forEach((f) => {
      if (
        f.thickness === selectedThickness &&
        f.size1 === selectedSize1 &&
        f.size2 === selectedSize2 &&
        f.finishQuality
      ) {
        set.add(f.finishQuality);
      }
    });
    return Array.from(set).sort();
  }, [product, selectedThickness, selectedSize1, selectedSize2]);

  // Get the final selected feature (requires size2)
  const selectedFeature = useMemo(() => {
    if (
      !product?.features ||
      selectedThickness === null ||
      selectedSize1 === null ||
      selectedSize2 === null ||
      selectedFinishQuality === null
    )
      return null;

    return (
      product.features.find(
        (f) =>
          f.thickness === selectedThickness &&
          f.size1 === selectedSize1 &&
          f.size2 === selectedSize2 &&
          f.finishQuality === selectedFinishQuality
      ) || null
    );
  }, [
    product,
    selectedThickness,
    selectedSize1,
    selectedSize2,
    selectedFinishQuality,
  ]);

  // Get available unit sizes for the selected feature
  const availableUnitSizes = useMemo(() => {
    return selectedFeature?.unitSizes || [];
  }, [selectedFeature]);

  // Calculate total weight (kg)
  const totalWeight = useMemo(() => {
    if (!selectedFeature) return 0;
    const kgsPerUnit = selectedFeature.kgsPerUnit ?? 0;

    if (selectedUnitSizeMm !== null) {
      const meters = selectedUnitSizeMm / 1000;
      return kgsPerUnit * meters * quantity;
    }

    // rangeLengthMeters is in meters
    return kgsPerUnit * rangeLengthMeters * quantity;
  }, [selectedFeature, selectedUnitSizeMm, rangeLengthMeters, quantity]);

  // Calculate shipping cost and method automatically
  const { shippingCost, shippingMethod } = useMemo(() => {
    if (!selectedFeature) return { shippingCost: 0, shippingMethod: "courier" };

    const lengthMm = selectedUnitSizeMm ?? rangeLengthMeters * 1000;

    // Auto-determine method: > 2500mm requires Truck
    // Also logic: if weight > 150kg, usually Truck is better/required?
    // For now, adhering to the length rule found in comments.
    const isCourier = lengthMm <= 2500;

    const cost = calculateShippingCost(totalWeight, lengthMm, isCourier);

    return {
      shippingCost: cost,
      shippingMethod: isCourier ? "courier" : "truck",
    };
  }, [selectedFeature, totalWeight, selectedUnitSizeMm, rangeLengthMeters]);

  // Calculate product price
  const productPrice = useMemo(() => {
    if (!selectedFeature) return 0;
    const pricePerMeter = selectedFeature.miterPerUnitPrice ?? 0;

    if (selectedUnitSizeMm !== null) {
      const meters = selectedUnitSizeMm / 1000;
      return pricePerMeter * meters * quantity;
    }

    return pricePerMeter * rangeLengthMeters * quantity;
  }, [selectedFeature, selectedUnitSizeMm, rangeLengthMeters, quantity]);

  // Total price including shipping
  const totalPrice = useMemo(() => {
    return productPrice + shippingCost;
  }, [productPrice, shippingCost]);

  // Selection handlers with progressive reset
  const handleThicknessSelect = (thickness: number) => {
    setSelectedThickness(thickness);
    setSelectedSize1(null);
    setSelectedSize2(null);
    setSelectedFinishQuality(null);
    setSelectedUnitSizeMm(null);
  };

  const handleSize1Select = (size: number) => {
    setSelectedSize1(size);
    setSelectedSize2(null);
    setSelectedFinishQuality(null);
    setSelectedUnitSizeMm(null);
  };

  const handleSize2Select = (size: number) => {
    setSelectedSize2(size);
    setSelectedFinishQuality(null);
    setSelectedUnitSizeMm(null);
  };

  const handleFinishQualitySelect = (quality: string) => {
    setSelectedFinishQuality(quality);
    setSelectedUnitSizeMm(null);
  };

  const handleUnitSizeSelect = (size: number) => {
    // Toggle: if clicking the currently selected size, unselect it (reverting to custom length mode)
    if (selectedUnitSizeMm === size) {
      setSelectedUnitSizeMm(null);
    } else {
      setSelectedUnitSizeMm(size);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRangeLengthMeters(val);
    setSelectedUnitSizeMm(null); // Switch to custom mode automatically
  };

  // Calculate current step number and status message
  const stepStatus = useMemo(() => {
    if (selectedThickness === null) {
      return {
        emoji: "👆",
        title: "Begin Customization",
        description:
          "Select a thickness above to view available sizes, pricing, and shipping costs.",
      };
    }
    if (selectedSize1 === null) {
      return {
        emoji: "👆",
        title: "Select Size 1",
        description: "Select Size 1 (Width/Diameter) to proceed.",
      };
    }
    if (selectedSize2 === null) {
      return {
        emoji: "👆",
        title: "Select Size 2",
        description: "Select Size 2 (Height / Second Dimension) to continue.",
      };
    }
    if (selectedFinishQuality === null) {
      return {
        emoji: "👆",
        title: "Select Finish",
        description:
          "Select a Finish Quality to view final pricing and shipping options.",
      };
    }
    return {
      emoji: "🎉",
      title: "Configuration Complete",
      description: "Review your selection below.",
    };
  }, [selectedThickness, selectedSize1, selectedSize2, selectedFinishQuality]);

  // Checkout / Add to cart handlers (placeholder)
  const canCheckout =
    !!selectedFeature &&
    (selectedUnitSizeMm !== null || rangeLengthMeters > 0) &&
    quantity > 0;

  // const handleAddToCart = () => {
  //   if (!canCheckout) return;
  //   // Implement add-to-cart logic with your cart API
  //   console.log("Add to cart:", {
  //     productId: product?._id,
  //     reference: selectedFeature?.reference,
  //     thickness: selectedThickness,
  //     size1: selectedSize1,
  //     size2: selectedSize2,
  //     finish: selectedFinishQuality,
  //     lengthMm: selectedUnitSizeMm ?? rangeLengthMeters * 1000,
  //     quantity,
  //     price: totalPrice,
  //     shippingMethod,
  //   });
  //   alert("Added to cart (placeholder)");
  // };

  const handleAddToCart = () => {
    if (!canCheckout || !selectedFeature || !product) return;

    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    const payload = {
      productId: product._id,
      type: "product",
      quantity,
      reference: selectedFeature.reference,
      thickness: selectedThickness,
      size1: selectedSize1,
      size2: selectedSize2,
      finish: selectedFinishQuality,
      lengthMm: selectedUnitSizeMm ?? rangeLengthMeters * 1000,
      price: totalPrice,
      shippingMethod,
    };
    console.log("DEBUG: AddToCart Payload:", payload);

    addToCartMutate(payload);
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
        {/* LEFT: Image Section */}
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
          <div className="mt-4 flex gap-3 items-center overflow-x-auto pb-2">
            {product.productImage && product.productImage.length > 0 ? (
              product.productImage.map((img, idx) => (
                <button
                  key={img._id ?? idx}
                  onClick={() => setSelectedThumbnail(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
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

        {/* RIGHT: Progressive Selection */}
        <div className="lg:col-span-6 flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-3">
            {product.productName}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {product.productDescription ||
              "Crafted for strength and durability. Available in multiple sizes and finishes."}
          </p>

          {/* STEP 1: Select Thickness */}
          <div className="mb-6">
            <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
              <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Select Thickness
              <Tooltip
                text={TOOLTIPS.thickness}
                step="thickness"
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
              />
              {selectedThickness === null && (
                <span className="ml-auto text-xs text-rose-600 font-medium animate-pulse">
                  👉 Choose to continue
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {thicknessOptions.length === 0 ? (
                <div className="text-sm text-gray-400">
                  No thickness options available
                </div>
              ) : (
                thicknessOptions.map((thickness) => (
                  <button
                    key={thickness}
                    onClick={() => handleThicknessSelect(thickness)}
                    className={`px-4 py-2 rounded border transition-all ${
                      selectedThickness === thickness
                        ? "bg-rose-800 border-rose-800 text-white shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                    }`}
                  >
                    {thickness}mm
                  </button>
                ))
              )}
            </div>
          </div>

          {/* STEP 2: Select Size 1 */}
          {selectedThickness !== null && (
            <div className="mb-6">
              <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Select Size 1 (Width/Diameter)
                <Tooltip
                  text={TOOLTIPS.size1}
                  step="size1"
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
                {selectedSize1 === null && (
                  <span className="ml-auto text-xs text-rose-600 font-medium animate-pulse">
                    👉 Choose to continue
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {size1Options.length === 0 ? (
                  <div className="text-sm text-gray-400">
                    No size options available
                  </div>
                ) : (
                  size1Options.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSize1Select(size)}
                      className={`px-4 py-2 rounded border transition-all ${
                        selectedSize1 === size
                          ? "bg-rose-800 border-rose-800 text-white shadow-md"
                          : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                      }`}
                    >
                      {size}mm
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Select Size 2 (required) */}
          {selectedSize1 !== null && (
            <div className="mb-6">
              <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Select Size 2 (Height / Second Dimension) —{" "}
                <span className="font-medium">required</span>
                <Tooltip
                  text={TOOLTIPS.size2}
                  step="size2"
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
                {selectedSize2 === null && (
                  <span className="ml-auto text-xs text-rose-600 font-medium animate-pulse">
                    👉 Choose to continue
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {size2Options.length === 0 ? (
                  <div className="text-sm text-gray-400">
                    No size2 options available for this Thickness & Size 1
                  </div>
                ) : (
                  size2Options.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSize2Select(size)}
                      className={`px-4 py-2 rounded border transition-all ${
                        selectedSize2 === size
                          ? "bg-rose-800 border-rose-800 text-white shadow-md"
                          : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                      }`}
                    >
                      {size}mm
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Select Finish Quality */}
          {selectedSize2 !== null && (
            <div className="mb-6">
              <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  4
                </span>
                Select Finish Quality
                <Tooltip
                  text={TOOLTIPS.finishQuality}
                  step="finishQuality"
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
                {selectedFinishQuality === null && (
                  <span className="ml-auto text-xs text-rose-600 font-medium animate-pulse">
                    👉 Choose to continue
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {finishQualityOptions.length === 0 ? (
                  <div className="text-sm text-gray-400">
                    No finish options available
                  </div>
                ) : (
                  finishQualityOptions.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleFinishQualitySelect(quality)}
                      className={`px-4 py-2 rounded border transition-all ${
                        selectedFinishQuality === quality
                          ? "bg-rose-800 border-rose-800 text-white shadow-md"
                          : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                      }`}
                    >
                      {quality}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Show feature details when selected */}
          {selectedFeature ? (
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
                    Size 1:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.size1}mm
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Size 2:{" "}
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
                      {selectedFeature.kgsPerUnit} kg/m
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

              {/* STEP 5: Length Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-rose-800 flex items-center gap-2">
                    <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      5
                    </span>
                    Select Length
                    <Tooltip
                      text={TOOLTIPS.length}
                      step="length"
                      showTooltip={showTooltip}
                      setShowTooltip={setShowTooltip}
                    />
                  </div>
                  {/* Status Indicator */}
                  {selectedUnitSizeMm === null ? (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                      Mod: Custom Length
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                      Mod: Standard Size
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: Standard Sizes */}
                  {availableUnitSizes.length > 0 && (
                    <div
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedUnitSizeMm !== null
                          ? "border-rose-600 bg-rose-50/30"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ListChecks size={16} className="text-rose-600" />
                        Standard Lengths
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableUnitSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleUnitSizeSelect(size)}
                            className={`px-3 py-2 text-sm rounded-lg border font-medium transition-all w-full sm:w-auto ${
                              selectedUnitSizeMm === size
                                ? "bg-rose-600 text-white border-rose-600 shadow-sm transform scale-105"
                                : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-600"
                            }`}
                          >
                            {size}mm
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                        Select a standard size for quicker delivery. Click again
                        to deselect.
                      </p>
                    </div>
                  )}

                  {/* Option B: Custom Length */}
                  <div
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedUnitSizeMm === null
                        ? "border-rose-600 bg-rose-50/30"
                        : "border-gray-100 bg-white hover:border-gray-200 opacity-90"
                    }`}
                    onClick={() => {
                      if (selectedUnitSizeMm !== null)
                        setSelectedUnitSizeMm(null);
                    }}
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Ruler size={16} className="text-rose-600" />
                      Custom Length
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative flex-1">
                        <input
                          type="range"
                          min={product.minRange ?? 1}
                          max={product.maxRange ?? 12}
                          step={0.1}
                          value={rangeLengthMeters}
                          onChange={handleRangeChange}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                        />
                      </div>
                      <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white overflow-hidden w-24 focus-within:border-rose-500 transition-colors">
                        <input
                          type="number"
                          min={product.minRange ?? 1}
                          max={product.maxRange ?? 12}
                          step={0.1}
                          value={rangeLengthMeters}
                          onChange={handleRangeChange}
                          className="w-full px-2 py-1.5 text-center text-sm font-medium focus:outline-none"
                        />
                        <span className="pr-2 text-xs text-gray-500 font-medium bg-gray-50 h-full flex items-center border-l">
                          m
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Range:{" "}
                      <span className="font-medium text-gray-900">
                        {product.minRange ?? 1}m
                      </span>{" "}
                      —{" "}
                      <span className="font-medium text-gray-900">
                        {product.maxRange ?? 12}m
                      </span>
                    </p>
                    {selectedUnitSizeMm !== null && (
                      <div className="mt-2 text-xs text-rose-600 font-medium">
                        Click here or drag slider to switch to Custom
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 rounded border bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 rounded border bg-gray-100 hover:bg-gray-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Auto Calculated Shipping Method */}
              <div className="mb-6">
                <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                  <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    6
                  </span>
                  Shipping Method (Auto-Calculated)
                  <Tooltip
                    text={TOOLTIPS.shipping}
                    step="shipping"
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
                <div
                  className={`p-3 rounded border flex items-center justify-between ${
                    shippingMethod === "courier"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-blue-50 border-blue-200 text-blue-800"
                  }`}
                >
                  <span className="font-medium capitalize flex items-center gap-2">
                    {shippingMethod === "courier"
                      ? "Courier Service"
                      : "Truck Delivery"}
                  </span>
                  <span className="text-sm opacity-80">
                    {shippingMethod === "courier"
                      ? "Standard Package (< 2.5m)"
                      : "Large Freight (> 2.5m)"}
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Product Price:</span>
                  <span className="font-medium">
                    €{productPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Shipping:</span>
                  <span className="font-medium">
                    €{shippingCost.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-semibold text-rose-800 border-t pt-3">
                  <span>Total:</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!canCheckout}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    canCheckout
                      ? "bg-white border-rose-800 text-rose-800 hover:bg-rose-50"
                      : "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>

              {/* <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!canCheckout}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    canCheckout
                      ? "bg-white border-rose-800 text-rose-800 hover:bg-rose-50"
                      : "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div> */}
            </>
          ) : (
            <div className="mt-8 p-8 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-center bg-gray-50/50">
              <div className="w-12 h-12 bg-rose-100/50 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl animate-bounce">
                  {stepStatus.emoji}
                </span>
              </div>
              <h3 className="text-gray-900 font-medium mb-1">
                {stepStatus.title}
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                {stepStatus.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
