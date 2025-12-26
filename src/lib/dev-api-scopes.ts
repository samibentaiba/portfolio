/**
 * Dev API Scopes - Client-safe constants
 *
 * Separated from dev-api.ts to avoid importing Prisma in client components.
 */

// Available scopes for the dev API
export const DEV_API_SCOPES = {
  // Read operations (all data)
  "read:*": "Read all data",
  "read:uap": "Read UAP records",
  "read:finance": "Read finance records",
  "read:production": "Read production data",
  "read:livestock": "Read livestock data",
  "read:stock": "Read equipment/consumables",
  "read:users": "Read user data (limited)",

  // Write operations
  "write:*": "Write all data",
  "write:uap": "Create/update UAP records",
  "write:finance": "Create/update finance records",
  "write:production": "Create/update production data",
  "write:livestock": "Create/update livestock data",
  "write:stock": "Create/update equipment/consumables",

  // Delete operations
  "delete:*": "Delete all data",
  "delete:uap": "Delete UAP records",
  "delete:finance": "Delete finance records",
  "delete:production": "Delete production data",
  "delete:livestock": "Delete livestock data",
  "delete:stock": "Delete equipment/consumables",

  // Admin operations
  "admin:*": "Full admin access",
  "admin:cache": "Manage server cache",
  "admin:health": "View system health",
  "admin:realtime": "Subscribe to realtime updates",
  "admin:users": "Manage users",
  "admin:settings": "Manage website settings",
} as const;

export type DevApiScope = keyof typeof DEV_API_SCOPES;
