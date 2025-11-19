import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const data = [
  { invoice: "12345", item: "Product Name", date: "27/10/2025", amount: "$500.00", status: "Unpaid" },
  { invoice: "12345", item: "Product Name", date: "27/10/2025", amount: "$500.00", status: "Paid" },
  { invoice: "12345", item: "Service Name", date: "27/10/2025", amount: "$500.00", status: "Paid" },
  { invoice: "12345", item: "Product Name", date: "27/10/2025", amount: "$500.00", status: "Paid" },
  { invoice: "12345", item: "Product Name", date: "27/10/2025", amount: "$500.00", status: "Paid" },
  { invoice: "12345", item: "Service Name", date: "27/10/2025", amount: "$500.00", status: "Unpaid" },
  { invoice: "12345", item: "Product Name", date: "27/10/2025", amount: "$500.00", status: "Paid" },
  { invoice: "12345", item: "Product Name", date: "27/10/2025", amount: "$500.00", status: "Paid" },
];

export default function OrderList() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Order History</h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information and profile details.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-red-800">INVOICE</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Item</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-red-800">
                <div className="flex items-center gap-1">
                  BILLING DATE
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-red-800">AMOUNT</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-red-800">STATUS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{row.invoice}</td>
                <td className="px-6 py-4 text-gray-700">{row.item}</td>
                <td className="px-6 py-4 text-gray-700">{row.date}</td>
                <td className="px-6 py-4 text-gray-700">{row.amount}</td>
                <td className="px-6 py-4">
                  {row.status === "Paid" ? (
                    <span className="px-3 py-1 rounded-md bg-green-50 text-green-600 text-sm font-medium">
                      Paid
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-md bg-red-50 text-red-600 text-sm font-medium">
                      Unpaid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">Page 1 of 10</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm">Previous</Button>
          <Button variant="outline" className="text-sm">Next</Button>
        </div>
      </div>
    </div>
  );
}