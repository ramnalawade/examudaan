// ============================================================
// app/layout.js — Root Layout (Next.js App Router)
// ExamUdaan.in — ExamUdaan Design System V4
// Saffron Primary + Cream Background
// ============================================================

import '../styles/globals.css'
import NavigationChrome from '../components/NavigationChrome'
import Script from 'next/script'
import { LanguageProvider } from '../context/LanguageContext'
import { Inter, Mukta, Outfit } from 'next/font/google'

// Self-hosted Next.js Google Fonts — inlined CSS, zero render-blocking requests
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

const mukta = Mukta({
  weight: ['400', '600', '700'],
  subsets: ['latin', 'devanagari'],
  display: 'swap',
  variable: '--font-mukta',
  fallback: ['sans-serif'],
  preload: false,
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
    default: "ExamUdaan - Maharashtra's Premier Govt Job Alerts & Exam Prep Platform",
    template: '%s | ExamUdaan',
  },
  description:
    "ExamUdaan is Maharashtra's #1 competitive exam portal for MPSC, Police Bharti, BMC, ZP & Talathi. Offering real-time job alerts, free CBT mock tests, authentic previous year question papers & AI study tools.",
  keywords: [
    'ExamUdaan', 'Exam Udaan', 'MPSC', 'Maharashtra govt jobs', 'police bharti', 'BMC recruitment',
    'ZP bharti', 'talathi bharti', 'sarkari naukri', 'government jobs', 'mock tests', 'previous year question papers',
    'examudaan', 'maharashtra recruitment'
  ],
  openGraph: {
    title: "ExamUdaan - Maharashtra's Premier Govt Job Alerts & Exam Prep Platform",
    description:
      "ExamUdaan is Maharashtra's #1 competitive exam portal for MPSC, Police Bharti, BMC, ZP & Talathi. Real-time job alerts, free CBT mock tests, authentic previous year question papers & AI study tools.",
    siteName: 'ExamUdaan',
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/logo-light.png`, width: 512, height: 512, alt: 'ExamUdaan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ExamUdaan - Maharashtra's Premier Govt Job Alerts & Exam Prep Platform",
    description:
      "ExamUdaan is Maharashtra's #1 competitive exam portal for MPSC, Police Bharti, BMC, ZP & Talathi. Real-time job alerts, CBT mock tests & PYQ papers.",
    images: [`${SITE_URL}/logo-light.png`],
  },
  // Google Search Console verification — set GOOGLE_SITE_VERIFICATION in .env
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
  icons: {
    icon: [
      { url: '/favicon-32x32.png',  sizes: '32x32',  type: 'image/png' },
      { url: '/favicon-16x16.png',  sizes: '16x16',  type: 'image/png' },
      { url: '/favicon.svg',                         type: 'image/svg+xml' },
    ],
    apple: '/favicon-192x192.png',
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
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${mukta.variable}`}>
      <head>
        {/* Preconnect to fonts origins for high-speed handshake */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="preconnect" href="https://c.clarity.ms" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://c.clarity.ms" />
        {/* Material Symbols font stylesheet — display=swap ensures non-blocking font loading */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
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

      <body>
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
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}

        {/* ──────────────────────────────────────────────────────
            Google Tag Manager — manages additional marketing tags
            Strategy: afterInteractive for reliable loading post hydration
            GTM ID: GTM-NH9V94Q9
        ────────────────────────────────────────────────────── */}
        {GTM_ID && (
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
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
              `,
            }}
          />
        )}

        {/* ──────────────────────────────────────────────────────
            Microsoft Clarity — session recordings + heatmaps.
            Strategy: afterInteractive — required for recording sessions from early arrival.
            lazyOnload was preventing recordings from being captured before bounce/navigation.
            Clarity ID: yh913yaes0
        ────────────────────────────────────────────────────── */}
        {CLARITY_ID && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;
                  t.src='https://www.clarity.ms/tag/'+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window,document,'clarity','script','${CLARITY_ID}');
              `,
            }}
          />
        )}

        {/* GTM noscript fallback — required by GTM for non-JS environments */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            className="gtm-noscript-frame"
          />
        </noscript>

        <LanguageProvider>
          <NavigationChrome>{children}</NavigationChrome>
        </LanguageProvider>
      </body>
    </html>
  )
}
