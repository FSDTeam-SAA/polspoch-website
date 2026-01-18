// import Newsletter from "@/components/ReusableSection/Newsletter";
import Review from "@/components/ReusableSection/Review";
import WorkingProcess from "@/components/ReusableSection/WorkingProcess";
import OtherServices from "@/components/website/PageSections/ServicePage/OtherServices";
// import ServiceDetails from "@/components/website/PageSections/ServicePage/ServiceDetails";
import ServiceProductInfo from "@/components/website/PageSections/ServicePage/ServiceProductInfo";
import ServiceTechnical from "@/components/website/PageSections/ServicePage/ServiceTechnical";
import React from "react";

const page = () => {
  return (
    <div>
      <ServiceProductInfo />
      <ServiceTechnical />
      <WorkingProcess />
      <OtherServices />
      <Review />
      {/* <Newsletter /> */}
    </div>
  );
};

export default page;
