import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { WatchlistProvider } from "@/lib/context/WatchlistContext";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Matchdays - Sports Memorabilia Marketplace",
  description:
    "The marketplace for authentic sports memorabilia. Jerseys, signed items and rare collectibles from football, basketball, hockey, motorsport and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <head>
        <style>{`
          #splash {
            position: fixed;
            inset: 0;
            background: #111111;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            pointer-events: none;
            transition: opacity 0.4s ease;
          }
          #splash-logo {
            font-family: Inter, sans-serif;
            font-weight: 700;
            font-size: 1.5rem;
            letter-spacing: 0.25em;
            color: #ffffff;
          }
        `}</style>
      </head>
      <body style={{ background: "#111111" }}>
        {/* Splash screen - widoczny przed hydracją */}
        <div id="splash">
          <span id="splash-logo">MATCHDAYS</span>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                var s = document.getElementById('splash');
                if (s) {
                  s.style.opacity = '0';
                  setTimeout(function() { s.remove(); }, 400);
                }
              });
            `,
          }}
        />

        <AuthProvider>
          <WatchlistProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen pt-[80px] md:pt-[100px]">
                {children}
              </main>
              <FooterWrapper />
            </CartProvider>
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
