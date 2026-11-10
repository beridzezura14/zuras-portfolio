"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  ArrowUpRight,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
} from "lucide-react";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import type { AboutData } from "../data/about";
import SectionDecoration from "./SectionDecoration";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

function formatDate(date: string | null) {
  if (!date) return "Present";

  const parts = date.split("-");

  if (parts.length === 1) {
    return parts[0];
  }

  const [year, month] = parts.map(Number);

  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function About({ data }: { data: AboutData }) {
  const skillCount = new Set(data.skills.flatMap(group => group.skills)).size;

  return (
    <section
      id="about"
      data-nav-section
      className="relative py-24 text-[var(--foreground)] md:py-32"
    >
      <SectionDecoration variant="about" />
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        {/* SECTION HEADER */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="mb-20 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end lg:gap-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-16"
        >
          <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[var(--secondary-text)] uppercase">
              02 / About Me
            </span>
          </div>

          <h2 className="max-w-[1100px] text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] font-semibold tracking-[-0.075em]">
            A little more
            <br />
            <span className="text-[var(--accent)]">
              about me.
            </span>
          </h2>
          </div>
          <aside aria-label="Profile at a glance" className="hidden border-l border-[var(--accent-border)] pb-1 pl-8 lg:block xl:pl-10">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">The person behind the work</p>
            <p className="mt-5 text-xl leading-snug font-medium tracking-tight text-[var(--foreground)]">{data.title}</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-[var(--secondary-text)]"><MapPin size={14} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />{data.location}</p>
            <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-[var(--border-color)] pt-5"><div><dd className="text-3xl font-semibold tracking-tight text-[var(--accent)]">{String(data.experience.length).padStart(2, "0")}</dd><dt className="mt-2 text-[11px] text-[var(--secondary-text)]">Professional roles</dt></div><div><dd className="text-3xl font-semibold tracking-tight text-[var(--accent)]">{String(skillCount).padStart(2, "0")}</dd><dt className="mt-2 text-[11px] text-[var(--secondary-text)]">Skills & tools</dt></div></dl>
            <Link href="/about" className="group mt-6 inline-flex items-center gap-3 text-xs font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--accent)]">Discover my story<ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></Link>
          </aside>
        </motion.div>

        {/* INTRODUCTION */}
        <div className="grid gap-12 border-t border-[var(--border-color)] pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {/* LEFT */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 flex items-center gap-2 text-sm text-[var(--secondary-text)]">
              <MapPin size={16} className="text-[var(--accent)]" />
              {data.location}
            </div>

            <h3 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              {data.name}
            </h3>

            <p className="mt-3 text-sm font-medium tracking-wide text-[var(--accent)]">
              {data.title}
            </p>

            <div className="mt-8 flex items-center gap-3">
              {/* GITHUB */}
              {data.socialLinks.github && <a
                href={data.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                <FaGithub size={19} />
              </a>}

              {/* LINKEDIN */}
              {data.socialLinks.linkedin && <a
                href={data.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                <FaLinkedinIn size={19} />
              </a>}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h3 className="mb-8 max-w-[750px] text-2xl leading-snug font-medium tracking-[-0.035em] md:text-4xl">
              {data.introduction}
            </h3>

            <p className="max-w-[720px] text-base leading-[1.9] text-[var(--secondary-text)] md:text-lg">
              {data.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 border-b border-[var(--foreground)] pb-2 text-sm font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              GET IN TOUCH

              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
            <Link href="/about" className="group inline-flex items-center gap-3 border-b border-[var(--border-color)] pb-2 text-sm font-semibold text-[var(--secondary-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
              MORE ABOUT ME
              <ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            </div>
          </motion.div>
        </div>

        {/* EXPERIENCE */}
        <div className="mt-32">
          <div className="mb-12 flex items-center gap-4">
            <BriefcaseBusiness
              size={22}
              className="text-[var(--accent)]"
            />

            <h3 className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
              Experience
            </h3>
          </div>

          <div className="border-t border-[var(--border-color)]">
            {data.experience.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="group grid gap-6 border-b border-[var(--border-color)] py-9 transition-colors hover:bg-[var(--accent-subtle)] md:grid-cols-[220px_1fr]"
              >
                <div className="text-sm font-medium text-[var(--secondary-text)]">
                  {formatDate(item.startDate)} —{" "}
                  {formatDate(item.endDate)}
                </div>

                <div>
                  <h4 className="text-xl font-semibold tracking-tight md:text-2xl">
                    {item.position}
                  </h4>

                  <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                    {item.company}
                  </p>

                  <ul className="mt-5 space-y-2">
                    {item.description.map((description, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm leading-relaxed text-[var(--secondary-text)]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                        {description}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* EDUCATION */}
        <div className="mt-32">
          <div className="mb-12 flex items-center gap-4">
            <GraduationCap
              size={24}
              className="text-[var(--accent)]"
            />

            <h3 className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
              Education & Courses
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.education.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="group rounded-2xl border border-[var(--border-color)] p-7 transition-all duration-300 hover:border-[var(--accent-light)] hover:bg-[var(--accent-subtle)] md:p-9"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wider text-[var(--secondary-text)]">
                    {formatDate(item.startDate)} —{" "}
                    {formatDate(item.endDate)}
                  </span>

                  <ArrowUpRight
                    size={20}
                    className="text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>

                <h4 className="text-xl font-semibold tracking-tight">
                  {item.institution}
                </h4>

                <p className="mt-3 text-sm leading-relaxed text-[var(--secondary-text)]">
                  {item.program}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SKILLS */}
        <div className="mt-32">
          <div className="mb-12 flex items-center gap-4">
            <Code2 size={24} className="text-[var(--accent)]" />

            <h3 className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
              Skills & Technologies
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {data.skills.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="rounded-2xl border border-[var(--border-color)] p-7 md:p-9"
              >
                <div className="mb-8 flex items-center justify-between">
                  <h4 className="text-lg font-semibold">
                    {group.category}
                  </h4>

                  <span className="text-xs text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[var(--border-color)] bg-[var(--surface-muted)] px-4 py-2 text-xs font-medium text-[var(--secondary-text)] transition-colors hover:border-[var(--accent-light)] hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="mt-24 border-t border-[var(--border-color)] pt-12">
          <h3 className="mb-8 text-2xl font-semibold tracking-tight">
            Languages
          </h3>

          <div className="flex flex-wrap gap-4">
            {data.languages.map((language) => (
              <div
                key={language.name}
                className="flex items-center gap-4 rounded-full border border-[var(--border-color)] px-6 py-3"
              >
                <span className="text-sm font-semibold">
                  {language.name}
                </span>

                <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />

                <span className="text-sm text-[var(--secondary-text)]">
                  {language.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
