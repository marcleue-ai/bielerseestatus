'use client';
import { Camera } from 'lucide-react';
import type { WebcamEntry } from '@/lib/types';
import WebcamCard from './WebcamCard';

export default function WebcamGrid({ webcams }: { webcams: WebcamEntry[] }) {
  return (
    <section id="webcams" className="section-padding" style={{ background: 'rgba(13,32,68,0.3)' }}>
      <div className="section-inner">
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Camera size={20} color="#2dd4c8" />
            <h2 className="section-title">Webcams</h2>
          </div>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Live-Ansichten rund um den Bielersee · via windy.com
          </p>
        </div>

        <div className="cam-grid">
          {webcams.map((cam) => (
            <WebcamCard key={cam.id} cam={cam} />
          ))}
        </div>

        <p style={{ marginTop: 20, fontSize: 11, color: '#334155', textAlign: 'center' }}>
          Bilder via windy.com — alle Rechte beim jeweiligen Anbieter.
        </p>
      </div>
    </section>
  );
}
