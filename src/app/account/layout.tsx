// import React from 'react'

// const layout = () => {
//   return (
//     <div>layout</div>
//   )
// }

// export default layout

import type { Metadata } from "next";
// import "../globals.css";
import ProfileNav from "@/components/website/Account/Profile-Common/ProfileNav";
import Script from "next/script";

// export const metadata: Metadata = {
//     title: "Hierro A Medida",
//   description:
//     "Design amazing digital experiences that create more happy in the world.",
// };

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
      <ProfileNav />
      {children}
    </>
  );
}
