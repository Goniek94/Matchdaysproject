"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ScanLine, // Weryfikacja
  Sparkles, // Opisy
  BarChart3, // Wycena
  Search, // Szukanie
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
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
      href: "/ai/verify", // Placeholder na przyszłość
      action: "Start Verification",
      features: ["99.8% Accuracy", "Instant Result", "PDF Certificate"],
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "description",
      title: "Smart Listing",
      subtitle: "Description Generator",
      description:
        "Don't know what to write? Upload a photo of your shirt. AI will identify the season, player, and condition, then generate a pro description.",
      icon: Sparkles,
      href: "/add-listing?flow=ai_assist", // To linkuje do Twojego Wizarda!
      action: "Create Listing",
      features: ["Auto-Identification", "SEO Keywords", "Saves Time"],
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      button: "bg-purple-600 hover:bg-purple-700",
    },
    {
      id: "valuation",
      title: "Price Oracle",
      subtitle: "Market Valuation",
      description:
        "Wondering how much it's worth? We analyze historical sales data from eBay, Vinted, and StockX to give you a fair market price.",
      icon: BarChart3,
      href: "/ai/valuation", // Placeholder
      action: "Check Value",
      features: ["Real Sales Data", "Price Trends", "Profit Calculator"],
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      button: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "finder",
      title: "Visual Finder",
      subtitle: "Image Search",
      description:
        "Saw a kit you like on TV or Instagram? Upload a screenshot. We'll find exactly where you can buy it on MatchDays.",
      icon: Search,
      href: "/ai/search", // Placeholder
      action: "Find Jersey",
      features: ["Image Recognition", "Find Similar", "Direct Purchase"],
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      button: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  return (
    <main className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-max mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest mb-8">
            <BrainCircuit size={16} />
            MatchDays Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-6">
            Your Collection.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Supercharged by AI.
            </span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
            We've trained our models on over 5 million football shirts. Use
            these tools to verify authenticity, value your items, and sell
            faster than ever before.
          </p>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="py-20 px-6 md:px-12 pb-32">
        <div className="container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`relative overflow-hidden rounded-3xl border-2 ${tool.border} bg-white p-8 md:p-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group`}
              >
                {/* Background Decoration */}
                <div
                  className={`absolute top-0 right-0 w-64 h-64 ${tool.bg} rounded-full blur-3xl opacity-50 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}
                ></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div
                      className={`w-16 h-16 rounded-2xl ${tool.bg} flex items-center justify-center ${tool.color}`}
                    >
                      <tool.icon size={32} strokeWidth={1.5} />
                    </div>
                    <div
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white border ${tool.border} text-gray-500`}
                    >
                      {tool.subtitle}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {tool.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-10">
                    {tool.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm font-medium text-gray-700"
                      >
                        <CheckCircle2 size={18} className={tool.color} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action */}
                  <Link
                    href={tool.href}
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl ${tool.button}`}
                  >
                    {tool.action}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
