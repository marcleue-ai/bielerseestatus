import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['imgproxy.windy.com'];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'missing url' }, { status: 400 });

  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return NextResponse.json({ error: 'host not allowed' }, { status: 403 });
    }

    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    const lastModified = res.headers.get('last-modified');
    if (!lastModified) return NextResponse.json({ error: 'no timestamp' }, { status: 404 });

    return NextResponse.json(
      { lastModified },
      { headers: { 'Cache-Control': 'public, max-age=120, stale-while-revalidate=60' } }
    );
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 });
  }
}
