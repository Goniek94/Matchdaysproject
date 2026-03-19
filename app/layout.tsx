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
  openGraph: {
    title: "Matchdays - Sports Memorabilia Marketplace",
    description:
      "The marketplace for authentic sports memorabilia. Jerseys, signed items and rare collectibles from football, basketball, hockey, motorsport and more.",
    url: "https://matchdaysproject.vercel.app",
    siteName: "MatchDays",
    images: [
      {
        url: "https://matchdaysproject.vercel.app/images/opengraph-image.webp",
        width: 1200,
        height: 630,
        alt: "MatchDays - Sports Memorabilia Marketplace",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matchdays - Sports Memorabilia Marketplace",
    description:
      "The marketplace for authentic sports memorabilia. Jerseys, signed items and rare collectibles from football, basketball, hockey, motorsport and more.",
    images: ["https://matchdaysproject.vercel.app/images/opengraph-image.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body style={{ background: "#111111" }}>
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
