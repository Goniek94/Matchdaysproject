"use client";

import Link from "next/link";
import {
  ScanFace,
  BarChart3,
  Fingerprint,
  Wand2,
  ArrowUpRight,
  Zap,
  Cpu,
  ChevronRight
} from "lucide-react";

export default function AIToolsPage() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-white selection:bg-indigo-500/30 overflow-hidden">
      
      {/* --- BACKGROUND AMBIENT EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
      </div>

      <main className="relative z-10 pt-24 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-xl shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Cpu size={14} className="animate-pulse" />
            MatchDays Neural Engine 2.0
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            AI Built for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient bg-[length:200%_auto]">
              Collectors.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Discover a toolkit that changes the game. From automatic valuation to authenticity verification — everything powered by our advanced neural networks.
          </p>
        </div>

        {/* --- BENTO GRID V2 --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(100px,auto)]">

          {/* 1. SMART LISTING (Flagship - Largest Card) */}
          <div className="group md:col-span-6 lg:col-span-8 row-span-2 relative rounded-[2.5rem] bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 p-8 md:p-12 overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)]">
            {/* Scanner Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
            
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[400px]">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <ScanFace size={32} />
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
                    Flagship Feature
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Smart Listing AI</h3>
                <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
                  Upload photos, and we'll do the rest. Our AI recognizes the club, season, player, and details in a split second, filling out the form for you.
                </p>
              </div>

              {/* Interactive UI Element */}
              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm flex items-center justify-between group-hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0f172a] flex items-center justify-center text-[10px]">📸</div>
                      <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0f172a] flex items-center justify-center text-[10px]">🏷️</div>
                      <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0f172a] flex items-center justify-center text-[10px]">📝</div>
                   </div>
                   <div className="text-sm font-medium text-slate-300">
                      <span className="text-indigo-400 font-bold">3x Faster</span> than manual
                   </div>
                </div>
                <Link href="/add-listing" className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 hover:scale-110 transition-all shadow-lg shadow-indigo-500/40">
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </div>
            
            {/* Graphic Background */}
            <div className="absolute right-[-50px] top-[20%] w-[300px] h-[300px] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/20 blur-[80px] rounded-full group-hover:bg-indigo-600/30 transition-all duration-700"></div>
          </div>

          {/* 2. MARKET VALUE (Vertical Card) */}
          <div className="group md:col-span-6 lg:col-span-4 row-span-2 relative rounded-[2.5rem] bg-[#0f172a] border border-white/10 p-8 overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={24} />
              </div>
              
              <h3 className="text-2xl font-black mb-3 text-white">Market Value</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                We analyze thousands of auctions to provide you with a real price range. Don't sell below value.
              </p>

              {/* Fake Chart UI */}
              <div className="mt-auto bg-black/40 rounded-2xl p-5 border border-white/5 backdrop-blur-md">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Est. Price</span>
                  <span className="text-2xl font-black text-white">€145<span className="text-slate-500 text-lg">.00</span></span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[75%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                  <span>LOW: €120</span>
                  <span>HIGH: €180</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. VERIFIED CHECK (Small Square) */}
          <div className="group md:col-span-3 lg:col-span-4 relative rounded-[2.5rem] bg-[#0f172a] border border-white/10 p-8 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Fingerprint size={20} />
                  </div>
                  <div className="px-2 py-1 bg-blue-900/50 rounded text-[9px] font-bold text-blue-300 border border-blue-800">BETA</div>
                </div>
                <h3 className="text-xl font-bold mb-2">AI Authenticity</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Hybrid model analyzing fabric weaves and tags to support verifiers.
                </p>
             </div>
          </div>

          {/* 4. VISUALIZATION STUDIO (Small Square) */}
          <div className="group md:col-span-3 lg:col-span-4 relative rounded-[2.5rem] bg-[#0f172a] border border-white/10 p-8 overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
             
             <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/20 mb-4">
                  <Wand2 size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Studio</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Generate professional product photos. Background removal and retouching in 1 click.
                </p>
             </div>
          </div>

          {/* 5. CREDITS & PLAN (Wide Bottom Bar) */}
          <div className="group md:col-span-6 lg:col-span-4 relative rounded-[2.5rem] bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 p-8 overflow-hidden hover:border-amber-500/50 transition-all duration-500">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
             
             <div className="relative z-10 flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 mb-3">
                   <Zap size={20} className="text-amber-400 fill-amber-400 animate-pulse" />
                   <h3 className="text-lg font-bold text-amber-100">AI Credits</h3>
                </div>
                <p className="text-amber-200/60 text-xs mb-4">
                  Available in Premium and Elite plans. Pay only for what you use.
                </p>
                <Link href="/pricing" className="inline-flex items-center text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors gap-1 group-hover:gap-2">
                  View Plans <ChevronRight size={14} />
                </Link>
             </div>
          </div>

        </div>

        {/* --- BOTTOM CTA --- */}
        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest font-bold">Start using the technology of tomorrow</p>
          <div className="flex justify-center gap-4">
             <Link 
               href="/register" 
               className="px-8 py-4 bg-white text-black rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
             >
               Create Free Account
             </Link>
             <Link 
               href="/about" 
               className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white/5 hover:border-white/40 transition-all"
             >
               How it works?
             </Link>
          </div>
        </div>

      </main>
    </div>
  );
}