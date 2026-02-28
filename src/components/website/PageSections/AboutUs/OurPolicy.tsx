import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Package, Shield, Truck, Box, CheckCircle } from "lucide-react";
import React from "react";

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
    maxCapacity: "2500 mm / 60.00€ Cap",
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

const LEFT_FEATURES = [
  { id: 1, icon: Shield, label: "Insured Shipments" },
  { id: 2, icon: CheckCircle, label: "Order Tracking" },
  { id: 3, icon: Box, label: "Secure Packaging" },
  { id: 4, icon: Package, label: "On Time Delivery" },
];

const OurPolicy = () => {
  return (
    <div className="container mx-auto sm:py-10 p-2 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT SIDE */}
        <div>
          <h2 className="font-bold text-center sm:text-start text-3xl mb-6 text-[#2C0800]">
            Our Shipping Policy
          </h2>

          <div className="space-y- sm:px-2 px-0 text-gray-700 leading-relaxed">
            <p>
              We understand that timely delivery is crucial for your operations.
              Our shipping policy is designed to ensure your industrial
              equipment and supplies reach you safely and on schedule. We
              partner with trusted carriers to provide multiple shipping options
              tailored to your needs, whether you require standard ground
              delivery or expedited freight services.
            </p>

            <p>
              All shipments include insurance coverage and real-time tracking
              capabilities. Our packaging specialists ensure that every order is
              securely packed to prevent damage during transit. For oversized or
              heavy items, we coordinate specialized freight services with lift
              gate and inside delivery options available upon request.
            </p>
          </div>

          {/* 2x2 FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            {LEFT_FEATURES.map((item) => (
              <Card
                key={item.id}
                className="p-4 flex items-center border rounded-xl shadow-sm"
              >
                <div className="bg-[#F2E8E6] p-4 rounded-lg">
                  <item.icon className="w-6 h-6 text-[#5F1200]" />
                </div>
                <p className="ml-3 font-semibold text-[#5F1200]">
                  {item.label}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-8">
          {/* COMPARISON CARD */}
          <Card className="overflow-hidden py-0! rounded-2xl shadow-lg">
            <div className="bg-[#691707] px-6 py-6 text-white">
              <h3 className="text-lg font-semibold">
                Shipping Methods Comparison
              </h3>
              <p className="text-sm text-white/80 mt-1">
                Choose the shipping option that best fits your timeline and
                budget
              </p>
            </div>

            <CardContent className="p-0">
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
            </CardContent>
          </Card>

          {/* INFO CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 text-center rounded-xl shadow-md">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-rose-600" />
                </div>
              </div>
              <h4 className="font-semibold">Free Shipping</h4>
              <p className="text-sm text-gray-600 mt-2">
                Orders over $500 qualify for free standard ground shipping.
              </p>
            </Card>

            <Card className="p-6 text-center rounded-xl shadow-md">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-rose-600" />
                </div>
              </div>
              <h4 className="font-semibold">Same Day Dispatch</h4>
              <p className="text-sm text-gray-600 mt-2">
                Orders placed before 2 PM EST are processed and shipped.
              </p>
            </Card>

            <Card className="p-6 text-center rounded-xl shadow-md">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-rose-600" />
                </div>
              </div>
              <h4 className="font-semibold">Protected Delivery</h4>
              <p className="text-sm text-gray-600 mt-2">
                Signature required on delivery for orders over $1,000.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Highlight Box */}
      <div className="bg-[#F2E8E6] mt-10 p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-rose-600" />
          <p className="font-semibold text-[#2C0800]">
            Insurance & Tracking Included
          </p>
        </div>
        <p className="mt-3 text-gray-700">
          All shipments include full insurance coverage and real-time tracking.
          Special handling available for fragile or oversized items.
        </p>
      </div>
    </div>
  );
};

export default OurPolicy;
