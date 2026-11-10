"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import BrandLogo from "./BrandLogo";

// Main navigation links to the home overview; MORE ABOUT ME opens the story.
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-5 w-5">
      <span className={`absolute left-0 top-[3px] h-0.5 w-5 rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none ${open ? "translate-y-[6px] rotate-45" : ""}`} />
      <span className={`absolute left-0 top-[9px] h-0.5 w-5 rounded-full bg-current transition-[opacity,transform] duration-200 motion-reduce:transition-none ${open ? "scale-x-0 opacity-0" : ""}`} />
      <span className={`absolute left-0 top-[15px] h-0.5 w-5 rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
    </span>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hash, setHash] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 40);
    const updateHash = () => setHash(window.location.hash);
    const frame = requestAnimationFrame(() => { updateScrollState(); updateHash(); });
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("hashchange", updateHash);
    // Observe the sections so the navigation follows scrolling as well as clicks.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setHash(entry.target.id ? `#${entry.target.id}` : "");
      });
    }, { rootMargin: "-15% 0px -65% 0px" });
    document.querySelectorAll("[data-nav-section], #contact").forEach((section) => observer.observe(section));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("hashchange", updateHash);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  const isActive = (href: string) => href === "/projects"
    ? pathname.startsWith("/projects") || (pathname === "/" && hash === "#projects")
    : href === "/#about"
    ? pathname === "/about" || (pathname === "/" && hash === "#about")
    : pathname === "/" && (href === "/" ? !hash : href === `/${hash}`);
  const closeMenu = () => setMenuOpen(false);
  const duration = reduceMotion ? 0 : 0.4;

  return (
    <header className={`fixed top-0 left-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300 motion-reduce:transition-none ${isScrolled ? "bg-[var(--background)]/95 shadow-sm backdrop-blur-md" : "bg-transparent"}`}>
      <div className={`mx-auto flex max-w-[1600px] items-center justify-between px-6 transition-[padding] duration-300 motion-reduce:transition-none md:px-12 lg:px-20 ${isScrolled ? "py-3" : "py-7"}`}>
        <Link href="/" aria-label="Zura home" className="inline-flex items-center"><BrandLogo priority className={`transition-[width] duration-300 motion-reduce:transition-none ${isScrolled ? "w-24" : "w-28 md:w-32"}`} /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-10 md:flex">
          {navLinks.map((link, index) => (
            <Link key={link.label} href={link.href} aria-current={isActive(link.href) ? (link.href.includes("#") ? "location" : "page") : undefined} className={`group relative text-[13px] font-medium transition-colors hover:text-[var(--foreground)] ${isActive(link.href) ? "text-[var(--foreground)]" : "text-[var(--secondary-text)]"}`}>
              <span className="mr-1 text-[10px] text-[var(--accent)]">0{index + 1}</span>{link.label}
              <span className={`absolute -bottom-2 left-0 h-px bg-[var(--accent)] transition-all duration-300 group-hover:w-full ${isActive(link.href) ? "w-full" : "w-0"}`} />
            </Link>
          ))}
        </nav>
        <Link href="/#contact" className="group hidden items-center gap-4 rounded-full border border-[var(--accent)] px-5 py-3 text-xs font-semibold tracking-wider text-[var(--foreground)] transition-all duration-300 hover:bg-[var(--accent-light)] md:flex">
          LET&apos;S TALK<ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-haspopup="dialog" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--foreground)] md:hidden">
          <MenuIcon open={menuOpen} />
        </button>
      </div>
      <dialog ref={dialogRef} id="mobile-menu" aria-labelledby="mobile-menu-title" onCancel={(event) => { event.preventDefault(); closeMenu(); }} onClose={closeMenu} onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const items = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }} className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-[var(--foreground)] backdrop:bg-transparent">
            <motion.div className="absolute inset-0" initial="closed" animate={menuOpen ? "open" : "closed"} variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }} transition={{ duration }} onAnimationComplete={() => { if (!menuOpen) dialogRef.current?.close(); }}>
              <motion.div aria-hidden="true" onClick={closeMenu} variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }} transition={{ duration }} className="absolute inset-0 bg-[#111114]/35 backdrop-blur-sm" />
              <motion.div variants={{ closed: { x: "100%" }, open: { x: 0 } }} transition={{ duration, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-y-0 right-0 flex w-[min(88vw,420px)] flex-col overflow-y-auto overscroll-contain bg-[var(--accent-surface)] px-6 pb-8 shadow-2xl">
                <div className={`flex shrink-0 items-center justify-between transition-[padding] duration-300 ${isScrolled ? "py-3" : "py-7"}`}>
                  <span id="mobile-menu-title" className="text-xs font-semibold tracking-[0.2em] text-[var(--secondary-text)] uppercase">Navigation</span>
                  <button type="button" onClick={closeMenu} aria-label="Close menu" aria-expanded={menuOpen} aria-controls="mobile-menu" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--accent-light)] bg-[var(--background)]">
                    <MenuIcon open={menuOpen} />
                  </button>
                </div>
                <nav aria-label="Mobile navigation" className="my-auto py-10">
                  {navLinks.map((link, index) => (
                    <motion.div key={link.label} variants={{ closed: { opacity: 0, x: 24 }, open: { opacity: 1, x: 0 } }} transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion || !menuOpen ? 0 : 0.12 + index * 0.06 }}>
                      <Link href={link.href} onClick={closeMenu} aria-current={isActive(link.href) ? (link.href.includes("#") ? "location" : "page") : undefined} className={`group flex items-center gap-4 border-b border-[var(--accent-border)] py-5 text-[clamp(1.75rem,8vw,2.75rem)] font-semibold tracking-tight transition-colors hover:text-[var(--accent)] ${isActive(link.href) ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                        <span className="text-xs font-medium tracking-normal text-[var(--accent)]">0{index + 1}</span>{link.label}
                        <ArrowUpRight size={22} className="ml-auto shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                <div className="shrink-0 border-t border-[var(--accent-border)] pt-6">
                  <Link href="/#contact" onClick={closeMenu} className="flex items-center justify-between rounded-full bg-[var(--accent-light)] px-6 py-4 text-sm font-semibold">LET&apos;S TALK<ArrowUpRight size={20} /></Link>
                  <p className="mt-5 text-xs text-[var(--secondary-text)]">Based in Tbilisi, Georgia</p>
                </div>
              </motion.div>
            </motion.div>
      </dialog>
    </header>
  );
}
