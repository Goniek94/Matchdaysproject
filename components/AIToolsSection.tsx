"use client";

import Link from "next/link";
import {
  ScanLine,
  Sparkles,
  BarChart3,
  Search,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  BrainCircuit,
  Camera,
  Coins
} from "lucide-react";

export default function AIToolsPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      
      {/* HEADER SECTION */}
      <section className="pt-12 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <BrainCircuit size={16} className="text-indigo-600" />
          MatchDays Intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          Technology organizing the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Sports Collectibles Market.
          </span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          We use AI not as a gadget, but as a real tool to support verification, valuation, and listing.
        </p>
      </section>

      {/* BENTO GRID SECTION */}
      <section className="px-4 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* CARD 1: SMART LISTING (Największy - Główny Feature) */}
          <div className="group md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full group-hover:bg-indigo-600/30 transition-colors duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Sparkles size={28} className="text-indigo-300" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    Core Feature
                  </span>
                </div>
                
                <h3 className="text-4xl font-bold mb-4 leading-tight">
                  Smart Listing AI
                </h3>
                <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                  An intelligent form that analyzes photos, recognizes logos and details, detects inconsistencies, and auto-completes data.
                </p>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium">Auto-Recognition</span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium">Data Consistency</span>
                </div>

                <Link 
                  href="/add-listing" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-indigo-50 transition-colors group-hover:gap-3"
                >
                  Create Smart Listing
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 2: MARKET VALUE (Pionowy) */}
          <div className="group md:col-span-1 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8 transition-all duration-500 hover:border-green-200 hover:shadow-xl hover:shadow-green-100 hover:bg-white hover:scale-[1.01]">
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={24} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Market Value</h3>
              <p className="text-slate-500 mb-6 flex-1 leading-relaxed">
                Analysis of historical transactions and trends to suggest real price ranges and avoid undervaluing.
              </p>

              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-4 group-hover:border-green-100 transition-colors">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Suggested Price</span>
                  <span className="text-green-600 font-bold">High Demand</span>
                </div>
                <div className="text-xl font-black text-slate-900">€145 - €180</div>
              </div>
            </div>
          </div>

          {/* CARD 3: VERIFIED CHECK (Kwadrat) */}
          <div className="group md:col-span-1 md:row-span-1 relative overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8 transition-all duration-500 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100 hover:bg-white hover:scale-[1.01]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Verified Check</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Hybrid model (AI + Human) analyzing patterns to certify authenticity.
              </p>
            </div>
          </div>

          {/* CARD 4: VISUALIZATION (Kwadrat) */}
          <div className="group md:col-span-1 md:row-span-1 relative overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8 transition-all duration-500 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100 hover:bg-white hover:scale-[1.01]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform duration-300">
                <Camera size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Visualization</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Present your item on a model or in a catalog style with AI generation.
              </p>
            </div>
          </div>

           {/* CARD 5: AI CREDITS (Szeroki pasek na dole) */}
           <div className="group md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 flex flex-col md:flex-row items-center justify-between text-white transition-all duration-500 hover:bg-indigo-700 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/30">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                 <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Coins size={24} className="text-white" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold">Simple Model: AI Credits</h3>
                    <p className="text-indigo-200 text-sm">Pay only for what you use. 1 Tool = 1 Credit.</p>
                 </div>
              </div>
              <div className="px-5 py-2 bg-white text-indigo-600 rounded-full font-bold text-sm">
                Available in Plans
              </div>
           </div>

           {/* CARD 6: TRUST (Mały) */}
           <div className="group md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gray-100 border border-gray-200 p-8 flex flex-col justify-center transition-all duration-500 hover:bg-white hover:border-gray-300 hover:shadow-lg hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-2">
                 <Zap size={20} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
                 <h3 className="font-bold text-slate-900">Foundation of Trust</h3>
              </div>
              <p className="text-sm text-slate-500">
                 AI doesn't replace people. It acts as a layer supporting safety, quality, and market scale.
              </p>
           </div>

        </div>
      </section>
    </div>
  );
}