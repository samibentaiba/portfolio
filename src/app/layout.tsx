import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});
import { ScrollHandler } from "@/components/scroll-handler";
import { BackgroundProvider } from "./background-provider";

// Define your base URL - update this with your actual domain
const BASE_URL = "https://bentaidev.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL), // This is crucial for relative URLs
  title: {
    default: "Sami Bentaiba | Software Engineer",
    template: "%s | Sami Bentaiba",
  },
  description:
    "I'm a passionate and fast-learning software engineer and student who, within 3 years, has mastered full-stack web development using both JavaScript , Java and PHP. Currently, I'm expanding my skills into desktop and mobile application development, along with a deep focus on building software services across multiple platforms. My drive to continuously learn and adapt allows me to tackle new technologies quickly and effectively.",
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
    canonical: "/",
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
    apple: "/metadata-placeholder.png",
  },
  openGraph: {
    title: "Sami Bentaiba | Software Engineer",
    description:
      "Personal portfolio website showcasing skills, experiences, and projects.",
    url: BASE_URL,
    siteName: "Sami Bentaiba",
    type: "website",
    locale: "en_US",
    emails: "samibentaiba25@gmail.com",
    images: [
      {
        url: `${BASE_URL}/metadata-placeholder.png`, // Absolute URL
        width: 1200,
        height: 630,
        alt: "Sami Bentaiba's Portfolio",
      },
      {
        url: `${BASE_URL}/logo.svg`, // Absolute URL
        width: 500,
        height: 500,
        alt: "Bentaidev Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sami Bentaiba | Software Engineer",
    description:
      "Personal portfolio website showcasing skills, experiences, and projects.",
    images: [
      {
        url: `${BASE_URL}/metadata-placeholder.png`, // Absolute URL
        width: 1200,
        height: 630,
        alt: "Sami Bentaiba's Portfolio",
      },
      {
        url: `${BASE_URL}/logo.svg`, // Absolute URL
        width: 500,
        height: 500,
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
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                  "@id": `${BASE_URL}/#webpage`,
                  "url": `${BASE_URL}/`,
                  "name": "Sami Bentaiba | Software Engineer",
                  "isPartOf": {
                    "@id": `${BASE_URL}/#website`,
                  },
                  "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": `${BASE_URL}/metadata-placeholder.png`,
                  },
                  "description":
                    "Personal portfolio website showcasing skills, experiences, and projects.",
                  "inLanguage": "en-US",
                },
                {
                  "@type": "WebSite",
                  "@id": `${BASE_URL}/#website`,
                  "url": `${BASE_URL}/`,
                  "name": "Sami Bentaiba",
                  "description":
                    "Personal portfolio website showcasing skills, experiences, and projects.",
                  "publisher": {
                    "@id": `${BASE_URL}/#organization`,
                  },
                  "inLanguage": "en-US",
                },
                {
                  "@type": "Person",
                  "@id": `${BASE_URL}/#person`,
                  "name": "Sami Bentaiba",
                  "url": `${BASE_URL}/`,
                  "sameAs": [
                    "https://github.com/samibentaiba",
                    "https://www.linkedin.com/in/sami-bentaiba",
                    "https://twitter.com/samibentaiba",
                    "https://www.instagram.com/sami.bentaiba"
                  ],
                  "jobTitle": "Software Engineer",
                  "email": "samibentaiba25@gmail.com",
                  "telephone": "+213 656 73 98 96",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${interSans.className}`} cz-shortcut-listen="true">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundProvider>
            <LanguageProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div id="/" className="flex-1 py-8">
                  {children}
                </div>
                <Footer />
                <ScrollHandler />
              </div>
            </LanguageProvider>
          </BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}