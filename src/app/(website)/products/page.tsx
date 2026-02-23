import Review from "@/components/ReusableSection/Review";
import ProductsPage from "@/components/website/PageSections/ProductsPage/ProductsPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Comprar Hierro a Medida Online | Tubos, Vigas y Chapas | Hierroamedida.com",
  description:
    "Tu almacén de hierro digital en España. Compra tubos, vigas, chapas, pletinas, ángulos y mucho más con corte a medida exacto. Venta a particulares sin pedido mínimo, envío a domicilio y al mejor precio.",
};

export default function page() {
  return (
    <div>
      <ProductsPage />
      <Review />
      {/* <Newsletter /> */}
    </div>
  );
}
