"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Hero — 4 centred slides.
 *
 * No side cards, no widgets — just one focused, well-typeset slide at a time:
 *   01. Who we are
 *   02. What you'll find
 *   03. How it works
 *   04. Join the community
 *
 * Each slide reveals an eyebrow → big headline → short description → optional
 * "supporting strip" (categories, steps or stats — text only, no boxed cards)
 * → two CTAs. Background image cross-fades, parallax follows the cursor.
 */

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as any;
const SLIDE_DURATION_MS = 8000;

// ─── Slide content ───────────────────────────────────────────────────────────

type Slide = {
  id: string;
  number: string;
  eyebrow: string;
  category: string;
  headline1: string;
  headline2: string;
  description: string;
  /** Optional supporting strip rendered below the description. Plain text — no cards. */
  strip?:
    | { type: "tags"; items: string[] }
    | { type: "steps"; items: { n: string; label: string }[] }
    | { type: "stats"; items: { value: string; label: string }[] };
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
};

const SLIDES: Slide[] = [
  {
    id: "who",
    number: "01",
    eyebrow: "Who We Are",
    category: "Sports Memorabilia",
    headline1: "The Home of",
    headline2: "Sports Collectibles.",
    description:
      "Built by collectors, for collectors. A premium marketplace for authentic jerseys, signed items and match-worn gear from football, basketball, hockey and beyond.",
    primaryCta: { label: "Browse Listings", href: "/auctions" },
    secondaryCta: { label: "About Us", href: "/about" },
    // Empty stadium at golden hour — premium, classic, "the home of"
    image:
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2500&auto=format&fit=crop",
  },
  {
    id: "what",
    number: "02",
    eyebrow: "What You'll Find",
    category: "The Catalogue",
    headline1: "Football, Basketball,",
    headline2: "Match-Worn & Rare.",
    description:
      "Every era, every league, every legend. From classic 90s kits to last season's signed shirts — curated, categorised and ready to bid on.",
    strip: {
      type: "tags",
      items: [
        "Football Jerseys",
        "Signed Shirts",
        "Match-Worn",
        "Boots",
        "Basketball Kits",
        "Hockey Gear",
        "Vintage",
      ],
    },
    primaryCta: { label: "Explore Catalogue", href: "/auctions" },
    secondaryCta: { label: "Featured Items", href: "/auctions?featured=1" },
    // Jerseys hanging in a sport store — fits "what you'll find"
    image:
      "https://images.unsplash.com/photo-1556906903-7a3037c87bbf?q=80&w=2500&auto=format&fit=crop",
  },
  {
    id: "how",
    number: "03",
    eyebrow: "How It Works",
    category: "The Process",
    headline1: "List, Verify,",
    headline2: "Bid, Win.",
    description:
      "Sellers list in minutes — every item is AI-scanned for authenticity before going live. Buyers bid in real time. Winners ship protected end-to-end.",
    strip: {
      type: "steps",
      items: [
        { n: "01", label: "List" },
        { n: "02", label: "AI Verify" },
        { n: "03", label: "Bid Live" },
        { n: "04", label: "Win & Ship" },
      ],
    },
    primaryCta: { label: "Start Selling", href: "/add-listing" },
    secondaryCta: { label: "How AI Works", href: "/aitools" },
    // Football action moment — energy, intensity, "bid live"
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2500&auto=format&fit=crop",
  },
  {
    id: "join",
    number: "04",
    eyebrow: "Join Us",
    category: "The Community",
    headline1: "Where Collectors",
    headline2: "Trade Daily.",
    description:
      "10,000+ active listings. Bidders win every minute. Sellers move rare items in days, not weeks. The standard is authenticity.",
    strip: {
      type: "stats",
      items: [
        { value: "10K+", label: "Listings" },
        { value: "4.9★", label: "Trust" },
        { value: "AI", label: "Verified" },
        { value: "EU", label: "Shipping" },
      ],
    },
    primaryCta: { label: "Create Account", href: "/register" },
    secondaryCta: { label: "Browse Now", href: "/auctions" },
    // Stadium full of fans at night — community, scale, "join us"
    image:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2500&auto=format&fit=crop",
  },
];

// ─── Bottom ticker ───────────────────────────────────────────────────────────

const TICKER = [
  "Football Jerseys",
  "Signed Shirts",
  "Basketball Kits",
  "Match-Worn Items",
  "Rare Collectibles",
  "Hockey Gear",
  "Motorsport",
  "Vintage Kits",
  "AI Verified",
];

function Ticker() {
  const items = [...TICKER, ...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap w-max py-3"
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-5"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.26em",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
            }}
          >
            {item}
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Supporting strip variants ───────────────────────────────────────────────

function StripTags({ items }: { items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className="flex items-center justify-center gap-x-3 gap-y-2 flex-wrap"
      style={{ maxWidth: 720, margin: "0 auto" }}
    >
      {items.map((tag) => (
        <span
          key={tag}
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            padding: "7px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(8px)",
            whiteSpace: "nowrap",
          }}
        >
          {tag}
        </span>
      ))}
    </motion.div>
  );
}

function StripSteps({
  items,
}: {
  items: { n: string; label: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className="flex items-center justify-center gap-2 sm:gap-6 flex-wrap"
      style={{ maxWidth: 760, margin: "0 auto" }}
    >
      {items.map((step, i) => (
        <div key={step.n} className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#e11d48",
                letterSpacing: "0.15em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {step.n}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {step.label}
            </span>
          </div>
          {i < items.length - 1 && (
            <span
              style={{
                width: 24,
                height: 1,
                background: "rgba(255,255,255,0.18)",
                display: "inline-block",
              }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}

function StripStats({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className="grid grid-cols-4 gap-4 sm:gap-10"
      style={{ maxWidth: 640, margin: "0 auto" }}
    >
      {items.map((s, i) => (
        <div key={s.label} className="text-center relative">
          <div
            style={{
              fontSize: "clamp(1.7rem, 2.4vw, 2.4rem)",
              fontWeight: 900,
              color: i === 1 ? "#e11d48" : "#fff",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textShadow:
                i === 1
                  ? "0 0 30px rgba(225,29,72,0.4)"
                  : "0 2px 14px rgba(0,0,0,0.7)",
              marginBottom: 6,
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
            }}
          >
            {s.label}
          </div>
          {/* subtle vertical divider between columns */}
          {i < items.length - 1 && (
            <span
              className="hidden sm:block"
              style={{
                position: "absolute",
                right: -20,
                top: "20%",
                bottom: "20%",
                width: 1,
                background: "rgba(255,255,255,0.07)",
              }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}

// ─── Pagination dots ─────────────────────────────────────────────────────────

function SlideDots({
  total,
  current,
  onSelect,
  paused,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
  paused: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="group relative"
            style={{ padding: 4 }}
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              style={{
                width: isActive ? 36 : 8,
                height: 8,
                borderRadius: 4,
                background: isActive ? "#e11d48" : "rgba(255,255,255,0.18)",
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isActive && !paused && (
                <motion.div
                  key={`progress-${current}`}
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{
                    duration: SLIDE_DURATION_MS / 1000,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,255,255,0.4)",
                  }}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 25, damping: 28 });
  const sy = useSpring(my, { stiffness: 25, damping: 28 });

  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, SLIDE_DURATION_MS);
    return () => clearInterval(t);
  }, [next, paused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onMouse = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 8);
  };

  const current = SLIDES[slide];

  return (
    <section
      ref={ref}
      onMouseMove={onMouse}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full bg-black overflow-hidden flex flex-col"
      // Sized to comfortably hold the centred content + slide controls +
      // ticker without clipping the eyebrow row at top. Was 58vh/480 — that
      // was clipping on tablet and short laptops because the content stack
      // (eyebrow + 2 headlines + description + strip + CTAs) needs ~520px
      // alone, then the bottom controls + ticker eat another ~120px.
      style={{ height: "min(720px, 70vh)", minHeight: 620 }}
    >
      {/* Background images cross-fade */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={current.image}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <motion.div
            className="absolute bg-cover bg-center"
            style={{
              inset: "-5%",
              backgroundImage: `url(${current.image})`,
              x: sx,
              y: sy,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Vignette overlays — keep type readable on any photo */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        style={{
          width: 240,
          height: 2,
          background:
            "linear-gradient(to right, transparent, #e11d48, transparent)",
        }}
      />

      {/* Centred content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto flex flex-col items-center text-center"
          >
            {/* Eyebrow row: number · category · live dot */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.4em",
                  color: "rgba(255,255,255,0.35)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {current.number}
              </span>
              <span
                style={{
                  width: 28,
                  height: 1,
                  background: "rgba(255,255,255,0.2)",
                }}
              />
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#e11d48",
                    boxShadow: "0 0 8px #e11d48",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.32em",
                    color: "#fb7185",
                    textTransform: "uppercase",
                  }}
                >
                  {current.eyebrow}
                </span>
              </span>
              <span
                style={{
                  width: 28,
                  height: 1,
                  background: "rgba(255,255,255,0.2)",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.32em",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                }}
              >
                {current.category}
              </span>
            </motion.div>

            {/* Headline 1 — smaller, leaves more room for content below */}
            <div style={{ overflow: "hidden", marginBottom: "0.05em" }}>
              <motion.h1
                initial={{ y: "102%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 0.75, ease: EASE }}
                style={{
                  fontSize: "clamp(1.6rem, 3.6vw, 3.4rem)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  textShadow: "0 4px 30px rgba(0,0,0,0.85)",
                }}
              >
                {current.headline1}
              </motion.h1>
            </div>

            {/* Headline 2 — rose accent */}
            <div style={{ overflow: "hidden", marginBottom: "1.2rem" }}>
              <motion.h1
                initial={{ y: "102%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 0.75, ease: EASE }}
                style={{
                  fontSize: "clamp(1.6rem, 3.6vw, 3.4rem)",
                  fontWeight: 900,
                  color: "#e11d48",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  textShadow:
                    "0 4px 30px rgba(0,0,0,0.85), 0 0 80px rgba(225,29,72,0.25)",
                }}
              >
                {current.headline2}
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              style={{
                fontSize: "clamp(0.9rem, 1.05vw, 1.05rem)",
                lineHeight: 1.6,
                maxWidth: 620,
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.005em",
                textShadow: "0 1px 14px rgba(0,0,0,0.85)",
                marginBottom: current.strip ? "1.4rem" : "1.8rem",
              }}
            >
              {current.description}
            </motion.p>

            {/* Optional supporting strip — text-only, centred */}
            {current.strip?.type === "tags" && (
              <div className="mb-6">
                <StripTags items={current.strip.items} />
              </div>
            )}
            {current.strip?.type === "steps" && (
              <div className="mb-6">
                <StripSteps items={current.strip.items} />
              </div>
            )}
            {current.strip?.type === "stats" && (
              <div className="mb-6">
                <StripStats items={current.strip.items} />
              </div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <Link
                href={current.primaryCta.href}
                className="group inline-flex items-center gap-3 font-black rounded-full
                  hover:scale-[1.04] active:scale-[0.97] transition-transform duration-200"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.02em",
                  padding: "14px 28px",
                  background: "#fff",
                  color: "#000",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                {current.primaryCta.label}
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded-full
                    group-hover:translate-x-0.5 transition-transform duration-200"
                  style={{
                    width: 26,
                    height: 26,
                    background: "#e11d48",
                    boxShadow: "0 0 14px rgba(225,29,72,0.55)",
                  }}
                >
                  <ArrowRight size={12} color="white" />
                </span>
              </Link>

              <Link
                href={current.secondaryCta.href}
                className="inline-flex items-center font-semibold rounded-full
                  transition-all duration-200 hover:bg-white/10 hover:border-white/35 hover:text-white"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.02em",
                  padding: "13px 24px",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {current.secondaryCta.label}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide controls */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-6 md:px-12 lg:px-20 py-3.5">
        {/* Slide counter (left) */}
        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: "#fff",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.05em",
            }}
          >
            {String(slide + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              width: 24,
              height: 1,
              background: "rgba(255,255,255,0.25)",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.05em",
            }}
          >
            {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Pagination dots (centre) */}
        <SlideDots
          total={SLIDES.length}
          current={slide}
          onSelect={setSlide}
          paused={paused}
        />

        {/* Prev / Next (right) */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="flex items-center justify-center rounded-full transition-all hover:bg-white/10 hover:border-white/30"
            style={{
              width: 36,
              height: 36,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <ArrowRight size={13} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="flex items-center justify-center rounded-full transition-all hover:bg-white/10 hover:border-white/30"
            style={{
              width: 36,
              height: 36,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Bottom ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Ticker />
      </motion.div>
    </section>
  );
}
