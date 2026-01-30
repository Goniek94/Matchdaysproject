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
  Trophy // <--- DODAŁEM BRAKUJĄCY IMPORT TUTAJ
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <nav
      className={`fixed top-0 w-full z-50 border-b border-gray-200 transition-all duration-300 ${
        scrolled
          ? "py-4 bg-white/95 backdrop-blur-md shadow-sm"
          : "py-6 bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="w-full px-8 md:px-16 flex items-center justify-between relative">
        
        {/* LEWA STRONA: Logo (Twoje oryginalne) */}
        <div className="flex-shrink-0 z-50">
          <Link
            href="/"
            className="text-2xl font-black tracking-widest uppercase text-black hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            MatchDays
          </Link>
        </div>

        {/* ŚRODEK: Nawigacja Desktop (Przywrócony Twój styl Absolute Center) */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <ul className="flex gap-10 items-center list-none font-bold text-base tracking-wide">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`nav-link transition-colors ${
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

          {/* Hamburger Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors z-50"
          >
            {isMobileMenuOpen ? (
              <X size={28} className="text-black" />
            ) : (
              <Menu size={28} className="text-black" />
            )}
          </button>

          {/* Desktop Buttons (Login/Register lub Profil) */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={handleDemoLogin}
                  className="px-8 py-3 bg-white text-black border-2 border-black text-base font-bold rounded-lg hover:bg-black hover:text-white transition-all whitespace-nowrap"
                >
                  Login
                </button>
                <Link
                   href="/register"
                  className="px-8 py-3 bg-black text-white text-base font-bold rounded-lg hover:bg-gray-900 transition-all hover:shadow-lg whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-6" ref={dropdownRef}>
                {/* Sell Item */}
                <Link
                  href="/add-listing"
                  className="hidden md:flex items-center gap-2.5 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-bold text-base whitespace-nowrap"
                >
                  <PlusCircle size={20} />
                  <span>Sell Item</span>
                </Link>

                {/* Profil Dropdown Trigger */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group whitespace-nowrap"
                >
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
                      <DropdownItem href="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" />
                      <DropdownItem href="/my-listings" icon={<List size={20} />} text="Your Listings" />
                      <DropdownItem href="/favorites" icon={<Heart size={20} />} text="Favorites" />
                      <DropdownItem href="/history" icon={<History size={20} />} text="Transaction History" />
                      <DropdownItem href="/arena" icon={<Trophy size={20} />} text="Matchdays Arena" className="text-indigo-600 font-bold bg-indigo-50/50" />
                      <DropdownItem href="/settings" icon={<Settings size={20} />} text="Settings" />
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

      {/* --- MOBILE MENU OVERLAY (ZAJEBISTE - TO NOWE) --- */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-40 lg:hidden transition-all duration-500 ease-in-out flex flex-col justify-center items-center ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto translate-y-0" 
            : "opacity-0 pointer-events-none -translate-y-10"
        }`}
      >
        <div className="w-full max-w-md px-6 flex flex-col gap-6">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-3xl md:text-4xl font-black uppercase tracking-tighter py-2 hover:scale-105 transition-transform ${
                    link.highlight ? "text-indigo-600" : "text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="w-20 h-1 bg-gray-100 rounded-full mx-auto my-4"></div>

          {/* Mobile Auth Actions */}
          <div className="flex flex-col gap-4 items-center w-full">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-4 bg-white border-2 border-black text-black text-xl font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  LOGIN (DEMO)
                </button>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-black text-white text-xl font-bold rounded-2xl hover:bg-gray-900 transition-colors text-center shadow-xl"
                >
                  REGISTER
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2 animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                    <User size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg text-gray-900">Demo User</p>
                    <p className="text-sm text-gray-500">Logged In</p>
                  </div>
                </div>

                <Link
                  href="/add-listing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <PlusCircle size={24} />
                  SELL ITEM
                </Link>

                <div className="grid grid-cols-2 gap-3 w-full">
                    <MobileIconLink href="/dashboard" icon={<LayoutDashboard/>} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)}/>
                    <MobileIconLink href="/my-listings" icon={<List/>} label="Listings" onClick={() => setIsMobileMenuOpen(false)}/>
                    <MobileIconLink href="/favorites" icon={<Heart/>} label="Favorites" onClick={() => setIsMobileMenuOpen(false)}/>
                    <MobileIconLink href="/settings" icon={<Settings/>} label="Settings" onClick={() => setIsMobileMenuOpen(false)}/>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-4 text-red-600 font-bold flex items-center gap-2 hover:bg-red-50 px-6 py-2 rounded-full transition-colors"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helpers
function DropdownItem({ href, icon, text, className = "" }: { href: string; icon: any; text: string; className?: string }) {
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

function MobileIconLink({ href, icon, label, onClick }: { href: string; icon: any; label: string; onClick: () => void }) {
    return (
        <Link 
            href={href} 
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
            <span className="text-gray-600">{icon}</span>
            <span className="text-xs font-bold text-gray-800">{label}</span>
        </Link>
    )
}