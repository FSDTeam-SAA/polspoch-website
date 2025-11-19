import AuthLayout from "@/components/website/Auth/AuthLayout";
import Login from "@/components/website/Auth/Login";

export default function page() {
  return (
    <AuthLayout imageSrc="/images/login.jpg">
      <Login />
    </AuthLayout>
  );
}

// // import Login from "@/components/website/Auth/login";
// import Login from "@/components/website/Auth/Login";
// import React from "react";

// export default function page() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }
