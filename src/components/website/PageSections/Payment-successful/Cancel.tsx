"use client";

import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-xl rounded-2xl shadow-lg border border-border">
        <CardContent className="py-12 text-center px-8">
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 animate-pulse flex items-center justify-center rounded-full bg-red-100">
            <XCircle className="w-10 h-10 text-red-600 " />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-semibold text-foreground">
            Payment Cancelled
          </h2>

          {/* Description */}
          <p className="mt-3 text-muted-foreground text-sm max-w-md mx-auto">
            Your payment has been cancelled. No charges have been made to your
            account. You can return to your cart to try again.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/cart"
              className="inline-block px-6 py-3 text-white font-medium rounded-lg bg-[#8B1E12] hover:bg-[#6e170e] transition"
            >
              Return to Cart
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 text-foreground font-medium rounded-lg border border-border hover:bg-muted transition"
            >
              Go to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
