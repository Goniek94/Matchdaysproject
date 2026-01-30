"use client";

import { Check, X as XIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "FREE",
      price: 0,
      description: "For occasional users",
      features: [
        { text: "Buying and selling on the platform", included: true },
        { text: "Access to auctions (verified)", included: true },
        { text: "Unlimited listing duration", included: true },
        { text: "Option to purchase AI Credits", included: true },
        { text: "15% Sales Commission", included: true, highlight: true },
      ],
      cta: "Start for Free",
      ctaHref: "/register",
      popular: false,
      color: "border-gray-200",
      buttonColor: "bg-white text-black border-2 border-black hover:bg-gray-50",
      footerText: "The FREE plan allows you to fully explore MatchDays without commitment."
    },
    {
      name: "PREMIUM",
      price: 9.99,
      description: "For active sellers and collectors",
      features: [
        { text: "7% Sales Commission", included: true, highlight: true },
        { text: "Access to MatchDays Arena", included: true },
        { text: "AI Credits package included", included: true },
        { text: "Create listings with AI", included: true },
        { text: "Subscriber-only offers", included: true },
        { text: "Standard visibility", included: true },
      ],
      cta: "Choose Premium",
      ctaHref: "/checkout?plan=premium",
      popular: true,
      color: "border-indigo-500 shadow-xl shadow-indigo-100",
      buttonColor: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200",
      footerText: "The PREMIUM plan offers the best balance between price and features."
    },
    {
      name: "PREMIUM PRO",
      price: 19.99,
      description: "For regular sellers",
      features: [
        { text: "All PREMIUM features", included: true },
        { text: "7% Sales Commission", included: true, highlight: true },
        { text: "Larger AI Credits package", included: true },
        { text: "Better listing positioning", included: true },
        { text: "No Buyer Protection Fee", included: true },
        { text: "Better exposure in search results", included: true },
      ],
      cta: "Choose PRO",
      ctaHref: "/checkout?plan=pro",
      popular: false,
      color: "border-purple-500",
      buttonColor: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200",
      footerText: "The PRO plan is designed for frequent sellers who want to sell faster."
    },
    {
      name: "ELITE",
      price: 39.99,
      description: "For power users and professional sellers",
      features: [
        { text: "5% Sales Commission", included: true, highlight: true },
        { text: "Largest AI Credits package", included: true },
        { text: "Best listing positioning", included: true },
        { text: "Priority support", included: true },
        { text: "Influence on platform development", included: true },
        { text: "Priority access to drops", included: true },
        { text: "Invitations to events", included: true },
      ],
      cta: "Join the Elite",
      ctaHref: "/checkout?plan=elite",
      popular: false,
      color: "border-black bg-gray-50",
      buttonColor: "bg-black text-white hover:bg-gray-800 shadow-xl",
      footerText: "The ELITE plan gives full access to the MatchDays ecosystem."
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-white" id="pricing">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            MatchDays Subscription Plans
          </h2>
          <p className="text-xl text-slate-500 mb-8">
            Choose a level tailored to your activity.
            <br className="hidden md:block" />
            MatchDays operates on a freemium model.
          </p>
          
          <p className="text-sm text-slate-400 mb-8 max-w-2xl mx-auto">
            You can use the platform for free or choose a plan that provides lower commissions,
            higher visibility, and access to premium tools. Subscription never blocks selling — it affects terms, comfort, and capabilities.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-full cursor-pointer" onClick={() => setIsAnnual(!isAnnual)}>
            <div className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!isAnnual ? 'bg-white shadow-md text-black' : 'text-slate-500'}`}>
              Monthly
            </div>
            <div className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isAnnual ? 'bg-white shadow-md text-black' : 'text-slate-500'}`}>
              Yearly <span className="text-green-600 text-[10px] ml-1">-20%</span>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest shadow-lg">
                  POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">
                    €{isAnnual && plan.price > 0 ? (plan.price * 10).toFixed(2) : plan.price}
                  </span>
                  <span className="text-slate-500 font-medium">
                    /{isAnnual ? 'yr' : 'mo'}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <Check size={18} className={`shrink-0 mt-0.5 ${feature.highlight ? 'text-green-600 stroke-[3px]' : 'text-slate-900'}`} />
                    ) : (
                      <XIcon size={18} className="text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span className={`${feature.included ? 'text-slate-700' : 'text-slate-400'} ${feature.highlight ? 'font-bold' : 'font-medium'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-4">
                <Link 
                  href={plan.ctaHref}
                  className={`block w-full py-4 text-center font-bold text-sm rounded-xl transition-all active:scale-95 ${plan.buttonColor}`}
                >
                  {plan.cta}
                </Link>
                <p className="text-[10px] text-center text-slate-400 px-2 leading-tight">
                    {plan.footerText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}