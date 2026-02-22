"use client";
import { Truck, Ruler, Settings } from "lucide-react";
import Image from "next/image";

export default function WorkingProcess() {
  return (
    <div className="w-full py-20 bg-white">
      <div className="mx-auto container grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
        {/* Entrega en toda España */}
        <div className="flex flex-col items-center px-4 text-center">
          <Image
            src="/images/icon/spain-icon.png"
            alt="spain-icon"
            width={100}
            height={100}
            className="w-10 h-10 object-contain mb-4 group-hover:scale-105 duration-300"
          />
          <h3 className="font-semibold text-lg mb-2">Entrega en toda España</h3>
          <p className="text-sm text-gray-600">
            Entregamos a todos los rincones de la península. Precio cerrado sin sorpresas
          </p>
        </div>

        {/* Directo a tu Domicilio */}
        <div className="flex flex-col items-center px-4 text-center">
          <Truck className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Directo a tu Domicilio</h3>
          <p className="text-sm text-gray-600">
            Adaptamos el método de envío a las medidas y peso del pedido. Consulta las condiciones de entrega
          </p>
        </div>

        {/* Todos los productos a medida */}
        <div className="flex flex-col items-center px-4 text-center">
          <Ruler className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Todos los productos a medida</h3>
          <p className="text-sm text-gray-600">
            Corte personalizado de todos los productos. Introduce tus medidas en nuestro configurador y paga solo por lo que necesitas
          </p>
        </div>

        {/* Centro de servicios online */}
        <div className="flex flex-col items-center px-4 text-center">
          <Settings className="w-10 h-10 text-red-700 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Centro de servicios online</h3>
          <p className="text-sm text-gray-600">
            Servicio de corte de chapa CNC, ferralla elaborada y plegado de chapas desde tu casa, sin errores y con un solo clic
          </p>
        </div>
      </div>
    </div>
  );
}
