'use client';
import type { TemperatureReading, WebcamEntry } from '@/lib/types';

interface Props {
  readings: TemperatureReading[];
  webcams: WebcamEntry[];
}

export default function LakeMapWrapper({ readings, webcams }: Props) {
  const payload = encodeURIComponent(
    JSON.stringify({
      readings: readings.map((r) => ({
        lat: r.lat,
        lng: r.lng,
        name: r.name,
        location: r.location,
        temp: r.temperature,
        status: r.status,
        sourceUrl: r.sourceUrl,
      })),
      webcams: webcams.map((c) => ({
        lat: c.lat,
        lng: c.lng,
        name: c.name,
        location: c.location,
        sourceUrl: c.sourceUrl,
      })),
    })
  );

  const src = `/api/map-html?d=${payload}`;

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

        <iframe
          src={src}
          className="map-container"
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 14,
            display: 'block',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}
          title="Bielersee Karte"
          loading="lazy"
        />
      </div>
    </section>
  );
}
