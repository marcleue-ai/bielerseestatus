# CHANGELOG – Bielersee Status

Alle bemerkenswertenÄnderungen dieses Projekts werden hier dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), und dieses Projekt folgt [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Geplant (nicht deployed)
- GitHub Actions für automatische Deploys
- Domain `bielerseestatus.ch` (aktuell nur .custivity.ch)
- Passwortschutz (optional re-enable)
- Google Analytics 4 im GTM-Dashboard konfigurieren
- Cookie-Consent Banner
- Webcam-Timestamp Improvements für problematische Kameras
- Unit Tests & E2E Tests

---

## [0.1.0] – 2026-07-27

### 🎉 Beta Release

**Deployment:** Infomaniak Webhosting (bielerseestatus.custivity.ch)

#### Added
- **Temperaturübersicht** mit 9 Messpunkten
  - 8 See-Stationen via Eawag Alplakes (Biel bis Ins)
  - 1 Aare-Station via BAFU Bern
  - Status-Badges (cool/pleasant/warm)
  - Min/Max 24h (wo verfügbar)

- **Zusätzliche Temperatur-Stationen**
  - Aare Brügg (BAFU Station 2029)
  - Aare Hagneck (BAFU Station 2085)
  - Aare Bern (BAFU Station 2135)
  - Parkschwimmbad Lyss (wiewarm.ch API)

- **Wetterdaten**
  - Wind-Display (Speed, Gusts, Direction, Beaufort-Skala)
  - Lufttemperatur (Current, Min 24h, Max 24h)
  - Station: Biel/Bienne (MeteoSwiss SMN)

- **Live Webcams** (6 Kameras von windy.com)
  - Magglingen
  - Neuenstadt (Lake Biel)
  - Bielersee Südosten
  - Ligerz / Petersinsel
  - Plateau de Diesse / Vinifuni Prêles
  - Ipsach / Nidauwald
  
- **Webcam-Features**
  - Live Image + Last-Modified Timestamp (wo verfügbar)
  - Cache-Busting via Query-Parameter (`?t={timestamp}`)
  - Direct Links zu Source-Seite

- **Interaktive Karte**
  - Leaflet.js mit OpenStreetMap + CARTO
  - Marker für alle 13 Messstationen
  - Popups mit aktuellerTemperatur & Info

- **SEO & Metadata**
  - Sitemap.xml (automatisch generiert)
  - robots.txt
  - JSON-LD (WebSite + Dataset Schema)
  - Open Graph Tags (Twitter Card)
  - `lang="de-CH"` + German Content

- **Google Tag Manager**
  - Container ID: GTM-5PBBRXP6
  - Consent Mode v2 (Defaults: denied)
  - Placeholder für Google Analytics (später konfigurieren)

- **Design & UI**
  - Responsive Design (mobile-first)
  - Dark Theme (Ocean Blue Palette)
  - BETA Badge im Header
  - Source-Badges für jede Messung
  - Glass-Morphism Cards

- **Technical Foundation**
  - Next.js 16 (App Router)
  - React 19 + Tailwind CSS v4
  - TypeScript 5 (strict mode)
  - ISR: 30 min page revalidation
  - Server-Side Data Fetching (no client-side N+1)
  - Parallel API Fetching (Promise.allSettled)

#### Changed
- **Windstation** geändert von La Chaux-de-Fonds (CDF) zu Biel/Bienne (BIE)
  - Begründung: Relevantere Daten direkt am See
  - Winddaten jetzt lokal statt überregional

#### Removed
- **Passwortschutz** (am 27.07. kurzzeitig eingebaut, dann entfernt)
  - Middleware.ts gelöscht
  - Login Page gelöscht
  - Auth API Route gelöscht
  - Begründung: Anforderung geändert → Öffentliche Beta statt geschützt

#### Fixed
- Webcam Image Caching: Cache-Bust verhindert alte Bilder
- Timestamp-Parsing: ISO-Format für Datenbank-Kompatibilität
- Beaufort-Berechnung: Korrekte Wind-Skala

#### Known Issues
- Einige Webcams (Ligerz, Neuenstadt) liefern keinen `Last-Modified` Header
  - Workaround: Cache-Bust mit aktuellem Timestamp (verhindert stale, aber kein echter Timestamp)
  - Keine Lösung in Sicht (Windy-seitiges Problem)

---

## [Pre-Release] – 2026-06-25 ... 2026-07-27

Interne Entwicklung:
- Initial Project Setup (Next.js + Components)
- Alplakes API Integration
- BAFU Hydrodaten Integration
- wiewarm.ch Integration
- Webcam Integration (windy.com)
- Leaflet Map Implementation
- GTM & SEO Setup
- Deploy zu Infomaniak Webhosting
- GitHub Repository Setup

---

## Versionierungs-Strategie

Dieses Projekt folgt **Semantic Versioning**:

- **MAJOR** (X.0.0): Breaking Changes (z.B. API-Restrukturierung, Datenformat-Änderung)
- **MINOR** (0.X.0): Features hinzufügen (z.B. neue Datenquelle, UI-Verbesserung)
- **PATCH** (0.0.X): Bugfixes (z.B. Webcam-Timestamp, Fehlerbehandlung)

**Beta-Phase:** 0.x.x Versionen. Nach stabiler Produktion: 1.0.0

---

## Deployment-History

| Datum | Version | Status | Notes |
|-------|---------|--------|-------|
| 2026-07-27 | 0.1.0 | LIVE | Beta Release, Infomaniak |
| 2026-07-27 | 0.0.9 | Staging | GTM Integration, Windstation BIE |
| 2026-07-27 | 0.0.8 | Staging | Aare Bern hinzugefügt |
| 2026-07-27 | 0.0.7 | Staging | Passwortschutz (dann wieder entfernt) |
| 2026-07-26 | 0.0.6 | Staging | Footer Update, Disclaimer |
| 2026-07-20 | 0.0.5 | Staging | Webcam Timestamp Enrichment |
| 2026-07-15 | 0.0.4 | Dev | Map Implementation |
| 2026-07-10 | 0.0.3 | Dev | Datenquellen-Integration |
| 2026-07-05 | 0.0.2 | Dev | Component Scaffold |
| 2026-06-25 | 0.0.1 | Dev | Project Init |

---

## Git Commits (Highlights)

```
b9fe0a3 Windstation Biel, Aare Bern Temperatur
3a8febf Initial commit: bielerseestatus.ch
(weitere Commits vor GitHub Push – nicht dokumentiert)
```

---

## Weitere Ressourcen

- **GitHub Issues:** Bug Reports & Feature Requests
- **GitHub Discussions:** Fragen & Ideen
- **Project Board:** Kanban für Task Management

---

**Stand:** 27.07.2026  
**Maintainer:** Marc Leuenberger  
**Sprache:** Deutsch
