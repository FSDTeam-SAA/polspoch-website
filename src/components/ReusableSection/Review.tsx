"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Review() {
  const testimonials: {
    name: string;
    location?: string;
    image?: string;
    text: string;
    rating: number;
  }[] = [
      {
        name: "Jorge M.",
        location: "Madrid",
        text: "“Medidas exactas, ni un milímetro de error. Pedí unos perfiles estructurales para una estantería de diseño que estoy montando y me preocupaba que el corte no fuera limpio. Para mi sorpresa, las piezas venían cortadas al milímetro y sin rebabas. El configurador de la web es muy intuitivo. Repetiré seguro para el próximo proyecto.”",
        rating: 5,
        image: "/images/review1.jpg",
      },
      {
        name: "Anónimo",
        location: "",
        text: "“Embalaje robusto y envío rápido. Era la primera vez que compraba hierro por internet y me daba un poco de respeto el tema del transporte por el peso y el volumen. El paquete llegó súper bien flejado y protegido en las esquinas. El repartidor fue muy amable y me ayudó a dejarlo en el garaje. Un 10 en logística.”",
        rating: 5,
        image: "/images/review1.jpg",
      },
      {
        name: "Ismael Hoyos",
        location: "Toledo",
        text: "“Un poco más caro que en almacén, pero merece la pena. Estuve dudando por el precio comparado con el almacén de mi zona, pero la comodidad de recibirlo en casa cortado a la medida exacta compensa totalmente. El material es de primera, aunque eso sí, avisados quedáis: las piezas vienen con la grasa protectora típica del hierro y te manchas un poco al desembalar. Le quito una estrella porque el transportista no me avisó antes de llegar, pero por el producto no tengo ninguna queja, volveré a comprar.”",
        rating: 4,
        image: "/images/review1.jpg",
      },
      {
        name: "Iker",
        location: "Bilbao",
        text: "“Te ahorra una vida de vueltas por almacenes. Lo mejor es no tener que ir con el coche a un almacén de metales a que te miren raro por pedir tres cortes pequeños. Aquí lo pides un domingo desde el sofá y te llega a casa listo para soldar. Para los que hacemos proyectos pequeños en casa, esta web es un descubrimiento.”",
        rating: 5,
        image: "/images/review1.jpg",
      },
      {
        name: "David G.",
        location: "Barcelona",
        text: "“Hierro de verdad, no lo que encuentras en grandes superficies. Necesitaba una pletina gruesa para reforzar un dintel y la calidad del acero es muy superior a lo que venden en los Leroy o similares. Se nota que es material profesional. Le pongo 4 estrellas solo porque tardó un día más de lo previsto, pero la atención al cliente por WhatsApp me resolvió la duda al momento.”",
        rating: 4,
        image: "/images/review1.jpg",
      },
      {
        name: "Elena V.",
        location: "Valencia",
        text: "“Perfecto para mi proyecto de exterior. Encargué unas chapas cortadas a medida para hacer unas jardineras industriales en el jardín. El acabado es impecable, muy limpio”",
        rating: 5,
        image: "/images/review1.jpg",
      },
    ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Responsive setup
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = testimonials.length - itemsPerView;

  // Next/Prev button logic
  const handleNext = () => {
    if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  // const cardWidth = `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`;

  return (
    // <section className="relative w-full py-16 px-4 text-center">
    <section className="relative w-full py-16 px-4 md:px-8 text-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/review-bg.png"
          alt="Testimonials Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-white mb-2">
          ¿Que opinan nuestros clientes?
        </h2>
        <p className="text-gray-200 mb-10 max-w-3xl mx-auto">
          Descubre por qué particulares y profesionales confían en nosotros para
          sus proyectos de hierro y acero
        </p>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-6"
            style={{
              transform: `translateX(calc(-${(currentIndex * 100) / itemsPerView
                }% - ${currentIndex * 24}px))`,
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {testimonials.map((t, i) => (
              <Card
                key={i}
                className="shrink-0 max-w-4xl rounded-2xl shadow-md border my-3 border-gray-100 hover:shadow-sm transition-all duration-300"
                style={{
                  width: `calc((100% - ${(itemsPerView - 1) * 24
                    }px) / ${itemsPerView})`,
                }}
              >
                <CardContent className="text-left flex flex-col h-full justify-start p-6">
                  <div className="flex items-center gap-3">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={72}
                        height={72}
                        className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-16 h-16 object-cover text-2xl bg-red-500 text-white rounded-full font-medium">
                        {t.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{t.name}</p>
                      {t.location && (
                        <p className="text-sm text-gray-500">{t.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 italic text-sm leading-relaxed">
                      {t.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            onClick={handlePrev}
            size="icon"
            variant="ghost"
            disabled={currentIndex === 0}
            className={`rounded-full w-10 h-10 transition-all duration-200 hover:scale-110 ${currentIndex === 0
                ? " bg-white opacity-40 cursor-not-allowed"
                : "hover:bg-[#7E1800] cursor-pointer"
              }`}
          >
            <ChevronLeft className="text-white w-5 h-5" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, idx) => {
              const isActive =
                idx >= currentIndex && idx < currentIndex + itemsPerView;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(Math.min(idx, maxIndex))}
                  className={`h-2.5 rounded-full transition-all duration-300 ${isActive ? "bg-gray-700 w-8" : "bg-gray-300 w-2.5"
                    }`}
                ></button>
              );
            })}
          </div>

          <Button
            onClick={handleNext}
            size="icon"
            variant="ghost"
            disabled={currentIndex === maxIndex}
            className={`rounded-full w-10 h-10 transition-all duration-200 hover:scale-110 ${currentIndex === maxIndex
                ? " bg-white opacity-40 cursor-not-allowed"
                : "hover:bg-[#7E1800] cursor-pointer"
              }`}
          >
            <ChevronRight className="text-white w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
