"use client";

import Image from "next/image";
import { Ruler, Settings, Box } from "lucide-react";
import Link from "next/link";

export default function OurServices() {
  const services = [
    {
      title: "Plasma Sheet Cutting ",
      subtitle:
        "High-precision CNC cutting for custom steel sheets from 1.5 to 100 mm in an intuitive way",
      btn: "Create & Calculate Price",
      img: "/images/BENDING-DETAIL.png",
      icon: Ruler,
      href: "/services/cutting",
    },
    {
      title: "Sheet Metal Bending ",
      subtitle:
        "Custom sheet bending; select templates, angles, and dimensions to create your finishings",
      btn: "Create & Calculate Price",
      img: "/images/BENDING-PRODUCT.png",
      icon: Settings,
      href: "/services/bending",
    },
    {
      title: "Rebar Fabrication ",
      subtitle:
        "Receive corrugated steel cut and bent, ready to assemble; stirrups, bent bars, starter bars, all ready for on-site installation.",
      btn: "Create & Calculate Price",
      img: "/images/REBAR-DETAIL.png",
      icon: Box,
      href: "/services/rebar",
    },
  ];

  return (
    <div id="service-card" className="w-full py-20 ">
      <div className="border mx-auto container bg-[rgb(105,23,7)] p-10 rounded-4xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-2 text-white">
            Take Your Project to the Next Level with Our Services!
          </h2>
          <p className="text-white">
            Take advantage of all our metal processing services quickly and
            easily. Select the service, choose the template, enter the
            measurements, and receive it at home.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto container grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {services.map((service, i) => (
            <Link
              key={i}
              href={service.href}
              className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer block h-full"
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
                <p className="flex justify-center">
                  <service.icon size={40} strokeWidth={1.5} />
                </p>

                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-sm opacity-90">{service.subtitle}</p>

                {/* Button UI (now part of the Link) */}
                <div className="mt-4 bg-white text-[#7E1800] font-medium py-2 rounded-lg group-hover:bg-gray-200 duration-200 text-center">
                  {service.btn}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
