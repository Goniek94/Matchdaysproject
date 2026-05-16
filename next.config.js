/** @type {import('next').NextConfig} */

// Build-time API URL.
//
// In production we want the BROWSER to hit `/api/v1/*` on the SAME ORIGIN
// (this Vercel domain), and Vercel's `rewrites()` proxies the request
// server-side to Railway. That makes our auth + CSRF cookies first-party,
// which is non-negotiable while we don't own a custom domain for the
// backend yet (third-party cookies are blocked by default in Chrome 2024+
// and Safari ITP, breaking the double-submit CSRF flow).
//
// `NEXT_PUBLIC_BACKEND_URL` is the REAL Railway origin used only by the
// rewrite below (server-side fetch) and by CSP connect-src (so the runtime
// CSP still allows the backend in case some flow bypasses the proxy).
const backendOrigin = (() => {
  const raw =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";
  try {
    return new URL(raw).origin; // e.g. "https://matchdaysbackend-production.up.railway.app"
  } catch {
    return "";
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
 * `unsafe-eval` is required ONLY by webpack HMR in development; in
 * production we drop it (Next's production bundle does not use eval()).
 *
 * The split matters for security: `unsafe-eval` lets a successful
 * `unsafe-inline` injection convert text into executable code via
 * Function()/eval(). Removing it raises the attacker's bar.
 */
const isProduction = process.env.NODE_ENV === "production";
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isProduction ? [] : ["'unsafe-eval'"]), // dev-only for HMR
].join(" ");

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  // Allow connections to the backend API, WebSocket upgrades, and Supabase.
  // `backendOrigin` is the real Railway URL — usually unreached from the
  // browser (rewrites proxy `/api/v1/*` through this Vercel function),
  // but Socket.io still connects directly to the backend for WebSockets
  // because Vercel rewrites don't proxy `wss://`.
  [
    "connect-src",
    "'self'",
    backendOrigin,
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

  // Vercel rewrites proxy /api/v1/* requests to Railway server-side, so
  // the browser sees them as same-origin. This fixes cross-site cookie
  // blocking that broke CSRF and (intermittently) auth in production.
  //
  // The rewrite is a no-op in local dev (backendOrigin empty → rewrite skipped).
  // Vercel function timeout is 10s on Hobby plan, 60s default on Pro —
  // the AI sync endpoint can spend 15-25s on Gemini + Google Search, so
  // on Hobby use /ai/analyze-async (returns 202 in <1s, processor finishes
  // the work in the background).
  async rewrites() {
    if (!backendOrigin) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
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
