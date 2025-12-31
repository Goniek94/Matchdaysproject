import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  ExternalLink,
} from "lucide-react";

export default function RankingSection() {
  // Mock data - will be from API in the future
  const rankingData = {
    myPosition: 23,
    myPoints: 184,
    myChange: 3, // +3 positions up
    nearby: [
      { rank: 21, username: "player21", points: 190, change: -1 },
      { rank: 22, username: "player22", points: 188, change: 0 },
      { rank: 23, username: "You", points: 184, change: 3, isMe: true },
      { rank: 24, username: "player24", points: 183, change: 0 },
      { rank: 25, username: "player25", points: 180, change: -2 },
    ],
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} className="text-green-600" />;
    if (change < 0) return <TrendingDown size={16} className="text-red-600" />;
    return <Minus size={16} className="text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-400";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Trophy className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Global Ranking</h2>
            <p className="text-sm text-gray-500">Your position in the league</p>
          </div>
        </div>
        <Link
          href="/ranking"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
        >
          View Full Ranking
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* Ranking Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Player
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pts
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Δ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rankingData.nearby.map((player) => (
              <tr
                key={player.rank}
                className={`transition-colors ${
                  player.isMe
                    ? "bg-indigo-50 hover:bg-indigo-100"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* Rank */}
                <td className="px-4 py-4">
                  <span
                    className={`text-lg font-bold ${
                      player.isMe ? "text-indigo-600" : "text-gray-900"
                    }`}
                  >
                    {player.rank}
                  </span>
                </td>

                {/* Username */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {player.isMe && (
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                    )}
                    <span
                      className={`font-semibold ${
                        player.isMe ? "text-indigo-600" : "text-gray-900"
                      }`}
                    >
                      {player.username}
                    </span>
                  </div>
                </td>

                {/* Points */}
                <td className="px-4 py-4 text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {player.points}
                  </span>
                </td>

                {/* Change */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    {getChangeIcon(player.change)}
                    <span
                      className={`text-sm font-semibold ${getChangeColor(
                        player.change
                      )}`}
                    >
                      {player.change !== 0 && Math.abs(player.change)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">Tip:</span> Earn points
          by predicting match results, winning auctions, and participating in
          events!
        </p>
      </div>
    </div>
  );
}
