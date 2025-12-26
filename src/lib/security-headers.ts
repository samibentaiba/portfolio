/**
 * Security Headers Module
 *
 * Provides security headers for DDoS protection, XSS prevention,
 * and other common attack mitigations.
 */

import { NextRequest, NextResponse } from "next/server";

// ============================================================
// SECURITY HEADERS CONFIGURATION
// ============================================================

/**
 * Security headers applied to all responses
 */
export const SECURITY_HEADERS: Record<string, string> = {
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Prevent clickjacking
  "X-Frame-Options": "DENY",

  // Enable XSS filter in older browsers
  "X-XSS-Protection": "1; mode=block",

  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Disable browser features we don't need
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",

  // Prevent DNS prefetching
  "X-DNS-Prefetch-Control": "off",

  // Indicate download for IE
  "X-Download-Options": "noopen",

  // Disable content sniffing for IE
  "X-Permitted-Cross-Domain-Policies": "none",
};

/**
 * Additional headers for API responses
 */
export const API_SECURITY_HEADERS: Record<string, string> = {
  ...SECURITY_HEADERS,
  // Prevent caching of sensitive data
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

// ============================================================
// SUSPICIOUS PATTERNS
// ============================================================

/**
 * Common attack patterns to detect in requests
 */
const SUSPICIOUS_PATTERNS: RegExp[] = [
  // SQL Injection patterns
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,

  // XSS patterns
  /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
  /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,

  // Path traversal
  /\.\.\//g,
  /\.\.%2f/gi,

  // Common exploit attempts
  /union.+select/i,
  /exec.+xp_/i,
  /insert.+into/i,
  /delete.+from/i,
  /drop.+table/i,
];

/**
 * Known malicious user agents
 */
const MALICIOUS_USER_AGENTS: string[] = [
  "sqlmap",
  "nikto",
  "nmap",
  "masscan",
  "nessus",
  "openvas",
  "dirbuster",
  "gobuster",
  "wfuzz",
  "hydra",
  "metasploit",
];

// ============================================================
// SECURITY FUNCTIONS
// ============================================================

/**
 * Check if a request contains suspicious patterns
 */
export function detectSuspiciousRequest(request: NextRequest): {
  suspicious: boolean;
  reason?: string;
} {
  const url = request.nextUrl.toString();
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";

  // Check URL for attack patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      return { suspicious: true, reason: "Suspicious URL pattern detected" };
    }
  }

  // Check for known malicious user agents
  for (const agent of MALICIOUS_USER_AGENTS) {
    if (userAgent.includes(agent.toLowerCase())) {
      return { suspicious: true, reason: "Known malicious user agent" };
    }
  }

  // Check for missing or empty user agent (often bots)
  if (!userAgent || userAgent.length < 10) {
    // Don't block, but flag for monitoring
    // This is common for internal health checks
  }

  // Check for unusually large headers (header bomb)
  let totalHeaderSize = 0;
  request.headers.forEach((value, key) => {
    totalHeaderSize += key.length + value.length;
  });

  if (totalHeaderSize > 16384) {
    // 16KB header limit
    return { suspicious: true, reason: "Excessive header size" };
  }

  return { suspicious: false };
}

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(
  response: NextResponse,
  isApi: boolean = false
): NextResponse {
  const headers = isApi ? API_SECURITY_HEADERS : SECURITY_HEADERS;

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Create a blocked response for suspicious requests
 */
export function createBlockedResponse(_reason?: string): NextResponse {
  void _reason; // Reserved for logging or custom error messages
  return new NextResponse(
    JSON.stringify({
      error: "Request blocked",
      message: "Your request has been blocked for security reasons.",
    }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        ...SECURITY_HEADERS,
      },
    }
  );
}

/**
 * Validate request body size
 */
export async function validateBodySize(
  request: NextRequest,
  maxSizeBytes: number = 1024 * 1024 // 1MB default
): Promise<{ valid: boolean; error?: string }> {
  const contentLength = request.headers.get("content-length");

  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > maxSizeBytes) {
      return { valid: false, error: "Request body too large" };
    }
  }

  return { valid: true };
}

/**
 * Sanitize string input (basic)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Generate CSP header value
 */
export function generateCSP(
  options: {
    nonce?: string;
    reportUri?: string;
  } = {}
): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self'${
      options.nonce ? ` 'nonce-${options.nonce}'` : ""
    } 'unsafe-inline' 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  if (options.reportUri) {
    directives.push(`report-uri ${options.reportUri}`);
  }

  return directives.join("; ");
}

// ============================================================
// MIDDLEWARE HELPER
// ============================================================

/**
 * Security middleware for Next.js
 * Use in middleware.ts to apply security checks and headers
 */
export function securityMiddleware(request: NextRequest): {
  blocked: boolean;
  response?: NextResponse;
} {
  // Check for suspicious patterns
  const suspiciousCheck = detectSuspiciousRequest(request);

  if (suspiciousCheck.suspicious) {
    console.warn(
      `Blocked suspicious request: ${suspiciousCheck.reason}`,
      `IP: ${request.headers.get("x-forwarded-for") || "unknown"}`,
      `URL: ${request.nextUrl.pathname}`
    );

    return {
      blocked: true,
      response: createBlockedResponse(
        suspiciousCheck.reason || "Suspicious request"
      ),
    };
  }

  return { blocked: false };
}
