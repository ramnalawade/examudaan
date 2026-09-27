// ============================================================
// app/api/pyq/route.js — 15-Year Solved PYQ Question Bank API
// ExamUdaan.in — Direct PostgreSQL queries with multi-token search
// ============================================================

import { NextResponse } from 'next/server'
import { query, queryOne, isConfigured } from '@/lib/pgdb'
import { ok, serverError, badRequest } from '@/lib/apiResponse'
import pyqSeedData from '@/lib/pyqSeed.json'

export const dynamic = 'force-dynamic'

let _dbConfigured = null
let _lastCheckTime = 0
let _tableChecked = false
let _expectedSeedCount = 0 // track if seed file changed
const DB_CHECK_INTERVAL = 30000 // 30s check interval

async function checkDb() {
  const now = Date.now()
  if (_dbConfigured !== null && now - _lastCheckTime < DB_CHECK_INTERVAL) {
    return _dbConfigured
  }
  _lastCheckTime = now
  try {
    _dbConfigured = await isConfigured()
  } catch {
    _dbConfigured = false
  }
  return _dbConfigured
}

/**
 * Ensure pyq_questions table exists and is populated with seed data
 */
async function ensurePyqTable() {
  const isDbLive = await checkDb()
  if (!isDbLive) return false
  // Skip if we already seeded this session AND seed count hasn't changed
  if (_tableChecked && _expectedSeedCount === pyqSeedData.length) return true

  try {
    // 1. Create table & indexes if not existing
    await query(`
      CREATE TABLE IF NOT EXISTS pyq_questions (
        id              INT PRIMARY KEY,
        topic           TEXT NOT NULL,
        subject         TEXT NOT NULL,
        exam            TEXT NOT NULL,
        year            INT NOT NULL,
        question        TEXT NOT NULL,
        options         JSONB NOT NULL,
        correct         CHAR(1) NOT NULL CHECK (correct IN ('A','B','C','D')),
        explanation     TEXT,
        tags            TEXT[] DEFAULT '{}',
        difficulty      TEXT DEFAULT 'Medium',
        created_at      TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_pyq_subject ON pyq_questions(subject);
      CREATE INDEX IF NOT EXISTS idx_pyq_exam ON pyq_questions(exam);
      CREATE INDEX IF NOT EXISTS idx_pyq_year ON pyq_questions(year DESC);
      CREATE INDEX IF NOT EXISTS idx_pyq_tags ON pyq_questions USING GIN(tags);
    `)

    // 2. Check if table has data - upsert whenever seed has more questions than what's in DB
    const countRes = await query(`SELECT COUNT(*)::int AS cnt FROM pyq_questions`)
    const currentCount = countRes[0]?.cnt || 0

    if (currentCount < pyqSeedData.length && Array.isArray(pyqSeedData) && pyqSeedData.length > 0) {
      console.log(`[pyq api] DB has ${currentCount}, seed has ${pyqSeedData.length}. Upserting ${pyqSeedData.length - currentCount} new questions...`)
      
      // Batch upsert in chunks of 50

      const chunkSize = 50
      for (let i = 0; i < pyqSeedData.length; i += chunkSize) {
        const chunk = pyqSeedData.slice(i, i + chunkSize)
        const valPlaceholders = []
        const params = []
        let paramIdx = 1

        chunk.forEach((item) => {
          valPlaceholders.push(
            `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}::jsonb, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}::text[])`
          )
          params.push(
            item.id,
            item.topic,
            item.subject,
            item.exam,
            item.year,
            item.question,
            JSON.stringify(item.options || {}),
            item.correct,
            item.explanation,
            item.tags || []
          )
        })

        const insertSql = `
          INSERT INTO pyq_questions (id, topic, subject, exam, year, question, options, correct, explanation, tags)
          VALUES ${valPlaceholders.join(', ')}
          ON CONFLICT (id) DO UPDATE SET
            topic = EXCLUDED.topic,
            subject = EXCLUDED.subject,
            exam = EXCLUDED.exam,
            year = EXCLUDED.year,
            question = EXCLUDED.question,
            options = EXCLUDED.options,
            correct = EXCLUDED.correct,
            explanation = EXCLUDED.explanation,
            tags = EXCLUDED.tags;
        `
        await query(insertSql, params)
      }
      console.log(`[pyq api] Successfully seeded all questions into database.`)
    }

    _tableChecked = true
    _expectedSeedCount = pyqSeedData.length
    return true
  } catch (err) {
    console.warn('[pyq api] PostgreSQL table init error, falling back:', err.message)
    _dbConfigured = false
    return false
  }
}

/**
 * Filter questions in-memory from pyqSeedData when DB is unreachable (offline/local dev fallback)
 */
function searchMemoryFallback(q, subject, exam, year, limit, offset) {
  let list = pyqSeedData

  if (subject && subject.toLowerCase() !== 'all') {
    list = list.filter((item) => item.subject.toLowerCase() === subject.toLowerCase())
  }
  if (exam && exam.toLowerCase() !== 'all') {
    list = list.filter((item) => item.exam.toLowerCase().includes(exam.toLowerCase()))
  }
  if (year) {
    list = list.filter((item) => item.year === parseInt(year, 10))
  }

  if (q && q.trim()) {
    const rawTokens = q
      .toLowerCase()
      .split(/[,/;|&+\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2 && !['and', 'the', 'for', 'act', 'व', 'आणि', 'किंवा', 'in', 'of'].includes(t))

    list = list.filter((item) => {
      const qText = (item.question || '').toLowerCase()
      const tText = (item.topic || '').toLowerCase()
      const sText = (item.subject || '').toLowerCase()
      const expText = (item.explanation || '').toLowerCase()
      const exText = (item.exam || '').toLowerCase()
      const tags = (item.tags || []).join(' ').toLowerCase()

      if (rawTokens.length === 0) {
        const fullQ = q.toLowerCase().trim()
        return (
          qText.includes(fullQ) ||
          tText.includes(fullQ) ||
          sText.includes(fullQ) ||
          expText.includes(fullQ) ||
          exText.includes(fullQ) ||
          tags.includes(fullQ)
        )
      }

      return rawTokens.some(
        (token) =>
          qText.includes(token) ||
          tText.includes(token) ||
          sText.includes(token) ||
          expText.includes(token) ||
          exText.includes(token) ||
          tags.includes(token)
      )
    })
  }

  // Calculate subject counts across all filtered or unfiltered items
  const subjectCounts = { All: pyqSeedData.length }
  pyqSeedData.forEach((item) => {
    subjectCounts[item.subject] = (subjectCounts[item.subject] || 0) + 1
  })

  const total = list.length
  const paginated = list.slice(offset, offset + limit)

  return {
    questions: paginated,
    total,
    pageCount: Math.ceil(total / limit),
    offset,
    limit,
    hasMore: offset + limit < total,
    subjectCounts,
    source: 'seed_fallback',
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const q = (searchParams.get('q') || '').trim()
    const subject = (searchParams.get('subject') || 'All').trim()
    const exam = (searchParams.get('exam') || 'All').trim()
    const year = searchParams.get('year')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10), 1), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)

    // Try PostgreSQL
    const dbReady = await ensurePyqTable()

    if (dbReady) {
      try {
        // 1. Single question lookup by ID
        if (id) {
          const single = await queryOne(
            `SELECT id, topic, subject, exam, year, question, options, correct, explanation, tags, difficulty 
             FROM pyq_questions 
             WHERE id = $1`,
            [parseInt(id, 10)]
          )
          if (!single) return ok(null, 'Question not found')
          return ok(single)
        }

        // 2. Build parameterized query
        const conditions = []
        const params = []
        let pIndex = 1

        if (subject && subject.toLowerCase() !== 'all') {
          conditions.push(`LOWER(subject) = LOWER($${pIndex++})`)
          params.push(subject)
        }

        if (exam && exam.toLowerCase() !== 'all') {
          conditions.push(`exam ILIKE $${pIndex++}`)
          params.push(`%${exam}%`)
        }

        if (year && !isNaN(parseInt(year, 10))) {
          conditions.push(`year = $${pIndex++}`)
          params.push(parseInt(year, 10))
        }

        // Multi-token keyword search
        if (q) {
          const rawTokens = q
            .toLowerCase()
            .split(/[,/;|&+\s]+/)
            .map((t) => t.trim())
            .filter((t) => t.length >= 2 && !['and', 'the', 'for', 'act', 'व', 'आणि', 'किंवा', 'in', 'of'].includes(t))

          if (rawTokens.length > 0) {
            const tokenConditions = []
            for (const token of rawTokens) {
              const p = pIndex++
              params.push(`%${token}%`)
              tokenConditions.push(`(
                question ILIKE $${p} OR 
                topic ILIKE $${p} OR 
                subject ILIKE $${p} OR 
                explanation ILIKE $${p} OR 
                exam ILIKE $${p} OR 
                array_to_string(tags, ' ') ILIKE $${p}
              )`)
            }
            conditions.push(`(${tokenConditions.join(' OR ')})`)
          } else {
            const p = pIndex++
            params.push(`%${q}%`)
            conditions.push(`(
              question ILIKE $${p} OR 
              topic ILIKE $${p} OR 
              subject ILIKE $${p} OR 
              explanation ILIKE $${p} OR 
              exam ILIKE $${p} OR 
              array_to_string(tags, ' ') ILIKE $${p}
            )`)
          }
        }

        const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        // Total count matching filters
        const countQuery = `SELECT COUNT(*)::int AS cnt FROM pyq_questions ${whereSql}`
        const countRows = await query(countQuery, params)
        const total = countRows[0]?.cnt || 0

        // Fetch paginated data
        const limitParam = pIndex++
        const offsetParam = pIndex++
        const dataQuery = `
          SELECT id, topic, subject, exam, year, question, options, correct, explanation, tags, difficulty 
          FROM pyq_questions 
          ${whereSql}
          ORDER BY id ASC
          LIMIT $${limitParam} OFFSET $${offsetParam}
        `
        const rows = await query(dataQuery, [...params, limit, offset])

        // Subject breakdown counts for UI tabs
        const subjectStatsQuery = `
          SELECT subject, COUNT(*)::int AS cnt 
          FROM pyq_questions 
          GROUP BY subject
        `
        const subjectStats = await query(subjectStatsQuery)
        const subjectCounts = { All: 0 }
        subjectStats.forEach((r) => {
          subjectCounts[r.subject] = r.cnt
          subjectCounts.All += r.cnt
        })

        return ok({
          questions: rows,
          total,
          pageCount: Math.ceil(total / limit),
          offset,
          limit,
          hasMore: offset + limit < total,
          subjectCounts,
          source: 'postgresql',
        })
      } catch (err) {
        console.error('[pyq api] Postgres query error, falling back to seed:', err.message)
      }
    }

    // Graceful fallback to in-memory seed if DB is unreachable
    if (id) {
      const single = pyqSeedData.find((item) => item.id === parseInt(id, 10))
      return ok(single || null, single ? null : 'Question not found')
    }

    const fallbackData = searchMemoryFallback(q, subject, exam, year, limit, offset)
    return ok(fallbackData)
  } catch (err) {
    console.error('[pyq api] Unexpected error:', err)
    return serverError('Failed to fetch PYQ data: ' + err.message)
  }
}
