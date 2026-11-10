import type { Metadata } from "next";
import Projects from "../components/Projects";
import { getPublishedProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects | Zura Beridze",
  description: "Explore Zura Beridze’s web development and digital projects.",
  openGraph: {
    title: "Projects | Zura Beridze",
    description: "Explore Zura Beridze’s web development and digital projects.",
  },
};

export default async function ProjectsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Projects fullPage data={await getPublishedProjects()} />
    </main>
  );
}
