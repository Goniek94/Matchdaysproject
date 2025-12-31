import Link from "next/link";
import { Clock, CheckCircle, XCircle, Trophy } from "lucide-react";

export default function RecentMatchesSection() {
  const recentMatches = [
    {
      id: 1,
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      homeScore: 2,
      awayScore: 1,
      myPrediction: "2-1",
      result: "correct",
      pointsEarned: 15,
      date: "2024-02-10",
      league: "Premier League",
    },
    {
      id: 2,
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      homeScore: 1,
      awayScore: 3,
      myPrediction: "2-1",
      result: "incorrect",
      pointsEarned: 0,
      date: "2024-02-09",
      league: "La Liga",
    },
    {
      id: 3,
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      homeScore: 3,
      awayScore: 3,
      myPrediction: "3-3",
      result: "correct",
      pointsEarned: 20,
      date: "2024-02-08",
      league: "Bundesliga",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Matches</h2>
        <Link
          href="/matches/history"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        {recentMatches.map((match) => (
          <div
            key={match.id}
            className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${
              match.result === "correct"
                ? "border-green-200 bg-green-50/50"
                : "border-red-200 bg-red-50/50"
            }`}
          >
            {/* Match Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-xs text-gray-600">
                  {new Date(match.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">{match.league}</span>
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  match.result === "correct"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {match.result === "correct" ? (
                  <>
                    <CheckCircle size={14} />+{match.pointsEarned} pts
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    Incorrect
                  </>
                )}
              </div>
            </div>

            {/* Match Score */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="font-bold text-gray-900">{match.homeTeam}</div>
              </div>
              <div className="px-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-gray-900">
                    {match.homeScore}
                  </span>
                  <span className="text-xl font-bold text-gray-400">-</span>
                  <span className="text-2xl font-black text-gray-900">
                    {match.awayScore}
                  </span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="font-bold text-gray-900">{match.awayTeam}</div>
              </div>
            </div>

            {/* My Prediction */}
            <div className="text-center">
              <span className="text-xs text-gray-600">
                Your prediction:{" "}
                <span className="font-bold text-gray-900">
                  {match.myPrediction}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="text-indigo-600" size={20} />
            <span className="font-semibold text-gray-900">
              Last 7 Days Performance
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-indigo-600">35 pts</div>
            <div className="text-xs text-gray-600">Total earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
