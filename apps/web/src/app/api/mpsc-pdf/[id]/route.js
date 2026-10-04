// ============================================================
// app/api/mpsc-pdf/[id]/route.js — On-Demand MPSC PDF Streamer & Cache
// Serves any of the 1,539 official MPSC question papers & answer keys.
// If already downloaded locally, streams instantly.
// If not yet downloaded, fetches from MPSC API, caches locally, and returns PDF.
// ============================================================

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import https from 'https'

// Search for locally downloaded PDF matching id
function findLocalPdf(id) {
  const baseDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'downloads', 'mpsc')
  if (!fs.existsSync(baseDir)) return null

  const subDirs = ['', 'cached', 'question_papers', 'answer_keys']
  for (const sub of subDirs) {
    const targetDir = sub ? path.join(baseDir, sub) : baseDir
    if (fs.existsSync(targetDir)) {
      try {
        const files = fs.readdirSync(targetDir)
        const match = files.find(f => f.startsWith(`${id}_`) && f.endsWith('.pdf'))
        if (match) return path.join(targetDir, match)
      } catch {
        // Continue searching other directories
      }
    }
  }
  return null
}

// Fetch from official MPSC API with government authorization header
function fetchFromMpsc(id) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mpsc.gov.in',
      path: `/web/api/v1/downloadFile/english/${id}`,
      method: 'GET',
      rejectUnauthorized: false,
      timeout: 30000,
      headers: {
        'Authorization': '|#|#53960616',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Referer': 'https://mpsc.gov.in/prev_que_papers/9',
        'Accept': 'application/json, text/plain, */*'
      }
    }

    const req = https.get(options, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json.pdfData) {
            const buffer = Buffer.from(json.pdfData, 'base64')
            resolve(buffer)
          } else {
            resolve(null)
          }
        } catch (err) {
          // Check if raw PDF stream was returned
          if (data.startsWith('%PDF')) {
            resolve(Buffer.from(data, 'binary'))
          } else {
            reject(new Error(`Failed to parse response: ${err.message}`))
          }
        }
      })
    })

    req.on('error', (err) => reject(err))
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('MPSC API connection timed out'))
    })
  })
}

export async function GET(request, { params }) {
  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams?.id
  const numId = parseInt(id, 10)

  if (isNaN(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
  }

  try {
    // 1. Check if cached on disk
    const localFile = findLocalPdf(numId)
    if (localFile && fs.existsSync(localFile)) {
      const fileBuffer = fs.readFileSync(localFile)
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="mpsc_${numId}.pdf"`,
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      })
    }

    // 2. Fetch live from MPSC API
    const pdfBuffer = await fetchFromMpsc(numId)
    if (!pdfBuffer || pdfBuffer.length < 100) {
      return NextResponse.json({ error: 'PDF not available on official MPSC portal' }, { status: 404 })
    }

    // 3. Cache to disk asynchronously for ultra-fast subsequent loads
    try {
      const cacheDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'downloads', 'mpsc', 'cached')
      fs.mkdirSync(cacheDir, { recursive: true })
      fs.writeFileSync(path.join(cacheDir, `${numId}_mpsc_document.pdf`), pdfBuffer)
    } catch (saveErr) {
      console.warn('Failed to cache PDF to disk:', saveErr.message)
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="mpsc_${numId}.pdf"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      }
    })
  } catch (error) {
    console.error(`Error serving MPSC PDF ${id}:`, error)
    return NextResponse.json({ error: 'Failed to retrieve document from official portal' }, { status: 502 })
  }
}
