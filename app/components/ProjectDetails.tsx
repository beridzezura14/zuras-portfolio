"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "../data/projects";
import SectionDecoration from "./SectionDecoration";

export default function ProjectDetails({ project }: { project: Project }) {
  return (
    <main id="main-content" tabIndex={-1} className="relative min-h-screen text-[var(--foreground)] [overflow-wrap:anywhere]">
      <SectionDecoration variant="detail" />
      <div className="mx-auto max-w-[1100px] px-5 pb-20 pt-28 md:px-8 md:pt-32">

        {/* BACK */}
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[var(--secondary-text)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          BACK TO PROJECTS
        </Link>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-9"
        >
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium tracking-wider text-[var(--secondary-text)] uppercase">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span>{project.category}</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span>{project.year}</span>
          </div>

          <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.065em]">
            {project.title}
            <span className="text-[var(--accent)]">.</span>
          </h1>

          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <p className="max-w-xl text-base leading-relaxed text-[var(--secondary-text)]">
              {project.shortDescription}
            </p>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold text-[var(--accent-on)] transition hover:bg-[var(--accent-hover)]"
              >
                LIVE WEBSITE
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </motion.div>

        {/* MAIN IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-9 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--accent-soft)] p-2 md:p-3"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* PROJECT INFORMATION */}
        <div className="mt-14 grid gap-10 border-t border-[var(--border-color)] pt-9 md:grid-cols-[1.3fr_0.7fr] md:gap-16">

          {/* DESCRIPTION */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xs font-semibold tracking-widest text-[var(--accent)]">
                01
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                Project Overview
              </h2>
            </div>

            <p className="text-[15px] leading-8 whitespace-pre-line text-[var(--secondary-text)]">
              {project.fullDescription}
            </p>
          </div>

          {/* TECH STACK */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xs font-semibold tracking-widest text-[var(--accent)]">
                02
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                Technologies
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-4 py-2 text-xs font-medium text-[var(--text-strong)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-12 border-t border-[var(--border-color)] pt-9">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-xs font-semibold tracking-widest text-[var(--accent)]">
              03
            </span>
            <h2 className="text-2xl font-semibold tracking-tight">
              Key Features
            </h2>
          </div>

          <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {project.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Check size={14} />
                </div>

                <span className="text-sm leading-6 text-[var(--text-strong)]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* GALLERY */}
        {project.gallery.length > 0 && (
          <div className="mt-12 border-t border-[var(--border-color)] pt-9">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-xs font-semibold tracking-widest text-[var(--accent)]">
                04
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                Project Gallery
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {project.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--accent-soft)]"
                >
                  <Image
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER LINKS */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-[var(--border-color)] pt-7">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm font-medium transition hover:text-[var(--accent)]"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            All Projects
          </Link>

          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] px-5 py-3 text-xs font-semibold transition hover:border-[var(--accent)]"
              >
                <FaGithub size={16} />
                SOURCE CODE
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold text-[var(--accent-on)] transition hover:bg-[var(--accent-hover)]"
              >
                VISIT WEBSITE
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
