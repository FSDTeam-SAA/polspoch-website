import Review from "@/components/ReusableSection/Review";
import ProductsPage from "@/components/website/PageSections/ProductsPage/ProductsPage";
import { Metadata } from "next";
import React from "react";

import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(props: {
  searchParams: Promise<{ family?: string }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  // Extract family name from slug if present (Format is "family-name-mongoID")
  const familySlug = searchParams.family || "";
  let categoryName = null;

  if (familySlug) {
    const parts = familySlug.split("-");
    const last = parts.at(-1) || "";
    const isObjectId = /^[a-f0-9]{24}$/i.test(last);

    // Attempt to parse out the pure family name
    if (isObjectId && parts.length > 1) {
      categoryName = parts.slice(0, -1).join(" ");
    } else {
      categoryName = familySlug.replace(/-/g, " ");
    }
  }

  const seoData = getSeoMetadata(categoryName);

  return {
    title: seoData.title,
    description: seoData.description,
  };
}

export default function page() {
  return (
    <div>
      <ProductsPage />
      <Review />
      {/* <Newsletter /> */}
    </div>
  );
}
