import { Clock } from 'lucide-react';

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.floor(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  return `vor ${Math.floor(h / 24)} Tagen`;
}

export default function UpdateStatus({ updatedAt, size = 'sm' }: { updatedAt: string; size?: 'sm' | 'xs' }) {
  const text = formatRelative(updatedAt);
  const isSmall = size === 'xs';
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: isSmall ? 11 : 12 }}
      title={new Date(updatedAt).toLocaleString('de-CH')}
    >
      <Clock size={isSmall ? 10 : 12} />
      {text}
    </span>
  );
}
