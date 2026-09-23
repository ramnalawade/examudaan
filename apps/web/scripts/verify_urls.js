const { SYLLABUS_EXAMS } = require('../src/lib/syllabusData.js');

async function testAllUrls() {
  console.log('Testing syllabusData URLs...');
  const results = [];
  
  for (const exam of SYLLABUS_EXAMS) {
    if (exam.officialWebsite) {
      results.push({ exam: exam.slug, field: 'officialWebsite', url: exam.officialWebsite });
    }
    if (exam.notificationUrl) {
      results.push({ exam: exam.slug, field: 'notificationUrl', url: exam.notificationUrl });
    }
    if (exam.pyqLinks) {
      for (const p of exam.pyqLinks) {
        if (p.paperUrl) results.push({ exam: exam.slug, field: `pyq-paper-${p.year}`, url: p.paperUrl });
        if (p.answerKeyUrl) results.push({ exam: exam.slug, field: `pyq-key-${p.year}`, url: p.answerKeyUrl });
      }
    }
  }

  console.log(`Found ${results.length} URLs to verify.`);

  for (const item of results) {
    try {
      const res = await fetch(item.url, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(6000)
      });
      const text = await res.text();
      const is404 = res.status === 404 || text.includes('404 Not Found') || text.includes('Page Not Found') || (text.includes('404') && text.length < 1500);
      if (res.status >= 400 || is404) {
        console.log(`❌ FAIL [${res.status}] ${item.exam} (${item.field}): ${item.url} (is404=${is404})`);
      } else {
        console.log(`✅ OK [${res.status}] ${item.exam} (${item.field}): ${item.url}`);
      }
    } catch (err) {
      console.log(`⚠️ TIMEOUT/ERR ${item.exam} (${item.field}): ${item.url} -> ${err.message}`);
    }
  }
}

testAllUrls();
