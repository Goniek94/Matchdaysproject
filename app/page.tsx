"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PricingSection from "@/components/PricingSection";
import AuctionCard from "@/components/AuctionCard";
import AIToolsSection from "@/components/AIToolsSection";
import Footer from "@/components/Footer";
import { mockAuctions } from "@/lib/mockData";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Custom hook for intersection observer animation
function useSlideInAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated Section Header Component
function SectionHeader({
  emoji,
  title,
  subtitle,
  linkHref,
  linkText,
  linkColor,
  delay = 0,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  linkHref: string;
  linkText: string;
  linkColor: string;
  delay?: number;
}) {
  const { ref, isVisible } = useSlideInAnimation();

  return (
    <div ref={ref} className="flex items-end justify-between mb-8">
      <div
        className={`transform transition-all duration-1000 ease-out ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black flex items-center gap-3 uppercase">
          <span className="text-4xl md:text-5xl">{emoji}</span>
          <span>{title}</span>
        </h2>
        <p
          className={`text-gray-500 mt-2 text-lg transform transition-all duration-1000 ease-out ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
          style={{ transitionDelay: `${delay + 150}ms` }}
        >
          {subtitle}
        </p>
      </div>
      <Link
        href={linkHref}
        className={`hidden md:block text-sm font-bold border-b-2 border-black pb-0.5 ${linkColor} transition-all duration-300 transform ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
        }`}
        style={{ transitionDelay: `${delay + 200}ms` }}
      >
        {linkText}
      </Link>
    </div>
  );
}

export default function HomePage() {
  // Dzielimy aukcje na 3 grupy po 3 sztuki
  const hotAuctions = mockAuctions.slice(0, 3);
  const endingAuctions = mockAuctions.slice(3, 6);
  const rareAuctions = mockAuctions.slice(6, 9);

  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* --- MARKETPLACE SECTION (3 RZĘDY) --- */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Tło (Blobs) */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-0 w-96 h-96 bg-red-100/40 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute bottom-40 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl mix-blend-multiply"></div>
        </div>

        <div className="w-full max-w-7xl mx-auto relative z-10 space-y-20">
          {/* 1. RZĄD: HOT OFFERS */}
          <div>
            <SectionHeader
              emoji="🔥"
              title="TRENDING NOW"
              subtitle="Most active auctions right now."
              linkHref="/auctions?filter=hot"
              linkText="View All Hot →"
              linkColor="hover:text-red-600 hover:border-red-600"
              delay={0}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotAuctions.map((auction, index) => (
                <div
                  key={auction.id}
                  className="transform transition-all duration-700 ease-out"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <AuctionCard
                    auction={auction}
                    badge={{
                      text: "HOT",
                      colors: "bg-red-500 text-white shadow-red-500/40",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 2. RZĄD: ENDING SOON */}
          <div>
            <SectionHeader
              emoji="⏳"
              title="ENDING SOON"
              subtitle="Last chance to bid. Don't miss out."
              linkHref="/auctions?filter=ending"
              linkText="View Ending Soon →"
              linkColor="hover:text-blue-600 hover:border-blue-600"
              delay={0}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {endingAuctions.map((auction, index) => (
                <div
                  key={auction.id}
                  className="transform transition-all duration-700 ease-out"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <AuctionCard
                    auction={auction}
                    badge={{
                      text: "LAST CALL",
                      colors: "bg-orange-500 text-white shadow-orange-500/40",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. RZĄD: HIDDEN GEMS */}
          <div>
            <SectionHeader
              emoji="💎"
              title="HIDDEN GEMS"
              subtitle="Rare finds and collector's choices."
              linkHref="/auctions?filter=rare"
              linkText="View Rare →"
              linkColor="hover:text-purple-600 hover:border-purple-600"
              delay={0}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rareAuctions.map((auction, index) => (
                <div
                  key={auction.id}
                  className="transform transition-all duration-700 ease-out"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <AuctionCard
                    auction={auction}
                    badge={{
                      text: "RARE",
                      colors: "bg-purple-600 text-white shadow-purple-600/40",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Wielki przycisk na dole */}
          <div className="text-center pt-8">
            <Link
              href="/auctions"
              className="inline-block px-12 py-5 bg-black text-white font-bold text-xl rounded-full hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-900"
            >
              Explore All 2,450+ Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <AIToolsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
