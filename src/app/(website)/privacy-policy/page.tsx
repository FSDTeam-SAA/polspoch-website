import HeadingText from "@/components/ReusableSection/HeadingText";
import PrivacyPolicy from "@/components/website/PageSections/PrivacyPolicy/PrivacyPolicy";
import React from "react";

export default function page() {
  return (
    <div>
      <HeadingText
        subHeading=""
        heading="Privacy Policy"
        description="Your privacy is important to us at Hierro A Maddia. We respect your privacy regarding any information we may collect from you across our website."
        align="center"
      />
      <PrivacyPolicy />
    </div>
  );
}
