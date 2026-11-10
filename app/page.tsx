import About from "./components/About";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import { Suspense } from "react";
import { getAboutContent } from "@/lib/content/about";
import { getPublishedProjects } from "@/lib/content/projects";

async function AboutSection() {
  return <About data={await getAboutContent()} />;
}
async function ProjectsSection() {
  return <Projects data={await getPublishedProjects()} />;
}

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <Suspense fallback={<section id="projects" className="min-h-96 px-6 py-24" role="status">Loading projects…</section>}><ProjectsSection /></Suspense>
      <Suspense fallback={<section id="about" className="min-h-96 px-6 py-24" role="status">Loading About…</section>}><AboutSection /></Suspense>
      <Contact /> 
    </main>
  );
}
