// ============================================================
// app/robots.js — Robots.txt Generation
// ExamUdaan | Next.js App Router robots.txt
// Served at /robots.txt automatically by Next.js
// ============================================================

const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
const BASE_URL = (rawBase && !rawBase.includes('localhost')) ? rawBase : 'https://examudaan.in'

export default function robots() {
  return {
    rules: [
      {
        // Allow all well-behaved crawlers
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',           // block admin panel from indexing
          '/dashboard',       // user dashboard — private
          '/api/',            // API routes — not for indexing
          '/_next/',          // Next.js internals
        ],
      },
      {
        // Block AI training bots (same as sarkarijobfind)
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'Bytespider', 'Amazonbot'],
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
