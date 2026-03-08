import type { Metadata } from "next";
import "./globals.css";
// Import from the main components directory
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";

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
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {/* Added padding-top to prevent fixed navbar from covering content */}
          <main className="min-h-screen pt-[80px] md:pt-[100px]">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}