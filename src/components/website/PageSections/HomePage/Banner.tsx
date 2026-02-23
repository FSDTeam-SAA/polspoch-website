"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Banner() {
  const router = useRouter();

  const handleserviceCard = () => {
    const el = document.getElementById("service-card");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else router.push("#service-card");
  };
  return (
    <section className="relative lg:grid lg:h-[800px] lg:place-content-center overflow-hidden">
      {/* Background Video */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/banner-video.mp4" type="video/mp4" />
      </video> */}

      <Image
        src="/HIERROAMEDIDA.png"
        alt="HIERROAMEDIDA"
        fill
        className="object-cover"
        quality={100}
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45 dark:bg-black/60"></div>

      <div className="relative z-10 mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className={`text-4xl font-bold text-white sm:text-5xl ${montserrat.className}`}
            style={{
              textShadow: `
      3px 3px 6px rgba(0, 0, 0, 0.7),
      6px 6px 12px rgba(0, 0, 0, 0.5)
    `,
            }}
          >
            El primer Almacén de Hierros y Acero Online en España: Corte a Medida y Envío a Domicilio sin sorpresas
          </h1>

          <p
            className={`mt-4 text-base text-pretty text-gray-200 sm:text-lg/relaxed ${montserrat.className}`}
            style={{
              textShadow: `
      3px 3px 6px rgba(0, 0, 0, 0.7),
      6px 6px 12px rgba(0, 0, 0, 0.5)
    `,
            }}
          >
            Buscas hierro para tus proyectos de bricolaje o reformas Muy sencillo; Escoge el producto, selecciona las medidas exactas y recíbelo en la puerta de tu casa.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <Link href="#service-card">
              <button
                className="rounded cursor-pointer px-5 py-3 font-medium text-gray-200 shadow-sm bg-[#7E1800] hover:bg-[#9E2200] focus:outline-none "
                onClick={handleserviceCard}
              >
                Calcular Precios
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
