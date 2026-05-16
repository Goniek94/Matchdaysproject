/**
 * Root-level loading fallback. Renders during route segment transitions
 * AND during the suspense window of server-component fetches. Keeps the
 * navbar visible (layout.tsx persists) and shows a calm skeleton in the
 * main content area so the page never "flashes blank".
 *
 * Intentionally minimal — page-specific loading.tsx files can override
 * this for routes with richer skeletons (auction detail, dashboard).
 */
export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest">Loading</p>
      </div>
    </div>
  );
}
