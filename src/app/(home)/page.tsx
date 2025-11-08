import HomeClient from "./client";
import { Metadata } from "next";
import personalData from "@/data/personal.json";

export const metadata: Metadata = {
  title: `${personalData.name} | ${personalData.job}`,
  description: personalData.description,
  openGraph: {
    title: `${personalData.name} | ${personalData.job}`,
    description: personalData.description,
    url: "https://bentaidev.vercel.app",
    siteName: personalData.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
        width: 1200,
        height: 630,
        alt: `${personalData.name}'s Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bentaiba_sami", // Assuming this is a fixed Twitter handle
    creator: "@bentaiba_sami", // Assuming this is a fixed Twitter handle
    title: `${personalData.name} | ${personalData.job}`,
    description: personalData.description,
    images: [
      {
        url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
        width: 1200,
        height: 630,
        alt: `${personalData.name}'s Portfolio`,
      },
    ],
  },
};

export default function Home() {
  return <HomeClient />;
}