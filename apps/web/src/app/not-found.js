import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Page Not Found</h2>
      <p className="notfound-text">
        Sorry, we couldn&apos;t find the page you were looking for. It might have been removed or doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  )
}
