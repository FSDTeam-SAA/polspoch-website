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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ⬅️ REQUIRED
    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const res = await handleSignup({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    });

    if (res.success) {
      toast.success("¡Cuenta creada correctamente!");
      // optionally redirect after signup
    } else {
      toast.error(res.message || "Error al registrarse");
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-4xl font-bold text-[#1c1c1c] mb-2">
        CREA TU CUENTA
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Crea tu cuenta para empezar a reservar servicios y productos.
      </p>
      {/* ✅ FORM */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">
              Nombre
            </label>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Bowdy"
              className="bg-transparent border border-gray-700 text-gray-800 h-12"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">
              Apellido
            </label>
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
            Email
          </label>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ejemplo@ejemplo.com"
            className="bg-transparent border border-gray-700 text-gray-800 h-12"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-400">Contraseña</label>
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
            Confirma contraseña
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
          <span className="text-red-700">*</span> Al registrarse estás aceptando
          nuestros{" "}
          <Link href={"/terms-conditions"}>
            <span className="text-red-500 font-semibold">
              Términos y Condiciones
            </span>
          </Link>{" "}
          y la{" "}
          <Link href={"/privacy-policy"}>
            <span className="text-red-500 font-semibold">
              Política de Privacidad.
            </span>
          </Link>
        </p>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 cursor-pointer bg-[#8a1f0b] hover:bg-[#8a1f0ba0] text-white rounded-md text-[16px] transition-all duration-300 shadow-lg shadow-[#8a1f0b]/20"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
 
      {/* 🚀 GOOGLE SIGNUP DESIGN */}
      <div className="mt-8">
        <div className="relative flex items-center justify-center mb-8">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-widest absolute">
            o regístrate con
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
          }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 group shadow-sm"
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
            Registrarse con Google
          </span>
        </button>
      </div>
       <div className="mt-8 text-center text-sm text-gray-700">
         ¿Ya tienes una cuenta?{" "}
         <Link
           href="/login"
           className="text-red-500 font-semibold hover:underline transition-colors duration-200"
         >
           Inicia Sesión
         </Link>
       </div>
     </div>
  );
}

// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import useAuth from "@/lib/hooks/useAuth";
// import { toast } from "sonner";

// export default function CreateYourAccount() {
//   const { handleSignup, loading, error } = useAuth();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // ⬅️ REQUIRED
//     if (form.password !== form.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     const res = await handleSignup({
//       firstName: form.firstName,
//       lastName: form.lastName,
//       email: form.email,
//       password: form.password,
//     });

//     if (res.success) {
//       toast.success("Account created successfully!");
//     } else {
//       toast.error(res.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="w-full max-w-md">
//       <h1 className="text-4xl font-bold mb-2">Create Your Account</h1>
//       <p className="text-gray-500 text-sm mb-8">
//         Create your account to start booking services and products.
//       </p>

//       {/* ✅ FORM */}
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <Input
//             name="firstName"
//             value={form.firstName}
//             onChange={handleChange}
//             placeholder="First Name"
//           />
//           <Input
//             name="lastName"
//             value={form.lastName}
//             onChange={handleChange}
//             placeholder="Last Name"
//           />
//         </div>

//         <Input
//           name="email"
//           value={form.email}
//           onChange={handleChange}
//           placeholder="Email"
//           className="mb-4"
//         />

//         <div className="relative mb-4">
//           <Input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2"
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>

//         <div className="relative mb-6">
//           <Input
//             type={showConfirmPassword ? "text" : "password"}
//             name="confirmPassword"
//             value={form.confirmPassword}
//             onChange={handleChange}
//             placeholder="Confirm Password"
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2"
//           >
//             {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>

//         {/* ✅ SUBMIT */}
//         <Button
//           type="submit"
//           disabled={loading}
//           className="w-full h-12 bg-[#8a1f0b]"
//         >
//           {loading ? "Signing Up..." : "Sign Up"}
//         </Button>
//       </form>

//       {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
//     </div>
//   );
// }
