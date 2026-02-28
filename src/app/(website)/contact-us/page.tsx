import FaqSection from "@/components/ReusableSection/FaqSection";
import GetInTouch from "@/components/ReusableSection/GetInTouch";
import HeadingText from "@/components/ReusableSection/HeadingText";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resuelve todas tus dudas y compra Hierro a Medida Online | Hierroamedida.com",
  description: "Recibe el hierro cortado a medida a la puerta de tu casa en Madrid, Barcelona, Valencia, Bilbao, Sevilla, Zaragoza o en cualquier rincón de España!",
};

export default function page() {
  return (
    <div>
      <HeadingText
        subHeading="Contáctanos"
        heading="¡Estamos aquí para ayudarte!"
        description="Nos encantaría saber de ti. Ya sea que tengas una duda sobre nuestros productos, necesites asistencia o simplemente quieras pedir más información, nuestro equipo está listo para escucharte y responder a todas tus inquietudes."
        align="center"
      />

      <GetInTouch />
      <FaqSection />
    </div>
  );
}
