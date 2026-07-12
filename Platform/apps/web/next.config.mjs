import { config as loadDotenv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Next.js only auto-loads .env files from its own directory (apps/web/), but
// the shared .env lives at the Platform/ monorepo root (see
// docs/architecture/secrets-config-management.md) — load it explicitly so
// server-side code here (route handlers, Server Components) sees it too.
const __dirname = dirname(fileURLToPath(import.meta.url));
loadDotenv({ path: join(__dirname, '../../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@aifa/types', '@aifa/config', '@aifa/logger'],
};

export default nextConfig;
