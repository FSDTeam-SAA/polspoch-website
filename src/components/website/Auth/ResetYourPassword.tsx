// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Eye } from "lucide-react";
// // import React from "react";

// // export default function ResetYourPassword() {
// //   return (

// //     <div className="w-full max-w-md ">
// //       {/* Title */}
// //       <h1 className="text-4xl font-semibold mb-2">Reset Your Password</h1>
// //       <p className="text-gray-500 text-sm mb-8">
// //         Enter your email address and we&apos;ll send you code to reset your
// //         password.
// //       </p>

// //       {/* Email */}
// //       <div className="mb-4">
// //         <label className="block text-sm mb-1">Email Address</label>
// //         <Input
// //           placeholder="hello@example.com"
// //           className="bg-transparent border border-gray-700 text-gray-800 h-12"
// //         />
// //       </div>

// //       {/* Send Code  Button */}
// //       <Button className="w-full h-12 cursor-pointer bg-[#8a1f0b] hover:bg-[#8a1f0bcc] text-white rounded-md text-[16px]">
// //         Send Code
// //       </Button>
// //     </div>
// //   );
// // }


// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import useAuth from "@/lib/hooks/useAuth";

// export default function ResetYourPassword() {
//   const [email, setEmail] = useState("");

//   const router = useRouter();

//   const { loading, handleForgotPassword } = useAuth();

//   const handleSendCode = async (e: React.FormEvent) => {
//     e.preventDefault(); // ⬅️ important

//     const response = await handleForgotPassword(email);

//     if (response.success && response.data?.data?.accessToken) {
//       // Get the accessToken
//       const accessToken = response.data.data.accessToken;
//       router.push(`/verify-otp?token=${encodeURIComponent(accessToken)}`);
//     }
//   };

//   return (
//     // <div className="min-h-screen flex items-center justify-center bg-[#faf8f6] p-4">
//     <div className="w-full max-w-md ">
//       {" "}
//       <div className=" ">
//         {" "}
//         <h1 className="text-3xl font-bold text-gray-900">
//           Reset Your Password{" "}
//         </h1>
//         <p className="text-gray-500 mt-1 text-sm">
//           Enter your email address and we’ll send you a code to reset your
//           password.{" "}
//         </p>
//         <div className="mt-6 space-y-4">
//           <div>
//             <Label>Email Address</Label>

//             <Input
//               type="email"
//               className="mt-1 py-5"
//               placeholder="hello@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <Button
//             className="w-full bg-[#8A1B00] hover:bg-[#701600] mt-4 text-white cursor-pointer"
//             onClick={handleSendCode}
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send Code"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/lib/hooks/useAuth";

export default function ResetYourPassword() {
  const [email, setEmail] = useState("");

  const router = useRouter();
  const { loading, handleForgotPassword } = useAuth();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form behavior (i.e., page reload)

    const response = await handleForgotPassword(email);

    if (response.success && response.data?.data?.accessToken) {
      // Get the accessToken
      const accessToken = response.data.data.accessToken;
      router.push(`/verify-otp?token=${encodeURIComponent(accessToken)}`);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Enter your email address and we’ll send you a code to reset your password.
        </p>

        <form onSubmit={handleSendCode} className="mt-6 space-y-4">
          <div>
            <Label>Email Address</Label>

            <Input
              type="email"
              className="mt-1 py-5"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit" // Set type to "submit" so it triggers form submission
            className="w-full bg-[#8A1B00] hover:bg-[#701600] mt-4 text-white cursor-pointer"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Code"}
          </Button>
        </form>
      </div>
    </div>
  );
}
