import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Matchdays - Authentic Football Shirts",
  description:
    "Play your match every day. Curated collectibles. Verified authenticity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>
        {/* AuthProvider wraps everything - global auth state */}
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-[80px] md:pt-[100px]">
              {children}
            </main>
            <FooterWrapper />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
