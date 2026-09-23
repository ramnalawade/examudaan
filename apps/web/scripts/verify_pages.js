const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0' };

async function verify() {
  const r = await fetch('http://localhost:3000/', { headers });
  const html = await r.text();

  console.log('Homepage status:', r.status);
  console.log('Primary Nav Links:');
  console.log('- /jobs:', html.includes('href="/jobs"'));
  console.log('- /current-affairs:', html.includes('href="/current-affairs"'));
  console.log('- /mock-tests:', html.includes('href="/mock-tests"'));
  console.log('- /pyq:', html.includes('href="/pyq"'));
  console.log('- /daily-quiz:', html.includes('href="/daily-quiz"'));
  console.log('- /syllabus:', html.includes('href="/syllabus"'));

  console.log('\nFeature Cards on Homepage:');
  console.log('- 54 Tools badge:', html.includes('54 Tools'));
  console.log('- Police Calculator card:', html.includes('/police-calculator'));
  console.log('- CBT Mock Tests card:', html.includes('/mock-tests'));
  console.log('- 15-Yr PYQs card:', html.includes('/pyq'));
  console.log('- Key Score Calculator card:', html.includes('/score-calculator'));
  console.log('- Daily Streak Quiz card:', html.includes('/daily-quiz'));
  console.log('- 10-Yr Cutoff Explorer card:', html.includes('/cutoffs'));
  console.log('- Exam Blog & Guides card:', html.includes('/blog'));

  console.log('\nBilingual Pages Check:');
  const pc = await (await fetch('http://localhost:3000/police-calculator', { headers })).text();
  console.log('- /police-calculator renders 150 marks content:', pc.includes('१५०') || pc.includes('150'));

  const at = await (await fetch('http://localhost:3000/ai-tools', { headers })).text();
  console.log('- /ai-tools renders 54 tools:', at.includes('54') || at.includes('५४'));

  const aa = await (await fetch('http://localhost:3000/ai-academy', { headers })).text();
  console.log('- /ai-academy renders courses:', aa.includes('track1') || aa.includes('ChatGPT'));

  const yt = await (await fetch('http://localhost:3000/youtube', { headers })).text();
  console.log('- /youtube renders channels:', yt.includes('YouTube') && yt.includes('Learning Hub'));
}

verify();
