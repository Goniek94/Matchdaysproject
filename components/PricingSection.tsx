"use client";

import { Check, Zap, Star, ShieldCheck, Crown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "FREE",
      icon: <Zap className="text-slate-400" size={24} />,
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
      theme: "slate",
      styles: {
        card: "border-slate-200 hover:border-slate-400 bg-slate-50/50",
        button: "bg-white text-slate-900 border-2 border-slate-200 hover:bg-slate-100",
        iconBg: "bg-slate-100",
        highlight: "text-slate-600"
      }
    },
    {
      name: "PREMIUM",
      icon: <Star className="text-indigo-500" size={24} />,
      price: 13.99,
      description: "For active sellers and collectors",
      features: [
        { text: "7% Sales Commission", included: true, highlight: true },
        { text: "Access to MatchDays Arena", included: true },
        { text: "AI Credits package included", included: true },
        { text: "Create listings with AI", included: true },
        { text: "Subscriber-only offers", included: true },
      ],
      cta: "Choose Premium",
      ctaHref: "/checkout?plan=premium",
      popular: true,
      theme: "indigo",
      styles: {
        card: "border-indigo-200 shadow-indigo-100 shadow-2xl scale-105 z-10 bg-gradient-to-b from-white to-indigo-50/30",
        button: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200",
        iconBg: "bg-indigo-100",
        highlight: "text-indigo-600"
      }
    },
    {
      name: "PREMIUM PRO",
      icon: <ShieldCheck className="text-purple-500" size={24} />,
      price: 17.99,
      description: "For regular sellers",
      features: [
        { text: "All PREMIUM features", included: true },
        { text: "7% Sales Commission", included: true, highlight: true },
        { text: "Larger AI Credits package", included: true },
        { text: "Better listing positioning", included: true },
        { text: "No Buyer Protection Fee", included: true },
      ],
      cta: "Choose PRO",
      ctaHref: "/checkout?plan=pro",
      popular: false,
      theme: "purple",
      styles: {
        card: "border-purple-200 hover:border-purple-400 bg-gradient-to-b from-white to-purple-50/30",
        button: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200",
        iconBg: "bg-purple-100",
        highlight: "text-purple-600"
      }
    },
    {
      name: "ELITE",
      icon: <Crown className="text-amber-500" size={24} />,
      price: 39.99,
      description: "For power users & pros",
      features: [
        { text: "5% Sales Commission", included: true, highlight: true },
        { text: "Largest AI Credits package", included: true },
        { text: "Best listing positioning", included: true },
        { text: "Priority support", included: true },
        { text: "Invitations to events", included: true },
      ],
      cta: "Join the Elite",
      ctaHref: "/checkout?plan=elite",
      popular: false,
      theme: "gold",
      styles: {
        card: "border-amber-200 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50/30",
        button: "bg-black text-white hover:bg-gray-800 shadow-xl shadow-amber-100",
        iconBg: "bg-amber-100",
        highlight: "text-amber-600"
      }
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-[#F8FAFC] relative overflow-hidden" id="pricing">
      {/* Decorative background blobs using existing animations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight italic">
            Change the rules of the game
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Choose a level tailored to your activity on MatchDays.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1.5 bg-slate-200/50 backdrop-blur-sm rounded-2xl cursor-pointer" onClick={() => setIsAnnual(!isAnnual)}>
            <div className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!isAnnual ? 'bg-white shadow-lg text-black' : 'text-slate-500'}`}>
              Monthly
            </div>
            <div className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isAnnual ? 'bg-white shadow-lg text-black' : 'text-slate-500'}`}>
              Yearly <span className="bg-green-100 text-green-600 text-[10px] px-2 py-0.5 rounded-full">-20%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`group relative flex flex-col p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:-translate-y-4 ${plan.styles.card}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-xl">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${plan.styles.iconBg} transition-transform duration-500 group-hover:rotate-12`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    €{isAnnual && plan.price > 0 ? (plan.price * 10).toFixed(2) : plan.price}
                  </span>
                  <span className="text-slate-400 font-bold text-lg">
                    /{isAnnual ? 'yr' : 'mo'}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${feature.included ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                      <Check size={14} className={feature.included ? 'text-emerald-600' : 'text-slate-300'} strokeWidth={3} />
                    </div>
                    <span className={`text-sm ${feature.highlight ? `font-black ${plan.styles.highlight}` : 'text-slate-600 font-medium'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                <Link 
                  href={plan.ctaHref}
                  className={`block w-full py-4 text-center font-black text-sm rounded-2xl transition-all active:scale-95 uppercase tracking-wider ${plan.styles.button}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-16 text-slate-400 text-sm max-w-2xl mx-auto">
          MatchDays operates on a freemium model. Subscriptions never block selling — they affect commissions, visibility, and access to professional AI tools.
        </p>
      </div>
    </section>
  );
}