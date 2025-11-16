import ContactInformation from "@/components/ReusableSection/ContactInformation";
import FaqSection from "@/components/ReusableSection/FaqSection";
import GetInTouch from "@/components/ReusableSection/GetInTouch";
import HeadingText from "@/components/ReusableSection/HeadingText";
import React from "react";

export default function page() {
  return (
    <div>
      <HeadingText
        subHeading="Contact Us"
        heading="Get In Touch"
        description="Connecting you with our team for product inquiries, service support, and customized steel solutions tailored to your needs."
        align="center"
      />

      <GetInTouch />
      <FaqSection />
    </div>
  );
}
