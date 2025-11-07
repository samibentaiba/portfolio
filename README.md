This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 🧩 `.env.local` (for local development)

Put this file in your Next.js root folder (next to `package.json`):

```env
# Server Configuration
NODE_ENV=development

# External converter server (your local Express server)
CONVERTER_SERVER_URL=http://localhost:3001

# Optional security and limits
API_KEY=local-key
ALLOWED_ORIGINS=http://localhost:3000
ENABLE_CORS=true
MAX_FILE_SIZE_MB=10
LOG_LEVEL=debug
```

---

### 🌐 `.env.production` (for Vercel deployment)

This version is used by your Next.js app when deployed on Vercel.
You can define these in **Vercel → Project Settings → Environment Variables** instead of committing the file.

```env
# Environment
NODE_ENV=production

# Your deployed external server (the one running server.js)
CONVERTER_SERVER_URL=https://your-external-server.com

# Security and CORS
API_KEY=prod-key
ALLOWED_ORIGINS=https://bentaidev.vercel.app
ENABLE_CORS=true
MAX_FILE_SIZE_MB=10
LOG_LEVEL=info
```

---

### ⚠️ Important Notes

1. **Variable naming:**
   Next.js automatically loads `.env`, `.env.local`, `.env.development`, `.env.production`.
   You don’t need to prefix with `NEXT_PUBLIC_` unless the variable is used **in client-side code**.
   Since we only use it in the **API route**, `CONVERTER_SERVER_URL` is correct.

2. **Accessing inside your route:**

   ```ts
   const serverUrl = process.env.CONVERTER_SERVER_URL;
   ```

3. **Testing locally:**

   * Run your Node converter server:

     ```bash
     node server.js
     ```
   * Run Next.js dev server:

     ```bash
     npm run dev
     ```
   * Next.js will forward requests to `http://localhost:3001/convert`.

