"use client";

import {
  TrendingUp,
  Package,
  Eye,
  CreditCard,
  ShoppingBag,
  Plus,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// --- MOCK DATA ---
const STATS = [
  {
    label: "Total Revenue",
    value: "€1,240.50",
    change: "+12%",
    icon: CreditCard,
    color: "bg-black text-white",
  },
  {
    label: "Active Listings",
    value: "8",
    change: "+2",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Total Views",
    value: "3.4k",
    change: "+24%",
    icon: Eye,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Items Sold",
    value: "12",
    change: "+3",
    icon: ShoppingBag,
    color: "bg-amber-100 text-amber-600",
  },
];

const RECENT_SALES = [
  {
    id: 1,
    item: "Arsenal 2005 Home (Henry)",
    date: "2 mins ago",
    price: "€120.00",
    status: "processing",
    img: "bg-red-100",
  },
  {
    id: 2,
    item: "AC Milan 1994 Away",
    date: "4 hours ago",
    price: "€85.00",
    status: "shipped",
    img: "bg-white",
  },
  {
    id: 3,
    item: "Barcelona 2011 Home",
    date: "1 day ago",
    price: "€95.00",
    status: "delivered",
    img: "bg-blue-100",
  },
];

const MY_LISTINGS = [
  {
    id: 1,
    item: "Juventus 2015 Third",
    views: 124,
    price: "€70.00",
    likes: 12,
    img: "bg-black",
  },
  {
    id: 2,
    item: "Bayern Munich 1999 CL",
    views: 856,
    price: "€250.00",
    likes: 84,
    img: "bg-red-800",
  },
  {
    id: 3,
    item: "Ajax 1995 Away",
    views: 43,
    price: "€110.00",
    likes: 5,
    img: "bg-indigo-900",
  },
];

// --- KOMPONENTY ---

// 1. Prosty wykres słupkowy (Animowany)
const ActivityChart = () => {
  const bars = [40, 70, 45, 90, 60, 80, 50, 95, 65, 75, 55, 90];
  return (
    <div className="flex items-end justify-between h-32 md:h-40 gap-2 mt-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="w-full bg-gray-100 hover:bg-black rounded-t-md transition-colors relative group"
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {height}%
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="bg-[#FAFAFA] font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-12">
        {/* HEADER: Welcome + Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
              Hello, Jan 👋
            </h1>
            <p className="text-gray-500 text-lg">
              Here is what’s happening with your store today.
            </p>
          </div>
          <Link
            href="/add-listing"
            className="group flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Plus size={20} />
            <span>List New Item</span>
          </Link>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change} <TrendingUp size={12} className="ml-1" />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-gray-900">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MAIN BENTO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* CHART SECTION */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    Activity Overview
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your visits and engagement over time.
                  </p>
                </div>
                <select className="bg-gray-50 border-none text-sm font-bold rounded-lg px-4 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-black/5">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <ActivityChart />
            </div>

            {/* RECENT SALES TABLE */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">
                  Recent Orders
                </h3>
                <Link
                  href="/orders"
                  className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {RECENT_SALES.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${sale.img} flex-shrink-0 border border-black/5`}
                      ></div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {sale.item}
                        </h4>
                        <p className="text-xs text-gray-500">{sale.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">{sale.price}</p>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full 
                                    ${
                                      sale.status === "delivered"
                                        ? "bg-green-100 text-green-700"
                                        : sale.status === "processing"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-blue-100 text-blue-700"
                                    }`}
                      >
                        {sale.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="space-y-8">
            {/* YOUR LISTINGS MINI */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">
                  Your Listings
                </h3>
                <Link
                  href="/my-listings"
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <div className="space-y-4 flex-grow">
                {MY_LISTINGS.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 aspect-[4/3]"
                  >
                    <div className={`absolute inset-0 ${item.img}`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                      <div className="flex justify-between items-end">
                        <div>
                          <h4 className="font-bold text-sm truncate pr-2">
                            {item.item}
                          </h4>
                          <p className="text-xs opacity-70">
                            {item.views} views
                          </p>
                        </div>
                        <span className="font-black">{item.price}</span>
                      </div>
                    </div>

                    {/* Edit Button Hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 text-gray-400 font-bold rounded-xl hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> Add Quick Draft
              </button>
            </div>

            {/* NOTIFICATIONS / TIPS */}
            <div className="bg-blue-600 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-lg font-black mb-2">
                  Complete your profile
                </h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Add a payout method to withdraw your €1,240.50 earnings
                  instantly.
                </p>
                <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
