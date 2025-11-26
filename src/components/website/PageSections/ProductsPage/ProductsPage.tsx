import HeadingText from "@/components/ReusableSection/HeadingText";
import React from "react";
import AllProduct from "./AllProduct";

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
      <AllProduct />
    </div>
  );
}
