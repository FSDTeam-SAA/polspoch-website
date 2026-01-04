// import React from "react";

// const ServiceDetails = () => {
//   return (
//     <div>
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* LEFT: Image Section - UNCHANGED */}
//           <div className="lg:col-span-6">
//             <div className="rounded-lg overflow-hidden border bg-gray-50">
//               <div className="relative w-full h-[520px]">{/* Image */}</div>
//             </div>

//             {/* Thumbnails */}
//             {/* <div className="mt-4 flex gap-3 items-center">
//               {product.productImage && product.productImage.length > 0 ? (
//                 product.productImage.map((img, idx) => (
//                   <button
//                     key={img._id ?? idx}
//                     onClick={() => setSelectedThumbnail(idx)}
//                     className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
//                       selectedThumbnail === idx
//                         ? "border-rose-800"
//                         : "border-gray-300"
//                     } p-0`}
//                   >
//                     <div className="relative w-full h-full">
//                       <Image
//                         src={img?.url}
//                         alt={`${product.productName}-${idx}`}
//                         fill
//                         style={{ objectFit: "cover" }}
//                       />
//                     </div>
//                   </button>
//                 ))
//               ) : (
//                 <div className="text-sm text-gray-500">No thumbnails</div>
//               )}
//             </div> */}
//           </div>

//           {/* RIGHT: Product Details - MODIFIED */}
//           <div className="lg:col-span-6 flex flex-col">
//             <div className="">
//               <h1 className="text-2xl lg:text-3xl font-semibold mb-3">
//                 {/* Service Name  */}
//               </h1>
//               <p className="text-sm text-gray-500 mb-6">
//                 {/* Service Description */}
//               </p>
//             </div>
//             <div className="">
//               <div className="">
//                 {/* Types of Service */}
//                 {/*
//                  3 types of service |Rebar| Cutting| Bending|
//                  shadcn tabs used here
//                 */}
//                 {/* Rebar button */}
//                 {/* Cutting button */}
//                 {/* Bending button */}
//               </div>
//               <div className="">
//                 {/* Rebar Features */}
//                 <div className="">{/* Rebar Features */}</div>
//               </div>
//             </div>
//             <div className="">
//               {/* show all the Rebar|Cutting|Bending Main features */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     // </div>
//   );
// };

// export default ServiceDetails;

"use client";
"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, ShoppingCart, Zap } from "lucide-react";

const ProductConfigurator = () => {
  // State for user selections
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [material, setMaterial] = useState("steel");
  const [thickness, setThickness] = useState("5");
  const [dimensions, setDimensions] = useState({
    sizeA: 100,
    sizeB: 50,
    sizeC: 20,
    sizeD: 10,
  });
  const [quantity, setQuantity] = useState(1);

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
    thicknesses: ["3", "5", "8", "10", "12"],
    shapes: [
      {
        id: "rectangle",
        name: "Rectangle",
        icon: "▭",
        description: "Standard rectangular profile",
      },
      {
        id: "triangle",
        name: "Triangle",
        icon: "▲",
        description: "Triangular cross-section",
      },
      {
        id: "circle",
        name: "Circle",
        icon: "●",
        description: "Circular profile",
      },
      {
        id: "l-shape",
        name: "L-Shape",
        icon: "⌐",
        description: "L-shaped angle",
      },
      {
        id: "u-shape",
        name: "U-Shape",
        icon: "⊐",
        description: "U-channel profile",
      },
      { id: "custom", name: "Custom", icon: "◫", description: "Custom design" },
    ],
  };

  // Calculate price
  const calculatePrice = () => {
    const baseMaterial = productConfig.materials.find((m) => m.id === material);
    const area = (dimensions.sizeA * dimensions.sizeB) / 10000;
    const thicknessFactor = parseFloat(thickness) / 5;
    const basePrice = 100;
    return Math.round(
      basePrice *
        area *
        thicknessFactor *
        (baseMaterial?.priceMultiplier || 1) *
        quantity,
    );
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
    const scale = 3;
    const a = dimensions.sizeA / scale;
    const b = dimensions.sizeB / scale;
    const t = parseFloat(thickness) * 2;

    switch (selectedShape) {
      case "rectangle":
        return (
          <g>
            <rect
              x="50"
              y="100"
              width={a}
              height={b}
              fill={color}
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
            />
            <text x="50" y="85" fontSize="14" fill="#2d3748" fontWeight="600">
              A: {dimensions.sizeA}mm
            </text>
            <text
              x="60"
              y={120 + b}
              fontSize="14"
              fill="#2d3748"
              fontWeight="600"
            >
              B: {dimensions.sizeB}mm
            </text>
          </g>
        );
      case "circle":
        return (
          <g>
            <circle
              cx="200"
              cy="180"
              r={a / 2}
              fill={color}
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
            />
            <line
              x1="200"
              y1="180"
              x2={200 + a / 2}
              y2="180"
              stroke="#e53e3e"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            <text x="210" y="170" fontSize="14" fill="#2d3748" fontWeight="600">
              R: {dimensions.sizeA / 2}mm
            </text>
          </g>
        );
      case "triangle":
        return (
          <g>
            <polygon
              points={`200,100 ${200 + a / 2},${100 + b} ${200 - a / 2},${100 + b}`}
              fill={color}
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
            />
            <text x="180" y="85" fontSize="14" fill="#2d3748" fontWeight="600">
              A: {dimensions.sizeA}mm
            </text>
            <text
              x="180"
              y={125 + b}
              fontSize="14"
              fill="#2d3748"
              fontWeight="600"
            >
              B: {dimensions.sizeB}mm
            </text>
          </g>
        );
      case "l-shape":
        return (
          <g>
            <path
              d={`M 100,100 L ${100 + a},100 L ${100 + a},${100 + t} L ${100 + t},${100 + t} L ${100 + t},${100 + b} L 100,${100 + b} Z`}
              fill={color}
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
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
              x="50"
              y={100 + b / 2}
              fontSize="14"
              fill="#2d3748"
              fontWeight="600"
            >
              B: {dimensions.sizeB}mm
            </text>
            <text
              x={105}
              y={100 + t + 20}
              fontSize="12"
              fill="#e53e3e"
              fontWeight="700"
            >
              t: {thickness}mm
            </text>
          </g>
        );
      case "u-shape":
        return (
          <g>
            <path
              d={`M 100,100 L ${100 + a},100 L ${100 + a},${100 + b} L ${100 + a - t},${100 + b} L ${100 + a - t},${100 + t} L ${100 + t},${100 + t} L ${100 + t},${100 + b} L 100,${100 + b} Z`}
              fill={color}
              stroke="#1a202c"
              strokeWidth="3"
              opacity="0.9"
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
              x="65"
              y={100 + b / 2}
              fontSize="14"
              fill="#2d3748"
              fontWeight="600"
            >
              B: {dimensions.sizeB}mm
            </text>
          </g>
        );
      default:
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
              opacity="0.7"
            />
            <text
              x={100 + a / 2 - 40}
              y={100 + b / 2}
              fontSize="16"
              fill="#2d3748"
              fontWeight="600"
            >
              Custom Shape
            </text>
          </g>
        );
    }
  };

  const currentMaterial = productConfig.materials.find(
    (m) => m.id === material,
  );

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
                      {productConfig.materials.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-rose-600 transition-colors"
                      size={20}
                    />
                  </div>
                </div>

                {/* Thickness Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-rose-600 to-orange-600 rounded-full"></div>
                    Thickness
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
                    Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(dimensions).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Size {key.slice(-1)}
                        </label>
                        <div className="relative group">
                          <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                              setDimensions({
                                ...dimensions,
                                [key]: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full p-3 pr-12 border-2 border-slate-200 rounded-xl outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100 transition-all duration-300 font-semibold text-slate-900"
                            min={
                              key === "sizeA" || key === "sizeB" ? "10" : "5"
                            }
                            max={
                              key === "sizeA" || key === "sizeB" ? "500" : "200"
                            }
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-slate-400 group-hover:text-rose-600 transition-colors">
                            mm
                          </span>
                        </div>
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
                            Math.max(1, parseInt(e.target.value) || 1),
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
                  <div className="grid grid-cols-1 gap-4">
                    <button className="group relative py-4 px-6 border-2 border-rose-600 text-rose-600 rounded-xl hover:bg-rose-50 active:scale-95 transition-all duration-300 font-bold flex items-center justify-center gap-2 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>

                    {/* <button className="group relative py-4 px-6 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl hover:shadow-2xl active:scale-95 transition-all duration-300 font-bold flex items-center justify-center gap-2 overflow-hidden">
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <Zap className="w-5 h-5" />
                      Order Now
                    </button> */}
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

export default ProductConfigurator;
