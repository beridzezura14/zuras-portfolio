"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowUp, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import SectionDecoration from "./SectionDecoration";
import BrandLogo from "./BrandLogo";

const EMAIL = "zuraberidze12@gmail.com";
const PHONE = "+995 558 29 43 64";
const PHONE_LINK = "+995558294364";
const WHATSAPP_LINK = "https://wa.me/995558294364";

// Match the main navigation's home section links.
const navigation = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/beridzezura14",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zura-beridze-a39725197/",
    icon: FaLinkedinIn,
  },
];

export default function Footer({ currentYear }: { currentYear: number }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <footer className="relative border-t border-[var(--border-color)] text-[var(--foreground)]">
      <SectionDecoration variant="footer" />
      <div className="mx-auto max-w-[1600px] px-6 pt-16 pb-7 md:px-12 lg:px-20">

        {/* TOP SECTION */}
        <div className="grid gap-12 border-b border-[var(--accent-border)] pb-14 md:grid-cols-[1.5fr_1fr_1fr]">

          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* <Link
              href="/"
              aria-label="Zura home"
              className="inline-flex items-center text-3xl font-bold tracking-[-0.08em]"
            >
              
              <BrandLogo className="w-36" />
            </Link> */}

            <p className="mt-5 max-w-xs text-sm leading-7 text-[var(--secondary-text)]">
              Web Developer & IT Specialist building modern,
              responsive, and meaningful digital experiences.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-7 flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--background)] text-[var(--text-strong)] transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-on)]"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* NAVIGATION */}
          <div>
            <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">
              Navigation
            </h3>

            <nav aria-label="Footer navigation" className="flex flex-col items-start gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-strong)] transition-colors hover:text-[var(--accent)]"
                >
                  {item.label}

                  <ArrowUpRight
                    size={14}
                    className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">
              Get in Touch
            </h3>

            <div className="flex flex-col items-start gap-4">

              {/* EMAIL */}
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex max-w-full items-center gap-3 text-sm font-medium text-[var(--text-strong)] transition-colors hover:text-[var(--accent)]"
              >
                <Mail
                  size={17}
                  className="shrink-0 text-[var(--accent)]"
                />

                <span className="break-all">{EMAIL}</span>

                <ArrowUpRight
                  size={15}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {/* PHONE */}
              <a
                href={`tel:${PHONE_LINK}`}
                className="group inline-flex items-center gap-3 text-sm font-medium text-[var(--text-strong)] transition-colors hover:text-[var(--accent)]"
              >
                <Phone
                  size={17}
                  className="shrink-0 text-[var(--accent)]"
                />

                <span>{PHONE}</span>

                <ArrowUpRight
                  size={15}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {/* WHATSAPP */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm font-medium text-[var(--text-strong)] transition-colors hover:text-[var(--accent)]"
              >
                <FaWhatsapp
                  size={19}
                  className="shrink-0 text-[var(--accent)]"
                />

                <span>Message on WhatsApp</span>

                <ArrowUpRight
                  size={15}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            {/* LOCATION */}
            <p className="mt-6 text-sm text-[var(--secondary-text)]">
              Based in Tbilisi, Georgia
            </p>

            {/* AVAILABILITY */}
            <div className="mt-6 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-30" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
              </span>

              <span className="text-xs text-[var(--secondary-text)]">
                Open to opportunities
              </span>
            </div>
          </div>
        </div>

        {/* LARGE TYPOGRAPHY */}
        <div className="overflow-hidden border-b border-[var(--accent-border)] py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-between gap-4"
          >
            {/* LARGE NAME */}
            <BrandLogo className="w-[min(70vw,850px)] max-w-[calc(100%-4rem)]" />

            {/* BACK TO TOP */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--accent-light)] text-[var(--accent)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--accent)] hover:text-[var(--accent-on)] md:h-16 md:w-16"
            >
              <ArrowUp
                size={22}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </motion.div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 pt-7 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Zura Beridze. All rights reserved.
          </p>

          <p>
            Designed & Developed with{" "}
            <span className="font-medium text-[var(--accent)]">
              passion
            </span>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
