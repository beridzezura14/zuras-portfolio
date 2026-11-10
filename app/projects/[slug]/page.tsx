import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ProjectDetails from "../../components/ProjectDetails";
import { getPublishedProjects } from "@/lib/content/projects";

// Disable Instant Navigation for this dynamic route
export const instant = false;

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static routes for published projects
export async function generateStaticParams() {
  return (await getPublishedProjects())
    .filter((project) => project.published)
    .map((project) => ({
      slug: project.slug,
    }));
}

// Dynamic SEO metadata
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = (await getPublishedProjects()).find(
    (item) => item.slug === slug && item.published
  );

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Zura Beridze`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | Zura Beridze`,
      description: project.shortDescription,
    },
  };
}

// Project details page
export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = (await getPublishedProjects()).find(
    (item) => item.slug === slug && item.published
  );

  if (!project) {
    notFound();
  }

  return <ProjectDetails project={project} />;
}
