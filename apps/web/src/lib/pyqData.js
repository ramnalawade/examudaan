// ============================================================
// lib/pyqData.js — 15-Year Solved PYQ Question Bank (220 Questions)
// Compatibility export pointing to unified seed
// Note: Client pages now query PostgreSQL / API route /api/pyq directly!
// ============================================================

import pyqSeed from './pyqSeed.json'

export const PYQ_DATABASE = pyqSeed
export default pyqSeed
