import { getSeedData, SEED_WEBCAMS } from '@/lib/data';
import { fetchAlplakesTemperature, fetchWindData, fetchAirData, fetchAareTemperature, fetchHagneckTemperature, fetchLyssTemperature, fetchAareBernTemperature } from '@/lib/adapters';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TemperatureOverview from '@/components/TemperatureOverview';
import WebcamGrid from '@/components/WebcamGrid';
import LakeMapWrapper from '@/components/LakeMapWrapper';
import Footer from '@/components/Footer';

import type { WebcamEntry } from '@/lib/types';

export const revalidate = 1800;

async function fetchLastModified(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    return res.headers.get('last-modified');
  } catch { return null; }
}

async function enrichWebcamsWithTimestamps(webcams: WebcamEntry[]): Promise<WebcamEntry[]> {
  const timestamps = await Promise.all(
    webcams.map((c) => c.previewImageUrl ? fetchLastModified(c.previewImageUrl) : Promise.resolve(null))
  );
  const now = Date.now();
  return webcams.map((c, i) => {
    const lm = timestamps[i];
    // Cache-bust immer setzen: mit last-modified wenn vorhanden, sonst mit jetzt
    const bust = lm ? new Date(lm).getTime() : now;
    return {
      ...c,
      imageUpdatedAt: lm ? new Date(lm).toISOString() : undefined,
      previewImageUrl: c.previewImageUrl ? `${c.previewImageUrl}?t=${bust}` : c.previewImageUrl,
    };
  });
} // ISR: Seite alle 30 Min. neu generieren

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

export default async function HomePage() {
  const [results, wind, air, aare, hagneck, lyss, aareBern] = await Promise.all([
    Promise.allSettled(
      POINTS.map((p) => fetchAlplakesTemperature(p.lat, p.lng, p.id, p.name, p.location))
    ),
    fetchWindData(),
    fetchAirData(),
    fetchAareTemperature(),
    fetchHagneckTemperature(),
    fetchLyssTemperature(),
    fetchAareBernTemperature(),
  ]);

  const liveReadings = POINTS.map((p, i) => {
    const r = results[i];
    if (r.status === 'fulfilled' && r.value) return r.value;
    return null;
  });

  const anyLive = liveReadings.some(Boolean);
  const data = anyLive
    ? {
        readings: [
          ...POINTS.map((p, i) => liveReadings[i] ?? {
            id: p.id, name: p.name, location: p.location, lat: p.lat, lng: p.lng,
            temperature: null, source: 'alplakes' as const,
            sourceUrl: 'https://www.alplakes.eawag.ch/biel',
            updatedAt: new Date().toISOString(), status: 'cool' as const,
          }),
          ...(aare ? [aare] : []),
          ...(hagneck ? [hagneck] : []),
          ...(lyss ? [lyss] : []),
          ...(aareBern ? [aareBern] : []),
        ],
        webcams: await enrichWebcamsWithTimestamps(SEED_WEBCAMS),
        lastUpdated: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
      }
    : { ...getSeedData(), webcams: await enrichWebcamsWithTimestamps(getSeedData().webcams) };

  return (
    <>
      <Header />
      <main>
        <HeroSection readings={data.readings} lastUpdated={data.lastUpdated} wind={wind} air={air} />
        <TemperatureOverview readings={data.readings} />
        <WebcamGrid webcams={data.webcams} />
        <LakeMapWrapper readings={data.readings} webcams={data.webcams} />
      </main>
      <Footer />
    </>
  );
}
