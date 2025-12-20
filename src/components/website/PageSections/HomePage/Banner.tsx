"use client";

export default function Banner() {
  return (
    <section className="relative lg:grid lg:h-[600px] lg:place-content-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/banner-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

      <div className="relative z-10 mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Strength Meets Precision in Every Steel Solution for Your Projects
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-200 sm:text-lg/relaxed">
            Explore our premium iron and steel products with custom cutting,
            bending, and rebar services built for maximum performance, delivered
            with industrial precision, and tailored to your exact
            specifications.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <a
              className="rounded  px-5 py-3 font-medium text-gray-200 shadow-sm bg-[#7E1800] hover:bg-[#9E2200] focus:outline-none "
              href="#service-card"
            >
              Discover our services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
