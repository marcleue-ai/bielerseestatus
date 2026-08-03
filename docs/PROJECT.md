# Bielersee Status – Projektdokumentation

## Projektübersicht

**Bielersee Status** ist eine Web-Anwendung zur Echtzeit-Überwachung von Wassertemperaturen, Wetterdaten und Webcams rund um den Bielersee in der Schweiz.

### Projektziel
Benutzer sollen aktuelle, verlässliche Informationen über Wassertemperaturen an 9 verschiedenen Messpunkten und Live-Webcam-Bilder von 6 Standorten in Echtzeit erhalten, um informierte Entscheidungen für Wasseraktivitäten zu treffen.

### Status
**LIVE BETA** – Produktiv unter bielerseestatus.custivity.ch (Infomaniak Webhosting)

### Wichtige Links
- **Live Site:** https://bielerseestatus.custivity.ch
- **GitHub Repo:** https://github.com/marcleue-ai/bielerseestatus
- **Hosting:** Infomaniak Webhosting (Node.js)
- **Analytics:** Google Tag Manager (GTM-5PBBRXP6)
- **Domain:** bielerseestatus.ch (geplant, noch zu konfigurieren)

---

## Stack & Technologie

### Frontend
- **Framework:** Next.js 16.2.9 (App Router, React 19)
- **UI/Styling:** Tailwind CSS v4, Lucide Icons
- **Karten:** Leaflet + React-Leaflet
- **Build:** TypeScript 5, ESLint 9

### Backend
- **Runtime:** Node.js 24 (Infomaniak)
- **Daten-Layer:** Server Components + ISR (Incremental Static Regeneration)
- **Cache:** Next.js ISR, HTTP Revalidation (10–60 min je API)

### APIs & Datenquellen
| Quelle | Daten | Update | Endpunkt |
|--------|-------|--------|----------|
| Eawag Alplakes | See-Temperatur (8 Punkte) | 10 min | `alplakes-api.eawag.ch` |
| BAFU Hydrodaten | Aare-Temperatur (2 Stationen) | 60 min | `api.existenz.ch/hydro` |
| MeteoSwiss SMN | Wind (Biel), Luft-Temp | 10–60 min | `api.existenz.ch/smn` |
| wiewarm.ch | Parkschwimmbad Lyss | Variabel | `wiewarm.ch/api/v1` |
| windy.com | Webcam-Bilder (6 Cams) | Echtzeit | `imgproxy.windy.com` |

### Deployment
- **Hosting:** Infomaniak Webhosting Node.js
- **Build-Befehl:** `npm ci && npm run build`
- **Dev-Server:** `next dev --port 3003 --hostname 0.0.0.0`

---

## Hauptfunktionen

### 1. Temperaturübersicht
- **9 Messpunkte:** 8 Seestationen (Alplakes) + 1 Aare-Station (BAFU Bern)
- **Zusätzlich:** 2 weitere Aare-Stationen (Hagneck, Brügg) + Parkschwimmbad Lyss
- **Anzeige:** Aktuelle Temp, Min/Max 24h, Status (cool/pleasant/warm)
- **Update:** ISR alle 30 Min

### 2. Webcams
- **6 Live-Kameras** von windy.com (Magglingen, Neuenstadt, Bielersee SE, Ligerz, Prêles, Ipsach)
- **Zeitstempel:** Aus `Last-Modified` Header, falls verfügbar
- **Cache-Bust:** Query-Parameter `?t={timestamp}` verhindert stale Images
- **Fallback:** Placeholder bei Fehler

### 3. Wetterdaten
- **Wind:** Station Biel (BIE) – Speed, Böen, Richtung, Beaufort-Skala
- **Luft-Temperatur:** MeteoSwiss (Standort Biel)

### 4. Interaktive Karte
- **Leaflet.js:** OpenStreetMap + CARTO Basemap
- **Marker:** Alle 13 Messstationen mit Popup-Info
- **Cluster:** Daten werden client-seitig aus page-Props geladen

### 5. SEO & Analytics
- **Sitemap:** Automatisch generiert (robots.ts, sitemap.ts)
- **OG-Tags:** Open Graph + Twitter Card
- **JSON-LD:** WebSite + Dataset Schema
- **GTM:** Consent Mode v2 (alle Defaults `denied`)

---

## Datenflusss

```
User Browser
    ↓
Next.js Server (page.tsx)
    ↓ [ISR: alle 30 min]
┌─────────────────────────────────┐
│ Fetch Data (Server-Side)        │
├─────────────────────────────────┤
│ • fetchAlplakesTemperature()    │
│ • fetchAareTemperature()        │
│ • fetchHagneckTemperature()     │
│ • fetchAareBernTemperature()    │
│ • fetchLyssTemperature()        │
│ • fetchWindData()               │
│ • fetchAirData()                │
│ • enrichWebcamsWithTimestamps() │
└─────────────────────────────────┘
    ↓
HTML + JSON-LD + CSS-in-JS
    ↓
Browser (React Hydration)
    ↓
Leaflet Map + Interactive UI
```

---

## Projektstruktur

```
src/
├── app/
│   ├── layout.tsx              (Root Layout, GTM, Metadata, JSON-LD)
│   ├── page.tsx                (Home – alle Daten fetchen + ISR)
│   ├── robots.ts               (SEO – robots.txt)
│   ├── sitemap.ts              (SEO – sitemap.xml)
│   ├── opengraph-image.tsx     (OG-Bild 1200×630)
│   ├── api/
│   │   ├── auth/route.ts        (Passwort-Auth – derzeit GELÖSCHT)
│   │   ├── cam-time/route.ts    (Webcam Last-Modified Proxy – unused)
│   │   ├── data/route.ts        (Noch zu definieren)
│   │   ├── map-html/route.ts    (Karten-HTML für Leaflet)
│   │   └── webcam/route.ts      (Noch zu definieren)
│   └── globals.css             (Tailwind)
├── components/
│   ├── Header.tsx              (Nav + BETA Badge)
│   ├── HeroSection.tsx          (Intro + Wind + Air)
│   ├── TemperatureOverview.tsx (Grid aller Messungen)
│   ├── TemperatureCard.tsx      (Einzelne Messung)
│   ├── WebcamGrid.tsx           (6 Webcams)
│   ├── WebcamCard.tsx           (Einzelne Webcam + Timestamp)
│   ├── LakeMapWrapper.tsx       (Leaflet Container)
│   ├── LakeMap.tsx              (Interactive Map)
│   ├── SourceBadge.tsx          (Badge für Datenquellen)
│   ├── UpdateStatus.tsx         (Noch zu definieren)
│   └── Footer.tsx               (Beta-Hinweis + Quellen)
├── lib/
│   ├── types.ts                (TypeScript Interfaces)
│   ├── adapters.ts             (Alle Fetch-Funktionen)
│   └── data.ts                 (Seed Data – SEED_WEBCAMS, POINTS)
└── middleware.ts               (Passwort-Middleware – GELÖSCHT)

docs/
├── PROJECT.md                  (Diese Datei)
├── ARCHITECTURE.md             (Detaillierte Architektur)
├── TODO.md                     (Aufgabenliste)
└── CHANGELOG.md                (Versioniertes Changelog)
```

---

## Team & Verantwortlichkeiten

| Rolle | Verantwortung |
|-------|---------------|
| **Owner** | Marc Leuenberger (marc.leuenberger@me.com) |
| **Entwicklung** | Claude Code (AI Assistant) |
| **Deployment** | Infomaniak Webhosting (manuell via SSH + GitHub) |

---

## Wichtige Hinweise

### Beta-Status
- App zeigt "BETA" Badge im Header + Footer
- Haftungsausschluss im Footer vorhanden
- Keine Gewähr für Richtigkeit von Daten

### Bekannte Limitierungen
1. **Webcam-Timestamps:** Einige Kameras liefern keinen `Last-Modified` Header (z.B. Ligerz, Neuenstadt) → Timestamp wird nicht angezeigt
2. **Stale Images:** Ohne `Last-Modified` wird Image mit aktuellem Timestamp cache-geboost (verhindert stale cache, aber kein echter timestamp)
3. **BAFU/Alplakes Ausfallzeiten:** Bei API-Fehler wird Fallback zu Seed Data verwendet
4. **Passwortschutz:** War geplant, wurde wieder entfernt (Stand: 27.07.2026)

### Deployment-Prozess (aktuell)
1. Code ändern lokal
2. GitHub Desktop: Commit + Push
3. SSH zu Infomaniak: `git fetch && git reset --hard origin/main`
4. Infomaniak Dashboard: "Build" Button klicken
5. App lädt neu

**Geplant:** GitHub Actions für automatische Deploys

---

## Kontakt & Support

- **Issues:** GitHub Issues im Repo erstellen
- **Fragen:** Marc Leuenberger kontaktieren

---

**Zuletzt aktualisiert:** 27.07.2026  
**Version:** 0.1.0 (Beta)
