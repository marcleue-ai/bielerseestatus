import { Waves, ExternalLink } from 'lucide-react';

const SOURCES = [
  { name: 'Eawag Alplakes', url: 'https://www.alplakes.eawag.ch/biel', desc: 'Seesimulationen und Temperaturdaten' },
  { name: 'BAFU Hydrodaten', url: 'https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/2029', desc: 'Messdaten Bundesamt für Umwelt' },
  { name: 'meteoblue', url: 'https://www.meteoblue.com/de/wetter/webcams/magglingen_schweiz_2659791', desc: 'Webcams rund um den Bielersee' },
  { name: 'windy.com', url: 'https://www.windy.com', desc: 'Live-Webcam-Bilder' },
  { name: 'wiewarm.ch', url: 'https://www.wiewarm.ch/bad/Parkschwimmbad_Lyss', desc: 'Badetemperaturen Parkschwimmbad Lyss' },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(6,17,34,0.95)',
        padding: '48px 16px 32px',
      }}
    >
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 36 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Waves size={20} color="#2dd4c8" />
              <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 16 }}>
                Bielersee <span style={{ color: '#2dd4c8' }}>Status</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
              Aktuelle Wassertemperaturen und Webcams rund um den Bielersee. Inoffizielle Informationsseite.
            </p>
          </div>

          {/* Sources */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Datenquellen
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SOURCES.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2dd4c8', fontSize: 13, fontWeight: 500, textDecoration: 'none', marginBottom: 2 }}
                  >
                    {s.name}
                    <ExternalLink size={10} />
                  </a>
                  <span style={{ fontSize: 11, color: '#374151' }}>{s.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Hinweise
            </h3>
            <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
              Alle Daten stammen von externen Quellen. Angaben ohne Gewähr.
              Diese Website hat keine offizielle Verbindung zu den genannten Datenanbietern.
            </p>
            <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, marginTop: 8 }}>
              Karten: © OpenStreetMap contributors, © CARTO
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#2dd4c8', background: 'rgba(45,212,200,0.12)', border: '1px solid rgba(45,212,200,0.3)', borderRadius: 4, padding: '2px 6px' }}>BETA</span>
            <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>Diese Website befindet sich in der Beta-Phase.</span>
          </div>
          <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, maxWidth: 680 }}>
            Während der Entwicklung kann es zu Fehlern, unvollständigen Angaben oder vorübergehenden Ausfällen kommen.
            Alle Daten stammen von externen Quellen und werden ohne Gewähr bereitgestellt. bielerseestatus.ch übernimmt
            keine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der angezeigten Informationen.
            Für sicherheitsrelevante Entscheide rund um Wasseraktivitäten stets offizielle Quellen beiziehen.
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#1e293b' }}>
            © {new Date().getFullYear()} Bielersee Status
          </span>
          <span style={{ fontSize: 12, color: '#1e293b' }}>
            Keine Gewähr für die Richtigkeit der Angaben
          </span>
        </div>
      </div>
    </footer>
  );
}
