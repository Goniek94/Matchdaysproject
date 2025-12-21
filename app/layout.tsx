import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
