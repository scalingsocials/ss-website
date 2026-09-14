import { chromium } from 'playwright';
const OUT=process.argv[2], BASE='http://localhost:8211';
const b=await chromium.launch();
for (const s of process.argv[3].split(',').map(x=>{const[p,w,h,n,sel]=x.split('|');return{p,w:+w,h:+h,n,sel};})) {
  const page=await b.newPage({viewport:{width:s.w,height:s.h}});
  await page.goto(BASE+"/"+s.p,{waitUntil:'load'}); await page.waitForTimeout(900);
  if (s.sel) await page.evaluate((q)=>{document.documentElement.style.scrollBehavior='auto';
    const e=document.querySelector(q); if(e) window.scrollTo(0,e.getBoundingClientRect().top+scrollY-120);}, s.sel);
  await page.waitForTimeout(500);
  await page.screenshot({path:`${OUT}/${s.n}.png`}); console.log(s.n); await page.close();
}
await b.close();
