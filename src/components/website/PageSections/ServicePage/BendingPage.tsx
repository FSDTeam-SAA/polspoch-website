// src/components/website/PageSections/ServicePage/BendingPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useService } from "@/lib/hooks/useService";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { useBendingTemplates, BendingDimension } from "@/lib/hooks/useBendingTemplates";
import { toast } from "sonner";

const BendingPage = () => {
  const DEFAULT_MATERIALS = ["RAWSEEL", "TEARDROP", "GALVANIZED", "CORTEN"];
  const { data: templates = [], isLoading } = useBendingTemplates();
  const [selectedShapeId, setSelectedShapeId] = useState<string>("");
  const [thickness, setThickness] = useState("");
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const { mutate: addToCart } = useAddToCart({ token });
  const { mutate: createService } = useService({ token });

  useEffect(() => {
    if (templates.length > 0 && !selectedShapeId) {
      const firstTemplate = templates[0];
      void Promise.resolve().then(() => {
        setSelectedShapeId(firstTemplate._id);

        const diameters = firstTemplate.thicknesses || [];
        if (diameters.length > 0) {
          setThickness(String(diameters[0]));
        }

        if (firstTemplate.materials?.length > 0) {
          setMaterial(firstTemplate.materials[0]);
        }

        const initialDims: { [key: string]: number } = {};
        firstTemplate.dimensions?.forEach((dim: BendingDimension) => {
          initialDims[dim.key] = dim.minRange;
        });
        setDimensions(initialDims);
      });
    }
  }, [templates, selectedShapeId]);

  const selectedTemplate = templates.find((t) => t._id === selectedShapeId);

  const calculatePrice = () => {
    const basePrice = 117.66;
    return Math.round(basePrice * quantity);
  };

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

    const diameters = template.thicknesses || [];
    if (diameters.length > 0 && !diameters.includes(Number(thickness))) {
      setThickness(String(diameters[0]));
    } else if (diameters.length === 0) {
      setThickness("");
    }

    if (template.materials?.length > 0 && !template.materials.includes(material)) {
      setMaterial(template.materials[0]);
    }
  };

  const handleDimensionChange = (key: string, valueStr: string) => {
    const value = parseInt(valueStr) || 0;
    const dimensionConfig = selectedTemplate?.dimensions.find((d) => d.key === key);
    if (!dimensionConfig) return;

    const min = dimensionConfig.minRange;
    const max = dimensionConfig.maxRange;

    let error = "";
    if (value < min) error = `Min: ${min}mm`;
    else if (value > max) error = `Max: ${max}mm`;

    setErrors((prev) => ({ ...prev, [key]: error }));
    setDimensions((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = () => {
    if (!selectedTemplate) return;

    const sizes: { [key: string]: number } = {};
    selectedTemplate.dimensions.forEach((dim) => {
      sizes[dim.key] = dimensions[dim.key] || 0;
    });

    const data = {
      serviceType: "bending",
      templateName: selectedTemplate.shapeName,
      units: quantity,
      price: calculatePrice(),
      diameter: Number(thickness),
      sizes: sizes,
      material: material || "RAWSEEL",
    };

    createService(data, {
      onSuccess: (res) => {
        addToCart({
          serviceId: res?.data?._id,
          type: "service",
          quantity: quantity,
        });
        toast.success("Successfully added to cart");
      },
      onError: () => {
        toast.error("Failed to create service");
      },
    });
  };

  const BASE_BOX = "w-full h-12 px-3 box-border rounded-xl border-2 flex items-center transition-all duration-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7E1800]/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#7E1800]" />
            <span className="text-sm font-semibold text-[#7E1800]">Premium Bending Service</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Custom Metal Bending
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Professional precision bending for your metal profiles. Select a shape and configure your dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Visualization */}
          <div className="lg:col-span-6">
            <div className="relative group h-full">
              <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl flex flex-col min-h-[500px]">
                <div className="relative w-full flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
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
                    <div className="text-center py-4 text-slate-500">Loading shapes...</div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {templates.map((shape) => (
                        <button
                          key={shape._id}
                          onClick={() => handleShapeSelect(shape._id)}
                          className={`group relative h-24 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 ${selectedShapeId === shape._id
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
                              <span className="text-white text-[10px] font-bold">✓</span>
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
                        {(selectedTemplate.materials?.length ? selectedTemplate.materials : DEFAULT_MATERIALS).map((m) => (
                          <button
                            key={m}
                            onClick={() => setMaterial(m)}
                            className={`py-3 rounded-lg border-2 font-bold transition-all duration-300 uppercase ${material === m
                              ? "border-[#7E1800] bg-[#7E1800] text-white shadow-lg"
                              : "border-slate-200 bg-white text-slate-700 hover:border-[#7E1800]/30"
                              }`}
                          >
                            {m}
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
                        {(selectedTemplate?.thicknesses || []).map((t) => (
                          <button
                            key={t}
                            onClick={() => setThickness(String(t))}
                            className={`py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${thickness === String(t)
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
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedTemplate.dimensions.map((dim) => (
                          <div key={dim.key} className="space-y-2">
                            <div className="flex justify-between items-end">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                                {dim.unit === "º" ? dim.label : `Size ${dim.label || dim.key}`}
                              </label>
                            </div>
                            <div className="relative group">
                              <input
                                type="number"
                                min={dim.minRange}
                                max={dim.maxRange}
                                value={dimensions[dim.key] || ""}
                                onChange={(e) => handleDimensionChange(dim.key, e.target.value)}
                                className={`${BASE_BOX} ${errors[dim.key]
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
                              <p className="text-[10px] text-red-500 font-medium">{errors[dim.key]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t-2 border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-sm font-semibold text-slate-600 mb-1">Total Price</p>
                          <div className="text-4xl font-bold text-[#7E1800]">€{calculatePrice()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center font-bold"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 h-10 border-2 border-slate-200 rounded-xl text-center font-bold focus:border-[#7E1800] outline-none"
                          />
                          <button
                            onClick={() => setQuantity(quantity + 1)}
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
