import Newsletter from "@/components/ReusableSection/Newsletter";
import Review from "@/components/ReusableSection/Review";
import WorkingProcess from "@/components/ReusableSection/WorkingProcess";
import ProductDetails from "@/components/website/PageSections/ProductsPage/ProductDetails";
import React from "react";

export default function page() {
  return (
    <div>
      <ProductDetails />
      <WorkingProcess />
      <Review />
      <Newsletter />
    </div>
  );
}
