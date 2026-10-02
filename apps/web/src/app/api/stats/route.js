// ============================================================
// app/api/stats/route.js — Site statistics (public API)
// ExamUdaan | Single source of truth from lib/platformStats.js
// ============================================================

import { ok } from '../../../lib/apiResponse'
import { getPlatformStats } from '../../../lib/platformStats'

export const revalidate = 300 // ISR cache 5 minutes

export async function GET() {
  const stats = await getPlatformStats()
  return ok(stats)
}
