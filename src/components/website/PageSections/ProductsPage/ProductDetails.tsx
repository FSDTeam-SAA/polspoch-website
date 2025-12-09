// "use client";

// import React, { useMemo, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import { useProduct } from "@/lib/hooks/useProduct";
// import {
//   ShoppingCart,
//   ShoppingBag,
//   Info,
//   Plus,
//   Minus,
//   MapPin,
//   Truck,
//   HelpCircle,
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// // Shipping cost calculation based on weight and location
// function calculateShippingCost(weightKg: number, location: string): number {
//   const baseRate = 10; // Base shipping cost in euros
//   const weightRate = 2.5; // Cost per kg

//   // Location multipliers
//   const locationMultipliers: { [key: string]: number } = {
//     local: 1.0,
//     national: 1.5,
//     european: 2.0,
//     international: 3.0,
//   };

//   const multiplier = locationMultipliers[location] || 1.5;
//   const shippingCost = (baseRate + weightKg * weightRate) * multiplier;

//   return parseFloat(shippingCost.toFixed(2));
// }

// // Helper tooltips for Bangla users
// const TOOLTIPS = {
//   thickness: "পুরুত্ব - প্রোডাক্টের শক্তি নির্ধারণ করে। মোটা = শক্তিশালী",
//   size1: "প্রথম মাপ - প্রোডাক্টের প্রস্থ বা ব্যাস",
//   size2: "দ্বিতীয় মাপ - আয়তাকার প্রোডাক্টের জন্য দ্বিতীয় দিকের মাপ",
//   finishQuality: `ফিনিশিং কোয়ালিটি:
// • Mill Finish: সাধারণ (সস্তা)
// • Polished: চকচকে (মাঝারি)
// • Galvanized: মরিচা রোধক (বাইরের কাজে)
// • Powder Coated: রঙিন + টেকসই (দামি)`,
//   length: "দৈর্ঘ্য - কতটুকু লম্বা প্রোডাক্ট চান",
//   shipping: "শিপিং লোকেশন অনুযায়ী খরচ হিসাব হবে",
// };

// // Tooltip component
// const Tooltip = ({
//   text,
//   step,
//   showTooltip,
//   setShowTooltip,
// }: {
//   text: string;
//   step: string;
//   showTooltip: string | null;
//   setShowTooltip: (step: string | null) => void;
// }) => (
//   <div className="relative inline-block">
//     <button
//       type="button"
//       onMouseEnter={() => setShowTooltip(step)}
//       onMouseLeave={() => setShowTooltip(null)}
//       onClick={() => setShowTooltip(showTooltip === step ? null : step)}
//       className="ml-2 text-gray-400 hover:text-rose-800 transition-colors"
//       aria-label="Help"
//     >
//       <HelpCircle size={16} />
//     </button>
//     {showTooltip === step && (
//       <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 whitespace-pre-line">
//         {text}
//         <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
//       </div>
//     )}
//   </div>
// );

// export default function ProductDetailsCard() {
//   const { id } = useParams() as { id?: string };
//   const {
//     data: product,
//     isLoading,
//     isError,
//     error,
//   } = useProduct(id ?? "", !!id);

//   // Progressive filtering state
//   const [selectedThickness, setSelectedThickness] = useState<number | null>(
//     null
//   );
//   const [selectedSize1, setSelectedSize1] = useState<number | null>(null);
//   const [selectedSize2, setSelectedSize2] = useState<number | null>(null);
//   const [selectedFinishQuality, setSelectedFinishQuality] = useState<
//     string | null
//   >(null);

//   // Length and shipping
//   const [selectedUnitSizeMm, setSelectedUnitSizeMm] = useState<number | null>(
//     null
//   );
//   const [rangeLengthMeters, setRangeLengthMeters] = useState<number>(1);
//   const [customLength, setCustomLength] = useState<string>("");
//   const [shippingLocation, setShippingLocation] = useState<string>("national");
//   const [quantity, setQuantity] = useState<number>(1);

//   const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
//   const [showTooltip, setShowTooltip] = useState<string | null>(null);
//   const [lengthError, setLengthError] = useState<string>("");

//   // Initialize range value when product loads
//   React.useEffect(() => {
//     if (!product) return;
//     const minv = product.minRange ?? 1;
//     setRangeLengthMeters(minv);
//   }, [product]);

//   // Progressive filtering: Get available options based on previous selections

//   // Step 1: Get all unique thickness values
//   const thicknessOptions = useMemo(() => {
//     if (!product?.features) return [];
//     const set = new Set<number>();
//     product.features.forEach((f) => {
//       if (typeof f.thickness === "number") set.add(f.thickness);
//     });
//     return Array.from(set).sort((a, b) => a - b);
//   }, [product]);

//   // Step 2: Get available Size1 options based on selected thickness
//   const size1Options = useMemo(() => {
//     if (!product?.features || selectedThickness === null) return [];
//     const set = new Set<number>();
//     product.features.forEach((f) => {
//       if (f.thickness === selectedThickness && typeof f.size1 === "number") {
//         set.add(f.size1);
//       }
//     });
//     return Array.from(set).sort((a, b) => a - b);
//   }, [product, selectedThickness]);

//   // Step 3: Get available Size2 options based on thickness and size1
//   const size2Options = useMemo(() => {
//     if (
//       !product?.features ||
//       selectedThickness === null ||
//       selectedSize1 === null
//     )
//       return [];
//     const set = new Set<number>();
//     product.features.forEach((f) => {
//       if (
//         f.thickness === selectedThickness &&
//         f.size1 === selectedSize1 &&
//         typeof f.size2 === "number"
//       ) {
//         set.add(f.size2);
//       }
//     });
//     return Array.from(set).sort((a, b) => a - b);
//   }, [product, selectedThickness, selectedSize1]);

//   // Step 4: Get available Finish Quality options
//   const finishQualityOptions = useMemo(() => {
//     if (
//       !product?.features ||
//       selectedThickness === null ||
//       selectedSize1 === null
//     )
//       return [];
//     const set = new Set<string>();
//     product.features.forEach((f) => {
//       if (
//         f.thickness === selectedThickness &&
//         f.size1 === selectedSize1 &&
//         (selectedSize2 === null || f.size2 === selectedSize2) &&
//         f.finishQuality
//       ) {
//         set.add(f.finishQuality);
//       }
//     });
//     return Array.from(set).sort();
//   }, [product, selectedThickness, selectedSize1, selectedSize2]);

//   // Get the final selected feature based on all selections
//   const selectedFeature = useMemo(() => {
//     if (
//       !product?.features ||
//       selectedThickness === null ||
//       selectedSize1 === null ||
//       selectedFinishQuality === null
//     )
//       return null;

//     return (
//       product.features.find(
//         (f) =>
//           f.thickness === selectedThickness &&
//           f.size1 === selectedSize1 &&
//           (selectedSize2 === null || f.size2 === selectedSize2) &&
//           f.finishQuality === selectedFinishQuality
//       ) || null
//     );
//   }, [
//     product,
//     selectedThickness,
//     selectedSize1,
//     selectedSize2,
//     selectedFinishQuality,
//   ]);

//   // Get available unit sizes for the selected feature
//   const availableUnitSizes = useMemo(() => {
//     return selectedFeature?.unitSizes || [];
//   }, [selectedFeature]);

//   // Calculate total weight
//   const totalWeight = useMemo(() => {
//     if (!selectedFeature) return 0;
//     const kgsPerUnit = selectedFeature.kgsPerUnit ?? 0;

//     if (selectedUnitSizeMm !== null) {
//       const meters = selectedUnitSizeMm / 1000;
//       return kgsPerUnit * meters * quantity;
//     }

//     return kgsPerUnit * rangeLengthMeters * quantity;
//   }, [selectedFeature, selectedUnitSizeMm, rangeLengthMeters, quantity]);

//   // Calculate shipping cost
//   const shippingCost = useMemo(() => {
//     if (!selectedFeature || totalWeight === 0) return 0;
//     return calculateShippingCost(totalWeight, shippingLocation);
//   }, [selectedFeature, totalWeight, shippingLocation]);

//   // Calculate product price
//   const productPrice = useMemo(() => {
//     if (!selectedFeature) return 0;
//     const pricePerMeter = selectedFeature.miterPerUnitPrice ?? 0;

//     if (selectedUnitSizeMm !== null) {
//       const meters = selectedUnitSizeMm / 1000;
//       return pricePerMeter * meters * quantity;
//     }

//     return pricePerMeter * rangeLengthMeters * quantity;
//   }, [selectedFeature, selectedUnitSizeMm, rangeLengthMeters, quantity]);

//   // Total price including shipping
//   const totalPrice = useMemo(() => {
//     return productPrice + shippingCost;
//   }, [productPrice, shippingCost]);

//   // Handle selections with progressive reset
//   const handleThicknessSelect = (thickness: number) => {
//     setSelectedThickness(thickness);
//     // Reset subsequent selections
//     setSelectedSize1(null);
//     setSelectedSize2(null);
//     setSelectedFinishQuality(null);
//     setSelectedUnitSizeMm(null);
//     setCustomLength("");
//   };

//   const handleSize1Select = (size: number) => {
//     setSelectedSize1(size);
//     // Reset subsequent selections
//     setSelectedSize2(null);
//     setSelectedFinishQuality(null);
//     setSelectedUnitSizeMm(null);
//     setCustomLength("");
//   };

//   const handleSize2Select = (size: number) => {
//     setSelectedSize2(size);
//     // Reset subsequent selections
//     setSelectedFinishQuality(null);
//     setSelectedUnitSizeMm(null);
//     setCustomLength("");
//   };

//   const handleFinishQualitySelect = (quality: string) => {
//     setSelectedFinishQuality(quality);
//     // Reset length selection
//     setSelectedUnitSizeMm(null);
//     setCustomLength("");
//   };

//   const handleUnitSizeSelect = (size: number) => {
//     setSelectedUnitSizeMm(size);
//     setCustomLength(String(size));
//   };

//   const handleCustomLengthSubmit = () => {
//     const parsed = parseFloat(customLength);
//     if (!isNaN(parsed) && parsed > 0) {
//       setSelectedUnitSizeMm(parsed);
//       setLengthError("");
//     } else {
//       setLengthError("Please enter a valid length");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-10">
//         <Skeleton className="h-8 w-1/3 mb-4" />
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-6">
//             <Skeleton className="w-full h-[520px] mb-4" />
//             <div className="flex gap-3">
//               <Skeleton className="w-20 h-20" />
//               <Skeleton className="w-20 h-20" />
//               <Skeleton className="w-20 h-20" />
//             </div>
//           </div>
//           <div className="lg:col-span-6">
//             <Skeleton className="h-6 w-2/3 mb-2" />
//             <Skeleton className="h-4 w-full mb-6" />
//             <Skeleton className="h-10 w-full mb-4" />
//             <Skeleton className="h-10 w-full mb-4" />
//             <Skeleton className="h-10 w-full mb-4" />
//             <Skeleton className="h-10 w-full mb-4" />
//             <Skeleton className="h-10 w-full mb-4" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError || !product) {
//     return (
//       <div className="container mx-auto py-10">
//         <div className="text-red-600">
//           Failed to load product. {error?.message ?? ""}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* LEFT: Image Section */}
//         <div className="lg:col-span-6">
//           <div className="rounded-lg overflow-hidden border bg-gray-50">
//             <div className="relative w-full h-[520px]">
//               {product.productImage?.[selectedThumbnail]?.url ? (
//                 <Image
//                   src={product.productImage[selectedThumbnail].url}
//                   alt={product.productName}
//                   fill
//                   style={{ objectFit: "cover" }}
//                   sizes="(max-width: 1024px) 100vw, 50vw"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-gray-400">
//                   No image
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Thumbnails */}
//           <div className="mt-4 flex gap-3 items-center">
//             {product.productImage && product.productImage.length > 0 ? (
//               product.productImage.map((img, idx) => (
//                 <button
//                   key={img._id ?? idx}
//                   onClick={() => setSelectedThumbnail(idx)}
//                   className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
//                     selectedThumbnail === idx
//                       ? "border-rose-800"
//                       : "border-gray-300"
//                   } p-0`}
//                 >
//                   <div className="relative w-full h-full">
//                     <Image
//                       src={img?.url}
//                       alt={`${product.productName}-${idx}`}
//                       fill
//                       style={{ objectFit: "cover" }}
//                     />
//                   </div>
//                 </button>
//               ))
//             ) : (
//               <div className="text-sm text-gray-500">No thumbnails</div>
//             )}
//           </div>
//         </div>

//         {/* RIGHT: Product Details with 6-Step Customization */}
//         <div className="lg:col-span-6 flex flex-col">
//           <h1 className="text-2xl lg:text-3xl font-semibold mb-3">
//             {product.productName}
//           </h1>
//           <p className="text-sm text-gray-500 mb-6">
//             Crafted for strength and durability. Available in multiple sizes and
//             finishes. {product.unitSizeCustomizationNote ?? ""}
//           </p>

//           {/* Step 1: Select Thickness */}
//           <div className="mb-6">
//             <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
//               <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
//                 1
//               </span>
//               Select Thickness
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {thicknessOptions.length === 0 ? (
//                 <div className="text-sm text-gray-400">
//                   No thickness options available
//                 </div>
//               ) : (
//                 thicknessOptions.map((thickness) => {
//                   const isSelected = selectedThickness === thickness;

//                   return (
//                     <button
//                       key={thickness}
//                       onClick={() => handleThicknessSelect(thickness)}
//                       className={`px-4 py-2 rounded border transition-all ${
//                         isSelected
//                           ? "bg-rose-800 border-rose-800 text-white shadow-md"
//                           : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
//                       }`}
//                     >
//                       {thickness}mm
//                     </button>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* Step 2: Select Size 1 */}
//           {selectedThickness !== null && (
//             <div className="mb-6">
//               <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
//                 <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
//                   2
//                 </span>
//                 Select Size 1
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {size1Options.length === 0 ? (
//                   <div className="text-sm text-gray-400">
//                     No size options available
//                   </div>
//                 ) : (
//                   size1Options.map((size) => {
//                     const isSelected = selectedSize1 === size;

//                     return (
//                       <button
//                         key={size}
//                         onClick={() => handleSize1Select(size)}
//                         className={`px-4 py-2 rounded border transition-all ${
//                           isSelected
//                             ? "bg-rose-800 border-rose-800 text-white shadow-md"
//                             : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
//                         }`}
//                       >
//                         {size}mm
//                       </button>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 3: Select Size 2 */}
//           {selectedSize1 !== null && size2Options.length > 0 && (
//             <div className="mb-6">
//               <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
//                 <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
//                   3
//                 </span>
//                 Select Size 2
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {size2Options.map((size) => {
//                   const isSelected = selectedSize2 === size;

//                   return (
//                     <button
//                       key={size}
//                       onClick={() => handleSize2Select(size)}
//                       className={`px-4 py-2 rounded border transition-all ${
//                         isSelected
//                           ? "bg-rose-800 border-rose-800 text-white shadow-md"
//                           : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
//                       }`}
//                     >
//                       {size}mm
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Step 4: Select Finish Quality */}
//           {selectedSize1 !== null &&
//             (size2Options.length === 0 || selectedSize2 !== null) && (
//               <div className="mb-6">
//                 <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
//                   <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
//                     {size2Options.length > 0 ? "4" : "3"}
//                   </span>
//                   Select Finish Quality
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {finishQualityOptions.length === 0 ? (
//                     <div className="text-sm text-gray-400">
//                       No finish options available
//                     </div>
//                   ) : (
//                     finishQualityOptions.map((quality) => {
//                       const isSelected = selectedFinishQuality === quality;

//                       return (
//                         <button
//                           key={quality}
//                           onClick={() => handleFinishQualitySelect(quality)}
//                           className={`px-4 py-2 rounded border transition-all ${
//                             isSelected
//                               ? "bg-rose-800 border-rose-800 text-white shadow-md"
//                               : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
//                           }`}
//                         >
//                           {quality}
//                         </button>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>
//             )}

//           {/* Show feature details when selected */}
//           {selectedFeature && (
//             <>
//               {/* Feature Info Card */}
//               <div className="mb-6 p-4 border rounded-lg bg-rose-50">
//                 <div className="text-sm font-medium text-gray-700 mb-2">
//                   Selected Configuration
//                 </div>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div className="text-gray-600">
//                     Reference:{" "}
//                     <span className="font-medium text-gray-900">
//                       {selectedFeature.reference}
//                     </span>
//                   </div>
//                   <div className="text-gray-600">
//                     Thickness:{" "}
//                     <span className="font-medium text-gray-900">
//                       {selectedFeature.thickness}mm
//                     </span>
//                   </div>
//                   <div className="text-gray-600">
//                     Size1:{" "}
//                     <span className="font-medium text-gray-900">
//                       {selectedFeature.size1}mm
//                     </span>
//                   </div>
//                   {selectedFeature.size2 && (
//                     <div className="text-gray-600">
//                       Size2:{" "}
//                       <span className="font-medium text-gray-900">
//                         {selectedFeature.size2}mm
//                       </span>
//                     </div>
//                   )}
//                   <div className="text-gray-600">
//                     Finish:{" "}
//                     <span className="font-medium text-gray-900">
//                       {selectedFeature.finishQuality}
//                     </span>
//                   </div>
//                   <div className="text-gray-600">
//                     Weight:{" "}
//                     <span className="font-medium text-gray-900">
//                       {selectedFeature.kgsPerUnit} kg/unit
//                     </span>
//                   </div>
//                   <div className="col-span-2 text-gray-600">
//                     Price per meter:{" "}
//                     <span className="font-medium text-rose-800">
//                       €{selectedFeature.miterPerUnitPrice}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Step 5: Length Selection */}
//               <div className="mb-6">
//                 <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
//                   <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
//                     {size2Options.length > 0 ? "5" : "4"}
//                   </span>
//                   Select Length
//                   <Info size={14} className="text-gray-400" />
//                 </div>

//                 {/* Quick Select Unit Sizes */}
//                 {availableUnitSizes.length > 0 && (
//                   <div className="mb-3">
//                     <div className="text-xs text-gray-500 mb-2">
//                       Predefined lengths (mm):
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {availableUnitSizes.map((size) => (
//                         <button
//                           key={size}
//                           onClick={() => handleUnitSizeSelect(size)}
//                           className={`px-3 py-1 rounded border transition-all ${
//                             selectedUnitSizeMm === size
//                               ? "bg-rose-100 border-rose-800 text-rose-800 font-medium"
//                               : "bg-gray-100 border-gray-300 text-gray-700 hover:border-rose-400"
//                           }`}
//                         >
//                           {size}mm
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Custom Length Input */}
//                 <div className="flex items-center gap-3 mb-3">
//                   <input
//                     type="number"
//                     value={customLength}
//                     onChange={(e) => setCustomLength(e.target.value)}
//                     placeholder="Enter custom length (mm)"
//                     className="flex-1 px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
//                   />
//                   <button
//                     onClick={handleCustomLengthSubmit}
//                     className="px-4 py-2 border rounded bg-rose-800 text-white hover:bg-rose-900 transition"
//                   >
//                     Apply
//                   </button>
//                 </div>

//                 {/* Range Finder (if no unit size selected) */}
//                 {selectedUnitSizeMm === null && (
//                   <div className="p-4 border rounded-lg bg-gray-50">
//                     <div className="text-sm font-medium text-gray-700 mb-3">
//                       Or use range finder (meters)
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <input
//                         type="range"
//                         min={product.minRange ?? 1}
//                         max={product.maxRange ?? 100}
//                         value={rangeLengthMeters}
//                         onChange={(e) =>
//                           setRangeLengthMeters(Number(e.target.value))
//                         }
//                         className="flex-1"
//                       />
//                       <div className="text-lg font-semibold text-rose-800 min-w-[80px] text-right">
//                         {rangeLengthMeters}m
//                       </div>
//                     </div>
//                     <div className="flex justify-between text-xs text-gray-500 mt-1">
//                       <span>Min: {product.minRange}m</span>
//                       <span>Max: {product.maxRange}m</span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Quantity Selector */}
//               <div className="mb-6">
//                 <div className="text-sm font-medium text-rose-800 mb-2">
//                   Quantity
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-100 transition"
//                   >
//                     <Minus size={16} />
//                   </button>
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={(e) =>
//                       setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                     }
//                     min={1}
//                     className="w-20 text-center border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-800"
//                     aria-label="Quantity"
//                   />
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-100 transition"
//                     aria-label="Increase quantity"
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>
//               </div>

//               {/* Step 6: Shipping Location */}
//               <div className="mb-6">
//                 <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
//                   <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
//                     {size2Options.length > 0 ? "6" : "5"}
//                   </span>
//                   Select Shipping Location (শিপিং লোকেশন নির্বাচন করুন)
//                   <Tooltip
//                     text={TOOLTIPS.shipping}
//                     step="shipping"
//                     showTooltip={showTooltip}
//                     setShowTooltip={setShowTooltip}
//                   />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {["local", "national", "european", "international"].map(
//                     (loc) => {
//                       const isSelected = shippingLocation === loc;
//                       return (
//                         <button
//                           key={loc}
//                           onClick={() => setShippingLocation(loc)}
//                           className={`px-4 py-2 rounded border transition-all capitalize ${
//                             isSelected
//                               ? "bg-rose-800 border-rose-800 text-white shadow-md"
//                               : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
//                           }`}
//                           aria-label={`Select ${loc} shipping`}
//                         >
//                           <MapPin size={14} className="inline mr-1" />
//                           {loc}
//                         </button>
//                       );
//                     }
//                   )}
//                 </div>
//               </div>

//               {/* Price Summary */}
//               <div className="mb-6 p-6 border-2 border-rose-800 rounded-lg bg-white shadow-sm">
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">Product Price:</span>
//                     <span className="font-medium">
//                       €{productPrice.toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">Shipping Cost:</span>
//                     <span className="font-medium">
//                       €{shippingCost.toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="border-t pt-2 flex justify-between items-center">
//                     <span className="text-lg font-semibold text-gray-800">
//                       Total Price:
//                     </span>
//                     <span className="text-3xl font-bold text-rose-800">
//                       €{totalPrice.toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     {selectedUnitSizeMm
//                       ? `${selectedUnitSizeMm}mm × ${quantity} qty`
//                       : `${rangeLengthMeters}m × ${quantity} qty`}
//                   </div>
//                   {totalPrice >= 500 && (
//                     <div className="text-xs text-green-600 font-medium mt-2">
//                       ✓ Free shipping applied (orders above €500)
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//                 <button className="w-full py-4 border-2 border-rose-800 text-rose-800 rounded-lg text-lg font-medium flex items-center justify-center gap-3 hover:bg-rose-50 transition">
//                   <ShoppingCart size={20} /> Add to Cart
//                 </button>
//                 <button className="w-full py-4 bg-rose-800 text-white rounded-lg text-lg font-medium flex items-center justify-center gap-3 hover:bg-rose-900 transition">
//                   <ShoppingBag size={20} /> Order Now
//                 </button>
//               </div>
//             </>
//           )}

//           {/* Initial message when no feature selected */}
//           {!selectedFeature && selectedThickness !== null && (
//             <div className="mt-8 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
//               <Info size={32} className="mx-auto mb-2 text-gray-400" />
//               <p>Please complete all selections to view pricing and options</p>
//             </div>
//           )}

//           {/* Initial message when nothing selected */}
//           {selectedThickness === null && (
//             <div className="mt-8 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
//               <Info size={32} className="mx-auto mb-2 text-gray-400" />
//               <p>Please select a thickness to begin customization</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useProduct } from "@/lib/hooks/useProduct";
import {
  ShoppingCart,
  ShoppingBag,
  Info,
  Plus,
  Minus,
  MapPin,
  Truck,
  HelpCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Shipping cost calculation based on weight and location
function calculateShippingCost(weightKg: number, location: string): number {
  const baseRate = 10;
  const weightRate = 2.5;

  const locationMultipliers: { [key: string]: number } = {
    local: 1.0,
    national: 1.5,
    european: 2.0,
    international: 3.0,
  };

  const multiplier = locationMultipliers[location] || 1.5;
  const shippingCost = (baseRate + weightKg * weightRate) * multiplier;

  return parseFloat(shippingCost.toFixed(2));
}

// Helper tooltips
const TOOLTIPS = {
  thickness: "Thickness determines product strength. Thicker = Stronger",
  size1: "Primary dimension - width or diameter of the product",
  size2:
    "Secondary dimension - height or second dimension (required for this product)",
  finishQuality: `Finish Quality Options:
• Mill Finish: Standard (economical)
• Polished: Glossy (medium price)
• Galvanized: Rust-resistant (outdoor use)
• Powder Coated: Colored + Durable (premium)`,
  length: "Length - how long you want the product",
  shipping: "Shipping cost calculated based on location",
};

// Tooltip component
const Tooltip = ({
  text,
  step,
  showTooltip,
  setShowTooltip,
}: {
  text: string;
  step: string;
  showTooltip: string | null;
  setShowTooltip: (step: string | null) => void;
}) => (
  <div className="relative inline-block">
    <button
      type="button"
      onMouseEnter={() => setShowTooltip(step)}
      onMouseLeave={() => setShowTooltip(null)}
      onClick={() => setShowTooltip(showTooltip === step ? null : step)}
      className="ml-2 text-gray-400 hover:text-rose-800 transition-colors"
      aria-label="Help"
    >
      <HelpCircle size={16} />
    </button>
    {showTooltip === step && (
      <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 whitespace-pre-line">
        {text}
        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
      </div>
    )}
  </div>
);

export default function ProductDetailsCard() {
  const { id } = useParams() as { id?: string };
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(id ?? "", !!id);

  // Progressive filtering state
  const [selectedThickness, setSelectedThickness] = useState<number | null>(
    null
  );
  const [selectedSize1, setSelectedSize1] = useState<number | null>(null);
  const [selectedSize2, setSelectedSize2] = useState<number | null>(null);
  const [selectedFinishQuality, setSelectedFinishQuality] = useState<
    string | null
  >(null);

  // Length and shipping
  const [selectedUnitSizeMm, setSelectedUnitSizeMm] = useState<number | null>(
    null
  );
  const [rangeLengthMeters, setRangeLengthMeters] = useState<number>(1);
  const [customLength, setCustomLength] = useState<string>("");
  const [shippingLocation, setShippingLocation] = useState<string>("national");
  const [quantity, setQuantity] = useState<number>(1);

  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [lengthError, setLengthError] = useState<string>("");

  // Initialize range value when product loads
  React.useEffect(() => {
    if (!product) return;
    const minv = product.minRange ?? 1;
    setRangeLengthMeters(minv);
  }, [product]);

  // STEP 1: Get unique thickness values
  const thicknessOptions = useMemo(() => {
    if (!product?.features) return [];
    const set = new Set<number>();
    product.features.forEach((f) => {
      if (typeof f.thickness === "number") set.add(f.thickness);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [product]);

  // STEP 2: Get Size1 options based on selected thickness
  const size1Options = useMemo(() => {
    if (!product?.features || selectedThickness === null) return [];
    const set = new Set<number>();
    product.features.forEach((f) => {
      if (f.thickness === selectedThickness && typeof f.size1 === "number") {
        set.add(f.size1);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [product, selectedThickness]);

  // STEP 3: Get Size2 options based on thickness and size1 (size2 is required)
  const size2Options = useMemo(() => {
    if (
      !product?.features ||
      selectedThickness === null ||
      selectedSize1 === null
    )
      return [];
    const set = new Set<number>();
    product.features.forEach((f) => {
      if (
        f.thickness === selectedThickness &&
        f.size1 === selectedSize1 &&
        typeof f.size2 === "number"
      ) {
        set.add(f.size2);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [product, selectedThickness, selectedSize1]);

  // STEP 4: Get Finish Quality options
  const finishQualityOptions = useMemo(() => {
    if (
      !product?.features ||
      selectedThickness === null ||
      selectedSize1 === null ||
      selectedSize2 === null
    )
      return [];
    const set = new Set<string>();
    product.features.forEach((f) => {
      if (
        f.thickness === selectedThickness &&
        f.size1 === selectedSize1 &&
        f.size2 === selectedSize2 &&
        f.finishQuality
      ) {
        set.add(f.finishQuality);
      }
    });
    return Array.from(set).sort();
  }, [product, selectedThickness, selectedSize1, selectedSize2]);

  // Get the final selected feature (requires size2)
  const selectedFeature = useMemo(() => {
    if (
      !product?.features ||
      selectedThickness === null ||
      selectedSize1 === null ||
      selectedSize2 === null ||
      selectedFinishQuality === null
    )
      return null;

    return (
      product.features.find(
        (f) =>
          f.thickness === selectedThickness &&
          f.size1 === selectedSize1 &&
          f.size2 === selectedSize2 &&
          f.finishQuality === selectedFinishQuality
      ) || null
    );
  }, [
    product,
    selectedThickness,
    selectedSize1,
    selectedSize2,
    selectedFinishQuality,
  ]);

  // Get available unit sizes for the selected feature
  const availableUnitSizes = useMemo(() => {
    return selectedFeature?.unitSizes || [];
  }, [selectedFeature]);

  // Calculate total weight (kg)
  const totalWeight = useMemo(() => {
    if (!selectedFeature) return 0;
    const kgsPerUnit = selectedFeature.kgsPerUnit ?? 0;

    if (selectedUnitSizeMm !== null) {
      const meters = selectedUnitSizeMm / 1000;
      return kgsPerUnit * meters * quantity;
    }

    // rangeLengthMeters is in meters
    return kgsPerUnit * rangeLengthMeters * quantity;
  }, [selectedFeature, selectedUnitSizeMm, rangeLengthMeters, quantity]);

  // Calculate shipping cost
  const shippingCost = useMemo(() => {
    if (!selectedFeature || totalWeight === 0) return 0;
    return calculateShippingCost(totalWeight, shippingLocation);
  }, [selectedFeature, totalWeight, shippingLocation]);

  // Calculate product price
  const productPrice = useMemo(() => {
    if (!selectedFeature) return 0;
    const pricePerMeter = selectedFeature.miterPerUnitPrice ?? 0;

    if (selectedUnitSizeMm !== null) {
      const meters = selectedUnitSizeMm / 1000;
      return pricePerMeter * meters * quantity;
    }

    return pricePerMeter * rangeLengthMeters * quantity;
  }, [selectedFeature, selectedUnitSizeMm, rangeLengthMeters, quantity]);

  // Total price including shipping
  const totalPrice = useMemo(() => {
    return productPrice + shippingCost;
  }, [productPrice, shippingCost]);

  // Selection handlers with progressive reset
  const handleThicknessSelect = (thickness: number) => {
    setSelectedThickness(thickness);
    setSelectedSize1(null);
    setSelectedSize2(null);
    setSelectedFinishQuality(null);
    setSelectedUnitSizeMm(null);
    setCustomLength("");
    setLengthError("");
  };

  const handleSize1Select = (size: number) => {
    setSelectedSize1(size);
    setSelectedSize2(null);
    setSelectedFinishQuality(null);
    setSelectedUnitSizeMm(null);
    setCustomLength("");
    setLengthError("");
  };

  const handleSize2Select = (size: number) => {
    setSelectedSize2(size);
    setSelectedFinishQuality(null);
    setSelectedUnitSizeMm(null);
    setCustomLength("");
    setLengthError("");
  };

  const handleFinishQualitySelect = (quality: string) => {
    setSelectedFinishQuality(quality);
    setSelectedUnitSizeMm(null);
    setCustomLength("");
    setLengthError("");
  };

  const handleUnitSizeSelect = (size: number) => {
    setSelectedUnitSizeMm(size);
    setCustomLength(String(size));
    setLengthError("");
  };

  const handleCustomLengthSubmit = () => {
    const parsed = parseFloat(customLength);
    if (!isNaN(parsed) && parsed > 0) {
      // custom length expects mm, convert to mm stored as mm value
      setSelectedUnitSizeMm(parsed);
      setLengthError("");
    } else {
      setLengthError("Please enter a valid length (mm)");
    }
  };

  // Calculate current step number
  const getCurrentStepNumber = () => {
    let step = 0;
    if (selectedThickness !== null) step++;
    if (selectedSize1 !== null) step++;
    if (selectedSize2 !== null) step++; // required
    if (selectedFinishQuality !== null) step++;
    if (
      selectedFeature &&
      (selectedUnitSizeMm !== null || rangeLengthMeters > 0)
    )
      step++;
    return step;
  };

  // Checkout / Add to cart handlers (placeholder)
  const canCheckout =
    !!selectedFeature &&
    (selectedUnitSizeMm !== null || rangeLengthMeters > 0) &&
    quantity > 0;

  const handleAddToCart = () => {
    if (!canCheckout) return;
    // Implement add-to-cart logic with your cart API
    console.log("Add to cart:", {
      productId: product?._id,
      reference: selectedFeature?.reference,
      thickness: selectedThickness,
      size1: selectedSize1,
      size2: selectedSize2,
      finish: selectedFinishQuality,
      lengthMm: selectedUnitSizeMm ?? rangeLengthMeters * 1000,
      quantity,
      price: totalPrice,
    });
    alert("Added to cart (placeholder)");
  };

  const handleBuyNow = () => {
    if (!canCheckout) return;
    // Implement buy-now logic (checkout flow)
    console.log("Buy now:", {
      productId: product?._id,
      reference: selectedFeature?.reference,
      thickness: selectedThickness,
      size1: selectedSize1,
      size2: selectedSize2,
      finish: selectedFinishQuality,
      lengthMm: selectedUnitSizeMm ?? rangeLengthMeters * 1000,
      quantity,
      price: totalPrice,
    });
    alert("Proceeding to checkout (placeholder)");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <Skeleton className="w-full h-[520px] mb-4" />
            <div className="flex gap-3">
              <Skeleton className="w-20 h-20" />
              <Skeleton className="w-20 h-20" />
              <Skeleton className="w-20 h-20" />
            </div>
          </div>
          <div className="lg:col-span-6">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-600">
          Failed to load product. {error?.message ?? ""}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Image Section */}
        <div className="lg:col-span-6">
          <div className="rounded-lg overflow-hidden border bg-gray-50">
            <div className="relative w-full h-[520px]">
              {product.productImage?.[selectedThumbnail]?.url ? (
                <Image
                  src={product.productImage[selectedThumbnail].url}
                  alt={product.productName}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3 items-center overflow-x-auto pb-2">
            {product.productImage && product.productImage.length > 0 ? (
              product.productImage.map((img, idx) => (
                <button
                  key={img._id ?? idx}
                  onClick={() => setSelectedThumbnail(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    selectedThumbnail === idx
                      ? "border-rose-800"
                      : "border-gray-300"
                  } p-0`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img?.url}
                      alt={`${product.productName}-${idx}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500">No thumbnails</div>
            )}
          </div>
        </div>

        {/* RIGHT: Progressive Selection */}
        <div className="lg:col-span-6 flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-3">
            {product.productName}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {product.productDescription ||
              "Crafted for strength and durability. Available in multiple sizes and finishes."}
          </p>

          {/* STEP 1: Select Thickness */}
          <div className="mb-6">
            <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
              <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Select Thickness
              <Tooltip
                text={TOOLTIPS.thickness}
                step="thickness"
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {thicknessOptions.length === 0 ? (
                <div className="text-sm text-gray-400">
                  No thickness options available
                </div>
              ) : (
                thicknessOptions.map((thickness) => (
                  <button
                    key={thickness}
                    onClick={() => handleThicknessSelect(thickness)}
                    className={`px-4 py-2 rounded border transition-all ${
                      selectedThickness === thickness
                        ? "bg-rose-800 border-rose-800 text-white shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                    }`}
                  >
                    {thickness}mm
                  </button>
                ))
              )}
            </div>
          </div>

          {/* STEP 2: Select Size 1 */}
          {selectedThickness !== null && (
            <div className="mb-6">
              <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Select Size 1 (Width/Diameter)
                <Tooltip
                  text={TOOLTIPS.size1}
                  step="size1"
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {size1Options.length === 0 ? (
                  <div className="text-sm text-gray-400">
                    No size options available
                  </div>
                ) : (
                  size1Options.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSize1Select(size)}
                      className={`px-4 py-2 rounded border transition-all ${
                        selectedSize1 === size
                          ? "bg-rose-800 border-rose-800 text-white shadow-md"
                          : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                      }`}
                    >
                      {size}mm
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Select Size 2 (required) */}
          {selectedSize1 !== null && (
            <div className="mb-6">
              <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Select Size 2 (Height / Second Dimension) —{" "}
                <span className="font-medium">required</span>
                <Tooltip
                  text={TOOLTIPS.size2}
                  step="size2"
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {size2Options.length === 0 ? (
                  <div className="text-sm text-gray-400">
                    No size2 options available for this Thickness & Size 1
                  </div>
                ) : (
                  size2Options.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSize2Select(size)}
                      className={`px-4 py-2 rounded border transition-all ${
                        selectedSize2 === size
                          ? "bg-rose-800 border-rose-800 text-white shadow-md"
                          : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                      }`}
                    >
                      {size}mm
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Select Finish Quality */}
          {selectedSize2 !== null && (
            <div className="mb-6">
              <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  4
                </span>
                Select Finish Quality
                <Tooltip
                  text={TOOLTIPS.finishQuality}
                  step="finishQuality"
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {finishQualityOptions.length === 0 ? (
                  <div className="text-sm text-gray-400">
                    No finish options available
                  </div>
                ) : (
                  finishQualityOptions.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleFinishQualitySelect(quality)}
                      className={`px-4 py-2 rounded border transition-all ${
                        selectedFinishQuality === quality
                          ? "bg-rose-800 border-rose-800 text-white shadow-md"
                          : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                      }`}
                    >
                      {quality}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Show feature details when selected */}
          {selectedFeature && (
            <>
              {/* Feature Info Card */}
              <div className="mb-6 p-4 border rounded-lg bg-rose-50">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Selected Configuration
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-600">
                    Reference:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.reference}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Thickness:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.thickness}mm
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Size 1:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.size1}mm
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Size 2:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.size2}mm
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Finish:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.finishQuality}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Weight:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFeature.kgsPerUnit} kg/m
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-600">
                    Price per meter:{" "}
                    <span className="font-medium text-rose-800">
                      €{selectedFeature.miterPerUnitPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* STEP 5: Length Selection */}
              <div className="mb-6">
                <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                  <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    5
                  </span>
                  Select Length
                  <Tooltip
                    text={TOOLTIPS.length}
                    step="length"
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>

                {/* Predefined lengths */}
                {availableUnitSizes.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-2">
                      Quick select (predefined lengths):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableUnitSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleUnitSizeSelect(size)}
                          className={`px-3 py-2 rounded border transition-all ${
                            selectedUnitSizeMm === size
                              ? "bg-rose-100 border-rose-800 text-rose-800 font-medium"
                              : "bg-gray-100 border-gray-300 text-gray-700 hover:border-rose-400"
                          }`}
                        >
                          {size}mm
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom length input */}
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-2">
                    Or enter custom length (mm):
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={customLength}
                      onChange={(e) => setCustomLength(e.target.value)}
                      placeholder="Enter length in mm"
                      className="flex-1 px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                    />
                    <button
                      onClick={handleCustomLengthSubmit}
                      className="px-4 py-2 border rounded bg-rose-800 text-white hover:bg-rose-900 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {lengthError && (
                    <div className="text-xs text-red-600 mt-1">
                      {lengthError}
                    </div>
                  )}
                </div>

                {/* Range slider (if no unit size selected) */}
                {selectedUnitSizeMm === null && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      Or use range slider (meters):
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={product.minRange ?? 1}
                        max={product.maxRange ?? 100}
                        value={rangeLengthMeters}
                        onChange={(e) =>
                          setRangeLengthMeters(Number(e.target.value))
                        }
                        className="flex-1 accent-rose-800"
                      />
                      <div className="text-lg font-semibold text-rose-800 min-w-[80px] text-right">
                        {rangeLengthMeters}m
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Min: {product.minRange}m</span>
                      <span>Max: {product.maxRange}m</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="text-sm font-medium text-rose-800 mb-2">
                  Quantity
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min={1}
                    className="w-20 text-center border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* STEP 6: Shipping Location */}
              <div className="mb-6">
                <div className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                  <span className="bg-rose-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    6
                  </span>
                  Select Shipping Location
                  <Tooltip
                    text={TOOLTIPS.shipping}
                    step="shipping"
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["local", "national", "european", "international"].map(
                    (loc) => (
                      <button
                        key={loc}
                        onClick={() => setShippingLocation(loc)}
                        className={`px-4 py-2 rounded border transition-all capitalize ${
                          shippingLocation === loc
                            ? "bg-rose-800 border-rose-800 text-white shadow-md"
                            : "bg-white border-gray-300 text-gray-700 hover:border-rose-400"
                        }`}
                      >
                        <MapPin size={14} className="inline mr-1" />
                        {loc}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div className="mb-6 p-6 border-2 border-rose-800 rounded-lg bg-white shadow-sm">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Product Price:</span>
                    <span className="font-medium">
                      €{productPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Shipping Cost:</span>
                    <span className="font-medium">
                      €{shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-xl font-semibold text-rose-800">
                      €{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Weight: {totalWeight.toFixed(3)} kg • Step{" "}
                    {getCurrentStepNumber()} / 6
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!canCheckout}
                    className={`flex-1 px-4 py-3 rounded border flex items-center justify-center gap-2 transition ${
                      canCheckout
                        ? "bg-white text-rose-800 border-rose-800 hover:bg-rose-50"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart size={16} />
                    Add to cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!canCheckout}
                    className={`flex-1 px-4 py-3 rounded text-white flex items-center justify-center gap-2 transition ${
                      canCheckout
                        ? "bg-rose-800 hover:bg-rose-900"
                        : "bg-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={16} />
                    Buy now
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
