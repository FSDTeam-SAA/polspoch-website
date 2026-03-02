import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/website/Common/Navbar";
import Footer from "@/components/website/Common/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Comprar Hierro a Medida Online | Tubos, Vigas y Chapas | Hierroamedida.com",
  description:
    "Tu almacén de hierro digital en España. Compra tubos, vigas, chapas y pletinas con corte a medida exacto. Venta a particulares sin pedido mínimo y envío a domicilio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
