import { NextResponse } from 'next/server';
import { SEED_WEBCAMS } from '@/lib/data';
import { fetchAlplakesTemperature } from '@/lib/adapters';

export const dynamic = 'force-dynamic';

const POINTS = [
  { id: 'biel-strandbad',  name: 'Biel – Strandbad',     location: 'Biel/Bienne',        lat: 47.1368, lng: 7.2467 },
  { id: 'nidau',           name: 'Nidau – Seeufer',       location: 'Nidau',              lat: 47.1255, lng: 7.2336 },
  { id: 'vingelz',         name: 'Vingelz – Camping',     location: 'Vingelz',            lat: 47.1200, lng: 7.2100 },
  { id: 'tüscherz',        name: 'Tüscherz – Ufer',       location: 'Tüscherz-Alfermée', lat: 47.1050, lng: 7.1700 },
  { id: 'mitte-see',       name: 'Bielersee – Seemitte',  location: 'Seemitte',           lat: 47.0850, lng: 7.1500 },
  { id: 'la-neuveville',   name: 'La Neuveville – Plage', location: 'La Neuveville',      lat: 47.0670, lng: 7.0980 },
  { id: 'erlach',          name: 'Erlach – Hafen',        location: 'Erlach',             lat: 47.0397, lng: 7.0983 },
  { id: 'ins',             name: 'Ins – Strandbad',       location: 'Ins',                lat: 46.9985, lng: 7.1067 },
];

export async function GET() {
  const results = await Promise.allSettled(
    POINTS.map((p) => fetchAlplakesTemperature(p.lat, p.lng, p.id, p.name, p.location))
  );

  const readings = POINTS.map((p, i) => {
    const r = results[i];
    if (r.status === 'fulfilled' && r.value) return r.value;
    // Fallback: return point with null temperature
    return {
      id: p.id, name: p.name, location: p.location, lat: p.lat, lng: p.lng,
      temperature: null, source: 'alplakes' as const,
      sourceUrl: 'https://www.alplakes.eawag.ch/biel',
      updatedAt: new Date().toISOString(), status: 'cool' as const,
    };
  });

  const now = new Date().toISOString();
  return NextResponse.json(
    { readings, webcams: SEED_WEBCAMS, lastUpdated: now, fetchedAt: now },
    { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300' } }
  );
}
