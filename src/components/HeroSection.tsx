import { Waves, Thermometer, MapPin, Wind, Sun } from 'lucide-react';
import type { TemperatureReading, WindData, AirData } from '@/lib/types';
import UpdateStatus from './UpdateStatus';

interface Props {
  readings: TemperatureReading[];
  lastUpdated: string;
  wind?: WindData | null;
  air?: AirData | null;
}

export default function HeroSection({ readings, lastUpdated, wind, air }: Props) {
  const valid = readings.filter((r) => r.temperature !== null);
  const warmest = valid.reduce((a, b) => ((a.temperature ?? 0) > (b.temperature ?? 0) ? a : b), valid[0]);
  const coolest = valid.reduce((a, b) => ((a.temperature ?? 99) < (b.temperature ?? 99) ? a : b), valid[0]);
  const avg = valid.length
    ? (valid.reduce((s, r) => s + (r.temperature ?? 0), 0) / valid.length).toFixed(1)
    : null;

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 16px 48px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #061122 0%, #0a1e3d 40%, #0d2a52 100%)',
      }}
    >
      {/* Glow */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 120%, rgba(45,212,200,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', top: '15%', left: '5%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(37,99,168,0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '20%', right: '5%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(45,212,200,0.08)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, width: '100%' }}>
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ padding: 14, borderRadius: '50%', background: 'rgba(45,212,200,0.12)', border: '1px solid rgba(45,212,200,0.25)' }}>
            <Waves size={32} color="#2dd4c8" />
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 9vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, color: '#fff', marginBottom: 14, letterSpacing: '-0.02em' }}>
          Bielersee{' '}<span className="temp-gradient">Status</span>
        </h1>

        <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', color: '#94a3b8', marginBottom: 36, lineHeight: 1.65, padding: '0 8px' }}>
          Seetemperaturen, Wasserqualität und Webcams<br />rund um den Bielersee
        </p>

        {/* Main stat boxes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
          {avg && (
            <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 24px' }}>
              <Thermometer size={26} color="#2dd4c8" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>Ø Seetemperatur</div>
                <div style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {avg}<span style={{ fontSize: '1.1rem', color: '#2dd4c8', marginLeft: 4 }}>°C</span>
                </div>
              </div>
            </div>
          )}
          {air && (
            <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 24px', border: '1px solid rgba(251,146,60,0.2)' }}>
              <Sun size={26} color="#fb923c" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>Lufttemperatur · {air.station}</div>
                <div style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {air.currentTemp}<span style={{ fontSize: '1.1rem', color: '#fb923c', marginLeft: 4 }}>°C</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  {air.minToday != null && <span style={{ fontSize: 11, color: '#60a5fa' }}>↓ {air.minToday}°</span>}
                  {air.maxToday != null && <span style={{ fontSize: 11, color: '#f59e0b' }}>↑ {air.maxToday}°</span>}
                  {(air.minToday != null || air.maxToday != null) && <span style={{ fontSize: 11, color: '#475569' }}>heute</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary chips — stacked on mobile, row on larger */}
        <div className="hero-chips">
          {warmest && (
            <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
              <MapPin size={13} color="#f59e0b" />
              <span style={{ color: '#94a3b8' }}>Wärmster:</span>
              <strong style={{ color: '#fff' }}>{warmest.name}</strong>
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{warmest.temperature}°C</span>
            </div>
          )}
          {coolest && (
            <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
              <MapPin size={13} color="#60a5fa" />
              <span style={{ color: '#94a3b8' }}>Kühlster:</span>
              <strong style={{ color: '#fff' }}>{coolest.name}</strong>
              <span style={{ color: '#60a5fa', fontWeight: 700 }}>{coolest.temperature}°C</span>
            </div>
          )}
          {wind && (
            <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', fontSize: 13, whiteSpace: 'nowrap', border: '1px solid rgba(45,212,200,0.2)' }}>
              <Wind size={13} color="#2dd4c8" />
              <span style={{ color: '#94a3b8' }}>Wind:</span>
              {wind.directionLabel && <span style={{ color: '#fff', fontWeight: 600 }}>{wind.directionLabel}</span>}
              <span style={{ color: '#fff', fontWeight: 600 }}>{wind.speedKmh} km/h</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(45,212,200,0.12)', color: '#2dd4c8', border: '1px solid rgba(45,212,200,0.2)' }}>
                Bft {wind.beaufort}
              </span>
            </div>
          )}
        </div>

        {(wind || air) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 8, marginBottom: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 11, color: '#334155' }}>
              MeteoSchweiz
              {wind && <> · Wind: Station {wind.station}</>}
              {air && <> · Luft: Station {air.station}</>}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <UpdateStatus updatedAt={lastUpdated} />
        </div>

        <a href="#temperaturen" className="scroll-cta">
          <span>Alle Messorte</span>
          <span className="scroll-cta-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
