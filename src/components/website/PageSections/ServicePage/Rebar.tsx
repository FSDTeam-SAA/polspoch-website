"use client";

import React, { useState } from "react";
import { Sparkles, ShoppingCart, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createService } from "@/lib/api";
import { ServicePayload } from "@/lib/services/createservice";

const Rebar = () => {
  // State for user selections
  const [selectedShape, setSelectedShape] = useState("CUT-TO-SIZE-REBAR");
  const [material, setMaterial] = useState("steel");
  const [thickness, setThickness] = useState("5");
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({
    sizeA: 30,
    sizeB: 50,
    sizeC: 50,
    sizeD: 50,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);

  const servieMutation = useMutation({
    mutationKey: ["createService"],
    mutationFn: (data: ServicePayload) => createService(data),
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
    thicknesses: ["6", "8", "10", "12", "16", "20", "25"],
    shapes: [
      {
        id: "CUT-TO-SIZE-REBAR",
        name: "CUT TO SIZE REBAR",
        icon: "___",
        description: "Standard rectangular profile",
      },
      {
        id: "L-SHAPE",
        name: "L SHAPE",
        icon: "L",
        description: "Triangular cross-section",
      },
      {
        id: "U-SHAPE",
        name: "U SHAPE",
        icon: "U",
        description: "Circular profile",
      },
      {
        id: "STICK-ROUND",
        name: "STICK ROUND",
        icon: "⌐",
        description: "L-shaped angle",
      },
      {
        id: "OMEGA-SHAPE",
        name: "OMEGA SHAPE",
        icon: "Ω",
        description: "U-channel profile",
      },
      {
        id: "QUADRILATERAL-3D",
        name: "QUADRILATERAL 3D",
        icon: "◫",
        description: "Custom design",
      },
    ],
  };

  // Get material color
  const getMaterialColor = () => {
    return (
      productConfig.materials.find((m) => m.id === material)?.color || "#4a5568"
    );
  };

  // SVG Shape Renderer with enhanced styling
  const renderShape = () => {
    const color = getMaterialColor();

    // ---------- SCALE ----------
    // Dynamic scaling logic:
    // Determine the maximum dimension entered by the user
    // Calculate a scale factor that ensures the shape fits within ~160px
    const maxDimension = Math.max(
      dimensions.sizeA || 0,
      dimensions.sizeB || 0,
      dimensions.sizeC || 0,
      dimensions.sizeD || 0
    );

    // Target max rendered size in pixels (to fit safely in 400x350 with margins)
    const targetMaxPixels = 160;

    // Calculate required scale: e.g. 500mm / 160px = 3.125
    const calculatedScale = maxDimension / targetMaxPixels;

    // Use at least 2.5 as scale, or higher if needed to fit large items
    const scale = Math.max(2.5, calculatedScale);

    const a = (dimensions.sizeA || 0) / scale;
    const b = (dimensions.sizeB || 0) / scale;
    const c = (dimensions.sizeC || 0) / scale;
    const d = (dimensions.sizeD || 0) / scale;
    const t = parseFloat(thickness) * 2;

    // ---------- CLAMP ----------
    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(value, max));

    // ------------------------------------------------------------
    // 1️⃣ LINE TYPE  (Straight bar)
    // ------------------------------------------------------------
    if (selectedShape === "CUT-TO-SIZE-REBAR") {
      return (
        <g>
          <rect
            x="150"
            y="150"
            width={clamp(a, 0, 200)}
            height={clamp(12, 0, 20)}
            fill={color}
            stroke="#1a202c"
            strokeWidth="3"
            className="overflow-hidden"
          />
          <text x="130" y="85" fontSize="14" fill="#2d3748" fontWeight="600">
            A: {dimensions.sizeA}mm
          </text>
        </g>
      );
    }

    // ------------------------------------------------------------
    // 2️⃣ L-SHAPE  (90 degree)
    // ------------------------------------------------------------
    if (selectedShape === "L-SHAPE") {
      return (
        <g>
          <path
            d={`
    M 150,150
    L ${150 + b},150        
    L ${150 + b},${150 + t} 
    L ${150 + t},${150 + t} 
    L ${150 + t},${150 + a} 
    L 150,${150 + a}        
    Z
  `}
            fill={color}
            stroke="#1a202c"
            strokeWidth="3"
          />

          <text x="110" y="70" fontSize="14" fill="#2d3748" fontWeight="600">
            A: {dimensions.sizeA}mm
          </text>
          <text x="110" y="90" fontSize="14" fill="#2d3748" fontWeight="600">
            B: {dimensions.sizeB}mm
          </text>
        </g>
      );
    }

    // ------------------------------------------------------------
    // 3️⃣ U SHAPE
    // ------------------------------------------------------------
    if (selectedShape === "U-SHAPE") {
      return (
        <g>
          <path
            d={`M 150,150 L ${150 + a},150 L ${150 + a},${150 + b}
             L ${150 + a - t},${150 + b} L ${150 + a - t},${150 + t}
             L ${150 + t},${150 + t} L ${150 + t},${150 + b}
             L 150,${150 + b} Z`}
            fill={color}
            stroke="#1a202c"
            strokeWidth="3"
          />

          <text
            x={100 + a / 2 - 20}
            y="85"
            fontSize="14"
            fill="#2d3748"
            fontWeight="600"
          >
            A: {dimensions.sizeA}mm
          </text>
          <text
            x={100 - 30}
            y={100 + b / 2}
            fontSize="14"
            fill="#2d3748"
            fontWeight="600"
          >
            B: {dimensions.sizeB}mm
          </text>
          <text
            x={100 + a / 2 - 20}
            y={100 + b + 20}
            fontSize="14"
            fill="#2d3748"
            fontWeight="600"
          >
            C: {dimensions.sizeC}mm
          </text>
        </g>
      );
    }

    // ------------------------------------------------------------
    // 4️⃣ STICK ROUND (L-ROUND or curved)
    // ------------------------------------------------------------
    if (selectedShape === "STICK-ROUND") {
      const r = 20; // Radius for "little bit round"
      return (
        <g>
          <path
            // L-shape with rounded inner and outer corner
            d={`
              M 100,${100 + b} 
              L 100,${100 + r} 
              Q 100,100 ${100 + r},100
              L ${100 + a},100 
              L ${100 + a},${100 + t}
              L ${100 + t + r},${100 + t}
              Q ${100 + t},${100 + t} ${100 + t},${100 + t + r}
              L ${100 + t},${100 + b} 
              Z
             `}
            fill={color}
            stroke="#1a202c"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <text x={100 + a / 2 - 20} y="85" fontSize="14" fill="#2d3748">
            A: {dimensions.sizeA}mm
          </text>
          <text x="50" y={100 + b / 2} fontSize="14" fill="#2d3748">
            B: {dimensions.sizeB}mm
          </text>
        </g>
      );
    }

    // ------------------------------------------------------------
    // 5️⃣ OMEGA SHAPE (Ω)
    // ------------------------------------------------------------
    if (selectedShape === "OMEGA-SHAPE") {
      const foot = 20; // "two side little bit line added"
      return (
        <g>
          <path
            d={`
              M ${100 - foot},${100 + b} 
              L 100,${100 + b} 
              L 100,100 
              L ${100 + a},100 
              L ${100 + a},${100 + b} 
              L ${100 + a + foot},${100 + b}
              L ${100 + a + foot},${100 + b - t}
              L ${100 + a - t},${100 + b - t}
              L ${100 + a - t},${100 + t}
              L ${100 + t},${100 + t}
              L ${100 + t},${100 + b - t}
              L ${100 - foot},${100 + b - t}
              Z
            `}
            fill={color}
            stroke="#1a202c"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <text x={100 + a / 2 - 20} y="85" fontSize="14" fill="#2d3748">
            A: {dimensions.sizeA}mm
          </text>
          <text x="65" y={100 + b / 2} fontSize="14" fill="#2d3748">
            B: {dimensions.sizeB}mm
          </text>
          <text
            x={100 + a / 2 - 20}
            y={100 + b + 25}
            fontSize="14"
            fill="#2d3748"
          >
            C: {dimensions.sizeC}mm
          </text>
        </g>
      );
    }

    // ------------------------------------------------------------
    // 6️⃣ QUADRILATERAL 3D (Rectangle box)
    // ------------------------------------------------------------
    if (selectedShape === "QUADRILATERAL-3D") {
      return (
        <g>
          <rect
            x="100"
            y="100"
            width={a}
            height={b}
            fill={color}
            stroke="#1a202c"
            strokeWidth="3"
          />

          <text x={100 + a / 2 - 40} y={100 + b / 2} fontSize="16">
            3D Shape
          </text>
        </g>
      );
    }

    // ------------------------------------------------------------
    // DEFAULT SHAPE
    // ------------------------------------------------------------
    return (
      <g>
        <rect
          x="100"
          y="100"
          width={a}
          height={b}
          fill={color}
          stroke="#1a202c"
          strokeWidth="3"
          strokeDasharray="8,4"
        />
        <text x={100 + a / 2 - 30} y={100 + b / 2} fontSize="16">
          Custom
        </text>
      </g>
    );
  };

  const currentMaterial = productConfig.materials.find(
    (m) => m.id === material
  );

  // Mapping shapes to required dimensions
  const getVisibleDimensions = () => {
    switch (selectedShape) {
      case "CUT-TO-SIZE-REBAR":
        return ["sizeA"];
      case "L-SHAPE":
        return ["sizeA", "sizeB"];
      case "U-SHAPE":
        return ["sizeA", "sizeB", "sizeC"];
      case "STICK-ROUND":
        return ["sizeA", "sizeB"];
      case "OMEGA-SHAPE":
        return ["sizeA", "sizeB", "sizeC"];
      case "QUADRILATERAL-3D":
        return ["sizeA", "sizeB", "sizeC", "sizeD"];
      default:
        return ["sizeA", "sizeB", "sizeC", "sizeD"];
    }
  };

  const visibleDimensions = getVisibleDimensions();

  // Calculate price
  const calculatePrice = () => {
    // const baseMaterial = productConfig.materials.find((m) => m.id === material);
    // const area = (dimensions.sizeA * dimensions.sizeB) / 10000;
    // const thicknessFactor = parseFloat(thickness) / 5;
    const basePrice = 100;

    const sizesum = visibleDimensions.reduce(
      (sum, key) => sum + dimensions[key],
      0
    );

    // const baseprice = 29.81;
    const unitPrice = basePrice / quantity + ((sizesum - 30) / 10) * 0.01;

    return Math.round(unitPrice * quantity);
  };

  const handleDimensionChange = (key: string, valueStr: string) => {
    const value = parseInt(valueStr) || 0;

    // Min/Max values
    const min = 10;
    const max = 500;

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
    // 1-2-3 Layout logic
    // Index 0 (1st item) -> full width
    // Index 1, 2 (2nd, 3rd items) -> half width
    // Index 3, 4, 5... -> 1/3 width

    if (index === 0) return "col-span-6";
    if (index === 1 || index === 2) return "col-span-6";
    return "col-span-4";
  };

  const servicehandel = () => {
    const data: ServicePayload = {
      serviceType: "rebar",
      templateName: selectedShape,
      units: quantity,
      price: calculatePrice(),
      diameter: Number(thickness),
      sizes: {
        A: dimensions[visibleDimensions[0]] ?? 0,
        B: dimensions[visibleDimensions[1]] ?? 0,
        C: visibleDimensions[2] ? dimensions[visibleDimensions[2]] : 0,
        D: visibleDimensions[3] ? dimensions[visibleDimensions[3]] : 0,
      },
    };
    console.log("visible dimension", dimensions[0]);
    servieMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-orange-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-semibold text-rose-800">
              Premium Metal Configurator
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
          <div className="lg:col-span-6 space-y-6">
            {/* Main Visualization Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl">
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r ${currentMaterial?.gradient} text-white text-sm font-semibold shadow-lg`}
                  >
                    {currentMaterial?.name}
                  </div>
                </div>
                <div className="relative w-full h-[520px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
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

                  {/* Shape SVG */}
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 350"
                    className="relative z-10 transition-all duration-500 ease-out transform hover:scale-105"
                  >
                    <defs>
                      <filter id="shadow">
                        <feDropShadow
                          dx="4"
                          dy="4"
                          stdDeviation="6"
                          floodOpacity="0.4"
                        />
                      </filter>
                      <linearGradient
                        id="shapeGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{
                            stopColor: getMaterialColor(),
                            stopOpacity: 1,
                          }}
                        />
                        <stop
                          offset="100%"
                          style={{
                            stopColor: getMaterialColor(),
                            stopOpacity: 0.7,
                          }}
                        />
                      </linearGradient>
                    </defs>
                    <g filter="url(#shadow)">{renderShape()}</g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Shape Selection Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-600" />
                Select Shape
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {productConfig.shapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedShape(shape.id)}
                    className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${
                      selectedShape === shape.id
                        ? "border-rose-600 bg-gradient-to-br from-rose-50 to-orange-50 shadow-lg scale-105"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                    title={shape.description}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span
                        className={`text-3xl transition-transform duration-300 ${selectedShape === shape.id ? "scale-110" : "group-hover:scale-110"}`}
                      >
                        {shape.icon}
                      </span>
                      <span className="text-xs font-medium text-slate-600 mt-1">
                        {shape.name}
                      </span>
                    </div>
                    {selectedShape === shape.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Configuration Panel */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sticky top-8">
              <div className="space-y-6">
                {/* Thickness Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-rose-600 to-orange-600 rounded-full"></div>
                    DIAMETER
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {productConfig.thicknesses.map((t) => (
                      <button
                        key={t}
                        onClick={() => setThickness(t)}
                        className={`py-3 px-2 rounded-lg border-2 font-semibold transition-all duration-300 ${
                          thickness === t
                            ? "border-rose-600 bg-gradient-to-br from-rose-600 to-orange-600 text-white shadow-lg scale-105"
                            : "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:shadow-md"
                        }`}
                      >
                        {t}mm
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions Grid */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-rose-600 to-orange-600 rounded-full"></div>
                    Sizes
                  </label>
                  <div className="grid grid-cols-12 gap-4">
                    {visibleDimensions.map((key, index) => (
                      <div
                        key={key}
                        className={`space-y-2 ${getGridClass(index)}`}
                      >
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Size {key.slice(4)}
                        </label>
                        <div className="relative group">
                          <input
                            type="number"
                            value={dimensions[key as keyof typeof dimensions]}
                            onChange={(e) =>
                              handleDimensionChange(key, e.target.value)
                            }
                            className={`w-full p-3 pr-12 border-2 rounded-xl outline-none focus:ring-4 transition-all duration-300 font-semibold text-slate-900 ${
                              errors[key]
                                ? "border-red-500 focus:border-red-600 focus:ring-red-100"
                                : "border-slate-200 focus:border-rose-600 focus:ring-rose-100"
                            }`}
                            placeholder="0"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-slate-400 group-hover:text-rose-600 transition-colors">
                            mm
                          </span>
                        </div>
                        {errors[key] && (
                          <p className="text-xs text-red-500 font-medium animate-pulse">
                            {errors[key]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity & Price Section */}
                <div className="pt-6 border-t-2 border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">
                        Total Price
                      </p>
                      <div className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
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
                        className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl font-bold text-lg text-slate-900 focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all"
                        min="1"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all duration-200 flex items-center justify-center font-bold text-slate-700 text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={servicehandel}
                      className="group relative py-4 px-6 border-2 border-rose-600 text-rose-600 rounded-xl hover:bg-rose-50 active:scale-95 transition-all duration-300 font-bold flex items-center justify-center gap-2 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button className="group relative py-4 px-6 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl hover:shadow-2xl active:scale-95 transition-all duration-300 font-bold flex items-center justify-center gap-2 overflow-hidden">
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <Zap className="w-5 h-5" />
                      Order Now
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

export default Rebar;
