"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Moon, Palette, Sun, X } from "lucide-react";

const colors = [
  { id: "blue", label: "Blue", color: "#365BFF" },
  { id: "purple", label: "Purple", color: "#B875F5" },
  { id: "orange", label: "Orange", color: "#ED7014" },
  { id: "black", label: "Black", color: "#111114" },
  { id: "lime", label: "Neon lime", color: "#CCFF00" },
] as const;
type Accent = (typeof colors)[number]["id"];
const storageKey = "zura-accent";
const themeKey = "zura-theme";

export default function AccentPicker() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState<Accent>("blue");
  const [dark, setDark] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const restore = (value: string | null, isDark = document.documentElement.getAttribute("data-theme") === "dark") => {
      const match = colors.find((color) => color.id === (value === "green" ? "lime" : value))?.id ?? "blue";
      const selected = match === "lime" && !isDark ? "blue" : match;
      document.documentElement.setAttribute("data-accent", selected);
      setAccent(selected);
    };
    const frame = requestAnimationFrame(() => {
      try {
        const savedDark = localStorage.getItem(themeKey) !== "light";
        document.documentElement.setAttribute("data-theme", savedDark ? "dark" : "light");
        setDark(savedDark);
        restore(localStorage.getItem(storageKey), savedDark);
      } catch { /* Keep the default dark theme when storage is unavailable. */ }
    });
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) restore(event.newValue);
      if (event.key === themeKey || event.key === null) {
        const nextDark = event.key === null || event.newValue !== "light";
        document.documentElement.setAttribute("data-theme", nextDark ? "dark" : "light");
        setDark(nextDark);
        if (!nextDark && document.documentElement.getAttribute("data-accent") === "lime") restore("blue", false);
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    rootRef.current?.querySelector<HTMLButtonElement>("[aria-pressed='true']")?.focus();
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocus);
    };
  }, [open]);

  const select = (value: Accent) => {
    setAccent(value);
    document.documentElement.setAttribute("data-accent", value);
    try { localStorage.setItem(storageKey, value); } catch { /* Keep the selection for this visit. */ }
  };

  const toggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.setAttribute("data-theme", nextDark ? "dark" : "light");
    if (!nextDark && accent === "lime") select("blue");
    try { localStorage.setItem(themeKey, nextDark ? "dark" : "light"); } catch { /* Keep this visit's theme. */ }
  };

  return (
    <div ref={rootRef} className="fixed top-1/2 right-4 z-40 flex -translate-y-1/2 flex-col gap-3 md:right-6">
      <button ref={toggleRef} type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close color picker" : "Choose accent color"} aria-expanded={open} aria-controls="accent-options" className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--background)] text-[var(--accent)] shadow-[0_6px_24px_rgba(17,17,20,0.14)] transition-transform hover:scale-105">
        {open ? <X size={21} aria-hidden="true" /> : <Palette size={22} aria-hidden="true" />}
      </button>
      <button type="button" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to night mode"} aria-pressed={dark} title={dark ? "Light mode" : "Night mode"} className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--background)] text-[var(--foreground)] shadow-[0_6px_24px_rgba(17,17,20,0.14)] transition-transform hover:scale-105">
        <motion.span key={dark ? "sun" : "moon"} initial={{ opacity: 0, rotate: -45, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
          {dark ? <Sun size={21} aria-hidden="true" /> : <Moon size={21} aria-hidden="true" />}
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div id="accent-options" role="region" aria-label="Accent colors" initial={{ opacity: 0, x: 12, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 12, scale: 0.95 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="absolute -top-1 right-[3.75rem] origin-right rounded-full border border-[var(--accent-border)] bg-[var(--background)]/95 p-1.5 shadow-[0_8px_30px_rgba(17,17,20,0.1)] backdrop-blur-xl">
            <div className="flex items-center gap-0.5">
              {colors.filter((color) => dark || color.id !== "lime").map((color) => (
                <button key={color.id} type="button" aria-label={`${color.id === "black" && dark ? "White" : color.label} accent`} aria-pressed={accent === color.id} onClick={() => select(color.id)} className={`group flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${accent === color.id ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--surface-muted)]"}`}>
                  <span aria-hidden="true" style={{ backgroundColor: color.id === "black" && dark ? "#FFFFFF" : color.color, color: (color.id === "black" && dark) || color.id === "lime" ? "#111114" : "#FFFFFF" }} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${accent === color.id ? "ring-1 ring-[var(--accent)] ring-offset-[3px] ring-offset-[var(--background)]" : ""}`}>
                    {accent === color.id && <Check size={13} strokeWidth={3} />}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
