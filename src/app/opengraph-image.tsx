import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Bielersee Status – Wassertemperaturen & Webcams';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #061122 0%, #0a1e3d 50%, #0d2a52 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Glow */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'radial-gradient(ellipse 80% 50% at 50% 120%, rgba(45,212,200,0.18) 0%, transparent 70%)' }} />

        {/* Icon circle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(45,212,200,0.15)',
          border: '2px solid rgba(45,212,200,0.35)',
          marginBottom: 28,
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2dd4c8" strokeWidth="2" strokeLinecap="round">
            <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>
            <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>
            <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>
          </svg>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>Bielersee</span>
          <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.02em', color: '#2dd4c8' }}>Status</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: '#94a3b8', marginBottom: 40 }}>
          Wassertemperaturen & Webcams
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['8 Messpunkte', 'Echtzeit-Daten', 'Alplakes Eawag'].map((label) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center',
              padding: '10px 20px', borderRadius: 8,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#cbd5e1', fontSize: 18,
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{ position: 'absolute', bottom: 32, fontSize: 18, color: '#475569' }}>
          bielerseestatus.ch
        </div>
      </div>
    ),
    { ...size }
  );
}
