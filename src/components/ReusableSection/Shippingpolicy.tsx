"use client";
import React from "react";
import { Package, Truck, Clock, Shield } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useShippingPolicy } from "@/lib/hooks/useShippingPolicy";
import { AdvancedPolicy } from "@/lib/types/shippingpolicy";

/* --- Helper for European currency formatting --- */
const formatPrice = (price: number) =>
  price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

interface UnifiedShippingMethod {
  methodName: string;
  label: string;
  eta: string;
  sizeHeading: string;
  basePrice: number;
  maxPrice: number;
  freeWeightLimit: number;
  extraWeightPrice: number;
  sizeSurcharge: number;
  sizeThreshold: number;
  maxSizeAllowed: number;
}

export default function ShippingPolicy() {
  const { data, isLoading, error } = useShippingPolicy();

  if (isLoading || error) return null;

  const { advanced = [] } = (data as { advanced: AdvancedPolicy[] }) || {};

  const courierAdv = advanced.find((p) => p.methodName === "courier");
  const truckAdv = advanced.find((p) => p.methodName === "truck");

  // Reconciled Courier object
  const courier: UnifiedShippingMethod | null = courierAdv ? {
    ...courierAdv,
    label: "Paquetería",
    eta: "2-4 días laborables",
    sizeHeading: `MATERIALES DE MEDIDAS INFERIORES A ${courierAdv.maxSizeAllowed / 1000} MTS`,
    maxPrice: Math.min(courierAdv.maxTotalCost, 60)
  } : null;

  // Reconciled Truck object
  const truck: UnifiedShippingMethod | null = truckAdv ? {
    ...truckAdv,
    label: "Camión Grúa",
    eta: "3-6 días laborables",
    sizeHeading: "MATERIALES DE MEDIDAS SUPERIORES A 2,5 MTS",
    maxPrice: truckAdv.maxTotalCost
  } : null;

  return (
    <section id="ShippingPolicy" className="bg-transparent py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Page heading */}
        <header className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
            Tarifas de Envío Claras y Sin Sorpresas
          </h2>
          <p className="text-gray-500 mt-3 max-w-[900px] mx-auto text-sm sm:text-base">
            El hierro no es un material sencillo de transportar, por esto usamos distintos métodos de envío...
          </p>
        </header>

        {/* Main Comparison Card */}
        <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
          {/* Exact Maroon Header */}
          <div className="bg-[#691707] px-6 py-5 text-white">
            <h3 className="text-lg font-semibold">
              Comparativa de los métodos de envío
            </h3>
            <p className="text-orange-100/80 mt-1 text-sm font-light">
              Tarifa de envío clara y sin sorpresas
            </p>
          </div>

          <CardContent className="p-4 sm:p-8 space-y-10 bg-white">

            {/* ── PAQUETERÍA SECTION ── */}
            {courier && (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 bg-white border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-slate-800">{courier.label}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {courier.eta}
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight uppercase">
                    {courier.sizeHeading}
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableBody>
                      <TableRow className="border-b border-slate-100">
                        <TableCell className="font-bold text-slate-700 py-4 px-6 w-[240px] border-r border-slate-100">
                          Tarifa base (Mínimo)
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 py-4 w-28 text-center border-r border-slate-100">{courier.basePrice} €</TableCell>
                        <TableCell className="text-slate-500 text-sm px-6 font-normal">
                          Para pedidos de hasta {courier.freeWeightLimit} kg
                        </TableCell>
                      </TableRow>

                      {courier.extraWeightPrice > 0 && (
                        <TableRow className="border-b border-slate-100">
                          <TableCell className="font-medium text-slate-700 py-4 px-6 border-r border-slate-100">
                            Suplemento por peso
                          </TableCell>
                          <TableCell className="font-bold text-slate-900 py-4 text-center border-r border-slate-100">{formatPrice(courier.extraWeightPrice)}</TableCell>
                          <TableCell className="text-slate-500 text-sm px-6">
                            Por cada kilo extra (a partir de los primeros {courier.freeWeightLimit} kg).
                          </TableCell>
                        </TableRow>
                      )}

                      {courier.sizeSurcharge > 0 && (
                        <TableRow className="border-b border-slate-100">
                          <TableCell className="font-medium text-slate-700 py-4 px-6 border-r border-slate-100">
                            Suplemento por longitud
                          </TableCell>
                          <TableCell className="font-bold text-slate-900 py-4 text-center border-r border-slate-100">{courier.sizeSurcharge} €</TableCell>
                          <TableCell className="text-slate-500 text-sm px-6">
                            Si algún material de tu pedido mide entre {courier.sizeThreshold / 1000} y {courier.maxSizeAllowed / 1000} metros.
                          </TableCell>
                        </TableRow>
                      )}

                      <TableRow className="bg-slate-50/30">
                        <TableCell className="font-black text-slate-900 py-4 px-6 border-r border-slate-100">
                          Tope máximo garantizado
                        </TableCell>
                        <TableCell className="font-black text-slate-900 py-4 text-center border-r border-slate-100 text-lg">{courier.maxPrice} €</TableCell>
                        <TableCell className="text-slate-600 text-sm px-6 italic">
                          Tu envío <span className="font-bold text-slate-900">nunca</span> costará más de {courier.maxPrice} €, pase lo que pase.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* ── CAMIÓN GRÚA SECTION ── */}
            {truck && (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 bg-white border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-slate-800">{truck.label}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {truck.eta}
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight uppercase">
                    {truck.sizeHeading}
                  </h4>
                </div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold text-slate-700 py-5 px-6 w-[240px] border-r border-slate-100">
                        Tarifa fija
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 py-5 w-28 text-center border-r border-slate-100 text-lg">{truck.basePrice} €</TableCell>
                      <TableCell className="text-slate-500 text-sm px-6">
                        No importa tamaño ni cantidad, precio cerrado de {truck.basePrice}€/envío
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards (From your original design) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              icon: Package,
              title: "Envío por paquetería",
              text: "Para medidas inferiores a 2,5 mts. Entregado a la puerta de tu casa."
            },
            {
              icon: Truck,
              title: "Envío con camión",
              text: "Para medidas superiores a 2,5 mts. Asegura acceso para camiones."
            },
            {
              icon: Shield,
              title: "Sin sorpresas",
              text: "Te indicaremos en todo momento el tipo de entrega y el importe."
            }
          ].map((item, idx) => (
            <Card key={idx} className="p-6 text-center border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-[#691707]" />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-xs sm:text-sm text-slate-500">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}