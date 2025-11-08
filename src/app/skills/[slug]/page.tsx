import SkillClient from "./client";
import { getAllUniqueTechnologies } from "@/lib/utils";
import { Metadata } from "next";

export async function generateStaticParams() {
  const technologies = getAllUniqueTechnologies();
  return technologies.map((tech) => ({
    slug: tech.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const skillName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const description = `Explore projects and experiences related to ${skillName} on Sami Bentaiba's portfolio.`;
  const title = `${skillName} | Sami Bentaiba's Portfolio`;

  return {
    title,
    description,
    keywords: [skillName, "Sami Bentaiba", "Portfolio", "Projects", "Experiences"],
    openGraph: {
      title,
      description,
      url: `https://bentaidev.vercel.app/skills/${params.slug}`,
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
      title,
      description,
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
}

export default function SkillPage() {
  return <SkillClient />;
}