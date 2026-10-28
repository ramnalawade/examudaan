// ============================================================
// app/api/admin/warmup-pyq/route.js — On-Demand PYQ Cache Warmer
// ExamUdaan.in | Pre-caches official PDFs to disk and warms edge cache
// ============================================================

import { NextResponse } from 'next/server'
import https from 'https'
import manifest from '@/lib/mpscPyqArchiveManifest.json'

function downloadFromMpsc(id) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'mpsc.gov.in',
      path: `/web/api/v1/downloadFile/english/${id}`,
      method: 'GET',
      rejectUnauthorized: false,
      timeout: 15000,
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
            resolve(Buffer.from(json.pdfData, 'base64'))
          } else {
            resolve(null)
          }
        } catch {
          if (data.startsWith('%PDF')) {
            resolve(Buffer.from(data, 'binary'))
          } else {
            resolve(null)
          }
        }
      })
    })

    req.on('error', () => resolve(null))
    req.on('timeout', () => {
      req.destroy()
      resolve(null)
    })
  })
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year') || null
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)
  const specificIds = searchParams.get('ids')

  const items = manifest.items || []
  let targets = []

  if (specificIds) {
    const idList = specificIds.split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean)
    targets = items.filter(p => idList.includes(p.id))
  } else if (year) {
    targets = items.filter(p => String(p.examYear) === String(year)).slice(0, limit)
  } else {
    // Top recent papers
    targets = [...items].sort((a, b) => (b.examYear || 0) - (a.examYear || 0)).slice(0, limit)
  }

  const fsMod = eval("require('fs')")
  const pathMod = eval("require('path')")
  const cacheDir = pathMod.join(process.cwd(), 'public', 'downloads', 'mpsc', 'cached')
  fsMod.mkdirSync(cacheDir, { recursive: true })

  const results = {
    totalRequested: targets.length,
    alreadyCached: 0,
    newlyCached: 0,
    failed: 0,
    cachedItems: []
  }

  for (const item of targets) {
    const id = item.id
    if (!id) continue

    const destFile = pathMod.join(cacheDir, `${id}_mpsc_document.pdf`)
    if (fsMod.existsSync(destFile) && fsMod.statSync(destFile).size > 1000) {
      results.alreadyCached++
      results.cachedItems.push({ id, year: item.examYear, status: 'already_cached', sizeBytes: fsMod.statSync(destFile).size })
    } else {
      const buf = await downloadFromMpsc(id)
      if (buf && buf.length > 1000) {
        fsMod.writeFileSync(destFile, buf)
        results.newlyCached++
        results.cachedItems.push({ id, year: item.examYear, status: 'newly_cached', sizeBytes: buf.length })
      } else {
        results.failed++
        results.cachedItems.push({ id, year: item.examYear, status: 'failed' })
      }
      // Brief jitter pause
      await new Promise(r => setTimeout(r, 200))
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    summary: results
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  })
}
