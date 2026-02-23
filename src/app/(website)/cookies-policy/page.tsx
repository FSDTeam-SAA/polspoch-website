import CookiesPolicy from "@/components/website/PageSections/CookiesPolicy/CookiesPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | Hierroamedida.com",
  description:
    "Conozca cómo utilizamos las cookies en Hierroamedida.com para mejorar su experiencia de navegación y ofrecerle un mejor servicio.",
};

export default function page() {
  return (
    <div>
      <CookiesPolicy />
    </div>
  );
}
