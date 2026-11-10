"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, useSpring } from "framer-motion";

const layouts = {
  about: "top-[6%] -left-80 h-[620px] w-[620px]",
  projects: "top-16 -right-72 h-[720px] w-[720px]",
  contact: "top-12 -left-80 h-[640px] w-[640px]",
  detail: "top-24 -right-80 h-[740px] w-[740px]",
  footer: "top-16 -right-48 h-[620px] w-[620px]",
} as const;

export default function SectionDecoration({ variant }: { variant: keyof typeof layouts }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const visible = useInView(layerRef, { margin: "100px" });
  const reduceMotion = useReducedMotion();
  const slowX = useSpring(0, { stiffness: 40, damping: 24, mass: 1.2 });
  const slowY = useSpring(0, { stiffness: 40, damping: 24, mass: 1.2 });

  useEffect(() => {
    const section = layerRef.current?.parentElement;
    if (!section) return;
    const reset = () => {
      slowX.set(0); slowY.set(0);
    };
    if (reduceMotion || !visible) {
      reset();
      return;
    }
    const follow = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = section.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      // Use the visible area so long sections still respond naturally.
      const top = Math.max(bounds.top, 0);
      const bottom = Math.min(bounds.bottom, window.innerHeight);
      const y = ((event.clientY - top) / Math.max(bottom - top, 1) - 0.5) * 2;
      slowX.set(x * 26); slowY.set(y * 20);
    };
    section.addEventListener("pointermove", follow, { passive: true });
    section.addEventListener("pointerleave", reset);
    section.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    return () => {
      section.removeEventListener("pointermove", follow);
      section.removeEventListener("pointerleave", reset);
      section.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
    };
  }, [visible, reduceMotion, slowX, slowY]);

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div style={{ x: reduceMotion ? 0 : slowX, y: reduceMotion ? 0 : slowY }} className={`absolute ${layouts[variant]}`}>
          <div className="decoration-orbit absolute inset-0 rounded-full border border-[var(--accent-ring)]/20" style={{ animationPlayState: visible && !reduceMotion ? "running" : "paused" }}>
            <span className="absolute top-1/2 -left-[3px] h-1.5 w-1.5 rounded-full bg-[var(--accent-ring)]/45" />
            <div className="absolute inset-[15%] rounded-full border border-[var(--accent-ring)]/10" />
            <div className="absolute inset-[30%] rounded-full border border-dashed border-[var(--accent-ring)]/10" />
          </div>
        </motion.div>
    </div>
  );
}
