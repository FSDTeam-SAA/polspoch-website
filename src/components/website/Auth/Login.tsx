import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-10">
      <div className="w-full max-w-md ">
        {/* Title */}
        <h1 className="text-4xl font-semibold mb-2">Welcome!</h1>
        <p className="text-gray-400 text-sm mb-8">
          Manage your orders, track shipments, and configure products easily.
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email Address</label>
          <Input
            placeholder="hello@example.com"
            className="bg-transparent border border-slate-700 text-white h-12"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <Input
              type="password"
              placeholder="********"
              className="bg-transparent border border-slate-700 text-white h-12 pr-10"
            />
            <Eye className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="text-gray-500">
              Remember me
            </label>
          </div>
          <Link href="/reset-your-password">
            <button className="text-red-400 hover:underline">
              Forgot password?
            </button>
          </Link>
        </div>

        {/* Sign In Button */}
        <Button className="w-full h-12 bg-[#8a1f0b] hover:bg-[#8a1f0bcc] text-white rounded-md text-[16px]">
          Sign In
        </Button>

        {/* Divider space */}
        <div className="mt-8 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/singup"
            className="text-red-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
