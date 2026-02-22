import React from "react";
import { Package, Truck, Clock, Shield } from "lucide-react";

// shadcn/ui imports - adjust paths if your project keeps them elsewhere
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const SHIPPING_METHODS = [
  {
    id: "courier",
    type: "courier",
    label: "Paquetería",
    eta: "2-4 días laborables",
    sizeLimit: "Largo < 2500 MM",
    price: "15 €",
    extras: [
      "Peso: +0.50€ por kg (más de 30kg)",
      "Tamaño: +20€ (si ≥ 2000 mm)",
    ],
    priceCap: "60 €",
  },
  {
    id: "truck",
    type: "truck",
    label: "Camión Grúa",
    eta: "3-6 días laborables",
    sizeLimit: "Largo < 6000MM",
    price: "60 €",
    extras: ["SIN EXTRAS"],
    priceCap: "",
  },
];

export default function ShippingPolicy() {
  return (
    <section
      id="ShippingPolicy"
      className="bg-transparent text-slate-200 py-16"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="text-center mb-8">
          <h2 className="text-4xl font-semibold text-gray-900">
            Tarifas de Envío Claras y Sin Sorpresas
          </h2>
          <p className=" text-gray-500 mt-3 w-[900px] mx-auto">
            El hierro no es un material sencillo de transportar, por esto usamos distintos métodos de envío según el producto que selecciones. A continuación, te detallamos de forma transparente y visual cómo funciona nuestra política de transporte
          </p>
        </header>

        {/* Comparison Card */}
        <Card className="overflow-hidden py-0! rounded-2xl">
          <div className="bg-[rgb(105,23,7)] px-6 py-6 text-white">
            <h3 className="text-lg font-semibold">
              Comparativa de los métodos de envío
            </h3>
            <p className=" text-orange-100/80 mt-1">
              Tarifa de envío clara y sin sorpresas
            </p>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="pl-6 w-[250px]">
                      Método de envío
                    </TableHead>
                    <TableHead className="text-center">Límite de medidas</TableHead>
                    <TableHead className="text-center">
                      Precio inicial (Min)
                    </TableHead>
                    <TableHead className="text-center">Extras</TableHead>
                    <TableHead className="text-right pr-6">
                      Tope Precio (Max)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SHIPPING_METHODS.map((m) => (
                    <TableRow
                      key={m.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-xl border ${m.type === "truck"
                              ? "bg-blue-50 border-blue-100 text-blue-600"
                              : "bg-rose-50 border-rose-100 text-rose-600"
                              }`}
                          >
                            {m.type === "truck" ? (
                              <Truck className="w-6 h-6" />
                            ) : (
                              <Package className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {m.label}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <Clock className="w-3.5 h-3.5" />
                              {m.eta}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-slate-700 font-medium">
                        {m.sizeLimit}
                      </TableCell>

                      <TableCell className="text-center text-lg font-bold text-slate-900">
                        {m.price}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="text-sm text-slate-500 space-y-1">
                          {m.extras.map((extra, i) => (
                            <p key={i}>{extra}</p>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        {m.priceCap ? (
                          <span className="text-lg font-bold text-slate-900">
                            {m.priceCap} €
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          {/* <CardContent className="p-0">
            <div className="border-t border-slate-200/5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Method</TableHead>
                    <TableHead className="text-center">Max Size</TableHead>
                    <TableHead className="text-center">Weight Limit</TableHead>
                    <TableHead className="text-center">Base Price</TableHead>
                    <TableHead className="text-center pr-6">
                      Delivery Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SHIPPING_METHODS.map((m) => (
                    <TableRow key={m.id} className="border-t">
                      <TableCell className="flex items-center gap-3 pl-6 py-6">
                        <span className="flex items-center justify-center w-10 h-10 rounded-md bg-rose-50 text-rose-600">
                          {m.icon === "truck" ? (
                            <Truck className="w-5 h-5" />
                          ) : (
                            <Package className="w-5 h-5" />
                          )}
                        </span>
                        <div className="font-medium text-slate-800 dark:text-slate-100">
                          {m.label}
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-sm text-slate-500">
                        {m.maxSize}
                      </TableCell>

                      <TableCell className="text-center text-sm text-slate-500">
                        {m.weightLimit}
                      </TableCell>

                      <TableCell className="text-center font-semibold text-rose-600">
                        {m.price}
                      </TableCell>

                      <TableCell className="text-center pr-6 text-sm text-slate-600 flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-rose-600" />
                        <span>{m.eta}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent> */}
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Envío por paquetería (Opción recomendada)
            </h4>
            <p className="text-sm text-slate-500 mt-2">
              Para los pedidos con todas las medidas inferiores a 2.500 mm (2,5 mts). Entregado a la puerta de tu casa, sin ningún problema. ¡Adapta las medidas para simplificar la entrega!
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <Truck className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Envío con camión
            </h4>
            <p className="text-sm text-slate-500 mt-2">
              Para los materiales con medidas superiores a 2.500 mm (2,5 mts). Es importante que asegures que en la dirección de entrega puede acceder un camión sin problema
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Sin sorpresas
            </h4>
            <p className="text-sm text-slate-500 mt-2">
              Cuando selecciones un producto, te indicaremos en todo momento el tipo de entrega y el importe
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
