'use client';
import { MapPin, ExternalLink } from 'lucide-react';
import type { TemperatureReading } from '@/lib/types';
import SourceBadge from './SourceBadge';
import UpdateStatus from './UpdateStatus';

const STATUS_CONFIG = {
  cool:     { label: 'Kühl',      color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  pleasant: { label: 'Angenehm', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  warm:     { label: 'Warm',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

export default function TemperatureCard({ reading }: { reading: TemperatureReading }) {
  const status = STATUS_CONFIG[reading.status];
  const temp = reading.temperature;

  return (
    <article
      className="glass"
      style={{
        padding: '20px 22px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* Accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${status.color}, transparent)` }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 4, lineHeight: 1.3 }}>
            {reading.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 12 }}>
            <MapPin size={11} />
            {reading.location}
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 999,
            background: status.bg,
            color: status.color,
            border: `1px solid ${status.color}33`,
            flexShrink: 0,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Temperature */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {temp !== null ? (
          <>
            <span style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {temp.toFixed(1)}
            </span>
            <span style={{ fontSize: 20, color: '#2dd4c8', fontWeight: 600, marginBottom: 4 }}>°C</span>
          </>
        ) : (
          <span style={{ fontSize: 20, color: '#475569' }}>Keine Daten</span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SourceBadge source={reading.source} />
          {reading.quality === 'medium' && (
            <span style={{ fontSize: 10, color: '#64748b' }}>Schätzwert</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UpdateStatus updatedAt={reading.updatedAt} size="xs" />
          <a
            href={reading.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#475569', display: 'flex' }}
            title="Quelle öffnen"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* 24h low/high */}
      {(reading.tempMin24h != null || reading.tempMax24h != null) && (
        <>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '12px 0 10px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#475569', letterSpacing: '0.05em' }}>24h</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {reading.tempMin24h != null && (
                <span style={{ fontSize: 12, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 3 }}>
                  ↓ <span style={{ fontWeight: 600 }}>{reading.tempMin24h.toFixed(1)}°</span>
                </span>
              )}
              {reading.tempMin24h != null && reading.tempMax24h != null && (
                <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.08)', display: 'inline-block' }} />
              )}
              {reading.tempMax24h != null && (
                <span style={{ fontSize: 12, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 3 }}>
                  ↑ <span style={{ fontWeight: 600 }}>{reading.tempMax24h.toFixed(1)}°</span>
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
