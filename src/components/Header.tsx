const NAV_LINKS = [
  { href: '#temperaturen', label: 'Temperaturen' },
  { href: '#webcams', label: 'Webcams' },
  { href: '#karte', label: 'Karte' },
];

export default function Header() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10,22,40,0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <style>{`
        #nav-toggle { position: fixed; opacity: 0; width: 1px; height: 1px; top: -100px; left: -100px; }

        .nav-hamburger {
          display: none;
          cursor: pointer;
          padding: 10px;
          margin: -10px;
          min-width: 44px;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .nav-mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(6,17,34,0.98);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .nav-mobile-menu a {
          display: block;
          padding: 16px 20px;
          font-size: 16px;
          color: #e2e8f0;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .close-icon { display: none; }

        @media (max-width: 767px) {
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: flex; }
        }
        @media (min-width: 768px) {
          .nav-hamburger   { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }

        /* CSS-only toggle via :has() — iOS Safari 16+, Chrome 105+, Firefox 121+ */
        header:has(#nav-toggle:checked) .nav-mobile-menu { display: flex; }
        header:has(#nav-toggle:checked) .hamburger-icon  { display: none; }
        header:has(#nav-toggle:checked) .close-icon      { display: block; }
      `}</style>

      <input type="checkbox" id="nav-toggle" />

      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 16px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2dd4c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>
            <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>
            <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>
          </svg>
          <span>Bielersee <span style={{ color: '#2dd4c8' }}>Status</span></span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#2dd4c8', background: 'rgba(45,212,200,0.12)', border: '1px solid rgba(45,212,200,0.3)', borderRadius: 4, padding: '2px 6px', lineHeight: 1 }}>BETA</span>
        </a>

        <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{ fontSize: 14, color: '#cbd5e1', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </nav>

        <label htmlFor="nav-toggle" className="nav-hamburger" aria-label="Menü">
          <span className="hamburger-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </span>
          <span className="close-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </span>
        </label>
      </div>

      <div className="nav-mobile-menu">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
      </div>
    </header>
  );
}
