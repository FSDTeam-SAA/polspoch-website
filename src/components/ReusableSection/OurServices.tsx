"use client";

import Image from "next/image";
import { Ruler, Settings, Box } from "lucide-react";
import Link from "next/link";

export default function OurServices() {
  const services = [
    {
      title: "Corte Chapa CNC",
      subtitle: "Dibuja la chapa y nosotros la cortamos",
      btn: "Calcular Precios",
      img: "/images/REBAR-FACILITES.png",
      icon: Ruler,
      href: "/servicios/corte-chapa-cnc",
    },
    {
      title: "Plegado de Chapa",
      subtitle: "Diseña tu cortado y plegado",
      btn: "Calcular Precios",
      img: "/images/BENDING-PRODUCT.png",
      icon: Settings,
      href: "/servicios/plegado-de-chapa",
    },
    {
      title: "Ferralla",
      subtitle: "Elaboramos la ferralla a medida",
      btn: "Calcular Precios",
      img: "/images/REBAR-DETAIL.png",
      icon: Box,
      href: "/servicios/ferralla",
    },
  ];

  return (
    <div id="service-card" className="w-full py-20">
      <div className="border mx-auto container bg-[rgb(105,23,7)] p-10 rounded-4xl">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white drop-shadow-md tracking-tight">
            ¡Lleva tu proyecto a otro nivel con nuestros servicios!
          </h2>
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
            Aprovecha todos nuestros servicios de transformación de productos
            metalúrgicos de una forma rápida y sencilla. Selecciona el servicio,
            escoge la plantilla, introduce las medidas y recíbelo en casa.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto container grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {services.map((service, i) => (
            <Link
              key={i}
              href={service.href}
              className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer block h-[420px] md:h-[480px]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300"></div>

              {/* Content (CENTERED) */}
              <div className="relative z-10 px-6 text-white flex flex-col h-full text-center justify-center items-center gap-4">
                <service.icon size={42} strokeWidth={1.5} />

                <h3 className="text-xl font-semibold">{service.title}</h3>

                <p className="text-sm opacity-90 max-w-xs">
                  {service.subtitle}
                </p>

                <div className="mt-4 bg-white text-[#7E1800] font-medium py-2 px-6 rounded-lg group-hover:bg-gray-200 transition duration-200">
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
