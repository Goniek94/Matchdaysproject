"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Trophy,
  Target, // Typer
  Users, // Missing 11
  Globe2, // Mundial
  Flag, // National Leagues
  ChevronRight,
  Timer,
  ArrowUpRight,
  Flame,
  LayoutGrid,
  Crown,
} from "lucide-react";

export default function ArenaPage() {
  // --- GŁÓWNY FEATURE: MUNDIAL / BIG TOURNAMENT ---
  const mainEvent = {
    title: "Road to Mundial 2026",
    subtitle: "Global Tournament • Qualifiers Phase",
    description:
      "Predict the outcomes of the qualifying rounds. Top 10 players win a trip to the finals in USA.",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop",
    prize: "VIP Trip + $10k",
    endsIn: "Season Ends in 24 Days",
  };

  // --- GRY (TWOJE WYMAGANIA) ---
  const games = [
    {
      id: 1,
      title: "Missing 11",
      subtitle: "Daily Challenge",
      description:
        "Can you name the starting XI from the 2005 CL Final? You have 3 minutes.",
      prize: "500 Coins",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
      icon: Users,
      color: "text-blue-400",
      border: "border-blue-500/30",
      gradient: "from-blue-500/20 to-transparent",
      action: "Start Guessing",
    },
    {
      id: 2,
      title: "Football Bingo",
      subtitle: "Live Matchday",
      description:
        "Watch the match. Mark events as they happen (VAR, Red Card, Bicycle Kick).",
      prize: "Mystery Box",
      image:
        "https://images.unsplash.com/photo-1552318415-cc98d2bca932?q=80&w=800&auto=format&fit=crop",
      icon: LayoutGrid, // Ikona dla Bingo
      color: "text-green-400",
      border: "border-green-500/30",
      gradient: "from-green-500/20 to-transparent",
      action: "Get Ticket",
    },
    {
      id: 3,
      title: "The Typer",
      subtitle: "Weekly Predictor",
      description:
        "Predict correct scores for 5 top European matches. 5/5 wins the jackpot.",
      prize: "25,000 Coins",
      image:
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop",
      icon: Target,
      color: "text-yellow-400",
      border: "border-yellow-500/30",
      gradient: "from-yellow-500/20 to-transparent",
      action: "Place Picks",
    },
    {
      id: 4,
      title: "National Leagues",
      subtitle: "Ranked Ladder",
      description:
        "Compete locally. Prove you are the best expert in Premier League or La Liga.",
      prize: "Exclusive Badge",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
      icon: Flag,
      color: "text-purple-400",
      border: "border-purple-500/30",
      gradient: "from-purple-500/20 to-transparent",
      action: "Join League",
    },
  ];

  // --- RANKING ---
  const leaderboard = [
    { rank: 1, user: "Alex_PL", points: 12450, avatar: "A", trend: "up" },
    { rank: 2, user: "JerseyKing", points: 11200, avatar: "J", trend: "same" },
    { rank: 3, user: "RetroFan99", points: 10850, avatar: "R", trend: "down" },
    { rank: 4, user: "GoalMachine", points: 9500, avatar: "G", trend: "up" },
    { rank: 5, user: "Tifoso_IT", points: 9200, avatar: "T", trend: "up" },
  ];

  return (
    <main className="bg-[#050505] min-h-screen text-white font-sans selection:bg-red-500 selection:text-white">
      <Navbar />

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-900/20 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <div className="relative z-10 pt-32 pb-20">
        <div className="container-max px-6 md:px-12 max-w-[1600px] mx-auto">
          {/* --- HEADER --- */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                  Live
                </div>
                <span className="text-gray-400 font-mono text-sm">
                  Season 4 • Mundial Qualifiers
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic"
              >
                MatchDays{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
                  Arena
                </span>
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6"
            >
              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Your Coins
                </div>
                <div className="text-3xl font-black text-white flex items-center justify-end gap-2">
                  2,450 <span className="text-yellow-400 text-lg">●</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- LEWA KOLUMNA (GRY) - SPAN 8 --- */}
            <div className="lg:col-span-8 space-y-10">
              {/* 1. HERO GAME (MUNDIAL/MAIN EVENT) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative h-[450px] rounded-3xl overflow-hidden group cursor-pointer border border-white/10"
              >
                <div className="absolute inset-0">
                  <img
                    src={mainEvent.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Main Event"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 p-10 w-full md:w-2/3">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1.5 bg-white text-black text-xs font-black uppercase tracking-wide rounded-md flex items-center gap-2">
                      <Globe2 size={14} /> Global Event
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
                      <Timer size={12} className="text-red-500" />{" "}
                      {mainEvent.endsIn}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight uppercase italic">
                    {mainEvent.title}
                  </h2>
                  <p className="text-lg text-gray-300 mb-8 font-medium max-w-lg">
                    {mainEvent.description}
                  </p>

                  <button className="px-8 py-4 bg-red-600 text-white font-bold uppercase tracking-wide rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20">
                    Join Tournament <ArrowUpRight size={20} />
                  </button>
                </div>
              </motion.div>

              {/* 2. GAME MODES GRID (MISSING 11, BINGO, TYPER) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game, idx) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className={`relative overflow-hidden rounded-3xl border bg-gray-900/50 backdrop-blur-md ${game.border} p-1 group cursor-pointer hover:-translate-y-1 transition-all duration-300`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-20`}
                    ></div>

                    <div className="relative h-full bg-gray-950/80 rounded-[20px] p-6 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center ${game.color}`}
                        >
                          <game.icon size={24} />
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/5 ${game.color}`}
                        >
                          {game.subtitle}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-white mb-2 uppercase italic">
                        {game.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-grow">
                        {game.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-xs">
                          <span className="text-gray-500 block uppercase font-bold text-[10px] mb-0.5">
                            Prize
                          </span>
                          <span className={`${game.color} font-bold`}>
                            {game.prize}
                          </span>
                        </div>
                        <button className="text-xs font-bold uppercase text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                          {game.action} <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* --- PRAWA KOLUMNA (SIDEBAR) - SPAN 4 --- */}
            <div className="lg:col-span-4 space-y-8">
              {/* RANKING (LEADERBOARD) */}
              <div className="bg-[#0f0f0f] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-500" /> Top Players
                  </h3>
                  <button className="text-xs font-bold text-gray-500 hover:text-white">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-white/5">
                  {leaderboard.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div
                        className={`w-6 text-center font-black text-lg ${
                          idx === 0 ? "text-yellow-400" : "text-gray-600"
                        }`}
                      >
                        {player.rank}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-sm border border-white/10 relative">
                        {player.avatar}
                        {idx === 0 && (
                          <Crown
                            size={12}
                            className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-200 group-hover:text-white">
                          {player.user}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">
                          Tier 1 Elite
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-white">
                          {player.points.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEXT DROP CARD */}
              <div className="relative overflow-hidden rounded-3xl bg-black border border-white/10 p-8">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-red-600 rounded-full blur-[60px] opacity-40 animate-pulse"></div>

                <div className="relative z-10 text-center">
                  <Flame size={32} className="text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-white uppercase italic mb-2">
                    Vintage Drop
                  </h3>
                  <p className="text-xs text-gray-400 mb-6">
                    Limited edition 90s Serie A kits dropping soon. Don't miss
                    out.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {["04", "12", "45"].map((t, i) => (
                      <div
                        key={i}
                        className="bg-white/10 rounded p-2 border border-white/5"
                      >
                        <div className="text-lg font-bold text-white">{t}</div>
                        <div className="text-[9px] text-gray-500 uppercase">
                          {["Hrs", "Min", "Sec"][i]}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-white text-black font-bold uppercase text-xs rounded-lg hover:bg-gray-200 transition-colors">
                    Set Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
