"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Globe2,
  Wallet,
  ScanSearch,
  Users,
  ArrowUpRight,
} from "lucide-react";

export default function AboutUsSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 px-4 bg-white overflow-hidden">
      {/* Tło: Subtelna siatka techniczna */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="container-max relative z-10">
        {/* HEADER */}
        <div className="max-w-3xl mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Our Mission
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black tracking-tight leading-[0.95] mb-6 sm:mb-8"
          >
            We represent the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              New Era
            </span>{" "}
            of Football Commerce.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed font-medium max-w-2xl"
          >
            No more sketchy Facebook groups. No more fakes.
            <br />
            We built <strong>MatchDays</strong> to be the safest ecosystem for
            collectors in Europe. Powered by AI, secured by technology, driven
            by passion.
          </motion.p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[280px] sm:auto-rows-[300px]">
          {/* CARD 1: AI TECHNOLOGY (Large) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 row-span-2 relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-black p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
            {/* Dekoracyjne okręgi */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] group-hover:bg-red-600/30 transition-colors duration-500"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 sm:mb-6 border border-white/10">
                <ScanSearch className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                AI-Powered Authenticity.
              </h3>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-sm">
                Our "Smart Upload" algorithms analyze stitching, codes, and
                patterns in real-time. Fakes don't stand a chance.
              </p>
            </div>

            {/* Mockup wizualny skanowania */}
            <div className="relative z-10 mt-6 sm:mt-8 h-32 sm:h-48 bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4 opacity-50">
                <div className="h-2 bg-white/20 rounded w-3/4"></div>
                <div className="h-2 bg-white/20 rounded w-1/2"></div>
                <div className="h-32 bg-white/10 rounded col-span-2"></div>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: WALLET (Tall) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1 row-span-2 relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-50 border border-gray-200 p-6 sm:p-8 flex flex-col"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <Wallet className="w-48 h-48" />
            </div>

            <div className="mt-auto relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Anti-Fraud Wallet.
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                No more ghost bidders. We block funds before a bid is placed. If
                you win, the transaction is secure. If you lose, funds are
                released instantly.
              </p>
            </div>
          </motion.div>

          {/* CARD 3: EU SHIPPING (Square) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-1 relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-600 to-orange-600 p-6 sm:p-8 text-white flex flex-col justify-between"
          >
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 opacity-50" />
            </div>
            <Globe2 className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">27 Countries.</h3>
              <p className="text-red-100 text-xs sm:text-sm">One Market. Zero Borders.</p>
            </div>
          </motion.div>

          {/* CARD 4: COMMUNITY (Square) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="md:col-span-1 relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="flex -space-x-3 sm:-space-x-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500"
                >
                  {i === 3 ? "2k+" : ""}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Community.</h3>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">
                Join thousands of verified collectors.
              </p>
            </div>
          </motion.div>

          {/* CARD 5: STATS (Wide) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="md:col-span-2 lg:col-span-4 relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-900 p-6 sm:p-8 flex items-center justify-between"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-around w-full gap-6 sm:gap-8">
              <div className="text-center md:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">
                  15k+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest font-bold">
                  Active Users
                </div>
              </div>
              <div className="w-full h-px md:w-px md:h-16 bg-white/10"></div>
              <div className="text-center md:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-500 mb-1">
                  100%
                </div>
                <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest font-bold">
                  Verified Items
                </div>
              </div>
              <div className="w-full h-px md:w-px md:h-16 bg-white/10"></div>
              <div className="text-center md:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">
                  &lt; 24h
                </div>
                <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest font-bold">
                  Avg. Shipping
                </div>
              </div>
              <div className="w-full md:w-auto">
                <button className="w-full md:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-wide text-xs sm:text-sm">
                  Join the Revolution
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CSS dla animacji skanowania */}
      <style jsx>{`
        @keyframes scan {
          0%,
          100% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
        }
      `}</style>
    </section>
  );
}
