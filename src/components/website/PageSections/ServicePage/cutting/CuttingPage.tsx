"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  useCuttingTemplates,
  CuttingDimension,
} from "@/lib/hooks/useCuttingTemplates";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { useCalculateCutting } from "@/lib/hooks/useCalculation";
import {
  CalculateCuttingResponse,
  CalculateCuttingPayload,
} from "@/lib/services/calculationService";

const CuttingPage = () => {
  // Fetch templates using custom hook
  const { data: templates = [], isLoading } = useCuttingTemplates();

  // State for user selections
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
    useState<CalculateCuttingResponse | null>(null);
  const { mutate: calculateCutting } = useCalculateCutting();

  const { mutate: addToCart } = useAddToCart({ token });

  const handleCalculate = React.useCallback(
    (
      currentQuantity: number = quantity,
      currentDimensions: { [key: string]: number } = dimensions,
      currentThickness: string = thickness,
      currentMaterial: string = material,
    ) => {
      const thicknessNum = Number(currentThickness);

      console.log("handleCalculate invoked", {
        shape: selectedTemplate?.shapeName,
        id: selectedTemplate?._id,
        currentQuantity,
        currentDimensions,
        currentThickness: thicknessNum,
        currentMaterial,
        thicknessType: typeof thicknessNum,
      });

      if (!selectedTemplate) return;

      const payload: CalculateCuttingPayload = {
        shapeName: selectedTemplate.shapeName,
        material: currentMaterial,
        thickness: thicknessNum,
        units: currentQuantity,
        internalCuts: selectedTemplate.cuts || 0,
      };

      selectedTemplate.dimensions?.forEach((dim, index) => {
        const letter = String.fromCharCode(65 + index); // 65 is 'A'
        payload[`size${letter}`] = currentDimensions[dim.key] || 0;
      });

      calculateCutting(payload, {
        onSuccess: (data) => {
          setCalculationResult(data);
        },
      });
    },
    [
      selectedTemplate,
      calculateCutting,
      quantity,
      dimensions,
      thickness,
      material,
    ],
  );

  // Set default selection when templates load
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
        firstTemplate.dimensions?.forEach((dim: CuttingDimension) => {
          initialDims[dim.key] = dim.minRange;
        });
        setDimensions(initialDims);

        const firstThickness =
          firstTemplate.materials?.[0]?.thickness?.[0] || "";
        const initialMaterial = firstTemplate.materials?.[0]?.material || "";

        handleCalculate(
          quantity,
          initialDims,
          String(firstThickness),
          initialMaterial,
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
    template.dimensions?.forEach((dim) => {
      newDims[dim.key] = dim.minRange;
    });
    setDimensions(newDims);
    setErrors({});

    // Reset material and thickness based on new template
    let newThickness = thickness;
    let newMaterial = material;
    const firstMaterialObj = template.materials?.[0];
    if (firstMaterialObj) {
      newMaterial = firstMaterialObj.material;
      setMaterial(newMaterial);
      if (firstMaterialObj.thickness?.length > 0) {
        newThickness = String(firstMaterialObj.thickness[0]);
        setThickness(newThickness);
      }
    }

    handleCalculate(quantity, newDims, newThickness, newMaterial);
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

  const handleAddToCartClick = () => {
    if (!calculationResult) {
      toast.error("Please calculate dimensions first");
      return;
    }

    const payload = {
      type: "service",
      totalAmount: calculationResult.pricing.finalQuote,
      serviceData: {
        serviceType: "cutting",
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
              Premium Precision Cutting
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Design Your Custom Cut Profile
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Configure your metal pieces with laser precision. Select your shape,
            material, and exact dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Visualization */}
          <div className="lg:col-span-6">
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
                        <div className="text-slate-400 font-medium italic">
                          Select a shape to visualize...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Configuration Panel */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 h-full flex flex-col">
              <div className="space-y-8 flex-1">
                {/* 1. Shape Selection */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2 uppercase tracking-wide">
                    <Zap className="w-5 h-5 text-[#7E1800]" />
                    Select Shape
                  </h3>
                  {isLoading ? (
                    <div className="text-center py-8 text-slate-500">
                      <div className="animate-spin w-8 h-8 border-4 border-[#7E1800] border-t-transparent rounded-full mx-auto mb-4"></div>
                      Loading precision templates...
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {templates.map((shape) => (
                        <button
                          key={shape._id}
                          onClick={() => handleShapeSelect(shape._id)}
                          className={`group relative h-24 rounded-xl cursor-pointer border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 ${
                            selectedShapeId === shape._id
                              ? "border-[#7E1800] bg-white shadow-lg ring-4 ring-[#7E1800]/5"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                          }`}
                        >
                          <Image
                            src={shape.imageUrl}
                            alt={shape.shapeName}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain mb-1 opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <span className="text-[9px] font-bold text-slate-600 text-center leading-tight uppercase font-sans">
                            {shape.shapeName}
                          </span>
                          {selectedShapeId === shape._id && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg transform scale-110">
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
                    {/* 2. Material Selection */}
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                        MATERIAL
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedTemplate.materials?.map((mObj) => (
                          <button
                            key={mObj._id}
                            onClick={() => {
                              setMaterial(mObj.material);
                              // Reset thickness to first available for this material
                              if (mObj.thickness?.length > 0) {
                                const newThickness = String(mObj.thickness[0]);
                                setThickness(newThickness);
                                handleCalculate(
                                  quantity,
                                  dimensions,
                                  newThickness,
                                  mObj.material,
                                );
                              }
                            }}
                            className={`py-3.5 rounded-xl border-2 font-bold cursor-pointer transition-all duration-300 uppercase tracking-wider text-sm ${
                              material === mObj.material
                                ? "border-[#7E1800] bg-[#7E1800] text-white shadow-xl transform scale-[1.02]"
                                : "border-slate-200 bg-white text-slate-700 hover:border-[#7E1800]/30"
                            }`}
                          >
                            {mObj.material}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Thickness Selection */}
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
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
                                );
                              }}
                              className={`py-3 rounded-lg border-2 cursor-pointer font-bold transition-all duration-300 text-sm ${
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

                    {/* 4. Dimensions Grid */}
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                        SIZES (MM)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {selectedTemplate.dimensions?.map((dim) => (
                          <div key={dim.key} className="space-y-2">
                            <div className="flex justify-between items-end">
                              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                {dim.label || `Size ${dim.key}`}
                              </label>
                              <span className="text-[12px] text-slate-400 font-mono">
                                {dim.minRange}mm-{dim.maxRange}mm
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
                                className={`${BASE_BOX} pr-12 outline-none font-bold text-slate-900 ${
                                  errors[dim.key]
                                    ? "border-red-500 focus:border-red-600 ring-4 ring-red-100"
                                    : "border-slate-200 focus:border-[#7E1800] ring-4 ring-[#7E1800]/5"
                                }`}
                                placeholder={`${dim.minRange}`}
                              />
                              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-bold text-slate-400 group-hover:text-[#7E1800] transition-colors">
                                MM
                              </span>
                            </div>
                            {errors[dim.key] && (
                              <p className="text-[10px] text-red-500 font-bold italic">
                                {errors[dim.key]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* <div>
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                        CUTS
                      </label>
                      <span className="text-[18px] font-bold text-slate-600 ml-2">
                        {" "}
                        {selectedTemplate?.cuts}
                      </span>
                    </div> */}
                  </>
                )}

                {/* Quantity & Price Section */}
                <div className="border-t-2 border-[#7E1800]/20 pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                    {/* Quantity */}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </span>
                      <div className="flex items-center border-2 border-[#7E1800]/20 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => {
                            const newQty = Math.max(1, quantity - 1);
                            setQuantity(newQty);
                            handleCalculate(newQty, dimensions, thickness);
                          }}
                          className="px-4 py-3 hover:bg-[#7E1800]/5 transition-colors border-r-2 border-[#7E1800]/20"
                        >
                          <div className="w-5 h-5 flex items-center justify-center font-bold text-slate-700">
                            −
                          </div>
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
                            handleCalculate(newQty, dimensions, thickness);
                          }}
                          className="w-16 py-3 text-lg font-bold text-center outline-none"
                        />
                        <button
                          onClick={() => {
                            const newQty = quantity + 1;
                            setQuantity(newQty);
                            handleCalculate(newQty, dimensions, thickness);
                          }}
                          className="px-4 py-3 hover:bg-[#7E1800]/5 transition-colors border-l-2 border-[#7E1800]/20"
                        >
                          <div className="w-5 h-5 flex items-center justify-center font-bold text-slate-700">
                            +
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    {calculationResult && (
                      <div className="flex-1 bg-gradient-to-br from-[#7E1800]/5 to-white p-4 rounded-xl border-2 border-[#7E1800]/10">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Service Price:</span>
                          <span className="font-semibold text-gray-900">
                            €{calculationResult.pricing.finalQuote.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-3 pb-3 border-b border-[#7E1800]/10">
                          <span className="text-gray-600">Shipping Cost:</span>
                          <span className="font-semibold text-gray-900">
                            €
                            {calculationResult.pricing.shippingPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">
                            Total Amount:
                          </span>
                          <span className="text-2xl font-bold text-[#7E1800]">
                            €{calculationResult.pricing.finalQuote.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleAddToCartClick}
                      disabled={!selectedTemplate}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-[#7E1800] to-[#7E1800]/80 text-white hover:from-[#7E1800]/80 hover:to-[#7E1800] shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
    </div>
  );
};

export default CuttingPage;
