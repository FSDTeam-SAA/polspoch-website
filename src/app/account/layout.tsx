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
    <ProfileNav />
      {children}

    </>
  );
}
