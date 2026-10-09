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
import { deobfuscateDocId } from '../../../../lib/docObfuscate.js'
import { pdfLimiter, getClientIp } from '../../../../lib/rateLimit.js'

// Search for locally downloaded PDF matching id (including year subfolders)
function findLocalPdf(id) {
  const baseDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'downloads', 'mpsc')
  if (!fs.existsSync(baseDir)) return null

  try {
    const files = fs.readdirSync(baseDir, { recursive: true })
    const match = files.find(f => {
      const baseName = path.basename(String(f))
      return baseName.startsWith(`${id}_`) && baseName.endsWith('.pdf')
    })
    if (match) return path.join(baseDir, String(match))
  } catch (err) {
    // Fallback simple search if recursive option fails
    const subDirs = ['', 'cached', 'question_papers', 'answer_keys']
    for (const sub of subDirs) {
      const targetDir = sub ? path.join(baseDir, sub) : baseDir
      if (fs.existsSync(targetDir)) {
        try {
          const files = fs.readdirSync(targetDir)
          const match = files.find(f => f.startsWith(`${id}_`) && f.endsWith('.pdf'))
          if (match) return path.join(targetDir, match)
        } catch {
          // Continue
        }
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
  const idParam = resolvedParams?.id || ''

  // 1. Route-level defense-in-depth rate check
  const clientIp = getClientIp(request)
  const rateCheck = pdfLimiter.check(clientIp)
  if (!rateCheck.allowed) {
    return pdfLimiter.create429Response(rateCheck, 'Document download rate limit exceeded. Please wait a moment before accessing more papers.')
  }

  // 2. Deobfuscate ID (accepts doc_<token>_<sig> and safe legacy numeric with referer)
  const isObfuscated = typeof idParam === 'string' && idParam.startsWith('doc_')
  const numId = isObfuscated ? deobfuscateDocId(idParam) : parseInt(idParam, 10)

  if (!numId || isNaN(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid or expired document token' }, { status: 400 })
  }

  // 3. Anti-crawler check: If someone is hitting sequential raw numbers without obfuscated token and without internal referer, reject
  if (!isObfuscated) {
    const referer = request.headers.get('referer') || ''
    const hasInternalReferer = referer.includes('examudaan.in') || referer.includes('localhost')
    const hasVerify = Boolean(request.headers.get('x-verify') || request.headers.get('X-Verify'))
    if (!hasInternalReferer && !hasVerify) {
      return NextResponse.json(
        { error: 'Direct numeric crawling is disabled. Please access documents through the ExamUdaan study viewer.' },
        { status: 403 }
      )
    }
  }

  try {
    // 4. Check if cached on disk
    const localFile = findLocalPdf(numId)
    if (localFile && fs.existsSync(localFile)) {
      const fileBuffer = fs.readFileSync(localFile)
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="mpsc_${numId}.pdf"`,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'X-Content-Type-Options': 'nosniff',
          'X-Robots-Tag': 'noindex, noarchive',
        }
      })
    }

    // 5. Fetch live from MPSC API
    const pdfBuffer = await fetchFromMpsc(numId)
    if (!pdfBuffer || pdfBuffer.length < 100) {
      return NextResponse.json({ error: 'PDF not available on official MPSC portal' }, { status: 404 })
    }

    // 6. Cache to disk asynchronously for ultra-fast subsequent loads
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
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, noarchive',
      }
    })
  } catch (error) {
    console.error(`Error serving MPSC PDF ${idParam}:`, error)
    return NextResponse.json({ error: 'Failed to retrieve document from official portal' }, { status: 502 })
  }
}
