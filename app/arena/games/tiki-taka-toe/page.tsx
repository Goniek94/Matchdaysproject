"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Calendar,
  Trophy,
  Timer,
  TimerOff,
} from "lucide-react";
import Link from "next/link";

type GameMode = "daily" | "online" | null;
type TimerMode = "timer" | "no-timer" | null;

export default function TikiTakaToe() {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const [timerMode, setTimerMode] = useState<TimerMode>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/arena"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-bold">Back to Arena</span>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                ⚽
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">
                Tiki-Taka-Toe
              </span>
            </div>
            <h1 className="text-6xl font-black uppercase italic mb-4">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600">
                Mode
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Test your football knowledge in this strategic game
            </p>
          </div>

          {/* Mode Selection */}
          {!selectedMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Daily Mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setSelectedMode("daily")}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-md border border-blue-500/30 rounded-3xl p-8 hover:border-blue-500/60 transition-all hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/50">
                      <Calendar size={32} className="text-blue-400" />
                    </div>
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs font-bold text-blue-400 uppercase">
                      Daily
                    </span>
                  </div>

                  <h3 className="text-3xl font-black uppercase italic mb-3">
                    Daily Challenge
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    New puzzle every day. Complete it to earn rewards and climb
                    the leaderboard. One chance per day!
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">
                        Fresh puzzle every 24h
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">
                        Compete on global leaderboard
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">Earn daily rewards</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                        Today's Prize
                      </div>
                      <div className="text-lg font-black text-blue-400">
                        500 Coins
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold uppercase text-sm transition-colors">
                      Play Daily
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Online Mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setSelectedMode("online")}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8 hover:border-purple-500/60 transition-all hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/50">
                      <Users size={32} className="text-purple-400" />
                    </div>
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs font-bold text-purple-400 uppercase flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Live
                    </span>
                  </div>

                  <h3 className="text-3xl font-black uppercase italic mb-3">
                    Online Match
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Challenge players worldwide in real-time. Prove you're the
                    ultimate football expert!
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">
                        Real-time multiplayer
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">Ranked matchmaking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">
                        Win to earn trophies
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                        Players Online
                      </div>
                      <div className="text-lg font-black text-purple-400">
                        1,247
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold uppercase text-sm transition-colors">
                      Find Match
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Timer Selection (shown after mode selection) */}
          {selectedMode && !timerMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black uppercase italic mb-4">
                  Choose Timer Mode
                </h2>
                <p className="text-gray-400">
                  Play with or without time pressure
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timer Mode */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setTimerMode("timer")}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-md border border-yellow-500/30 rounded-3xl p-8 hover:border-yellow-500/60 transition-all hover:-translate-y-2">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/50 mb-6 mx-auto">
                      <Timer size={32} className="text-yellow-400" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic mb-3 text-center">
                      With Timer
                    </h3>
                    <p className="text-gray-400 text-center mb-6">
                      Race against the clock! Complete the grid before time runs
                      out.
                    </p>
                    <div className="text-center">
                      <span className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-sm font-bold text-yellow-400">
                        60 Seconds
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* No Timer Mode */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setTimerMode("no-timer")}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-md border border-green-500/30 rounded-3xl p-8 hover:border-green-500/60 transition-all hover:-translate-y-2">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center border border-green-500/50 mb-6 mx-auto">
                      <TimerOff size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic mb-3 text-center">
                      No Timer
                    </h3>
                    <p className="text-gray-400 text-center mb-6">
                      Take your time! Think carefully about each move.
                    </p>
                    <div className="text-center">
                      <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-sm font-bold text-green-400">
                        Unlimited
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => setSelectedMode(null)}
                  className="text-gray-400 hover:text-white transition-colors text-sm font-bold"
                >
                  ← Back to mode selection
                </button>
              </div>
            </motion.div>
          )}

          {/* Game Board (shown after timer selection) */}
          {selectedMode && timerMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              {/* Mode Header */}
              <div className="flex items-center justify-between mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTimerMode(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black uppercase">
                      {selectedMode === "daily"
                        ? "Daily Challenge"
                        : "Online Match"}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {selectedMode === "daily"
                        ? "Complete today's puzzle"
                        : "Waiting for opponent..."}
                    </p>
                  </div>
                </div>

                {selectedMode === "online" && (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase font-bold">
                        OPP
                      </div>
                      <div className="text-2xl font-black text-red-400">
                        0-0
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase font-bold">
                        YOU
                      </div>
                      <div className="text-2xl font-black text-green-400">
                        0-40
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                      <span className="text-sm font-bold text-blue-400 uppercase">
                        Their Turn
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Timer Display */}
              {timerMode === "timer" && (
                <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-2xl flex items-center justify-center gap-3">
                  <Timer size={24} className="text-yellow-400" />
                  <span className="text-3xl font-black text-yellow-400 font-mono">
                    0:60
                  </span>
                </div>
              )}

              {/* 4x4 Grid */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-6 border-4 border-white/10 shadow-2xl">
                <div className="grid grid-cols-5 gap-3">
                  {/* Top-left corner (logo) */}
                  <div className="bg-indigo-900/80 backdrop-blur-md rounded-xl p-3 flex items-center justify-center border-2 border-white/20">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                      ⚽
                    </div>
                  </div>

                  {/* Top row headers - Clubs/Teams */}
                  <div className="bg-blue-900/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border-2 border-blue-500/30">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg"
                      alt="CHE"
                      className="w-8 h-8 mb-1"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling!.textContent = "🔵";
                      }}
                    />
                    <div className="text-[10px] font-bold uppercase text-center">
                      CHE
                    </div>
                  </div>
                  <div className="bg-blue-900/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border-2 border-blue-500/30">
                    <Trophy size={24} className="text-yellow-400 mb-1" />
                    <div className="text-[10px] font-bold uppercase text-center">
                      WC Boot
                    </div>
                  </div>
                  <div className="bg-blue-900/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border-2 border-blue-500/30">
                    <div className="text-2xl mb-1">👤</div>
                    <div className="text-[10px] font-bold uppercase text-center">
                      Lukaku
                    </div>
                  </div>
                  <div className="bg-blue-900/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border-2 border-blue-500/30">
                    <div className="text-2xl mb-1">🇨🇮</div>
                    <div className="text-[10px] font-bold uppercase text-center">
                      CIV
                    </div>
                  </div>

                  {/* Row 1 - Ferguson */}
                  <div className="bg-blue-900/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border-2 border-blue-500/30">
                    <div className="text-2xl mb-1">👨‍💼</div>
                    <div className="text-[10px] font-bold uppercase text-center">
                      Ferguson
                    </div>
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <button
                      key={`r1-${i}`}
                      className="bg-purple-800/30 backdrop-blur-md rounded-xl p-6 hover:bg-purple-700/40 transition-all border-2 border-white/10 hover:border-white/30 group aspect-square"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-16 bg-purple-700/30 rounded-lg group-hover:scale-110 transition-transform"></div>
                      </div>
                    </button>
                  ))}

                  {/* Row 2 - LaLiga Golden Boot */}
                  <div className="bg-blue-900/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border-2 border-blue-500/30">
                    <Trophy size={20} className="text-yellow-400 mb-1" />
                    <div className="text-[10px] font-bold uppercase text-center">
                      LaLiga Boot
                    </div>
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <button
                      key={`r2-${i}`}
                      className="bg-purple-800/30 backdrop-blur-md rounded-xl p-6 hover:bg-purple-700/40 transition-all border-2 border-white/10 hover:border-white/30 group aspect-square"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-16 bg-purple-700/30 rounded-lg group-hover:scale-110 transition-transform"></div>
                      </div>
                    </button>
                  ))}

                  {/* Row 3 - Euros Winner */}
                  <div className="bg-blue-900/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border-2 border-blue-500/30">
                    <Trophy size={20} className="text-blue-400 mb-1" />
                    <div className="text-[10px] font-bold uppercase text-center">
                      Euros
                    </div>
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <button
                      key={`r3-${i}`}
                      className="bg-purple-800/30 backdrop-blur-md rounded-xl p-6 hover:bg-purple-700/40 transition-all border-2 border-white/10 hover:border-white/30 group aspect-square"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-16 bg-purple-700/30 rounded-lg group-hover:scale-110 transition-transform"></div>
                      </div>
                    </button>
                  ))}

                  {/* Row 4 - Greek/Cypriot League */}
                  <div className="bg-blue-900/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border-2 border-blue-500/30">
                    <div className="text-2xl mb-1">🏛️</div>
                    <div className="text-[10px] font-bold uppercase text-center">
                      GR/CY
                    </div>
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <button
                      key={`r4-${i}`}
                      className="bg-purple-800/30 backdrop-blur-md rounded-xl p-6 hover:bg-purple-700/40 transition-all border-2 border-white/10 hover:border-white/30 group aspect-square"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-16 bg-purple-700/30 rounded-lg group-hover:scale-110 transition-transform"></div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
                  <p className="text-sm text-center text-gray-300">
                    <span className="font-bold text-white">Click a square</span>{" "}
                    to select a player that matches both the row and column
                    criteria
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
