"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useWatchlist } from "@/lib/context/WatchlistContext";
import { LoginModal } from "@/components/auth";
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
  MessageCircle,
  Trophy,
  Bell,
} from "lucide-react";
import { useNotifications } from "@/lib/context/NotificationContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { count: watchlistCount } = useWatchlist();
  const { unreadCount } = useNotifications();
  const [scrolled, setScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    if (typeof window !== "undefined")
      window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Auctions", href: "/auctions" },
    { name: "AI Tools", href: "/aitools" },
    { name: "Matchdays Arena", href: "/arena", highlight: true },
  ];

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <nav
        className={`fixed top-0 w-full z-50 border-b border-gray-200 transition-all duration-300 ${
          scrolled ? "py-4 bg-white shadow-sm" : "py-6 bg-white"
        }`}
      >
        <div className="w-full px-8 md:px-16 flex items-center justify-between relative">
          <div className="flex-shrink-0 z-50">
            <Link
              href="/"
              className="text-2xl font-black tracking-widest uppercase text-black hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              MatchDays
            </Link>
          </div>

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

          <div className="flex items-center gap-2 md:gap-4 justify-end z-50">
            {isAuthenticated && (
              <Link
                href="/notifications"
                title="Notifications"
                className="relative p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors hidden lg:flex"
              >
                <Bell size={24} className="text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && (
              <Link
                href="/favorites"
                title="Favorites"
                className="relative p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors hidden lg:flex"
              >
                <Heart
                  size={24}
                  className={
                    watchlistCount > 0
                      ? "text-red-500 fill-red-500"
                      : "text-gray-700"
                  }
                />
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {watchlistCount > 99 ? "99+" : watchlistCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && (
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
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors z-50"
            >
              <Menu size={28} className="text-black" />
            </button>

            <div className="hidden lg:flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
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
                      className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-base font-bold text-gray-900">
                          {user?.username}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
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
                          href="/notifications"
                          icon={<Bell size={20} />}
                          text="Notifications"
                          badge={unreadCount > 0 ? unreadCount : undefined}
                        />
                        <DropdownItem
                          href="/messages"
                          icon={<MessageCircle size={20} />}
                          text="Messages"
                        />
                        <DropdownItem
                          href="/favorites"
                          icon={<Heart size={20} />}
                          text="Favorites"
                        />
                        <DropdownItem
                          href="/collection/mine"
                          icon={<Trophy size={20} />}
                          text="My Collection"
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

      {/* ── MOBILE MENU — dark + gold ── */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[99] bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full z-[100] lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-[#111111] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-white/30 uppercase mb-0.5">
                Navigation
              </p>
              <span className="text-lg font-black tracking-widest uppercase text-white">
                MatchDays
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* CTA przyciski na górze */}
          <div className="px-4 pt-5 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-white text-black text-sm font-black rounded-xl hover:bg-gray-100 active:scale-95 transition-all text-center uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg"
                >
                  <LayoutDashboard size={20} />
                  DASHBOARD
                </Link>
                <Link
                  href="/add-listing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-amber-400 text-black text-sm font-black rounded-xl hover:bg-amber-300 active:scale-95 transition-all text-center uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                >
                  <PlusCircle size={20} strokeWidth={3} />
                  SELL ITEM
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="w-full py-4 bg-amber-400 text-black text-sm font-black rounded-xl hover:bg-amber-300 active:scale-95 transition-all text-center uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
              >
                <PlusCircle size={20} strokeWidth={3} />
                SELL ITEM
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="mx-4 mt-5 border-t border-white/10" />

          {/* Nav links */}
          <nav className="flex flex-col px-3 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base uppercase tracking-wide transition-all active:scale-95 ${
                  link.highlight
                    ? "bg-amber-400/10 text-amber-400 hover:bg-amber-400/20"
                    : "text-white/80 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {link.name}
                {link.highlight && (
                  <span className="ml-auto text-[10px] font-black tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    NEW
                  </span>
                )}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <div className="mx-1 my-2 border-t border-white/10" />
                <Link
                  href="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base uppercase tracking-wide text-white/80 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
                >
                  <Heart
                    size={18}
                    className={
                      watchlistCount > 0
                        ? "text-amber-400 fill-amber-400"
                        : "text-white/40"
                    }
                  />
                  Favorites
                  {watchlistCount > 0 && (
                    <span className="ml-auto bg-amber-400 text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                      {watchlistCount > 99 ? "99+" : watchlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/my-listings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base uppercase tracking-wide text-white/80 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
                >
                  <List size={18} className="text-white/40" />
                  My Listings
                </Link>
                <Link
                  href="/history"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base uppercase tracking-wide text-white/80 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
                >
                  <History size={18} className="text-white/40" />
                  Transactions
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base uppercase tracking-wide text-white/80 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
                >
                  <Settings size={18} className="text-white/40" />
                  Settings
                </Link>
              </>
            )}
          </nav>

          {/* Auth dół */}
          <div className="px-4 pb-8 mt-auto flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 border border-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/5 transition-all uppercase tracking-wide"
                >
                  LOGIN
                </button>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3.5 bg-white text-black text-sm font-black rounded-xl hover:bg-gray-100 transition-all text-center uppercase tracking-wide"
                >
                  REGISTER
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-3.5 text-red-500 font-bold flex items-center justify-center gap-2 hover:text-red-400 transition-colors uppercase text-sm tracking-wide"
              >
                <LogOut size={18} />
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

function DropdownItem({
  href,
  icon,
  text,
  badge,
  className = "",
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  badge?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-5 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-black transition-colors ${className}`}
    >
      <span className="text-gray-400 group-hover:text-black">{icon}</span>
      {text}
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
