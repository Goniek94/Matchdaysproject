"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import LoginModal from "./LoginModal";
import { authApi } from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import {
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  List,
  Heart,
  History,
  Trophy,
  ChevronDown,
  PlusCircle,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log("🔍 Checking auth status...");
      const response = await authApi.checkAuth();
      console.log("📡 Auth response:", response);

      if (response.success && response.data) {
        console.log("✅ User authenticated:", response.data);
        setIsLoggedIn(true);
        setUserData(response.data);
      } else {
        console.log("❌ User not authenticated");
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("❌ Auth check error:", error);
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
      setUserData(null);
      setIsProfileOpen(false);
      window.location.href = "/"; // Redirect to home
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b border-gray-200 transition-all duration-300 ${
        scrolled
          ? "py-4 bg-white/95 backdrop-blur-md shadow-sm"
          : "py-6 bg-white/95 backdrop-blur-md"
      }`}
    >
      {/* Kontener na pełną szerokość z większym paddingiem bocznym */}
      <div className="w-full px-8 md:px-16 flex items-center justify-between relative">
        {/* LEWA STRONA: Logo (Powiększone) */}
        <div className="flex-shrink-0 z-20">
          <Link
            href="/"
            className="text-2xl font-black tracking-widest uppercase text-black hover:opacity-70 transition-opacity"
          >
            MatchDays
          </Link>
        </div>

        {/* ŚRODEK: Nawigacja (Absolute Center) - Powiększona czcionka i odstępy */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <ul className="flex gap-10 items-center list-none font-bold text-base tracking-wide">
            <li>
              <Link
                href="/"
                className="nav-link hover:text-gray-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/auctions"
                className="nav-link hover:text-gray-600 transition-colors"
              >
                Auctions
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="nav-link hover:text-gray-600 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#ai-tools"
                className="nav-link hover:text-gray-600 transition-colors"
              >
                AI Tools
              </Link>
            </li>

            {isLoggedIn && (
              <li>
                <Link
                  href="/arena"
                  className="nav-link text-indigo-600 font-extrabold hover:text-indigo-800 transition-colors"
                >
                  Matchdays Arena
                </Link>
              </li>
            )}

            <li>
              <Link
                href="#contact"
                className="nav-link hover:text-gray-600 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* PRAWA STRONA: Akcje (Powiększone przyciski i ikony) */}
        <div className="flex items-center gap-2 md:gap-4 justify-end z-20">
          {/* Shopping Cart Icon - Always visible */}
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

          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={28} className="text-black" />
            ) : (
              <Menu size={28} className="text-black" />
            )}
          </button>

          {/* Desktop Actions */}
          {!isLoggedIn ? (
            <>
              <button
                onClick={handleLoginClick}
                className="hidden lg:block px-8 py-3 bg-white text-black border-2 border-black text-base font-bold rounded-lg hover:bg-black hover:text-white transition-all whitespace-nowrap"
              >
                Login
              </button>
              <button
                onClick={() => (window.location.href = "/register")}
                className="hidden lg:block px-8 py-3 bg-black text-white text-base font-bold rounded-lg hover:bg-gray-900 transition-all hover:shadow-lg whitespace-nowrap"
              >
                Register
              </button>
            </>
          ) : (
            <div className="hidden lg:flex items-center gap-6" ref={dropdownRef}>
              {/* Przycisk Sell Item - Większy */}
              <Link
                href="/add-listing"
                className="hidden md:flex items-center gap-2.5 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-bold text-base whitespace-nowrap"
              >
                <PlusCircle size={20} />
                <span>Sell Item</span>
              </Link>

              {/* Przycisk Profilu - Większy awatar i tekst */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group whitespace-nowrap"
              >
                {/* Większy awatar (w-10 h-10) */}
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <User size={20} />
                </div>
                <span className="font-bold text-base">Profile</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Przycisk Logout - Większy tekst */}
              <button
                onClick={handleLogout}
                className="text-base font-semibold text-gray-500 hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Logout
              </button>

              {/* DROPDOWN MENU - Powiększone */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-base font-bold text-gray-900">
                      {userData?.username || "User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {userData?.email || ""}
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
                      href="/arena"
                      icon={<Trophy size={20} />}
                      text="Matchdays Arena"
                      className="text-indigo-600 font-bold bg-indigo-50/50"
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

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <span className="text-xl font-black tracking-widest uppercase">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* User Info Section (if logged in) */}
            {isLoggedIn && userData && (
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {userData.username || "User"}
                    </p>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>
                <Link
                  href="/add-listing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-bold"
                >
                  <PlusCircle size={20} />
                  <span>Sell Item</span>
                </Link>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="p-6">
              <ul className="space-y-2">
                <MobileNavLink
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </MobileNavLink>
                <MobileNavLink
                  href="/auctions"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Auctions
                </MobileNavLink>
                <MobileNavLink
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </MobileNavLink>
                <MobileNavLink
                  href="#ai-tools"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Tools
                </MobileNavLink>
                {isLoggedIn && (
                  <MobileNavLink
                    href="/arena"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-indigo-600 font-extrabold"
                  >
                    Matchdays Arena
                  </MobileNavLink>
                )}
                <MobileNavLink
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </MobileNavLink>
              </ul>
            </nav>

            {/* User Menu (if logged in) */}
            {isLoggedIn && (
              <div className="px-6 pb-6">
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Your Account
                  </p>
                  <ul className="space-y-2">
                    <MobileNavLink
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<LayoutDashboard size={20} />}
                    >
                      Dashboard
                    </MobileNavLink>
                    <MobileNavLink
                      href="/my-listings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<List size={20} />}
                    >
                      Your Listings
                    </MobileNavLink>
                    <MobileNavLink
                      href="/favorites"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<Heart size={20} />}
                    >
                      Favorites
                    </MobileNavLink>
                    <MobileNavLink
                      href="/history"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<History size={20} />}
                    >
                      Transaction History
                    </MobileNavLink>
                    <MobileNavLink
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<Settings size={20} />}
                    >
                      Settings
                    </MobileNavLink>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {!isLoggedIn ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLoginClick();
                  }}
                  className="w-full px-6 py-3 bg-white text-black border-2 border-black text-base font-bold rounded-lg hover:bg-black hover:text-white transition-all"    
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = "/register";
                  }}
                  className="w-full px-6 py-3 bg-black text-white text-base font-bold rounded-lg hover:bg-gray-900 transition-all"
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-red-600 border-2 border-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all"
              >
                <LogOut size={20} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={checkAuthStatus}
      />
    </nav>
  );
}

// Helper component do dropdowna - również powiększony
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

// Mobile Navigation Link Component
function MobileNavLink({
  href,
  onClick,
  children,
  icon,
  className = "",
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
      >
        {icon && <span className="text-gray-400">{icon}</span>}
        {children}
      </Link>
    </li>
  );
}
