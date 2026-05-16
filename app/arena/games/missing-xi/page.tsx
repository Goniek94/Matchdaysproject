"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  Flag,
} from "lucide-react";
import Link from "next/link";
import {
  getDailyMatch,
  calculateMissingXIScore,
  type MissingXIMatch,
} from "@/lib/gamesData";
import {
  STATIC_DICTIONARY,
  buildDictionary,
  suggestPlayers,
  type DictionaryItem,
} from "@/lib/missingXiDictionary";
import { getFootballerDirectory } from "@/lib/api/footballers";

/** Single label/value row used inside the live score panel. */
function Row({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={muted ? "text-white/30" : "text-white/50"}>{label}</span>
      <span className={muted ? "text-white/30 font-bold" : "text-white font-black"}>
        {value}
      </span>
    </div>
  );
}

export default function MissingXIGame() {
  const [matchData, setMatchData] = useState<MissingXIMatch | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guessedPlayers, setGuessedPlayers] = useState<number[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [hintsLeft, setHintsLeft] = useState(0);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dictionary, setDictionary] = useState<readonly DictionaryItem[]>(
    STATIC_DICTIONARY,
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load daily match on component mount
  useEffect(() => {
    const dailyMatch = getDailyMatch();
    setMatchData(dailyMatch);
    setTimeLeft(dailyMatch.timeLimit);
    setHintsLeft(dailyMatch.hints);
  }, []);

  // Fetch real footballer directory once. Failure is fine — STATIC_DICTIONARY
  // stays in place so autocomplete still works offline / under rate limits.
  useEffect(() => {
    let cancelled = false;
    getFootballerDirectory()
      .then((list) => {
        if (cancelled || list.length === 0) return;
        setDictionary(buildDictionary(list));
      })
      .catch(() => {
        // Silent — fallback dictionary remains in use.
      });
    return () => {
      cancelled = true;
    };
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

  // Names the user has already correctly guessed — excluded from suggestions
  // so the dropdown doesn't show a player they've already nailed.
  const guessedNamesUpper = useMemo(() => {
    if (!matchData) return new Set<string>();
    const set = new Set<string>();
    for (const p of matchData.positions) {
      if (guessedPlayers.includes(p.id)) set.add(p.name.toUpperCase());
    }
    return set;
  }, [matchData, guessedPlayers]);

  // Live autocomplete suggestions — prefix-match against the real player
  // directory (PL + La Liga + Serie A + Bundesliga + Ligue 1 + UCL top
  // scorers). Display includes first name + club so "Cristiano RONALDO
  // (Al-Nassr)" disambiguates from "RONALDO" (legacy R9).
  const suggestions = useMemo(() => {
    if (!gameStarted || gameEnded) return [];
    return suggestPlayers(dictionary, currentGuess, guessedNamesUpper, 6);
  }, [dictionary, currentGuess, guessedNamesUpper, gameStarted, gameEnded]);

  // Submit either a typed guess OR a clicked suggestion (passed-in `picked`).
  //
  // Input is normalised aggressively so "Cristiano Ronaldo", "C. Ronaldo",
  // "ronaldo" and "RONALDO" all hit the same player. We strip dots/diacritics,
  // uppercase, and ALSO check the last whitespace-separated token as a
  // fallback — covers "Thierry Henry" → "HENRY" without needing the
  // dictionary lookup to know first names.
  const submitGuess = (picked?: string) => {
    if (!matchData || gameEnded) return;
    const raw = picked ?? currentGuess;
    if (!raw.trim()) return;

    const normalized = raw
      .trim()
      .replace(/\./g, " ")
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip diacritics
      .toUpperCase();
    const lastToken = normalized.split(" ").filter(Boolean).pop() ?? normalized;

    const foundPlayer = matchData.positions.find((p) => {
      if (guessedPlayers.includes(p.id)) return false;
      const surnameU = p.name.toUpperCase();
      return surnameU === normalized || surnameU === lastToken;
    });

    const normalizedGuess = lastToken; // used for wrong-guess display below

    if (foundPlayer) {
      setGuessedPlayers([...guessedPlayers, foundPlayer.id]);
    } else if (!wrongGuesses.includes(normalizedGuess)) {
      setWrongGuesses([...wrongGuesses, normalizedGuess]);
    }
    setCurrentGuess("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    submitGuess();
  };

  // End the game early — partial score awarded based on what's been guessed
  // so far. Same scoring formula as natural completion / timeout: accuracy +
  // time bonus, minus hint penalty, no completion bonus.
  const handleGiveUp = () => {
    if (!matchData || gameEnded) return;
    setGaveUp(true);
    setGameEnded(true);
    const partial = calculateMissingXIScore(
      timeLeft,
      matchData.timeLimit,
      guessedPlayers.length,
      matchData.positions.length,
      wrongGuesses.length,
      matchData.hints - hintsLeft,
    );
    setScore(partial);
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
    setGaveUp(false);
    setCurrentGuess("");
    setGuessedPlayers([]);
    setWrongGuesses([]);
    setHintsLeft(matchData.hints);
    setRevealedHints([]);
    setScore(0);
    setShowSuggestions(false);
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

      <div className="relative z-10 pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
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

          {/* Match Info — compact one-line layout to leave room for the pitch */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black uppercase italic">
                {matchData.title}
              </h1>
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getDifficultyColor(matchData.difficulty)}`}
              >
                <Star size={10} className="inline mr-1" />
                {matchData.difficulty}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm md:text-base">
              <span className="font-bold">{matchData.homeTeam}</span>
              <span className="text-xl font-black text-gray-400">
                {matchData.score}
              </span>
              <span className="font-bold">{matchData.awayTeam}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              {matchData.match} • {matchData.date}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_320px] gap-6">
            {/* Score panel — left of pitch. Live preview of points so the
                user sees what each correct/wrong guess does to their total. */}
            <div className="order-2 lg:order-1 space-y-3">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  Live Score
                </div>
                <div className="text-4xl font-black text-yellow-400 leading-none">
                  {(() => {
                    if (!matchData) return 0;
                    return calculateMissingXIScore(
                      timeLeft,
                      matchData.timeLimit,
                      guessedPlayers.length,
                      matchData.positions.length,
                      wrongGuesses.length,
                      matchData.hints - hintsLeft,
                    );
                  })()}
                </div>
                <div className="text-[10px] text-white/40 mt-1 uppercase font-bold">
                  points
                </div>

                <div className="h-px bg-white/10 my-4" />

                <div className="space-y-2 text-xs">
                  <Row
                    label="Players"
                    value={`${guessedPlayers.length}/${matchData.positions.length}`}
                  />
                  <Row
                    label="Time bonus"
                    value={`+${Math.floor((timeLeft / matchData.timeLimit) * 500)}`}
                  />
                  <Row
                    label="Accuracy"
                    value={`+${
                      guessedPlayers.length + wrongGuesses.length === 0
                        ? 0
                        : Math.floor(
                            (guessedPlayers.length /
                              (guessedPlayers.length + wrongGuesses.length)) *
                              1000,
                          )
                    }`}
                  />
                  <Row
                    label="Completion"
                    value={
                      guessedPlayers.length === matchData.positions.length
                        ? "+500"
                        : "+0"
                    }
                    muted={guessedPlayers.length !== matchData.positions.length}
                  />
                  <Row
                    label="Hint penalty"
                    value={`-${(matchData.hints - hintsLeft) * 50}`}
                    muted={hintsLeft === matchData.hints}
                  />
                  <Row
                    label="Wrong"
                    value={`${wrongGuesses.length}`}
                    muted={wrongGuesses.length === 0}
                  />
                </div>
              </div>

              <div className="bg-gray-900/30 rounded-2xl border border-white/5 p-4 text-[11px] text-white/40 leading-relaxed">
                <p className="font-bold text-white/60 mb-1">How scoring works</p>
                <p>
                  Time bonus (up to 500) + accuracy bonus (up to 1000, based
                  on correct/total ratio) + completion bonus (+500 if you
                  find all 11) − 50 per hint used.
                </p>
              </div>
            </div>

            {/* Football Pitch — single XI, aspect-ratio shaped to fit viewport */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-[460px] aspect-[3/4] bg-gradient-to-b from-green-600 to-green-700 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                {/* Pitch Lines */}
                <div className="absolute inset-0">
                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/30 rounded-full"></div>

                  {/* Halfway Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30"></div>

                  {/* Penalty Areas */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-14 border-2 border-t-white/30 border-x-white/30 border-b-0"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-14 border-2 border-b-white/30 border-x-white/30 border-t-0"></div>

                  {/* Goal Areas */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-7 border-2 border-t-white/30 border-x-white/30 border-b-0"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 border-2 border-b-white/30 border-x-white/30 border-t-0"></div>
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
                          className={`w-9 h-9 md:w-10 md:h-10 rounded-md flex items-center justify-center text-white font-black text-sm transition-all ${
                            isGuessed
                              ? "bg-gradient-to-br from-red-600 to-red-800 scale-110 shadow-md shadow-red-500/40"
                              : isHinted
                                ? "bg-gradient-to-br from-yellow-600 to-yellow-800 animate-pulse"
                                : "bg-gradient-to-br from-gray-800 to-gray-900"
                          }`}
                        >
                          {player.number}
                        </div>

                        {/* Name Tag */}
                        <div
                          className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            isGuessed
                              ? "bg-green-500 text-white"
                              : isHinted
                                ? "bg-yellow-500 text-black"
                                : gameEnded
                                  ? "bg-red-500 text-white"
                                  : "bg-black/70 text-gray-300"
                          }`}
                        >
                          {getPlayerDisplay(player)}
                        </div>

                        {/* Check Mark */}
                        {isGuessed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle2 size={10} />
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
            <div className="order-3 space-y-6">
              {/* Input Form */}
              {!gameEnded && (
                <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-black uppercase mb-4">
                    Guess Player
                  </h3>
                  <form onSubmit={handleGuess} className="space-y-4">
                    {/* Input + autocomplete dropdown */}
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={currentGuess}
                        onChange={(e) => {
                          setCurrentGuess(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => {
                          // Delay so a click on a suggestion lands BEFORE the
                          // dropdown unmounts. 150ms is the usual sweet spot.
                          setTimeout(() => setShowSuggestions(false), 150);
                        }}
                        placeholder="Enter player name..."
                        autoComplete="off"
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        disabled={!gameStarted || gameEnded}
                      />

                      {showSuggestions &&
                        gameStarted &&
                        suggestions.length > 0 && (
                          <div className="absolute z-10 left-0 right-0 mt-1 bg-[#0a0a0a] border border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                            {suggestions.map((item) => (
                              <button
                                type="button"
                                key={item.display}
                                // onMouseDown fires BEFORE input's onBlur — keeps
                                // the click from being eaten by the blur handler.
                                // We submit `surname` (the canonical match key)
                                // even though we DISPLAY the full "First LAST (Club)".
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  submitGuess(item.surname);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-b-0"
                              >
                                {item.display}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <button
                        type="submit"
                        disabled={!gameStarted || gameEnded}
                        className="py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold uppercase transition-colors"
                      >
                        Submit Guess
                      </button>
                      <button
                        type="button"
                        onClick={handleGiveUp}
                        disabled={!gameStarted || gameEnded}
                        className="px-4 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold uppercase transition-colors text-white/70 text-xs flex items-center gap-2"
                        title="End the round now and take partial score"
                      >
                        <Flag size={14} />
                        Give Up
                      </button>
                    </div>
                  </form>

                  {!gameStarted && (
                    <button
                      onClick={() => setGameStarted(true)}
                      className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold uppercase transition-colors"
                    >
                      Start Game
                    </button>
                  )}

                  {gameStarted && (
                    <p className="mt-3 text-[11px] text-white/40 leading-snug">
                      Points are awarded for each correct guess — you don&apos;t
                      have to find all 11. Wrong guesses hurt accuracy bonus.
                    </p>
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
                        : gaveUp
                          ? "🏳️ You gave up"
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
