/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com", // <-- To naprawi błąd z flagami
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc", // <-- To przyda się do avatarów
      },
      {
        protocol: "https",
        hostname: "kbrxpdibulijbljelvgp.supabase.co", // <-- Supabase Storage
      },
    ],
  },
};

module.exports = nextConfig;
