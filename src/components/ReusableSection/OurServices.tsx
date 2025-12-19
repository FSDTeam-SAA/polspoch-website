"use client";

import Image from "next/image";
import { Ruler, Settings, Box } from "lucide-react";
import Link from "next/link";

export default function OurServices() {
  const services = [
    {
      title: "Cut-to-Size",
      subtitle: "Upload DWG or choose from templates",
      btn: "Create & Calculate Price",
      img: "/images/product.png",
      icon: Ruler, // <-- remove <Ruler /> and store the component
    },
    {
      title: "Bending",
      subtitle: "Configure bend types and dimensions",
      btn: "Create & Calculate Price",
      img: "/images/product.png",
      icon: Settings,
    },
    {
      title: "Rebar Fabrication",
      subtitle: "Fast and accurate reinforcement",
      btn: "Create & Calculate Price",
      img: "/images/product.png",
      icon: Box,
    },
  ];

  return (
    <div className="w-full py-20 bg-white">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold mb-2">Our Services</h2>
        <p className="text-gray-500">
          Customize your steel products with our advanced processing and
          fabrication options.
        </p>
      </div>

      {/* Cards */}
      <div className="mx-auto container grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {services.map((service, i) => (
          <div
            key={i}
            className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={service.img}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 duration-300"
                height={400}
                width={400}
              />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 duration-300"></div>

            {/* Content */}
            <div className="relative z-10 px-6 py-10 text-white flex flex-col h-full text-center justify-end gap-3">
              {/* <div className="text-4xl"></div> */}
              <p className="flex justify-center">
                <service.icon size={40} strokeWidth={1.5} />
              </p>

              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-sm opacity-90">{service.subtitle}</p>

              {/* Button */}
              
                <button className="mt-4 bg-white text-[#7E1800] font-medium py-2 rounded-lg hover:bg-gray-200 duration-200 cursor-pointer">
                  {service.btn}
                </button>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
