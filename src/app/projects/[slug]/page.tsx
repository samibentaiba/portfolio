// src/app/projects/[slug]/page.tsx
import ProjectClient from "./client";
import projectsData from "@/data/projects.json";
import { Metadata } from "next";
import { Props } from "@/lib/utils";


export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const project = projectsData.find((project) => project.slug === slug);

  if (!project) {
    return {};
  }

  const title = `${project.title} | Sami Bentaiba's Portfolio`;
  const description = project.description;
  const imageUrl = project.image.startsWith("http")
    ? project.image
    : `https://bentaidev.vercel.app${project.image}`;

  return {
    title,
    description,
    keywords: [
      ...project.technologies,
      project.title,
      "Sami Bentaiba",
      "Portfolio",
      "Projects",
    ],
    openGraph: {
      title,
      description,
      url: `https://bentaidev.vercel.app/projects/${slug}`,
      siteName: "Bentaidev",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@bentaiba_sami",
      creator: "@bentaiba_sami",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default function ProjectPage() {
  return <ProjectClient />;
}
