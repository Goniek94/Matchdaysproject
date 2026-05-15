"use client";

import { useEffect, useState } from "react";
import {
  ProfileSettings,
  AccountSettings,
  AddressSettings,
  WalletSettings,
  NotificationSettings,
  SecuritySettings,
  DangerZone,
} from "@/components/settings";
import {
  User,
  Settings,
  Bell,
  Shield,
  AlertTriangle,
  Wallet,
  MapPin,
} from "lucide-react";

type TabId =
  | "profile"
  | "account"
  | "address"
  | "wallet"
  | "notifications"
  | "security"
  | "danger";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Deep-link support — checkout sends users here when their delivery
  // address is missing/incomplete; wallet page deep-links the bank section.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash === "#bank-account") {
      setActiveTab("wallet");
    } else if (hash === "#address") {
      setActiveTab("address");
    }
  }, []);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "account", label: "Account", icon: <Settings size={20} /> },
    { id: "address", label: "Delivery address", icon: <MapPin size={20} /> },
    { id: "wallet", label: "Wallet & Payouts", icon: <Wallet size={20} /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
    },
    { id: "security", label: "Security", icon: <Shield size={20} /> },
    {
      id: "danger",
      label: "Danger Zone",
      icon: <AlertTriangle size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-semibold text-left ${
                      activeTab === tab.id
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "account" && <AccountSettings />}
            {activeTab === "address" && <AddressSettings />}
            {activeTab === "wallet" && <WalletSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "danger" && <DangerZone />}
          </div>
        </div>
      </div>
    </div>
  );
}
