/** @type {import('next').NextConfig} */

// Build-time API URL (used in CSP connect-src).
// Matches what the browser will call at runtime.
const apiOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  try {
    return new URL(raw).origin; // e.g. "https://api.matchdays.com"
  } catch {
    return ""; // missing at build time — fine for local dev
  }
})();

const supabaseOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://*.supabase.co";
  }
})();

/**
 * Content-Security-Policy
 *
 * Next.js App Router injects inline <script> tags, so 'unsafe-inline' is
 * required in script-src until nonce/hash support lands in your config.
 * Everything else is locked down.
 */
const csp = [
  "default-src 'self'",
  // Next.js needs unsafe-inline + unsafe-eval for HMR in dev; prod still
  // needs unsafe-inline for the framework's inline bootstrap scripts.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  // Allow connections to the backend API, WebSocket upgrades, and Supabase.
  [
    "connect-src",
    "'self'",
    apiOrigin,
    supabaseOrigin,
    "wss:",   // WebSocket upgrades (Socket.io)
    "ws:",    // ws:// for local dev
  ]
    .filter(Boolean)
    .join(" "),
  // Images: self + data URIs (base64 previews) + known CDNs.
  [
    "img-src",
    "'self'",
    "data:",
    "blob:",
    "https://images.unsplash.com",
    "https://flagcdn.com",
    "https://i.pravatar.cc",
    supabaseOrigin,
  ].join(" "),
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'", // same effect as X-Frame-Options: DENY
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "kbrxpdibulijbljelvgp.supabase.co" },
    ],
  },

  async headers() {
    return [
      {
        // Apply to every route
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            // Belt-and-suspenders alongside CSP frame-ancestors
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            // Prevent MIME-type sniffing
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Don't leak the full URL in the Referer header to third parties
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Opt out of browser features we don't use
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
          {
            // Force HTTPS for 1 year (only meaningful in production)
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
