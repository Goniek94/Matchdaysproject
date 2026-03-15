"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// Routes where the footer should be hidden (app-like full-screen pages)
const NO_FOOTER_ROUTES = ["/dashboard", "/messages", "/my-listings"];

export default function FooterWrapper() {
  const pathname = usePathname();
  const hideFooter = NO_FOOTER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (hideFooter) return null;

  return <Footer />;
}
