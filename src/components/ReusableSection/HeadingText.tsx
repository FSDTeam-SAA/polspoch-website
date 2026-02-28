import React from "react";

const HeadingText = ({
  subHeading = "Contact Us",
  heading = "Get In Touch",
  description = "Connecting you with our team for product inquiries, service support, and customized steel solutions tailored to your needs.",
  align = "center", // left, center, right
}) => {
  return (
    <div className={`text-${align} p-5 mb-8 max-w-3xl mx-auto`}>
      <p className="text-sm md:text-base text-[#A0462C] font-bold tracking-wider">
        {subHeading}
      </p>

      <h2 className="text-4xl md:text-5xl text-slate-900 font-bold mt-2">
        {heading}
      </h2>

      <p className="text-lg md:text-xl text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default HeadingText;
