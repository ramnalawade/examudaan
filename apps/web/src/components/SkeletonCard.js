// ============================================================
// components/SkeletonCard.js — Loading placeholder for JobCard
// ExamUdaan | Uses shimmer animation from globals.css
// ============================================================


export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      {/* Top row */}
      <div className="skeleton-row">
        <div className={`skeleton skeleton-chip`} />
        <div className={`skeleton skeleton-boardName`} />
      </div>

      {/* Title */}
      <div className={`skeleton skeleton-title`} />
      <div className={`skeleton skeleton-titleShort`} />

      {/* Chips */}
      <div className="skeleton-chips">
        <div className={`skeleton skeleton-infoChip`} />
        <div className={`skeleton skeleton-infoChip`} />
        <div className={`skeleton skeleton-infoChip`} />
      </div>

      {/* Divider */}
      <div className="skeleton-divider" />

      {/* Bottom */}
      <div className="skeleton-row">
        <div className={`skeleton skeleton-date`} />
        <div className={`skeleton skeleton-link`} />
      </div>
    </div>
  )
}
