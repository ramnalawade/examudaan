const fs = require('fs');

async function checkRouting() {
  const jsRes = await fetch('https://mpsc.gov.in/static/js/main.137462b8.chunk.js', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const t = await jsRes.text();
  
  // Look for history.push or Link or path or navigate around PREVIOUS_QUESTION_PAPERS
  const idx = t.indexOf('PREVIOUS_QUESTION_PAPERS');
  console.log(t.substring(idx - 1000, idx + 1000));
}

checkRouting();
