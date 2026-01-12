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
  const unitLabel = measureUnit === "Mt" ? "meter" : measureUnit || "meter";
  const shortUnitLabel = measureUnit === "Mt" ? "m" : measureUnit || "m";

  return (
    <div className="p-5 border-2 border-[#7E1800]/20 rounded-xl bg-gradient-to-br from-[#7E1800]/5 via-amber-50 to-white">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-[#7E1800] text-white rounded-full flex items-center justify-center text-xs">
          ✓
        </span>
        Selected Configuration
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
          <div className="text-gray-500 text-xs mb-1">Reference</div>
          <div className="font-semibold text-gray-900">
            {selectedFeature.reference}
          </div>
        </div>
        {selectedFeature.thickness && selectedFeature.thickness > 0 && (
          <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
            <div className="text-gray-500 text-xs mb-1">Thickness</div>
            <div className="font-semibold text-gray-900">
              {selectedFeature.thickness}mm
            </div>
          </div>
        )}
        <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
          <div className="text-gray-500 text-xs mb-1">Dimensions</div>
          <div className="font-semibold text-gray-900">
            {selectedFeature.size1}
            {selectedFeature.size2 ? ` × ${selectedFeature.size2}` : ""}mm
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
          <div className="text-gray-500 text-xs mb-1">Finish</div>
          <div className="font-semibold text-gray-900">
            {selectedFeature.finishQuality}
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
          <div className="text-gray-500 text-xs mb-1">Weight/{unitLabel}</div>
          <div className="font-semibold text-gray-900">
            {selectedFeature.kgsPerUnit} kg/{shortUnitLabel}
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
          <div className="text-gray-500 text-xs mb-1">Price/{unitLabel}</div>
          <div className="font-semibold text-[#7E1800]">
            €{selectedFeature.miterPerUnitPrice}
          </div>
        </div>
        {(unitSize !== undefined && unitSize !== null) && (
          <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
            <div className="text-gray-500 text-xs mb-1">Length</div>
            <div className="font-semibold text-gray-900">
              {unitSize} {measureUnit}
            </div>
          </div>
        )}
        {(range !== undefined && range !== null) && (
          <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
            <div className="text-gray-500 text-xs mb-1">Custom Range</div>
            <div className="font-semibold text-gray-900">
              {range} {measureUnit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedConfiguration;
