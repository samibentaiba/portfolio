import ProjectClient from "./client";
import { Metadata } from "next";
import projectsData from "@/data/projects.json";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projectsData.find((project) => project.slug === params.slug);

  if (!project) {
    return {};
  }

  const imageUrl = project.image.startsWith("http")
    ? project.image
    : `https://bentaidev.vercel.app${project.image}`;

  return {
    title: project.title,
    description: project.description,
    keywords: [...project.technologies, project.title, "Sami Bentaiba", "Portfolio", "Projects"],
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://bentaidev.vercel.app/projects/${params.slug}`,
      siteName: "Bentaidev",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      site: "@bentaiba_sami",
      creator: "@bentaiba_sami",
      images: [
        {
          url: imageUrl,
          alt: project.title,
        },
      ],
    },
  };
}

export default function ProjectPage() {
  return <ProjectClient />;
}