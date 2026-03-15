/**
 * Dashboard layout - overrides the root layout's footer
 * The dashboard is a full-height app-like experience, no footer needed
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
