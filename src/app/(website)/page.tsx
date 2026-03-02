import MostPopularProducts from "@/components/ReusableSection/MostPopularProducts";
import OurProducts from "@/components/ReusableSection/OurProducts";
import OurServices from "@/components/ReusableSection/OurServices";
import Review from "@/components/ReusableSection/Review";
import ShippingPolicy from "@/components/ReusableSection/Shippingpolicy";
import WorkingProcess from "@/components/ReusableSection/WorkingProcess";
import Banner from "@/components/website/PageSections/HomePage/Banner";
import Script from "next/script";

export default function page() {
  return (
    <div>
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GCQDY36ZF3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GCQDY36ZF3');
          `}
        </Script>
      </head>
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
