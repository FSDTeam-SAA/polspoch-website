"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const ProfileNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const menuItems = [
    { href: "/account/profile", label: "Profile" },
    { href: "/account/change-password", label: "Change Password" },
    { href: "/account/order-history", label: "Order History" },
    { href: "#", label: "Log Out", onClick: () => setLogoutModalOpen(true) },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAV */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
          scrolled ? "bg-primary/80 shadow-md" : "bg-gray-200"
        }`}
      >
        <div className="container mx-auto px-8 flex justify-between items-center py-4">

          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={80}
              height={80}
              className="cursor-pointer"
            />
          </Link>

          {/* Desktop Menu */}
          {isLoggedIn && (
            <div
              className={`hidden md:flex space-x-8 font-medium ${
                scrolled ? "text-white" : "text-primary"
              }`}
            >
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick ? item.onClick : undefined}
                  className={`hover:underline cursor-pointer hover:font-semibold ${
                    scrolled ? "hover:text-gray-200" : "hover:text-primary/70"
                  }`}
                >
                  {item.onClick ? item.label : <Link href={item.href}>{item.label}</Link>}
                </button>
              ))}
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button className="text-gray-500 bg-white">
                  {open ? <X size={28} /> : <Menu size={28} />}
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-6 mt-8">
                  {isLoggedIn &&
                    menuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setOpen(false);
                          if (item.onClick) item.onClick();
                        }}
                        className="text-gray-700 px-5 text-lg hover:underline hover:text-primary"
                      >
                        {item.onClick ? item.label : <Link href={item.href}>{item.label}</Link>}
                      </button>
                    ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* LOGOUT MODAL */}
      <AlertDialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileNav;
