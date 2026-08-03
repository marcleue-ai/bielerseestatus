#!/bin/bash
# update-docs.sh — Aktualisiere Docs vor jedem Deploy

set -e

DOCS_DIR="docs"
TIMESTAMP=$(date '+%d.%m.%Y %H:%M')
GIT_COMMIT=$(git rev-parse --short HEAD)

echo "📝 Updating documentation timestamps..."

# Update all .md files with current timestamp
for file in "$DOCS_DIR"/*.md; do
  if [ -f "$file" ]; then
    # Ersetze "Letzte Aktualisierung: ..." mit aktuellem Datum
    sed -i '' "s/^**Letzte Aktualisierung:**.*/**Letzte Aktualisierung:** $TIMESTAMP/" "$file"

    # Falls nicht vorhanden, füge es am Ende hinzu
    if ! grep -q "^**Letzte Aktualisierung:**" "$file"; then
      echo "" >> "$file"
      echo "---" >> "$file"
      echo "" >> "$file"
      echo "**Letzte Aktualisierung:** $TIMESTAMP" >> "$file"
    fi

    echo "  ✓ $file"
  fi
done

echo ""
echo "✅ Docs updated successfully"
echo "   Timestamp: $TIMESTAMP"
echo "   Git Commit: $GIT_COMMIT"
echo ""
echo "💡 Tip: Commit diese Änderungen vor dem Deploy:"
echo "   git add docs/ && git commit -m 'docs: update timestamps'"
