// ============================================================
// app/layout.js — Root Layout (Next.js App Router)
// ExamUdaan.in — ExamUdaan Design System V4
// Saffron Primary + Cream Background
// ============================================================

import '../styles/globals.css'
import Navbar from '../components/Navbar'
import TickerBar from '../components/TickerBar'
import MobileBottomNav from '../components/MobileBottomNav'
import Footer from '../components/Footer'
import CookieConsent from '../components/CookieConsent'
import Script from 'next/script'
import { LanguageProvider } from '../context/LanguageContext'
import { Inter, Mukta } from 'next/font/google'

// Self-hosted Next.js Google Fonts — inlined CSS, zero render-blocking requests
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

const mukta = Mukta({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'devanagari'],
  display: 'swap',
  variable: '--font-mukta',
  fallback: ['sans-serif'],
})

// ── Analytics IDs (set in .env) ──
// GTM_ID:            GTM-NH9V94Q9 (set in NEXT_PUBLIC_GTM_ID)
// GA_MEASUREMENT_ID: G-PG16F0L21G (set in NEXT_PUBLIC_GA_MEASUREMENT_ID)
// CLARITY_ID:        yh913yaes0   (set in NEXT_PUBLIC_CLARITY_ID)
const GTM_ID            = process.env.NEXT_PUBLIC_GTM_ID            || 'GTM-NH9V94Q9'
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-PG16F0L21G'
const CLARITY_ID        = process.env.NEXT_PUBLIC_CLARITY_ID        || 'yh913yaes0'
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
const SITE_URL   = (rawSiteUrl && !rawSiteUrl.includes('localhost')) ? rawSiteUrl : 'https://examudaan.in'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ExamUdaan — Maharashtra Govt Job Alerts 2026',
    template: '%s | ExamUdaan',
  },
  description:
    'Get instant Maharashtra government job notifications for MPSC, Police Bharti, BMC, ZP, Talathi and more. Free WhatsApp alerts, exam dates, results, admit cards.',
  keywords: [
    'MPSC', 'Maharashtra govt jobs', 'police bharti', 'BMC recruitment',
    'ZP bharti', 'talathi bharti', 'sarkari naukri', 'government jobs',
    'exam udaan', 'maharashtra recruitment',
  ],
  openGraph: {
    title: 'ExamUdaan — Maharashtra Govt Job Alerts 2026',
    description:
      'Get instant Maharashtra government job notifications for MPSC, Police Bharti, BMC, ZP, Talathi and more. Free WhatsApp alerts, exam dates, results, admit cards.',
    siteName: 'ExamUdaan.in',
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/logo-light.png`, width: 512, height: 512, alt: 'ExamUdaan.in' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC',
    description:
      'Get instant Maharashtra government job notifications for MPSC, Police Bharti, BMC, ZP, Talathi and more. Free WhatsApp alerts, exam dates, results, admit cards.',
    images: [`${SITE_URL}/logo-light.png`],
  },
  // Google Search Console verification — set GOOGLE_SITE_VERIFICATION in .env
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
  icons: {
    icon: [
      { url: '/favicon-16x16.png',  sizes: '16x16',  type: 'image/png' },
      { url: '/favicon-32x32.png',  sizes: '32x32',  type: 'image/png' },
      { url: '/favicon-64x64.png',  sizes: '64x64',  type: 'image/png' },
      { url: '/favicon-128x128.png',sizes: '128x128',type: 'image/png' },
      { url: '/favicon-512x512.png',sizes: '512x512',type: 'image/png' },
      { url: '/favicon.svg',                         type: 'image/svg+xml' },
    ],
    apple: '/favicon-192x192.png',
    shortcut: '/favicon-32x32.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6A00',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mukta.variable}`}>
      <head>
        {/* Preconnect to fonts origins for high-speed handshake */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Material Symbols — asynchronous non-blocking stylesheet to eliminate render-blocking delay */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          as="style"
        />
        <link
          id="material-symbols-stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
          media="print"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
            rel="stylesheet"
          />
        </noscript>
        {/* Activate Material Symbols stylesheet on main thread without blocking initial paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var l = document.getElementById('material-symbols-stylesheet');
                if (l) {
                  if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(function() { l.media = 'all'; });
                  } else {
                    l.media = 'all';
                  }
                }
              })();
            `,
          }}
        />
        {/* Instant Theme Initializer — Zero Flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('eu_theme');
                  if (saved && saved !== 'default') {
                    document.documentElement.setAttribute('data-theme', saved);
                    if (saved === 'electric-aurora') {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>

      {/* ──────────────────────────────────────────────────────
          Google tag (gtag.js) — Google Analytics 4 (GA4)
          Measurement ID: G-PG16F0L21G
          Loads after hydration (afterInteractive)
      ────────────────────────────────────────────────────── */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {/* ──────────────────────────────────────────────────────
          Google Tag Manager — manages additional marketing tags
          Strategy: afterInteractive = loads after hydration, non-blocking.
          GTM ID: GTM-NH9V94Q9
      ────────────────────────────────────────────────────── */}
      {GTM_ID && (
        <Script id="gtm-head" strategy="afterInteractive">{`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      )}

      {/* ──────────────────────────────────────────────────────
          Microsoft Clarity — session recordings + heatmaps.
          Strategy: lazyOnload = loads during idle time to prevent TBT
          Clarity ID: yh913yaes0
      ────────────────────────────────────────────────────── */}
      {CLARITY_ID && (
        <Script id="clarity" strategy="lazyOnload">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;
            t.src='https://www.clarity.ms/tag/'+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,'clarity','script','${CLARITY_ID}');
        `}</Script>
      )}

      <body>
        {/* GTM noscript fallback — required by GTM for non-JS environments */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <LanguageProvider>
          {/* Live Updates Ticker — saffron bar */}
          <TickerBar />

          {/* Sticky top navbar */}
          <Navbar />

          {/* Page content */}
          <main>{children}</main>

          {/* Desktop footer */}
          <Footer />

          {/* Mobile fixed bottom nav */}
          <MobileBottomNav />

          {/* Cookie consent banner — DPDP Act 2023 requirement.
              Appears on first visit, stores choice in localStorage. */}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  )
}
