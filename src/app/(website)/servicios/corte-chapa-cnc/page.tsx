import React from "react";
import CuttingPage from "@/components/website/PageSections/ServicePage/cutting/CuttingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corte Chapa CNC | Hierro A Medida",
  description:
    "Servicio de corte de chapa CNC a medida. Dibuja tu chapa, introduce las medidas y calcula el precio online.",
};

const page = () => {
  return (
    <>
      <CuttingPage />
    </>
  );
};

export default page;
