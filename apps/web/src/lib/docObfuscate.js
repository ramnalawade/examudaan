// ============================================================
// lib/docObfuscate.js — Document ID Cryptographic Obfuscation
// ExamUdaan.in | Prevents sequential crawling and enumeration of PDFs
//
// Converts numeric IDs (e.g. 14404) into encrypted URL-safe tokens (e.g. doc_79b41ed7_c15d0f9109_6a0343b0)
// Uses keystream XOR cipher + SHA-256 integrity signature (jssha).
// Works universally across Node.js server, Next.js Edge, and browser clients.
// ============================================================

import jsSHA from 'jssha'
import { DEFAULT_HASH_KEY } from './hashVerify.js'

function sha256Hex(str) {
  try {
    const sha = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' })
    sha.update(str)
    return sha.getHash('HEX')
  } catch (err) {
    console.error('[docObfuscate] Hashing error:', err)
    return ''
  }
}

/**
 * Obfuscate a numeric document ID into a secure URL-safe token.
 * Output format: doc_<salt>_<encHex>_<sig>
 * Example: 14404 -> doc_79b41ed7_c15d0f9109_6a0343b0
 */
export function obfuscateDocId(id, secretKey = null) {
  if (id === null || id === undefined) return ''
  const numId = parseInt(id, 10)
  if (isNaN(numId) || numId <= 0) return String(id)

  const secret = secretKey || process.env.HASH_KEY || process.env.NEXT_PUBLIC_HASH_KEY || DEFAULT_HASH_KEY
  const strId = String(numId)
  const salt = sha256Hex(strId + secret).slice(0, 8)
  const keystream = sha256Hex(salt + secret)

  let encHex = ''
  for (let i = 0; i < strId.length; i++) {
    const charCode = strId.charCodeAt(i)
    const keyByte = parseInt(keystream.slice((i * 2) % 64, ((i * 2) % 64) + 2), 16)
    const xor = charCode ^ keyByte
    encHex += xor.toString(16).padStart(2, '0')
  }

  const sig = sha256Hex(`${salt}:${encHex}:${secret}`).slice(0, 8)
  return `doc_${salt}_${encHex}_${sig}`
}

/**
 * Deobfuscate an obfuscated document token back into its numeric ID.
 * Returns the numeric integer ID, or null if tampered/invalid.
 */
export function deobfuscateDocId(tokenStr, secretKey = null, allowLegacyNumeric = false) {
  if (!tokenStr || typeof tokenStr !== 'string') return null
  const str = tokenStr.trim()

  // 1. Obfuscated token check
  if (str.startsWith('doc_')) {
    const parts = str.slice(4).split('_')
    if (parts.length !== 3) return null
    const [salt, encHex, sig] = parts
    const secret = secretKey || process.env.HASH_KEY || process.env.NEXT_PUBLIC_HASH_KEY || DEFAULT_HASH_KEY
    const expectedSig = sha256Hex(`${salt}:${encHex}:${secret}`).slice(0, 8)

    // Integrity signature verification
    if (sig.toLowerCase() !== expectedSig.toLowerCase()) return null

    try {
      const keystream = sha256Hex(salt + secret)
      let dec = ''
      for (let i = 0; i < encHex.length; i += 2) {
        const xor = parseInt(encHex.slice(i, i + 2), 16)
        const idx = i / 2
        const keyByte = parseInt(keystream.slice((idx * 2) % 64, ((idx * 2) % 64) + 2), 16)
        dec += String.fromCharCode(xor ^ keyByte)
      }
      const num = parseInt(dec, 10)
      return !isNaN(num) && num > 0 ? num : null
    } catch {
      return null
    }
  }

  // 2. Fallback for legacy numeric IDs if explicitly allowed
  if (allowLegacyNumeric) {
    const num = parseInt(str, 10)
    return !isNaN(num) && num > 0 ? num : null
  }

  return null
}

/**
 * Convert any PDF URL or ID to a secure obfuscated PDF URL.
 * e.g. "/api/mpsc-pdf/14404" -> "/api/mpsc-pdf/doc_79b41ed7_..."
 */
export function toSecureDocUrl(pathOrId, secretKey = null) {
  if (!pathOrId) return ''
  const str = String(pathOrId).trim()

  const match = str.match(/\/api\/mpsc-pdf\/(\d+)$/)
  if (match) {
    const num = parseInt(match[1], 10)
    return `/api/mpsc-pdf/${obfuscateDocId(num, secretKey)}`
  }

  const num = parseInt(str, 10)
  if (!isNaN(num) && String(num) === str) {
    return `/api/mpsc-pdf/${obfuscateDocId(num, secretKey)}`
  }

  return str
}
