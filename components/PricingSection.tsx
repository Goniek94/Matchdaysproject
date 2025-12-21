"use client"; // Ważne: musimy dodać to na górze, bo używamy useState

import Link from "next/link";
import { useState } from "react";

export default function PricingSection() {
  // Domyślnie zaznaczamy plan "Premium Pro" (index 2), bo jest "Most Popular"
  const [selectedPlan, setSelectedPlan] = useState(2);

  const plans = [
    {
      name: "Free Account",
      price: "€0",
      period: "month",
      badge: "🟢",
      description: "For casual buyers only",
      features: [
        { text: "Bidding on Selected Items", included: true },
        { text: "Access to Games (Ad-supported)", included: true },
        { text: "Selling & Listing Items", included: false },
        { text: "Access to Exclusive Auctions", included: false },
        { text: "AI Tools & Verification", included: false },
        { text: "No Commission (Buyer only)", included: true },
      ],
      ctaText: "Start Buying",
      ctaLink: "/register",
      popular: false,
      style: "gray",
    },
    {
      name: "Premium",
      price: "€11.99", // ok. 50 zł
      period: "month",
      badge: "🔵",
      description: "Unlock selling & full access",
      features: [
        { text: "Selling Unlocked (10% Fee)", included: true },
        { text: "Access to All Auctions", included: true },
        { text: "Basic AI Tools (5 Credits/mo)", included: true },
        { text: "Buyer Protection", included: true },
        { text: "Loyalty Points (1x)", included: true },
        { text: "Pro AI Suite (30 Credits)", included: false },
        { text: "Auto Listing Generation", included: false },
      ],
      ctaText: "Get Premium",
      ctaLink: "/register?plan=premium",
      popular: false,
      style: "blue",
    },
    {
      name: "Premium Pro",
      price: "€21.99", // ok. 90 zł
      period: "month",
      badge: "🟣",
      description: "More power & AI capabilities",
      features: [
        { text: "Low Commission: 7%", included: true },
        { text: "Pro AI Suite (30 Credits/mo)", included: true },
        { text: "Auto Listing Generation", included: true },
        { text: "Photo Identification AI", included: true },
        { text: "Priority Support", included: true },
        { text: "Unlimited AI Access", included: false },
        { text: "VIP Phone Support", included: false },
      ],
      ctaText: "Go Premium Pro",
      ctaLink: "/register?plan=premium-pro",
      popular: true,
      style: "purple",
    },
    {
      name: "Elite",
      price: "€33.99", // ok. 140 zł
      period: "month",
      badge: "👑",
      description: "For professional sellers & power users",
      features: [
        { text: "Lowest Commission: 5%", included: true },
        { text: "Unlimited AI Verification", included: true },
        { text: "Unlimited Listing Generation", included: true },
        { text: "VIP Support (24/7 Phone)", included: true },
        { text: "5x Free Shipping Tokens", included: true },
        { text: "Verified PRO Seller Badge", included: true },
        { text: "Early Access to Drops", included: true },
      ],
      ctaText: "Join Elite",
      ctaLink: "/register?plan=elite",
      popular: false,
      style: "gold",
    },
  ];

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="container-max max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
            Choose Your Level
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Unlock professional AI tools, save on fees, and join the elite
            community.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {plans.map((plan, index) => {
            const isElite = plan.style === "gold";
            const isPurple = plan.style === "purple";
            const isBlue = plan.style === "blue";
            const isPopular = plan.popular;

            // Sprawdzamy, czy ta karta jest aktualnie wybrana przez użytkownika
            const isSelected = selectedPlan === index;

            // Bazowe style
            let cardClasses = "bg-white text-gray-900 border-gray-200";

            // Style specyficzne dla planów (kolory)
            if (isElite) {
              cardClasses =
                "bg-gradient-to-b from-gray-900 to-black text-white border-yellow-500/30";
            } else if (isPurple) {
              cardClasses = "bg-white text-gray-900 border-purple-200";
            } else if (isBlue) {
              cardClasses = "bg-white text-gray-900 border-blue-100";
            }

            // Style dla stanu WYBRANEGO (Active/Selected) vs Niewybranego
            // Jeśli karta jest wybrana -> powiększamy ją (scale-105), dajemy duży cień i ring
            if (isSelected) {
              cardClasses += " scale-105 shadow-2xl z-20 ring-4 ring-offset-2";

              // Kolor obramowania (ring) zależy od planu
              if (isElite)
                cardClasses += " ring-yellow-500/50 shadow-yellow-500/20";
              else if (isPurple)
                cardClasses += " ring-purple-500/50 shadow-purple-500/30";
              else if (isBlue)
                cardClasses += " ring-blue-500/50 shadow-blue-500/20";
              else cardClasses += " ring-gray-400/50";
            } else {
              // Jeśli NIE jest wybrana -> lekko zmniejszamy lub zostawiamy standard, mniejszy cień
              cardClasses +=
                " scale-100 shadow-lg hover:shadow-xl hover:scale-[1.02] z-0 opacity-90 hover:opacity-100";
            }

            return (
              <div
                key={index}
                onClick={() => setSelectedPlan(index)} // Kliknięcie wybiera kartę
                className={`
                  relative rounded-3xl transition-all duration-300 flex flex-col h-full border cursor-pointer
                  ${cardClasses}
                `}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                    <span className="bg-purple-600 text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                {/* Best Value Badge */}
                {isElite && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-yellow-500/20">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{plan.badge}</span>
                    <h3
                      className={`text-xl font-bold ${
                        isElite ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span
                      className={`text-4xl font-black tracking-tight ${
                        isElite ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm font-medium ml-1 ${
                        isElite ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      / month
                    </span>
                  </div>

                  <p
                    className={`text-sm font-medium mb-6 pb-6 border-b ${
                      isElite
                        ? "text-gray-400 border-gray-800"
                        : "text-gray-500 border-gray-100"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div
                          className={`
                          flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5
                          ${
                            feature.included
                              ? isElite
                                ? "bg-yellow-500 text-black"
                                : isPurple
                                ? "bg-purple-600 text-white"
                                : isBlue
                                ? "bg-blue-500 text-white"
                                : "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-400"
                          }
                        `}
                        >
                          {feature.included ? "✓" : "✕"}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            feature.included
                              ? isElite
                                ? "text-gray-200"
                                : "text-gray-700"
                              : isElite
                              ? "text-gray-600 line-through"
                              : "text-gray-400 line-through decoration-gray-300"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {/* Zabezpieczenie przed propagacją kliknięcia (żeby przycisk działał jako link, a nie tylko select) */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={plan.ctaLink}
                        className={`
                            block w-full text-center py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300
                            ${
                              // Button dla Free
                              plan.style === "gray"
                                ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                : ""
                            }
                            ${
                              // Button dla Premium
                              plan.style === "blue"
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                : ""
                            }
                            ${
                              // Button dla Premium Pro
                              isPurple
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 hover:bg-purple-700 hover:shadow-purple-500/50"
                                : ""
                            }
                            ${
                              // Button dla Elite
                              isElite
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/20 hover:to-yellow-500"
                                : ""
                            }
                        `}
                      >
                        {plan.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center text-gray-400 text-sm">
          <p>Prices include VAT. Secure payment processing by Stripe.</p>
        </div>
      </div>
    </section>
  );
}
