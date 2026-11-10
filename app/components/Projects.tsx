"use client";

import { useState, useRef } from "react";
import type { MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import type { Project } from "../data/projects";
import SectionDecoration from "./SectionDecoration";

export default function Projects({ fullPage = false, data }: { fullPage?: boolean; data: Project[] }) {
  const publishedProjects = data.filter((project) => project.published);
  const projects = fullPage
    ? publishedProjects
    : publishedProjects.filter((project) => project.featured).slice(0, 4);
  const technologies = [...new Set(projects.flatMap(project => project.technologies))].slice(0, 5);
  const categories = new Set(projects.map(project => project.category).filter(Boolean)).size;

  const [activeProject, setActiveProject] = useState<Project | null>(
    null
  );

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();

    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <section
      id="projects"
      data-nav-section
      className={`relative text-[var(--foreground)] ${
        fullPage ? "min-h-screen pt-40 pb-24 md:pt-48 md:pb-32" : "py-24 md:py-32"
      }`}
    >
      <SectionDecoration variant="projects" />
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">

        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-12 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-20"
        >
          <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[var(--secondary-text)] uppercase">
              {fullPage ? "Portfolio / All Work" : "01 / Selected Work"}
            </span>
          </div>

          {fullPage ? (
            <h1 className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] font-semibold tracking-[-0.075em]">
              All<br />
              <span className="text-[var(--accent)]">projects.</span>
            </h1>
          ) : (
            <h2 className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] font-semibold tracking-[-0.075em]">
              Selected
            <br />
            <span className="text-[var(--accent)]">
              projects.
            </span>
            </h2>
          )}

          <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--secondary-text)] md:text-lg">
            A collection of projects showcasing my approach to
            development, design, and digital experiences.
          </p>
          </div>
          <aside aria-label="Project collection overview" className="hidden border-l border-[var(--accent-border)] pb-1 pl-8 lg:block xl:pl-10">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">{fullPage ? "The collection" : "A selection of my work"}</p>
            <div className="mt-6 flex items-end gap-5">
              <span className="text-7xl leading-none font-semibold tracking-[-0.075em] text-[var(--accent)]">{String(projects.length).padStart(2, "0")}</span>
              <p className="pb-1 text-sm leading-6 text-[var(--secondary-text)]">{fullPage ? "Published projects" : "Featured projects"}<br /><span className="text-[var(--text-muted)]">{categories} {categories === 1 ? "category" : "categories"} explored</span></p>
            </div>
            {technologies.length > 0 && <div className="mt-7 border-t border-[var(--border-color)] pt-5"><p className="mb-3 text-[10px] font-medium tracking-widest text-[var(--secondary-text)] uppercase">Tools behind the work</p><div className="flex flex-wrap gap-2">{technologies.map(technology => <span key={technology} className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-3 py-1.5 text-[11px] text-[var(--text-strong)]">{technology}</span>)}</div></div>}
          </aside>
        </motion.div>

        {/* PROJECT LIST */}
        <div
          ref={sectionRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveProject(null)}
          className="relative"
        >
          <div className="border-t border-[var(--border-color)]">
            {projects.length === 0 && <p className="py-12 text-sm text-[var(--secondary-text)]">New projects are on the way.</p>}
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                onMouseEnter={() => setActiveProject(project)}
                className="group relative border-b border-[var(--border-color)]"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="relative z-10 block py-8 transition-colors duration-300 hover:bg-[var(--accent-soft)] md:px-6 md:py-12"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    {/* TITLE */}
                    <div className="flex items-center gap-5">
                      <span className="text-xs font-medium text-[var(--text-muted)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="min-w-0 text-3xl font-semibold tracking-[-0.055em] transition-transform duration-300 group-hover:translate-x-2 md:text-5xl lg:text-6xl [overflow-wrap:anywhere]">
                        {project.title}
                      </h3>
                    </div>

                    {/* CATEGORY & YEAR */}
                    <div className="flex items-center justify-between gap-8 pl-9 md:pl-0">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--secondary-text)]">
                        <span>{project.category}</span>

                        <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />

                        <span>{project.year}</span>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] transition-all duration-300 group-hover:rotate-45 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-on)]">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>

                  {/* MOBILE IMAGE */}
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--accent-soft)] md:hidden">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FLOATING IMAGE PREVIEW */}
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.id}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  rotate: -5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  rotate: 5,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  left: mousePosition.x,
                  top: mousePosition.y,
                  transform: "translate(-50%, -50%)",
                }}
                className="pointer-events-none z-20 hidden w-[340px] overflow-hidden rounded-2xl border-[8px] border-[var(--accent-light)] bg-[var(--accent-soft)] shadow-[0_25px_80px_var(--accent-shadow)] md:block lg:w-[420px]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={activeProject.coverImage}
                    alt={activeProject.title}
                    fill
                    sizes="420px"
                    className="object-cover"
                  />
                </div>

                <div className="absolute right-3 bottom-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-on)]">
                  <ArrowUpRight size={20} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VIEW ALL */}
        {!fullPage && <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-5 rounded-full border border-[var(--foreground)] px-8 py-5 text-sm font-semibold tracking-wide transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-on)]"
          >
            VIEW ALL PROJECTS

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>}
      </div>
    </section>
  );
}
