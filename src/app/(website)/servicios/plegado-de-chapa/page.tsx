import BendingPage from "@/components/website/PageSections/ServicePage/BendingPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Plegado de Chapa | Hierro A Medida",
  description:
    "Servicio de plegado de chapa a medida. Configura tu pieza, añade medidas y calcula el precio online.",
};

const page = () => {
  return (
    <div>
      <BendingPage />
      {/* <ServiceCarousel /> */}
    </div>
  );
};

export default page;
