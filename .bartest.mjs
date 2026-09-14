import { chromium } from 'playwright';
const b = await chromium.launch();
let bad = 0;
for (const w of [1440, 1100, 900, 390]) {
  const page = await b.newPage({ viewport: { width: w, height: 900 } });
  await page.goto('http://localhost:8211/meta-ads-agency-india/', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const res = await page.evaluate(() => {
    const two = document.querySelector('.ma-two');
    const cols = getComputedStyle(two).gridTemplateColumns.split(' ').length;
    return {
      cols,
      cards: [...document.querySelectorAll('.ma-split')].map((c) => ({
        stage: c.querySelector('.ma-split__stage').textContent.trim(),
        top: Math.round(c.getBoundingClientRect().top),
        left: Math.round(c.getBoundingClientRect().left),
        segs: [...c.querySelectorAll('.ma-split__seg')].map((s) => ({
          want: +s.dataset.w,
          got: s.getBoundingClientRect().width,
        })),
        keys: [...c.querySelectorAll('.ma-split__key li')].map((l) => l.textContent.trim()),
      })),
      proseRight: Math.round(document.querySelector('.ma-two > div').getBoundingClientRect().right),
      railLeft: Math.round(document.querySelector('.ma-splits').getBoundingClientRect().left),
    };
  });
  console.log(`\n${w}px  .ma-two columns=${res.cols}  prose ends ${res.proseRight}, rail starts ${res.railLeft}`);
  for (const c of res.cards) {
    const total = c.segs.reduce((a, s) => a + s.got, 0);
    const pcts = c.segs.map((s) => Math.round((s.got / total) * 100));
    const wants = c.segs.map((s) => s.want);
    const ok = pcts.every((p, i) => Math.abs(p - wants[i]) <= 2);
    if (!ok) bad++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${c.stage.padEnd(18)} rendered ${pcts.join('/')}  wanted ${wants.join('/')}`);
    console.log(`         labels: ${c.keys.join(' | ')}`);
  }
  await page.close();
}
await b.close();
console.log(bad ? `\n${bad} FAILING` : '\nall bars match their stated ratios');
process.exit(bad ? 1 : 0);
