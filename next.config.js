/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ],
  },
};

module.exports = nextConfig;
