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
        subHeading="Sobre Nosotros"
        heading="Quiénes Somos: Tu Socio en Suministro y Transformación de Hierro y Aceros"
        description="Proveemos soluciones integrales con una amplia gama de productos de hierro y acero. Combinamos precisión, maquinaria CNC y un compromiso total con la excelencia para clientes industriales (B2B) y particulares (B2C) en toda la península"
        align="center"
      />
      <AboutInfo />
      <Companies />
      <OurServices />
      <ShippingPolicy />
    </div>
  );
}
