"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Camera, 
  Menu, 
  X, 
  LayoutDashboard, 
  PlusCircle, 
  ListOrdered, 
  BookmarkCheck, 
  LogOut, 
  LogIn, 
  UserPlus 
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/ThemeToggle"; // 🔥 থিম টগল কম্পোনেন্ট ইম্পোর্ট

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Better Auth থেকে রিয়েল-টাইম সেশন ফেচ করা
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Track hash changes on click for smooth navigation state
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about-us" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && activeHash === "";
    }
    if (href.startsWith("/#")) {
      return pathname === "/" && activeHash === href.replace("/", "");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Logout Handler
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setDropdownOpen(false);
          setIsOpen(false);
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#141414]/95 backdrop-blur-md border-b border-neutral-800 shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link 
            href="/" 
            onClick={() => setActiveHash("")}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Camera className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground flex items-center">
                <span className="text-white">Studio</span>
                <span className="text-primary">Space</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                P2P Creative Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    if (link.href === "/") setActiveHash("");
                    if (link.href.startsWith("/#")) setActiveHash(link.href.replace("/", ""));
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-primary font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area (Auth States & Theme Toggle) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* 🔥 থিম টগল বাটন (ডেস্কটপ ভিউ) */}
            <ThemeToggle />

            {isPending ? (
              <div className="text-sm text-neutral-500">Loading...</div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-full hover:bg-neutral-900 transition-colors border border-neutral-800 focus:outline-none cursor-pointer"
                >
                  <img
                    src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
                    alt={user.name || "User"}
                    className="w-9 h-9 rounded-full object-cover border border-primary/20"
                  />
                  <span className="text-sm font-medium pr-2 text-white hidden lg:inline">
                    {user.name}
                  </span>
                </button>

                {/* Authenticated Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#141414] border border-neutral-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-neutral-800">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        Dashboard
                      </Link>
                      <Link
                        href="/add-studio"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-primary" />
                        Add New Studio
                      </Link>
                      <Link
                        href="/my-listings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        <ListOrdered className="w-4 h-4 text-primary" />
                        My Studio Listings
                      </Link>
                      <Link
                        href="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                        My Bookings
                      </Link>
                    </div>

                    <div className="border-t border-neutral-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-300 hover:text-primary transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-md transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle Button Area */}
          <div className="flex md:hidden items-center gap-2">
            {/* 🔥 থিম টগল বাটন (মোবাইল ভিউ) */}
            <ThemeToggle />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-white hover:bg-neutral-900 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#141414] border-b border-neutral-800 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  if (link.href === "/") setActiveHash("");
                  if (link.href.startsWith("/#")) setActiveHash(link.href.replace("/", ""));
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-neutral-800 pt-4">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <img src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} alt={user.name || "User"} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-neutral-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-900 text-neutral-300"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard
                </Link>
                <Link
                  href="/add-studio"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-900 text-neutral-300"
                >
                  <PlusCircle className="w-4 h-4 text-primary" /> Add New Studio
                </Link>
                <Link
                  href="/my-listings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-900 text-neutral-300"
                >
                  <ListOrdered className="w-4 h-4 text-primary" /> My Studio Listings
                </Link>
                <Link
                  href="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-900 text-neutral-300"
                >
                  <BookmarkCheck className="w-4 h-4 text-primary" /> My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-800 rounded-xl font-medium text-white hover:bg-neutral-900 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md hover:bg-primary/90 transition-all"
                >
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}