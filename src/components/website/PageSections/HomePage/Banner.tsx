"use client";

export default function Banner() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat lg:grid lg:h-screen lg:place-content-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Overlay for better text contrast */}
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
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              href="#"
            >
              Get Started
            </a>

            <a
              className="inline-block rounded border border-gray-200 bg-white/10 px-5 py-3 font-medium text-gray-200 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
