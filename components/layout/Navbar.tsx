"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertTriangle,
  Bell,
  Mail,
  Wallet,
} from "lucide-react";
import { useNotifications } from "@/lib/context/NotificationContext";
import { getWallet, type WalletSummary } from "@/lib/api/wallet";

export default function Navbar() {
  const router = useRouter();
  const { itemCount } = useCart();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  // Wallet balance shown next to the cart icon. Refetched periodically so
  // a bid hold / refund updates the chip without a full page reload. We
  // intentionally trust the backend's `balance` here — already net of
  // pending withdrawals + active bid holds.
  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(
    null,
  );
  useEffect(() => {
    if (!isAuthenticated) {
      setWalletSummary(null);
      return;
    }
    let cancelled = false;
    const load = () => {
      getWallet()
        .then((r) => {
          if (!cancelled) setWalletSummary(r.data ?? null);
        })
        .catch(() => {
          // Silent — keep last known value, or null on first failure.
        });
    };
    load();
    // 30s poll is cheap (backend cache is short anyway). Keeps the chip
    // current after a bid without needing a websocket on this surface.
    const tick = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(tick);
    };
  }, [isAuthenticated]);

  const formattedBalance = walletSummary
    ? Number(walletSummary.balance).toLocaleString("en-IE", {
        style: "currency",
        currency: walletSummary.currency || "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : null;

  // While the auth state is still being confirmed, never flash the
  // logged-out CTA over a session that's actually valid. We render the
  // logged-out variant only once the backend has explicitly answered.
  const showLoggedOut = !isAuthenticated && !authLoading;
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
    router.push("/");
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
    { name: "Market", href: "/auctions" },
    { name: "AI Tools", href: "/aitools" },
    { name: "Matchdays Arena", href: "/arena", highlight: true },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <nav
        className={`fixed top-0 w-full z-50 border-b border-gray-200 transition-all duration-300 ${
          scrolled ? "py-4 bg-white shadow-sm" : "py-6 bg-white"
        }`}
      >
        {/* Asymmetric padding — keep the logo away from the left edge (64px)
            but pull the right-side action cluster (SELL ITEM / Profile /
            Wallet / Cart) close to the right edge so it doesn't float in
            the middle of empty space on wide monitors. */}
        <div className="w-full pl-8 md:pl-16 pr-4 md:pr-6 flex items-center justify-between relative">
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
                        ? "font-extrabold hover:opacity-80 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
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


            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors z-50"
            >
              <Menu size={28} className="text-black" />
            </button>

            <div className="hidden lg:flex items-center gap-4">
              {showLoggedOut ? (
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
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/add-listing"
                    className="hidden md:flex items-center gap-2.5 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-bold text-base whitespace-nowrap uppercase"
                  >
                    <PlusCircle size={20} />
                    <span>Sell Item</span>
                  </Link>
                  <div className="flex items-center gap-1" ref={dropdownRef}>

                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group whitespace-nowrap"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                        <User size={20} />
                      </div>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center leading-none">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
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
                        <DropdownItem href="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem href="/wallet" icon={<Wallet size={20} />} text="Wallet" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem href="/my-listings" icon={<List size={20} />} text="Your Listings" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem href="/notifications" icon={<Bell size={20} />} text="Notifications" badge={unreadCount > 0 ? unreadCount : undefined} onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem href="/messages" icon={<MessageCircle size={20} />} text="Messages" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem href="/history" icon={<History size={20} />} text="Transaction History" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem href="/disputes" icon={<AlertTriangle size={20} />} text="Disputes & Reports" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem href="/contact" icon={<Mail size={20} />} text="Contact" onClick={() => setIsProfileOpen(false)} />
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
                  </div>{/* end dropdownRef */}

                {/* Action cluster — wallet + cart sit together as a single
                    visual unit (matched height, matched corners) so they
                    don't fight the Profile + SELL ITEM blocks for attention. */}
                <div className="flex items-center gap-1.5">
                  {formattedBalance !== null && (
                    <Link
                      href="/wallet"
                      title="Wallet — top up or withdraw"
                      className="hidden sm:inline-flex items-center gap-2 h-11 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-900 font-bold text-sm whitespace-nowrap"
                    >
                      <Wallet size={16} className="text-gray-500" />
                      {formattedBalance}
                    </Link>
                  )}

                  <Link
                    href="/cart"
                    title="Cart"
                    className="relative inline-flex items-center justify-center w-11 h-11 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ShoppingCart size={20} className="text-gray-700" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </div>

              </div>
              ) : null}
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
                    ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                    : "text-white/80 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {link.name}
                {link.highlight && (
                  <span className="ml-auto text-[10px] font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
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
                  href="/wallet"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base uppercase tracking-wide text-white/80 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
                >
                  <Wallet size={18} className="text-white/40" />
                  Wallet
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
            {showLoggedOut ? (
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
            ) : isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-3.5 text-red-500 font-bold flex items-center justify-center gap-2 hover:text-red-400 transition-colors uppercase text-sm tracking-wide"
              >
                <LogOut size={18} />
                LOGOUT
              </button>
            ) : null}
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
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  badge?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
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
