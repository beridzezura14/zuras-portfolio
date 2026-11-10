"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import SectionDecoration from "./SectionDecoration";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const EMAIL = "zuraberidze12@gmail.com";
const PHONE = "+995 558 29 43 64";
const PHONE_LINK = "+995558294364";
const WHATSAPP = "https://wa.me/995558294364";

const socials = [
  {
    name: "WhatsApp",
    href: WHATSAPP,
    icon: FaWhatsapp,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/zura-beridze-a39725197/",
    icon: FaLinkedinIn,
  },
  {
    name: "GitHub",
    href: "https://github.com/beridzezura14",
    icon: FaGithub,
  },
];

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const sendingRef = useRef(false);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setSubmitted(false);
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSending(true); setSubmitted(false); setError("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || "Your message could not be sent. Please try again.");
      setForm(initialForm);
      setSubmitted(true);
    } catch (error) { setError(error instanceof Error && !(error instanceof SyntaxError) && error.message !== "Failed to fetch" ? error.message : "Unable to send your message. Please check your connection and try again."); }
    finally { sendingRef.current = false; setSending(false); }
  };

  return (
    <section
      id="contact"
      className="relative py-24 text-[var(--foreground)] md:py-32"
    >
      <SectionDecoration variant="contact" />
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">

        {/* SECTION TOP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex items-center justify-between border-b border-[var(--border-color)] pb-6"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-[var(--secondary-text)] uppercase">
            03 / Contact
          </span>

          <span className="hidden text-xs tracking-[0.15em] text-[var(--text-muted)] uppercase sm:block">
            Have something in mind?
          </span>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* HEADING */}
            <h2 className="text-[clamp(3.8rem,7vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.085em]">
              Let&apos;s work
              <br />
              <span className="text-[var(--accent)]">
                together.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-9 max-w-md text-base leading-8 text-[var(--secondary-text)]">
              Have a project, an idea, or an opportunity?
              I&apos;m always open to discussing new challenges
              and creating something meaningful together.
            </p>

            {/* CONTACT DETAILS */}
            <div className="mt-14 max-w-lg">

              {/* EMAIL */}
              <a
                href={`mailto:${EMAIL}`}
                className="group flex items-center justify-between gap-4 border-t border-[var(--border-color)] py-6"
              >
                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-semibold tracking-[0.16em] text-[var(--text-muted)] uppercase">
                    Email
                  </span>

                  <span className="block break-all text-base font-medium transition-colors duration-300 group-hover:text-[var(--accent)] sm:text-lg">
                    {EMAIL}
                  </span>
                </div>

                <ArrowUpRight
                  size={22}
                  className="shrink-0 text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>

              {/* PHONE */}
              <a
                href={`tel:${PHONE_LINK}`}
                className="group flex items-center justify-between gap-4 border-t border-[var(--border-color)] py-6"
              >
                <div>
                  <span className="mb-2 block text-[11px] font-semibold tracking-[0.16em] text-[var(--text-muted)] uppercase">
                    Phone
                  </span>

                  <span className="block text-base font-medium transition-colors duration-300 group-hover:text-[var(--accent)] sm:text-lg">
                    {PHONE}
                  </span>
                </div>

                <ArrowUpRight
                  size={22}
                  className="shrink-0 text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>

              <div className="border-t border-[var(--border-color)]" />
            </div>

            {/* SOCIAL LINKS */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-strong)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-on)]"
                  >
                    <Icon size={19} />
                  </a>
                );
              })}

              <span className="ml-2 text-xs text-[var(--text-muted)]">
                Find me online
              </span>
            </div>

          </motion.div>

          {/* RIGHT - FORM */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:pt-3"
          >
            {/* FORM HEADER */}
            <div className="mb-12">
              <h3 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
                Tell me about
                <br />
                your idea<span className="text-[var(--accent)]">.</span>
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--secondary-text)]">
                Fill out the form below and let&apos;s start
                a conversation.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-9"
              aria-busy={sending}
            >
              <div hidden aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" type="text" value={form.website} onChange={handleChange} autoComplete="off" tabIndex={-1} /></div>
              <fieldset disabled={sending} className="space-y-9 disabled:opacity-60">
              {/* NAME */}
              <div className="group">
                <label
                  htmlFor="contact-name"
                  className="mb-3 block text-[11px] font-semibold tracking-[0.15em] text-[var(--secondary-text)] uppercase"
                >
                  Your Name
                  <span className="ml-1 text-[var(--accent)]">*</span>
                </label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  className="w-full border-b border-[var(--border-color)] bg-transparent pb-4 text-base text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              {/* EMAIL */}
              <div className="group">
                <label
                  htmlFor="contact-email"
                  className="mb-3 block text-[11px] font-semibold tracking-[0.15em] text-[var(--secondary-text)] uppercase"
                >
                  Email Address
                  <span className="ml-1 text-[var(--accent)]">*</span>
                </label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className="w-full border-b border-[var(--border-color)] bg-transparent pb-4 text-base text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>


              {/* MESSAGE */}
              <div className="group">
                <label
                  htmlFor="contact-message"
                  className="mb-3 block text-[11px] font-semibold tracking-[0.15em] text-[var(--secondary-text)] uppercase"
                >
                  Your Message
                  <span className="ml-1 text-[var(--accent)]">*</span>
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={4}
                  required
                  minLength={10}
                  maxLength={3000}
                  className="w-full resize-none border-b border-[var(--border-color)] bg-transparent pb-4 text-base leading-7 text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              {/* SUBMIT */}
              </fieldset>
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="group flex w-full cursor-pointer items-center justify-between rounded-full bg-[var(--foreground)] px-7 py-5 text-sm font-semibold text-[var(--background)] transition-all duration-300 hover:bg-[var(--accent)] hover:text-[var(--accent-on)] disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="tracking-[0.06em]">
                    {sending ? "SENDING…" : "SEND MESSAGE"}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowUpRight size={19} />
                  </span>
                </button>

                <p className="mt-4 text-center text-xs leading-6 text-[var(--text-muted)]">
                  Your message is sent directly through this website.
                </p>
              </div>

              {/* SUCCESS NOTICE */}
              {error && <p role="alert" className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm leading-6">{error} Your message is still in the form.</p>}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className="flex items-start gap-3 border-l-2 border-[var(--accent)] bg-[var(--accent-soft)] p-4"
                >
                  <Check
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--accent)]"
                  />

                  <p className="text-sm leading-6 text-[var(--text-strong)]">
                    Your message has been sent successfully. Thank you for getting in touch!
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* BOTTOM */}
        <div className="mt-24 flex items-center gap-5 border-t border-[var(--border-color)] pt-6">
          <span className="text-xs font-medium tracking-[0.12em] text-[var(--text-muted)] uppercase">
            Let&apos;s create something exceptional
          </span>

          <ArrowRight
            size={17}
            className="text-[var(--accent)]"
          />
        </div>
      </div>
    </section>
  );
}
