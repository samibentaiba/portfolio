// src/app/skills/page.tsx
import SkillsListClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | Sami Bentaiba's Portfolio",
  description: "Explore all my technical skills and technologies, organized by category. See my proficiency in frontend, backend, DevOps, and more.",
  keywords: [
    "Skills",
    "Technologies",
    "Frontend",
    "Backend",
    "DevOps",
    "Sami Bentaiba",
    "Portfolio",
  ],
  openGraph: {
    title: "Skills | Sami Bentaiba's Portfolio",
    description: "Explore all my technical skills and technologies, organized by category.",
    url: "https://bentaidev.vercel.app/skills",
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
    title: "Skills | Sami Bentaiba's Portfolio",
    description: "Explore all my technical skills and technologies, organized by category.",
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

export default function SkillsPage() {
  return <SkillsListClient />;
}
