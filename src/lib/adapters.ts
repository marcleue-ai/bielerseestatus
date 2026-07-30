import type { TemperatureReading, WindData, AirData } from './types';

const BFT_LABELS = ['Windstille','Leiser Zug','Leichte Brise','Schwache Brise','Mässige Brise','Frische Brise','Starker Wind','Steifer Wind','Stürmischer Wind','Sturm','Schwerer Sturm','Orkanartiger Sturm','Orkan'];

function toBeaufort(kmh: number): number {
  if (kmh < 1) return 0;
  if (kmh < 6) return 1;
  if (kmh < 12) return 2;
  if (kmh < 20) return 3;
  if (kmh < 29) return 4;
  if (kmh < 39) return 5;
  if (kmh < 50) return 6;
  if (kmh < 62) return 7;
  if (kmh < 75) return 8;
  if (kmh < 89) return 9;
  if (kmh < 103) return 10;
  if (kmh < 118) return 11;
  return 12;
}

function toDirLabel(deg: number): string {
  const dirs = ['N','NO','O','SO','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function tempStatus(t: number): 'cool' | 'pleasant' | 'warm' {
  if (t >= 22) return 'warm';
  if (t >= 18) return 'pleasant';
  return 'cool';
}

// Format: YYYYMMDDHHmm (12 digits) required by Alplakes API
function alplakesTime(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2, '0') +
    String(d.getUTCDate()).padStart(2, '0') +
    String(d.getUTCHours()).padStart(2, '0') +
    String(d.getUTCMinutes()).padStart(2, '0')
  );
}

export async function fetchWindData(): Promise<WindData | null> {
  try {
    const url = 'https://api.existenz.ch/apiv1/smn/latest?parameters=ff,fx,dd&locations=BIE&app=bielersee-status';
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;

    const json = await res.json();
    const payload: { loc: string; par: string; val: number }[] = json?.payload ?? [];
    const get = (par: string) => payload.find((p) => p.par === par)?.val ?? null;

    const ff = get('ff');
    if (ff === null) return null;

    const fx = get('fx');
    const dd = get('dd');
    const speedKmh = Math.round(ff * 10) / 10;
    const bft = toBeaufort(speedKmh);

    return {
      speedKmh,
      gustsKmh: fx !== null ? Math.round(fx * 10) / 10 : null,
      directionDeg: dd,
      directionLabel: dd !== null ? toDirLabel(dd) : null,
      beaufort: bft,
      beaufortLabel: BFT_LABELS[bft],
      station: 'Biel/Bienne',
      stationCode: 'BIE',
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

type GeoFeature = { id: string; properties: { value: number | null } };

function extractStation(features: GeoFeature[], stationCode: string): number | null {
  const f = features.find((f) => f.id === stationCode);
  const v = f?.properties?.value;
  return v != null ? Math.round(v * 10) / 10 : null;
}

export async function fetchAirData(): Promise<AirData | null> {
  try {
    const BASE = 'https://data.geo.admin.ch/ch.meteoschweiz.messwerte-lufttemperatur';
    const [resCurrent, resMin, resMax] = await Promise.all([
      fetch(`${BASE}-10min/ch.meteoschweiz.messwerte-lufttemperatur-10min_en.json`, { next: { revalidate: 600 } }),
      fetch(`${BASE}-24h-min-1h/ch.meteoschweiz.messwerte-lufttemperatur-24h-min-1h_en.json`, { next: { revalidate: 3600 } }),
      fetch(`${BASE}-24h-max-1h/ch.meteoschweiz.messwerte-lufttemperatur-24h-max-1h_en.json`, { next: { revalidate: 3600 } }),
    ]);

    if (!resCurrent.ok) return null;
    const [jsonCurrent, jsonMin, jsonMax] = await Promise.all([
      resCurrent.json(),
      resMin.ok ? resMin.json() : null,
      resMax.ok ? resMax.json() : null,
    ]);

    const currentTemp = extractStation(jsonCurrent?.features ?? [], 'CRM');
    if (currentTemp === null) return null;

    return {
      currentTemp,
      minToday: jsonMin ? (extractStation(jsonMin.features ?? [], 'CRM') ?? null) : null,
      maxToday: jsonMax ? (extractStation(jsonMax.features ?? [], 'CRM') ?? null) : null,
      station: 'Cressier',
      stationCode: 'CRM',
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function fetchAareTemperature(): Promise<TemperatureReading | null> {
  try {
    const now = new Date();
    // Swiss local date (UTC+1/+2) for the startDate parameter
    const chOffset = 2 * 60 * 60 * 1000; // use CEST offset; close enough for day boundary
    const today = new Date(now.getTime() + chOffset).toISOString().slice(0, 10);
    const url = `https://api.existenz.ch/apiv1/hydro/daterange?parameters=temperature&locations=2029&startDate=${today}&endDate=${today}&app=bielersee-status`;

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;

    const json = await res.json();
    const vals: number[] = (json?.payload ?? [])
      .filter((p: { par: string; val: number }) => p.par === 'temperature')
      .map((p: { par: string; val: number }) => p.val);

    if (!vals.length) return null;

    const temperature = Math.round(vals[vals.length - 1] * 10) / 10;
    const tempMin24h = Math.round(Math.min(...vals) * 10) / 10;
    const tempMax24h = Math.round(Math.max(...vals) * 10) / 10;

    return {
      id: 'aare-bruegg',
      name: 'Aare – Brügg',
      location: 'Aegerten',
      lat: 47.1221,
      lng: 7.2834,
      temperature,
      source: 'bafu',
      sourceUrl: 'https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/2029',
      updatedAt: now.toISOString(),
      status: tempStatus(temperature),
      quality: 'high',
      tempMin24h,
      tempMax24h,
    };
  } catch {
    return null;
  }
}

export async function fetchLyssTemperature(): Promise<TemperatureReading | null> {
  try {
    const res = await fetch('https://www.wiewarm.ch/api/v1/bad/Parkschwimmbad_Lyss', {
      next: { revalidate: 3600 }, // wiewarm aktualisiert selten — 1h Cache
    });
    if (!res.ok) return null;

    const json = await res.json();
    const becken = json?.becken?.Schwimmbecken;
    if (!becken || becken.temp == null) return null;

    const temperature = Math.round(Number(becken.temp) * 10) / 10;

    // Timestamp aus wiewarm: "2026-06-30 10:10:14.513192"
    const rawTs: string = becken.date ?? '';
    let updatedAt = new Date().toISOString();
    if (rawTs) {
      const parsed = new Date(rawTs.replace(' ', 'T').split('.')[0]);
      if (!isNaN(parsed.getTime())) updatedAt = parsed.toISOString();
    }

    return {
      id: 'lyss-parkschwimmbad',
      name: 'Lyss – Parkschwimmbad',
      location: 'Lyss',
      lat: 47.0726,
      lng: 7.3072,
      temperature,
      source: 'wiewarm',
      sourceUrl: 'https://www.wiewarm.ch/bad/Parkschwimmbad_Lyss',
      updatedAt,
      status: tempStatus(temperature),
      quality: 'high',
    };
  } catch {
    return null;
  }
}

export async function fetchAareBernTemperature(): Promise<TemperatureReading | null> {
  try {
    const now = new Date();
    const chOffset = 2 * 60 * 60 * 1000;
    const today = new Date(now.getTime() + chOffset).toISOString().slice(0, 10);
    const url = `https://api.existenz.ch/apiv1/hydro/daterange?parameters=temperature&locations=2135&startDate=${today}&endDate=${today}&app=bielersee-status`;

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;

    const json = await res.json();
    const vals: number[] = (json?.payload ?? [])
      .filter((p: { par: string; val: number }) => p.par === 'temperature')
      .map((p: { par: string; val: number }) => p.val);

    if (!vals.length) return null;

    const temperature = Math.round(vals[vals.length - 1] * 10) / 10;
    const tempMin24h = Math.round(Math.min(...vals) * 10) / 10;
    const tempMax24h = Math.round(Math.max(...vals) * 10) / 10;

    return {
      id: 'aare-bern',
      name: 'Aare – Bern',
      location: 'Bern',
      lat: 46.9480,
      lng: 7.4474,
      temperature,
      source: 'bafu',
      sourceUrl: 'https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/2135',
      updatedAt: now.toISOString(),
      status: tempStatus(temperature),
      quality: 'high',
      tempMin24h,
      tempMax24h,
    };
  } catch {
    return null;
  }
}

export async function fetchHagneckTemperature(): Promise<TemperatureReading | null> {
  try {
    const now = new Date();
    const chOffset = 2 * 60 * 60 * 1000;
    const today = new Date(now.getTime() + chOffset).toISOString().slice(0, 10);
    const url = `https://api.existenz.ch/apiv1/hydro/daterange?parameters=temperature&locations=2085&startDate=${today}&endDate=${today}&app=bielersee-status`;

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;

    const json = await res.json();
    const vals: number[] = (json?.payload ?? [])
      .filter((p: { par: string; val: number }) => p.par === 'temperature')
      .map((p: { par: string; val: number }) => p.val);

    if (!vals.length) return null;

    const temperature = Math.round(vals[vals.length - 1] * 10) / 10;
    const tempMin24h = Math.round(Math.min(...vals) * 10) / 10;
    const tempMax24h = Math.round(Math.max(...vals) * 10) / 10;

    return {
      id: 'aare-hagneck',
      name: 'Aare – Hagneck',
      location: 'Hagneck',
      lat: 47.0572,
      lng: 7.1889,
      temperature,
      source: 'bafu',
      sourceUrl: 'https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/2085',
      updatedAt: now.toISOString(),
      status: tempStatus(temperature),
      quality: 'high',
      tempMin24h,
      tempMax24h,
    };
  } catch {
    return null;
  }
}

export async function fetchAlplakesTemperature(
  lat: number,
  lng: number,
  id: string,
  name: string,
  location: string,
): Promise<TemperatureReading | null> {
  try {
    const now = new Date();
    const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const url = [
      'https://alplakes-api.eawag.ch/simulations/point/delft3d-flow/biel',
      alplakesTime(past),
      alplakesTime(now),
      '0.5',
      lat,
      lng,
    ].join('/');

    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;

    const json = await res.json();
    const temps: number[] = json?.variables?.temperature?.data ?? [];
    if (!temps.length) return null;

    const temperature = Math.round(temps[temps.length - 1] * 10) / 10;
    const tempMin24h = Math.round(Math.min(...temps) * 10) / 10;
    const tempMax24h = Math.round(Math.max(...temps) * 10) / 10;
    return {
      id, name, location, lat, lng,
      temperature,
      source: 'alplakes',
      sourceUrl: 'https://www.alplakes.eawag.ch/biel',
      updatedAt: new Date().toISOString(),
      status: tempStatus(temperature),
      quality: 'high',
      tempMin24h,
      tempMax24h,
    };
  } catch {
    return null;
  }
}
