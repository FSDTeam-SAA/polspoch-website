import React from "react";

const ServiceDetails = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Image Section - UNCHANGED */}
          <div className="lg:col-span-6">
            <div className="rounded-lg overflow-hidden border bg-gray-50">
              <div className="relative w-full h-[520px]">{/* Image */}</div>
            </div>

            {/* Thumbnails */}
            {/* <div className="mt-4 flex gap-3 items-center">
              {product.productImage && product.productImage.length > 0 ? (
                product.productImage.map((img, idx) => (
                  <button
                    key={img._id ?? idx}
                    onClick={() => setSelectedThumbnail(idx)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedThumbnail === idx
                        ? "border-rose-800"
                        : "border-gray-300"
                    } p-0`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img?.url}
                        alt={`${product.productName}-${idx}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-gray-500">No thumbnails</div>
              )}
            </div> */}
          </div>

          {/* RIGHT: Product Details - MODIFIED */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="">
              <h1 className="text-2xl lg:text-3xl font-semibold mb-3">
                {/* Service Name  */}
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                {/* Service Description */}
              </p>
            </div>
            <div className="">
              <div className="">
                {/* Types of Service */}
                {/*
                 3 types of service |Rebar| Cutting| Bending| 
                 shadcn tabs used here
                */}
                {/* Rebar button */}
                {/* Cutting button */}
                {/* Bending button */}
              </div>
              <div className="">
                {/* Rebar Features */}
                <div className="">{/* Rebar Features */}</div>
              </div>
            </div>
            <div className="">
              {/* show all the Rebar|Cutting|Bending Main features */}
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ServiceDetails;
