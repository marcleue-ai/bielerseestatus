import type { TemperatureReading, WebcamEntry, DashboardData } from './types';

// ---------------------------------------------------------------------------
// FALLBACK / SEED DATA
// Replace with live adapter calls once API access is confirmed.
// Sources: badi-info.ch, alplakes.eawag.ch, bielersee.live
// ---------------------------------------------------------------------------

function tempStatus(t: number): 'cool' | 'pleasant' | 'warm' {
  if (t >= 22) return 'warm';
  if (t >= 18) return 'pleasant';
  return 'cool';
}

const SEED_READINGS: Omit<TemperatureReading, 'status'>[] = [
  {
    id: 'biel-strandbad',
    name: 'Biel – Strandbad',
    location: 'Biel/Bienne',
    lat: 47.1368,
    lng: 7.2467,
    temperature: 22.4,
    source: 'badi-info',
    sourceUrl: 'https://www.badi-info.ch/_temp/bielersee-temperatur.htm',
    updatedAt: new Date().toISOString(),
    quality: 'high',
  },
  {
    id: 'nidau',
    name: 'Nidau – Seeufer',
    location: 'Nidau',
    lat: 47.1255,
    lng: 7.2336,
    temperature: 21.8,
    source: 'alplakes',
    sourceUrl: 'https://www.alplakes.eawag.ch/biel',
    updatedAt: new Date().toISOString(),
    quality: 'high',
  },
  {
    id: 'erlach',
    name: 'Erlach – Hafen',
    location: 'Erlach',
    lat: 47.0397,
    lng: 7.0983,
    temperature: 20.1,
    source: 'bielersee-live',
    sourceUrl: 'https://bielersee.live',
    updatedAt: new Date().toISOString(),
    quality: 'medium',
  },
  {
    id: 'ins',
    name: 'Ins – Strandbad',
    location: 'Ins',
    lat: 46.9985,
    lng: 7.1067,
    temperature: 19.5,
    source: 'badi-info',
    sourceUrl: 'https://www.badi-info.ch/_temp/bielersee-temperatur.htm',
    updatedAt: new Date().toISOString(),
    quality: 'high',
  },
  {
    id: 'tüscherz',
    name: 'Tüscherz – Ufer',
    location: 'Tüscherz-Alfermée',
    lat: 47.1050,
    lng: 7.1700,
    temperature: 21.2,
    source: 'alplakes',
    sourceUrl: 'https://www.alplakes.eawag.ch/biel',
    updatedAt: new Date().toISOString(),
    quality: 'medium',
  },
  {
    id: 'la-neuveville',
    name: 'La Neuveville – Plage',
    location: 'La Neuveville',
    lat: 47.0670,
    lng: 7.0980,
    temperature: 20.7,
    source: 'bielersee-live',
    sourceUrl: 'https://bielersee.live',
    updatedAt: new Date().toISOString(),
    quality: 'high',
  },
  {
    id: 'vingelz',
    name: 'Vingelz – Camping',
    location: 'Vingelz',
    lat: 47.1200,
    lng: 7.2100,
    temperature: 22.1,
    source: 'badi-info',
    sourceUrl: 'https://www.badi-info.ch/_temp/bielersee-temperatur.htm',
    updatedAt: new Date().toISOString(),
    quality: 'high',
  },
  {
    id: 'mitte-see',
    name: 'Bielersee – Seemitte',
    location: 'Seemitte',
    lat: 47.0850,
    lng: 7.1500,
    temperature: 19.8,
    source: 'alplakes',
    sourceUrl: 'https://www.alplakes.eawag.ch/biel',
    updatedAt: new Date().toISOString(),
    quality: 'medium',
  },
];

export const SEED_WEBCAMS: WebcamEntry[] = [
  {
    id: 'magglingen-bielersee',
    name: 'Magglingen – Bielersee',
    location: 'Magglingen/Macolin',
    lat: 47.1350,
    lng: 7.2350,
    provider: 'windy.com',
    sourceUrl: 'https://www.meteoblue.com/de/wetter/webcams/magglingen_schweiz_2659791',
    previewImageUrl: 'https://imgproxy.windy.com/_/normal/plain/current/1349962206/original.jpg',
    requiresExternalOpen: false,
    description: 'Blick von Magglingen auf den Bielersee.',
  },
  {
    id: 'neuenstadt-lake-biel',
    name: 'Neuenstadt – Lake Biel',
    location: 'La Neuveville',
    lat: 47.0670,
    lng: 7.0980,
    provider: 'windy.com',
    sourceUrl: 'https://www.meteoblue.com/de/wetter/webcams/la-neuveville_schweiz_2660038',
    previewImageUrl: 'https://imgproxy.windy.com/_/normal/plain/current/1121084333/original.jpg',
    requiresExternalOpen: false,
    description: 'Blick auf den Bielersee bei La Neuveville.',
  },
  {
    id: 'bielersee-suedosten',
    name: 'Bielersee – Südosten',
    location: 'Bielersee (BE)',
    lat: 47.0600,
    lng: 7.1200,
    provider: 'windy.com',
    sourceUrl: 'https://www.meteoblue.com/de/wetter/webcams/la-neuveville_schweiz_2660038',
    previewImageUrl: 'https://imgproxy.windy.com/_/normal/plain/current/1793905010/original.jpg',
    requiresExternalOpen: false,
    description: 'Panorama über den südöstlichen Bielersee.',
  },
  {
    id: 'ligerz-petersinsel',
    name: 'Ligerz – Petersinsel',
    location: 'Ligerz',
    lat: 47.0830,
    lng: 7.1330,
    provider: 'windy.com',
    sourceUrl: 'https://www.meteoblue.com/de/wetter/webcams/la-neuveville_schweiz_2660038',
    previewImageUrl: 'https://imgproxy.windy.com/_/normal/plain/current/1292513685/original.jpg',
    requiresExternalOpen: false,
    description: 'Blick auf den Bielersee mit der Petersinsel.',
  },
  {
    id: 'preles-vinifuni',
    name: 'Plateau de Diesse – Vinifuni Prêles',
    location: 'Plateau de Diesse',
    lat: 47.0950,
    lng: 7.1150,
    provider: 'windy.com',
    sourceUrl: 'https://www.meteoblue.com/de/wetter/webcams/magglingen_schweiz_2659791',
    previewImageUrl: 'https://imgproxy.windy.com/_/normal/plain/current/1292519154/original.jpg',
    requiresExternalOpen: false,
    description: 'Bergstation Vinifuni auf dem Plateau de Diesse mit Blick auf den Bielersee.',
  },
  {
    id: 'ipsach-nidauwald',
    name: 'Ipsach – Nidauwald',
    location: 'Ipsach',
    lat: 47.1200,
    lng: 7.2150,
    provider: 'windy.com',
    sourceUrl: 'https://www.meteoblue.com/de/wetter/webcams/magglingen_schweiz_2659791',
    previewImageUrl: 'https://imgproxy.windy.com/_/normal/plain/current/1423817599/original.jpg',
    requiresExternalOpen: false,
    description: 'Blick Richtung Norden auf Nidauwald und Magglingen.',
  },
];

export function getSeedData(): DashboardData {
  const readings: TemperatureReading[] = SEED_READINGS.map((r) => ({
    ...r,
    status: r.temperature !== null ? tempStatus(r.temperature) : 'cool',
  }));

  return {
    readings,
    webcams: SEED_WEBCAMS,
    lastUpdated: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  };
}
