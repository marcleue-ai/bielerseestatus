'use client';
import { useState } from 'react';
import { MapPin, ExternalLink, Camera } from 'lucide-react';
import type { WebcamEntry } from '@/lib/types';

export default function WebcamCard({ cam }: { cam: WebcamEntry }) {
  const [imgFailed, setImgFailed] = useState(false);

  const timeLabel = cam.imageUpdatedAt
    ? new Date(cam.imageUpdatedAt).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
    : null;

  const imageUrl = cam.previewImageUrl ?? null;

  return (
    <article
      className="glass"
      style={{ overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      <div style={{ position: 'relative', height: 'clamp(160px, 22vw, 220px)', background: '#0d2044', overflow: 'hidden' }}>
        {imageUrl && !imgFailed ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`Webcam ${cam.name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, transparent 60%)' }} />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10 }}>
            <Camera size={36} color="#1e3a5f" />
            <span style={{ fontSize: 11, color: '#334155' }}>Kein Bild verfügbar</span>
          </div>
        )}

        {timeLabel && (
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(10,22,40,0.75)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11, color: '#94a3b8' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
            {timeLabel}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 18px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{cam.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 12, marginBottom: 10 }}>
          <MapPin size={11} />
          {cam.location}
        </div>

        {cam.description && (
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14, lineHeight: 1.5 }}>{cam.description}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#475569' }}>via {cam.provider}</span>
          <a
            href={cam.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, background: 'rgba(45,212,200,0.1)', border: '1px solid rgba(45,212,200,0.25)', color: '#2dd4c8', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}
          >
            Öffnen
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </article>
  );
}
