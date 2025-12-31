"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Swords,
  Trophy,
  Users,
  Clock,
  Flame,
  Star,
  ChevronRight,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";

export default function ArenaSection() {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "completed">(
    "live"
  );

  // Mock data for live matches
  const liveMatches = [
    {
      id: 1,
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      homeScore: 2,
      awayScore: 1,
      minute: 67,
      league: "Premier League",
      participants: 1247,
      prizePool: "$5,000",
      status: "live",
    },
    {
      id: 2,
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      homeScore: 1,
      awayScore: 1,
      minute: 45,
      league: "La Liga",
      participants: 2156,
      prizePool: "$8,500",
      status: "live",
    },
  ];

  const upcomingMatches = [
    {
      id: 3,
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      startTime: "2024-02-15T18:30:00",
      league: "Bundesliga",
      participants: 892,
      prizePool: "$4,200",
      status: "upcoming",
    },
    {
      id: 4,
      homeTeam: "PSG",
      awayTeam: "Marseille",
      startTime: "2024-02-15T20:00:00",
      league: "Ligue 1",
      participants: 1034,
      prizePool: "$3,800",
      status: "upcoming",
    },
  ];

  const userArenaStats = {
    totalPredictions: 156,
    correctPredictions: 98,
    accuracy: 62.8,
    currentStreak: 7,
    bestStreak: 15,
    totalWinnings: 2450,
    rank: 23,
    pointsThisWeek: 84,
  };

  const getTimeUntilMatch = (startTime: string) => {
    const now = new Date();
    const matchTime = new Date(startTime);
    const diff = matchTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Arena Header with Stats */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Title Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Swords className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-1">
                  Matchdays Arena
                </h2>
                <p className="text-white/80 text-sm font-medium">
                  Predict matches, compete with others, win prizes
                </p>
              </div>
            </div>
            <Link
              href="/arena"
              className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-lg flex items-center gap-2 group"
            >
              Enter Arena
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-white/80" size={18} />
                <span className="text-white/80 text-xs font-semibold uppercase">
                  Accuracy
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                {userArenaStats.accuracy}%
              </div>
              <div className="text-white/60 text-xs mt-1">
                {userArenaStats.correctPredictions}/
                {userArenaStats.totalPredictions} correct
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="text-orange-300" size={18} />
                <span className="text-white/80 text-xs font-semibold uppercase">
                  Streak
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                {userArenaStats.currentStreak}
              </div>
              <div className="text-white/60 text-xs mt-1">
                Best: {userArenaStats.bestStreak}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="text-yellow-300" size={18} />
                <span className="text-white/80 text-xs font-semibold uppercase">
                  Rank
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                #{userArenaStats.rank}
              </div>
              <div className="text-white/60 text-xs mt-1">Global ranking</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-green-300" size={18} />
                <span className="text-white/80 text-xs font-semibold uppercase">
                  Winnings
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                ${userArenaStats.totalWinnings}
              </div>
              <div className="text-white/60 text-xs mt-1">Total earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("live")}
              className={`flex-1 px-6 py-4 font-bold text-sm transition-colors relative ${
                activeTab === "live"
                  ? "text-red-600 bg-red-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activeTab === "live" ? "bg-red-600 animate-pulse" : ""
                  }`}
                ></div>
                Live Matches ({liveMatches.length})
              </div>
              {activeTab === "live" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 px-6 py-4 font-bold text-sm transition-colors relative ${
                activeTab === "upcoming"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock size={16} />
                Upcoming ({upcomingMatches.length})
              </div>
              {activeTab === "upcoming" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 px-6 py-4 font-bold text-sm transition-colors relative ${
                activeTab === "completed"
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Trophy size={16} />
                Completed
              </div>
              {activeTab === "completed" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "live" && (
            <div className="space-y-4">
              {liveMatches.map((match) => (
                <div
                  key={match.id}
                  className="border-2 border-red-200 rounded-xl p-5 bg-gradient-to-r from-red-50 to-white hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                      <span className="text-red-600 font-bold text-sm uppercase">
                        Live • {match.minute}'
                      </span>
                      <span className="text-gray-500 text-sm">
                        {match.league}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users size={14} />
                        <span className="font-semibold">
                          {match.participants}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs">
                        {match.prizePool}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">
                        {match.homeTeam}
                      </div>
                    </div>
                    <div className="px-6">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-black text-gray-900">
                          {match.homeScore}
                        </span>
                        <span className="text-2xl font-bold text-gray-400">
                          -
                        </span>
                        <span className="text-4xl font-black text-gray-900">
                          {match.awayScore}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        {match.awayTeam}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/arena/match/${match.id}`}
                    className="block w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all font-bold text-center group-hover:shadow-lg"
                  >
                    View Match & Predict
                  </Link>
                </div>
              ))}
            </div>
          )}

          {activeTab === "upcoming" && (
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <span className="text-blue-600 font-bold text-sm">
                        Starts in {getTimeUntilMatch(match.startTime)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {match.league}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users size={14} />
                        <span className="font-semibold">
                          {match.participants}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs">
                        {match.prizePool}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">
                        {match.homeTeam}
                      </div>
                    </div>
                    <div className="px-6">
                      <div className="text-2xl font-bold text-gray-400">VS</div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        {match.awayTeam}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/arena/match/${match.id}`}
                    className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-bold text-center group-hover:shadow-lg"
                  >
                    Make Your Prediction
                  </Link>
                </div>
              ))}
            </div>
          )}

          {activeTab === "completed" && (
            <div className="text-center py-12">
              <Trophy className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Completed Matches Yet
              </h3>
              <p className="text-gray-600">
                Your completed predictions will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Challenge Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Star className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-1">
                Weekly Challenge
              </h3>
              <p className="text-white/90 text-sm font-medium">
                Predict 10 matches correctly to win $500 bonus!
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden max-w-xs">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <span className="text-white font-bold text-sm">7/10</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/80 text-sm font-semibold mb-1">
              Time Left
            </div>
            <div className="text-3xl font-black text-white">2d 14h</div>
          </div>
        </div>
      </div>
    </div>
  );
}
