"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import { motion, useReducedMotion, useSpring, type Variants } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.2,
    },
  },
};

const textVariants: Variants = {
  hidden: {
    y: "110%",
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const outerX = useSpring(0, { stiffness: 45, damping: 22, mass: 1 });
  const outerY = useSpring(0, { stiffness: 45, damping: 22, mass: 1 });
  const innerX = useSpring(0, { stiffness: 65, damping: 24, mass: 0.8 });
  const innerY = useSpring(0, { stiffness: 65, damping: 24, mass: 0.8 });

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    outerX.set(x * 36);
    outerY.set(y * 24);
    innerX.set(x * 60);
    innerY.set(y * 40);
  };

  const resetCircles = () => {
    outerX.set(0);
    outerY.set(0);
    innerX.set(0);
    innerY.set(0);
  };

  return (
    <section data-nav-section onPointerMove={followPointer} onPointerLeave={resetCircles} onPointerCancel={resetCircles} className="relative flex min-h-[100svh] flex-col text-[var(--foreground)]">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />

      {/* Decorative circles */}
      <motion.div
        aria-hidden="true"
        style={{ x: reduceMotion ? 0 : outerX, y: reduceMotion ? 0 : outerY }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="pointer-events-none absolute top-[20%] right-[-180px] h-[500px] w-[500px] md:right-[-100px] md:h-[700px] md:w-[700px]"
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-[var(--accent-ring)]/25"
          animate={{ scale: reduceMotion ? 1 : [1, 1.025, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={{ x: reduceMotion ? 0 : innerX, y: reduceMotion ? 0 : innerY }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
        className="pointer-events-none absolute top-[calc(20%+75px)] right-[-105px] h-[350px] w-[350px] md:top-[calc(20%+100px)] md:right-0 md:h-[500px] md:w-[500px]"
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-[var(--accent-ring)]/25"
          animate={{ scale: reduceMotion ? 1 : [1, 0.975, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 pt-36 pb-16 md:px-12 lg:px-20">

        {/* Top label */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12 flex items-center gap-3"
        >
          <span className="text-[11px] font-semibold tracking-[0.15em] text-[var(--secondary-text)] uppercase">
            Web Developer & IT Specialist / Tbilisi, Georgia
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-baseline gap-x-[0.22em] text-[clamp(3.5rem,10vw,10.5rem)] leading-[1.05] font-semibold tracking-[-0.085em]"
        >
          <span className="inline-block overflow-hidden pb-[0.1em]">
            <motion.span
              variants={textVariants}
              className="inline-block"
            >
              Hello,
            </motion.span>
          </span>

          <span className="inline-block overflow-hidden pb-[0.1em]">
            <motion.span
              variants={textVariants}
              className="inline-block"
            >
              I&apos;m
            </motion.span>
          </span>

          <span className="inline-block overflow-hidden pb-[0.1em]">
            <motion.span
              variants={textVariants}
              className="inline-block text-[var(--accent)]"
            >
              Zura.
            </motion.span>
          </span>
        </motion.h1>

        {/* Bottom content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-14 flex flex-col justify-between gap-10 md:mt-20 md:flex-row md:items-end"
        >
          {/* Description */}
          <motion.div
            variants={fadeUp}
            className="max-w-[420px]"
          >
            <p className="text-base leading-relaxed text-[var(--secondary-text)] md:text-lg">
              I&apos;m Zura, a Web Developer and IT Specialist passionate about building modern, responsive, and high-performance digital experiences.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Link
              href="/projects"
              className="group flex w-fit items-center gap-5 rounded-full bg-[var(--accent)] py-4 pr-4 pl-7 text-sm font-semibold text-[var(--accent-on)] transition-[background-color,transform] duration-300 hover:scale-[1.03] hover:bg-[var(--accent-hover)]"
            >
              EXPLORE MY WORK

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-on)] text-[var(--accent)]">
                <ArrowUpRight
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 stroke-[var(--accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10"
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12 lg:px-20">
          <span className="text-[10px] font-medium tracking-[0.2em] text-[var(--secondary-text)] uppercase">
            © 2026 Zura Beridze
          </span>

          <a
            href="#about"
            className="group flex items-center gap-3 text-[10px] font-medium tracking-[0.2em] text-[var(--secondary-text)] uppercase transition-colors hover:text-[var(--accent)]"
          >
            Scroll to explore

            <ArrowDown
              size={15}
              className="transition-transform group-hover:translate-y-1"
            />
          </a>

          <span className="hidden text-[10px] tracking-[0.2em] text-[var(--secondary-text)] uppercase md:block">
            41°43&apos; N / 44°47&apos; E
          </span>
        </div>
      </motion.div>
    </section>
  );
}
