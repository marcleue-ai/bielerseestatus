export interface TemperatureReading {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  temperature: number | null;
  source: DataSource;
  sourceUrl: string;
  updatedAt: string;
  status: 'cool' | 'pleasant' | 'warm';
  quality?: 'high' | 'medium' | 'estimated';
  tempMin24h?: number | null;
  tempMax24h?: number | null;
}

export interface WebcamEntry {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  provider: string;
  sourceUrl: string;
  previewImageUrl?: string;
  embedUrl?: string;
  requiresExternalOpen: boolean;
  description?: string;
  imageUpdatedAt?: string; // ISO — server-seitig aus Last-Modified Header
}

export type DataSource = 'badi-info' | 'alplakes' | 'bielersee-live' | 'manual' | 'bafu' | 'wiewarm';

export interface WindData {
  speedKmh: number;
  gustsKmh: number | null;
  directionDeg: number | null;
  directionLabel: string | null;
  beaufort: number;
  beaufortLabel: string;
  station: string;
  stationCode: string;
  updatedAt: string;
}

export interface AirData {
  currentTemp: number;
  minToday: number | null;
  maxToday: number | null;
  station: string;
  stationCode: string;
  updatedAt: string;
}

export interface DashboardData {
  readings: TemperatureReading[];
  webcams: WebcamEntry[];
  lastUpdated: string;
  fetchedAt: string;
}
