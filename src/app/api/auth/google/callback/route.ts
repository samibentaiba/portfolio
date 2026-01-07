import { NextRequest } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "https://bentaidev.vercel.app/api/auth/google/callback";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle error from Google
  if (error) {
    return new Response(generateHTML({ error: error }), {
      headers: { "Content-Type": "text/html" },
    });
  }

  // No code provided
  if (!code) {
    return new Response(
      generateHTML({ error: "No authorization code provided" }),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return new Response(
        generateHTML({ error: tokens.error_description || tokens.error }),
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Return HTML that sends tokens to opener and closes
    return new Response(generateHTML({ tokens }), {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
    return new Response(
      generateHTML({ error: "Failed to exchange authorization code" }),
      { headers: { "Content-Type": "text/html" } }
    );
  }
}

function generateHTML(data: { tokens?: unknown; error?: string }) {
  const message = JSON.stringify(data);

  return `<!DOCTYPE html>
<html>
<head>
  <title>Authorization Complete</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }
    .success { color: #4ade80; }
    .error { color: #f87171; }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: #4ade80;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    ${
      data.error
        ? `<p class="error">❌ ${data.error}</p><p>You can close this window.</p>`
        : `<div class="spinner"></div><p class="success">✓ Authorization successful!</p><p>Sending to extension...</p>`
    }
  </div>
  <script>
    (function() {
      const data = ${message};
      
      // Try postMessage to opener (for popup flow)
      if (window.opener) {
        window.opener.postMessage(data, '*');
        setTimeout(() => window.close(), 1000);
      } 
      // Try sending to extension via chrome.runtime (for tabs flow)
      else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        // Get extension ID from URL if passed
        const urlParams = new URLSearchParams(window.location.search);
        const extensionId = urlParams.get('state');
        if (extensionId) {
          chrome.runtime.sendMessage(extensionId, data);
        }
        setTimeout(() => window.close(), 1000);
      }
      // Fallback: just show the result
      else {
        document.querySelector('.container').innerHTML += 
          '<p style="font-size: 12px; opacity: 0.7; margin-top: 1rem;">You can close this window and return to the extension.</p>';
      }
    })();
  </script>
</body>
</html>`;
}
