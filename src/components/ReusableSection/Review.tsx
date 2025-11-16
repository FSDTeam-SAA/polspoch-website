"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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
    image: "/images/review1.jpg",
    name: "Michael R.",
    location: "Phoenix, AZ",
    text: `“We’ve been sourcing steel beams from HierroMarket for over a year now, and the consistency has been outstanding. The team is quick to respond, transparent about pricing, and always delivers on time. It’s rare to find a supplier this reliable.”`,
    rating: 5,
  },
  {
    image: "/images/review1.jpg",
    name: "Sarah Thompson",
    location: "Los Angeles, CA",
    text: `“I reached out with a last-minute order and was honestly expecting delays, but HierroMarket exceeded our expectations. Not only did they fulfill the request, they helped us pick the right grade of steel for our project. Amazing customer service!”`,
    rating: 5,
  },
  {
    image: "/images/review1.jpg",
    name: "James P.",
    location: "San Diego, CA",
    text: `“What really stands out is their level of professionalism. The products are always high-quality, and the team is extremely knowledgeable. They explain everything clearly—even for someone like me who isn’t a metal expert.”`,
    rating: 5,
  },
  {
    image: "/images/review1.jpg",
    name: "Vanessa G.",
    location: "San Francisco, CA",
    text: `“We switched suppliers after ongoing issues elsewhere, and I’m so glad we did. HierroMarket made the transition easy, sent updates throughout delivery, and ensured every detail matched our order. Truly a company that cares about its customers.”`,
    rating: 5,
  },
  {
    image: "/images/review1.jpg",
    name: "Luis Martinez",
    location: "Austin, TX",
    text: `“I run a small fabrication shop, and finding trustworthy suppliers is tough. HierroMarket has been a game-changer for us—fair prices, excellent quality steel, and no hidden surprises. Highly recommended.”`,
    rating: 5,
  },
  {
    image: "/images/review1.jpg",
    name: "Rebecca L.",
    location: "Seattle, WA",
    text: `“From inquiry to delivery, everything was smooth and efficient. The support team answered all my questions and helped ensure the materials matched our engineering requirements. I’ll definitely be ordering again.”`,
    rating: 5,
  },
  {
    image: "/images/review1.jpg",
    name: "Daniel Kim",
    location: "Denver, CO",
    text: `“Top-notch service. The order arrived faster than expected, packaging was secure, and the steel quality was excellent. It’s refreshing to work with a company that consistently goes above and beyond.”`,
    rating: 5,
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
        <div className="absolute inset-0 bg-black/40"></div>{" "}
        {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-white mb-2">
          What Our Clients Say
        </h2>
        <p className="text-gray-200 mb-10 max-w-3xl mx-auto">
          Hear from businesses and customers who trust HierroMarket for quality
          steel products and services.
        </p>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-6"
            style={{
              transform: `translateX(calc(-${(currentIndex * 100) / itemsPerView}% - ${currentIndex * 24}px))`,
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {testimonials.map((t, i) => (
              <Card
                key={i}
                className="shrink-0 max-w-4xl rounded-2xl shadow-md border my-3 border-gray-100 hover:shadow-sm transition-all duration-300"
                style={{
                  width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`,
                }}
              >
                <CardContent className="p-6 text-left flex flex-col h-full justify-start">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center rounded-full gap-3">
                      {t.image ? (
                        <Image
                          src={t.image}
                          alt={t.name}
                          width={72}
                          height={72}
                          className="w-25 h-25 rounded-full overflow-hidden flex-shrink-0 object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center p-12 object-cover text-4xl  bg-red-500 text-white rounded-full font-medium">
                          {t.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">
                          {t.name}
                        </p>
                        {/* {t.location && (
                          <p className="text-sm text-gray-500">{t.location}</p>
                        )} */}
                        <p className="text-gray-600 italic text-sm leading-relaxed">
                          {t.text}
                        </p>
                      </div>
                    </div>

                    {/* <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={16}
                          className={`${
                            idx < t.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          } transition-all duration-200`}
                        />
                      ))}
                    </div> */}
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
            className={`rounded-full w-10 h-10 transition-all duration-200 hover:scale-110 ${
              currentIndex === 0
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
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive ? "bg-gray-700 w-8" : "bg-gray-300 w-2.5"
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
            className={`rounded-full w-10 h-10 transition-all duration-200 hover:scale-110 ${
              currentIndex === maxIndex
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
