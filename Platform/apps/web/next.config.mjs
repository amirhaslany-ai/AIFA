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
  // Only @aifa/types is actually imported anywhere in apps/web/src — @aifa/config
  // and @aifa/logger were declared dependencies with no real usage (this file's own
  // dotenv loading reads process.env directly, per Next.js convention, rather than
  // going through @aifa/config); removed alongside their package.json entries.
  transpilePackages: ['@aifa/types'],
};

export default nextConfig;
