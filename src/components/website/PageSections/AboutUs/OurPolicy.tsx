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
    id: 1,
    icon: "package",
    label: "Courier Shipping",
    maxSize: "Up to 50 lbs",
    weightLimit: "< 75 lbs",
    price: "$8.99",
    eta: "5 - 7 Business Days",
  },
  {
    id: 2,
    icon: "truck",
    label: "Truck Delivery service",
    maxSize: "Up to 50 lbs",
    weightLimit: "< 75 lbs",
    price: "$8.99",
    eta: "5 - 7 Business Days",
  },
  {
    id: 3,
    icon: "package",
    label: "Courier Shipping",
    maxSize: "Up to 50 lbs",
    weightLimit: "< 75 lbs",
    price: "$8.99",
    eta: "5 - 7 Business Days",
  },
  {
    id: 4,
    icon: "truck",
    label: "Truck Delivery service",
    maxSize: "Up to 50 lbs",
    weightLimit: "< 75 lbs",
    price: "$8.99",
    eta: "5 - 7 Business Days",
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
                    <TableRow key={m.id} className="border-t">
                      <TableCell className="pl-6 py-6 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                          {m.icon === "truck" ? (
                            <Truck className="w-5 h-5" />
                          ) : (
                            <Package className="w-5 h-5" />
                          )}
                        </span>
                        <span className="font-medium text-slate-800">
                          {m.label}
                        </span>
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

                      <TableCell className="text-center pr-6 text-sm flex items-center justify-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-rose-600" />
                        {m.eta}
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
