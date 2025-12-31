import { Target, TrendingUp, Flame, BarChart3 } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: <Target size={20} />,
      label: "Total Predictions",
      value: "127",
      color: "from-blue-500 to-cyan-500",
      tooltip: "Total number of predictions made",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Accuracy",
      value: "68%",
      color: "from-green-500 to-emerald-500",
      tooltip: "Percentage of correct predictions",
    },
    {
      icon: <Flame size={20} />,
      label: "Best Streak",
      value: "12",
      color: "from-orange-500 to-red-500",
      tooltip: "Longest streak of correct predictions",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Avg Points/Week",
      value: "8.4",
      color: "from-purple-500 to-pink-500",
      tooltip: "Average points per week",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer hover:shadow-md"
          >
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}
            >
              {stat.icon}
            </div>
            <div className="text-2xl font-black text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {stat.label}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {stat.tooltip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
