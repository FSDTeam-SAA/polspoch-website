"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCuttingTemplates, CuttingDimension } from "@/lib/hooks/useCuttingTemplates";
import { useService } from "@/lib/hooks/useService";
import { useAddToCart } from "@/lib/hooks/useAddToCart";

const DEFAULT_MATERIALS = ["RAWSEEL", "TEARDROP", "GALVANIZED", "CORTEN"];

const CuttingPage = () => {
    // Fetch templates using custom hook
    const { data: templates = [], isLoading } = useCuttingTemplates();

    // State for user selections
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

    // Set default selection when templates load
    useEffect(() => {
        if (templates.length > 0 && !selectedShapeId) {
            const firstTemplate = templates[0];
            void Promise.resolve().then(() => {
                setSelectedShapeId(firstTemplate._id);
                if (firstTemplate.thicknesses?.length > 0) {
                    setThickness(String(firstTemplate.thicknesses[0]));
                }
                if (firstTemplate.materials?.length > 0) {
                    setMaterial(firstTemplate.materials[0]);
                } else {
                    setMaterial(DEFAULT_MATERIALS[0]);
                }

                const initialDims: { [key: string]: number } = {};
                firstTemplate.dimensions?.forEach((dim: CuttingDimension) => {
                    initialDims[dim.key] = dim.minRange;
                });
                setDimensions(initialDims);
            });
        }
    }, [templates, selectedShapeId]);

    const selectedTemplate = templates.find((t) => t._id === selectedShapeId);

    // Calculate price
    const calculatePrice = () => {
        const basePrice = 100;
        // This logic can be more complex if needed
        return Math.round(basePrice * quantity);
    };

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

        // Reset thickness and material if invalid
        if (template.thicknesses?.length > 0 && !template.thicknesses.includes(Number(thickness))) {
            setThickness(String(template.thicknesses[0]));
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
        if (value < min) {
            error = `Min value is ${min}`;
        } else if (value > max) {
            error = `Max value is ${max}`;
        }

        setErrors((prev) => ({ ...prev, [key]: error }));
        setDimensions((prev) => ({ ...prev, [key]: value }));
    };

    const handleAddToCartClick = () => {
        if (!selectedTemplate) return;

        // Final validation
        let hasErrors = false;
        const newErrors: { [key: string]: string } = {};
        selectedTemplate.dimensions.forEach((dim) => {
            const val = dimensions[dim.key] || 0;
            if (val < dim.minRange || val > dim.maxRange) {
                newErrors[dim.key] = `Value must be between ${dim.minRange} and ${dim.maxRange}`;
                hasErrors = true;
            }
        });

        if (hasErrors) {
            setErrors(newErrors);
            toast.error("Please correct the dimension errors");
            return;
        }

        const data = {
            serviceType: "cutting",
            templateName: selectedTemplate.shapeName,
            units: quantity,
            price: calculatePrice(),
            diameter: Number(thickness),
            sizes: dimensions,
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
                        Configure your metal pieces with laser precision. Select your shape, material, and exact dimensions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: Visualization */}
                    <div className="lg:col-span-6">
                        <div className="relative group h-full">
                            <div className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl flex flex-col">
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="px-4 py-2 rounded-lg bg-[#7E1800] text-white text-sm font-semibold shadow-lg uppercase">
                                        {material || "Material"}
                                    </div>
                                </div>
                                <div className="relative w-full flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 min-h-[520px]">
                                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
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
                                                    className={`group relative h-24 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 ${selectedShapeId === shape._id
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
                                        {/* 2. Material Selection */}
                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1.5 h-6 bg-[#7E1800]"></div>
                                                MATERIAL
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(selectedTemplate.materials?.length ? selectedTemplate.materials : DEFAULT_MATERIALS).map((m) => (
                                                    <button
                                                        key={m}
                                                        onClick={() => setMaterial(m)}
                                                        className={`py-3.5 rounded-xl border-2 font-bold transition-all duration-300 uppercase tracking-wider text-sm ${material === m
                                                            ? "border-[#7E1800] bg-[#7E1800] text-white shadow-xl transform scale-[1.02]"
                                                            : "border-slate-200 bg-white text-slate-700 hover:border-[#7E1800]/30"
                                                            }`}
                                                    >
                                                        {m}
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
                                                {(selectedTemplate.thicknesses || []).map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setThickness(String(t))}
                                                        className={`py-3 rounded-lg border-2 font-bold transition-all duration-300 text-sm ${thickness === String(t)
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
                                                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                                {`Size ${dim.label || dim.key}`}
                                                            </label>
                                                            <span className="text-[9px] text-slate-400 font-mono">
                                                                {dim.minRange}-{dim.maxRange}mm
                                                            </span>
                                                        </div>
                                                        <div className="relative group">
                                                            <input
                                                                type="number"
                                                                min={dim.minRange}
                                                                max={dim.maxRange}
                                                                value={dimensions[dim.key] || ""}
                                                                onChange={(e) => handleDimensionChange(dim.key, e.target.value)}
                                                                className={`${BASE_BOX} pr-12 outline-none font-bold text-slate-900 ${errors[dim.key]
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
                                                            <p className="text-[10px] text-red-500 font-bold italic">{errors[dim.key]}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Quantity & Price Section */}
                                <div className="pt-8 border-t-2 border-slate-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                                Estimated Price
                                            </p>
                                            <div className="text-5xl font-black text-[#7E1800] tracking-tighter">
                                                €{calculatePrice()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-90 transition-all duration-200 flex items-center justify-center font-black text-[#7E1800] text-2xl shadow-sm"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 bg-transparent text-center font-black text-2xl text-slate-800 outline-none"
                                            />
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-12 h-12 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-90 transition-all duration-200 flex items-center justify-center font-black text-[#7E1800] text-2xl shadow-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddToCartClick}
                                        disabled={!selectedTemplate}
                                        className="w-full py-5 bg-[#7E1800] hover:bg-[#961D00] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xl shadow-2xl shadow-[#7E1800]/30 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-4 group"
                                    >
                                        <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                        ADD TO CART
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

export default CuttingPage;
