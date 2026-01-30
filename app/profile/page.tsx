"use client";

import { useState } from "react";
import { User, Settings, Heart, Receipt } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Demo user data
  const userData = {
    username: "Demo User",
    email: "demo@matchdays.com",
    memberSince: "January 2024",
    totalPurchases: 12,
    totalSales: 8,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
              {userData.username.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">
                {userData.username}
              </h1>
              <p className="text-gray-500">{userData.email}</p>
              <p className="text-sm text-gray-400 mt-1">
                Member since {userData.memberSince}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-black">
                {userData.totalPurchases}
              </p>
              <p className="text-sm text-gray-600 uppercase font-medium">
                Purchases
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-black">
                {userData.totalSales}
              </p>
              <p className="text-sm text-gray-600 uppercase font-medium">
                Sales
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl font-black uppercase mb-6">
                Profile Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    value={userData.username}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-black uppercase mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-bold">Email Notifications</span>
                  <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold uppercase">
                    Enabled
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-bold">Push Notifications</span>
                  <button className="px-4 py-2 bg-gray-200 text-black rounded-lg text-sm font-bold uppercase">
                    Disabled
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-bold">Privacy Mode</span>
                  <button className="px-4 py-2 bg-gray-200 text-black rounded-lg text-sm font-bold uppercase">
                    Off
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-black uppercase mb-6">
                Favorite Items
              </h2>
              <div className="text-center py-12">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">
                  No favorite items yet
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Start adding items to your favorites!
                </p>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div>
              <h2 className="text-2xl font-black uppercase mb-6">
                Transaction History
              </h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-black transition-colors"
                  >
                    <div>
                      <p className="font-bold">Transaction #{item}</p>
                      <p className="text-sm text-gray-500">
                        January {item}, 2024
                      </p>
                    </div>
                    <span className="text-lg font-bold">$99.00</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="grid grid-cols-4 h-20">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "profile"
                ? "text-black bg-gray-50"
                : "text-gray-400"
            }`}
          >
            <User size={24} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "settings"
                ? "text-black bg-gray-50"
                : "text-gray-400"
            }`}
          >
            <Settings size={24} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "favorites"
                ? "text-black bg-gray-50"
                : "text-gray-400"
            }`}
          >
            <Heart size={24} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Favorites</span>
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "transactions"
                ? "text-black bg-gray-50"
                : "text-gray-400"
            }`}
          >
            <Receipt size={24} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
