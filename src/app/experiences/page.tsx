// src/app/experiences/page.tsx
import ExperiencesListClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiences | Sami Bentaiba's Portfolio",
  description: "Explore my professional journey, roles, and experiences in software engineering. See where I've worked and what I've accomplished.",
  keywords: [
    "Experiences",
    "Work History",
    "Software Engineer",
    "Career",
    "Sami Bentaiba",
    "Portfolio",
  ],
  openGraph: {
    title: "Experiences | Sami Bentaiba's Portfolio",
    description: "Explore my professional journey, roles, and experiences in software engineering.",
    url: "https://bentaidev.vercel.app/experiences",
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
    title: "Experiences | Sami Bentaiba's Portfolio",
    description: "Explore my professional journey, roles, and experiences in software engineering.",
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

export default function ExperiencesPage() {
  return <ExperiencesListClient />;
}
