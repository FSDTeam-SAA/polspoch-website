import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import React from "react";

export default function ResetYourPassword() {
  return (
    // <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-10">

    // </div>
    <div className="w-full max-w-md ">
      {/* Title */}
      <h1 className="text-4xl font-semibold mb-2">Reset Your Password</h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter your email address and we&apos;ll send you code to reset your
        password.
      </p>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Email Address</label>
        <Input
          placeholder="hello@example.com"
          className="bg-transparent border border-gray-700 text-white h-12"
        />
      </div>

      {/* Send Code  Button */}
      <Button className="w-full h-12 cursor-pointer bg-[#8a1f0b] hover:bg-[#8a1f0bcc] text-white rounded-md text-[16px]">
        Send Code
      </Button>
    </div>
  );
}
