"use client";

import { useState } from "react";
import {
  Trophy,
  Gamepad2,
  Flag,
  Coins,
  ArrowRight,
  Crown,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UltimateGamificationArenaV4() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  // --- DANE: TRYBY GRY (Górne Karty) ---
  const games = [
    {
      id: 1,
      icon: Gamepad2,
      title: "Tactical Arcade",
      description: "Test your ball knowledge in Tic-Tac-Toe & Missing 11.",
      gradient: "from-blue-500 via-indigo-600 to-violet-600",
      glowColor: "shadow-indigo-500/50",
      backText: "Name 3 players who played for Real & Juve...",
      actionText: "Play Now",
      image:
        "https://images.unsplash.com/photo-1628779238039-60271e2b3d63?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 2,
      icon: Trophy,
      title: "Global Rankings",
      description: "Climb the league table. Win unique rewards.",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      glowColor: "shadow-orange-500/50",
      backText: "Compete in divisions: from 'Sunday League' to 'Champions'...",
      actionText: "View Table",
      image:
        "https://images.unsplash.com/photo-1562552058-a309735b00fb?q=80&w=1374&auto=format&fit=crop",
    },
    {
      id: 3,
      icon: Flag,
      title: "Battle of Nations",
      description: "Join your national team. Poland or Germany?",
      gradient: "from-red-500 via-pink-500 to-rose-600",
      glowColor: "shadow-red-500/50",
      backText: "The winning nation gets a 'Free Shipping Day'...",
      actionText: "Pick Your Flag",
      image:
        "https://images.unsplash.com/photo-1619768762607-2764007c9023?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 4,
      icon: Coins,
      title: "Locker Room Rewards",
      description: "Convert MatchPoints into discounts or boosts.",
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      glowColor: "shadow-emerald-500/50",
      backText: "1000 Pts = Free Shipping. 5000 Pts = Mystery Shirt Box...",
      actionText: "Spend Points",
      image:
        "https://images.unsplash.com/photo-1616848564737-568949479901?q=80&w=1470&auto=format&fit=crop",
    },
  ];

  // --- DANE: TURNIEJE (Dolna Sekcja) ---
  const tournaments = [
    {
      id: 1,
      title: "National Leagues",
      subtitle: "Fight for Your Country",
      description:
        "Compete in your national division. Top players qualify for playoffs.",
      gradient: "from-blue-600 via-indigo-700 to-purple-800",
      icon: Flag,
      image:
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1374&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "European Cups",
      subtitle: "Continental Glory",
      description:
        "Winners from each country face off. Champions League format.",
      gradient: "from-violet-600 via-purple-700 to-fuchsia-800",
      icon: Trophy,
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Predict & Win",
      subtitle: "Real Match Outcomes",
      description:
        "Bet your points on actual match results. Triple your stake.",
      gradient: "from-orange-600 via-red-700 to-pink-800",
      icon: Target,
      image:
        "https://images.unsplash.com/photo-1556637103-360e22250a93?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Grand Finals",
      subtitle: "The Ultimate Showdown",
      description: "Monthly mega-tournament. 10,000€ prize pool.",
      gradient: "from-yellow-500 via-amber-600 to-orange-700",
      icon: Crown,
      image:
        "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1374&auto=format&fit=crop",
    },
  ];

  // --- DANE DO PASKA INFORMACYJNEGO (TICKER) ---
  const tickerItems = [
    { text: "NEW TOURNAMENT LIVE", highlight: true },
    { text: "JACKPOT: 10,000 COINS", color: "text-yellow-400" },
    { text: "TOP PLAYER: ALEX_PL (2400 PTS)" },
    { text: "SEASON ENDS IN: 2 DAYS" },
  ];

  // --- ANIMACJE ---
  const headerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const headerItem = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  const gridContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };
  const heavyDropVariant = {
    hidden: {
      y: -200,
      opacity: 0,
      scale: 1.4,
      rotateX: 20,
      filter: "blur(8px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { type: "spring", mass: 1.5, stiffness: 400, damping: 25 },
    },
  };

  return (
    <section className="relative py-24 px-4 md:px-8 bg-black min-h-screen overflow-hidden perspective-2000">
      {/* TŁO: STADION */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070&auto=format&fit=crop"
          alt="Stadium Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* HEADER (ZAPĘTLONY RUCH) */}
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            variants={headerItem}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm shadow-xl"
          >
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              Live Season 4
            </span>
          </motion.div>

          <motion.h2
            variants={headerItem}
            animate={{ x: ["0%", "2%", "-1%", "0%"] }}
            transition={{
              duration: 12,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl"
          >
            Enter The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Battlefield
            </span>
          </motion.h2>
        </motion.div>

        {/* GÓRNE KARTY (HEAVY DROP) */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {games.map((game) => {
            const Icon = game.icon;
            const isFlipped = flippedCard === game.id;
            const isHovered = hoveredCard === game.id;

            return (
              <motion.div
                key={game.id}
                variants={heavyDropVariant}
                onMouseEnter={() => setHoveredCard(game.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setFlippedCard(isFlipped ? null : game.id)}
                className="group relative h-[420px] cursor-pointer perspective-1000"
              >
                <motion.div
                  className="w-full h-full relative transition-all duration-500"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className={`absolute inset-0 rounded-3xl border overflow-hidden backdrop-blur-xl transition-colors duration-300 ${
                      isHovered
                        ? "border-white/30 " + game.glowColor
                        : "border-white/10"
                    }`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 ${
                          isHovered ? "opacity-90" : "opacity-100"
                        }`}
                      ></div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay`}
                      ></div>
                    </div>

                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                      <div>
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                            isHovered
                              ? `bg-gradient-to-br ${game.gradient} scale-110 shadow-lg text-white`
                              : "bg-white/10 text-gray-300"
                          }`}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {game.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed drop-shadow-md">
                          {game.description}
                        </p>
                      </div>
                      <div className="flex items-center text-xs font-bold text-white/70 uppercase tracking-widest group-hover:text-white transition-colors">
                        Flip Card{" "}
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 p-8 rounded-3xl flex flex-col items-center justify-center text-center bg-gradient-to-br ${game.gradient} border-2 border-white/20`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Target className="w-10 h-10 text-white mb-4 animate-pulse" />
                    <p className="text-white font-semibold text-sm mb-6">
                      {game.backText}
                    </p>
                    <button className="px-5 py-2 bg-black/50 hover:bg-black/70 rounded-lg text-white text-xs font-bold uppercase transition-colors shadow-lg">
                      {game.actionText}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* --- LIVE TICKER (PĘTLA TV) --- */}
        <div className="border-y border-white/10 bg-black/60 backdrop-blur-md py-4 mb-24 overflow-hidden relative flex">
          {/* KLUCZ DO SUKCESU: 
             1. Kontener o szerokości wystarczającej na dwie kopie danych.
             2. Animacja przesuwająca się tylko o -50% (połowę długości).
             3. Dzięki temu, gdy pierwsza połowa zniknie, druga jest dokładnie na jej miejscu, a pętla resetuje się niezauważalnie.
          */}
          <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: "-50%" }}
            transition={{
              ease: "linear",
              duration: 20, // Dostosuj prędkość (im więcej tym wolniej)
              repeat: Infinity,
            }}
          >
            {/* Renderujemy zawartość DWUKROTNIE, aby zapewnić ciągłość */}
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                {/* Kropka "LIVE" jeśli highlight jest true */}
                {item.highlight && (
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                )}

                <span
                  className={`text-xs font-black uppercase tracking-[0.2em] ${
                    item.color || "text-white/80"
                  }`}
                >
                  {item.text}
                </span>

                {/* Separator TV Style */}
                <span className="text-white/10 text-lg ml-12">///</span>
              </div>
            ))}
          </motion.div>

          {/* Winieta po bokach dla efektu głębi */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* TURNIEJE (DOLNA SEKCJA) */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic drop-shadow-lg">
              Active Championships
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
            {tournaments.map((tournament, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div
                  key={tournament.id}
                  initial={{
                    opacity: 0,
                    x: isLeft ? -100 : 100,
                    filter: "blur(5px)",
                  }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.8,
                    delay: idx * 0.1,
                  }}
                  className="group relative h-full min-h-[220px] rounded-3xl overflow-hidden bg-black/40 border border-white/10 hover:border-white/30 transition-all duration-300 shadow-2xl"
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src={tournament.image}
                      alt={tournament.title}
                      className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${tournament.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500 z-1 mix-blend-overlay`}
                  ></div>

                  <div className="p-8 flex items-start gap-6 relative z-10 flex-col sm:flex-row">
                    <div className="shrink-0 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      <tournament.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-wide mb-1 drop-shadow-md">
                        {tournament.title}
                      </h4>
                      <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-3 font-mono">
                        {tournament.subtitle}
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 drop-shadow-sm">
                        {tournament.description}
                      </p>
                      <button className="text-white text-xs font-bold uppercase border-b border-white/30 pb-1 hover:border-white transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                        Join League <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
