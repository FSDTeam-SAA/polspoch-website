// servicepage/rebar.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  useRebarTemplates,
  RebarDimension,
} from "@/lib/hooks/useRebarTemplates";
import { useCalculateRebar } from "@/lib/hooks/useCalculation";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import {
  CalculateRebarResponse,
  CalculateRebarPayload,
} from "@/lib/services/calculationService";
import { toast } from "sonner";

const Rebar = () => {
  // Fetch templates using custom hook
  const { data: templates = [], isLoading } = useRebarTemplates();

  const [calculationResult, setCalculationResult] =
    useState<CalculateRebarResponse | null>(null);
  const { mutate: calculateRebar } = useCalculateRebar();

  // State for user selections
  // Initial state might need to wait for data, but we can set defaults.
  // We'll sync with useEffect when data loads.
  const [selectedShapeId, setSelectedShapeId] = useState<string>("");
  const selectedTemplate = templates.find((t) => t._id === selectedShapeId);
  const [thickness, setThickness] = useState("6");
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const { mutate: addToCart } = useAddToCart({ token });

  const handleCalculate = React.useCallback(
    (
      currentQuantity: number = quantity,
      currentDimensions: { [key: string]: number } = dimensions,
      currentThickness: string = thickness,
    ) => {
      if (!selectedTemplate) return;

      const payload: CalculateRebarPayload = {
        shapeName: selectedTemplate.shapeName,
        diameter: Number(currentThickness),
        units: currentQuantity,
      };

      selectedTemplate.dimensions.forEach((dim, index) => {
        const letter = String.fromCharCode(65 + index); // 65 is 'A'
        payload[`size${letter}`] = currentDimensions[dim.key] || 0;
      });

      calculateRebar(payload, {
        onSuccess: (data) => {
          setCalculationResult(data);
        },
      });
    },
    [selectedTemplate, calculateRebar, quantity, dimensions, thickness],
  );

  // Set default selection when templates load
  useEffect(() => {
    if (templates.length > 0 && !selectedShapeId) {
      const firstTemplate = templates[0];

      // Make optimization to avoid synchronous setState warning
      void Promise.resolve().then(() => {
        setSelectedShapeId(firstTemplate._id);
        setThickness(String(firstTemplate.availableDiameters[0]));

        if (firstTemplate.materials?.length > 0) {
          setMaterial(firstTemplate.materials[0]);
        }

        const initialDims: { [key: string]: number } = {};
        firstTemplate.dimensions.forEach((dim: RebarDimension) => {
          initialDims[dim.key] = dim.minRange;
        });
        setDimensions(initialDims);
        handleCalculate(
          quantity,
          initialDims,
          String(firstTemplate.availableDiameters[0]),
        );
      });
    }
  }, [templates, selectedShapeId, handleCalculate, quantity]);

  const handleShapeSelect = (templateId: string) => {
    const template = templates.find((t) => t._id === templateId);
    if (!template) return;

    setSelectedShapeId(templateId);

    // Reset dimensions to min ranges
    const newDims: { [key: string]: number } = {};
    template.dimensions.forEach((dim) => {
      newDims[dim.key] = dim.minRange;
    });
    setDimensions(newDims);
    setErrors({});

    // Reset thickness if current is not available?
    // Or pick nearest? For now select first available if current invalid.
    if (!template.availableDiameters.includes(Number(thickness))) {
      setThickness(String(template.availableDiameters[0] || "6"));
    }

    if (
      template.materials?.length > 0 &&
      !template.materials.includes(material)
    ) {
      setMaterial(template.materials[0]);
    }

    handleCalculate(quantity, newDims, thickness);
  };

  const handleDimensionChange = (key: string, valueStr: string) => {
    const value = parseInt(valueStr) || 0;
    const dimensionConfig = selectedTemplate?.dimensions.find(
      (d) => d.key === key,
    );

    if (!dimensionConfig) return;

    const min = dimensionConfig.minRange;
    const max = dimensionConfig.maxRange;

    let error = "";
    if (value < min) {
      error = `Min value is ${min}`;
    } else if (value > max) {
      error = `Max value is ${max}`;
    }

    setErrors((prev) => ({ ...prev, [key]: error }));
    const nextDimensions = { ...dimensions, [key]: value };
    setDimensions(nextDimensions);

    if (!error) {
      handleCalculate(quantity, nextDimensions, thickness);
    }
  };

  const getGridClass = () => {
    return "col-span-6 md:col-span-3";
  };

  const handleAddToCart = () => {
    if (!calculationResult) {
      toast.error("Please calculate dimensions first");
      return;
    }

    const payload = {
      type: "service",
      totalAmount: calculationResult.pricing.finalQuote,
      serviceData: {
        serviceType: "rebar",
        ...calculationResult.summary,
      },
      pricing: calculationResult.pricing,
      shippingStatus: calculationResult.shippingStatus,
    };

    addToCart(payload, {
      onSuccess: () => {
        toast.success("Successfully added to cart");
      },
      onError: () => {
        toast.error("Please login to add items to cart");
      },
    });
  };

  const BASE_BOX =
    "w-full h-12 px-3 box-border rounded-xl border-2 flex items-center transition-all duration-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7E1800]/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#7E1800]" />
            <span className="text-sm font-semibold text-[#7E1800]">
              Premium Steel
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Design Your Custom Metal Profile
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Configure your perfect metal profile with real-time visualization.
            Choose from various shapes, materials, and dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: SVG Visualization */}
          <div className="lg:col-span-6">
            {/* Main Visualization Card */}
            <div className="sticky top-28 ">
              <div className="relative group h-full">
                <div className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl flex flex-col">
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-4 py-2 rounded-lg bg-[#7E1800] text-white text-sm font-semibold shadow-lg uppercase">
                      {material || "Material"}
                    </div>
                  </div>
                  <div className="relative w-full flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 min-h-[520px]">
                    {/* Grid Background */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="0.5"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    {/* Shape Rendering */}
                    <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center transition-all duration-500 ease-out transform hover:scale-105">
                      {selectedTemplate?.imageUrl ? (
                        <Image
                          src={selectedTemplate.imageUrl}
                          alt={selectedTemplate.shapeName}
                          width={400}
                          height={400}
                          className="max-w-full max-h-full object-contain drop-shadow-2xl"
                          priority
                        />
                      ) : (
                        <div className="text-slate-400 font-medium">
                          Select a shape to visualize
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Old Grid Was Here, Moving to Right Side */}
          </div>

          {/* RIGHT: Configuration Panel */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 h-full flex flex-col">
              <div className="space-y-6 flex-1">
                {/* 1. Shape Selection (Moved Here) */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#7E1800]" />
                    Select Shape
                  </h3>
                  {isLoading ? (
                    <div className="text-center py-4 text-slate-500">
                      Loading templates...
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {templates.map((shape) => (
                        <button
                          key={shape._id}
                          onClick={() => handleShapeSelect(shape._id)}
                          className={`group relative h-24 rounded-xl cursor-pointer border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 ${
                            selectedShapeId === shape._id
                              ? "border-[#7E1800] bg-white shadow-lg scale-[1.02]"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                          }`}
                          title={shape.shapeName}
                        >
                          <Image
                            src={shape.imageUrl}
                            alt={shape.shapeName}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain mb-1 opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <span className="text-[10px] font-bold text-slate-600 text-center leading-tight line-clamp-2">
                            {shape.shapeName}
                          </span>
                          {selectedShapeId === shape._id && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow">
                              <span className="text-white text-[10px] font-bold">
                                ✓
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Thickness Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                    DIAMETER (MM)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedTemplate?.availableDiameters.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setThickness(String(t));
                          handleCalculate(quantity, dimensions, String(t));
                        }}
                        className={`py-3 px-2 rounded-lg border-2 cursor-pointer font-semibold transition-all duration-300 ${
                          thickness === String(t)
                            ? "border-[#7E1800] bg-[#7E1800] text-white shadow-lg scale-105"
                            : "border-slate-200 bg-white text-slate-700 hover:border-[#7E1800]/30 hover:shadow-md"
                        }`}
                      >
                        {t}mm
                      </button>
                    ))}
                    {!selectedTemplate && (
                      <p className="text-sm text-slate-400">
                        Select a shape first
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Dimensions Grid */}
                {selectedTemplate && (
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                      SIZES (MM)
                    </label>
                    <div className="grid grid-cols-12 gap-4">
                      {selectedTemplate.dimensions.map((dim) => (
                        <div
                          key={dim.key}
                          className={`space-y-2 ${getGridClass()}`}
                        >
                          <div className="flex justify-between items-end">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              {dim.label || `Size ${dim.key}`}
                            </label>
                            <span className="text-[12px] text-slate-400 font-mono">
                              {dim.minRange}mm-{dim.maxRange}mm
                            </span>
                          </div>

                          <div className="relative group">
                            {dim.isCalculated ? (
                              <div
                                className={`${BASE_BOX} border-slate-100 bg-slate-50 text-slate-500 font-mono text-sm`}
                              >
                                Calculated
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="number"
                                  min={dim.minRange}
                                  max={dim.maxRange}
                                  value={dimensions[dim.key] || ""}
                                  onChange={(e) =>
                                    handleDimensionChange(
                                      dim.key,
                                      e.target.value,
                                    )
                                  }
                                  className={`${BASE_BOX} pr-12 outline-none font-semibold text-slate-900 ${
                                    errors[dim.key]
                                      ? "border-red-500 focus:border-red-600 ring-red-100"
                                      : "border-slate-200 focus:border-[#7E1800] ring-[#7E1800]/10"
                                  }`}
                                  placeholder={`${dim.minRange}`}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-slate-400 group-hover:text-[#7E1800] transition-colors">
                                  {dim.unit || "mm"}
                                </span>
                              </div>
                            )}
                          </div>
                          {errors[dim.key] && (
                            <p className="text-xs text-red-500 font-medium animate-pulse">
                              {errors[dim.key]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Price Section */}
                <div className="pt-6 border-t-2 border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">
                        Total Price
                      </p>
                      <div className="text-4xl font-bold text-[#7E1800]">
                        €{calculationResult?.pricing?.finalQuote || 0}
                      </div>
                      {calculationResult && (
                        <div className="mt-2 space-y-1 text-xs text-slate-500 font-medium text-left">
                          <div className="">
                            <span>Price Per Unit:</span>
                            <span>
                              € {calculationResult.pricing.pricePerUnit.toFixed(2) || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              Shipping Method (
                              {calculationResult.shippingStatus.method}):
                            </span>
                            <span>
                              {" "}
                              € {calculationResult.pricing.shippingPrice || 0}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const newQty = Math.max(1, quantity - 1);
                          setQuantity(newQty);
                          handleCalculate(newQty);
                        }}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all duration-200 flex items-center justify-center font-bold text-slate-700 text-xl"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const newQty = Math.max(
                            1,
                            parseInt(e.target.value) || 1,
                          );
                          setQuantity(newQty);
                          handleCalculate(newQty);
                        }}
                        className="w-16 h-12 border-2 border-slate-200 rounded-xl text-center font-bold text-lg text-slate-700 focus:border-[#7E1800] outline-none"
                      />
                      <button
                        onClick={() => {
                          const newQty = quantity + 1;
                          setQuantity(newQty);
                          handleCalculate(newQty);
                        }}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all duration-200 flex items-center justify-center font-bold text-slate-700 text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-[#7E1800] hover:bg-[#961D00] cursor-pointer text-white rounded-xl font-bold text-lg shadow-xl shadow-[#7E1800]/20 hover:shadow-2xl hover:shadow-[#7E1800]/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rebar;
