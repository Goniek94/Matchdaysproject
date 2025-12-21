"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialSeconds?: number;
}

export default function CountdownTimer({
  initialSeconds = 9234,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsUrgent(timeLeft <= 10 && timeLeft > 0);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = () => {
    if (timeLeft <= 10 && timeLeft > 0) {
      return `${seconds}s`;
    } else if (timeLeft > 0) {
      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      }
      return `${minutes}m ${seconds}s`;
    }
    return "Auction Ended";
  };

  return (
    <div
      className={`p-6 rounded-[2px] mb-8 transition-all duration-300 ${
        isUrgent
          ? "bg-red-50 border-2 border-red-500 animate-urgentPulse"
          : timeLeft === 0
          ? "bg-gray-100 border border-gray-400"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div
        className={`text-xs font-medium uppercase tracking-widest mb-2 transition-colors ${
          isUrgent ? "text-red-600 font-bold" : "text-gray-600"
        }`}
      >
        Auction ends in
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full transition-all ${
            isUrgent
              ? "bg-red-600 animate-urgentDotPulse"
              : "bg-black animate-pulse"
          }`}
        ></div>
        <div
          className={`text-4xl font-light transition-all ${
            isUrgent ? "text-red-600 font-medium text-5xl" : "text-black"
          }`}
        >
          {formatTime()}
        </div>
      </div>
    </div>
  );
}
