// src/components/website/PageSections/ProductsPage/SelectedConfiguration.tsx

import React from "react";
import { ProductFeature } from "@/lib/types/product";

interface SelectedConfigurationProps {
  selectedFeature: ProductFeature;
  measureUnit?: string;
  unitSize?: number;
  range?: number;
}

const SelectedConfiguration: React.FC<SelectedConfigurationProps> = ({
  selectedFeature,
  measureUnit = "Mt",
  unitSize,
  range,
}) => {
  const shortUnitLabel = measureUnit === "Mt" ? "m" : measureUnit || "m";

  return (
    <div className="p-5 border-2 border-[#7E1800]/20 rounded-xl bg-[#FFFBF4]">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-[#7E1800] text-white rounded-full flex items-center justify-center text-xs">
          ✓
        </span>
        Selected Configuration
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            Reference
          </div>
          <div className="font-bold text-gray-900">
            {selectedFeature.reference}
          </div>
        </div>

        {selectedFeature.thickness && selectedFeature.thickness > 0 ? (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
              Thickness
            </div>
            <div className="font-bold text-gray-900">
              {selectedFeature.thickness}mm
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
              Dimensions
            </div>
            <div className="font-bold text-gray-900">
              {selectedFeature.size1}
              {selectedFeature.size2 ? ` × ${selectedFeature.size2}` : ""}mm
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            Finish
          </div>
          <div className="font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
            {selectedFeature.finishQuality}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            Weight/meter
          </div>
          <div className="font-bold text-gray-900">
            {selectedFeature.kgsPerUnit} kg/{shortUnitLabel}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            Price/meter
          </div>
          <div className="font-bold text-[#E65100]">
            €{selectedFeature.miterPerUnitPrice}
          </div>
        </div>

        {(unitSize !== undefined || range !== undefined) && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
              Length
            </div>
            <div className="font-bold text-gray-900">
              {unitSize !== undefined ? `${unitSize}m` : `${range}m`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedConfiguration;
