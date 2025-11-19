import React from "react";
import { Package, Truck, Clock, Shield } from "lucide-react";

// shadcn/ui imports - adjust paths if your project keeps them elsewhere
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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

export default function ShippingPolicy() {
  return (
    <section className="bg-transparent text-slate-200 py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Our Shipping Policy
          </h2>
          <p className=" mx-auto text-sm text-gray-700 mt-3">
            We use a dynamic shipping system that automatically calculates rates
            based on your order&apos;s size, weight, and delivery location. This
            ensures you always receive the most accurate and cost-effective
            shipping option without hidden charges or manual adjustments.
          </p>
        </header>

        {/* Comparison Card */}
        <Card className="overflow-hidden py-0! rounded-2xl">
          <div className="bg-[rgb(105,23,7)] px-6 py-6 text-white">
            <h3 className="text-lg font-semibold">Shipping Methods Comparison</h3>
            <p className="text-sm text-orange-100/80 mt-1">
              Choose the shipping option that best fits your timeline and budget
            </p>
          </div>

          <CardContent className="p-0">
            <div className="border-t border-slate-200/5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Method</TableHead>
                    <TableHead className="text-center">Max Size</TableHead>
                    <TableHead className="text-center">Weight Limit</TableHead>
                    <TableHead className="text-center">Base Price</TableHead>
                    <TableHead className="text-center pr-6">Delivery Time</TableHead>
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
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Free Shipping</h4>
            <p className="text-sm text-slate-500 mt-2">Orders over $500 qualify for free standard ground shipping.</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <Truck className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Same Day Dispatch</h4>
            <p className="text-sm text-slate-500 mt-2">Orders placed before 2 PM EST are processed and shipped the same day.</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Protected Delivery</h4>
            <p className="text-sm text-slate-500 mt-2">Signature required on delivery for orders over $1,000 to ensure security.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
