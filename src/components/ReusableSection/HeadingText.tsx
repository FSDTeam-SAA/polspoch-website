import React from "react";

const HeadingText = ({
  subHeading = "Contact Us",
  heading = "Get In Touch",
  description = "Connecting you with our team for product inquiries, service support, and customized steel solutions tailored to your needs.",
  align = "center", // left, center, right
}) => {
  return (
    <div className={`text-${align} p-5 mb-8 max-w-3xl mx-auto`}>
      <p className="text-sm text-[#A0462C] font-medium tracking-wide">
        {subHeading}
      </p>

      <h2 className="text-3xl md:text-4xl text-[#2C343E] font-semibold mt-2">
        {heading}
      </h2>

      <p className="text-[#6B7280] mt-3 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default HeadingText;
