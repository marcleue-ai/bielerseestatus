'use client';
import { useEffect, useRef, useState } from 'react';
import type { TemperatureReading, WebcamEntry } from '@/lib/types';

interface Props {
  readings: TemperatureReading[];
  webcams: WebcamEntry[];
}

const STATUS_COLORS: Record<string, string> = {
  cool: '#60a5fa',
  pleasant: '#34d399',
  warm: '#f59e0b',
};

export default function LakeMap({ readings, webcams }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<unknown>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (instanceRef.current || !mapRef.current) return;

    let destroyed = false;

    import('leaflet').then((L) => {
      if (destroyed || !mapRef.current || instanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [47.08, 7.15],
        zoom: 12,
        zoomControl: true,
      });
      instanceRef.current = map;

      // Fix blank map on initial render (common with dynamic imports)
      setTimeout(() => map.invalidateSize(), 100);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
        maxZoom: 19,
      }).addTo(map);

      const allLatLngs: [number, number][] = [];

      const popupStyle = [
        'background:#0d1f3c',
        'border:1px solid rgba(255,255,255,0.1)',
        'border-radius:10px',
        'padding:14px 16px',
        'box-shadow:0 8px 32px rgba(0,0,0,0.6)',
        'font-family:system-ui,sans-serif',
        'min-width:190px',
      ].join(';');

      // Temperature markers
      readings.forEach((r) => {
        if (r.temperature === null) return;
        const color = STATUS_COLORS[r.status] ?? '#60a5fa';
        allLatLngs.push([r.lat, r.lng]);

        const icon = L.divIcon({
          html: `<div style="background:${color};color:#0a1628;font-weight:700;font-size:12px;padding:4px 8px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,0.4);border:2px solid rgba(255,255,255,0.2)">${r.temperature.toFixed(1)}°C</div>`,
          className: 'custom-marker',
          iconAnchor: [30, 14],
        });

        L.marker([r.lat, r.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="${popupStyle}">
              <strong style="font-size:14px;color:#f1f5f9">${r.name}</strong><br/>
              <span style="color:#64748b;font-size:12px">${r.location}</span><br/><br/>
              <span style="font-size:24px;font-weight:800;color:${color}">${r.temperature.toFixed(1)}°C</span><br/>
              <a href="${r.sourceUrl}" target="_blank" rel="noopener noreferrer"
                style="font-size:11px;color:#2dd4c8;margin-top:8px;display:inline-block">Quelle öffnen ↗</a>
            </div>`,
            { className: 'dark-popup' }
          );
      });

      // Webcam markers
      webcams.forEach((cam) => {
        allLatLngs.push([cam.lat, cam.lng]);

        const icon = L.divIcon({
          html: `<div style="background:#8b5cf6;color:#fff;font-size:11px;font-weight:600;padding:4px 9px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,0.4);border:2px solid rgba(255,255,255,0.2)">📷 Cam</div>`,
          className: 'custom-marker',
          iconAnchor: [30, 14],
        });

        L.marker([cam.lat, cam.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="${popupStyle}">
              <strong style="font-size:14px;color:#f1f5f9">📷 ${cam.name}</strong><br/>
              <span style="color:#64748b;font-size:12px">${cam.location}</span><br/><br/>
              <a href="${cam.sourceUrl}" target="_blank" rel="noopener noreferrer"
                style="font-size:11px;color:#2dd4c8;margin-top:8px;display:inline-block">Webcam öffnen ↗</a>
            </div>`,
            { className: 'dark-popup' }
          );
      });

      // Auto-fit to all markers
      if (allLatLngs.length > 1) {
        map.fitBounds(allLatLngs as L.LatLngBoundsLiteral, { padding: [32, 32], maxZoom: 13 });
      }
    }).catch((e: Error) => {
      setMapError(e?.message ?? 'Unbekannter Fehler');
    });

    return () => {
      destroyed = true;
      if (instanceRef.current) {
        (instanceRef.current as { remove: () => void }).remove();
        instanceRef.current = null;
      }
    };
  }, [readings, webcams]);

  if (mapError) {
    return (
      <section id="karte" className="section-padding">
        <div className="section-inner">
          <h2 className="section-title">Karte</h2>
          <div style={{ padding: '32px', color: '#ef4444', fontSize: 13, background: 'rgba(13,32,68,0.5)', borderRadius: 14 }}>
            Karte konnte nicht geladen werden: {mapError}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="karte" className="section-padding">
      <div className="section-inner">
        <div style={{ marginBottom: 20 }}>
          <h2 className="section-title">Karte</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Messorte und Webcams rund um den Bielersee
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, fontSize: 12, color: '#94a3b8' }}>
          {[
            { color: '#f59e0b', label: 'Warm (≥22°C)' },
            { color: '#34d399', label: 'Angenehm (18–22°C)' },
            { color: '#60a5fa', label: 'Kühl (<18°C)' },
            { color: '#8b5cf6', label: 'Webcam' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>

        <div
          ref={mapRef}
          className="map-container"
          style={{
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </section>
  );
}
