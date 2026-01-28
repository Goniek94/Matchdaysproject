"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import Link from "next/link";
import {
  Settings,
  CreditCard,
  Heart,
  Package,
  TrendingUp,
  Shield,
  CheckCircle2,
  XCircle,
  Sparkles,
  Receipt,
  Crown,
  PlusCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await authApi.checkAuth();
      if (response.success && response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your dashboard
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Mock data - replace with real data from API
  const userProfile = {
    firstName: "John",
    lastName: "Doe",
    email: userData?.email || "user@example.com",
    isVerified: true,
    subscriptionTier: "premium",
    subscriptionExpiry: "2024-12-31",
    totalListings: 12,
    favoriteItems: 8,
  };

  const stats = [
    {
      label: "Active Listings",
      value: "12",
      icon: <Package size={20} />,
      color: "bg-blue-500",
    },
    {
      label: "Favorites",
      value: "8",
      icon: <Heart size={20} />,
      color: "bg-red-500",
    },
    {
      label: "Total Bids",
      value: "24",
      icon: <TrendingUp size={20} />,
      color: "bg-green-500",
    },
    {
      label: "Success Rate",
      value: "87%",
      icon: <CheckCircle2 size={20} />,
      color: "bg-purple-500",
    },
  ];

  const recentPayments = [
    {
      id: 1,
      description: "Premium Subscription",
      amount: "$29.99",
      date: "2024-02-15",
      status: "completed",
    },
    {
      id: 2,
      description: "Listing Fee",
      amount: "$4.99",
      date: "2024-02-10",
      status: "completed",
    },
    {
      id: 3,
      description: "Featured Listing",
      amount: "$9.99",
      date: "2024-02-05",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Manage your account and listings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {userProfile.firstName[0]}
                  {userProfile.lastName[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {userProfile.firstName} {userProfile.lastName}
                  </h2>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                </div>
              </div>

              {/* Verification Status */}
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-4 ${
                  userProfile.isVerified
                    ? "bg-green-50 border border-green-200"
                    : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                {userProfile.isVerified ? (
                  <>
                    <CheckCircle2 className="text-green-600" size={20} />
                    <span className="text-sm font-semibold text-green-900">
                      Verified Account
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-yellow-600" size={20} />
                    <span className="text-sm font-semibold text-yellow-900">
                      Not Verified
                    </span>
                  </>
                )}
              </div>

              {/* Subscription Status */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="text-purple-600" size={20} />
                  <span className="font-bold text-purple-900 capitalize">
                    {userProfile.subscriptionTier} Plan
                  </span>
                </div>
                <p className="text-xs text-purple-700">
                  Expires: {userProfile.subscriptionExpiry}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userProfile.totalListings}
                  </div>
                  <div className="text-xs text-gray-600">Listings</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userProfile.favoriteItems}
                  </div>
                  <div className="text-xs text-gray-600">Favorites</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/add-listing"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  <PlusCircle size={20} />
                  <span>Add Listing</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold text-gray-700"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/subscription"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors font-semibold text-purple-700"
                >
                  <Crown size={20} />
                  <span>Extend Subscription</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold text-gray-700"
                >
                  <Heart size={20} />
                  <span>Your Favorites</span>
                </Link>
              </div>
            </div>

            {/* AI Verification */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={24} />
                <h3 className="font-bold text-lg">AI Verification</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">
                Verify authenticity of jerseys using our AI-powered tool
              </p>
              <Link
                href="/aitools"
                className="block w-full px-4 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-center"
              >
                Verify Jersey →
              </Link>
            </div>
          </div>

          {/* Right Column - Stats & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white mb-3`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Receipt size={24} className="text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Payment History
                  </h3>
                </div>
                <Link
                  href="/payments"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="text-green-600" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {payment.description}
                        </div>
                        <div className="text-sm text-gray-600">
                          {payment.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {payment.amount}
                      </div>
                      <div className="text-xs text-green-600 capitalize">
                        {payment.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Listings Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">My Listings</h3>
                <Link
                  href="/my-listings"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-lg bg-gray-200"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        Vintage Jersey #{i}
                      </h4>
                      <p className="text-sm text-gray-600">3 bids • 2 days</p>
                      <div className="text-sm font-bold text-gray-900 mt-1">
                        $120
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}