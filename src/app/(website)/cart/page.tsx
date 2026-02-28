import HeadingText from "@/components/ReusableSection/HeadingText";
// import Newsletter from '@/components/ReusableSection/Newsletter'
import OurProducts from "@/components/ReusableSection/OurProducts";
import CartProducts from "@/components/website/PageSections/CartPage/CartProducts";
import React from "react";

const page = () => {
  return (
    <div>
      <HeadingText
        subHeading="CART"
        heading="Tu carro de la compra"
        description="Revisa las medidas y cortes de tus productos antes de proceder al check out"
        align="center"
      />
      <CartProducts />
      <OurProducts />
      {/* <Newsletter /> */}
    </div>
  );
};

export default page;
