import HeadingText from "@/components/ReusableSection/HeadingText";
import TermsConditions from "@/components/website/PageSections/TermsConditions/TermsConditions";
import React from "react";

export default function page() {
  return (
    <div>
      <HeadingText
        subHeading=""
        heading="Terms & Conditions"
        description="Please read the terms and conditions carefully before using Our Service."
        align="center"
      />
      <TermsConditions />
    </div>
  );
}
