import type { DataSource } from '@/lib/types';

const SOURCE_CONFIG: Record<DataSource, { label: string; color: string }> = {
  'badi-info':     { label: 'badi-info.ch', color: '#3b82f6' },
  'alplakes':      { label: 'Eawag Alplakes', color: '#10b981' },
  'bielersee-live':{ label: 'bielersee.live', color: '#8b5cf6' },
  'manual':        { label: 'Manuell', color: '#64748b' },
  'bafu':          { label: 'BAFU Hydro', color: '#06b6d4' },
  'wiewarm':       { label: 'wiewarm.ch', color: '#f59e0b' },
};

export default function SourceBadge({ source }: { source: DataSource }) {
  const cfg = SOURCE_CONFIG[source];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 500,
        background: `${cfg.color}22`,
        color: cfg.color,
        border: `1px solid ${cfg.color}44`,
        letterSpacing: '0.02em',
      }}
    >
      {cfg.label}
    </span>
  );
}
