export default function InfoCards() {
  // Trust strip below the listing details — promises we can actually keep at
  // launch. Anything aspirational (free shipping, 30-day returns) belongs in
  // marketing copy, not on a public listing where the buyer expects truth.
  const cards = [
    {
      icon: "📦",
      title: "Tracked Shipping",
      description:
        "Live carrier rates calculated to your country. Tracking number on every order.",
    },
    {
      icon: "✓",
      title: "AI Authenticity Check",
      description:
        "Every item scanned by our AI and reviewed by a moderator before going live.",
    },
    {
      icon: "🔒",
      title: "Buyer Protection",
      description:
        "Funds held in escrow until you confirm the item matches the listing.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 pt-8 border-t border-gray-200">
      {cards.map((card, index) => (
        <div
          key={index}
          className="p-6 bg-gray-50 border border-gray-200 rounded-[2px] text-center hover:bg-gray-100 hover:translate-y-[-4px] transition-all"
        >
          <div className="text-4xl mb-3">{card.icon}</div>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
            {card.title}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
