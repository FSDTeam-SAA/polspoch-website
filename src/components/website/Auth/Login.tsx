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

        toast.success("¡Sesión iniciada correctamente!");
        router.push("/");
      } else {
        toast.error(
          result?.error || "Error al iniciar sesión. Inténtalo de nuevo.",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Algo salió mal. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-4xl font-semibold mb-2">¡BIENVENIDO!</h1>
      <p className="text-gray-400 text-sm mb-8">
        Regístrate para poder ver toda la información de tus pedidos.
      </p>

      {/* ✅ FORM */}
      <form onSubmit={handleSignIn} className="mt-6 space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="hola@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label>Contraseña</Label>
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
            <label htmlFor="remember">Recuérdame</label>
          </div>

          <Link href="/reset-your-password" className="text-red-600 text-sm">
            ¿Olvidaste la contraseña?
          </Link>
        </div>

        {/* ✅ SUBMIT BUTTON */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#8A1B00] hover:bg-[#8A1B00]/90 text-white h-12 rounded-md transition-all duration-300 shadow-lg shadow-[#8A1B00]/20"
        >
          {isLoading ? "Iniciando sesión..." : "Inicia sesión"}
        </Button>
      </form>

      {/* 🚀 GOOGLE LOGIN DESIGN */}
      <div className="mt-8">
        <div className="relative flex items-center justify-center mb-8">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-widest absolute">
            o accede con
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span className="text-gray-700 font-medium group-hover:text-black">
            Continuar con Google
          </span>
        </button>
      </div>

      {/* Divider space */}
      <div className="mt-8 text-center text-sm text-slate-400">
        ¿No tienes cuenta?{" "}
        <Link
          href="/singup"
          className="text-red-400 font-semibold hover:underline transition-colors duration-200"
        >
          Regístrate
        </Link>
      </div>
    </div>
  );
}
