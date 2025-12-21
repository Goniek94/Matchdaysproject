export default function InfoCards() {
  const cards = [
    {
      icon: "📦",
      title: "Free Shipping",
      description: "Tracked delivery across Poland, Czechia, and Slovakia",
    },
    {
      icon: "✓",
      title: "Authenticity Guarantee",
      description: "Every item verified by our expert team",
    },
    {
      icon: "🔒",
      title: "Buyer Protection",
      description: "30-day return policy on all purchases",
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
