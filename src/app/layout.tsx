import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bielerseestatus.ch';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: 'Bielersee Status – Wassertemperaturen & Webcams',
  description:
    'Aktuelle Seetemperaturen, Wasserqualität und Webcams rund um den Bielersee. 8 Messpunkte – Biel, Nidau, Erlach, La Neuveville und mehr.',
  keywords: ['Bielersee', 'Wassertemperatur', 'Seetemperatur', 'Webcam', 'Biel', 'Bieler See', 'Badewetter'],
  alternates: {
    canonical: BASE,
  },
  openGraph: {
    title: 'Bielersee Status – Wassertemperaturen & Webcams',
    description: 'Aktuelle Seetemperaturen & Webcams rund um den Bielersee. 8 Messpunkte in Echtzeit.',
    type: 'website',
    locale: 'de_CH',
    url: BASE,
    siteName: 'Bielersee Status',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bielersee Status – Wassertemperaturen & Webcams',
    description: 'Aktuelle Seetemperaturen & Webcams rund um den Bielersee.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Bielersee Status',
      description: 'Aktuelle Wassertemperaturen und Webcams rund um den Bielersee',
      inLanguage: 'de-CH',
    },
    {
      '@type': 'Dataset',
      '@id': `${BASE}/#dataset`,
      name: 'Bielersee Wassertemperaturen',
      description: 'Aktuelle Wassertemperaturen an 8 Messpunkten rund um den Bielersee, bezogen von Eawag Alplakes',
      url: BASE,
      keywords: ['Bielersee', 'Wassertemperatur', 'Seetemperatur', 'Bieler See'],
      license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: {
        '@type': 'Organization',
        name: 'Eawag Alplakes',
        url: 'https://www.alplakes.eawag.ch',
      },
      spatialCoverage: {
        '@type': 'Place',
        name: 'Bielersee',
        geo: {
          '@type': 'GeoShape',
          box: '46.9985 7.0980 47.1368 7.2467',
        },
      },
      temporalCoverage: '../..',
      measurementTechnique: 'Numerische Simulation (Delft3D-flow)',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* Consent Mode v2 – Standardwerte vor GTM setzen */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
              dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
            `,
          }}
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5PBBRXP6"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* GTM noscript – für Nutzer ohne JavaScript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5PBBRXP6"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
