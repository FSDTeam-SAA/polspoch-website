import { ShoppingCart, Zap } from "lucide-react";
import React from "react";

interface CuttingFormProps {
  productConfig: {
    materials: Array<{ id: string; name: string }>;
    thicknesses: string[];
  };
  thickness: string;
  setThickness: (value: string) => void;
  setMaterial: (value: string) => void;
  material?: string; // Should be passed from parent if we want to highlight selected
  visibleDimensions?: string[];
  dimensionRanges?: number[][];
  dimensions?: { [key: string]: number };
  handleDimensionChange: (key: string, value: string) => void;
  errors?: { [key: string]: string };
  quantity: number;
  setQuantity: (value: number) => void;
  calculatePrice: () => number;
  servicehandel: () => void;
  getGridClass: (index: number) => string;
}

const CuttingForm = ({
  productConfig,
  setThickness,
  setMaterial,
  material, // Need this prop to highlight selected material
  visibleDimensions = [],
  dimensionRanges = [],
  dimensions = {},
  handleDimensionChange,
  errors = {},
  quantity,
  setQuantity,
  calculatePrice,
  servicehandel,
  getGridClass,
  thickness,
}: CuttingFormProps) => {
  return (
    <div className="lg:col-span-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sticky top-8">
        <div className="space-y-6">
          {/* material Selection */}

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-rose-600 to-orange-600 rounded-full"></div>
              DIAMETER
            </label>
            <div className="grid grid-cols-5 gap-2">
              {productConfig.materials.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMaterial(t.id)}
                  className={`py-3 px-2 rounded-lg border-2 font-semibold transition-all duration-300 ${
                    // Use passed material prop or check if parent passes it, for now assuming it's available or using some internal state if strictly needed but parent holds it
                    // Note: Connector has state 'material', define it in interface and pass it
                    // If prop not passed, logic fails. Assuming proper prop passed now.
                    material === t.id
                      ? "border-rose-600 bg-gradient-to-br from-rose-600 to-orange-600 text-white shadow-lg scale-105"
                      : "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:shadow-md"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

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
                <div key={key} className={`space-y-2 ${getGridClass(index)}`}>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Size {key.slice(4)}
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      min={dimensionRanges[index]?.[0] || 0}
                      max={dimensionRanges[index]?.[1] || 3000}
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
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
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
  );
};

export default CuttingForm;
