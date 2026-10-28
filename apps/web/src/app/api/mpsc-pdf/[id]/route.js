// ============================================================
// app/api/mpsc-pdf/[id]/route.js — On-Demand MPSC PDF Streamer & Cache
// Serves any of the 1,539 official MPSC question papers & answer keys.
// If already downloaded locally, streams instantly.
// If not yet downloaded, fetches from MPSC API, caches locally, and returns PDF.
// ============================================================

import { NextResponse } from 'next/server'
import https from 'https'
import { deobfuscateDocId } from '../../../../lib/docObfuscate.js'
import { pdfLimiter, getClientIp } from '../../../../lib/rateLimit.js'
import { checkHash } from '../../../../lib/hashVerify.js'

// Search for locally downloaded PDF matching id (including year subfolders)
function findLocalPdf(id) {
  try {
    const fsMod = eval("require('fs')")
    const pathMod = eval("require('path')")
    const baseDir = pathMod.join(process.cwd(), 'public', 'downloads', 'mpsc')
    if (!fsMod.existsSync(baseDir)) return null

    // 1. Check cached folder first (fastest direct lookup)
    const cachedDirect = pathMod.join(baseDir, 'cached', `${id}_mpsc_document.pdf`)
    if (fsMod.existsSync(cachedDirect)) return cachedDirect

    // 2. Check standard subdirectories
    const subDirs = ['cached', 'archive', 'question_papers', 'answer_keys', '']
    for (const sub of subDirs) {
      const targetDir = sub ? pathMod.join(baseDir, sub) : baseDir
      if (fsMod.existsSync(targetDir)) {
        const files = fsMod.readdirSync(targetDir)
        const match = files.find(f => typeof f === 'string' && f.startsWith(`${id}_`) && f.endsWith('.pdf'))
        if (match) return pathMod.join(targetDir, match)
      }
    }

    // 3. Scan nested archive folders (e.g. archive/group-b/2026/13629_.../question_paper.pdf)
    const archiveDir = pathMod.join(baseDir, 'archive')
    if (fsMod.existsSync(archiveDir)) {
      const queue = [archiveDir]
      while (queue.length > 0) {
        const current = queue.shift()
        const entries = fsMod.readdirSync(current, { withFileTypes: true })
        for (const entry of entries) {
          const fullPath = pathMod.join(current, entry.name)
          if (entry.isDirectory()) {
            if (entry.name.startsWith(`${id}_`)) {
              const subEntries = fsMod.readdirSync(fullPath)
              const pdfFile = subEntries.find(f => typeof f === 'string' && f.endsWith('.pdf'))
              if (pdfFile) return pathMod.join(fullPath, pdfFile)
            } else {
              queue.push(fullPath)
            }
          } else if (entry.isFile() && entry.name.startsWith(`${id}_`) && entry.name.endsWith('.pdf')) {
            return fullPath
          }
        }
      }
    }
  } catch {
    // Ignore runtime fs errors
  }
  return null
}

// Serve PDF buffer supporting HTTP 206 Partial Content (Byte Ranges) & explicit Content-Length
function servePdfBuffer(buffer, numId, request, isCached = true) {
  const totalLength = buffer.length
  const rangeHeader = request.headers.get('range')

  const baseHeaders = {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `inline; filename="mpsc_${numId}.pdf"`,
    'Accept-Ranges': 'bytes',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, noarchive',
    'Cache-Control': isCached
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
  }

  // Handle HTTP 206 Partial Content Range Requests from Chromium/Edge/Safari PDF viewers
  if (rangeHeader && rangeHeader.startsWith('bytes=')) {
    const parts = rangeHeader.replace('bytes=', '').trim().split('-')
    let start = parseInt(parts[0], 10)
    let end = parts[1] ? parseInt(parts[1], 10) : totalLength - 1

    if (isNaN(start)) {
      // Suffix range: bytes=-500 (requesting last 500 bytes)
      start = totalLength - parseInt(parts[1], 10)
      end = totalLength - 1
    }
    if (isNaN(end) || end >= totalLength) {
      end = totalLength - 1
    }

    if (start > end || start >= totalLength || start < 0) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          'Content-Range': `bytes */${totalLength}`,
          'Accept-Ranges': 'bytes'
        }
      })
    }

    const chunk = buffer.subarray(start, end + 1)
    return new NextResponse(chunk, {
      status: 206,
      headers: {
        ...baseHeaders,
        'Content-Range': `bytes ${start}-${end}/${totalLength}`,
        'Content-Length': String(chunk.length)
      }
    })
  }

  // Standard full file response with explicit Content-Length
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      ...baseHeaders,
      'Content-Length': String(totalLength)
    }
  })
}

// Fetch from official MPSC API with government authorization header
function fetchFromMpscOnce(id, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mpsc.gov.in',
      path: `/web/api/v1/downloadFile/english/${id}`,
      method: 'GET',
      rejectUnauthorized: false,
      timeout: timeoutMs,
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

// Resilient fetch with fast retry
async function fetchFromMpsc(id) {
  try {
    const res = await fetchFromMpscOnce(id, 14000)
    if (res) return res
  } catch (firstErr) {
    console.warn(`[mpsc-pdf] First fetch attempt for ${id} failed:`, firstErr.message)
  }
  // Fast second attempt
  return await fetchFromMpscOnce(id, 14000)
}

export async function GET(request, { params }) {
  const resolvedParams = await Promise.resolve(params)
  const idParam = resolvedParams?.id || ''

  // 1. Route-level defense-in-depth rate check (exempt internal Range sub-requests from rate limit hits)
  const isRangeRequest = Boolean(request.headers.get('range'))
  const clientIp = getClientIp(request)
  if (!isRangeRequest) {
    const rateCheck = pdfLimiter.check(clientIp)
    if (!rateCheck.allowed) {
      return pdfLimiter.create429Response(rateCheck, 'Document download rate limit exceeded. Please wait a moment before accessing more papers.')
    }
  }

  // 2. Deobfuscate ID (accepts doc_<token>_<sig> and safe legacy numeric with referer)
  const isObfuscated = typeof idParam === 'string' && idParam.startsWith('doc_')
  const numId = isObfuscated ? deobfuscateDocId(idParam) : parseInt(idParam, 10)

  if (!numId || isNaN(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid or expired document token' }, { status: 400 })
  }

  // 3. Anti-crawler check: Require internal study workspace referer, iframe fetch, or valid x-verify signature
  const referer = request.headers.get('referer') || ''
  const secFetchSite = request.headers.get('sec-fetch-site') || ''
  const secFetchDest = request.headers.get('sec-fetch-dest') || ''
  const hasInternalReferer = referer.includes('examudaan.in') || referer.includes('localhost') || referer.includes('127.0.0.1')
  const hasInternalFetch = secFetchSite === 'same-origin' || secFetchSite === 'same-site' || secFetchDest === 'iframe'
  const hasVerify = Boolean(request.headers.get('x-verify') || request.headers.get('X-Verify'))

  // Cryptographically signed obfuscated tokens and internal requests are verified authentic
  if (!isObfuscated && !hasInternalReferer && !hasInternalFetch && !hasVerify) {
    return NextResponse.json(
      { error: 'Direct document crawling is prohibited. Official question papers can only be viewed in the ExamUdaan study workspace.' },
      { status: 403 }
    )
  }

  if (hasVerify) {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    const hashErr = checkHash(request, query)
    if (hashErr) {
      return hashErr
    }
  }

  try {
    // 4. Check if cached on disk
    const localFile = findLocalPdf(numId)
    if (localFile) {
      const fsMod = eval("require('fs')")
      if (fsMod.existsSync(localFile)) {
        const fileBuffer = fsMod.readFileSync(localFile)
        return servePdfBuffer(fileBuffer, numId, request, true)
      }
    }

    // 5. Fetch live from MPSC API
    const pdfBuffer = await fetchFromMpsc(numId)
    if (!pdfBuffer || pdfBuffer.length < 100) {
      return NextResponse.json({ error: 'PDF not available on official MPSC portal' }, { status: 404 })
    }

    // 6. Cache to disk asynchronously for ultra-fast subsequent loads
    try {
      const fsMod = eval("require('fs')")
      const pathMod = eval("require('path')")
      const cacheDir = pathMod.join(process.cwd(), 'public', 'downloads', 'mpsc', 'cached')
      fsMod.mkdirSync(cacheDir, { recursive: true })
      fsMod.writeFileSync(pathMod.join(cacheDir, `${numId}_mpsc_document.pdf`), pdfBuffer)
    } catch (saveErr) {
      console.warn('Failed to cache PDF to disk:', saveErr.message)
    }

    return servePdfBuffer(pdfBuffer, numId, request, true)
  } catch (error) {
    console.error(`Error serving MPSC PDF ${idParam}:`, error)
    return NextResponse.json({ error: 'Failed to retrieve document from official portal' }, { status: 502 })
  }
}
