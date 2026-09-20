'use client'

import { SITE_CONFIG } from '../lib/constants'

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
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(text)}`;
  const channelUrl = SITE_CONFIG?.social?.whatsappChannel || 'https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div className="jobdet-shareRow" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
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
        <a
          href={tgUrl}
          className="jobdet-shareBtn"
          target="_blank"
          rel="noopener noreferrer"
          id="job-detail-telegram-share"
          aria-label="Share on Telegram"
          style={{
            background: '#0284c7',
            color: '#fff',
            textDecoration: 'none',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Share on Telegram
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

      {/* Official Channel Follow CTA */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        fontSize: 12,
      }}>
        <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
          🔔 Get instant notifications for all government exams on WhatsApp:
        </span>
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#22c55e',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Follow Channel
        </a>
      </div>
    </div>
  );
}
