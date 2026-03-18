"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Matchdays",
      subtitle: "The Sports Collectibles Marketplace",
      highlight: "BUY. SELL. COLLECT. REPEAT.",
      description:
        "The home for authentic sports memorabilia. Jerseys, kits, signed items and rare collectibles from football, basketball, hockey, motorsport and beyond — all in one place.",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Start Exploring",
      ctaLink: "/auctions",
      color: "from-red-600 to-rose-700",
    },
    {
      id: 2,
      title: "Bid. Win. Own.",
      subtitle: "Live Auctions & Buy Now",
      highlight: "RARE ITEMS. REAL VALUE.",
      description:
        "Compete in live auctions or grab items instantly at fixed prices. From match-worn shirts to signed memorabilia — every listing is verified and every deal is protected.",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Browse Auctions",
      ctaLink: "/auctions",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 3,
      title: "AI-Powered",
      subtitle: "Smart Collecting, Smarter Selling",
      highlight: "VERIFIED. VALUED. TRUSTED.",
      description:
        "Instant authenticity checks. AI-generated descriptions. Real-time market valuations. Buy and sell with total confidence",
      image:
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Explore AI Tools",
      ctaLink: "/aitools",
      color: "from-purple-600 to-pink-600",
    },
    {
      id: 4,
      title: "Sell Smarter",
      subtitle: "List, Search & Sell Across Europe",
      highlight: "YOUR COLLECTION. YOUR PRICE.",
      description:
        "List your items in minutes, search thousands of verified collectibles and reach buyers across the entire European Union. No borders, no hidden fees — just sport, passion and fair deals.",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Start Selling",
      ctaLink: "/add-listing",
      color: "from-green-600 to-emerald-600",
    },
    {
      id: 5,
      title: "Play & Win",
      subtitle: "Matchdays Arena",
      highlight: "YOUR KNOWLEDGE PAYS OFF.",
      description:
        "More than a marketplace — it's a community. Predict match outcomes, challenge other collectors, climb the leaderboard and win exclusive prizes. Sport is better together.",
      image: "/images/arena.png",
      ctaText: "Enter the Arena",
      ctaLink: "/arena",
      color: "from-indigo-500 to-blue-600",
    },
    {
      id: 6,
      title: "Zero Fakes.",
      subtitle: "Buyer Protection Guaranteed",
      highlight: "100% AUTHENTIC OR MONEY BACK.",
      description:
        "Every item is verified before it reaches you. Secure payments, insured EU-wide shipping and a full buyer protection policy. Shop with confidence — we've got you covered.",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2500&auto=format&fit=crop",
      ctaText: "How It Works",
      ctaLink: "/auctions",
      color: "from-blue-600 to-indigo-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide(
      (prev) => (prev + newDirection + slides.length) % slides.length,
    );
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.2,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 8, ease: "linear" as const },
      },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    }),
  };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const textItemVariants = {
    hidden: { y: 50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 10 },
    },
  };

  return (
    /*
     * ZMIANY MOBILE:
     * - h-[85vh] zamiast 70vh — więcej miejsca na treść
     * - min-h-[580px] — zabezpieczenie przed zbyt małą wysokością
     * - pb-20 — padding na dole dla kropek, żeby nie nachodziły na CTA
     */
    <section className="relative h-[85vh] min-h-[580px] md:h-[75vh] w-full overflow-hidden bg-black">
      {/* TŁO */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants as any}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* TREŚĆ — pb-20 robi miejsce dla kropek na mobile */}
      <div className="container-max relative z-20 h-full flex flex-col justify-center px-6 md:px-12 items-center text-center pb-20 md:pb-0">
        <motion.div
          key={currentSlide}
          variants={textContainerVariants as any}
          initial="hidden"
          animate="show"
          className="max-w-4xl w-full"
        >
          {/* Subtitle / Badge */}
          <motion.div
            variants={textItemVariants as any}
            className="flex items-center justify-center gap-3 mb-4 md:mb-6"
          >
            <span
              className={`h-0.5 w-8 md:w-12 bg-gradient-to-r ${slides[currentSlide].color}`}
            />
            <span className="text-white/80 uppercase tracking-[0.2em] text-xs md:text-sm font-medium">
              {slides[currentSlide].subtitle}
            </span>
            <span
              className={`h-0.5 w-8 md:w-12 bg-gradient-to-r ${slides[currentSlide].color}`}
            />
          </motion.div>

          {/* Tytuł — POPRAWKA: text-5xl na mobile zamiast text-6xl */}
          <motion.h1
            variants={textItemVariants as any}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tight mb-3 md:mb-4"
          >
            {slides[currentSlide].title}
          </motion.h1>

          {/* Highlight */}
          <motion.div
            variants={textItemVariants as any}
            className="overflow-hidden mb-5 md:mb-8"
          >
            <h2
              className={`text-2xl sm:text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${slides[currentSlide].color} italic tracking-tighter`}
            >
              {slides[currentSlide].highlight}
            </h2>
          </motion.div>

          {/* Opis — POPRAWKA: text-base na mobile, ukryty na bardzo małych (opcjonalnie) */}
          <motion.p
            variants={textItemVariants as any}
            className="text-base sm:text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-light"
          >
            {slides[currentSlide].description}
          </motion.p>

          {/* CTA — POPRAWKA: mniejszy padding na mobile */}
          <motion.div variants={textItemVariants as any}>
            <Link
              href={slides[currentSlide].ctaLink}
              className="group relative inline-flex items-center gap-2 md:gap-3 px-7 py-4 md:px-10 md:py-5 bg-white text-black font-bold text-base md:text-xl rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              <span className="relative z-10">
                {slides[currentSlide].ctaText}
              </span>
              <div className="relative z-10 bg-black text-white rounded-full p-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowRight size={18} />
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* STRZAŁKI (Desktop) */}
      <div className="absolute bottom-10 right-10 z-30 hidden md:flex gap-4">
        <button
          onClick={() => paginate(-1)}
          className="w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group"
        >
          <ChevronLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
        <button
          onClick={() => paginate(1)}
          className="w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group"
        >
          <ChevronRight
            size={24}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* PASEK POSTĘPU + KROPKI */}
      {/*
       * POPRAWKA MOBILE:
       * - bottom-5 zamiast bottom-10 — bliżej dolnej krawędzi ale nie nachodzy na CTA (bo CTA ma pb-20)
       * - left-0 right-0 + justify-center — wyśrodkowane na mobile
       * - Na desktop: justify-start, left-10, bottom-10 jak wcześniej
       */}
      <div className="absolute bottom-5 left-0 right-0 md:bottom-10 md:left-10 md:right-auto z-30 flex items-center justify-center md:justify-start gap-6">
        {/* Pasek postępu (Desktop) */}
        <div className="hidden md:flex items-center gap-3 text-white/50 text-sm font-mono">
          <span>0{currentSlide + 1}</span>
          <div className="w-32 h-[2px] bg-white/20 relative overflow-hidden rounded-full">
            <motion.div
              key={currentSlide}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute top-0 left-0 h-full bg-white"
            />
          </div>
          <span>0{slides.length}</span>
        </div>

        {/* Kropki (Mobile) */}
        <div className="flex md:hidden gap-2 items-center">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
