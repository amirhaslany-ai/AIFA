import { NextResponse } from 'next/server';

/**
 * Proxies apps/api's readiness check so the web deploy's own uptime monitor
 * has a single URL to poll, without duplicating health logic client-side.
 */
export async function GET() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

  try {
    const response = await fetch(`${apiBaseUrl}/v1/health/ready`, { cache: 'no-store' });
    const body = await response.json();
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: { code: 'API_UNREACHABLE', message: 'Could not reach apps/api.' } },
      { status: 503 },
    );
  }
}
