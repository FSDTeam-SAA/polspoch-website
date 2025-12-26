// servicepage/rebar.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addToCart, createService, getRebarTemplates } from "@/lib/api";
import { ServicePayload } from "@/lib/services/createservice";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface RebarDimension {
  _id: string;
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
  isCalculated: boolean;
}

interface RebarTemplate {
  _id: string;
  type: string;
  templateId: string;
  shapeName: string;
  imageUrl: string;
  availableDiameters: number[];
  dimensions: RebarDimension[];
}

const Rebar = () => {
  // Fetch templates
  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["rebarTemplates"],
    queryFn: getRebarTemplates,
  });

  const templates: RebarTemplate[] = useMemo(
    () => templatesData?.data || [],
    [templatesData]
  );

  // State for user selections
  // Initial state might need to wait for data, but we can set defaults.
  // We'll sync with useEffect when data loads.
  const [selectedShapeId, setSelectedShapeId] = useState<string>("");
  const [thickness, setThickness] = useState("6");
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  // Set default selection when templates load
  useEffect(() => {
    if (
      templatesData?.data &&
      templatesData.data.length > 0 &&
      !selectedShapeId
    ) {
      const firstTemplate = templatesData.data[0];

      // Make optimization to avoid synchronous setState warning
      void Promise.resolve().then(() => {
        setSelectedShapeId(firstTemplate._id);
        setThickness(String(firstTemplate.availableDiameters[0]));

        const initialDims: { [key: string]: number } = {};
        firstTemplate.dimensions.forEach((dim: RebarDimension) => {
          initialDims[dim.key] = dim.minRange;
        });
        setDimensions(initialDims);
      });
    }
  }, [templatesData, selectedShapeId]); // Kept selectedShapeId to ensure it only runs when empty

  const selectedTemplate = templates.find((t) => t._id === selectedShapeId);

  const orderMutation = useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: { serviceId: string; type: string; quantity: number };
      token: string;
    }) => addToCart(data, token),
    onSuccess: (data) => {
      toast.success(`${data?.message}` || "Succssesfuly Added");
    },
  });

  const serviceMutation = useMutation({
    mutationFn: ({ data, token }: { data: ServicePayload; token: string }) =>
      createService(data, token),

    onSuccess: (res) => {
      console.log("respons data for ", res);
      orderMutation.mutate({
        data: {
          serviceId: res?.data?._id,
          type: "service",
          quantity: quantity,
        },
        token,
      });
    },
  });

  // Product configurations
  const productConfig = {
    materials: [
      {
        id: "steel",
        name: "Steel",
        color: "#4a5568",
        priceMultiplier: 1,
        gradient: "from-slate-600 to-slate-700",
      },
      {
        id: "aluminum",
        name: "Aluminum",
        color: "#cbd5e0",
        priceMultiplier: 1.3,
        gradient: "from-slate-300 to-slate-400",
      },
      {
        id: "stainless",
        name: "Stainless Steel",
        color: "#718096",
        priceMultiplier: 1.8,
        gradient: "from-slate-500 to-slate-600",
      },
    ],
  };

  // Calculate price
  const calculatePrice = () => {
    const basePrice = 100;

    const sizesum =
      selectedTemplate?.dimensions.reduce(
        (sum, dim) => sum + (dimensions[dim.key] || 0),
        0
      ) || 0;

    const unitPrice = basePrice / quantity + ((sizesum - 30) / 10) * 0.01;

    return Math.round(unitPrice * quantity);
  };

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
  };

  const handleDimensionChange = (key: string, valueStr: string) => {
    const value = parseInt(valueStr) || 0;
    const dimensionConfig = selectedTemplate?.dimensions.find(
      (d) => d.key === key
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
    setDimensions((prev) => ({ ...prev, [key]: value }));
  };

  const getGridClass = (index: number) => {
    if (index === 0) return "col-span-12 md:col-span-6";
    return "col-span-6 md:col-span-4";
  };

  const servicehandel = () => {
    if (!selectedTemplate) return;

    const sizes: { [key: string]: number } = {};
    selectedTemplate.dimensions.forEach((dim) => {
      sizes[dim.key] = dimensions[dim.key] || 0;
    });

    const data: ServicePayload = {
      serviceType: "rebar",
      templateName: selectedTemplate.shapeName,
      units: quantity,
      price: calculatePrice(),
      diameter: Number(thickness),
      //eslint-disable-next-line
      sizes: sizes as any, // casting to allow dynamic keys if ServicePayload is strict
    };
    serviceMutation.mutate({ data, token });
  };

  const currentMaterial = productConfig.materials[0]; // Default to first material for now since material state was removed

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
            <div className="relative group h-full">
              <div className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl flex flex-col">
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-4 py-2 rounded-lg bg-[#7E1800] text-white text-sm font-semibold shadow-lg">
                    {currentMaterial?.name}
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
                    <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {templates.map((shape) => (
                        <button
                          key={shape._id}
                          onClick={() => handleShapeSelect(shape._id)}
                          className={`group relative h-24 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 ${
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

                {/* 2. Thickness Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#7E1800] rounded-full"></div>
                    DIAMETER
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedTemplate?.availableDiameters.map((t) => (
                      <button
                        key={t}
                        onClick={() => setThickness(String(t))}
                        className={`py-3 px-2 rounded-lg border-2 font-semibold transition-all duration-300 ${
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

                {/* 3. Dimensions Grid */}
                {selectedTemplate && (
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-5 bg-[#7E1800] rounded-full"></div>
                      Sizes
                    </label>
                    <div className="grid grid-cols-12 gap-4">
                      {selectedTemplate.dimensions.map((dim, index) => (
                        <div
                          key={dim.key}
                          className={`space-y-2 ${getGridClass(index)}`}
                        >
                          <div className="flex justify-between items-end">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              {dim.label || `Size ${dim.key}`}
                            </label>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {dim.minRange}-{dim.maxRange}mm
                            </span>
                          </div>

                          <div className="relative group">
                            {dim.isCalculated ? (
                              <div className="w-full p-3 border-2 border-slate-100 bg-slate-50 rounded-xl text-slate-500 font-mono text-sm">
                                {/* If calculated, we might display formula or just read-only value? 
                                      Prompt says: "If the dimension has a calculated formula (e.g., SIZE C = SIZE A), display it accordingly."
                                      Since we don't have the formula logic in the API response shown in prompt, 
                                      I'll assume it's either read-only or just showing the value.
                                      Wait, "Calculated" usually means derived.
                                      I will display "Calculated" or the value if we have logic for it.
                                      For now, making it read-only input.
                                  */}
                                Calculated
                              </div>
                            ) : (
                              <input
                                type="number"
                                min={dim.minRange}
                                max={dim.maxRange}
                                value={dimensions[dim.key] || ""} // Show empty string if undefined to avoid NaN
                                onChange={(e) =>
                                  handleDimensionChange(dim.key, e.target.value)
                                }
                                className={`w-full p-3 pr-12 border-2 rounded-xl outline-none focus:ring-4 transition-all duration-300 font-semibold text-slate-900 ${
                                  errors[dim.key]
                                    ? "border-red-500 focus:border-red-600 focus:ring-red-100"
                                    : "border-slate-200 focus:border-[#7E1800] focus:ring-[#7E1800]/10"
                                }`}
                                placeholder={`${dim.minRange}`}
                              />
                            )}
                            {!dim.isCalculated && (
                              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-slate-400 group-hover:text-[#7E1800] transition-colors">
                                {dim.unit || "mm"}
                              </span>
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
                        €{calculatePrice()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all duration-200 flex items-center justify-center font-bold text-slate-700 text-xl"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-16 h-12 border-2 border-slate-200 rounded-xl text-center font-bold text-lg text-slate-700 focus:border-[#7E1800] outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all duration-200 flex items-center justify-center font-bold text-slate-700 text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={servicehandel}
                    className="w-full py-4 bg-[#7E1800] hover:bg-[#961D00] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#7E1800]/20 hover:shadow-2xl hover:shadow-[#7E1800]/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
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
