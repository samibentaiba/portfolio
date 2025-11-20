import type { Metadata } from "next";
import { Inter } from "next/font/google";
import personalData from "@/data/personal.json";
import "./globals.css";
const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});
import { Wrapper } from "./wrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://bentaidev.vercel.app"),
  title: {
    default: "Sami Bentaiba | Software Engineer",
    template: "%s | Sami Bentaiba",
  },
  description: personalData.description,
  keywords: [
    "Sami Bentaiba",
    "Software Engineer",
    "Full-stack Developer",
    "Web Developer",
    "Portfolio",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
  ],
  authors: [{ name: "Sami Bentaiba" }],
  creator: "Sami Bentaiba",
  publisher: "Sami Bentaiba",
  alternates: {
    canonical: "https://bentaidev.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: {
      url: "/logo.svg",
    },
  },
  openGraph: {
    title: "Sami Bentaiba | Software Engineer",
    description:
      "Personal portfolio website showcasing skills, experiences, and projects.",
    url: "https://bentaidev.vercel.app",
    siteName: "Bentaidev",
    type: "website",
    locale: "en_US",
    emails: "samibentaiba25@gmail.com",
    phoneNumbers: "+213656739896",
    countryName: "Algeria",
    images: [
      {
        url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
        width: 1200,
        height: 630,
        alt: "Sami Bentaiba's Portfolio",
      },
      {
        url: "https://bentaidev.vercel.app/logo.svg",
        width: 150,
        height: 150,
        alt: "Bentaidev Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sami Bentaiba | Software Engineer",
    description:
      "Personal portfolio website showcasing skills, experiences, and projects.",
    creator: "@bentaiba_sami",
    site: "@bentaiba_sami",
    images: [
      {
        url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
        width: 1200,
        height: 630,
        alt: "Sami Bentaiba's Portfolio",
      },
      {
        url: "https://bentaidev.vercel.app/logo.svg",
        width: 150,
        height: 150,
        alt: "Bentaidev Logo",
      },
    ],
  },
};

export const viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebPage",
                  "@id": "https://bentaidev.vercel.app/#webpage",
                  url: "https://bentaidev.vercel.app/",
                  name: "Sami Bentaiba | Software Engineer",
                  isPartOf: {
                    "@id": "https://bentaidev.vercel.app/#website",
                  },
                  primaryImageOfPage: {
                    "@type": "ImageObject",
                    url: "https://bentaidev.vercel.app/bentaidev-og-image.png",
                  },
                  description:
                    "Personal portfolio website showcasing skills, experiences, and projects.",
                  inLanguage: "en-US",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://bentaidev.vercel.app/#website",
                  url: "https://bentaidev.vercel.app/",
                  name: "Sami Bentaiba",
                  description:
                    "Personal portfolio website showcasing skills, experiences, and projects.",
                  publisher: {
                    "@id": "https://bentaidev.vercel.app/#person",
                  },
                  inLanguage: "en-US",
                },
                {
                  "@type": "Person",
                  "@id": "https://bentaidev.vercel.app/#person",
                  name: "Sami Bentaiba",
                  url: "https://bentaidev.vercel.app/",
                  image: {
                    "@type": "ImageObject",
                    url: "https://bentaidev.vercel.app/logo.svg",
                  },
                  sameAs: [
                    "https://github.com/samibentaiba",
                    "https://www.linkedin.com/in/samibentaiba",
                    "https://twitter.com/bentaiba_sami",
                    "https://www.instagram.com/bentaidev",
                  ],
                  jobTitle: "Software Engineer",
                  email: "samibentaiba25@gmail.com",
                  telephone: "+213656739896",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${interSans.className}`} cz-shortcut-listen="true">
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
