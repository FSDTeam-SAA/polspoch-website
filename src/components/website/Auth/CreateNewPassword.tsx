import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import React from "react";

export default function CreateNewPassword() {
  return (
    <div className="w-full max-w-md">
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#1c1c1c] mb-2">
        Create a New Password
      </h1>
      <p className="text-gray-500 text-sm mb-8 ">
        Set a strong password to secure your account.
      </p>

    
      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-400">New Password</label>
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

    
      {/* Sign Up Button */}
      <Button className="w-full h-12 cursor-pointer bg-[#8a1f0b] hover:bg-[#8a1f0ba0] text-white rounded-md text-[16px]">
        Save Changes
      </Button>

      
    </div>
  );
}
