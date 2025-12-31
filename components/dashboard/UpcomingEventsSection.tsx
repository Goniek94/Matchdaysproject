import Link from "next/link";
import { Calendar, Clock, Users, Gift, Zap } from "lucide-react";

export default function UpcomingEventsSection() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Champions League Final Prediction",
      description: "Predict the winner and score for massive rewards",
      date: "2024-06-01T20:00:00",
      participants: 5420,
      prizePool: "$10,000",
      type: "tournament",
      featured: true,
    },
    {
      id: 2,
      title: "Weekend Premier League Challenge",
      description: "Predict all 10 matches this weekend",
      date: "2024-02-17T12:00:00",
      participants: 2340,
      prizePool: "$2,500",
      type: "challenge",
      featured: false,
    },
    {
      id: 3,
      title: "Daily Prediction Streak Bonus",
      description: "Make predictions 7 days in a row for bonus points",
      date: "2024-02-15T00:00:00",
      participants: 8920,
      prizePool: "500 pts",
      type: "daily",
      featured: false,
    },
  ];

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diff = eventDate.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "tournament":
        return <Zap className="text-yellow-500" size={20} />;
      case "challenge":
        return <Gift className="text-purple-500" size={20} />;
      case "daily":
        return <Calendar className="text-blue-500" size={20} />;
      default:
        return <Calendar className="text-gray-500" size={20} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "tournament":
        return "from-yellow-400 to-orange-500";
      case "challenge":
        return "from-purple-400 to-pink-500";
      case "daily":
        return "from-blue-400 to-cyan-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
        <Link
          href="/events"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className={`relative border-2 rounded-xl p-5 transition-all hover:shadow-lg group ${
              event.featured
                ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {event.featured && (
              <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                ⭐ FEATURED
              </div>
            )}

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getEventColor(
                  event.type
                )} flex items-center justify-center flex-shrink-0`}
              >
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} />
                    <span className="font-semibold">
                      Starts in {getTimeUntil(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users size={14} />
                    <span className="font-semibold">
                      {event.participants.toLocaleString()} joined
                    </span>
                  </div>
                  <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                    {event.prizePool}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/events/${event.id}`}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold text-sm whitespace-nowrap shadow-md"
              >
                Join Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold mb-1">Don't miss out!</h3>
            <p className="text-sm text-white/90">
              Join events to earn extra points and prizes
            </p>
          </div>
          <Link
            href="/arena"
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all font-bold shadow-lg whitespace-nowrap"
          >
            Go to Arena
          </Link>
        </div>
      </div>
    </div>
  );
}
