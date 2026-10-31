// ============================================================
// app/downloads/mpsc/[...slug]/route.js — On-Demand Fallback Handler for /downloads/mpsc/
// ExamUdaan.in | Ensures all legacy, direct, and archive links load seamlessly
// Eliminates Cloudflare 520 / 404 errors when files are streamed on-demand.
// ============================================================

import { NextResponse } from 'next/server'
import https from 'https'
import { obfuscateDocId } from '@/lib/docObfuscate.js'

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

async function fetchFromMpsc(id) {
  try {
    const res = await fetchFromMpscOnce(id, 14000)
    if (res) return res
  } catch (firstErr) {
    console.warn(`[downloads/mpsc] First fetch attempt for ${id} failed:`, firstErr.message)
  }
  return await fetchFromMpscOnce(id, 14000)
}

function extractIdFromSlug(slugArr) {
  if (!slugArr || !Array.isArray(slugArr)) return null
  const fullPath = slugArr.join('/')

  // Pattern 1: Folder or file starting with id: e.g. "13372_state-services..." or "13372_mpsc_document.pdf"
  const folderMatch = fullPath.match(/(?:^|\/)(\d{4,6})_[^\/]+/i)
  if (folderMatch) {
    const id = parseInt(folderMatch[1], 10)
    if (!isNaN(id) && id > 0) return id
  }

  // Pattern 2: Pure number segment
  for (const part of slugArr) {
    const num = parseInt(part, 10)
    if (!isNaN(num) && String(num) === part && num > 1000) {
      return num
    }
  }

  return null
}

export async function GET(request, { params }) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams?.slug || []
  const docId = extractIdFromSlug(slug)

  if (!docId) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  // Obfuscate ID and redirect to secure streamer so direct PDF files are never exposed
  const secureToken = obfuscateDocId(docId)
  return NextResponse.redirect(new URL(`/api/mpsc-pdf/${secureToken}`, request.url), 307)
}
