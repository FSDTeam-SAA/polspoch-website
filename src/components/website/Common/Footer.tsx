"use client";

import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { useProducts } from "@/lib/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/types/product";
import { slugify } from "@/lib/utils";

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/#service-card" },
  { label: "About", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Privacy & Policy", href: "/privacy-policy" },
  { label: "Shipping Policy", href: "/#ShippingPolicy" },
  { label: "Cookies Policy", href: "/cookies-policy" },
  { label: "FAQs", href: "/contact-us#faq-section" },
];

const FooterList: FC<{
  title: string;
  items: { label: string; href: string }[];
  isLoading?: boolean;
}> = ({ title, items, isLoading }) => (
  <div>
    <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
    <ul className="space-y-2 text-white">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-4 w-32 bg-white/10" />
          </li>
        ))
      ) : items.length > 0 ? (
        items.map((item, idx) => (
          <li key={idx}>
            <Link
              href={item.href}
              className="hover:text-white hover:underline transition"
            >
              {item.label}
            </Link>
          </li>
        ))
      ) : (
        <li className="text-sm text-gray-400">No items available</li>
      )}
    </ul>
  </div>
);

const Footer = () => {
  const { data, isLoading } = useProducts({ limit: 5 }, true);

  // ✅ Ensure maximum 5 products shown (frontend safety)
  const productLinks =
    data?.data?.slice(0, 5).map((p: Product) => ({
      label: p.productName,
      href: `/products/${slugify(p.productName)}-${p._id}`,
    })) || [];

  return (
    <footer className="relative w-full text-white py-12 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-[#2C0800] bg-center bg-no-repeat"></div>

      <div className="relative container mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Logo + Intro */}
        <div>
          <Link href="/" className="w-24 h-20">
            <Image
              src="/images/logo.png"
              alt="Footer Logo"
              width={90}
              height={80}
              className="mb-2 object-cover"
            />
          </Link>
          <p className="text-white">
            Design amazing digital experiences that create more happy in the
            world.
          </p>
        </div>

        <FooterList title="Company" items={companyLinks} />
        <FooterList
          title="Product"
          items={productLinks}
          isLoading={isLoading}
        />
        <FooterList title="Legal" items={legalLinks} />

        {/* Contact Section */}
        <div>
          <h3 className="font-semibold text-3xl text-white mb-4">Contact Us</h3>
          <ul className="space-y-4 text-white">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a
                href="tel:+1234567890"
                className="hover:underline text-[10px] sm:text-xs md:text-sm transition-colors"
              >
                +1234567890
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a
                href="mailto:example@example.com"
                className="hover:underline text-[10px] sm:text-xs md:text-sm transition-colors"
              >
                example@example.com
              </a>
            </li>

            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs md:text-sm">
                Madrid, SP
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative mt-12 border-t container mx-auto border-gray-600 pt-6 text-center text-gray-300 text-sm">
        <div className="flex justify-between items-center">
          <p className="text-white">
            © {new Date().getFullYear()} HIERRO A MEDIDA. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <BsTwitterX className="w-5 h-5" />
            <FaLinkedin className="w-6 h-6" />
            <FaFacebook className="w-6 h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
