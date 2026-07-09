import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('d');
  let readings: { lat: number; lng: number; name: string; temp: number | null; status: string; sourceUrl: string }[] = [];
  let webcams: { lat: number; lng: number; name: string; location: string; sourceUrl: string }[] = [];

  try {
    const parsed = JSON.parse(decodeURIComponent(raw ?? '{}'));
    readings = parsed.readings ?? [];
    webcams = parsed.webcams ?? [];
  } catch {
    // use empty arrays
  }

  const leafletJs = readFileSync(
    join(process.cwd(), 'node_modules/leaflet/dist/leaflet.js'),
    'utf8'
  );
  const leafletCss = readFileSync(
    join(process.cwd(), 'node_modules/leaflet/dist/leaflet.css'),
    'utf8'
  );

  const markersJson = JSON.stringify({ readings, webcams });

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
${leafletCss}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #map { width: 100%; height: 100%; background: #0a1628; }
.leaflet-popup-content-wrapper { background: #0d1f3c; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.6); color: #f1f5f9; }
.leaflet-popup-tip { background: #0d1f3c; }
.leaflet-popup-content { margin: 12px 16px; font-family: system-ui, sans-serif; }
.leaflet-container a.leaflet-popup-close-button { color: #64748b; }
.custom-marker { background: transparent !important; border: none !important; }
</style>
</head>
<body>
<div id="map"></div>
<script>${leafletJs}</script>
<script>
(function() {
  var data = ${markersJson};
  var STATUS_COLORS = { cool: '#60a5fa', pleasant: '#34d399', warm: '#f59e0b' };

  var map = L.map('map', { center: [47.08, 7.15], zoom: 12, zoomControl: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  var bounds = [];

  data.readings.forEach(function(r) {
    if (r.temp === null) return;
    var color = STATUS_COLORS[r.status] || '#60a5fa';
    bounds.push([r.lat, r.lng]);
    var icon = L.divIcon({
      html: '<div style="background:' + color + ';color:#0a1628;font-weight:700;font-size:12px;padding:4px 8px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.2)">' + r.temp.toFixed(1) + '°C</div>',
      className: 'custom-marker',
      iconAnchor: [30, 14]
    });
    L.marker([r.lat, r.lng], { icon: icon }).addTo(map).bindPopup(
      '<strong style="font-size:14px">' + r.name + '</strong><br/>' +
      '<span style="color:#64748b;font-size:12px">' + (r.location || '') + '</span><br/><br/>' +
      '<span style="font-size:22px;font-weight:800;color:' + color + '">' + r.temp.toFixed(1) + '°C</span><br/>' +
      '<a href="' + r.sourceUrl + '" target="_blank" style="font-size:11px;color:#2dd4c8;margin-top:6px;display:inline-block">Quelle öffnen ↗</a>'
    );
  });

  data.webcams.forEach(function(cam) {
    bounds.push([cam.lat, cam.lng]);
    var icon = L.divIcon({
      html: '<div style="background:#8b5cf6;color:#fff;font-size:11px;font-weight:600;padding:4px 9px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.2)">📷 Cam</div>',
      className: 'custom-marker',
      iconAnchor: [30, 14]
    });
    L.marker([cam.lat, cam.lng], { icon: icon }).addTo(map).bindPopup(
      '<strong style="font-size:14px">📷 ' + cam.name + '</strong><br/>' +
      '<span style="color:#64748b;font-size:12px">' + cam.location + '</span><br/><br/>' +
      '<a href="' + cam.sourceUrl + '" target="_blank" style="font-size:11px;color:#2dd4c8;margin-top:6px;display:inline-block">Webcam öffnen ↗</a>'
    );
  });

  if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
  }

  setTimeout(function() { map.invalidateSize(); }, 200);
})();
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
