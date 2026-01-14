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
    label: "Courier (Standard)",
    price: "15.00€",
    baseWeight: "Up to 30 kg",
    baseSize: "Up to 2000 mm",
    extraWeight: "+0.50€ per kg (over 30kg)",
    extraSize: "+20.00€ (if ≥ 2000 mm)",
    maxCapacity: "2500 mm / 150.00€ Cap",
    eta: "3 - 5 Business Days",
  },
  {
    id: "truck",
    type: "truck",
    label: "Truck (Heavy/Industrial)",
    price: "60.00€",
    baseWeight: "Up to 1000 kg",
    baseSize: "Industrial Scale",
    extraWeight: "+10.00€ per 500kg (over 1000kg)",
    extraSize: " ",
    maxCapacity: "No explicit limit",
    eta: "15 - 30 Business Days",
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
            Our Shipping Policy
          </h2>
          <p className=" mx-auto text-gray-500 mt-3 max-w-[700px]">
            We use a dynamic shipping system that automatically calculates rates
            based on your order&apos;s size, weight, and delivery location. This
            ensures you always receive the most accurate and cost-effective
            shipping option without hidden charges or manual adjustments.
          </p>
        </header>

        {/* Comparison Card */}
        <Card className="overflow-hidden py-0! rounded-2xl">
          <div className="bg-[rgb(105,23,7)] px-6 py-6 text-white">
            <h3 className="text-lg font-semibold">
              Shipping Methods Comparison
            </h3>
            <p className=" text-orange-100/80 mt-1">
              Choose the shipping option that best fits your timeline and budget
            </p>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="pl-6 w-[250px]">
                      Shipping Method
                    </TableHead>
                    <TableHead className="text-center">Base Capacity</TableHead>
                    <TableHead className="text-center">Surcharges</TableHead>
                    <TableHead className="text-center">Weight Limit</TableHead>
                    <TableHead className="text-right pr-6">
                      Starting Price
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
                            className={`flex items-center justify-center w-12 h-12 rounded-xl border ${
                              m.type === "truck"
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

                      <TableCell className="text-center">
                        <div className="text-xs space-y-1">
                          <p className="text-slate-500">
                            Size:{" "}
                            <span className="text-slate-700 font-medium">
                              {m.baseSize}
                            </span>
                          </p>
                          <p className="text-slate-500">
                            Weight:{" "}
                            <span className="text-slate-700 font-medium">
                              {m.baseWeight}
                            </span>
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="text-xs space-y-1">
                          <p className="text-slate-500">
                            Weight:{" "}
                            <span className="text-red-700 font-medium">
                              {m.extraWeight}
                            </span>
                          </p>
                          <p className="text-slate-500">
                            Oversize:{" "}
                            <span className="text-red-700 font-medium">
                              {m.extraSize}
                            </span>
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {m.maxCapacity}
                        </span>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <div className="text-lg font-bold text-slate-900">
                          {m.price}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          Base Rate
                        </div>
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
              Free Shipping
            </h4>
            <p className="text-sm text-slate-500 mt-2">
              Orders over $500 qualify for free standard ground shipping.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <Truck className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Same Day Dispatch
            </h4>
            <p className="text-sm text-slate-500 mt-2">
              Orders placed before 2 PM EST are processed and shipped the same
              day.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Protected Delivery
            </h4>
            <p className="text-sm text-slate-500 mt-2">
              Signature required on delivery for orders over $1,000 to ensure
              security.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
