"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    // SLAJD 1: GŁÓWNY (Ogólny)
    {
      id: 1,
      title: "Wear the Moment",
      subtitle: "The History of Football",
      highlight: "LEGENDS ARE ETERNAL",
      description:
        "Don't just watch the history. Wear it. From the mud of Sunday League to the lights of the Champions League final. Every shirt tells a story.",
      image:
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Start Your Collection",
      ctaLink: "/auctions",
      color: "from-red-600 to-rose-700",
    },
    // SLAJD 2: AUTENTYCZNOŚĆ
    {
      id: 2,
      title: "Zero Fakes.",
      subtitle: "Guaranteed Authenticity",
      highlight: "VERIFIED BY EXPERTS",
      description:
        "In a world full of replicas, we stand for the truth. Our AI-powered verification combined with human expertise ensures 100% authenticity. Or your money back.",
      image:
        "https://images.unsplash.com/photo-1577212017184-80cc0da11395?q=80&w=2500&auto=format&fit=crop",
      ctaText: "How We Verify",
      ctaLink: "#verification",
      color: "from-blue-600 to-indigo-600",
    },
    // --- NOWY SLAJD 3: GRYWALIZACJA (PLAY & WIN) ---
    {
      id: 3,
      title: "Play & Win",
      subtitle: "The MatchDays League",
      highlight: "YOUR KNOWLEDGE PAYS OFF",
      description:
        "Predict scores, challenge the community, and win VIP tickets or rare kits. Turn your football IQ into real rewards on our platform.",
      // Zdjęcie: Emocje, radość, trofeum
      image:
        "https://images.unsplash.com/photo-1516637090013-59d4239e957f?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Enter the Arena",
      ctaLink: "/games",
      color: "from-emerald-500 to-teal-500",
    },
    // SLAJD 4: RARE ITEMS
    {
      id: 4,
      title: "The Holy Grails",
      subtitle: "Match Worn & Rare Finds",
      highlight: "FOR THE ELITE",
      description:
        "Looking for that 1998 Zidane jersey? Or a signed Messi shirt? Discover our curated selection of 'Match Worn' kits that belong in a museum.",
      image:
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Browse Rare Items",
      ctaLink: "/category/rare",
      color: "from-amber-400 to-yellow-600",
    },
    // --- NOWY SLAJD 5: EU COVERAGE (UE & WYSYŁKA) ---
    {
      id: 5,
      title: "No Borders",
      subtitle: "Fast EU Shipping",
      highlight: "ZERO CUSTOMS FEES",
      description:
        "We operate across the entire European Union. From Warsaw to Madrid. Fast, insured shipping with absolutely no hidden customs fees.",
      // Zdjęcie: Mapa, podróż, stadion z zewnątrz
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Shipping Info",
      ctaLink: "/shipping",
      color: "from-indigo-500 to-purple-600",
    },
    // SLAJD 6: SPOŁECZNOŚĆ
    {
      id: 6,
      title: "Join the Club",
      subtitle: "Global Community",
      highlight: "MORE THAN A MARKETPLACE",
      description:
        "MatchDays isn't just a store. It's a locker room for collectors. Share your finds, rate sellers, and discuss transfers. Welcome home.",
      image:
        "https://images.unsplash.com/photo-1504159506876-7949e351d6db?q=80&w=2500&auto=format&fit=crop",
      ctaText: "Join Now",
      ctaLink: "/register",
      color: "from-pink-600 to-rose-600",
    },
  ];

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000); // 8 sekund na slajd
    return () => clearInterval(timer);
  }, [currentSlide]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide(
      (prev) => (prev + newDirection + slides.length) % slides.length
    );
  };

  // Animacje (Warianty Framer Motion)
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
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 8, ease: "linear" }, // Ken Burns Effect
      },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
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
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  return (
    <section className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-black">
      {/* 1. WARSTWA TŁA (ZDJĘCIA) */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          {/* Obraz */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />

          {/* Overlay: Gradient kinowy */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* 2. WARSTWA TREŚCI */}
      <div className="container-max relative z-20 h-full flex flex-col justify-center px-6 md:px-12 items-center text-center">
        <motion.div
          key={currentSlide}
          variants={textContainerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Subtitle / Badge */}
          <motion.div
            variants={textItemVariants}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span
              className={`h-0.5 w-12 bg-gradient-to-r ${slides[currentSlide].color}`}
            />
            <span className="text-white/80 uppercase tracking-[0.2em] text-sm font-medium">
              {slides[currentSlide].subtitle}
            </span>
            <span
              className={`h-0.5 w-12 bg-gradient-to-r ${slides[currentSlide].color}`}
            />
          </motion.div>

          {/* Główny Tytuł */}
          <motion.h1
            variants={textItemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tight mb-4"
          >
            {slides[currentSlide].title}
          </motion.h1>

          {/* Highlight Text */}
          <motion.div
            variants={textItemVariants}
            className="overflow-hidden mb-8"
          >
            <h2
              className={`text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${slides[currentSlide].color} italic tracking-tighter`}
            >
              {slides[currentSlide].highlight}
            </h2>
          </motion.div>

          {/* Opis */}
          <motion.p
            variants={textItemVariants}
            className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            {slides[currentSlide].description}
          </motion.p>

          {/* Przycisk CTA */}
          <motion.div variants={textItemVariants}>
            <Link
              href={slides[currentSlide].ctaLink}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold text-xl rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              <span className="relative z-10">
                {slides[currentSlide].ctaText}
              </span>
              <div className="relative z-10 bg-black text-white rounded-full p-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowRight size={20} />
              </div>
              {/* Efekt hover tła przycisku */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* 3. NAWIGACJA I KONTROLKI */}

      {/* Strzałki (Desktop) */}
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

      {/* Pasek postępu i Kropki */}
      <div className="absolute bottom-10 left-6 md:left-10 z-30 flex items-center gap-6">
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

        {/* Kropki (Mobile only) */}
        <div className="flex md:hidden gap-2">
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
