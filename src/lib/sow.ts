/**
 * Centralized SOW (Statement of Work) Module for ALGIS
 *
 * SINGLE SOURCE OF TRUTH for all contract, pricing, and documentation data.
 * Used by: dev/page.tsx (UI), PrintableDocs (PDF), docs/07-sow/ (Markdown)
 *
 * @module lib/sow
 */

// ============================================================
// TYPES
// ============================================================

export interface Feature {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export interface ModuleData {
  id: string;
  name: string;
  iconName: string; // Icon name as string for serialization
  description: string;
  features: Feature[];
  unavailable?: boolean;
  estimatedDays?: string;
}

export interface Addon {
  id: string;
  name: string;
  iconName: string;
  amount: number | null;
  multiplier: number | null;
  description: string;
  delivery: string;
}

// ============================================================
// PROJECT METADATA
// ============================================================

export const PROJECT = {
  name: "ALGIS",
  fullName: "Algerian Agriculture General Information System",
  version: "v0.1.6.4.1",
  date: "December 2024",
  developer: "Sami Bentaiba",
  developerBrand: "Bentaidev",
  supervisor: "Mohamed Dib",
  contact: "samibentaiba25@gmail.com",
  repository: "github.com/samibentaiba/algis",
  license: "Private",
};

// ============================================================
// PRICING CONFIGURATION
// ============================================================

export const PRICING_CONFIG = {
  staticBase: 20000, // Minimum for static pages (Home, About, Privacy Policy)
  baseMin: 20000,
  baseMax: 60000,
  currency: "DA",
  ratePerDay: 2000, // DA per work day
};

// ============================================================
// MODULES - All 12 modules with features
// Target: Sum of all weights = 1.0 → Total = 60,000 DA
// ============================================================

export const MODULES: ModuleData[] = [
  // LOW COMPLEXITY - Simple Auth (4% = 1,600 DA)
  {
    id: "auth",
    name: "Authentication",
    iconName: "Users",
    description: "1,600 DA",
    estimatedDays: "1 Day",
    features: [
      { id: "auth_login", name: "Login/Logout", weight: 0.01, description: "400 DA" },
      { id: "auth_register", name: "Registration", weight: 0.01, description: "400 DA" },
      { id: "auth_reset", name: "Password Reset", weight: 0.01, description: "400 DA" },
      { id: "auth_verify", name: "Email Verification", weight: 0.01, description: "400 DA" },
    ],
  },
  // HIGH COMPLEXITY - UAP is core system (16% = 6,400 DA)
  {
    id: "uap",
    name: "UAP Management",
    iconName: "Package",
    description: "6,400 DA",
    estimatedDays: "4 Days",
    features: [
      { id: "uap_crud", name: "UAP CRUD", weight: 0.04, description: "1,600 DA" },
      { id: "uap_parcels", name: "Parcel Management", weight: 0.03, description: "1,200 DA" },
      { id: "uap_ownership", name: "Ownership Workflow", weight: 0.03, description: "1,200 DA" },
      { id: "uap_map", name: "Map Integration", weight: 0.025, description: "1,000 DA" },
      { id: "uap_modal", name: "Edit Modal (9 tabs)", weight: 0.0175, description: "700 DA" },
      { id: "uap_3d_farm", name: "3D Farm Visualization", weight: 0.0175, description: "700 DA" },
    ],
  },
  // MEDIUM COMPLEXITY - Livestock (9% = 3,600 DA)
  {
    id: "livestock",
    name: "Livestock",
    iconName: "Heart",
    description: "3,600 DA",
    estimatedDays: "2 Days",
    features: [
      { id: "livestock_batches", name: "Livestock Batches", weight: 0.02, description: "800 DA" },
      { id: "livestock_health", name: "Health Management", weight: 0.02, description: "800 DA" },
      { id: "livestock_sales", name: "Animal Sales", weight: 0.0175, description: "700 DA" },
      { id: "livestock_loss", name: "Loss Recording", weight: 0.015, description: "600 DA" },
      { id: "livestock_reports", name: "Monthly Reports", weight: 0.0175, description: "700 DA" },
    ],
  },
  // MEDIUM COMPLEXITY - Vegetal (9% = 3,600 DA)
  {
    id: "vegetal",
    name: "Vegetal Production",
    iconName: "Wheat",
    description: "3,600 DA",
    estimatedDays: "2 Days",
    features: [
      { id: "vegetal_crops", name: "Crop Management", weight: 0.015, description: "600 DA" },
      { id: "vegetal_plowing", name: "Plowing Operations", weight: 0.015, description: "600 DA" },
      { id: "vegetal_seeding", name: "Seeding", weight: 0.015, description: "600 DA" },
      { id: "vegetal_fertilize", name: "Fertilization", weight: 0.015, description: "600 DA" },
      { id: "vegetal_treat", name: "Treatments", weight: 0.015, description: "600 DA" },
      { id: "vegetal_harvest", name: "Harvest", weight: 0.015, description: "600 DA" },
    ],
  },
  // MEDIUM COMPLEXITY - Stock (7.5% = 3,000 DA)
  {
    id: "stock",
    name: "Stock & Equipment",
    iconName: "Tractor",
    description: "3,000 DA",
    estimatedDays: "1.5 Days",
    features: [
      { id: "stock_equipment", name: "Equipment Tracking", weight: 0.02, description: "800 DA" },
      { id: "stock_consumables", name: "Consumables", weight: 0.02, description: "800 DA" },
      { id: "stock_water", name: "Water Resources", weight: 0.0175, description: "700 DA" },
      { id: "stock_alerts", name: "Low Stock Alerts", weight: 0.0175, description: "700 DA" },
    ],
  },
  // LOW COMPLEXITY - Production (4.5% = 1,800 DA)
  {
    id: "production",
    name: "Production Records",
    iconName: "Truck",
    description: "1,800 DA",
    estimatedDays: "1 Day",
    features: [
      { id: "prod_milk", name: "Milk Production", weight: 0.015, description: "600 DA" },
      { id: "prod_eggs", name: "Egg Harvest", weight: 0.015, description: "600 DA" },
      { id: "prod_generic", name: "Generic Records", weight: 0.015, description: "600 DA" },
    ],
  },
  // HIGH COMPLEXITY - Finance (12% = 4,800 DA)
  {
    id: "finance",
    name: "Finance & Payroll",
    iconName: "DollarSign",
    description: "4,800 DA",
    estimatedDays: "2.5 Days",
    features: [
      { id: "fin_income", name: "Income Tracking", weight: 0.02, description: "800 DA" },
      { id: "fin_expense", name: "Expense Tracking", weight: 0.02, description: "800 DA" },
      { id: "fin_analytics", name: "Financial Analytics", weight: 0.03, description: "1,200 DA" },
      { id: "fin_workers", name: "Worker Management", weight: 0.02, description: "800 DA" },
      { id: "fin_payroll", name: "Payroll System", weight: 0.03, description: "1,200 DA" },
    ],
  },
  // HIGH COMPLEXITY - Reporting & Admin (9% = 3,600 DA)
  {
    id: "reporting",
    name: "Reporting & Admin",
    iconName: "BarChart3",
    description: "3,600 DA",
    estimatedDays: "2 Days",
    features: [
      { id: "rep_dashboard", name: "Dashboard", weight: 0.02, description: "800 DA" },
      { id: "rep_widget", name: "Report Widget", weight: 0.0125, description: "500 DA" },
      { id: "rep_admin", name: "Admin Panel", weight: 0.02, description: "800 DA" },
      { id: "rep_export", name: "Data Export", weight: 0.0125, description: "500 DA" },
      { id: "rep_seo_admin", name: "Advanced Website Settings", weight: 0.015, description: "600 DA" },
      { id: "rep_security", name: "Security Controls", weight: 0.01, description: "400 DA" },
    ],
  },
  // STANDARD - UI/UX (5.5% = 2,200 DA) - includes SEO and 3D Map
  {
    id: "ui_ux",
    name: "Full Improved UI/UX",
    iconName: "Sparkles",
    description: "2,200 DA",
    estimatedDays: "1.2 Days",
    features: [
      { id: "ui_accessibility", name: "Full Accessibility", weight: 0.01, description: "400 DA" },
      { id: "ui_redesign", name: "Complete UI Redesign", weight: 0.01, description: "400 DA" },
      { id: "ui_motions", name: "Improved Motions", weight: 0.01, description: "400 DA" },
      { id: "ui_seo", name: "SEO Optimization", weight: 0.01, description: "400 DA" },
      { id: "ui_3dmap", name: "3D Interactive Map", weight: 0.015, description: "600 DA" },
    ],
  },
  // STANDARD - RBAC (4.5% = 1,800 DA)
  {
    id: "rbac",
    name: "RBAC - Role Access Control",
    iconName: "UserCog",
    description: "1,800 DA",
    estimatedDays: "1 Day",
    features: [
      { id: "rbac_normal", name: "Normal User Role", weight: 0.015, description: "600 DA" },
      { id: "rbac_manager", name: "Manager Role", weight: 0.015, description: "600 DA" },
      { id: "rbac_admin", name: "Admin Role", weight: 0.015, description: "600 DA" },
    ],
  },
  // MEDIUM-HIGH COMPLEXITY - Analytics Dashboard Builder (9% = 3,600 DA)
  {
    id: "analytics",
    name: "Analytics Dashboard Builder",
    iconName: "BarChart3",
    description: "3,600 DA",
    estimatedDays: "2 Days",
    features: [
      { id: "analytics_query_builder", name: "Visual Query Builder", weight: 0.025, description: "1,000 DA" },
      { id: "analytics_widgets", name: "14 Widget Types", weight: 0.025, description: "1,000 DA" },
      { id: "analytics_dashboards", name: "Dashboard Management", weight: 0.02, description: "800 DA" },
      { id: "analytics_templates", name: "Preset Templates", weight: 0.02, description: "800 DA" },
    ],
  },
  // HIGH COMPLEXITY - Performance & Security (10% = 4,000 DA)
  {
    id: "perf_sec",
    name: "Performance & Security",
    iconName: "ShieldCheck",
    description: "4,000 DA",
    estimatedDays: "2 Days",
    features: [
      { id: "perf_ratelimit", name: "API Rate Limiting", weight: 0.02, description: "800 DA" },
      { id: "perf_cache", name: "Advanced Caching System", weight: 0.02, description: "800 DA" },
      { id: "perf_db_accel", name: "Database Acceleration", weight: 0.02, description: "800 DA (Up to 1000x faster)" },
      { id: "perf_ddos", name: "DDoS Protection", weight: 0.02, description: "800 DA" },
      { id: "perf_loadbalance", name: "Load Balancing", weight: 0.02, description: "800 DA" },
    ],
  },
];

// ============================================================
// ADDONS
// ============================================================

export const ADDONS: Addon[] = [
  {
    id: "source_code",
    name: "Source Code Ownership",
    iconName: "Code",
    amount: 40000,
    multiplier: null,
    description: "Full GitHub repository access",
    delivery: "3 days",
  },
  {
    id: "enterprise",
    name: "Enterprise Level",
    iconName: "Shield",
    amount: 0,
    multiplier: 7,
    description: "Complete codebase recoding to enterprise standards (×7 total)",
    delivery: "3+ months",
  },
  {
    id: "priority",
    name: "Priority Support",
    iconName: "Headphones",
    amount: 10000,
    multiplier: null,
    description: "24hr response, direct phone support",
    delivery: "24 hours",
  },
];

// ============================================================
// MAINTENANCE
// ============================================================

export const MAINTENANCE = {
  year1: "Included",
  renewal: 3000,
  renewalLabel: "3,000 DA/year",
};

// ============================================================
// TECH STACK
// ============================================================

export const TECH_STACK = {
  core: [
    { name: "Next.js", version: "15.5.9", description: "React framework" },
    { name: "React", version: "19.1.0", description: "UI library" },
    { name: "TypeScript", version: "5.x", description: "Language" },
    { name: "Tailwind CSS", version: "4.x", description: "Styling" },
    { name: "shadcn/ui", version: "Radix-based", description: "UI components" },
  ],
  backend: [
    { name: "Prisma", version: "7.0", description: "ORM" },
    { name: "PostgreSQL", version: "15+", description: "Database" },
    { name: "NextAuth.js", version: "4.x", description: "Authentication" },
  ],
  utilities: [
    { name: "Zod", version: "^4.x", description: "Schema validation" },
    { name: "React Hook Form", version: "^7.x", description: "Form management" },
    { name: "Recharts", version: "^3.x", description: "Charts and analytics" },
    { name: "Leaflet", version: "^1.9.4", description: "Interactive 2D maps" },
    { name: "React Three Fiber", version: "^9.x", description: "3D graphics (Algeria map, Farm visualization)" },
    { name: "Three.js", version: "^0.170", description: "3D rendering engine" },
  ],
};

// ============================================================
// QUALITY METRICS
// ============================================================

export const QUALITY_METRICS = {
  security: {
    passwordHashing: "bcryptjs (12 rounds)",
    authentication: "JWT + Session",
    authorization: "Role-based middleware",
    rateLimit: "Token bucket per-IP",
  },
  performance: {
    bundler: "Turbopack",
    caching: "Global Edge Caching + Prisma Accelerate (1000x speedup)",
    dbOptimization: "Indexed queries, selective loading",
  },
  testing: {
    strategy: "Manual + Type checking",
    typeCheck: "Strict TypeScript",
  },
};

// ============================================================
// DOCS SECTIONS
// ============================================================

export const DOCS_SECTIONS = [
  { title: "Project Overview", path: "/docs/01-overview" },
  { title: "Modules (15 Core)", path: "/docs/02-modules" },
  { title: "Database Schema", path: "/docs/03-database" },
  { title: "API & Services", path: "/docs/04-api-services" },
  { title: "Frontend Guide", path: "/docs/05-frontend" },
  { title: "Deployment", path: "/docs/06-deployment" },
  { title: "Statement of Work", path: "/docs/07-sow" },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all feature IDs
 */
export function getAllFeatureIds(): string[] {
  return MODULES.flatMap((mod) => mod.features.map((f) => f.id));
}

/**
 * Get module by ID
 */
export function getModuleById(id: string): ModuleData | undefined {
  return MODULES.find((mod) => mod.id === id);
}

/**
 * Get all modules for a list of feature IDs
 */
export function getModulesForFeatures(featureIds: string[]): ModuleData[] {
  return MODULES.filter((mod) => mod.features.some((f) => featureIds.includes(f.id)));
}

/**
 * Get total estimated days for all modules
 */
export function getTotalEstimatedDays(): number {
  return MODULES.reduce((sum, mod) => {
    const days = parseFloat(mod.estimatedDays?.replace(" Days", "").replace(" Day", "") || "0");
    return sum + days;
  }, 0);
}

/**
 * Calculate price based on selected features
 */
export function calculatePrice(
  selectedFeatures: string[],
  selectedAddons: string[],
): {
  base: number;
  addonTotal: number;
  multiplier: number;
  total: number;
  rawTotal: number;
  featureCount: number;
  estimatedDays: number;
} {
  const totalWeight = selectedFeatures.reduce((sum, featureId) => {
    for (const mod of MODULES) {
      const feature = mod.features.find((f) => f.id === featureId);
      if (feature) return sum + feature.weight;
    }
    return sum;
  }, 0);

  const base = PRICING_CONFIG.staticBase + Math.round((PRICING_CONFIG.baseMax - PRICING_CONFIG.staticBase) * totalWeight);

  let addonTotal = 0;
  let multiplier = 1;

  selectedAddons.forEach((id) => {
    const addon = ADDONS.find((a) => a.id === id);
    if (addon) {
      if (addon.amount) addonTotal += addon.amount;
      if (addon.multiplier) multiplier *= addon.multiplier;
    }
  });

  const rawTotal = Math.round(base * multiplier + addonTotal);
  const total = rawTotal;
  const estimatedDays = Math.max(1, Math.ceil(rawTotal / PRICING_CONFIG.ratePerDay));

  return {
    base,
    addonTotal,
    multiplier,
    total,
    rawTotal,
    featureCount: selectedFeatures.length,
    estimatedDays,
  };
}
