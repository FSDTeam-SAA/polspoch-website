"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  UserCircle2,
  X,
  Loader2,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useUserProfile } from "@/lib/hooks/useSserProfile";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { usePathname } from "next/navigation";

// 🟢 Get Initials helper
function getInitials(firstName?: string, lastName?: string) {
  if (!firstName) return "U";
  return `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: user, isLoading: userLoading } = useUserProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileUserOpen, setMobileUserOpen] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/services", label: "Services" },
    { href: "/about-us", label: "About" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <AlertDialog>
      {/* ======================================================
                  MAIN NAVBAR
      ======================================================= */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
          scrolled
            ? "bg-primary/80 backdrop-opacity-90 shadow-md"
            : "bg-transparent backdrop-grayscale"
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
                }${
                  pathname === item.href
                    ? " text-[#7E1800] font-semibold" // Active link styles
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons (Desktop) */}
          <div
            className={`hidden md:flex items-center gap-6 cursor-pointer transition-colors duration-300 ${
              scrolled ? "text-white" : "text-primary"
            }`}
          >
            <Search />

            <Link href="/cart">
              <ShoppingCart />
            </Link>

            {/* ================================
                USER / AVATAR / DROPDOWN
            ================================= */}
            {userLoading ? (
              <div className="h-9 w-9 rounded-full flex items-center justify-center bg-white/10">
                <Loader2 className="h-5 w-5 " />
              </div>
            ) : user ? (
              <div className="relative">
                {/* Avatar Button */}
                <button
                  className="h-9 w-9 rounded-full bg-[#7E1800] text-white flex items-center justify-center cursor-pointer font-medium"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {user?.image?.url ? (
                    <Image
                      src={user.image.url}
                      alt="User Avatar"
                      width={36}
                      height={36}
                      className="h-full w-full rounded-full  object-cover"
                    />
                  ) : (
                    getInitials(user.firstName, user.lastName)
                  )}
                </button>

                {/* Clickable Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 flex flex-col w-48 bg-white text-black shadow-lg rounded-lg p-2 z-50">
                    <div className="px-3 py-2 border-b">
                      <p className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>

                    <Link
                      href="/account/profile"
                      className="px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>

                    <Link
                      href="/account/orders"
                      className="px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Orders
                    </Link>

                    <AlertDialogTrigger asChild>
                      <button
                        className="px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Logout
                      </button>
                    </AlertDialogTrigger>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/account/profile">
                <UserCircle2 />
              </Link>
            )}
          </div>

          {/* ================================
                Mobile Hamburger Menu
          ================================= */}
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
                {/* Mobile User Section */}
                {userLoading ? (
                  <div className="flex items-center gap-3 px-5 mt-6">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Checking account...</span>
                  </div>
                ) : user ? (
                  <div className="px-5 mt-6">
                    {/* Clickable User Header */}
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setMobileUserOpen(!mobileUserOpen)}
                    >
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-[#7E1800] text-white flex items-center justify-center font-medium">
                        {user?.image?.url ? (
                          <Image
                            src={user.image.url}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(user.firstName, user.lastName)
                        )}
                      </div>

                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {/* Clickable Dropdown */}
                    {mobileUserOpen && (
                      <div className="flex flex-col mt-2 px-2 space-y-1">
                        <Link
                          href="/account/profile"
                          onClick={() => setOpen(false)}
                          className="py-2 px-2 rounded hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setOpen(false)}
                          className="py-2 px-2 rounded hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => setOpen(false)}
                            className="py-2 px-2 rounded text-red-600 hover:bg-red-50 text-left"
                          >
                            Logout
                          </button>
                        </AlertDialogTrigger>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/account/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 mt-6"
                  >
                    <UserCircle2 />
                    <span>Sign in</span>
                  </Link>
                )}

                {/* Mobile Navigation Items */}
                <nav className="flex flex-col space-y-6 mt-8">
                  {menuItems.map((item) => {
                    // Normalize paths to avoid trailing slash mismatch
                    const normalizedPath = pathname?.replace(/\/$/, "");
                    const normalizedHref = item.href.replace(/\/$/, "");

                    const isActive = normalizedPath === normalizedHref;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`text-gray-700 px-5 hover:underline font-medium text-lg hover:text-primary hover:font-semibold transition-all duration-200 py-2 ${
                          isActive ? "text-[#7E1800] font-semibold" : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ======================================================
              LOGOUT CONFIRMATION MODAL (GLOBAL)
      ======================================================= */}
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
            onClick={() => signOut()}
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
