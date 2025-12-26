/**
 * Centralized SEO Configuration for ALGIS
 *
 * This module provides a unified system for managing SEO metadata across all pages.
 * Supports both static metadata and dynamic metadata generation for ID-based pages.
 *
 * @example Static usage:
 * ```tsx
 * import { getPageMetadata } from "@/lib/seo";
 * export const metadata = getPageMetadata("home");
 * ```
 *
 * @example Dynamic usage:
 * ```tsx
 * import { generateDynamicMetadata } from "@/lib/seo";
 * export async function generateMetadata({ params }) {
 *   const data = await fetchData(params.id);
 *   return generateDynamicMetadata("uap-detail", { name: data.name, id: data.id });
 * }
 * ```
 */

import type { Metadata } from "next";

// ============================================================
// SITE CONFIGURATION
// ============================================================

// Use environment variable for production URL, with fallback for development
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://algis-preview.vercel.app");

export const SITE_CONFIG = {
  name: "Algis",
  fullName: "Algerian Agriculture General Information System",
  url: SITE_URL,
  locale: "fr_FR",
  defaultImage: "/og-image.png",
  twitterImage: "/og-twitter.png",
  twitterCard: "summary_large_image" as const,
  author: {
    name: "National Office of Agricultural Development",
    url: "https://madr.gov.dz",
  },
  publisher: "Ministry of Agriculture and Rural Development",
  creator: "Sami Bentaiba",
};

// ============================================================
// PAGE METADATA REGISTRY (STATIC)
// ============================================================

interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  robots?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

export const PAGE_SEO: Record<string, PageSEO> = {
  // Public Pages
  home: {
    title: "ALGIS | Algerian Agriculture Management System",
    description: "Digitalize and streamline agricultural operations in Algeria. Manage UAPs, track livestock, monitor crops, and analyze farm finances in one unified platform.",
    keywords: ["ALGIS", "Algeria agriculture", "farm management", "UAP management", "livestock tracking", "crop management", "agricultural ERP", "digital farming"],
    openGraph: {
      title: "ALGIS | Modernizing Algerian Agriculture",
      description: "The integrated digital ecosystem for managing Algeria's agricultural resources. From livestock to crops, ALGIS powers data-driven farming.",
    },
  },

  // Auth Pages
  login: {
    title: "Sign In",
    description: "Sign in to your ALGIS account to manage your agricultural production units and access farm analytics.",
    robots: "noindex, nofollow",
  },
  register: {
    title: "Create Account",
    description: "Register for ALGIS to start digitizing your farm management with comprehensive agricultural tools.",
    robots: "noindex, nofollow",
  },
  "forget-password": {
    title: "Forgot Password",
    description: "Reset your ALGIS account password to regain access to your agricultural management dashboard.",
    robots: "noindex, nofollow",
  },
  "reset-password": {
    title: "Reset Password",
    description: "Create a new password for your ALGIS account.",
    robots: "noindex, nofollow",
  },
  "verification-result": {
    title: "Email Verification",
    description: "Email verification status for your ALGIS account.",
    robots: "noindex, nofollow",
  },

  // Legal Pages
  about: {
    title: "About Us",
    description: "Learn about ALGIS, the Algerian Agriculture General Information System, and our mission to modernize farm management across Algeria.",
    keywords: ["about ALGIS", "agriculture Algeria", "farm software"],
  },
  terms: {
    title: "Terms of Service",
    description: "Read the terms and conditions for using the ALGIS agricultural management platform.",
    robots: "noindex",
  },
  policy: {
    title: "Privacy Policy",
    description: "Understand how ALGIS collects, uses, and protects your agricultural data and personal information.",
    robots: "noindex",
  },
  faq: {
    title: "FAQ",
    description: "Frequently asked questions about ALGIS, farm management features, pricing, and support.",
    keywords: ["ALGIS FAQ", "farm software help", "agriculture questions"],
  },

  // Protected Pages
  dashboard: {
    title: "Dashboard",
    description: "Your ALGIS dashboard overview with quick access to UAP management, analytics, and farm statistics.",
    robots: "noindex, nofollow",
  },
  uap: {
    title: "UAP Management",
    description: "Manage your Agricultural Production Units (UAPs) - create, edit, and monitor all your farming operations.",
    robots: "noindex, nofollow",
  },
  production: {
    title: "Production Tracking",
    description: "Track vegetal and animal production including crops, livestock batches, milk production, and egg harvests.",
    robots: "noindex, nofollow",
  },
  stock: {
    title: "Stock & Equipment",
    description: "Manage farm inventory including equipment, consumables, seeds, fertilizers, and water resources.",
    robots: "noindex, nofollow",
  },
  finance: {
    title: "Finance & Analytics",
    description: "Track farm income, expenses, and view financial analytics for your agricultural operations.",
    robots: "noindex, nofollow",
  },
  settings: {
    title: "Settings",
    description: "Configure your ALGIS account preferences, notification settings, and display options.",
    robots: "noindex, nofollow",
  },
  profile: {
    title: "Profile",
    description: "View and edit your ALGIS user profile and account information.",
    robots: "noindex, nofollow",
  },
  admin: {
    title: "Admin Panel",
    description: "ALGIS administration panel for system management, user oversight, and report handling.",
    robots: "noindex, nofollow",
  },
  "website-settings": {
    title: "Website Settings",
    description: "Manage SEO configuration, security controls, and site analytics for ALGIS.",
    robots: "noindex, nofollow",
  },

  // Payment Pages
  "payment-success": {
    title: "Payment Successful",
    description: "Your payment has been successfully processed. Thank you for subscribing to ALGIS.",
    robots: "noindex, nofollow",
  },
  "payment-cancelled": {
    title: "Payment Cancelled",
    description: "Your payment was cancelled. You can try again or contact support for assistance.",
    robots: "noindex, nofollow",
  },

  // Dev Portal
  dev: {
    title: "Developer Portal",
    description: "ALGIS developer portal with documentation, pricing calculator, and contract generation tools.",
    keywords: ["ALGIS dev", "pricing calculator", "SOW generator"],
  },

  // Dynamic Pages (ID-based)
  "uap-detail": {
    title: "{name} | UAP Details",
    description: "Manage and monitor {name} Agricultural Production Unit. View parcels, livestock, production data.",
    robots: "noindex, nofollow",
  },
  "report-detail": {
    title: "Report: {name}",
    description: "View details for report #{id}. Track status, attachments, and resolution progress.",
    robots: "noindex, nofollow",
  },
};

// Export page keys for UI
export const PAGE_SEO_KEYS = Object.keys(PAGE_SEO);

// Page metadata for UI display
export interface PageInfo {
  key: string;
  label: string;
  category: "public" | "auth" | "protected" | "dynamic" | "layout";
  isDynamic: boolean;
  parent?: string;
  isLayout?: boolean;
}

export const PAGE_INFO: PageInfo[] = [
  // Layouts (wrap multiple pages)
  { key: "layout-root", label: "Root Layout (/)", category: "layout", isDynamic: false, isLayout: true },
  { key: "layout-protected", label: "Protected Layout (/dashboard, /uap, etc.)", category: "layout", isDynamic: false, isLayout: true },
  { key: "layout-dev", label: "Dev Layout (/dev)", category: "layout", isDynamic: false, isLayout: true },
  { key: "layout-payment", label: "Payment Layout (/payment/*)", category: "layout", isDynamic: false, isLayout: true },
  // Public
  { key: "home", label: "Home", category: "public", isDynamic: false },
  { key: "about", label: "About", category: "public", isDynamic: false },
  { key: "faq", label: "FAQ", category: "public", isDynamic: false },
  { key: "terms", label: "Terms", category: "public", isDynamic: false },
  { key: "policy", label: "Privacy Policy", category: "public", isDynamic: false },
  { key: "dev", label: "Developer Portal", category: "public", isDynamic: false, parent: "layout-dev" },
  // Auth
  { key: "login", label: "Login", category: "auth", isDynamic: false },
  { key: "register", label: "Register", category: "auth", isDynamic: false },
  { key: "forget-password", label: "Forgot Password", category: "auth", isDynamic: false },
  { key: "reset-password", label: "Reset Password", category: "auth", isDynamic: false },
  { key: "verification-result", label: "Email Verification", category: "auth", isDynamic: false },
  // Protected - Dashboard
  { key: "dashboard", label: "Dashboard", category: "protected", isDynamic: false, parent: "layout-protected" },
  { key: "uap", label: "UAP Management", category: "protected", isDynamic: false, parent: "layout-protected" },
  { key: "production", label: "Production", category: "protected", isDynamic: false, parent: "layout-protected" },
  { key: "stock", label: "Stock & Equipment", category: "protected", isDynamic: false, parent: "layout-protected" },
  { key: "finance", label: "Finance", category: "protected", isDynamic: false, parent: "layout-protected" },
  { key: "settings", label: "Settings", category: "protected", isDynamic: false, parent: "layout-protected" },
  { key: "profile", label: "Profile", category: "protected", isDynamic: false, parent: "layout-protected" },
  { key: "admin", label: "Admin Panel", category: "protected", isDynamic: false, parent: "layout-protected" },
  { key: "website-settings", label: "Website Settings", category: "protected", isDynamic: false, parent: "admin" },
  // Payment
  { key: "payment-success", label: "Payment Success", category: "protected", isDynamic: false, parent: "layout-payment" },
  { key: "payment-cancelled", label: "Payment Cancelled", category: "protected", isDynamic: false, parent: "layout-payment" },
  // Dynamic (ID-based)
  { key: "uap-detail", label: "UAP Detail (/uap/[id])", category: "dynamic", isDynamic: true, parent: "uap" },
  { key: "report-detail", label: "Report Detail (/admin/reports/[id])", category: "dynamic", isDynamic: true, parent: "admin" },
];

// ============================================================
// ROOT LAYOUT METADATA
// ============================================================

/**
 * Get the root layout metadata (for layout.tsx)
 * This provides the base metadata that all pages inherit from
 */
export function getRootMetadata(): Metadata {
  return {
    title: {
      default: "Algis | National Agricultural Management System",
      template: "%s | Algis",
    },
    description: "Algis is the official digital platform for the National Office of Agricultural Development in Algeria. Centralizing UAP management, livestock tracking, and agricultural production data.",
    keywords: ["Algis", "Agriculture Algeria", "UAP Management", "Livestock Tracking", "Ministry of Agriculture Algeria", "Farming ERP", "Agricultural Production Units", "Digital Agriculture"],
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.publisher,
    applicationName: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en",
        "fr-FR": "/fr",
        "ar-DZ": "/ar",
      },
    },
    openGraph: {
      title: "Algis | Modernizing Algerian Agriculture",
      description: "The integrated digital ecosystem for managing Algeria's agricultural resources. From livestock inventory to crop yields, Algis powers data-driven farming.",
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: "website",
      images: [
        {
          url: SITE_CONFIG.defaultImage,
          width: 1200,
          height: 630,
          alt: "Algis Platform Dashboard Preview",
        },
      ],
    },
    twitter: {
      card: SITE_CONFIG.twitterCard,
      title: "Algis | National Agriculture Platform",
      description: "Empowering Algerian agriculture with digital management tools. Official platform for UAP supervision.",
      images: [SITE_CONFIG.twitterImage],
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get static metadata for a page
 * @param page - Page key from PAGE_SEO registry
 * @returns Next.js Metadata object
 */
export function getPageMetadata(page: keyof typeof PAGE_SEO): Metadata {
  const seo = PAGE_SEO[page];
  if (!seo) {
    console.warn(`[SEO] No metadata found for page: ${page}`);
    return {};
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.robots,
    openGraph: seo.openGraph
      ? {
          title: seo.openGraph.title || seo.title,
          description: seo.openGraph.description || seo.description,
          url: SITE_CONFIG.url,
          siteName: SITE_CONFIG.name,
          locale: SITE_CONFIG.locale,
          type: "website",
          images: [
            {
              url: seo.openGraph.image || SITE_CONFIG.defaultImage,
              width: 1200,
              height: 630,
              alt: `${seo.title} - ${SITE_CONFIG.name}`,
            },
          ],
        }
      : undefined,
    twitter: {
      card: SITE_CONFIG.twitterCard,
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      images: [seo.openGraph?.image || SITE_CONFIG.defaultImage],
    },
  };
}

/**
 * Get DYNAMIC metadata for a page - fetches images and overrides from database
 * Use this for pages that need dynamic OG images from admin settings
 * @param page - Page key from PAGE_SEO registry
 * @param getSettings - Function to get website settings from database
 * @param dynamicParams - Optional params for ID-based pages (id, name)
 * @returns Next.js Metadata object with dynamic images and overrides
 */
export async function getDynamicPageMetadata(
  page: string,
  getSettings: () => Promise<{
    siteName: string;
    siteUrl: string;
    siteLocale: string;
    defaultOgImage: string;
    twitterCardImage: string;
    pageSeoConfig: string;
  }>,
  dynamicParams?: { id?: string; name?: string },
): Promise<Metadata> {
  const defaultSeo = PAGE_SEO[page];
  const settings = await getSettings();

  // Parse page SEO overrides from database
  let overrides: Record<string, PageSeoOverride> = {};
  try {
    overrides = JSON.parse(settings.pageSeoConfig || "{}");
  } catch {
    overrides = {};
  }

  const pageOverride = overrides[page];

  // Handle "removed" mode - minimal SEO
  if (pageOverride?.mode === "removed") {
    return {
      title: defaultSeo?.title || page,
      robots: "noindex, nofollow",
    };
  }

  // Handle "custom" mode - use custom values with fallback to defaults
  if (pageOverride?.mode === "custom") {
    // Apply dynamic placeholders if params provided
    const applyPlaceholders = (text: string | undefined): string | undefined => {
      if (!text) return text;
      let result = text;
      if (dynamicParams?.id) result = result.replace(/\{id\}/g, dynamicParams.id);
      if (dynamicParams?.name) result = result.replace(/\{name\}/g, dynamicParams.name);
      return result;
    };

    const title = applyPlaceholders(pageOverride.title) || defaultSeo?.title || page;
    const description = applyPlaceholders(pageOverride.description) || defaultSeo?.description || "";
    const ogTitle = applyPlaceholders(pageOverride.ogTitle) || title;
    const ogDescription = applyPlaceholders(pageOverride.ogDescription) || description;
    const ogImage = pageOverride.ogImage || settings.defaultOgImage;
    const twitterImage = pageOverride.twitterImage || settings.twitterCardImage || ogImage;

    return {
      title,
      description,
      keywords: pageOverride.keywords || defaultSeo?.keywords,
      robots: pageOverride.robots || defaultSeo?.robots,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: settings.siteUrl,
        siteName: settings.siteName,
        locale: settings.siteLocale,
        type: "website",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${title} - ${settings.siteName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: [twitterImage],
      },
    };
  }

  // Default "parent" mode or no override - use static defaults with dynamic images
  if (!defaultSeo) {
    console.warn(`[SEO] No metadata found for page: ${page}`);
    return {};
  }

  return {
    title: defaultSeo.title,
    description: defaultSeo.description,
    keywords: defaultSeo.keywords,
    robots: defaultSeo.robots,
    openGraph: {
      title: defaultSeo.openGraph?.title || defaultSeo.title,
      description: defaultSeo.openGraph?.description || defaultSeo.description,
      url: settings.siteUrl,
      siteName: settings.siteName,
      locale: settings.siteLocale,
      type: "website",
      images: [
        {
          url: settings.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${defaultSeo.title} - ${settings.siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultSeo.openGraph?.title || defaultSeo.title,
      description: defaultSeo.openGraph?.description || defaultSeo.description,
      images: [settings.twitterCardImage || settings.defaultOgImage],
    },
  };
}

// Interface for page SEO overrides (matches service layer)
interface PageSeoOverride {
  mode: "parent" | "custom" | "removed";
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterImage?: string;
  robots?: string;
}

// ============================================================
// DYNAMIC METADATA GENERATORS
// ============================================================

interface DynamicMetadataParams {
  /** Display name for the entity */
  name?: string;
  /** Unique identifier */
  id?: string;
  /** Custom description override */
  description?: string;
  /** Additional keywords */
  keywords?: string[];
}

type DynamicPageType = "uap-detail" | "report-detail" | "user-profile";

/**
 * Generate dynamic metadata for ID-based pages
 * @param type - The type of dynamic page
 * @param params - Dynamic parameters from the page data
 * @returns Next.js Metadata object
 */
export function generateDynamicMetadata(type: DynamicPageType, params: DynamicMetadataParams): Metadata {
  const templates: Record<DynamicPageType, (p: DynamicMetadataParams) => Metadata> = {
    "uap-detail": (p) => ({
      title: p.name ? `${p.name} | UAP Details` : "UAP Details",
      description: p.description || `Manage and monitor ${p.name || "this"} Agricultural Production Unit. View parcels, livestock, production data, and financial analytics.`,
      robots: "noindex, nofollow",
    }),

    "report-detail": (p) => ({
      title: p.name ? `Report: ${p.name}` : "Report Details",
      description: p.description || `View details for report ${p.id ? `#${p.id.slice(0, 8)}` : ""}. Track status, attachments, and resolution progress.`,
      robots: "noindex, nofollow",
    }),

    "user-profile": (p) => ({
      title: p.name ? `${p.name}'s Profile` : "User Profile",
      description: p.description || `View profile information, managed UAPs, and activity logs for ${p.name || "this user"}.`,
      robots: "noindex, nofollow",
    }),
  };

  const generator = templates[type];
  if (!generator) {
    console.warn(`[SEO] No dynamic template found for type: ${type}`);
    return {};
  }

  return generator(params);
}

// ============================================================
// JSON-LD STRUCTURED DATA GENERATORS
// ============================================================

export interface JsonLdOptions {
  type: "Organization" | "WebApplication" | "WebPage" | "FAQPage";
  data?: Record<string, unknown>;
}

/**
 * Generate JSON-LD structured data
 * @param options - Configuration for the structured data
 * @returns JSON-LD object ready for script injection
 */
export function generateJsonLd(options: JsonLdOptions): object {
  const base = {
    "@context": "https://schema.org",
  };

  switch (options.type) {
    case "WebApplication":
      return {
        ...base,
        "@type": "SoftwareApplication",
        name: SITE_CONFIG.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: SITE_CONFIG.fullName,
        author: {
          "@type": "Organization",
          name: SITE_CONFIG.author.name,
        },
        ...options.data,
      };

    case "Organization":
      return {
        ...base,
        "@type": "GovernmentOrganization",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.author.name,
        url: SITE_CONFIG.url,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.url}/logo.png`,
        },
        parentOrganization: {
          "@type": "GovernmentOrganization",
          name: SITE_CONFIG.publisher,
        },
        ...options.data,
      };

    case "WebPage":
      return {
        ...base,
        "@type": "WebPage",
        name: (options.data?.name as string) || SITE_CONFIG.name,
        description: (options.data?.description as string) || "",
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.author.name,
        },
        ...options.data,
      };

    case "FAQPage":
      return {
        ...base,
        "@type": "FAQPage",
        mainEntity: options.data?.questions || [],
      };

    default:
      return base;
  }
}

// ============================================================
// UTILITY EXPORTS
// ============================================================

/**
 * Default robots configuration for protected pages
 */
export const PROTECTED_ROBOTS = "noindex, nofollow";

/**
 * Get the full title with site name suffix
 */
export function getFullTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_CONFIG.name}`;
}

/**
 * Get canonical URL for a path
 */
export function getCanonicalUrl(path: string): string {
  return `${SITE_CONFIG.url}${path}`;
}
