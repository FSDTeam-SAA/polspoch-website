"use client";
import React, { useState } from "react";
import CuttingLeftSide from "./CuttingLeftSide";
import CuttingForm from "./CuttingForm";
import { useSession } from "next-auth/react";

import { addToCart, createService } from "@/lib/api";
import { ServicePayload } from "@/lib/services/createservice";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const CuttingConnector = () => {
  const [selectedShape, setSelectedShape] = useState("DISC"); // Changed default to generic valid one from list if needed, or keep CUT-TO-SIZE if that mapping exists, but list has "DISC" etc.
  // actually existing list has "DISC" etc.
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
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  // Mutations
  const orderMutation = useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: { serviceId: string; type: string; quantity: number };
      token: string;
    }) => addToCart(data, token),
    onSuccess: (data) => {
      toast.success(`${data?.message}` || "Succssesfuly Added");
    },
  });

  const serviceMutation = useMutation({
    mutationFn: ({ data, token }: { data: ServicePayload; token: string }) =>
      createService(data, token),

    onSuccess: (res) => {
      console.log("respons data for ", res);
      orderMutation.mutate({
        data: {
          serviceId: res?.data?._id,
          type: "service",
          quantity: quantity,
        },
        token,
      });
    },
  });

  const productConfig = {
    materials: [
      {
        id: "RAWSEEL",
        name: "RAWSEEL",
        color: "#4a5568",
        priceMultiplier: 1,
        gradient: "from-slate-600 to-slate-700",
      },
      {
        id: "GALVANIZED",
        name: "GALVANIZED",
        color: "#cbd5e0",
        priceMultiplier: 1.3,
        gradient: "from-slate-300 to-slate-400",
      },
      {
        id: "CORTEN",
        name: "CORTEN",
        color: "#718096",
        priceMultiplier: 1.8,
        gradient: "from-slate-500 to-slate-600",
      },
      {
        id: "TEARDROP",
        name: "TEARDROP",
        color: "#718096",
        priceMultiplier: 1.8,
        gradient: "from-slate-500 to-slate-600",
      },
    ],
    thicknesses: ["6", "8", "10", "12", "16", "20", "25"],
    shapes: [
      {
        id: "DISC",
        name: "DISC",
        icon: "/images/cutting/disc.jpg",
        description: "Standard rectangular profile",
      },
      {
        id: "TRIANGLE",
        name: "TRIANGLE",
        icon: "/images/cutting/triangle.jpg",
        description: "Triangular cross-section",
      },
      {
        id: "SQUARE/RECTANGLE",
        name: "SQUARE/RECTANGLE",
        icon: "/images/cutting/SQUARERECTANGLE.jpg",
        description: "Circular profile",
      },
      {
        id: "RING",
        name: "RING",
        icon: "/images/cutting/RING.jpg",
        description: "L-shaped angle",
      },
      {
        id: "SQUARE/RECTANGLE WITH HOLES",
        name: "SQUARE/RECTANGLE WITH HOLES",
        icon: "/images/cutting/SQUARERECTANGLE WITH HOLES.jpg",
        description: "U-channel profile",
      },
      {
        id: "HALF DISC WITH EXTENSION",
        name: "HALF DISC WITH EXTENSION",
        icon: "/images/cutting/HALFDISCWITHEXTENSION.jpg",
        description: "Custom design",
      },
      {
        id: "TRAPEZE",
        name: "TRAPEZE",
        icon: "/images/cutting/TRAPEZE.jpg",
        description: "Custom design",
      },
      {
        id: "RECTANGULAR WITH CIRCULAR CUT",
        name: "RECTANGULAR WITH CIRCULAR CUT",
        icon: "/images/cutting/RECTANGULARWITHCIRCULARCUT.jpg",
        description: "Custom design",
      },
      {
        id: "RECTANGULAR WITH SQUARE CUT",
        name: "RECTANGULAR WITH SQUARE CUT",
        icon: "/images/cutting/RECTANGULARWITHSQUARECUT.jpg",
        description: "Custom design",
      },
      {
        id: "RECTANGLE AND CORNER CUT",
        name: "RECTANGLE AND CORNER CUT",
        icon: "/images/cutting/RECTANGLEANDCORNERCUT.jpg",
        description: "Custom",
      },
    ],
  };
  const getVisibleDimensions = (): [string[], number[][]] => {
    const tVal = parseFloat(thickness) || 0;
    switch (selectedShape) {
      case "DISC":
        return [["sizeA"], [[30, 1980]]];
      case "TRIANGLE":
        return [
          ["sizeA", "sizeB"],
          [
            [30, 2980],
            [30, 1980],
          ],
        ];
      case "SQUARE/RECTANGLE":
        return [
          ["sizeA", "sizeB"],
          [
            [30, 2980],
            [30, 1980],
          ],
        ];
      case "RING":
        return [
          ["sizeA", "sizeB"],
          [
            [tVal * 2, 2980],
            [tVal * 1.5, 1980],
          ],
        ];
      case "SQUARE/RECTANGLE WITH HOLES":
        return [
          ["sizeA", "sizeB", "sizeC", "sizeD"],
          [
            [30, 2980],
            [30, 1980],
            [12, 60],
            [12, 2900],
          ],
        ];
      case "HALF DISC WITH EXTENSION":
        return [
          ["sizeA", "sizeB"],
          [
            [30, 1290],
            [30, 2980],
          ],
        ];
      case "TRAPEZE":
        return [
          ["sizeA", "sizeB"],
          [
            [30, 1290],
            [30, 2980],
          ],
        ];
      default:
        return [
          ["sizeA", "sizeB", "sizeC", "sizeD"],
          [
            [50, 2240],
            [50, 250],
          ],
        ];
    }
  };

  // Get material color
  const getMaterialColor = () => {
    return (
      productConfig.materials.find((m) => m.id === material)?.color || "#4a5568"
    );
  };

  const calculatePrice = () => {
    const basePrice = 100;
    // Simplified price calculation logic for demo
    return Math.round(basePrice * quantity);
  };

  const handleDimensionChange = (key: string, valueStr: string) => {
    const value = parseInt(valueStr) || 0;
    const [dimensionKeys, dimensionRanges] = getVisibleDimensions();
    const rangeIndex = dimensionKeys.indexOf(key);

    let min = 10;
    let max = 3000;

    if (rangeIndex !== -1 && dimensionRanges[rangeIndex]) {
      min = dimensionRanges[rangeIndex][0];
      max = dimensionRanges[rangeIndex][1];
    }

    let error = "";
    if (value < min) {
      error = `Min value is ${min}`;
    } else if (value > max) {
      error = `Max value is ${max}`;
    }

    setErrors((prev) => ({ ...prev, [key]: error }));
    setDimensions((prev) => ({ ...prev, [key]: value }));
  };

  const servicehandel = () => {
    const [visibleKeys] = getVisibleDimensions();
    const data: ServicePayload = {
      serviceType: "cutting", // Assuming 'cutting' is the type
      templateName: selectedShape,
      units: quantity,
      price: calculatePrice(),
      diameter: Number(thickness),
      sizes: {
        A: dimensions[visibleKeys[0]] ?? 0,
        B: visibleKeys[1] ? dimensions[visibleKeys[1]] : 0,
        C: visibleKeys[2] ? dimensions[visibleKeys[2]] : 0,
        D: visibleKeys[3] ? dimensions[visibleKeys[3]] : 0,
      },
    };
    serviceMutation.mutate({ data, token });
  };

  const getGridClass = (index: number) => {
    if (index === 0) return "col-span-6";
    if (index === 1 || index === 2) return "col-span-6";
    return "col-span-4";
  };

  // Return the icon path for the selected shape
  const renderShape = () => {
    const shape = productConfig.shapes.find((s) => s.id === selectedShape);
    return shape ? shape.icon : "/images/cutting/disc.jpg";
  };

  const currentMaterial = productConfig.materials.find(
    (m) => m.id === material,
  );

  return (
    <section>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <CuttingLeftSide
            renderShape={renderShape}
            currentMaterial={currentMaterial}
            productConfig={productConfig}
            selectedShape={selectedShape}
            setSelectedShape={setSelectedShape}
            getMaterialColor={getMaterialColor}
          />
          <CuttingForm
            productConfig={productConfig}
            thickness={thickness}
            setThickness={setThickness}
            setMaterial={setMaterial}
            material={material}
            visibleDimensions={getVisibleDimensions()[0]}
            dimensionRanges={getVisibleDimensions()[1]}
            dimensions={dimensions}
            handleDimensionChange={handleDimensionChange}
            errors={errors}
            quantity={quantity}
            setQuantity={setQuantity}
            calculatePrice={calculatePrice}
            servicehandel={servicehandel}
            getGridClass={getGridClass}
          />
        </div>
      </div>
    </section>
  );
};

export default CuttingConnector;
