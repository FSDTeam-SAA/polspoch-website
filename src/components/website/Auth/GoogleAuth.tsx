"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function GoogleCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSocialLogin = async (token: string, refreshToken: string) => {
        try {
            const result = await signIn("credentials", {
                socialToken: token,
                refreshToken: refreshToken,
                redirect: false,
            });

            if (result?.ok) {
                toast.success("¡Sesión iniciada con Google!");
                router.push("/");
            } else {
                toast.error("Error al iniciar sesión con Google.");
                router.push("/login");
            }
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Algo salió mal durante el inicio de sesión.");
            router.push("/login");
        }
    };

    useEffect(() => {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");

        if (token) {
            handleSocialLogin(token, refreshToken || "");
        } else {
            toast.error("No se pudo obtener el token de acceso.");
            router.push("/login");
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#8A1B00] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium animate-pulse">
                    Autenticando con Google...
                </p>
            </div>
        </div>
    );
}
