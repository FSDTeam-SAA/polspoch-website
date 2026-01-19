import MostPopularProducts from "@/components/ReusableSection/MostPopularProducts";
import OurProducts from "@/components/ReusableSection/OurProducts";
import OurServices from "@/components/ReusableSection/OurServices";
import Review from "@/components/ReusableSection/Review";
import ShippingPolicy from "@/components/ReusableSection/Shippingpolicy";
import WorkingProcess from "@/components/ReusableSection/WorkingProcess";
import Banner from "@/components/website/PageSections/HomePage/Banner";

export default function page() {
  return (
    <div>
      <Banner />
      <WorkingProcess />
      <OurProducts />
      <OurServices />
      <ShippingPolicy />
      <MostPopularProducts />
      <Review />
      {/* <Newsletter /> */}
    </div>
  );
}
