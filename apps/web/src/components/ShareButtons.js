'use client'

export default function ShareButtons({ title, boardName, vacancies, applicationEnd, slug }) {
  const jobUrl = `https://examudaan.in/jobs/${slug}`;
  
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(jobUrl)
        .then(() => alert('Link copied!'))
        .catch(() => {});
    }
  };

  const text = `📋 ${title}\n` +
    (boardName ? `🏛️ ${boardName}\n` : '') +
    (vacancies ? `📊 ${Number(vacancies).toLocaleString('en-IN')} Posts\n` : '') +
    (applicationEnd ? `⏰ Last Date: ${applicationEnd}\n` : '') +
    `🔗 ${jobUrl}\n\nFind more jobs at ExamUdaan.in 🚀`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <div className="jobdet-shareRow">
      <a
        href={waUrl}
        className="jobdet-shareBtn jobdet-shareBtnWa"
        target="_blank"
        rel="noopener noreferrer"
        id="job-detail-whatsapp-share"
        aria-label="Share on WhatsApp"
      >
        Share on WhatsApp
      </a>
      <button
        className="jobdet-shareBtn jobdet-shareBtnCopy"
        id="job-detail-copy-link"
        aria-label="Copy link"
        onClick={handleCopy}
      >
        Copy Link
      </button>
    </div>
  );
}
