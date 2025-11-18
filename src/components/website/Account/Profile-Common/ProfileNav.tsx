"use client";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const ProfileNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { href: "/account/profile", label: "Profile" },
    { href: "/account/change-password", label: "Change Password" },
    { href: "/account/order-history", label: "Order History" },
    { href: "/logout", label: "Log Out" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled
          ? "bg-primary/80 backdrop-opacity-90 shadow-md"
          : "bg-transparent backdrop-grayscale"
      }`}
    >
      <div className="container mx-auto px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={80}
              height={80}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Menu Items */}
        <div
          className={`hidden md:flex space-x-8 font-medium transition-colors duration-300 ${
            scrolled ? "text-white" : "text-primary"
          }`}
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:underline hover:font-semibold transition-all duration-200 ${
                scrolled ? "hover:text-gray-200" : "hover:text-primary/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                className="text-gray-500 bg-white hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {open ? <X size={28} /> : <Menu size={28} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-6 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-gray-700 px-5 hover:underline font-medium text-lg hover:text-primary hover:font-semibold transition-all duration-200 py-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default ProfileNav