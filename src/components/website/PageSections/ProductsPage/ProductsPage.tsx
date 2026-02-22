import HeadingText from "@/components/ReusableSection/HeadingText";
import React, { Suspense } from "react";
import AllProduct from "./AllProduct";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  return (
    <div>
      {/* Products Page Content */}
      <HeadingText
        subHeading="Todos los productos"
        heading="Descubre nuestro catálogo de Hierro y Acero"
        description="Tu Almacén de Hierro Online: Encuentra la mayor variedad de tubos, vigas, chapas o perfiles, todo con corte personalizado. Selecciona la categoría de producto para filtrar la búsqueda"
        align="center"
      />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#7E1800] animate-spin" />
            <p className="mt-4 text-gray-500 font-medium">
              Loading products...
            </p>
          </div>
        }
      >
        <AllProduct />
      </Suspense>
    </div>
  );
}
