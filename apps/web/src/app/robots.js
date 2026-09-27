// ============================================================
// app/robots.js — Robots.txt Generation
// ExamUdaan.in | Comprehensive Bot Security & Crawler Directives
// Served at /robots.txt automatically by Next.js
// ============================================================

const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
const BASE_URL = (rawBase && !rawBase.includes('localhost')) ? rawBase : 'https://examudaan.in'

export default function robots() {
  return {
    rules: [
      {
        // Allow legitimate search engine crawlers (Googlebot, Bingbot, etc.)
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/',
          '/_next/image/',
        ],
        disallow: [
          '/admin',
          '/admin/',
          '/dashboard',
          '/dashboard/',
          '/api/',
          '/auth-success',
        ],
      },
      {
        // Block scraping frameworks, headless scripts & abusive crawlers
        userAgent: [
          'Scrapy',
          'python-requests',
          'aiohttp',
          'httpx',
          'Go-http-client',
          'Java',
          'Wget',
          'curl',
          'SemrushBot',
          'AhrefsBot',
          'DotBot',
          'MJ12bot',
          'PetalBot',
          'MegaIndex',
          'Seekport',
          'ZoominfoBot',
          'Barkrowler',
          'BLEXBot',
          'DataForSeoBot',
          'SerpstatBot',
          'SeznamBot',
          'trendictionbot',
          'YaK',
          'Turnitin',
          'Screaming Frog SEO Spider',
        ],
        disallow: '/',
      },
      {
        // Block AI training crawlers & content harvesters
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'Google-Extended',
          'CCBot',
          'Bytespider',
          'Amazonbot',
          'FacebookBot',
          'cohere-ai',
          'omgili',
          'anthropic-ai',
          'PerplexityBot',
          'Diffbot',
          'ImagesiftBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
