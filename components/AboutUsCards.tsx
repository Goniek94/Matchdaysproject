export default function AboutUsCards() {
  const cards = [
    {
      number: "1",
      title: "Who We Are",
      description:
        "Matchdays is the premier marketplace for authentic vintage and collectible football shirts from around the world.",
      icon: "👕",
    },
    {
      number: "2",
      title: "What We Offer",
      description:
        "Verified authenticity, fair pricing, and a vibrant community of collectors passionate about football memorabilia.",
      icon: "✓",
    },
    {
      number: "3",
      title: "Why Choose Us",
      description:
        "Expert authentication, buyer protection guarantee, and seamless transactions on a platform built for collectors.",
      icon: "🏆",
    },
  ];

  return (
    <section className="bg-white py-20 px-8 border-b border-gray-200">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group p-8 border border-gray-200 rounded-[2px] transition-all duration-300 hover:border-black hover:shadow-lg hover:translate-y-[-4px] cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{card.icon}</span>
                <span className="text-sm font-bold text-gray-400 group-hover:text-black transition-colors">
                  0{card.number}
                </span>
              </div>
              <h3 className="text-xl font-medium mb-3 group-hover:text-black transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
