"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { useOrderHistory } from "@/lib/hooks/useOrderHistory";
import { Order, OrderCartItem } from "@/lib/types/order";

export default function OrderList() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useOrderHistory(page, limit);

  const orders = data?.data || [];
  const meta = data?.meta;

  const getItemsDisplay = (order: Order) => {
    const items = order.cartItems
      .filter((item: OrderCartItem) => item.cartId !== null)
      //eslint-disable-next-line
      .map((item: OrderCartItem) => {
        // Safe check because we filtered null cartId
        const cartId = item.cartId!;
        if (cartId.type === "service") {
          return cartId.service?.templateName || "Service";
        }
        return cartId.product?.productName || "Product";
      });

    if (items.length === 0) return "No items";
    if (items.length === 1) return items[0];
    return `${items[0]} + ${items.length - 1} more`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-GB").format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#7E1800] animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 max-w-md">
          <p className="text-red-600 font-semibold text-lg mb-2">
            Failed to load order history
          </p>
          <p className="text-red-500/80 text-sm mb-4">
            There was an error fetching your orders. Please try refreshing the
            page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-center">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-red-800 uppercase tracking-wider">
                INVOICE
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                Item
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-red-800 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  BILLING DATE
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-red-800 uppercase tracking-wider">
                AMOUNT
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-red-800 uppercase tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-gray-400">
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm">
                      You haven&apos;t placed any orders yet.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-500 font-mono mb-1 block w-fit">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    {order._id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {getItemsDisplay(order)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(order.purchaseDate || order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ${order.totalAmount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4">
                    {order.paymentStatus === "paid" ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Page <span className="font-bold text-gray-900">{page}</span> of{" "}
            <span className="font-bold text-gray-900">{meta.totalPages}</span>
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-sm font-bold h-9 px-4 hover:bg-[#7E1800] hover:text-white transition-all disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="text-sm font-bold h-9 px-4 hover:bg-[#7E1800] hover:text-white transition-all disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
