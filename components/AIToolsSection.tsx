"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  ScanEye,
  TrendingUp,
  Wand2,
  Lock,
  FileBadge,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AIToolsSection() {
  const aiFeatures = [
    {
      icon: ShieldCheck,
      title: "AI Authenticity Verification",
      description:
        "Core system analyzing photos (logos, stitching, patterns) to assess authenticity probability using Computer Vision.",
      gradient: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      icon: ScanEye,
      title: "Condition Scoring",
      description:
        "Automated physical state assessment (1-10 scale) detecting defects like fading or fabric damage.",
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      span: "md:col-span-1",
    },
    {
      icon: TrendingUp,
      title: "Smart Valuation",
      description:
        "Data-driven price recommendations based on historical sales, rarity, and current market trends.",
      gradient: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      span: "md:col-span-1",
    },
    {
      icon: Wand2,
      title: "Auto-Descriptions",
      description:
        "Instant generation of SEO-friendly titles and standardized descriptions using LLMs.",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      span: "md:col-span-1",
    },
    {
      icon: Lock,
      title: "Fraud Detection",
      description:
        "Real-time analysis of pricing anomalies and account relationships to flag suspicious activity.",
      gradient: "from-red-500 to-rose-600",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      span: "md:col-span-1",
    },
    {
      icon: FileBadge,
      title: "Digital Certification",
      description:
        "Unique digital assets tracking the item's history, expert decisions, and provenance.",
      gradient: "from-cyan-500 to-blue-600",
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      span: "md:col-span-2",
    },
  ];

  return (
    <section
      id="ai-tools"
      className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container-max relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
            <span className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-wider">
              MatchDays AI Core
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-tight mb-4 sm:mb-6">
            Powered by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Artificial Intelligence
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Our advanced AI systems work 24/7 to ensure authenticity, fair
            pricing, and a seamless experience for buyers and sellers.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-[minmax(200px,auto)]">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative ${feature.span} bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-6 sm:p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden`}
              >
                {/* Gradient Overlay on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${feature.iconBg} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-400 group-hover:text-gray-900 transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 md:mt-20"
        >
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Want to see our AI in action?
          </p>
          <a
            href="/add-listing"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm sm:text-base rounded-full hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
          >
            <span>Try Smart Upload</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
