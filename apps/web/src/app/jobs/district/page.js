// ============================================================
// app/jobs/district/page.js — District Directory (Index)
//
// Lists all Maharashtra districts with links to their
// hyperlocal job pages. Also serves as an internal link hub
// that ensures crawlers discover all district pages.
// ============================================================

import Link from 'next/link'

export const metadata = {
  title: 'District-wise Maharashtra Govt Jobs 2026',
  description: 'Browse government jobs by Maharashtra district. Pune, Nagpur, Nashik, Mumbai, Thane, Kolhapur, Solapur, Amravati — hyperlocal listings updated daily.',
  alternates: {
    canonical: 'https://examudaan.in/jobs/district',
  },
}

// District list (must match the catalogue in [district]/page.js)
const DISTRICTS = [
  { slug: 'pune',        name: 'Pune',                    nameMr: 'पुणे',           region: 'Western Maharashtra',        popular: ['MPSC', 'PMC', 'Police Bharti', 'Talathi'] },
  { slug: 'mumbai',      name: 'Mumbai',                  nameMr: 'मुंबई',           region: 'Mumbai Metropolitan Region', popular: ['BMC', 'Mumbai Police', 'RBI', 'IBPS'] },
  { slug: 'nagpur',      name: 'Nagpur',                  nameMr: 'नागपूर',          region: 'Vidarbha',                   popular: ['AIIMS Nagpur', 'NMC', 'MPSC', 'ZP'] },
  { slug: 'nashik',      name: 'Nashik',                  nameMr: 'नाशिक',           region: 'Northern Maharashtra',       popular: ['NMC Nashik', 'Police Bharti', 'ZP'] },
  { slug: 'thane',       name: 'Thane',                   nameMr: 'ठाणे',            region: 'Konkan',                     popular: ['Thane Police', 'KRCL', 'TMC'] },
  { slug: 'aurangabad',  name: 'Chh. Sambhajinagar',      nameMr: 'छत्रपती संभाजीनगर', region: 'Marathwada',              popular: ['ZP', 'Police Bharti', 'Talathi'] },
  { slug: 'kolhapur',    name: 'Kolhapur',                nameMr: 'कोल्हापूर',        region: 'Western Maharashtra (S)',    popular: ['KMC', 'Police Bharti', 'ZP'] },
  { slug: 'solapur',     name: 'Solapur',                 nameMr: 'सोलापूर',          region: 'Western Maharashtra',        popular: ['Police Bharti', 'Talathi', 'ZP'] },
  { slug: 'amravati',    name: 'Amravati',                nameMr: 'अमरावती',          region: 'Vidarbha',                   popular: ['ZP Amravati', 'Police Bharti', 'Talathi'] },
  { slug: 'nanded',      name: 'Nanded',                  nameMr: 'नांदेड',           region: 'Marathwada',                 popular: ['ZP Nanded', 'Police Bharti', 'Talathi'] },
]

export default function DistrictIndexPage() {
  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 80 }}>

      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span style={{ margin: '0 6px', color: 'var(--outline-variant)' }}>/</span>
        <Link href="/jobs">Jobs</Link>
        <span style={{ margin: '0 6px', color: 'var(--outline-variant)' }}>/</span>
        <span>District-wise</span>
      </nav>

      {/* Page header */}
      <div style={{ margin: '24px 0' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, color: 'var(--on-surface)', margin: '0 0 8px' }}>
          Maharashtra District-wise Government Jobs 2026
        </h1>
        <p style={{ fontSize: 15, color: '#57534e', margin: 0, maxWidth: 640 }}>
          Find government job notifications specific to your district. All listings are scraped directly from official government portals — updated every 6 hours.
        </p>
      </div>

      {/* District cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
        marginTop: 8,
      }}>
        {DISTRICTS.map(district => (
          <Link
            key={district.slug}
            href={`/jobs/district/${district.slug}`}
            style={{
              display: 'block',
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 14,
              padding: '20px',
              textDecoration: 'none',
              transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.15s',
            }}
            className="district-index-card"
          >
            {/* District name */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--on-surface)', margin: '0 0 2px' }}>
                  {district.name}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--primary)', margin: '0 0 4px', fontWeight: 600 }}>
                  {district.nameMr}
                </p>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--primary)', flexShrink: 0 }}>
                location_on
              </span>
            </div>

            {/* Region */}
            <p style={{ fontSize: 12, color: '#78716c', margin: '4px 0 10px' }}>
              {district.region}
            </p>

            {/* Popular exams */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {district.popular.map(exam => (
                <span key={exam} className="info-pill" style={{ fontSize: 11 }}>
                  {exam}
                </span>
              ))}
            </div>

            {/* Arrow CTA */}
            <div style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--primary)',
            }}>
              View {district.name} Jobs
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Back link */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/jobs" className="btn-outline">
          ← View All Government Jobs (All India)
        </Link>
      </div>
    </div>
  )
}
