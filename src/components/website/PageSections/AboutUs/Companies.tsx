import Image from "next/image";
import React from "react";

const Companies = () => {
  return (
    <section className="container mx-auto">
      <div className="flex flex-col justify-center items-center py-10">
        <div className="text-center mb-8">
          <p className="text-gray-700">
            Materializamos los proyectos de empresas líderes en construcción,
            arquitectura y metalurgia.
          </p>
        </div>
        <div className="flex justify-center sm:justify-between items-center gap-30 flex-wrap">
          <Image
            src="/images/Layer-logo.png"
            alt="Company 1"
            width={150}
            height={50}
            className="mx-4"
          />
          <Image
            src="/images/sisyphus-logo.png"
            alt="Company 2"
            width={150}
            height={50}
            className="mx-4"
          />
          <Image
            src="/images/circlooes-logo.png"
            alt="Company 3"
            width={150}
            height={50}
            className="mx-4"
          />
          <Image
            src="/images/catalog-logo.png"
            alt="Company 4"
            width={150}
            height={50}
            className="mx-4"
          />
          <Image
            src="/images/quotient-logo.png"
            alt="Company 4"
            width={150}
            height={50}
            className="mx-4"
          />
        </div>
      </div>
    </section>
  );
};

export default Companies;
