// src/app/projects/page.tsx
import ProjectsListClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Sami Bentaiba's Portfolio",
  description: "Browse all my software engineering projects. See the technologies, collaborations, and problem-solving approaches used in each project.",
  keywords: [
    "Projects",
    "Software",
    "Web Development",
    "Applications",
    "Sami Bentaiba",
    "Portfolio",
  ],
  openGraph: {
    title: "Projects | Sami Bentaiba's Portfolio",
    description: "Browse all my software engineering projects and contributions.",
    url: "https://bentaidev.vercel.app/projects",
    siteName: "Bentaidev",
    type: "website",
    images: [
      {
        url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
        width: 1200,
        height: 630,
        alt: "Sami Bentaiba's Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bentaiba_sami",
    creator: "@bentaiba_sami",
    title: "Projects | Sami Bentaiba's Portfolio",
    description: "Browse all my software engineering projects and contributions.",
    images: [
      {
        url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
        width: 1200,
        height: 630,
        alt: "Sami Bentaiba's Portfolio",
      },
    ],
  },
};

export default function ProjectsPage() {
  return <ProjectsListClient />;
}
