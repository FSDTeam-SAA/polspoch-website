import HeadingText from "@/components/ReusableSection/HeadingText";
import React, { Suspense } from "react";
import AllProduct from "./AllProduct";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  return (
    <div>
      {/* Products Page Content */}
      <HeadingText
        subHeading="All Products"
        heading="Explore Our Product Range"
        description="Discover high-quality iron and steel materials built for durability, precision, and industrial performance."
        align="center"
      />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#7E1800] animate-spin" />
            <p className="mt-4 text-gray-500 font-medium">
              Loading products...
            </p>
          </div>
        }
      >
        <AllProduct />
      </Suspense>
    </div>
  );
}
