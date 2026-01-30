"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import {
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  List,
  Heart,
  History,
  ShoppingCart,
  Menu,
  X,
  PlusCircle,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  // Stan logowania (Demo)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Stany UI
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- LOGIKA DEMO ---
  const handleDemoLogin = () => {
    console.log("🚀 DEMO MODE: Logging in...");
    setUserData({
      username: "Demo User",
      email: "demo@matchdays.com",
    });
    setIsLoggedIn(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setIsProfileOpen(false);
    window.location.href = "/";
  };
  // -------------------

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kliknięcie poza dropdownem
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Blokada scrolla na mobile
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  // Linki (Zaktualizowana lista)
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Auctions", href: "/auctions" },
    { name: "AI Tools", href: "/aitools" },
    { name: "Matchdays Arena", href: "/arena", highlight: true },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 border-b border-gray-200 transition-all duration-300 ${
          scrolled ? "py-4 bg-white shadow-sm" : "py-6 bg-white"
        }`}
      >
        <div className="w-full px-8 md:px-16 flex items-center justify-between relative">
          {/* LEWA STRONA: Logo */}
          <div className="flex-shrink-0 z-50">
            <Link
              href="/"
              className="text-2xl font-black tracking-widest uppercase text-black hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              MatchDays
            </Link>
          </div>

          {/* ŚRODEK: Nawigacja Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <ul className="flex gap-10 items-center list-none font-bold text-base tracking-wide">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`nav-link uppercase transition-colors ${
                      link.highlight
                        ? "text-indigo-600 font-extrabold hover:text-indigo-800"
                        : "hover:text-gray-600 text-black"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PRAWA STRONA: Akcje */}
          <div className="flex items-center gap-2 md:gap-4 justify-end z-50">
            {/* Koszyk */}
            <Link
              href="/cart"
              className="relative p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart size={24} className="text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Hamburger Mobile - Otwiera Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors z-50"
            >
              <Menu size={28} className="text-black" />
            </button>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={handleDemoLogin}
                    className="px-8 py-3 bg-white text-black border-2 border-black text-base font-bold rounded-lg hover:bg-black hover:text-white transition-all whitespace-nowrap uppercase"
                  >
                    Login
                  </button>
                  <Link
                    href="/register"
                    className="px-8 py-3 bg-black text-white text-base font-bold rounded-lg hover:bg-gray-900 transition-all hover:shadow-lg whitespace-nowrap uppercase"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-6" ref={dropdownRef}>
                  <Link
                    href="/add-listing"
                    className="hidden md:flex items-center gap-2.5 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-bold text-base whitespace-nowrap uppercase"
                  >
                    <PlusCircle size={20} />
                    <span>Sell Item</span>
                  </Link>

                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group whitespace-nowrap"
                  >
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <span className="font-bold text-base uppercase">
                      Profile
                    </span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-base font-bold text-gray-900">
                          {userData?.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userData?.email}
                        </p>
                      </div>

                      <div className="py-2">
                        <DropdownItem
                          href="/dashboard"
                          icon={<LayoutDashboard size={20} />}
                          text="Dashboard"
                        />
                        <DropdownItem
                          href="/my-listings"
                          icon={<List size={20} />}
                          text="Your Listings"
                        />
                        <DropdownItem
                          href="/favorites"
                          icon={<Heart size={20} />}
                          text="Favorites"
                        />
                        <DropdownItem
                          href="/history"
                          icon={<History size={20} />}
                          text="Transaction History"
                        />
                        <DropdownItem
                          href="/settings"
                          icon={<Settings size={20} />}
                          text="Settings"
                        />
                      </div>

                      <div className="border-t border-gray-100 mt-2 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-5 py-3 text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <LogOut size={20} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- PEŁNOEKRANOWY PANEL MOBILNY --- */}
      <div
        className={`fixed inset-0 z-[100] bg-white lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header Panelu */}
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <span className="text-2xl font-black tracking-widest uppercase text-black">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={32} className="text-black" />
            </button>
          </div>

          {/* Treść Menu */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
            {/* Linki nawigacyjne */}
            <nav className="flex flex-col gap-6 text-center w-full">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-3xl font-black uppercase tracking-tight transition-transform hover:scale-105 active:scale-95 ${
                    link.highlight ? "text-indigo-600" : "text-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* SELL ITEM - Zawsze widoczny */}
            <div className="w-full max-w-sm">
              <Link
                href="/add-listing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl font-black rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all text-center shadow-2xl uppercase flex items-center justify-center gap-3"
              >
                <PlusCircle size={28} strokeWidth={3} />
                SELL ITEM
              </Link>
            </div>

            {/* Sekcja Użytkownika / Logowania */}
            <div className="w-full max-w-sm mt-4">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleDemoLogin}
                    className="w-full py-4 border-2 border-black text-black text-lg font-bold rounded-2xl hover:bg-gray-50 transition-all uppercase"
                  >
                    LOGIN (DEMO)
                  </button>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 bg-black text-white text-lg font-bold rounded-2xl hover:bg-gray-900 transition-all text-center shadow-xl uppercase"
                  >
                    REGISTER
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 bg-black text-white text-lg font-bold rounded-2xl hover:bg-gray-900 transition-all text-center shadow-xl uppercase flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={24} />
                    DASHBOARD
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full py-4 text-red-600 font-bold flex items-center justify-center gap-2 border-2 border-red-600 bg-white rounded-2xl hover:bg-red-50 transition-colors uppercase"
                  >
                    <LogOut size={24} />
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helpers
function DropdownItem({
  href,
  icon,
  text,
  className = "",
}: {
  href: string;
  icon: any;
  text: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-5 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-black transition-colors ${className}`}
    >
      <span className="text-gray-400 group-hover:text-black">{icon}</span>
      {text}
    </Link>
  );
}
