# Bielersee Live

Aktuelle Wassertemperaturen und Webcams rund um den Bielersee.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Leaflet / react-leaflet** für die interaktive Karte
- **lucide-react** für Icons

## Installation & Start

```bash
npm install
npm run dev
```

Dann [http://localhost:3000](http://localhost:3000) im Browser öffnen.

## Projektstruktur

```
src/
  app/
    api/data/route.ts   ← API-Route (30-Min-Revalidierung)
    layout.tsx
    page.tsx            ← Hauptseite (Server Component)
    globals.css
  components/
    Header.tsx
    HeroSection.tsx
    TemperatureOverview.tsx
    TemperatureCard.tsx
    WebcamGrid.tsx
    WebcamCard.tsx
    LakeMap.tsx         ← Leaflet-Karte (Client-only)
    SourceBadge.tsx
    UpdateStatus.tsx
    Footer.tsx
  lib/
    types.ts            ← Typdefinitionen
    data.ts             ← Seed-/Fallback-Daten
    adapters.ts         ← Live-Datenquellen-Adapter
```

## Datenquellen

| Quelle | Status | Hinweis |
|---|---|---|
| [badi-info.ch](https://www.badi-info.ch/_temp/bielersee-temperatur.htm) | Seed-Daten | Keine öffentliche API; Betreiber kontaktieren für HTML-Scraping-Vereinbarung |
| [Eawag Alplakes](https://www.alplakes.eawag.ch/biel) | Adapter bereit | REST-API vorhanden (`alplakes-api.eawag.ch`); Adapter in `src/lib/adapters.ts` |
| [bielersee.live](https://bielersee.live) | Seed-Daten | Keine öffentliche API; Betreiber kontaktieren |

## Live-Daten anschliessen

1. **Eawag Alplakes** ist sofort nutzbar — `fetchAlplakesTemperature()` in `src/lib/adapters.ts` ist implementiert. In `src/app/api/data/route.ts` werden bereits Live-Daten für die Seemitte abgerufen.

2. **badi-info.ch & bielersee.live**: Adapter-Stubs vorhanden in `adapters.ts`. Implementierung sobald API-Zugang oder HTML-Scraping-Vereinbarung besteht.

3. In `src/app/page.tsx` `getSeedData()` durch einen `fetch('/api/data')` ersetzen, sobald Live-Adapter aktiv sind.

## Hinweis

Alle Daten stammen von externen Quellen. Angaben ohne Gewähr. Diese Website hat keine offizielle Verbindung zu den genannten Datenanbietern.
