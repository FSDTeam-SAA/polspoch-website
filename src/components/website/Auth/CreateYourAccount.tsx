import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function CreateYourAccount() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Title */}
        <h1 className="text-4xl font-bold text-[#1c1c1c] mb-2">
          Create Your Account
        </h1>
        <p className="text-gray-500 text-sm mb-8 ">
          Create your account to start booking, hosting, and sharing kitchens.
        </p>

        {/* First + Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">
              First Name
            </label>
            <Input
              placeholder="Bowdy"
              className="bg-transparent border border-gray-700 text-white h-12"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">
              Last Name
            </label>
            <Input
              placeholder="James"
              className="bg-transparent border border-gray-700 text-white h-12"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-400">
            Email Address
          </label>
          <Input
            placeholder="example@example.com"
            className="bg-transparent border border-gray-700 text-white h-12"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-400">Password</label>
          <div className="relative">
            <Input
              type="password"
              placeholder="********"
              className="bg-transparent border border-gray-700 text-white h-12 pr-10"
            />
            <Eye className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="block text-sm mb-1 text-gray-400">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type="password"
              placeholder="********"
              className="bg-transparent border border-gray-700 text-white h-12 pr-10"
            />
            <Eye className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Terms */}
        <p className="text-[12px] text-gray-400 mb-6 leading-relaxed">
          *By signing up, you agree to our{" "}
          <span className="text-red-500 font-semibold">Terms & Conditions</span>{" "}
          and{" "}
          <span className="text-red-500 font-semibold">Privacy Policy.</span>
        </p>

        {/* Sign Up Button */}
        <Button className="w-full h-12 cursor-pointer bg-[#8a1f0b] hover:bg-[#8a1f0ba0] text-white rounded-md text-[16px]">
          Sign Up
        </Button>

        {/* Sign In */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-500 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
