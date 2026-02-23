import Review from "@/components/ReusableSection/Review";
import WorkingProcess from "@/components/ReusableSection/WorkingProcess";
import OtherServices from "@/components/website/PageSections/ServicePage/OtherServices";
import ServiceProductInfo from "@/components/website/PageSections/ServicePage/ServiceProductInfo";
import ServiceTechnical from "@/components/website/PageSections/ServicePage/ServiceTechnical";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Servicios de Corte Laser, Plegado de Chapa y Ferralla | Hierroamedida.com",
  description:
    "Tu centro de servicios de hierro digital en España. Diseña tu chapa para corte laser, plasma u oxicorte. Realizamos el servicio de plegado de chapa. Recibe la ferralla elaborada en un solo clic",
};

const page = () => {
  return (
    <div>
      <ServiceProductInfo />
      <ServiceTechnical />
      <WorkingProcess />
      <OtherServices />
      <Review />
      {/* <Newsletter /> */}
    </div>
  );
};

export default page;
