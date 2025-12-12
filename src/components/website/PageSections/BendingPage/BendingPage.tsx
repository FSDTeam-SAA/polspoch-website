"use client";
import React, { useState } from "react";
import { ChevronDown, Sparkles, ShoppingCart, Zap } from "lucide-react";

interface Dimensions {
  L?: number;
  Z?: number;
  U?: number;
  O?: number;
  A?: number;
  B?: number;
  C?: number;
  degres1?: number;
  degres2?: number;
}

const ProductConfigurator = () => {
  const [selectedShape, setSelectedShape] = useState("");
  const [material, setMaterial] = useState("");
  const [thickness, setThickness] = useState("");
  const [dimensions, setDimensions] = useState<Dimensions>({});
  const [units, setUnits] = useState(1);

  const PRICE_PER_UNIT = 117.66;

  const materials = ["RAWSEEL", "GALVANIZED", "CORTEN", "TEARDROP"];
  const thicknesses = ["1", "1.5", "2", "2.5", "3", "4", "5", "6", "8"];

  const shapes = [
    { id: "L SHAPE", name: "L Shape", icon: "⌐" },
    { id: "Z SHAPE", name: "Z Shape", icon: "z" },
    { id: "U SHAPE", name: "U Shape", icon: "u" },
    { id: "OMEGA SHAPE", name: "Omega Shape", icon: "Ω" },
  ];

  const resetConfiguration = () => {
    setMaterial("");
    setThickness("");
    setDimensions({});
    setUnits(1);
  };

  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape);
    resetConfiguration();

    if (shape === "L SHAPE") {
      setDimensions({
        L: 50,
        A: 30,
        degres1: 80,
        B: 30,
      });
    } else if (shape === "Z SHAPE") {
      setDimensions({
        Z: 100,
        A: 30,
        degres1: 90,
        B: 50,
        degres2: 90,
        C: 30,
      });
    } else if (shape === "U SHAPE") {
      setDimensions({
        U: 100,
        A: 30,
        degres1: 90,
        B: 50,
        degres2: 90,
        C: 30,
      });
    } else if (shape === "OMEGA SHAPE") {
      setDimensions({
        O: 100,
        A: 30,
        degres1: 90,
        B: 50,
        degres2: 90,
        C: 30,
      });
    }
  };

  const handleAddToCart = () => {
    if (!selectedShape || !material || !thickness) {
      alert("Please complete all required fields");
      return;
    }

    const sizes: Record<string, number> = {};
    const degrees: Record<string, number> = {};
    let length: number | null = null;

    // Extract dimensions
    Object.entries(dimensions).forEach(([key, value]) => {
      if (["L", "Z", "U", "O"].includes(key)) {
        length = value;
      } else if (["A", "B", "C"].includes(key)) {
        sizes[key] = value;
      } else if (key === "degres1") {
        degrees.degree1 = value;
      } else if (key === "degres2") {
        degrees.degree2 = value;
      }
    });

    const cartData = {
      serviceType: "bending",
      templateName: selectedShape,
      material: material.toLowerCase(),
      thickness: parseFloat(thickness),
      units: units,
      price: Number(calculateTotal()),
      sizes: sizes,
      degrees: degrees,
      length: length,
    };

    console.log(cartData);
    alert("Item added to cart! Check console for details.");
  };

  const calculateTotal = () => {
    return (PRICE_PER_UNIT * units).toFixed(2);
  };

  const renderShapeSVG = () => {
    if (selectedShape === "L SHAPE") {
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 350">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="4" dy="4" stdDeviation="6" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#shadow)">
            <path
              d="M 100,100 L 280,100 L 280,130 L 130,130 L 130,280 L 100,280 Z"
              fill="#4a5568"
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
            />
            <text x="160" y="85" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE A
            </text>
            <text x="60" y="200" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE L
            </text>
            <text x="140" y="160" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE B
            </text>
            <path
              d="M 115,110 Q 125,120 135,110"
              stroke="#e53e3e"
              strokeWidth="2"
              fill="none"
            />
            <text x="110" y="105" fontSize="12" fill="#e53e3e" fontWeight="600">
              α
            </text>
          </g>
        </svg>
      );
    } else if (selectedShape === "Z SHAPE") {
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 350">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="4" dy="4" stdDeviation="6" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#shadow)">
            <path
              d="M 100,100 L 280,100 L 280,130 L 160,250 L 280,250 L 280,280 L 100,280 L 100,250 L 220,130 L 100,130 Z"
              fill="#4a5568"
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
            />
            <text x="160" y="85" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE A
            </text>
            <text x="50" y="200" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE Z
            </text>
            <text x="190" y="195" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE B
            </text>
            <text x="160" y="310" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE C
            </text>
          </g>
        </svg>
      );
    } else if (selectedShape === "U SHAPE") {
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 350">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="4" dy="4" stdDeviation="6" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#shadow)">
            <path
              d="M 100,100 L 130,100 L 130,250 L 250,250 L 250,100 L 280,100 L 280,280 L 100,280 Z"
              fill="#4a5568"
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
            />
            <text x="60" y="200" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE U
            </text>
            <text x="105" y="125" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE A
            </text>
            <text x="170" y="240" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE B
            </text>
            <text x="255" y="125" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE C
            </text>
          </g>
        </svg>
      );
    } else if (selectedShape === "OMEGA SHAPE") {
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 350">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="4" dy="4" stdDeviation="6" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#shadow)">
            <path
              d="M 100,100 L 280,100 L 280,130 L 250,130 L 250,240 L 280,270 L 280,280 L 100,280 L 100,270 L 130,240 L 130,130 L 100,130 Z"
              fill="#4a5568"
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
            />
            <text x="160" y="85" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE A
            </text>
            <text x="50" y="200" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE O
            </text>
            <text x="190" y="195" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE B
            </text>
            <text x="160" y="310" fontSize="14" fill="#2d3748" fontWeight="600">
              SIZE C
            </text>
          </g>
        </svg>
      );
    }
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="text-center">
          <div className="text-6xl mb-4">🔧</div>
          <p className="text-xl font-semibold">Select a shape to begin</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
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
            Choose from L-Shape or Z-Shape designs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Visualization */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl">
                {material && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-semibold shadow-lg">
                      {material}
                    </div>
                  </div>
                )}
                <div className="relative w-full h-[520px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                  <svg className="absolute inset-0 w-full h-full">
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
                  <div className="relative z-10 transition-all duration-500">
                    {renderShapeSVG()}
                  </div>
                </div>
              </div>
            </div>

            {/* Shape Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-600" />
                Select Shape
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {shapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => handleShapeChange(shape.id)}
                    className={`group relative h-24 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      selectedShape === shape.id
                        ? "border-rose-600 bg-gradient-to-br from-rose-50 to-orange-50 shadow-lg scale-105"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-4xl mb-2">{shape.icon}</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {shape.name}
                      </span>
                    </div>
                    {selectedShape === shape.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
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
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="space-y-6">
                {!selectedShape ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👈</div>
                    <p className="text-xl font-semibold text-slate-600">
                      Please select a shape to start configuring
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Material Selection */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-rose-600 to-orange-600 rounded-full"></div>
                        Material
                      </label>
                      <div className="relative group">
                        <select
                          value={material}
                          onChange={(e) => setMaterial(e.target.value)}
                          className="w-full p-4 border-2 border-slate-200 rounded-xl appearance-none bg-white cursor-pointer hover:border-rose-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all duration-300 font-medium text-slate-900"
                        >
                          <option value="">Select Material</option>
                          {materials.map((mat) => (
                            <option key={mat} value={mat}>
                              {mat}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-rose-600 transition-colors" />
                      </div>
                    </div>

                    {/* Thickness Selection */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-rose-600 to-orange-600 rounded-full"></div>
                        Thickness (mm)
                      </label>
                      <div className="relative group">
                        <select
                          value={thickness}
                          onChange={(e) => setThickness(e.target.value)}
                          className="w-full p-4 border-2 border-slate-200 rounded-xl appearance-none bg-white cursor-pointer hover:border-rose-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all duration-300 font-medium text-slate-900"
                        >
                          <option value="">Select Thickness</option>
                          {thicknesses.map((t) => (
                            <option key={t} value={t}>
                              {t} mm
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-rose-600 transition-colors" />
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-rose-600 to-orange-600 rounded-full"></div>
                        Dimensions (mm)
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedShape === "L SHAPE" && (
                          <>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size L (50-1980)
                              </label>
                              <input
                                type="number"
                                value={dimensions.L || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    L: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="50"
                                max="1980"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size A (30-250)
                              </label>
                              <input
                                type="number"
                                value={dimensions.A || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    A: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="30"
                                max="250"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Degrees 1 (80-135)
                              </label>
                              <input
                                type="number"
                                value={dimensions.degres1 || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    degres1: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="80"
                                max="135"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size B (30-250)
                              </label>
                              <input
                                type="number"
                                value={dimensions.B || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    B: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="30"
                                max="250"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                          </>
                        )}
                        {selectedShape === "Z SHAPE" && (
                          <>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size Z (100-1980)
                              </label>
                              <input
                                type="number"
                                value={dimensions.Z || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    Z: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="100"
                                max="1980"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size A (30-180)
                              </label>
                              <input
                                type="number"
                                value={dimensions.A || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    A: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="30"
                                max="180"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Degrees 1 (Fixed)
                              </label>
                              <input
                                type="number"
                                value={90}
                                disabled
                                className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size B (50-250)
                              </label>
                              <input
                                type="number"
                                value={dimensions.B || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    B: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="50"
                                max="250"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Degrees 2 (Fixed)
                              </label>
                              <input
                                type="number"
                                value={90}
                                disabled
                                className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size C (30-180)
                              </label>
                              <input
                                type="number"
                                value={dimensions.C || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    C: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="30"
                                max="180"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                          </>
                        )}
                        {selectedShape === "U SHAPE" && (
                          <>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size U (100-1980)
                              </label>
                              <input
                                type="number"
                                value={dimensions.U || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    U: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="100"
                                max="1980"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size A (30-180)
                              </label>
                              <input
                                type="number"
                                value={dimensions.A || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    A: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="30"
                                max="180"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Degrees 1 (Fixed)
                              </label>
                              <input
                                type="number"
                                value={90}
                                disabled
                                className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size B (50-250)
                              </label>
                              <input
                                type="number"
                                value={dimensions.B || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    B: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="50"
                                max="250"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Degrees 2 (Fixed)
                              </label>
                              <input
                                type="number"
                                value={90}
                                disabled
                                className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size C (30-180)
                              </label>
                              <input
                                type="number"
                                value={dimensions.C || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    C: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="30"
                                max="180"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                          </>
                        )}
                        {selectedShape === "OMEGA SHAPE" && (
                          <>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size O (100-1980)
                              </label>
                              <input
                                type="number"
                                value={dimensions.O || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    O: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="100"
                                max="1980"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size A (30-180)
                              </label>
                              <input
                                type="number"
                                value={dimensions.A || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    A: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="30"
                                max="180"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Degrees 1 (Fixed)
                              </label>
                              <input
                                type="number"
                                value={90}
                                disabled
                                className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size B (50-250)
                              </label>
                              <input
                                type="number"
                                value={dimensions.B || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    B: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="50"
                                max="250"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Degrees 2 (Fixed)
                              </label>
                              <input
                                type="number"
                                value={90}
                                disabled
                                className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-600 uppercase">
                                Size C (30-180)
                              </label>
                              <input
                                type="number"
                                value={dimensions.C || ""}
                                onChange={(e) =>
                                  setDimensions({
                                    ...dimensions,
                                    C: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="30"
                                max="180"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all font-semibold"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Units & Price */}
                    <div className="pt-6 border-t-2 border-slate-100">
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-slate-900 uppercase">
                            Units
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setUnits(Math.max(1, units - 1))}
                              className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center font-bold text-slate-700"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={units}
                              onChange={(e) =>
                                setUnits(
                                  Math.max(1, parseInt(e.target.value) || 1),
                                )
                              }
                              min="1"
                              className="w-20 text-center p-2 border-2 border-slate-200 rounded-lg font-bold text-slate-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
                            />
                            <button
                              onClick={() => setUnits(units + 1)}
                              className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center font-bold text-slate-700"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-600 mb-1">
                              Price per unit
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                              €{PRICE_PER_UNIT.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-slate-600 mb-1">
                              Total Price
                            </p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                              €{calculateTotal()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={handleAddToCart}
                          className="group relative py-4 px-6 border-2 border-rose-600 text-rose-600 rounded-xl hover:bg-rose-50 active:scale-95 transition-all duration-300 font-bold flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                        <button className="group relative py-4 px-6 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl hover:shadow-2xl active:scale-95 transition-all duration-300 font-bold flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5" />
                          Order Now
                        </button>
                      </div>
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

export default ProductConfigurator;
