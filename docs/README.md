# Dokumentation – Bielersee Status

## Dateien

- **PROJECT.md** – Projektübersicht, Stack, Status
- **ARCHITECTURE.md** – Detaillierte Architektur & Datenfluss
- **TODO.md** – Aufgabenliste mit Prioritäten
- **CHANGELOG.md** – Versioniertes Changelog & Deployment-History

## Aktualisierung

### Manuell (vor jedem Deploy)

```bash
./update-docs.sh
git add docs/
git commit -m "docs: update timestamps"
git push origin main
```

### Automatisch (GitHub Action)

- CHANGELOG.md wird automatisch updated bei jedem Push zu `main`
- Andere Docs updaten sich selbst wenn Code sich ändert (siehe Action Workflow)

## Konventionen

- **ISO Datum Format:** `YYYY-MM-DD`
- **Versionierung:** [Semantic Versioning](https://semver.org/)
- **Sprache:** Deutsch
- **Markdown:** GitHub-flavored Markdown (GFM)

## Best Practices

1. **Vor neuen Features:** TODO.md aktualisieren
2. **Bei Architektur-Änderungen:** ARCHITECTURE.md updaten
3. **Bei jedem Deploy:** `update-docs.sh` ausführen
4. **Wöchentlich:** CHANGELOG.md Review (neue Commits dokumentieren)

---

**Hinweis:** Diese Docs sind lebende Dokumente. Regelmässig aktualisiert, um den Projekt-Stand widerzuspiegeln.
