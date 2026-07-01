import React from "react";

import Rebar from "@/components/website/PageSections/ServicePage/Rebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ferralla | Hierro A Medida",
  description:
    "Servicio de ferralla a medida. Configura la ferralla elaborada para tu proyecto y calcula el precio online.",
};

const page = () => {
  return (
    <div>
      <Rebar />
    </div>
  );
};

export default page;
