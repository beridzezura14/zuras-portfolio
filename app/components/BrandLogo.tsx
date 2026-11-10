"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import dayLogo from "@/public/logo/day-mode.png";
import nightLogo from "@/public/logo/night-mode.png";

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const getTheme = () => document.documentElement.getAttribute("data-theme") === "dark";
const getServerTheme = () => true;

export default function BrandLogo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  const dark = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
  return <span aria-hidden="true" className={`brand-logo relative block aspect-[4/1] shrink-0 overflow-hidden ${className}`}>
    <Image src={dark ? nightLogo : dayLogo} alt="" fill sizes={priority ? "128px" : "(max-width: 768px) 70vw, 850px"} priority={priority} className="object-cover" />
  </span>;
}
