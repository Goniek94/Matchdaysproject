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
          Tools built for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Smart Collectors.
          </span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Supercharge your trading with AI. Verify authenticity, valuate items, and list in seconds.
        </p>
      </section>

      {/* BENTO GRID SECTION */}
      <section className="px-4 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* CARD 1: SMART LISTING (Największy - Główny Feature) */}
          <div className="group md:col-span-2 relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 md:p-12 text-white transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full group-hover:bg-indigo-600/30 transition-colors duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Sparkles size={28} className="text-indigo-300" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
                
                <h3 className="text-4xl font-bold mb-4 leading-tight">
                  Smart Listing Generator
                </h3>
                <p className="text-slate-400 text-lg max-w-md">
                  Upload one photo. Our AI identifies the kit, season, and player, then writes a pro description for you.
                </p>
              </div>

              <div className="mt-8">
                <Link 
                  href="/add-listing" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-indigo-50 transition-colors group-hover:gap-3"
                >
                  Try it now
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 2: LEGIT CHECK (Pionowy - Bezpieczeństwo) */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-200 p-8 transition-all duration-500 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100 hover:bg-white hover:scale-[1.01]">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={24} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Legit Check</h3>
              <p className="text-slate-500 mb-8 flex-1">
                AI analysis of crests, tags, and stitching patterns to detect fakes with 99.8% accuracy.
              </p>

              <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[99%] bg-blue-600 rounded-full"></div>
                </div>
                <span>99.8%</span>
              </div>
            </div>
          </div>

          {/* CARD 3: PRICE ORACLE (Pionowy - Dane) */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-200 p-8 transition-all duration-500 hover:border-green-200 hover:shadow-xl hover:shadow-green-100 hover:bg-white hover:scale-[1.01]">
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={24} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Price Oracle</h3>
              <p className="text-slate-500 mb-6 flex-1">
                Real-time valuation based on historical sales from eBay, Vinted, and StockX.
              </p>

              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Est. Value</span>
                  <span className="text-green-600 font-bold">+12%</span>
                </div>
                <div className="text-xl font-black text-slate-900">€145 - €180</div>
              </div>
            </div>
          </div>

          {/* CARD 4: VISUAL FINDER (Poziomy - Szeroki) */}
          <div className="group md:col-span-2 relative overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-200 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8 transition-all duration-500 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100 hover:bg-white hover:scale-[1.01]">
            <div className="flex-1 z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform duration-300">
                <Search size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Visual Finder</h3>
              <p className="text-slate-500 text-lg mb-6">
                Saw a kit on TV? Upload a screenshot. We'll find exactly where you can buy it on MatchDays.
              </p>
              <button className="text-orange-600 font-bold text-sm uppercase tracking-wider hover:text-orange-700 flex items-center gap-2 group/btn">
                Start Visual Search 
                <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"/>
              </button>
            </div>

            {/* Wizualizacja 'skanowania' */}
            <div className="relative w-full md:w-64 h-48 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
               <ScanLine size={48} className="text-slate-200 absolute" />
               <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 via-orange-500/10 to-orange-500/0 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-[1.5s] ease-in-out"></div>
            </div>
          </div>

           {/* CARD 5: STATS / CTA (Mały kwadrat) */}
           <div className="group relative overflow-hidden rounded-[2rem] bg-indigo-600 p-8 flex flex-col justify-center items-center text-center text-white transition-all duration-500 hover:bg-indigo-700 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/30">
              <Zap size={32} className="mb-4 text-indigo-200 animate-pulse" />
              <div className="text-4xl font-black mb-1">5M+</div>
              <div className="text-indigo-100 text-sm font-medium">Shirts Analyzed</div>
           </div>

        </div>
      </section>
    </div>
  );
}