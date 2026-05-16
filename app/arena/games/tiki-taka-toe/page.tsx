"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useMemo, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, X, Trophy, Share2,
  Lightbulb, Check, RefreshCw, Users, Calendar,
} from "lucide-react";
import Link from "next/link";
import { getTodaysTikiTaka, type TikiTakaPuzzle } from "@/lib/api/tikiTaka";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "select" | "playing" | "won" | "lost";
type FilledCell = { player: string };
type GridCell = FilledCell | null;

// Maps ringColor token from the API ("red", "blue", …) → Tailwind classes
// for the header card border + soft background. Falls back to neutral.
const RING_THEME: Record<string, { ring: string; bg: string }> = {
  red:    { ring: "ring-red-500/60",    bg: "bg-red-950/60" },
  blue:   { ring: "ring-blue-500/60",   bg: "bg-blue-950/60" },
  indigo: { ring: "ring-indigo-500/60", bg: "bg-indigo-950/60" },
  rose:   { ring: "ring-rose-500/60",   bg: "bg-rose-950/60" },
  gray:   { ring: "ring-gray-300/60",   bg: "bg-gray-800/60" },
  amber:  { ring: "ring-amber-500/60",  bg: "bg-amber-950/60" },
  green:  { ring: "ring-emerald-500/60", bg: "bg-emerald-950/60" },
  purple: { ring: "ring-purple-500/60", bg: "bg-purple-950/60" },
  cyan:   { ring: "ring-cyan-500/60",   bg: "bg-cyan-950/60" },
};
const NEUTRAL_THEME = { ring: "ring-white/20", bg: "bg-white/5" };
const themeOf = (color: string) => RING_THEME[color] ?? NEUTRAL_THEME;

// ─── Player list for autocomplete ────────────────────────────────────────────

const ALL_PLAYERS = [
  "Michael Owen", "Paul Ince", "Xabi Alonso", "Steve McManaman",
  "Fernando Torres", "Nicolas Anelka", "Glen Johnson",
  "Robin van Persie", "Mikael Silvestre", "Alexis Sanchez",
  "Henrikh Mkhitaryan", "Danny Welbeck",
  "Mesut Ozil", "Jose Antonio Reyes",
  "Ashley Cole", "Cesc Fabregas", "William Gallas",
  "Gerard Pique", "Mark Hughes", "Laurent Blanc",
  "Luis Figo", "Ronaldo", "Michael Laudrup", "Bernd Schuster",
  "Pedro",
  // Extra players (wrong answers, realistic guesses)
  "Thierry Henry", "Patrick Vieira", "Robert Pires", "Freddie Ljungberg",
  "Frank Lampard", "John Terry", "Didier Drogba", "Eden Hazard", "Diego Costa",
  "Wayne Rooney", "Paul Scholes", "Ryan Giggs", "Rio Ferdinand", "Gary Neville",
  "Cristiano Ronaldo", "Karim Benzema", "Sergio Ramos", "Zinedine Zidane", "Raul",
  "Lionel Messi", "Andres Iniesta", "Xavi", "Ronaldinho", "Samuel Etoo",
  "Steven Gerrard", "Jamie Carragher", "Robbie Fowler", "Ian Rush",
  "Claude Makelele", "Arjen Robben", "Joe Cole", "Michael Ballack",
  "David Beckham", "Andy Cole", "Dwight Yorke", "Ole Gunnar Solskjaer",
  "Paul Pogba", "Marcus Rashford", "Bruno Fernandes", "Nemanja Vidic",
  "Timo Werner", "Kai Havertz", "Mason Mount", "Reece James",
  "James Milner", "Jordan Henderson", "Philippe Coutinho", "Luis Garcia",
  "Gareth Bale", "Luka Modric", "Toni Kroos", "Marcelo",
  "Luis Suarez", "Neymar", "Ivan Rakitic", "Sergio Busquets",
  "Dennis Bergkamp", "Gilberto Silva", "Sol Campbell", "Tony Adams",
  "Ruud van Nistelrooy", "Juan Sebastian Veron", "Eric Cantona",
  "Didier Deschamps", "Hristo Stoichkov", "Rivaldo",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(name: string) {
  return name.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip accents
}

function getFilledCount(grid: GridCell[][]) {
  return grid.flat().filter((c): c is FilledCell => c !== null).length;
}

// ─── Club Logo ────────────────────────────────────────────────────────────────

function ClubLogo({
  src,
  alt,
  size = 40,
}: {
  src: string | null;
  alt: string;
  size?: number;
}) {
  const [err, setErr] = useState(false);
  const fallback = (
    <div
      className="rounded-full bg-white/10 flex items-center justify-center font-black text-white text-xs"
      style={{ width: size, height: size }}
    >
      {alt.slice(0, 3)}
    </div>
  );
  if (!src || err) return fallback;
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain drop-shadow-sm"
      onError={() => setErr(true)}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TikiTakaToe() {
  const [phase, setPhase] = useState<Phase>("select");
  const [grid, setGrid] = useState<GridCell[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [search, setSearch] = useState("");
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);
  const [guessesLeft, setGuessesLeft] = useState(9);
  const [usedHints, setUsedHints] = useState<Set<string>>(new Set());
  const [shownHint, setShownHint] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Daily puzzle from the backend — different every UTC day, real crests.
  const [puzzle, setPuzzle] = useState<TikiTakaPuzzle | null>(null);
  const [puzzleError, setPuzzleError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTodaysTikiTaka()
      .then((p) => {
        if (!cancelled) setPuzzle(p);
      })
      .catch((err) => {
        if (!cancelled)
          setPuzzleError(
            err?.response?.data?.message ??
              err?.message ??
              "Failed to load today's puzzle. Try again in a moment.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filledCount = getFilledCount(grid);

  // Autocomplete pool: every correct answer from this puzzle's cells +
  // the static decoy list. Union ensures the right answer is always
  // suggestable, while decoys keep the dropdown from giving the game away.
  const autocompletePool = useMemo(() => {
    const set = new Set<string>(ALL_PLAYERS.map((p) => p));
    if (puzzle) {
      for (const arr of Object.values(puzzle.answers)) {
        for (const name of arr) {
          // Title-case each token so the display matches the static decoys.
          set.add(name.replace(/\b\w/g, (c) => c.toUpperCase()));
        }
      }
    }
    return Array.from(set);
  }, [puzzle]);

  const suggestions = useMemo(() => {
    if (!search.trim() || search.length < 2) return [];
    const q = normalize(search);
    return autocompletePool.filter((p) => normalize(p).includes(q)).slice(0, 7);
  }, [search, autocompletePool]);

  // Focus input when modal opens
  useEffect(() => {
    if (activeCell) {
      setSearch("");
      setWrongGuess(null);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [activeCell]);

  const handleCellClick = (row: number, col: number) => {
    if (guessesLeft === 0 || phase !== "playing") return;
    if (grid[row][col] !== null) return; // already filled
    setActiveCell([row, col]);
  };

  const handleGuess = (playerName: string) => {
    if (!activeCell || !puzzle) return;
    const [row, col] = activeCell;
    const key = `${row}-${col}`;
    const valid = puzzle.answers[key] ?? [];
    const correct = valid.some((v) => normalize(v) === normalize(playerName));

    if (correct) {
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = { player: playerName };
      setGrid(newGrid);
      setActiveCell(null);
      if (getFilledCount(newGrid) === 9) {
        setTimeout(() => setPhase("won"), 400);
      }
    } else {
      setWrongGuess(playerName);
      setWrongFlash(key);
      setTimeout(() => setWrongFlash(null), 600);
      const next = guessesLeft - 1;
      setGuessesLeft(next);
      if (next === 0) {
        setActiveCell(null);
        setTimeout(() => setPhase("lost"), 700);
      }
    }
  };

  const handleHint = () => {
    if (!activeCell || !puzzle) return;
    const key = `${activeCell[0]}-${activeCell[1]}`;
    setUsedHints((prev) => new Set([...prev, key]));
    setShownHint(puzzle.hints[key] ?? null);
  };

  const resetGame = () => {
    setPhase("playing");
    setGrid([[null, null, null], [null, null, null], [null, null, null]]);
    setGuessesLeft(9);
    setUsedHints(new Set());
    setActiveCell(null);
    setSearch("");
    setWrongGuess(null);
    setShownHint(null);
  };

  const shareResult = () => {
    const emoji = grid.map((row) =>
      row.map((c) => (c ? "🟩" : "⬜")).join("")
    ).join("\n");
    const text = `Tiki-Taka-Toe — ${filledCount}/9\n${emoji}\nPlay at matchdays.store`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  // ── SELECT SCREEN ──────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 pt-28 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/arena" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors">
              <ArrowLeft size={18} /> Back to Arena
            </Link>

            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-3 mb-5 px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-full">
                <span className="text-xl">⚽</span>
                <span className="text-sm font-black uppercase tracking-widest text-purple-300">Tiki-Taka-Toe</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black uppercase italic mb-3 leading-none">
                Choose{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                  Mode
                </span>
              </h1>
              <p className="text-gray-400 text-lg">
                Name players who connect two clubs — fill all 9 squares to win
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setPhase("playing")}
                className="relative group text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-gray-900/80 border border-blue-500/30 rounded-3xl p-8 hover:border-blue-400/60 transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/40">
                      <Calendar size={28} className="text-blue-400" />
                    </div>
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-xs font-bold text-blue-400 uppercase">
                      Daily
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase italic mb-2">Daily Challenge</h3>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    One fresh 3×3 grid every day. 9 guesses to fill all squares. Compete on the global leaderboard.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Today&apos;s Prize</div>
                      <div className="text-base font-black text-blue-400">500 Coins</div>
                    </div>
                    <span className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold uppercase text-sm transition-colors">
                      Play
                    </span>
                  </div>
                </div>
              </motion.button>

              {/* Online — Coming Soon */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative opacity-60"
              >
                <div className="relative bg-gray-900/80 border border-purple-500/20 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                      <Users size={28} className="text-purple-400" />
                    </div>
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-bold text-purple-400 uppercase">
                      Soon
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase italic mb-2">Online Match</h3>
                  <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    Challenge other players in real-time. Ranked matchmaking and trophies coming soon.
                  </p>
                  <div className="pt-4 border-t border-white/5">
                    <span className="px-5 py-2.5 bg-gray-700/50 rounded-xl font-bold uppercase text-sm text-gray-500 cursor-not-allowed inline-block">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* How to play */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">How to play</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div className="flex gap-3">
                  <span className="text-purple-400 font-black shrink-0">1.</span>
                  <span>Click any square on the 3×3 grid</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-400 font-black shrink-0">2.</span>
                  <span>Type a player who played for <strong>both</strong> the row and column club</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-400 font-black shrink-0">3.</span>
                  <span>Fill all 9 squares using only 9 guesses total</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ── WIN / LOST SCREENS ─────────────────────────────────────────────────────
  if (phase === "won" || phase === "lost") {
    const won = phase === "won";
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] ${won ? "bg-green-900/20" : "bg-red-900/20"}`} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full text-center"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${won ? "bg-green-500/20 border-2 border-green-500/50" : "bg-red-500/20 border-2 border-red-500/50"}`}>
            {won ? <Trophy size={40} className="text-green-400" /> : <X size={40} className="text-red-400" />}
          </div>

          <h1 className="text-5xl font-black uppercase italic mb-2">
            {won ? "You nailed it!" : "Game Over"}
          </h1>
          <p className="text-gray-400 mb-8">
            {won
              ? `Perfect! All 9 squares filled with ${9 - guessesLeft} wrong guesses.`
              : `You ran out of guesses. ${filledCount}/9 squares filled.`}
          </p>

          {/* Mini result grid */}
          <div className="grid grid-cols-3 gap-2 mb-8 max-w-[240px] mx-auto">
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold ${
                    cell ? "bg-green-500/30 border border-green-500/50 text-green-300" : "bg-white/5 border border-white/10 text-gray-600"
                  }`}
                >
                  {cell ? <Check size={16} /> : "✗"}
                </div>
              ))
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={shareResult}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors"
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-5 py-3 bg-purple-600 rounded-xl font-bold text-sm hover:bg-purple-500 transition-colors"
            >
              <RefreshCw size={16} /> Play Again
            </button>
            <Link
              href="/arena"
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={16} /> Arena
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── PLAYING (puzzle loading / error guards first) ─────────────────────────
  if (puzzleError) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <X size={28} className="text-red-400" />
          </div>
          <p className="text-sm text-gray-400 mb-4">{puzzleError}</p>
          <button
            onClick={() => location.reload()}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (!puzzle) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading today&apos;s puzzle…</p>
        </div>
      </div>
    );
  }

  // From here `puzzle` is non-null — destructure for readability.
  const cols = puzzle.cols;
  const rows = puzzle.rows;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/arena" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold">
              <ArrowLeft size={18} />
              Arena
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Guesses</span>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < (9 - guessesLeft)
                      ? "bg-red-500"
                      : "bg-green-400"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm font-black text-gray-300">
              {filledCount}<span className="text-gray-600">/9</span>
            </div>
          </div>

          {/* Grid */}
          <div className="bg-gradient-to-br from-[#0e0b1f] to-[#0a0a1a] rounded-3xl p-4 border border-white/10 shadow-2xl">
            <div className="grid grid-cols-4 gap-2">

              {/* Top-left corner */}
              <div className="flex items-center justify-center p-2">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xl">
                  ⚽
                </div>
              </div>

              {/* Column headers */}
              {cols.map((club) => {
                const t = themeOf(club.ringColor);
                return (
                  <div
                    key={club.id}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl ${t.bg} border ${t.ring}`}
                  >
                    <ClubLogo src={club.crest} alt={club.short} size={36} />
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-300 mt-1.5 text-center leading-tight">
                      {club.short}
                    </span>
                  </div>
                );
              })}

              {/* Rows */}
              {rows.map((rowClub, r) => (
                <Fragment key={`row-${rowClub.id}`}>
                  {/* Row header */}
                  {(() => {
                    const t = themeOf(rowClub.ringColor);
                    return (
                      <div
                        className={`flex flex-col items-center justify-center p-2 rounded-xl ${t.bg} border ${t.ring}`}
                      >
                        <ClubLogo
                          src={rowClub.crest}
                          alt={rowClub.short}
                          size={36}
                        />
                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-300 mt-1.5 text-center leading-tight">
                          {rowClub.short}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Game cells */}
                  {cols.map((_colClub, c) => {
                    const key = `${r}-${c}`;
                    const cell = grid[r][c];
                    const isActive = activeCell?.[0] === r && activeCell?.[1] === c;
                    const isWrong = wrongFlash === key;

                    return (
                      <motion.button
                        key={`cell-${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
                        transition={{ duration: 0.3 }}
                        disabled={cell !== null}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1.5 transition-all relative overflow-hidden
                          ${cell
                            ? "bg-green-500/20 border-green-500/60 cursor-default"
                            : isWrong
                            ? "bg-red-500/30 border-red-500/60"
                            : isActive
                            ? "bg-purple-500/20 border-purple-400/80 ring-2 ring-purple-500/30"
                            : "bg-white/5 border-white/10 hover:bg-purple-900/30 hover:border-purple-500/40 cursor-pointer"
                          }`}
                      >
                        {cell ? (
                          <>
                            <Check size={14} className="text-green-400 mb-1 shrink-0" />
                            <span className="text-[9px] font-bold text-green-300 leading-tight text-center line-clamp-2">
                              {cell.player}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl opacity-20">?</span>
                        )}
                      </motion.button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Hint display */}
          <AnimatePresence>
            {shownHint && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-2"
              >
                <Lightbulb size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-200">{shownHint}</p>
                <button onClick={() => setShownHint(null)} className="ml-auto text-gray-500 hover:text-white">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer info */}
          <p className="text-center text-xs text-gray-600 mt-4">
            Click a square → name a player who played for <span className="text-gray-400">both clubs</span>
          </p>
        </div>
      </div>

      {/* ── SEARCH MODAL ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeCell && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCell(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 z-50 md:max-w-md w-full md:w-full"
            >
              <div className="bg-[#0f0f1a] border border-white/20 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden">
                {/* Modal header */}
                <div className="px-5 pt-5 pb-3 border-b border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ClubLogo
                        src={rows[activeCell[0]].crest}
                        alt={rows[activeCell[0]].short}
                        size={28}
                      />
                      <span className="text-gray-400 text-sm font-bold">×</span>
                      <ClubLogo
                        src={cols[activeCell[1]].crest}
                        alt={cols[activeCell[1]].short}
                        size={28}
                      />
                      <div className="ml-2">
                        <p className="text-xs font-bold text-white leading-tight">
                          {rows[activeCell[0]].name} × {cols[activeCell[1]].name}
                        </p>
                        <p className="text-[10px] text-gray-500">Name a player who played for both</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveCell(null)}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Wrong guess feedback */}
                  <AnimatePresence>
                    {wrongGuess && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3 px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-2"
                      >
                        <X size={12} className="text-red-400 shrink-0" />
                        <span className="text-xs text-red-300">
                          <strong>{wrongGuess}</strong> didn&apos;t play for both clubs
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Search input */}
                  <div className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-2xl px-4 py-3 focus-within:border-purple-500/60 transition-colors">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                      ref={inputRef}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setWrongGuess(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && search.trim()) {
                          // Try exact match first, else first suggestion
                          const exactMatch = ALL_PLAYERS.find(
                            (p) => normalize(p) === normalize(search.trim())
                          );
                          handleGuess(exactMatch ?? search.trim());
                        }
                        if (e.key === "Escape") setActiveCell(null);
                      }}
                      placeholder="Type player name..."
                      className="bg-transparent flex-1 text-white placeholder-gray-500 text-sm outline-none font-medium"
                      autoComplete="off"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-gray-500 hover:text-white">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="max-h-60 overflow-y-auto">
                  {suggestions.length > 0 ? (
                    <ul className="py-2">
                      {suggestions.map((player) => (
                        <li key={player}>
                          <button
                            onClick={() => handleGuess(player)}
                            className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 group"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                              {player.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                              {player}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : search.length >= 2 ? (
                    <div className="px-5 py-6 text-center">
                      <p className="text-sm text-gray-500">No player found — try a different spelling</p>
                      {search.length >= 4 && (
                        <button
                          onClick={() => handleGuess(search.trim())}
                          className="mt-3 px-4 py-2 bg-purple-600/40 border border-purple-500/40 rounded-xl text-sm text-purple-300 font-bold hover:bg-purple-600/60 transition-colors"
                        >
                          Submit &quot;{search.trim()}&quot; anyway
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="px-5 py-6 text-center text-sm text-gray-600">
                      Start typing a player name...
                    </div>
                  )}
                </div>

                {/* Hint button */}
                <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={handleHint}
                    className="flex items-center gap-2 text-xs text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
                  >
                    <Lightbulb size={14} />
                    {usedHints.has(`${activeCell[0]}-${activeCell[1]}`) ? "Show hint again" : "Get hint"}
                  </button>
                  <span className="text-xs text-gray-500">
                    {guessesLeft} guess{guessesLeft !== 1 ? "es" : ""} left
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
