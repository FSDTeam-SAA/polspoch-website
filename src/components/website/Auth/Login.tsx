//         {/* Divider space */}
//         <div className="mt-8 text-center text-sm text-slate-400">
//           Don&apos;t have an account?{" "}
//           <Link
//             href="/singup"
//             className="text-red-400 font-semibold hover:underline"
//           >
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { mergeCart } from "@/lib/api";
import { getOrCreateGuestId, clearGuestId } from "@/lib/guestId";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // ⬅️ important
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Handle cart merging if guestId exists
        const guestId = getOrCreateGuestId();
        // result?.ok doesn't directly give us the token,
        // but session will be updated.
        // However, result from signIn might not have accessToken.
        // We'll use getSession or wait for session update?
        // Usually, the next request will have it.
        // Let's try to get it from result if possible or another way.
        // Actually, mergeCart in api.ts takes token.
        // After signIn, session is available.

        // Wait a bit for session to populate or use a trick.
        const sessionRes = await fetch("/api/auth/session").then((res) =>
          res.json(),
        );
        const token = sessionRes?.accessToken;

        if (guestId && token) {
          try {
            await mergeCart(guestId, token);
            clearGuestId();
            console.log("Cart merged successfully");
          } catch (error) {
            console.error("Failed to merge cart:", error);
            // Non-blocking error
          }
        }

        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        toast.error(result?.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-4xl font-semibold mb-2">Welcome!</h1>
      <p className="text-gray-400 text-sm mb-8">
        Manage your orders, track shipments, and configure products easily.
      </p>

      {/* ✅ FORM */}
      <form onSubmit={handleSignIn} className="mt-6 space-y-4">
        <div>
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <Link href="/reset-your-password" className="text-red-600 text-sm">
            Forgot password?
          </Link>
        </div>

        {/* ✅ SUBMIT BUTTON */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#8A1B00]"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

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
  );
}
