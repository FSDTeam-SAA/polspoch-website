"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-xl rounded-2xl shadow-lg border border-border">
        <CardContent className="py-12 text-center px-8">
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 animate-pulse flex items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="w-10 h-10 text-green-600 " />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-semibold text-foreground">
            Payment Successful
          </h2>

          {/* Description */}
          <p className="mt-3 text-muted-foreground text-sm max-w-md mx-auto">
            Thank you for your purchase! Your order has been successfully
            completed and is now being processed.
          </p>

          {/* Button */}
          <Link
            href="/"
            className="inline-block animate-bounce mt-8 px-6 py-3 text-white font-medium rounded-lg bg-[#8B1E12] hover:bg-[#6e170e] transition"
          >
            Go to Home page
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
