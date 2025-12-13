import Image from "next/image";
import React from "react";
import { Zap } from "lucide-react";
export type Material = {
  id?: string;
  name?: string;
  color?: string;
  priceMultiplier?: number;
  gradient?: string;
};

interface CuttingLeftSideProps {
  renderShape: () => string;
  productConfig: {
    shapes: Array<{
      id: string;
      name: string;
      icon: string;
      description: string;
    }>;
  };
  currentMaterial?: Material;
  materials?: Material[];
  selectedShape: string;
  setSelectedShape: (shape: string) => void;
  getMaterialColor: () => string;
}

const CuttingLeftSide = ({
  renderShape,
  currentMaterial,
  productConfig,
  selectedShape,
  setSelectedShape,
  getMaterialColor,
}: CuttingLeftSideProps) => {
  return (
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

            {/* Shape Image */}
            <div className="relative w-64 h-64 transition-all duration-500 ease-out transform hover:scale-105">
              <Image
                src={renderShape()}
                alt="Selected Shape"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
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
              <div className="flex flex-col items-center justify-center h-full p-2">
                <div className="relative w-8 h-8 mb-1">
                  <Image
                    src={shape.icon}
                    alt={shape.name}
                    fill
                    className={`object-contain transition-transform duration-300 ${selectedShape === shape.id ? "scale-110" : "group-hover:scale-110"}`}
                  />
                </div>
                <span className="text-[10px] text-center font-medium text-slate-600 leading-tight line-clamp-2">
                  {shape.name}
                </span>
              </div>
              {selectedShape === shape.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce z-10">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuttingLeftSide;
