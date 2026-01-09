// src/components/website/PageSections/ServicePage/BendingPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import {
  useBendingTemplates,
  BendingDimension,
} from "@/lib/hooks/useBendingTemplates";
import { useCalculateBending } from "@/lib/hooks/useCalculation";
import {
  CalculateBendingResponse,
  CalculateBendingPayload,
} from "@/lib/services/calculationService";
import { toast } from "sonner";

const BendingPage = () => {
  const { data: templates = [], isLoading } = useBendingTemplates();
  const [selectedShapeId, setSelectedShapeId] = useState<string>("");
  const selectedTemplate = templates.find((t) => t._id === selectedShapeId);
  const [thickness, setThickness] = useState("");
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const [calculationResult, setCalculationResult] =
    useState<CalculateBendingResponse | null>(null);
  const { mutate: calculateBending } = useCalculateBending();

  const { mutate: addToCart } = useAddToCart({ token });

  const handleCalculate = React.useCallback(
    (
      currentQuantity: number = quantity,
      currentDimensions: { [key: string]: number } = dimensions,
      currentThickness: string = thickness,
      currentMaterial: string = material,
    ) => {
      if (!selectedTemplate) return;

      const payload: CalculateBendingPayload = {
        shapeName: selectedTemplate.shapeName,
        material: currentMaterial,
        thickness: Number(currentThickness),
        units: currentQuantity,
        length: 1000, // Default as per example
        numBends:
          selectedTemplate.dimensions.filter((d) =>
            d.key.toLowerCase().includes("degree"),
          ).length || 1,
      };

      // Map dimensions and degrees sequentially based on key
      let sizeIdx = 1;
      let degreeIdx = 1;

      const alphabeticalKeys = ["A", "B", "C", "D", "E", "F"];

      selectedTemplate.dimensions.forEach((dim) => {
        if (dim.key.toLowerCase().includes("degree")) {
          payload[`degree${degreeIdx}`] = currentDimensions[dim.key] || 0;
          degreeIdx++;
        } else {
          const char =
            alphabeticalKeys[sizeIdx - 1] || String.fromCharCode(64 + sizeIdx);
          payload[`size${char}`] = currentDimensions[dim.key] || 0;
          sizeIdx++;
        }
      });

      // Fill remaining with 0 if needed (api example showed up to 6)
      for (let i = sizeIdx; i <= 6; i++) {
        const char = alphabeticalKeys[i - 1] || String.fromCharCode(64 + i);
        if (!payload[`size${char}`]) payload[`size${char}`] = 0;
      }
      for (let i = degreeIdx; i <= 6; i++) {
        if (!payload[`degree${i}`]) payload[`degree${i}`] = 0;
      }

      calculateBending(payload, {
        onSuccess: (data) => setCalculationResult(data),
      });
    },
    [
      selectedTemplate,
      calculateBending,
      quantity,
      dimensions,
      thickness,
      material,
    ],
  );

  useEffect(() => {
    if (templates.length > 0 && !selectedShapeId) {
      const firstTemplate = templates[0];
      void Promise.resolve().then(() => {
        setSelectedShapeId(firstTemplate._id);

        // Find first material and its thicknesses
        const firstMaterialObj = firstTemplate.materials?.[0];
        if (firstMaterialObj) {
          setMaterial(firstMaterialObj.material);
          if (firstMaterialObj.thickness?.length > 0) {
            setThickness(String(firstMaterialObj.thickness[0]));
          }
        }

        const initialDims: { [key: string]: number } = {};
        firstTemplate.dimensions?.forEach((dim: BendingDimension) => {
          initialDims[dim.key] = dim.minRange;
        });
        setDimensions(initialDims);

        const firstThickness =
          firstTemplate.materials?.[0]?.thickness?.[0] || "";
        const firstMaterial = firstTemplate.materials?.[0]?.material || "";
        handleCalculate(
          quantity,
          initialDims,
          String(firstThickness),
          firstMaterial,
        );
      });
    }
  }, [templates, selectedShapeId, handleCalculate, quantity]);

  const handleShapeSelect = (templateId: string) => {
    const template = templates.find((t) => t._id === templateId);
    if (!template) return;

    setSelectedShapeId(templateId);
    const newDims: { [key: string]: number } = {};
    template.dimensions?.forEach((dim) => {
      newDims[dim.key] = dim.minRange;
    });
    setDimensions(newDims);
    setErrors({});

    // Reset material and thickness based on new template
    let nextMaterial = material;
    let nextThickness = thickness;
    const firstMaterialObj = template.materials?.[0];
    if (firstMaterialObj) {
      nextMaterial = firstMaterialObj.material;
      setMaterial(nextMaterial);
      if (firstMaterialObj.thickness?.length > 0) {
        nextThickness = String(firstMaterialObj.thickness[0]);
        setThickness(nextThickness);
      }
    }

    handleCalculate(quantity, newDims, nextThickness, nextMaterial);
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
    if (value < min) error = `Min: ${min}mm`;
    else if (value > max) error = `Max: ${max}mm`;

    setErrors((prev) => ({ ...prev, [key]: error }));
    const nextDims = { ...dimensions, [key]: value };
    setDimensions(nextDims);

    if (!error) {
      handleCalculate(quantity, nextDims, thickness, material);
    }
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
        serviceType: "bending",
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
      <div className="container mx-auto ">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7E1800]/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#7E1800]" />
            <span className="text-sm font-semibold text-[#7E1800]">
              Premium Bending Service
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Custom Metal Bending
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Professional precision bending for your metal profiles. Select a
            shape and configure your dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Visualization */}
          <div className="lg:col-span-6">
            <div className="sticky top-28 ">
              <div className="relative group">
                <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl flex flex-col min-h-[500px]">
                  <div className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <svg className="absolute inset-0">
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

                    <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center transition-all duration-500">
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
                        <div className="text-slate-400 font-medium text-center">
                          <div className="text-6xl mb-4">⚒️</div>
                          Select a shape to visualize
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Configuration */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 h-full">
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#7E1800]" />
                    Select Shape
                  </h3>
                  {isLoading ? (
                    <div className="text-center py-4 text-slate-500">
                      Loading shapes...
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {templates.map((shape) => (
                        <button
                          key={shape._id}
                          onClick={() => handleShapeSelect(shape._id)}
                          className={`group relative h-24 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 ${
                            selectedShapeId === shape._id
                              ? "border-[#7E1800] bg-white shadow-lg scale-[1.02]"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                          }`}
                        >
                          <Image
                            src={shape.imageUrl}
                            alt={shape.shapeName}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain mb-1 opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <span className="text-[10px] font-bold text-slate-600 text-center leading-tight line-clamp-2 uppercase">
                            {shape.shapeName}
                          </span>
                          {selectedShapeId === shape._id && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow">
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

                {selectedTemplate && (
                  <>
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                        MATERIAL
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTemplate.materials?.map((mObj) => (
                          <button
                            key={mObj._id}
                            onClick={() => {
                              setMaterial(mObj.material);
                              const newThickness =
                                mObj.thickness?.length > 0
                                  ? String(mObj.thickness[0])
                                  : thickness;
                              setThickness(newThickness);
                              handleCalculate(
                                quantity,
                                dimensions,
                                newThickness,
                                mObj.material,
                              );
                            }}
                            className={`py-3 rounded-lg border-2 font-bold transition-all duration-300 uppercase ${
                              material === mObj.material
                                ? "border-[#7E1800] bg-[#7E1800] text-white shadow-lg"
                                : "border-slate-200 bg-white text-slate-700 hover:border-[#7E1800]/30"
                            }`}
                          >
                            {mObj.material}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                        THICKNESS (MM)
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {selectedTemplate.materials
                          ?.find((m) => m.material === material)
                          ?.thickness.map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                setThickness(String(t));
                                handleCalculate(
                                  quantity,
                                  dimensions,
                                  String(t),
                                  material,
                                );
                              }}
                              className={`py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                                thickness === String(t)
                                  ? "border-[#7E1800] bg-[#7E1800] text-white shadow-lg"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-[#7E1800]/30"
                              }`}
                            >
                              {t}mm
                            </button>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                        SIZES (MM)
                      </label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedTemplate.dimensions.map((dim) => (
                          <div key={dim.key} className="space-y-2">
                            <div className="flex justify-between">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                                {dim.unit === "º"
                                  ? dim.label
                                  : `Size ${dim.label || dim.key}`}
                              </label>
                              <span className="text-[12px] text-slate-400 font-mono">
                                {dim.minRange}-{dim.maxRange}mm
                              </span>
                            </div>

                            <div className="relative group">
                              <input
                                type="number"
                                min={dim.minRange}
                                max={dim.maxRange}
                                value={dimensions[dim.key] || ""}
                                onChange={(e) =>
                                  handleDimensionChange(dim.key, e.target.value)
                                }
                                className={`${BASE_BOX} ${
                                  errors[dim.key]
                                    ? "border-red-500 focus:border-red-600"
                                    : "border-slate-200 focus:border-[#7E1800]"
                                } outline-none font-semibold text-slate-900`}
                                placeholder={`${dim.minRange}`}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">
                              Unit: {dim.unit || "MM"}
                            </p>
                            {errors[dim.key] && (
                              <p className="text-[10px] text-red-500 font-medium">
                                {errors[dim.key]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

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
                                  €{" "}
                                  {calculationResult.pricing.pricePerUnit || 0}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>
                                  Shipping (
                                  {calculationResult.shippingStatus.method}):
                                </span>
                                <span>
                                  €{" "}
                                  {calculationResult.pricing.shippingPrice || 0}
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
                              handleCalculate(
                                newQty,
                                dimensions,
                                thickness,
                                material,
                              );
                            }}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center font-bold"
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
                              handleCalculate(
                                newQty,
                                dimensions,
                                thickness,
                                material,
                              );
                            }}
                            className="w-16 h-10 border-2 border-slate-200 rounded-xl text-center font-bold focus:border-[#7E1800] outline-none"
                          />
                          <button
                            onClick={() => {
                              const newQty = quantity + 1;
                              setQuantity(newQty);
                              handleCalculate(
                                newQty,
                                dimensions,
                                thickness,
                                material,
                              );
                            }}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="w-full py-4 bg-[#7E1800] hover:bg-[#961D00] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#7E1800]/20 transition-all flex items-center justify-center gap-3"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        Add to Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BendingPage;
