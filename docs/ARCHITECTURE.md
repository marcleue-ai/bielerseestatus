# Architektur – Bielersee Status

## System-Übersicht

```
┌──────────────────────────────────────────────────────────────┐
│                     User Browser (Client)                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ React Component Tree                                   │  │
│  │ • Header (Nav + BETA Badge)                            │  │
│  │ • HeroSection (Wind + Air Data)                        │  │
│  │ • TemperatureOverview (Grid)                           │  │
│  │ • WebcamGrid (6 Cameras)                               │  │
│  │ • LakeMap (Leaflet)                                    │  │
│  │ • Footer (Sources + Disclaimer)                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                            ↑                                  │
│                     Hydrated from:                            │
│                  Server-rendered HTML +                       │
│                   Embedded JSON (props)                       │
└──────────────────────────────────────────────────────────────┘
         ↑
         │ [ISR: 30 min]
         │
┌─────────────────────────────────────────────────────────────────┐
│             Next.js Server (Page.tsx)                           │
│                                                                 │
│  async HomePage() {                                             │
│    1. Fetch all data in parallel (Promise.allSettled)          │
│    2. Enrich webcams with timestamps (Last-Modified)          │
│    3. Return DashboardData + React JSX                         │
│    4. Next.js ISR: Cache für 30 min                            │
│  }                                                              │
│                                                                 │
│  [Server Components – keine Client.js nötig für Daten-Fetch]  │
└─────────────────────────────────────────────────────────────────┘
         ↑↑↑ [Parallel Fetches via Promise.all]
         │
    ┌────┴────────────────────────────────────────────────────┐
    │                   Data Sources                          │
    ├─────────────────────────────────────────────────────────┤
    │                                                          │
    │  fetchAlplakesTemperature()  →  Eawag Alplakes API    │
    │  ├─ POST https://alplakes-api.eawag.ch/simulations    │
    │  ├─ 8 See-Messungen (Biel bis Ins)                    │
    │  └─ Cache: 600s (ISR revalidate)                       │
    │                                                          │
    │  fetchAareTemperature()      →  BAFU (Brügg)          │
    │  ├─ GET api.existenz.ch/hydro (Station 2029)          │
    │  ├─ Aare-Temperatur                                    │
    │  └─ Cache: 600s                                         │
    │                                                          │
    │  fetchHagneckTemperature()   →  BAFU (Hagneck)        │
    │  ├─ GET api.existenz.ch/hydro (Station 2085)          │
    │  ├─ Aare-Temperatur                                    │
    │  └─ Cache: 600s                                         │
    │                                                          │
    │  fetchAareBernTemperature()  →  BAFU (Bern)           │
    │  ├─ GET api.existenz.ch/hydro (Station 2135)          │
    │  ├─ Aare-Temperatur                                    │
    │  └─ Cache: 600s                                         │
    │                                                          │
    │  fetchLyssTemperature()      →  wiewarm.ch API        │
    │  ├─ GET https://www.wiewarm.ch/api/v1/bad/...        │
    │  ├─ Parkschwimmbad Lyss Temp                          │
    │  └─ Cache: 3600s                                        │
    │                                                          │
    │  fetchWindData()             →  MeteoSwiss via SMN    │
    │  ├─ GET api.existenz.ch/smn (Station BIE)             │
    │  ├─ Wind Speed, Gusts, Direction                      │
    │  └─ Cache: 600s                                         │
    │                                                          │
    │  fetchAirData()              →  MeteoSwiss via GeoAdmin│
    │  ├─ GET data.geo.admin.ch/ch.meteoschweiz...          │
    │  ├─ Air Temp (Current, Min 24h, Max 24h)              │
    │  └─ Cache: 600–3600s                                    │
    │                                                          │
    │  enrichWebcamsWithTimestamps()                          │
    │  ├─ HEAD https://imgproxy.windy.com/...              │
    │  ├─ Fetch Last-Modified Header (Bild-Aufnahmezeit)   │
    │  ├─ Cache-Bust mit ?t={timestamp}                     │
    │  └─ Fallback auf Date.now() für fehlerhafte Header    │
    │                                                          │
    └─────────────────────────────────────────────────────────┘
```

---

## Komponenten-Hierarchie

```
layout.tsx (Root)
  ├─ Head: Metadata, JSON-LD, GTM Script
  │
  └─ HomePage (Async Server Component)
      │
      ├─ Header
      │  ├─ Logo + BETA Badge
      │  └─ Nav Links (Temperaturen, Webcams, Karte)
      │
      ├─ main
      │  │
      │  ├─ HeroSection
      │  │  ├─ Large Title + Description
      │  │  ├─ Wind Display (beaufort, direction, gusts)
      │  │  └─ Air Temp Display (current, min, max)
      │  │
      │  ├─ TemperatureOverview
      │  │  └─ Grid of TemperatureCard (9 total)
      │  │     ├─ Location name + Temp
      │  │     ├─ Min/Max 24h (falls vorhanden)
      │  │     ├─ Source Badge
      │  │     └─ Status Color (cool/pleasant/warm)
      │  │
      │  ├─ WebcamGrid
      │  │  └─ Grid of WebcamCard (6 total)
      │  │     ├─ Live Image (Windrichtung + Last-Modified)
      │  │     ├─ Location name + Description
      │  │     ├─ Timestamp Badge (falls vorhanden)
      │  │     └─ "Öffnen" Link zu Source
      │  │
      │  └─ LakeMapWrapper
      │     └─ LakeMap (Leaflet Container)
      │        ├─ OSM Basemap + CARTO
      │        ├─ Marker für alle 13 Stationen
      │        ├─ Popups mit Temp-Info
      │        └─ Client-side Interaktivität
      │
      └─ Footer
         ├─ Brand Info
         ├─ Data Sources (mit Links)
         ├─ BETA Disclaimer
         └─ Legal Notice (Keine Gewähr)
```

---

## Data Types & Interfaces

### TemperatureReading
```typescript
{
  id: string;                    // eindeutige ID (z.B. "biel-strandbad")
  name: string;                  // Display Name
  location: string;              // Ort
  lat, lng: number;              // Geo-Koordinaten
  temperature: number | null;    // aktuelle Temp (°C)
  source: DataSource;            // Quelle (alplakes, bafu, wiewarm)
  sourceUrl: string;             // Link zur Datenquelle
  updatedAt: string;             // ISO Timestamp
  status: 'cool'|'pleasant'|'warm';
  quality?: 'high'|'medium'|'estimated';
  tempMin24h?, tempMax24h?: number | null;
}
```

### WebcamEntry
```typescript
{
  id: string;                    // eindeutige ID
  name: string;                  // Display Name
  location: string;              // Ort
  lat, lng: number;              // Geo-Koordinaten
  provider: string;              // "windy.com", etc.
  sourceUrl: string;             // Link zu Live-Cam
  previewImageUrl?: string;      // Direct Image URL (mit Cache-Bust ?t=)
  imageUpdatedAt?: string;       // ISO Timestamp (aus Last-Modified Header)
  description?: string;          // Optional Beschreibung
  requiresExternalOpen: boolean; // Must open in new window?
}
```

### WindData
```typescript
{
  speedKmh: number;              // Wind Speed
  gustsKmh: number | null;       // Wind Gusts
  directionDeg: number | null;   // 0–360°
  directionLabel: string | null; // N, NO, O, SO, S, SW, W, NW
  beaufort: number;              // 0–12 Beaufort Scale
  beaufortLabel: string;         // "Windstille", "Leichte Brise", etc.
  station: string;               // "Biel/Bienne"
  stationCode: string;           // "BIE"
  updatedAt: string;             // ISO Timestamp
}
```

### AirData
```typescript
{
  currentTemp: number;           // Aktuelle Lufttemperatur (°C)
  minToday: number | null;       // Min 24h
  maxToday: number | null;       // Max 24h
  station: string;               // "Biel"
  stationCode: string;           // "BIE"
  updatedAt: string;             // ISO Timestamp
}
```

---

## Datenfluss Detail: Alplakes Fetch

```
fetchAlplakesTemperature(lat, lng, id, name, location)
  │
  ├─ Format Timestamp: YYYYMMDDHHmm (Alplakes-spezifisch)
  │  Beispiel: "202607271100"
  │
  ├─ POST to Alplakes API:
  │  https://alplakes-api.eawag.ch/simulations/point/delft3d-flow/biel
  │  /{start}/{end}/{depth}/{lat}/{lng}
  │  Payload: depth=-1 (Oberflächenschicht)
  │
  ├─ Parse Response:
  │  JSON Array mit temperaturwerten über Zeit
  │
  ├─ Extract Latest:
  │  values[values.length - 1] = aktuelle Temp
  │
  ├─ Determine Status:
  │  if (temp >= 22) → 'warm'
  │  else if (temp >= 18) → 'pleasant'
  │  else → 'cool'
  │
  └─ Return TemperatureReading
     {
       temperature: 23.5,
       status: 'warm',
       source: 'alplakes',
       updatedAt: new Date().toISOString(),
       ...
     }
```

---

## Webcam Timestamp Enrichment

```
enrichWebcamsWithTimestamps(webcams[])
  │
  ├─ For Each Webcam:
  │  │
  │  ├─ HEAD Request zu previewImageUrl
  │  │  (z.B. imgproxy.windy.com/...)
  │  │
  │  ├─ Extract Response Header: Last-Modified
  │  │  Falls vorhanden: RFC 2822 Date String
  │  │  Falls nicht: return null
  │  │
  │  └─ Parallel: Promise.all([fetch1, fetch2, ...])
  │
  ├─ Map Timestamps zu Webcams:
  │  │
  │  ├─ Wenn Last-Modified verfügbar:
  │  │  • imageUpdatedAt = new Date(lastModified).toISOString()
  │  │  • previewImageUrl += `?t={new Date(lastModified).getTime()}`
  │  │    → Cache-Bust mit echtem Bild-Timestamp
  │  │
  │  └─ Wenn NICHT verfügbar:
  │     • imageUpdatedAt = undefined (kein Badge anzeigen)
  │     • previewImageUrl += `?t={Date.now()}`
  │       → Cache-Bust mit Server-Rendertime (verhindert stale Images)
  │
  └─ Return Angereicherte WebcamEntry[]
```

---

## ISR (Incremental Static Regeneration)

### Page-Level ISR
```typescript
// src/app/page.tsx
export const revalidate = 1800;  // 30 Minuten

// Next.js regeneriert automatisch:
// 1. Build-Zeit: Seite wird HTML-Files generiert
// 2. Nach Deploy: Jeder Request cacht für 30 min
// 3. Nach 30 min: Next.js generiert neuen Static HTML
// 4. Während Regeneration: Alte Version wird served (stale-while-revalidate)
```

### API-Level ISR
```typescript
// Jede Fetch-Funktion hat eigenes revalidate:
fetch(url, { next: { revalidate: 600 } })  // 10 min
fetch(url, { next: { revalidate: 3600 } }) // 60 min

// Shorter Revalidate = Frischere Daten, aber mehr API-Calls
```

### Caching-Hierarchie
```
Browser Cache ← HTML (static)
       ↑
Next.js ISR Cache ← Data (revalidated)
       ↑
External APIs ← Fetch mit Custom Revalidate
```

---

## Fehlerbehandlung & Fallbacks

### API-Fehler Handling
```typescript
// Patern in allen Adapters:
try {
  const res = await fetch(url);
  if (!res.ok) return null;         // ← Falls HTTP Error
  const json = await res.json();
  // ... parse & validate
  return result;
} catch {
  return null;                      // ← Falls Network/Parse Error
}
```

### Seiten-Level Fallback
```typescript
// Wenn IRGENDEINE Datenquelle fehlschlägt:
const anyLive = liveReadings.some(Boolean);

if (anyLive) {
  // Mindestens eine Live-Quelle verfügbar → Use Live Data
} else {
  // Alle Quellen down → Use Seed Data (hardcoded fallback)
  data = getSeedData();
}
```

### Seed Data
```typescript
// src/lib/data.ts
export function getSeedData(): DashboardData {
  // Hardcoded Fallback-Daten für den Fall dass alle APIs down sind
  // Beispieldaten: Temps von letzter erfolgreicher Fetch
  // Verhindert 500 Error, aber Nutzer sieht: "Daten möglicherweise veraltet"
}
```

---

## Performance-Optimierungen

### 1. Server-Side Rendering (SSR)
- Alle Daten-Fetches auf dem Server
- Keine N+1 Requests vom Client
- HTML ist vollständig beim Laden

### 2. ISR – Prefetching
- 30 min ISR = Daten sind immer < 30 min alt
- Neue Besucher bekommen sofort gecachte Version
- Kein "Cold Start" Problem

### 3. Parallel Fetching
```typescript
const [results, wind, air, aare, hagneck, lyss, aareBern] = await Promise.all([
  Promise.allSettled([...]),  // Webcams in parallel
  fetchWindData(),            // nicht blockiert
  fetchAirData(),             // nicht blockiert
  // ...
]);
```

### 4. Image Lazy Loading
```typescript
<img loading="lazy" src={imageUrl} />
// Browser lädt Bilder erst wenn nötig
```

### 5. Cache-Busting
```typescript
// Mit Timestamp query param:
<img src="https://imgproxy.windy.com/...jpg?t=1690000000" />
// Browser erkennt: neuer URL → ignoriert alten Cache
```

---

## SEO & Metadata

### robots.txt (generiert)
```
User-agent: *
Allow: /
Sitemap: https://bielerseestatus.ch/sitemap.xml
```

### sitemap.xml (generiert)
```xml
<url>
  <loc>https://bielerseestatus.ch</loc>
  <lastmod>2026-07-27</lastmod>
  <changefreq>hourly</changefreq>
  <priority>1.0</priority>
</url>
```

### JSON-LD (in Head)
```json
{
  "@type": "WebSite",
  "name": "Bielersee Status",
  "url": "https://bielerseestatus.ch"
}
{
  "@type": "Dataset",
  "name": "Bielersee Wassertemperaturen",
  "creator": {"@type": "Organization", "name": "Eawag Alplakes"}
}
```

### Open Graph Tags
```
og:title, og:description, og:image (1200×630)
og:type: website
og:locale: de_CH
```

---

## Google Tag Manager (GTM)

### Integration
- **Container ID:** GTM-5PBBRXP6
- **Consent Mode v2:** Default `denied` (alle Tags)
- **Benutzer müssen aktiv Opt-in** bevor Google Analytics/Ads feuern

### Konfiguration
```typescript
// In layout.tsx, vor GTM Script:
window.dataLayer = window.dataLayer || [];
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
```

### Nächste Schritte
- GA4-Tag im GTM-Dashboard konfigurieren
- Consent-Banner implementieren (Cookie-Management)
- Events tracking für User-Interaktionen

---

## Skalierungspunkte (für Zukunft)

### 1. Mehr Datenquellen
- Weitere See-Stationen hinzufügen
- Weitere Webcam-Provider (YouTube, Vimeo, etc.)

### 2. Mehrsprachigkeit
- i18n Setup für DE/FR/EN
- Übersetzungen von Labels, Tooltips

### 3. Export & APIs
- Public REST API für externe Tools
- Daten-Export (CSV, JSON)

### 4. User Accounts
- Favorit-Stationen speichern
- Custom Alerts (Temp-Threshold)
- Dark Mode Toggle

### 5. Mobile App
- React Native / Flutter Version
- Push Notifications

---

**Letzte Aktualisierung:** 27.07.2026
