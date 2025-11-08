import ResumeClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Sami Bentaiba",
  description: "View and download the professional resume of Sami Bentaiba, Software Engineer.",
  keywords: ["Resume", "CV", "Sami Bentaiba", "Software Engineer", "Experience", "Skills"],
  openGraph: {
    title: "Resume | Sami Bentaiba",
    description: "View and download the professional resume of Sami Bentaiba, Software Engineer.",
    url: "https://bentaidev.vercel.app/resume",
    siteName: "Bentaidev",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://bentaidev.vercel.app/bentaidev-1200x630-149kb.png",
        width: 1200,
        height: 630,
        alt: "Sami Bentaiba's Resume",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bentaiba_sami",
    creator: "@bentaiba_sami",
    title: "Resume | Sami Bentaiba",
    description: "View and download the professional resume of Sami Bentaiba, Software Engineer.",
    images: [
      {
        url: "https://bentaidev.vercel.app/bentaidev-1200x630-149kb.png",
        width: 1200,
        height: 630,
        alt: "Sami Bentaiba's Resume",
      },
    ],
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}