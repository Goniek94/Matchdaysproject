import Link from "next/link";
import { Receipt, Star, ArrowRight } from "lucide-react";

export function DashboardBottomRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Receipt size={16} className="text-gray-700" />
          </div>
          <h3 className="text-base font-black text-gray-900">
            Payment History
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
          <Receipt size={36} className="mb-3 opacity-40" />
          <p className="text-sm font-medium text-gray-400">
            No payment history yet
          </p>
        </div>
      </div>

      {/* Arena CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-6 shadow-xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(236,72,153,0.2),transparent_60%)]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Star size={18} className="text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
              Matchdays Arena
            </span>
          </div>
          <h3 className="text-xl font-black text-white mb-2">Compete & Win</h3>
          <p className="text-sm text-gray-400 mb-5 leading-relaxed">
            Predict match results, climb the leaderboard, and win amazing
            prizes.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="text-xl font-black text-white">156</div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                Predictions
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="text-xl font-black text-white">#23</div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                Your Rank
              </div>
            </div>
          </div>

          <Link
            href="/arena"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg"
          >
            Enter Arena
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
