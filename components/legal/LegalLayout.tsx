/**
 * Shared container for legal pages (Terms / Privacy / Returns).
 * One file means tone, spacing, and typography stay consistent across
 * all three pages — change here once instead of in each markdown-style
 * page body.
 *
 * Renders a max-width readable column with a sticky-ish header, an
 * updated-on date, and a TOC built from the section ids. Long-form
 * text wants generous line-height and a single column — not the
 * marketing grid the rest of the site uses.
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
}

export default function LegalLayout({
  title,
  intro,
  lastUpdated,
  sections,
  children,
}: {
  title: string;
  intro?: string;
  lastUpdated: string;
  sections?: LegalSection[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 pb-24">
        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-gray-700 transition-colors mb-10"
        >
          <ArrowLeft size={13} /> Powrót do strony głównej
        </Link>

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-gray-100">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-3">
            {title}
          </h1>
          {intro && (
            <p className="text-base text-gray-500 leading-relaxed">{intro}</p>
          )}
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mt-4">
            Ostatnia aktualizacja: {lastUpdated}
          </p>
        </header>

        {/* Table of contents */}
        {sections && sections.length > 0 && (
          <nav className="mb-12 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
              Spis treści
            </p>
            <ol className="space-y-1.5 text-sm text-gray-700">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="hover:text-black hover:underline transition-colors"
                  >
                    <span className="text-gray-400 font-mono text-xs mr-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Body */}
        <article className="prose-legal text-gray-700 leading-[1.75] text-[15px]">
          {children}
        </article>
      </div>

      {/* Shared typography for legal sections — keeps the page bodies
          themselves tag-light. The rule of thumb is: no Tailwind classes
          inside the page bodies, just plain h2/p/ul/strong. Adjust here
          and every legal page picks it up. */}
      <style>{`
        .prose-legal h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #111;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          scroll-margin-top: 2rem;
        }
        .prose-legal h2 .num {
          font-family: ui-monospace, monospace;
          font-weight: 600;
          color: #aaa;
          font-size: 0.95rem;
          margin-right: 0.6rem;
        }
        .prose-legal h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #222;
          margin-top: 1.6rem;
          margin-bottom: 0.6rem;
        }
        .prose-legal p { margin-bottom: 1rem; }
        .prose-legal ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose-legal ul li { margin-bottom: 0.4rem; }
        .prose-legal strong { color: #111; font-weight: 700; }
        .prose-legal a { color: #1d4ed8; text-decoration: underline; text-underline-offset: 2px; }
        .prose-legal a:hover { color: #1e40af; }
        .prose-legal .note {
          background: #fef9c3;
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 14px 18px;
          margin: 1.5rem 0;
          font-size: 0.9rem;
        }
        .prose-legal .footer-note {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f0f0;
          font-size: 0.85rem;
          color: #888;
        }
      `}</style>
    </div>
  );
}
