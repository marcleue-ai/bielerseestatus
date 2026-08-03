# TODO – Aufgabenliste Bielersee Status

**Status:** Live Beta (27.07.2026)  
**Priorität:** High → Low

---

## 🚀 SOFORT (Diese Woche)

### GitHub Actions Setup
- [ ] SSH-Key bei Infomaniak generieren (für GitHub Actions)
- [ ] GitHub Secret `INFOMANIAK_SSH_KEY` + `INFOMANIAK_HOST` hinzufügen
- [ ] `.github/workflows/deploy.yml` erstellen:
  - Trigger: On push to main
  - SSH zu Infomaniak: `git fetch && git reset --hard origin/main`
  - Run: `npm ci && npm run build`
  - Restart Node.js App

**Impact:** Deployments werden automatisch, kein SSH-Terminal nötig mehr

---

### Domain-Konfiguration
- [ ] `bielerseestatus.ch` Domainparking aufheben (Cyon/Registrar)
- [ ] DNS A-Record auf Infomaniak-IP zeigen
- [ ] SSL-Zertifikat generieren lassen (Infomaniak auto-renew)
- [ ] www-Subdomain Redirect einrichten

**Impact:** Seite unter echtem Domain erreichbar, nicht nur .custivity.ch

---

### Environment-Variablen (Infomaniak)
- [ ] `AUTH_PASSWORD` + `AUTH_SECRET` im Infomaniak-Dashboard setzen
  - Notwendig wenn Passwortschutz später wieder hinzugefügt wird
- [ ] `NEXT_PUBLIC_SITE_URL` verifizieren (aktuell: `https://bielerseestatus.ch`)

---

## 📊 HOCH (Diese 2 Wochen)

### Analytics & Tracking
- [ ] Google Analytics 4 im GTM-Dashboard konfigurieren
  - Event Setup: Page Views, Button Clicks (Webcam Links)
  - Ziele: External Links (zu Datenquellen)
- [ ] Cookie-Consent Banner implementieren (z.B. OneTrust, Osano)
  - "Accept All" → Google Analytics aktivieren
  - "Reject All" → Nur technisch notwendige Cookies
- [ ] Test GTM Container im Staging

**Impact:** Verstehe User-Verhalten, optimiere Seite basierend auf Daten

---

### Passwortschutz (Optional Re-Enable)
- [ ] Middleware + Login-Page wieder hinzufügen (Dateien sind gelöscht)
- [ ] `.env.local` mit Passwort pro Environment (dev vs. prod)
- [ ] Passwort-Reset Mechanismus (z.B. Email-Link) – Noch zu definieren

**Hinweis:** War eingebaut, wurde entfernt, da Anforderung sich änderte. Nur wieder aktivieren wenn explizit gewünscht.

---

### Webcam-Timestamp Improvements
- [ ] **Problem:** Einige Kameras (Ligerz, Neuenstadt) liefern keinen Last-Modified Header
  - [ ] Alternatives Verfahren recherchieren:
    - Windy.com API für Metadaten (falls verfügbar)?
    - Fallback: EXIF Data auslesen (kompliziert)?
  - [ ] Dokumentation aktualisieren: Warum manche Cams kein Timestamp haben

**Impact:** Bessere User-Kommunikation, weniger Verwirrung

---

## 🟡 MITTEL (Nächsten Monat)

### Fehlerbehandlung & Logging
- [ ] Structured Logging für API-Failures
  - z.B. Sentry Integration oder simple Datei-Logs
- [ ] Sentry / LogRocket Error Tracking einbauen
- [ ] Dashboard mit Error Rate + API Response Times

**Impact:** Schneller Fehler erkennen, Probleme debuggen

---

### Datenquellen-Redundanz
- [ ] Backup-Datenquellen für kritische Messpunkte:
  - Falls Alplakes down: Fallback zu MeteoSwiss Daten?
  - Falls BAFU down: Fallback zu anderen Quellen?
- [ ] Health-Check Endpunkt: `/api/health` → Status aller Datenquellen

**Impact:** Höhere Verfügbarkeit, Seite funktioniert auch bei partiellen Ausfällen

---

### Performance-Monitoring
- [ ] Core Web Vitals in Google Search Console überwachen
- [ ] Vercel Analytics (falls auf Vercel deployed)
- [ ] Infomaniak Server Performance Logs prüfen

**Impact:** Stelle sicher dass Seite schnell lädt (z.B. LCP < 2.5s)

---

### SEO Fine-Tuning
- [ ] OpenAI Rich Results Test: Structured Data validieren
- [ ] Hreflang Tags (falls Mehrsprachigkeit geplant)
- [ ] Mobile-Friendly Test durchlaufen
- [ ] Alt-Text für OG-Image optimieren

**Impact:** Bessere Google-Rankings, mehr organic Traffic

---

## 🔵 NIEDRIG (Backlog)

### Neue Features
- [ ] **Dark Mode Toggle** – CSS Custom Properties für Theme
- [ ] **Favorit-Stationen** – LocalStorage Speicherung
- [ ] **Email Alerts** – "Benachrichtige mich wenn Temp über 25°C"
  - Notwendig: Email-Service (z.B. SendGrid, Mailgun)
  - Cronjob der täglich prüft und versendet
- [ ] **Export Funktionalität** – Daten als CSV/JSON
- [ ] **Time-Series Chart** – Temperature Trend (letzte 7 Tage)
  - Notwendig: Datenbank (MongoDB, PostgreSQL) zur Historisierung

---

### Mehrsprachigkeit
- [ ] i18n Setup (next-intl oder Locale-based Routing)
- [ ] Texte als Keys extrahieren
- [ ] Übersetzer engagieren: DE (✓ vorhanden) → FR, IT, EN
- [ ] FR/IT Landing Pages
- [ ] SEO: Hreflang für alle Locales

**Abhängigkeit:** Nachdem Domain + Core Feature stabil

---

### Mobile App
- [ ] Anforderungen sammeln (PWA vs. Native)
- [ ] Mockups erstellen
- [ ] Technologie wählen (PWA, React Native, Flutter)
- [ ] Implementieren & testen

**Aufwand:** Hoch, später im Jahr

---

### Community-Features
- [ ] **User-Submissions** – Benutzer können Webcams/Stationen hinzufügen
  - Moderation nötig
  - Datenbank für Submissions erforderlich
- [ ] **Comments auf Stationen** – "Ich war heute hier, Wasser war erfrischend"
  - Spam-Schutz nötig

---

### Zusätzliche Datenquellen
- [ ] Weitere Seen: **Zürichsee, Vierwaldstättersee, Genfersee**
  - Unterschiedliche APIs recherchieren
  - Multi-Lake Architektur planen
- [ ] Wellenvorhersagen (Windsurfing-Info)
- [ ] UV-Index & Sonnenschein-Prognose

---

## 📋 Technische Schulden

### Code Quality
- [ ] Unit Tests hinzufügen (vitest / jest)
  - Tests für Adapters (Datenquellen-Parsing)
  - Tests für Components (React Testing Library)
- [ ] E2E Tests (Cypress / Playwright)
  - Test: Seite lädt, Daten werden angezeigt
  - Test: Karte interaktiv, Popups funktionieren
- [ ] Storybook für Component-Dokumentation

---

### Dokumentation
- [ ] ✓ PROJECT.md
- [ ] ✓ ARCHITECTURE.md
- [ ] ✓ TODO.md (diese Datei)
- [ ] ✓ CHANGELOG.md
- [ ] API-Endpunkte dokumentieren (`/api/data`, `/api/map-html`, etc.)
- [ ] Onboarding-Guide für neue Entwickler
- [ ] Troubleshooting Guide (häufige Fehler)

---

### Dependencies-Audit
- [ ] Regelmässig `npm audit` durchführen
- [ ] Veraltete Dependencies aktualisieren
  - Next.js 16 → 17+ wenn verfügbar
  - React 19 → 20+ wenn verfügbar
- [ ] Breaking Changes testen

---

### Cleanup
- [ ] Ungenutzter Code entfernen:
  - `/src/app/api/cam-time/route.ts` (Passwort-Auth API, UNUSED)
  - `/src/components/UpdateStatus.tsx` (wird nicht gerendert)
- [ ] `.env.local` nie on GitHub committen (✓ bereits in .gitignore)
- [ ] Stale Seed Data aufräumen

---

## 📅 Regelmässige Tasks

### Täglich
- Seite öffnen, visuell prüfen dass Daten laden
- Fehler in Browser Console prüfen
- Response Times in DevTools prüfen

### Wöchentlich
- Commit Activity auf GitHub prüfen
- Build Logs auf Infomaniak prüfen
- Datenquellen manuell testen (z.B. Alplakes API in curl/Postman)

### Monatlich
- `npm audit` durchführen
- Google Search Console Errors prüfen
- Nutzer-Feedback sammeln (falls Button zum Feedback bauen)

### Quartal
- SEO-Audit (Rankings, Backlinks, Sitespeed)
- Competitor Monitoring (ähnliche Services)
- Feature-Feedback Review

---

## 🔗 Abhängigkeiten zwischen Tasks

```
GitHub Actions Setup
  ↓ ermöglicht automatische Deploys
  → Schnellere Iterations-Zyklen

Domain-Konfiguration
  ↓ Voraussetzung für Production
  → Registrierung in Google Search Console
  → Google Analytics Setup
  → Suchmaschinen-Indexierung

Analytics Setup (GTM, GA4)
  ↓ Liefert Daten zu
  → Performance Monitoring
  → SEO Fine-Tuning
  → Feature-Prioritisation

Fehlerbehandlung & Logging
  ↓ Notwendig für
  → Datenquellen-Redundanz
  → Performance Monitoring
  → Production Support
```

---

## 📝 Notizen

- **Passwortschutz:** War eingebaut (27.07.2026 Morgen), wurde wieder entfernt (27.07.2026 Mittag) auf Benutzer-Wunsch. Dateien gelöscht, aber zur Dokumentation behalten.
- **Webcam-Timestamps:** Nur 4 von 6 Kameras liefern `Last-Modified` Header. Workaround: Cache-Bust mit Server-Rendertime. Langfristig: Alternative Timestamp-Quelle finden.
- **Seed Data:** Hardcoded Fallback falls alle APIs down. Manuell aktualisiert werden (nicht automatisch).
- **ISR 30 Min:** Daten sind immer max. 30 Min alt (nach Deployment). Okay für diese Use Case.

---

**Letzte Aktualisierung:** 27.07.2026  
**Owner:** Marc Leuenberger
