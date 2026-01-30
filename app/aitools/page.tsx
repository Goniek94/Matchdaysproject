"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
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

export default function AIToolsPage() {
  const tools = [
    {
      id: "verify",
      title: "Legit Check",
      subtitle: "AI Authentication",
      description:
        "Upload photos of tags, stitching, and crests. Our AI compares them against millions of authentic samples to detect fakes instantly.",
      icon: ScanLine,
      href: "/ai/verify",
      action: "Start Verification",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      glowColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      id: "description",
      title: "Smart Listing",
      subtitle: "Description Generator",
      description:
        "Don't know what to write? Upload a photo of your shirt. AI will identify the season, player, and condition, then generate a pro description.",
      icon: Sparkles,
      href: "/add-listing?flow=ai_assist",
      action: "Create Listing",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      glowColor: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      id: "valuation",
      title: "Price Oracle",
      subtitle: "Market Valuation",
      description:
        "Wondering how much it's worth? We analyze historical sales data from eBay, Vinted, and StockX to give you a fair market price.",
      icon: BarChart3,
      href: "/ai/valuation",
      action: "Check Value",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      glowColor: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      id: "finder",
      title: "Visual Finder",
      subtitle: "Image Search",
      description:
        "Saw a kit you like on TV or Instagram? Upload a screenshot. We'll find exactly where you can buy it on MatchDays.",
      icon: Search,
      href: "/ai/search",
      action: "Find Jersey",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      glowColor: "bg-orange-500/20",
      iconColor: "text-orange-400",
    },
  ];

  const stats = [
    { icon: Zap, value: "99.8%", label: "Accuracy Rate" },
    { icon: Shield, value: "5M+", label: "Items Analyzed" },
    { icon: TrendingUp, value: "50K+", label: "Users Trust Us" },
    { icon: Eye, value: "<1s", label: "Response Time" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 md:px-12">
          <div className="container mx-auto max-w-7xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm font-bold uppercase tracking-widest text-blue-300">
                MatchDays Intelligence
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <span className="block text-white">Your Collection.</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-gradient">
                Supercharged by AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1200">
              We've trained our models on over{" "}
              <span className="text-white font-bold">5 million</span> football
              shirts. Use these tools to verify authenticity, value your items,
              and sell faster than ever before.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-1000"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-black text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="pb-32 px-6 md:px-12">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom duration-1000"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 ${tool.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`}
                  ></div>

                  {/* Gradient Border Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10 p-8 md:p-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}
                      >
                        <tool.icon size={32} className="text-white" />
                      </div>
                      <div className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300">
                        {tool.subtitle}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                      {tool.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-gray-400 leading-relaxed mb-8">
                      {tool.description}
                    </p>

                    {/* Action Button */}
                    <Link
                      href={tool.href}
                      className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r ${tool.gradient} text-white font-bold text-sm uppercase tracking-wider transition-all shadow-2xl hover:shadow-3xl hover:scale-105 group/btn`}
                    >
                      <span>{tool.action}</span>
                      <ArrowRight
                        size={18}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>

                  {/* Animated Corner Accent */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.gradient} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-500`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-32 px-6 md:px-12">
          <div className="container mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 md:p-16 text-center">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>

              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of collectors using AI to authenticate, value,
                  and sell their items faster.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black text-lg rounded-xl hover:scale-105 transition-all shadow-2xl uppercase"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={24} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - dostosowany do czarnego tła */}
        <div className="bg-gray-900 border-t border-gray-800">
          <Footer />
        </div>
      </div>
    </div>
  );
}
