/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#e5e5e5",
        gold: {
          50: "#FFF9E6",
          100: "#FFFBF0",
          400: "#FFD700",
          500: "#D4AF37",
          600: "#B8860B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      // --- NOWE ANIMACJE ---
      animation: {
        gradient: "gradient 8s ease infinite",
        blob: "blob 7s infinite", // Pływające tło
        "spin-slow": "spin 3s linear infinite", // Wolne obracanie
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  // --- PLUGINS DO EFEKTÓW 3D ---
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".backface-visible": {
          "backface-visibility": "visible",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".transform-style-3d": {
          "transform-style": "preserve-3d",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
      });
    }),
  ],
};
