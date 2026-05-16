/**
 * Custom 404 page. Triggered by `notFound()` calls in server components
 * and by Next's default unmatched-route handling. The default Next.js
 * 404 page is brand-bare; this one stays on theme + offers two recovery
 * paths (home + browse auctions) so users always have somewhere to go.
 */
import Link from "next/link";
import { SearchX, Home, LayoutGrid } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 mb-5">
          <SearchX size={28} className="text-gray-400" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
          404 — Strona nie znaleziona
        </p>
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Tej strony nie ma
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Aukcja mogła zostać zakończona, anulowana albo link jest
          nieaktualny. Wróć do głównej, albo zerknij na aktywne aukcje.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Home size={14} />
            Strona główna
          </Link>
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <LayoutGrid size={14} />
            Przeglądaj aukcje
          </Link>
        </div>
      </div>
    </div>
  );
}
