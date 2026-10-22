// app/dev/syllabus-preview/[id]/page.js
// Permanent forwarder to clean production route: /mpsc-syllabus/[id]

'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function SyllabusPreviewRedirect({ params }) {
  const { id } = use(params)
  const router = useRouter()

  useEffect(() => {
    if (id) {
      router.replace(`/mpsc-syllabus/${id}`)
    }
  }, [id, router])

  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ fontSize: '16px', color: '#555', marginBottom: '12px' }}>
        Redirecting to official syllabus viewer…
      </p>
      <a
        href={`/mpsc-syllabus/${id}`}
        style={{ color: '#EA580C', fontWeight: 600, textDecoration: 'none', fontSize: '15px' }}
      >
        Click here to open MPSC Syllabus #{id} →
      </a>
    </div>
  )
}