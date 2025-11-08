import ExperienceClient from "./client";
import experiencesData from "@/data/experiences.json";
import { Metadata } from "next";
import { Props } from "@/lib/utils";


export async function generateStaticParams() {
  return experiencesData.map((experience) => ({
    slug: experience.slug,
  }));
}

// Update the function signature to use Props type
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Add this line to await the params
  const { slug } = await params;

  // Update this line to use slug instead of params.slug
  const experience = experiencesData.find(
    (experience) => experience.slug === slug
  );

  if (!experience) {
    return {};
  }

  const title = `${experience.role} at ${experience.company} | Sami Bentaiba's Portfolio`;
  const description = experience.summary;

  return {
    title,
    description,
    keywords: [
      ...experience.skills,
      experience.role,
      experience.company,
      "Sami Bentaiba",
      "Portfolio",
    ],
    openGraph: {
      title,
      description,
      // Update this line to use slug instead of params.slug
      url: `https://bentaidev.vercel.app/experiences/${slug}`,
      siteName: "Bentaidev",
      type: "website",
      images: [
        {
          url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
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
          url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default function ExperiencePage() {
  return <ExperienceClient />;
}
