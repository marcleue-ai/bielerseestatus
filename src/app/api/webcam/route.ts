import { NextRequest, NextResponse } from 'next/server';

// Bekannte Cam-Slugs von bielersee.live – verhindert Open-Proxy-Missbrauch
const ALLOWED_CAMS = new Set([
  'hafenbiel',
  'bielerbucht',
  'aarekanal',
  'wingreisreben',
  'wingreishafen',
  'laneuveville',
  'erlach',
]);

export async function GET(req: NextRequest) {
  const cam = req.nextUrl.searchParams.get('cam');

  if (!cam || !ALLOWED_CAMS.has(cam)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const upstream = await fetch(
      `https://bielersee.live/latestuploads/cams/${cam}.jpg`,
      {
        headers: {
          Referer: 'https://bielersee.live/',
          'User-Agent': 'Mozilla/5.0',
        },
        // Kein Next.js-Cache — Bild soll frisch sein
        cache: 'no-store',
      },
    );

    if (!upstream.ok) {
      return new NextResponse('Upstream error', { status: 502 });
    }

    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        // Browser darf 5 Minuten cachen, danach revalidieren
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      },
    });
  } catch {
    return new NextResponse('Fetch failed', { status: 502 });
  }
}
