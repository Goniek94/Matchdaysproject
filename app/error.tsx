"use client";

/**
 * Root error boundary. Catches uncaught exceptions in any client
 * component below the app/ root and renders a recoverable screen
 * instead of a blank page (Next.js default behavior when this file is
 * absent).
 *
 * Behavioural choices:
 *   • Show a quiet, on-brand message — never a stack trace (would leak
 *     internal route names + filenames to users). Stack stays in the
 *     server log via `console.error`.
 *   • Offer "Try again" → calls Next's `reset` to re-render the route
 *     subtree without a full page reload. Resolves most transient
 *     errors (race conditions, expired tokens after silent refresh).
 *   • Offer "Back to home" as the safe fallback that always works.
 *
 * Per Next.js convention: must be a Client Component, MUST accept
 * `{ error, reset }` props, MUST not throw in render.
 */
import Link from "next/link";
import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to backend log via console — in production Pino captures
    // these. Don't reveal `error.message` to user (XSS-safe React text
    // node anyway, but principle).
    // eslint-disable-next-line no-console
    console.error("[app-error-boundary]", error?.digest, error?.message);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-100 mb-5">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Coś poszło nie tak
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Spróbuj odświeżyć stronę. Jeśli problem powtarza się — wróć do
          strony głównej.
        </p>
        {error?.digest && (
          <p className="text-[10px] text-gray-400 font-mono mb-6">
            ref: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <RotateCcw size={14} />
            Spróbuj ponownie
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Home size={14} />
            Strona główna
          </Link>
        </div>
      </div>
    </div>
  );
}
