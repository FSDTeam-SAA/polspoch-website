import HeadingText from "@/components/ReusableSection/HeadingText";
// import Newsletter from "@/components/ReusableSection/Newsletter";
import OurServices from "@/components/ReusableSection/OurServices";
import ShippingPolicy from "@/components/ReusableSection/Shippingpolicy";
import AboutInfo from "@/components/website/PageSections/AboutUs/AboutInfo";
import Companies from "@/components/website/PageSections/AboutUs/Companies";

export default function page() {
  return (
    <div>
      <HeadingText
        subHeading="About Us"
        heading="Who We Are"
        description="Delivering premium iron and steel products with precision, innovation, and a commitment to excellence for B2C and B2B customers."
        align="center"
      />
      <AboutInfo />
      <Companies />
      <OurServices />
      <ShippingPolicy />
    </div>
  );
}
