"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "sonner";

export default function CreateYourAccount() {
  const { handleSignup, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await handleSignup({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    });

    if (res.success) {
      toast.success("Account created successfully!");
      // optionally redirect after signup
    } else {
      toast.error(res.message || "Signup failed");
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-4xl font-bold text-[#1c1c1c] mb-2">
        Create Your Account
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Create your account to start booking services and products.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1 text-gray-400">First Name</label>
          <Input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Bowdy"
            className="bg-transparent border border-gray-700 text-gray-800 h-12"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-400">Last Name</label>
          <Input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="James"
            className="bg-transparent border border-gray-700 text-gray-800 h-12"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-400">
          Email Address
        </label>
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@example.com"
          className="bg-transparent border border-gray-700 text-gray-800 h-12"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-400">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            className="bg-transparent border border-gray-700 text-gray-800 h-12 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1 text-gray-400">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="********"
            className="bg-transparent border border-gray-700 text-gray-800 h-12 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <p className="text-[12px] text-gray-700 mb-6 leading-relaxed">
        <span className="text-red-700">*</span> By signing up, you agree to our{" "}
        <Link href={"/terms-conditions"}>
          <span className="text-red-500 font-semibold">Terms & Conditions</span>
        </Link>{" "}
        and {" "}
        <Link href={"/privacy-policy"}>
          <span className="text-red-500 font-semibold">Privacy Policy.</span>
        </Link>
      </p>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-12 cursor-pointer bg-[#8a1f0b] hover:bg-[#8a1f0ba0] text-white rounded-md text-[16px]"
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <div className="mt-8 text-center text-sm text-gray-700">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-red-500 font-semibold hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
