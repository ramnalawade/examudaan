'use client'
// ============================================================
// app/error.js — Global Error Boundary
// ExamUdaan.in
// ============================================================

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error)
  }, [error])

  return (
    <div className="container error-container">
      <h1 className="error-title">
        Oops! Something went wrong
      </h1>
      <p className="error-text">
        We encountered an unexpected error while loading this page.
      </p>
      
      <div className="error-actions">
        <button
          onClick={() => reset()}
          className="btn-primary"
        >
          Try Again
        </button>
        <Link href="/" className="btn-ghost">
          Go Home
        </Link>
      </div>
    </div>
  )
}
