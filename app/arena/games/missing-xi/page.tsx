"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Timer,
  Trophy,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  getDailyMatch,
  calculateMissingXIScore,
  type MissingXIMatch,
} from "@/lib/gamesData";

export default function MissingXIGame() {
  const [matchData, setMatchData] = useState<MissingXIMatch | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guessedPlayers, setGuessedPlayers] = useState<number[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [hintsLeft, setHintsLeft] = useState(0);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  // Load daily match on component mount
  useEffect(() => {
    const dailyMatch = getDailyMatch();
    setMatchData(dailyMatch);
    setTimeLeft(dailyMatch.timeLimit);
    setHintsLeft(dailyMatch.hints);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (matchData && gameStarted && !gameEnded && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameEnded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameEnded, timeLeft, matchData]);

  // Check if game is won
  useEffect(() => {
    if (matchData && guessedPlayers.length === matchData.positions.length) {
      setGameEnded(true);
      const finalScore = calculateMissingXIScore(
        timeLeft,
        matchData.timeLimit,
        guessedPlayers.length,
        matchData.positions.length,
        wrongGuesses.length,
        matchData.hints - hintsLeft,
      );
      setScore(finalScore);
    }
  }, [guessedPlayers, matchData, timeLeft, wrongGuesses, hintsLeft]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGuess.trim() || gameEnded || !matchData) return;

    const normalizedGuess = currentGuess.trim().toUpperCase();
    const foundPlayer = matchData.positions.find(
      (p) =>
        p.name.toUpperCase() === normalizedGuess &&
        !guessedPlayers.includes(p.id),
    );

    if (foundPlayer) {
      setGuessedPlayers([...guessedPlayers, foundPlayer.id]);
      setCurrentGuess("");
    } else {
      if (!wrongGuesses.includes(normalizedGuess)) {
        setWrongGuesses([...wrongGuesses, normalizedGuess]);
      }
      setCurrentGuess("");
    }
  };

  const useHint = () => {
    if (hintsLeft <= 0 || !matchData) return;

    const unguessedPlayers = matchData.positions.filter(
      (p) => !guessedPlayers.includes(p.id) && !revealedHints.includes(p.id),
    );

    if (unguessedPlayers.length > 0) {
      const randomPlayer =
        unguessedPlayers[Math.floor(Math.random() * unguessedPlayers.length)];
      setRevealedHints([...revealedHints, randomPlayer.id]);
      setHintsLeft(hintsLeft - 1);
    }
  };

  const resetGame = () => {
    if (!matchData) return;
    setTimeLeft(matchData.timeLimit);
    setGameStarted(false);
    setGameEnded(false);
    setCurrentGuess("");
    setGuessedPlayers([]);
    setWrongGuesses([]);
    setHintsLeft(matchData.hints);
    setRevealedHints([]);
    setScore(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // NAPRAWIONE TUTAJ: Używamy typu MissingXIMatch zamiast typeof matchData
  const getPlayerDisplay = (player: MissingXIMatch["positions"][0]): string => {
    const isGuessed = guessedPlayers.includes(player.id);
    const isHinted = revealedHints.includes(player.id);

    if (isGuessed) {
      return player.name;
    } else if (isHinted) {
      return player.name.charAt(0) + "...";
    } else if (gameEnded) {
      return player.name;
    } else {
      return "......";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-500/20 border-green-500/50";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
      case "hard":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50";
    }
  };

  // Loading state
  if (!matchData) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-900/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/arena"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-bold">Back to Arena</span>
            </Link>

            <div className="flex items-center gap-6">
              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                  timeLeft < 30
                    ? "bg-red-500/20 border-red-500/50 text-red-400"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <Timer size={18} />
                <span className="font-mono font-bold text-lg">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Hints */}
              <button
                onClick={useHint}
                disabled={hintsLeft <= 0 || gameEnded}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-xl hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lightbulb size={18} className="text-yellow-400" />
                <span className="font-bold text-yellow-400">{hintsLeft}</span>
              </button>

              {/* Score */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <Trophy size={18} className="text-yellow-400" />
                <span className="font-bold">
                  {guessedPlayers.length}/{matchData.positions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-5xl font-black uppercase italic">
                {matchData.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getDifficultyColor(matchData.difficulty)}`}
              >
                <Star size={12} className="inline mr-1" />
                {matchData.difficulty}
              </span>
            </div>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                <span className="font-bold">{matchData.homeTeam}</span>
              </div>
              <div className="text-3xl font-black text-gray-500">
                {matchData.score}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">{matchData.awayTeam}</span>
                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
            <p className="text-gray-400 mt-2">
              {matchData.match} • {matchData.date}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Football Pitch */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[2/3] bg-gradient-to-b from-green-600 to-green-700 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                {/* Pitch Lines */}
                <div className="absolute inset-0">
                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full"></div>

                  {/* Halfway Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30"></div>

                  {/* Penalty Areas */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-24 border-2 border-t-white/30 border-x-white/30 border-b-0"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-24 border-2 border-b-white/30 border-x-white/30 border-t-0"></div>

                  {/* Goal Areas */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-12 border-2 border-t-white/30 border-x-white/30 border-b-0"></div>
                </div>

                {/* Grass Pattern */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-[10%] ${
                        i % 2 === 0 ? "bg-black/10" : "bg-transparent"
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Players */}
                {matchData.positions.map((player) => {
                  const isGuessed = guessedPlayers.includes(player.id);
                  const isHinted = revealedHints.includes(player.id);

                  return (
                    <motion.div
                      key={player.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: player.id * 0.1 }}
                      className="absolute"
                      style={{
                        left: `${player.x}%`,
                        top: `${player.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Player Card */}
                      <div className="relative">
                        {/* Jersey */}
                        <div
                          className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-black text-xl transition-all ${
                            isGuessed
                              ? "bg-gradient-to-br from-red-600 to-red-800 scale-110 shadow-lg shadow-red-500/50"
                              : isHinted
                                ? "bg-gradient-to-br from-yellow-600 to-yellow-800 animate-pulse"
                                : "bg-gradient-to-br from-gray-700 to-gray-900"
                          }`}
                        >
                          {player.number}
                        </div>

                        {/* Name Tag */}
                        <div
                          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-md text-xs font-bold ${
                            isGuessed
                              ? "bg-green-500 text-white"
                              : isHinted
                                ? "bg-yellow-500 text-black"
                                : gameEnded
                                  ? "bg-red-500 text-white"
                                  : "bg-black/80 text-gray-400"
                          }`}
                        >
                          {getPlayerDisplay(player)}
                        </div>

                        {/* Check Mark */}
                        {isGuessed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle2 size={16} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Formation Label */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-xs font-bold text-white">
                    Formation: {matchData.formation}
                  </span>
                </div>

                {/* Progress Counter */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-sm font-bold text-white">
                    {guessedPlayers.length}/{matchData.positions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Input Form */}
              {!gameEnded && (
                <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-black uppercase mb-4">
                    Guess Player
                  </h3>
                  <form onSubmit={handleGuess} className="space-y-4">
                    <input
                      type="text"
                      value={currentGuess}
                      onChange={(e) => setCurrentGuess(e.target.value)}
                      placeholder="Enter player name..."
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      disabled={!gameStarted || gameEnded}
                    />
                    <button
                      type="submit"
                      disabled={!gameStarted || gameEnded}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold uppercase transition-colors"
                    >
                      Submit Guess
                    </button>
                  </form>

                  {!gameStarted && (
                    <button
                      onClick={() => setGameStarted(true)}
                      className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold uppercase transition-colors"
                    >
                      Start Game
                    </button>
                  )}
                </div>
              )}

              {/* Correct Guesses */}
              {guessedPlayers.length > 0 && (
                <div className="bg-green-900/20 backdrop-blur-md rounded-2xl border border-green-500/30 p-6">
                  <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-green-400" />
                    Correct Guesses
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchData.positions
                      .filter((p) => guessedPlayers.includes(p.id))
                      .map((player) => (
                        <span
                          key={player.id}
                          className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-sm text-green-300 font-bold"
                        >
                          {player.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Wrong Guesses */}
              {wrongGuesses.length > 0 && (
                <div className="bg-red-900/20 backdrop-blur-md rounded-2xl border border-red-500/30 p-6">
                  <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
                    <XCircle size={20} className="text-red-400" />
                    Wrong Guesses
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {wrongGuesses.map((guess, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300"
                      >
                        {guess}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Over */}
              <AnimatePresence>
                {gameEnded && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-2xl border border-white/20 p-6"
                  >
                    <h3 className="text-2xl font-black uppercase mb-4 text-center">
                      {guessedPlayers.length === matchData.positions.length
                        ? "🎉 Complete!"
                        : "⏰ Time's Up!"}
                    </h3>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-black text-yellow-400 mb-2">
                        {score}
                      </div>
                      <div className="text-sm text-gray-400">Points Earned</div>
                    </div>
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Players Found:</span>
                        <span className="font-bold">
                          {guessedPlayers.length}/{matchData.positions.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time Remaining:</span>
                        <span className="font-bold">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hints Used:</span>
                        <span className="font-bold">
                          {matchData.hints - hintsLeft}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={resetGame}
                      className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold uppercase transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Play Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
