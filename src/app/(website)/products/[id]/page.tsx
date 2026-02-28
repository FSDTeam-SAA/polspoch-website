// import Newsletter from "@/components/ReusableSection/Newsletter";
import Review from "@/components/ReusableSection/Review";
import WorkingProcess from "@/components/ReusableSection/WorkingProcess";
import ProductDetails from "@/components/website/PageSections/ProductsPage/ProductDetails";
import React from "react";
import { Metadata } from "next";
import { getProductById } from "@/lib/api";
import { getSeoMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const productData = await getProductById(params.id);

    // Fallback if product not found
    if (!productData || !productData.data) {
      return getSeoMetadata(null);
    }

    const product = productData.data;

    // We try to match SEO against the family name first, as the JSON provides family-level metadata
    const familyName =
      typeof product.family === "string"
        ? product.family
        : product.family?.familyName;

    const seoData = getSeoMetadata(familyName || product.productName);

    return {
      title: seoData.title,
      description: seoData.description,
    };
  } catch (error) {
    return getSeoMetadata(null);
  }
}

export default function page() {
  return (
    <div>
      <ProductDetails />
      <WorkingProcess />
      <Review />
      {/* <Newsletter /> */}
    </div>
  );
}
