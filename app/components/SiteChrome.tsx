"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import AccentPicker from "./AccentPicker";

export default function SiteChrome({ children, currentYear }: { children: React.ReactNode; currentYear: number }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return children;

  return (
    <>
      <Header />
      {children}
      <Footer currentYear={currentYear} />
      <AccentPicker />
    </>
  );
}
