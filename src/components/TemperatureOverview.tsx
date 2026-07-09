'use client';
import { useState, useMemo } from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import type { TemperatureReading, DataSource } from '@/lib/types';
import TemperatureCard from './TemperatureCard';

const SOURCE_LABELS: Record<DataSource | 'all', string> = {
  all: 'Alle',
  'badi-info': 'badi-info.ch',
  'alplakes': 'Alplakes',
  'bielersee-live': 'bielersee.live',
  'manual': 'Manuell',
  'bafu': 'BAFU Hydro',
  'wiewarm': 'wiewarm.ch',
};

export default function TemperatureOverview({ readings }: { readings: TemperatureReading[] }) {
  const [sortAsc, setSortAsc] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<DataSource | 'all'>('all');

  const filtered = useMemo(() => {
    const list = sourceFilter === 'all' ? readings : readings.filter((r) => r.source === sourceFilter);
    return [...list].sort((a, b) => {
      const ta = a.temperature ?? -99;
      const tb = b.temperature ?? -99;
      return sortAsc ? ta - tb : tb - ta;
    });
  }, [readings, sortAsc, sourceFilter]);

  const sources = ['all', ...Array.from(new Set(readings.map((r) => r.source)))] as (DataSource | 'all')[];

  return (
    <section id="temperaturen" className="section-padding">
      <div className="section-inner">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h2 className="section-title">Aktuelle Temperaturen</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            {readings.length} Messorte rund um den Bielersee
          </p>
        </div>

        {/* Controls */}
        <div className="filter-row">
          <Filter size={13} color="#64748b" style={{ flexShrink: 0 }} />
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderColor: sourceFilter === s ? '#2dd4c8' : 'rgba(255,255,255,0.1)',
                background: sourceFilter === s ? 'rgba(45,212,200,0.12)' : 'rgba(255,255,255,0.04)',
                color: sourceFilter === s ? '#2dd4c8' : '#94a3b8',
              }}
            >
              {SOURCE_LABELS[s]}
            </button>
          ))}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <ArrowUpDown size={12} />
            {sortAsc ? 'Kühlste' : 'Wärmste'}
          </button>
        </div>

        {/* Grid — responsive via CSS class */}
        <div className="temp-grid">
          {filtered.map((r) => (
            <TemperatureCard key={r.id} reading={r} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#475569', padding: '48px 0' }}>
            Keine Messorte für diese Auswahl.
          </div>
        )}
      </div>
    </section>
  );
}
