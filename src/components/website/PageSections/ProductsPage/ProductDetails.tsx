"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useProduct } from "@/lib/hooks/useProduct";
import { ShoppingCart, Plus, Minus, HelpCircle } from "lucide-react";
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

// Helper: Get updated 'available' options for a specific field based on OTHER current selections
const getAvailableOptions = (
  //eslint-disable-next-line
  featureList: any[],
  field: string,
  selections: {
    thickness: number | null;
    size1: number | null;
    size2: number | null;
    finishQuality: string | null;
  }
) => {
  const { thickness, size1, size2, finishQuality } = selections;
  //eslint-disable-next-line
  const options = new Set<any>();

  featureList.forEach((f) => {
    // Check if this feature matches ALL OTHER currently selected filters
    const matchThickness = thickness === null || f.thickness === thickness;
    const matchSize1 = size1 === null || f.size1 === size1;
    const matchSize2 = size2 === null || f.size2 === size2;
    const matchFinish =
      finishQuality === null || f.finishQuality === finishQuality;

    // If we are gathering options for 'thickness', we ignore the 'thickness' filter itself
    // to show all possible thicknesses compatible with size1/size2/finish selection.
    let works = true;
    if (field !== "thickness" && !matchThickness) works = false;
    if (field !== "size1" && !matchSize1) works = false;
    if (field !== "size2" && !matchSize2) works = false;
    if (field !== "finishQuality" && !matchFinish) works = false;

    if (works && f[field] !== undefined && f[field] !== null) {
      options.add(f[field]);
    }
  });

  // Return sorted array
  const arr = Array.from(options);
  if (typeof arr[0] === "number") {
    return arr.sort((a, b) => Number(a) - Number(b));
  }
  return arr.sort();
};

export default function ProductDetailsCard() {
  const { id } = useParams() as { id?: string };
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(id ?? "", !!id);

  // Faceted filtering state
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
  const [rangeLengthMm, setRangeLengthMm] = useState<number>(1000);
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
    const minMeters = product.minRange ?? 1;
    setRangeLengthMm(minMeters * 1000);
  }, [product]);

  // --- FACETED LOGIC ---

  const featureList = useMemo(() => product?.features || [], [product]);

  // Derived unique options for rendering
  const allSize1s = useMemo(() => {
    const all = new Set<number>();
    featureList.forEach((f) => f.size1 && all.add(f.size1));
    return Array.from(all).sort((a, b) => a - b);
  }, [featureList]);

  const allThicknesses = useMemo(() => {
    const all = new Set<number>();
    featureList.forEach((f) => f.thickness && all.add(f.thickness));
    return Array.from(all).sort((a, b) => a - b);
  }, [featureList]);

  const allFinishQualities = useMemo(() => {
    const all = new Set<string>();
    featureList.forEach((f) => f.finishQuality && all.add(f.finishQuality));
    return Array.from(all).sort();
  }, [featureList]);

  const hasSize2 = useMemo(
    () => featureList.some((f) => !!f.size2),
    [featureList]
  );

  const allSize2s = useMemo(() => {
    const all = new Set<number>();
    featureList.forEach((f) => f.size2 && all.add(f.size2));
    return Array.from(all).sort((a, b) => a - b);
  }, [featureList]);

  // Derived available options
  const availableThicknesses = useMemo(
    () =>
      getAvailableOptions(featureList, "thickness", {
        thickness: null, // Ignored for thickness field
        size1: selectedSize1,
        size2: selectedSize2,
        finishQuality: selectedFinishQuality,
      }),
    [featureList, selectedSize1, selectedSize2, selectedFinishQuality]
  );
  const availableSize1s = useMemo(
    () =>
      getAvailableOptions(featureList, "size1", {
        thickness: selectedThickness,
        size1: null, // Ignored for size1 field
        size2: selectedSize2,
        finishQuality: selectedFinishQuality,
      }),
    [featureList, selectedThickness, selectedSize2, selectedFinishQuality]
  );
  const availableSize2s = useMemo(
    () =>
      getAvailableOptions(featureList, "size2", {
        thickness: selectedThickness,
        size1: selectedSize1,
        size2: null, // Ignored for size2 field
        finishQuality: selectedFinishQuality,
      }),
    [featureList, selectedThickness, selectedSize1, selectedFinishQuality]
  );
  const availableFinishQualities = useMemo(
    () =>
      getAvailableOptions(featureList, "finishQuality", {
        thickness: selectedThickness,
        size1: selectedSize1,
        size2: selectedSize2,
        finishQuality: null, // Ignored for finishQuality field
      }),
    [featureList, selectedThickness, selectedSize1, selectedSize2]
  );

  // Centralized handler to manage selection changes and cascade validation
  const handleSelectionChange = (
    field: "thickness" | "size1" | "size2" | "finishQuality",
    value: number | string | null
  ) => {
    let newThickness =
      field === "thickness" ? (value as number | null) : selectedThickness;
    let newSize1 = field === "size1" ? (value as number | null) : selectedSize1;
    let newSize2 = field === "size2" ? (value as number | null) : selectedSize2;
    let newFinish =
      field === "finishQuality"
        ? (value as string | null)
        : selectedFinishQuality;

    const validate = (f: "thickness" | "size1" | "size2" | "finishQuality") => {
      // Don't validate the field that was just manually set
      if (f === field) return;

      const currentVal =
        f === "thickness"
          ? newThickness
          : f === "size1"
            ? newSize1
            : f === "size2"
              ? newSize2
              : newFinish;

      if (currentVal === null) return;

      const available = getAvailableOptions(featureList, f, {
        thickness: newThickness,
        size1: newSize1,
        size2: newSize2,
        finishQuality: newFinish,
      });

      if (!available.includes(currentVal)) {
        if (f === "thickness") newThickness = null;
        if (f === "size1") newSize1 = null;
        if (f === "size2") newSize2 = null;
        if (f === "finishQuality") newFinish = null;
      }
    };

    // Validate strictly in logical UI order
    (["thickness", "size1", "size2", "finishQuality"] as const).forEach(
      validate
    );

    if (newThickness !== selectedThickness) setSelectedThickness(newThickness);
    if (newSize1 !== selectedSize1) setSelectedSize1(newSize1);
    if (newSize2 !== selectedSize2) setSelectedSize2(newSize2);
    if (newFinish !== selectedFinishQuality)
      setSelectedFinishQuality(newFinish);
  };

  // Determine the Single Feature matched
  const selectedFeature = useMemo(() => {
    if (!product?.features) return null;
    if (
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

    const meters = rangeLengthMm / 1000;
    return kgsPerUnit * meters * quantity;
  }, [selectedFeature, selectedUnitSizeMm, rangeLengthMm, quantity]);

  // Calculate shipping cost
  const { shippingCost, shippingMethod } = useMemo(() => {
    if (!selectedFeature) return { shippingCost: 0, shippingMethod: "courier" };

    const lengthMm = selectedUnitSizeMm ?? rangeLengthMm;
    const isCourier = lengthMm <= 2500;
    const cost = calculateShippingCost(totalWeight, lengthMm, isCourier);

    return {
      shippingCost: cost,
      shippingMethod: isCourier ? "courier" : "truck",
    };
  }, [selectedFeature, totalWeight, selectedUnitSizeMm, rangeLengthMm]);

  // Calculate product price
  const productPrice = useMemo(() => {
    if (!selectedFeature) return 0;
    const pricePerMeter = selectedFeature.miterPerUnitPrice ?? 0;

    if (selectedUnitSizeMm !== null) {
      const meters = selectedUnitSizeMm / 1000;
      return pricePerMeter * meters * quantity;
    }

    const meters = rangeLengthMm / 1000;
    return pricePerMeter * meters * quantity;
  }, [selectedFeature, selectedUnitSizeMm, rangeLengthMm, quantity]);

  const totalPrice = useMemo(
    () => productPrice + shippingCost,
    [productPrice, shippingCost]
  );

  // Handlers
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRangeLengthMm(val);
    setSelectedUnitSizeMm(null);
  };

  const handleUnitSizeSelect = (size: number) => {
    if (selectedUnitSizeMm === size) {
      setSelectedUnitSizeMm(null);
    } else {
      setSelectedUnitSizeMm(size);
    }
  };

  const handleClearFilters = () => {
    setSelectedThickness(null);
    setSelectedSize1(null);
    setSelectedSize2(null);
    setSelectedFinishQuality(null);
    setSelectedUnitSizeMm(null);
    setRangeLengthMm(product?.minRange ? product.minRange * 1000 : 1000);
  };

  const canCheckout =
    !!selectedFeature &&
    (selectedUnitSizeMm !== null || rangeLengthMm > 0) &&
    quantity > 0;

  const handleAddToCart = () => {
    if (!canCheckout || !product) return;
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    const pricePerMeter = selectedFeature?.miterPerUnitPrice ?? 0;
    const lengthMeters = selectedUnitSizeMm
      ? selectedUnitSizeMm / 1000
      : rangeLengthMm / 1000;
    const unitPrice = pricePerMeter * lengthMeters;

    addToCartMutate(
      {
        type: "product",
        quantity,
        price: Number(unitPrice.toFixed(2)),
        product: {
          productId: product._id,
          featuredId: selectedFeature?._id,
          size: selectedFeature?.size1,
          unitSize: selectedUnitSizeMm ? selectedUnitSizeMm / 1000 : undefined,
          range: rangeLengthMm / 1000,
        },
      },
      {
        onSuccess: () => {
          toast.success("Added to cart successfully");
        },
        onError: () => {
          toast.error("Failed to add to cart");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-6 h-[500px]" />
          <Skeleton className="lg:col-span-6 h-[500px]" />
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
          <div className="rounded-lg overflow-hidden border bg-gray-50 mb-4">
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
          <div className="flex gap-3 items-center overflow-x-auto pb-2">
            {product.productImage?.map((img, idx) => (
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
            ))}
          </div>
        </div>

        {/* RIGHT: Grid Selection (Faceted) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
                {product.productName}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                {product.productDescription || "High quality steel profile."}
              </p>
            </div>
          </div>

          <div className="flex justify-end mb-2">
            {(selectedThickness ||
              selectedSize1 ||
              selectedSize2 ||
              selectedFinishQuality) && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 underline hover:text-rose-800"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* 1. Size 1 (Width) */}
            <div className="flex flex-col">
              <div className="text-sm font-medium text-rose-500 mb-2">
                Select Size 1 (Width/Diameter)(mm)
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="">
                  {allSize1s.map((size) => {
                    const isAvailable = availableSize1s.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() =>
                          handleSelectionChange(
                            "size1",
                            selectedSize1 === size ? null : size
                          )
                        }
                        disabled={!isAvailable && selectedSize1 !== size}
                        className={`min-w-[48px] px-3 py-2 text-sm border text-center transition-all ${
                          selectedSize1 === size
                            ? "border-rose-500 text-rose-600 bg-rose-50 font-medium"
                            : isAvailable
                              ? "border-gray-300 text-gray-600 hover:border-rose-300 bg-white"
                              : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <div className="">
                  {/* Extra Row for Size 2 if needed (Usually Height) */}
                  {hasSize2 && (
                    <div className="flex flex-col md:col-span-2 border-t pt-4 mt-2">
                      <div className="text-sm font-medium text-rose-500 mb-2">
                        Select Size 2 (Height / Second Dimension) — required
                        (Size 2 / Spec)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allSize2s.map((size) => {
                          const isAvailable = availableSize2s.includes(size);
                          return (
                            <button
                              key={size}
                              onClick={() =>
                                handleSelectionChange(
                                  "size2",
                                  selectedSize2 === size ? null : size
                                )
                              }
                              disabled={!isAvailable && selectedSize2 !== size}
                              className={`min-w-[48px] px-3 py-2 text-sm border text-center transition-all ${
                                selectedSize2 === size
                                  ? "border-rose-500 text-rose-600 bg-rose-50 font-medium"
                                  : isAvailable
                                    ? "border-gray-300 text-gray-600 hover:border-rose-300 bg-white"
                                    : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Thickness */}
            <div className="flex flex-col">
              <div className="text-sm font-medium text-rose-500 mb-2">
                Thickness (mm)
              </div>
              <div className="flex flex-wrap gap-2">
                {allThicknesses.map((thickness) => {
                  const isAvailable = availableThicknesses.includes(thickness);
                  return (
                    <button
                      key={thickness}
                      onClick={() =>
                        handleSelectionChange(
                          "thickness",
                          selectedThickness === thickness ? null : thickness
                        )
                      }
                      disabled={!isAvailable && selectedThickness !== thickness}
                      className={`min-w-[48px] px-3 py-2 text-sm border text-center transition-all ${
                        selectedThickness === thickness
                          ? "border-rose-500 text-rose-600 bg-rose-50 font-medium"
                          : isAvailable
                            ? "border-gray-300 text-gray-600 hover:border-rose-300 bg-white"
                            : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                      }`}
                    >
                      {thickness}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Length (mm) */}
            <div className="flex flex-col md:col-span-1">
              <div className="text-sm font-medium text-rose-500 mb-2">
                Custom Length (mm)
              </div>
              {selectedUnitSizeMm === null ? (
                <div className="flex flex-col gap-2">
                  {/* Standard Input */}
                  <div className="flex items-center border border-gray-300 px-3 py-2 w-full max-w-[200px] hover:border-rose-300 focus-within:border-rose-500 transition-colors bg-white">
                    <input
                      type="number"
                      min={(product.minRange ?? 1) * 1000}
                      max={(product.maxRange ?? 12) * 1000}
                      step={100}
                      value={rangeLengthMm}
                      onChange={handleRangeChange}
                      className="w-full text-sm text-gray-700 focus:outline-none"
                    />
                  </div>
                  {/* Standard Sizes Chips */}
                  {availableUnitSizes.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">
                        Standard Sizes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availableUnitSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleUnitSizeSelect(size)}
                            className="text-xs px-2 py-1 border border-gray-300 text-gray-600 hover:bg-gray-50 bg-white"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 border border-rose-500 text-rose-600 bg-rose-50 text-sm font-medium">
                      {selectedUnitSizeMm}
                    </span>
                    <button
                      onClick={() => setSelectedUnitSizeMm(null)}
                      className="text-xs text-gray-400 hover:text-rose-500 underline"
                    >
                      Custom
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Finish Quality */}
            <div className="flex flex-col md:col-span-1">
              <div className="text-sm font-medium text-rose-500 mb-2 flex items-center justify-between">
                <span>Finished Quality</span>
                <Tooltip
                  text={TOOLTIPS.finishQuality}
                  step="finishQuality"
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {allFinishQualities.map((quality) => {
                  const isAvailable =
                    availableFinishQualities.includes(quality);
                  return (
                    <button
                      key={quality}
                      onClick={() =>
                        handleSelectionChange(
                          "finishQuality",
                          selectedFinishQuality === quality ? null : quality
                        )
                      }
                      disabled={
                        !isAvailable && selectedFinishQuality !== quality
                      }
                      className={`px-3 py-2 text-sm border text-center transition-all ${
                        selectedFinishQuality === quality
                          ? "border-rose-500 text-rose-600 bg-rose-50 font-medium"
                          : isAvailable
                            ? "border-gray-300 text-gray-600 hover:border-rose-300 bg-white"
                            : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                      }`}
                    >
                      {quality}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing and Cart Section */}
          <div className="mt-8 border-t pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Quantity */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Quantity</span>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-100 border-r border-gray-300"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 hover:bg-gray-100 border-l border-gray-300"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col items-end">
                <div className="text-2xl font-semibold text-rose-600">
                  €{totalPrice.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  Includes shipping:
                  <span
                    className={`font-bold ${
                      shippingMethod === "courier"
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  >
                    {shippingMethod === "courier"
                      ? "Courier Service"
                      : "Truck Delivery"}
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!canCheckout}
                className={`px-8 py-3 rounded-none font-medium transition-all ${
                  canCheckout
                    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                ADD TO CART
              </button>
            </div>

            {/* Informational Message to guide user */}
            {!selectedFeature && (
              <div className="mt-2 text-center text-xs text-rose-500">
                Please select an option from each category to view price.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
