"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ScanLine,
  Sparkles,
  BarChart3,
  Search,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Eye,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ITEMS = [
  {
    name: "Man Utd Home 2007/08",
    player: "C. Ronaldo #7",
    type: "jersey",
    brand: "Nike",
    condition: "Mint",
    condColor: "#00ff88",
    auth: "Original ✓",
    authColor: "#00ff88",
    fakeRisk: "2%",
    value: "£380 – £460",
    color: "#00ff88",
    desc: "Uploading front photo... AI cross-referencing stitching patterns against 2.1M Nike originals. Crest embroidery verified. Font match: 99.8%. Authentication: PASSED.",
  },
  {
    name: "Nike Mercurial 2004",
    player: "Ronaldinho",
    type: "boots",
    brand: "Nike",
    condition: "Good",
    condColor: "#F5C842",
    auth: "Original ✓",
    authColor: "#00ff88",
    fakeRisk: "5%",
    value: "£220 – £290",
    color: "#00aaff",
    desc: "Scanning sole markings and tongue label... Nike production code confirmed. Wear pattern consistent with professional match use. Production era: 2003–2005. Verified.",
  },
  {
    name: "Brazil Away 2002 WC",
    player: "Ronaldo #9",
    type: "jersey",
    brand: "Nike",
    condition: "Excellent",
    condColor: "#00ff88",
    auth: "Player Issue ✓",
    authColor: "#F5C842",
    fakeRisk: "1%",
    value: "£720 – £950",
    color: "#00ff88",
    desc: "World Cup match variant detected. Tag batch code matches São Paulo production run. Collar oxidation consistent with 2002 tournament. RARE item — top 0.3% of market.",
  },
  {
    name: "Real Madrid 2003/04",
    player: "Zidane #5",
    type: "jersey",
    brand: "Adidas",
    condition: "Very Good",
    condColor: "#00ff88",
    auth: "Original ✓",
    authColor: "#00ff88",
    fakeRisk: "3%",
    value: "£340 – £420",
    color: "#aa44ff",
    desc: "Adidas authentication strip confirmed under UV. Galácticos era verified by collar cut and badge stitch count: 847 threads. Serial number matches Madrid warehouse batch.",
  },
];

const PHASES = ["Front", "Back", "Tags", "Valuation"];

// ─── SVGs ─────────────────────────────────────────────────────────────────────

function JerseySVG({ c }: { c: string }) {
  const id = `jg${c.replace(/#/g, "")}`;
  return (
    <svg
      viewBox="0 0 300 310"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.22" />
          <stop offset="100%" stopColor={c} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path
        d="M78 48 L26 77 L43 118 L74 103 L74 268 L226 268 L226 103 L257 118 L274 77 L222 48 C211 69 184 82 150 82 C116 82 89 69 78 48Z"
        fill={`url(#${id})`}
        stroke={c}
        strokeWidth="1.5"
        opacity="0.95"
      />
      <path
        d="M116 50 Q150 74 184 50"
        fill="none"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <line
        x1="74"
        y1="103"
        x2="74"
        y2="268"
        stroke={c}
        strokeWidth="0.5"
        strokeDasharray="5 4"
        opacity="0.2"
      />
      <line
        x1="226"
        y1="103"
        x2="226"
        y2="268"
        stroke={c}
        strokeWidth="0.5"
        strokeDasharray="5 4"
        opacity="0.2"
      />
      <line
        x1="74"
        y1="48"
        x2="78"
        y2="103"
        stroke={c}
        strokeWidth="0.5"
        strokeDasharray="4 3"
        opacity="0.18"
      />
      <line
        x1="226"
        y1="48"
        x2="222"
        y2="103"
        stroke={c}
        strokeWidth="0.5"
        strokeDasharray="4 3"
        opacity="0.18"
      />
      <rect
        x="74"
        y="138"
        width="152"
        height="18"
        fill={c}
        fillOpacity="0.08"
        stroke={c}
        strokeWidth="0.5"
        opacity="0.6"
      />
      <circle
        cx="110"
        cy="122"
        r="15"
        fill={c}
        fillOpacity="0.07"
        stroke={c}
        strokeWidth="1.2"
        opacity="0.8"
      />
      <text
        x="110"
        y="127"
        textAnchor="middle"
        fontSize="12"
        fill={c}
        fontWeight="900"
        fontFamily="system-ui"
        opacity="0.9"
      >
        M
      </text>
      <text
        x="152"
        y="234"
        textAnchor="middle"
        fontSize="44"
        fill="none"
        stroke={c}
        strokeWidth="0.8"
        fontWeight="900"
        fontFamily="system-ui"
        opacity="0.25"
      >
        7
      </text>
      <line
        x1="74"
        y1="188"
        x2="226"
        y2="188"
        stroke={c}
        strokeWidth="0.4"
        opacity="0.1"
      />
      <line
        x1="74"
        y1="228"
        x2="226"
        y2="228"
        stroke={c}
        strokeWidth="0.4"
        opacity="0.1"
      />
      <circle
        cx="110"
        cy="122"
        r="2"
        fill={c}
        opacity="0.9"
        style={{ animation: "dp 2.5s ease-in-out infinite" }}
      />
      <circle
        cx="190"
        cy="100"
        r="1.5"
        fill={c}
        opacity="0.6"
        style={{ animation: "dp 2.5s 0.6s ease-in-out infinite" }}
      />
      <circle
        cx="150"
        cy="155"
        r="1.5"
        fill={c}
        opacity="0.5"
        style={{ animation: "dp 2.5s 1.2s ease-in-out infinite" }}
      />
    </svg>
  );
}

function BootsSVG({ c }: { c: string }) {
  const id = `bg${c.replace(/#/g, "")}`;
  return (
    <svg
      viewBox="0 0 300 310"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={c} stopOpacity="0.18" />
          <stop offset="100%" stopColor={c} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path
        d="M75 70 L75 198 Q75 242 118 252 L238 252 Q264 252 266 232 L266 212 Q266 196 246 193 L202 190 L202 70 Z"
        fill={`url(#${id})`}
        stroke={c}
        strokeWidth="1.5"
        opacity="0.9"
      />
      <path
        d="M128 70 L128 162 Q140 170 152 162 L172 70 Z"
        fill={c}
        fillOpacity="0.06"
        stroke={c}
        strokeWidth="0.8"
        opacity="0.6"
      />
      {[90, 104, 118, 132, 146].map((y, i) => (
        <line
          key={i}
          x1="132"
          y1={y}
          x2="168"
          y2={y}
          stroke={c}
          strokeWidth="1.2"
          opacity="0.4"
        />
      ))}
      {[
        [108, 262],
        [134, 264],
        [160, 262],
        [186, 260],
        [212, 257],
        [234, 251],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="5.5"
          fill={c}
          fillOpacity="0.14"
          stroke={c}
          strokeWidth="0.8"
          opacity="0.7"
        />
      ))}
      <path
        d="M206 118 Q234 102 248 113 Q232 140 190 145 Z"
        fill={c}
        fillOpacity="0.18"
        stroke={c}
        strokeWidth="0.8"
        opacity="0.7"
      />
      <circle
        cx="150"
        cy="128"
        r="2"
        fill={c}
        opacity="0.9"
        style={{ animation: "dp 2.5s ease-in-out infinite" }}
      />
      <circle
        cx="220"
        cy="232"
        r="1.5"
        fill={c}
        opacity="0.6"
        style={{ animation: "dp 2.5s 0.7s ease-in-out infinite" }}
      />
    </svg>
  );
}

// ─── Scanner component ────────────────────────────────────────────────────────

function HoloScanner() {
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState("");
  const [fading, setFading] = useState(false);
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const item = ITEMS[itemIdx];
  const c = item.color;

  // Typewriter — 55ms per character (readable speed)
  const startTyping = useCallback((text: string) => {
    if (typeTimer.current) clearInterval(typeTimer.current);
    setTyped("");
    let i = 0;
    typeTimer.current = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(typeTimer.current!);
    }, 55);
  }, []);

  useEffect(() => {
    startTyping(item.desc);
  }, [itemIdx, phase, item.desc, startTyping]);

  // Auto-advance phases, then items
  useEffect(() => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
    const delay = phase === 0 ? 5000 : 4500;
    phaseTimer.current = setTimeout(() => {
      if (phase < 3) {
        setPhase((p) => p + 1);
      } else {
        setFading(true);
        setTimeout(() => {
          setItemIdx((i) => (i + 1) % ITEMS.length);
          setPhase(0);
          setFading(false);
        }, 450);
      }
    }, delay);
    return () => {
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
    };
  }, [phase, itemIdx]);

  const handlePhase = (i: number) => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
    setPhase(i);
  };

  const handleItem = (i: number) => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
    setFading(true);
    setTimeout(() => {
      setItemIdx(i);
      setPhase(0);
      setFading(false);
    }, 300);
  };

  const progress = ((phase + 1) / 4) * 100;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Top: frame + info side by side on large, stacked on small */}
      <div
        style={{
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Scan frame — LARGE */}
        <div
          style={{
            position: "relative",
            width: 360,
            height: 420,
            flexShrink: 0,
            opacity: fading ? 0 : 1,
            transition: "opacity 0.4s",
          }}
        >
          {/* Corner brackets */}
          {(["tl", "tr", "bl", "br"] as const).map((pos) => (
            <div
              key={pos}
              style={{
                position: "absolute",
                width: 22,
                height: 22,
                borderStyle: "solid",
                borderColor: c,
                top: pos[0] === "t" ? 0 : "auto",
                bottom: pos[0] === "b" ? 0 : "auto",
                left: pos[1] === "l" ? 0 : "auto",
                right: pos[1] === "r" ? 0 : "auto",
                borderWidth:
                  pos === "tl"
                    ? "2px 0 0 2px"
                    : pos === "tr"
                      ? "2px 2px 0 0"
                      : pos === "bl"
                        ? "0 0 2px 2px"
                        : "0 2px 2px 0",
                transition: "border-color 0.5s",
              }}
            />
          ))}
          {/* Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              pointerEvents: "none",
              backgroundImage: `linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px)`,
              backgroundSize: "22px 22px",
              transition: "background-image 0.5s",
            }}
          />
          {/* Scan line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg,transparent,${c}88,${c},${c}88,transparent)`,
              boxShadow: `0 0 12px ${c}, 0 0 24px ${c}44`,
              animation: "scanMove 2.2s ease-in-out infinite",
              transition: "background 0.5s",
            }}
          />
          {/* Item */}
          {item.type === "boots" ? <BootsSVG c={c} /> : <JerseySVG c={c} />}
        </div>

        {/* Info panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 220,
            flex: 1,
            maxWidth: 300,
          }}
        >
          {/* Status dot + label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: c,
                boxShadow: `0 0 8px ${c}`,
                animation: "dp 1.8s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: `${c}99`,
              }}
            >
              {phase === 0
                ? "Scanning front"
                : phase === 1
                  ? "Scanning back"
                  : phase === 2
                    ? "Reading tags"
                    : "Calculating value"}
            </span>
          </div>

          {/* Data rows */}
          <div
            style={{
              background: "rgba(0,0,0,0.55)",
              border: `1px solid ${c}1a`,
              borderRadius: 14,
              padding: "16px 18px",
              transition: "border-color 0.5s",
            }}
          >
            {[
              { label: "Item", value: item.name, color: "#fff" },
              { label: "Player", value: item.player, color: "#fff" },
              { label: "Brand", value: item.brand, color: "#888" },
              {
                label: "Condition",
                value: item.condition,
                color: item.condColor,
              },
              { label: "Auth", value: item.auth, color: item.authColor },
              ...(phase >= 2
                ? [
                    {
                      label: "Fake Risk",
                      value: item.fakeRisk,
                      color:
                        parseInt(item.fakeRisk) <= 3 ? "#00ff88" : "#ff8844",
                    },
                  ]
                : []),
              ...(phase >= 3
                ? [{ label: "Est. Value", value: item.value, color: "#F5C842" }]
                : []),
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: `1px solid ${c}0d`,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: `${c}55`,
                  }}
                >
                  {r.label}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: r.color,
                    textAlign: "right" as const,
                    maxWidth: 160,
                  }}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg,${c},#00ddff)`,
                borderRadius: 2,
                transition: "width 0.6s ease",
                boxShadow: `0 0 8px ${c}`,
              }}
            />
          </div>

          {/* Phase buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            {PHASES.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePhase(i)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: 8,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  border: `1px solid ${i <= phase ? c + "55" : "rgba(255,255,255,0.08)"}`,
                  background: i === phase ? `${c}18` : "transparent",
                  color: i <= phase ? c : "rgba(255,255,255,0.18)",
                  transition: "all 0.3s",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Item selector dots */}
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            {ITEMS.map((_, i) => (
              <div
                key={i}
                onClick={() => handleItem(i)}
                style={{
                  height: 6,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "all 0.35s",
                  width: i === itemIdx ? 24 : 6,
                  background: i === itemIdx ? c : "rgba(255,255,255,0.15)",
                  boxShadow: i === itemIdx ? `0 0 8px ${c}` : "none",
                }}
              />
            ))}
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
                marginLeft: 4,
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}
            >
              {itemIdx + 1}/{ITEMS.length}
            </span>
          </div>
        </div>
      </div>

      {/* AI Analysis typewriter */}
      <div
        style={{
          background: "rgba(0,0,0,0.45)",
          border: `1px solid ${c}18`,
          borderRadius: 12,
          padding: "14px 18px",
          minHeight: 72,
          transition: "border-color 0.5s",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: `${c}55`,
            marginBottom: 8,
          }}
        >
          AI Analysis
        </div>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.65,
            fontFamily: "monospace",
            margin: 0,
          }}
        >
          {typed}
          <span
            style={{ opacity: 0.6, animation: "blink 1s step-end infinite" }}
          >
            ▌
          </span>
        </p>
      </div>

      <style>{`
        @keyframes scanMove{0%{top:0;opacity:0}8%{opacity:1}92%{opacity:1}100%{top:100%;opacity:0}}
        @keyframes dp{0%,100%{opacity:0.9}50%{opacity:0.3}}
        @keyframes blink{0%,100%{opacity:0.6}50%{opacity:0}}
      `}</style>
    </div>
  );
}

// ─── Tools ────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    id: "verify",
    title: "Legit Check",
    subtitle: "AI Authentication",
    description:
      "Upload photos of tags, stitching, and crests. Our AI compares against millions of authentic samples to detect fakes instantly.",
    icon: ScanLine,
    href: "/ai/verify",
    action: "Start Verification",
    num: "01",
  },
  {
    id: "description",
    title: "Smart Listing",
    subtitle: "Description Generator",
    description:
      "Upload a photo. AI identifies season, player, and condition — then writes a professional listing description automatically.",
    icon: Sparkles,
    href: "/add-listing?flow=ai_assist",
    action: "Create Listing",
    num: "02",
  },
  {
    id: "valuation",
    title: "Price Oracle",
    subtitle: "Market Valuation",
    description:
      "Real sales data from eBay, Vinted, and StockX analyzed instantly to give you a fair, accurate market price.",
    icon: BarChart3,
    href: "/ai/valuation",
    action: "Check Value",
    num: "03",
  },
  {
    id: "finder",
    title: "Visual Finder",
    subtitle: "Image Search",
    description:
      "Saw a kit on TV or Instagram? Upload a screenshot and we'll find exactly where to buy it on MatchDays.",
    icon: Search,
    href: "/ai/search",
    action: "Find Jersey",
    num: "04",
  },
];

const STATS = [
  { icon: Zap, value: "99.8%", label: "Accuracy" },
  { icon: Shield, value: "5M+", label: "Items Analyzed" },
  { icon: TrendingUp, value: "50K+", label: "Users" },
  { icon: Eye, value: "<1s", label: "Response" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center px-8 md:px-16 xl:px-24 pt-28 pb-16 overflow-hidden">
        {/* Top gold line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(245,200,66,0.4),transparent)",
          }}
        />

        {/* Subtle top glow — no big blob */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top right,rgba(245,200,66,0.04) 0%,transparent 65%)",
          }}
        />

        {/* Floating micro-dots */}
        {[
          { x: "5%", y: "22%", s: 2.5 },
          { x: "94%", y: "12%", s: 2 },
          { x: "9%", y: "78%", s: 2 },
          { x: "52%", y: "6%", s: 1.5 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              background: "#F5C842",
              boxShadow: `0 0 ${p.s * 4}px #F5C842`,
              animation: `fp ${9 + i * 1.5}s ${i * 1.4}s ease-in-out infinite alternate`,
            }}
          />
        ))}

        <div className="relative z-10 w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* LEFT — headline */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-0.5 bg-red-500" />
              <span className="text-xs font-bold tracking-[0.28em] uppercase text-gray-500">
                MatchDays Intelligence
              </span>
              <div className="w-8 h-0.5 bg-red-500" />
            </div>

            <h1
              className="font-black tracking-tighter mb-10 leading-[0.88]"
              style={{ fontSize: "clamp(72px,9vw,128px)" }}
            >
              <span className="block text-white">Your</span>
              <span className="block text-white">Kit.</span>
              <span
                className="block"
                style={{
                  WebkitTextStroke: "1.5px #252525",
                  color: "transparent",
                }}
              >
                Powered
              </span>
              <span
                className="block text-[#F5C842]"
                style={{ textShadow: "0 0 40px rgba(245,200,66,0.25)" }}
              >
                by AI.
              </span>
            </h1>

            <p className="text-xl text-gray-500 max-w-lg leading-relaxed mb-14">
              Trained on{" "}
              <span className="text-white font-bold">5 million+</span> football
              shirts — verify, value, and sell faster than ever.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                href="/register"
                className="flex items-center gap-2 px-9 py-4 rounded-full font-black text-sm uppercase tracking-wider bg-white text-black hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link
                href="#tools"
                className="flex items-center gap-2 px-9 py-4 rounded-full font-bold text-sm uppercase tracking-wider border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-all"
              >
                See the Tools
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 divide-x divide-white/[0.07] border border-white/[0.07] rounded-2xl overflow-hidden max-w-lg">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 py-6 px-5 bg-white/[0.025]"
                >
                  <s.icon size={14} className="text-gray-700" />
                  <span className="text-2xl font-black text-white leading-none">
                    {s.value}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — scanner */}
          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-[640px]">
              <HoloScanner />
            </div>
          </div>
        </div>
      </section>

      {/* ══ TOOLS ════════════════════════════════════════════════════════ */}
      <section
        id="tools"
        className="relative overflow-hidden"
        style={{ background: "#0d0d0d" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)",
          }}
        />

        {/* Pitch lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 1400 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect
              x="40"
              y="40"
              width="1320"
              height="720"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.05"
            />
            <line
              x1="700"
              y1="40"
              x2="700"
              y2="760"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <circle
              cx="700"
              cy="400"
              r="110"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <circle cx="700" cy="400" r="5" fill="white" opacity="0.07" />
            <rect
              x="40"
              y="220"
              width="195"
              height="360"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <rect
              x="40"
              y="295"
              width="80"
              height="210"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <path
              d="M235 270 A110 110 0 0 1 235 530"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <rect
              x="1165"
              y="220"
              width="195"
              height="360"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <rect
              x="1280"
              y="295"
              width="80"
              height="210"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <path
              d="M1165 270 A110 110 0 0 0 1165 530"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <path
              d="M40 68 A28 28 0 0 1 68 40"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <path
              d="M1332 68 A28 28 0 0 0 1304 40"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <path
              d="M40 732 A28 28 0 0 0 68 760"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
            <path
              d="M1332 732 A28 28 0 0 1 1304 760"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
          </svg>
        </div>

        <div className="relative z-10 px-8 md:px-16 xl:px-24 py-28">
          <div className="max-w-[1500px] mx-auto">
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-0.5 bg-red-500" />
                <span className="text-xs font-bold tracking-[0.28em] uppercase text-gray-600">
                  The Tools
                </span>
              </div>
              <h2
                className="font-black text-white leading-tight"
                style={{ fontSize: "clamp(42px,5vw,72px)" }}
              >
                What AI can do
                <br />
                <span className="text-gray-700">for your collection.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative flex items-start gap-7 p-9 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  />
                  <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <span
                    className="absolute bottom-5 right-7 font-black leading-none select-none"
                    style={{ fontSize: 76, color: "rgba(255,255,255,0.035)" }}
                  >
                    {tool.num}
                  </span>
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <tool.icon
                      size={26}
                      className="text-white group-hover:text-red-400 transition-colors duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 block mb-3">
                      {tool.subtitle}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-3 leading-tight">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-500 transition-colors">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 mt-6 text-sm font-black uppercase tracking-wider text-gray-700 group-hover:text-white transition-colors duration-300">
                      {tool.action}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1.5 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-black px-8 md:px-16 xl:px-24 py-36 overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(230,57,70,0.4),transparent)",
          }}
        />

        <div className="relative z-10 max-w-[1500px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-14">
          <div>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-8 h-0.5 bg-red-500" />
              <span className="text-xs font-bold tracking-[0.28em] uppercase text-gray-600">
                Get Started
              </span>
            </div>
            <h2
              className="font-black text-white leading-tight mb-5"
              style={{ fontSize: "clamp(44px,5.5vw,78px)" }}
            >
              Ready to play
              <br />
              <span
                className="text-[#F5C842]"
                style={{ textShadow: "0 0 30px rgba(245,200,66,0.2)" }}
              >
                smarter?
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-sm leading-relaxed">
              Join thousands of collectors using MatchDays AI to win at the
              game.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 flex-shrink-0">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2.5 px-12 py-5 rounded-full font-black text-sm uppercase tracking-wider bg-white text-black hover:bg-gray-100 transition-all hover:scale-105"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/auctions"
              className="flex items-center justify-center gap-2 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-wider border border-white/12 text-white/40 hover:text-white hover:border-white/25 transition-all"
            >
              Browse Auctions
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.55;
          }
          100% {
            transform: translateY(-18px) scale(1.3);
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}
